import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useLocalWalletBundlr } from 'hooks/useLocalWalletBundlr'
import { useMetaplex } from 'hooks/useMetaplex'
import { toMetaplexFile } from '@metaplex-foundation/js'

// images and icons
import DAOLogoMobile from 'assets/icons/dao-logo-small-mobile.svg?component'
import SolIcon from 'assets/icons/solana-logo-dark-big.svg?component'
import SolMobileIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import NotificationIcon from 'assets/icons/notification-icon-body.svg?component'

// styles
import styles from './index.module.scss'

import axios from 'axios'
import { useViewport, fetchSolToUsdRate, ensureMaxDecimals } from 'utils'
import StatsSearchBox from 'components/Input/StatsSearchBox'
import TableSection from './TableSection'
import ExplorePagination from 'components/Button/ExplorePagination'
import DaoSubmitModal from 'components/Modal/DaoSubmitModal'
import ProgressingModal from 'components/Modal/ProgressingModal'
import Alert from 'components/Alert'
import { trySendTransaction } from 'utils'
import { isExpiredDate } from 'utils/helpers'
import {
  type DaoProposal,
  createNewProposalTransaction,
  DAO_TREASURY_ADDRESS,
  TURKEY_CIRCUS_COLLECTION_ID,
  getCurrentTurkeyNftCount,
} from 'utils/dao'
import { type GetMyNFTsOutput, getMyNFTs } from 'utils/nfts.utils'

const DaoLandingPage = props => {
  const { onDetail, setTurkeyData } = props
  const viewport = useViewport()
  const dispatch = useDispatch()
  const { connected, publicKey, signTransaction } = useWallet()
  const { storage, ensureLocalWalletBalance } = useLocalWalletBundlr()
  const { metaplex } = useMetaplex()
  const { setVisible } = useWalletModal()

  const [searchWord, setSearchWord] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [liveCount, setLiveCount] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)
  const [closedCount, setClosedCount] = useState(0)
  const [rowCount, setRowCount] = useState(10)
  const [showDaoSubmitModal, setShowDaoSubmitModal] = useState(false)
  const [clickedSubmitButton, setClickedSubmitButton] = useState(false)

  const [solAmount, setSolAmount] = useState(0)
  const [solToUsdRate, setSolToUsdRate] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [noTurkeyAlert, setNoTurkeyAlert] = useState<any[]>([])

  const [showAlert, setShowAlert] = useState(false)
  const [showNoTurkeyAlert, setShowNoTurkeyAlert] = useState(false)
  const [proposals, setProposals] = useState([])
  const [proposalKeypair, setProposalKeypair] = useState<Keypair>(Keypair.generate())

  const [nfts, setNfts] = useState<GetMyNFTsOutput>([])
  useEffect(() => {
    if (connected) getMyNFTs(metaplex).then(setNfts)
  }, [metaplex, connected])

  const [turkyNfts, setTurkeyNfts] = useState<GetMyNFTsOutput>([])
  useEffect(() => {
    setTurkeyNfts(
      nfts.filter(({ collection }) => collection?.verified && TURKEY_CIRCUS_COLLECTION_ID.equals(collection.address))
    )
  }, [nfts])

  useEffect(() => {
    setTurkeyData(turkyNfts)
  }, [turkyNfts])

  useEffect(() => {
    fetchSolToUsdRate().then(setSolToUsdRate)
    metaplex.connection.getBalance(DAO_TREASURY_ADDRESS).then(lamports => setSolAmount(lamports / LAMPORTS_PER_SOL))

    setNoTurkeyAlert([
      {
        id: 0,
        title: 'CircusDAO Membership Not Detected',
        description: `The wallet you've connected with does not hold a Turkey Circus NFT`,
        type: 'error',
      },
    ])

    getProposals(currentPage, rowCount)

    getStats()
  }, [])

  const selectRowCount = count => {
    setRowCount(count)
  }

  const handleNextPage = () => {
    const nextPage = currentPage + 1
    getProposals(nextPage, rowCount)
  }

  const handlePreviousPage = () => {
    if (currentPage === 0) return
    const prevPage = currentPage - 1
    getProposals(prevPage, rowCount)
  }

  const onClickSubmitBtn = async () => {
    if (!connected) {
      setClickedSubmitButton(true)
      setVisible(true)
      return
    }

    if (turkyNfts.length === 0)  {
      setShowNoTurkeyAlert(true)
      return;
    }
    setShowDaoSubmitModal(true)
  }

  const handleSubmitProposal = async proposal => {
    setIsLoading(true)
    try {
      // TODO: calculate json size
      // for now, just fund with 0.001 sol which approximately 3MB
      await ensureLocalWalletBalance(0.001 * 1e9)

      let voteDurationMs = proposal.vote_duration * 60 * 60 * 1000
      let voteEnd = new Date(proposal.vote_start.getTime() + voteDurationMs)
      let daoProposal: DaoProposal = {
        proposalKey: proposalKeypair.publicKey.toBase58(),
        proposer: publicKey.toBase58(),
        category: proposal.category,
        title: proposal.title,
        overview: proposal.overview,
        metrics: proposal.metrics,
        treasurySpendAmount: `${proposal.treasury} SOL`,
        timeline: proposal.eta_timeline,
        voteStart: proposal.vote_start.toISOString(),
        voteEnd: voteEnd.toISOString(),
      }

      let daoMetaplexFile = toMetaplexFile(JSON.stringify(daoProposal, null, 4), 'proposal.json')
      const url = await storage.upload(daoMetaplexFile)

      let tx = createNewProposalTransaction({
        proposalKey: proposalKeypair.publicKey,
        proposer: publicKey,
        title: daoProposal.title,
        url,
      })
      tx.feePayer = publicKey

      // TODO: add error handling
      let signature: null | string = await trySendTransaction(metaplex.connection, tx, async tx => {
        tx.partialSign(proposalKeypair)
        return signTransaction(tx)
      })
      if (!signature) throw new Error(`could not submit proposal to chain`)

      await axios.post('api/dao/submit', {
        signature,
        ...proposal,
        url,
        secretKey: Buffer.from(proposalKeypair.secretKey).toString('hex'),
      })

      setProposalKeypair(Keypair.generate())

      setAlertData([
        {
          id: 0,
          title: 'Proposal Submitted',
          description: `${proposal.title} has successfully been submitted for community voting.`,
          type: 'success',
        },
      ])

      getProposals(currentPage, rowCount)

      setTimeout(() => {
        setIsLoading(false)
        setTimeout(() => {
          setShowAlert(true)
        }, 1000)
      }, 1000)
    } catch (e: any) {
      console.error(e)
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }

  const getStats = async () => {
    try {
      let response = await axios.get('api/dao/stats')
      if (response.data.success === true) {
        let stats = response.data.stats
        setTotalCount(stats.total_count)
        setLiveCount(stats.live_count)
        setPendingCount(stats.pending_count)
        setClosedCount(stats.closed_count)
      }
    } catch {}
  }

  const getThreshold = async () => {
    return Math.trunc(await getCurrentTurkeyNftCount() * 0.6);
  }
  
  const getProposals = async (curPage, count) => {
    try {
      let response = await axios.post('api/dao/proposals', { page: curPage, rows: count })
      if (response.data.success === true) {
        let proposals = response.data.proposals
        if (proposals.length > 0) {
          setCurrentPage(curPage)
        } else {
          return
        }
        let new_proposals = []
        proposals.forEach(element => {
          if (isExpiredDate(element.vote_start, element.vote_duration)) {
            let current_threshold = getThreshold()
            let vote_ratio = element.approved_votes / element.total_votes 
            new_proposals.push({ ...element, status: 'closed', vote_result: vote_ratio >= 0.7 && element.total_votes >= current_threshold ? 'Passed' : 'Rejected'})
          } else if (isExpiredDate(element.vote_start, 0)) {
            new_proposals.push({ ...element, status: 'live' })
          } else {
            new_proposals.push({ ...element, status: 'pending' })
          }
        })
        setProposals(new_proposals)
      }
    } catch {}
  }

  return (
    <div className={styles.container}>
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div>
          <div className="w-full flex justify-between">
            <DAOLogoMobile />
            <div className="flex gap-[25px]">
              <div>
                <div className={styles.statsTitle}>All</div>
                <div className={styles.statsValue}>{totalCount}</div>
              </div>
              <div className={styles.divider}></div>
              <div>
                <div className={styles.statsTitle}>Live</div>
                <div className={styles.statsValue}>{liveCount}</div>
              </div>
              <div className={styles.divider}></div>
              <div>
                <div className={styles.statsTitle}>Pending</div>
                <div className={styles.statsValue}>{pendingCount}</div>
              </div>
              <div className={styles.divider}></div>
              <div>
                <div className={styles.statsTitle}>Closed</div>
                <div className={styles.statsValue}>{closedCount}</div>
              </div>
            </div>
          </div>
          <div className={styles.landingTitle}>
            CircusDAO is the governance wing of Foster Marketplace composed of verified Turkey Circus holders. Circus
            DAO members can vote on proposals.
            <br />A minimum of&nbsp;<span className={styles.landingTitleBold}>10 Turkeys</span>
            &nbsp;is required to submit proposals.
          </div>
          <div className={styles.treasuryContainer}>
            <div>
              <div className={styles.treasuryLabel}>Treasury</div>
              <div className="flex gap-[40px]">
                <div className="flex gap-[15px] items-center">
                  <SolIcon />
                  <div className={styles.treasuryTitle}>{ensureMaxDecimals(solAmount, 3)}</div>
                </div>
                <div className={styles.treasuryDivider}></div>
                <div className="flex items-center">
                  <div className={styles.treasuryTitle}>${ensureMaxDecimals(solToUsdRate * solAmount, 2)}</div>
                </div>
              </div>
            </div>
            <div className="max-w-[500px] flex gap-[45px] items-center">
              <div className={styles.treasuryDivider}></div>
              <div className={styles.treasuryDescription}>
                This treasury exists for Circus DAO participants to allocate resources for the long-term growth and
                prosperity of Foster Marketplace.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-center">
            <DAOLogoMobile />
          </div>
          <div className={styles.landingTitle}>
            CircusDAO is the governance wing of Foster Marketplace composed of verified Turkey Circus holders. Circus
            DAO members can vote on proposals. A minimum of&nbsp;
            <span className={styles.landingTitleBold}>10 Turkeys</span>
            &nbsp;is required to submit proposals.
          </div>

          <div className="w-full flex flex-wrap gap-[5px] mt-[22px]">
            <div className="w-full flex gap-[5px]">
              <div className={styles.statsBG}>
                <div className={styles.statsValue}>{totalCount}</div>
                <div className={styles.statsTitle}>ALL</div>
              </div>
              <div className={styles.statsBG}>
                <div className={styles.statsValue}>{liveCount}</div>
                <div className={styles.statsTitle}>LIVE</div>
              </div>
            </div>
            <div className="w-full flex gap-[5px]">
              <div className={styles.statsBG}>
                <div className={styles.statsValue}>{pendingCount}</div>
                <div className={styles.statsTitle}>PENDING</div>
              </div>
              <div className={styles.statsBG}>
                <div className={styles.statsValue}>{closedCount}</div>
                <div className={styles.statsTitle}>CLOSED</div>
              </div>
            </div>
          </div>

          <div className={styles.treasuryContainer}>
            <div className={styles.treasuryLabel}>Treasury</div>
            <div className="flex gap-[10px] mt-[10px]">
              <div className="flex gap-[10px] items-center">
                <SolMobileIcon />
                <div className={styles.treasuryTitle}>{ensureMaxDecimals(solAmount, 3)}</div>
              </div>
              <div className={styles.treasuryDivider}></div>
              <div className="flex items-center">
                <div className={styles.treasuryTitle}>${ensureMaxDecimals(solToUsdRate * solAmount, 2)}</div>
              </div>
            </div>
            <div className={styles.treasuryDescription}>
              This treasury exists for Circus DAO participants to allocate resources for the long-term growth and
              prosperity of Foster Marketplace.
            </div>
          </div>
        </div>
      )}
      <div className="w-full hidden lg:mt-[77px] lg:flex justify-between">
        <StatsSearchBox
          value={searchWord}
          placeholder="Search by proposal name"
          onChange={value => setSearchWord(value)}
        />
        <div className={styles.submitProposal} onClick={() => onClickSubmitBtn()}>
          <NotificationIcon />
          <div className={styles.submitText}>Submit Proposal</div>
        </div>
      </div>

      <div className="w-full mt-[30px] lg:hidden justify-between">
        <div className="w-full flex justify-end mb-[15px]">
          <div className={styles.submitProposal} onClick={() => onClickSubmitBtn()}>
            <div className={styles.submitText}>Submit Proposal</div>
          </div>
        </div>
        <StatsSearchBox
          value={searchWord}
          placeholder="Search by proposal name"
          onChange={value => setSearchWord(value)}
        />
      </div>

      <div className="mt-[20px]">
        <TableSection data={proposals} onDetail={onDetail} />
      </div>
      <div className="w-full flex justify-end">
        <ExplorePagination
          currentPage={currentPage}
          totalCount={totalCount}
          rowCount={rowCount}
          setRowCount={count => {
            selectRowCount(count)
          }}
          handleNext={handleNextPage}
          handlePrev={handlePreviousPage}
        />
      </div>
      <DaoSubmitModal
        data={{}}
        open={showDaoSubmitModal}
        onSubmit={proposal => {
          setShowDaoSubmitModal(false)
          setTimeout(() => {
            handleSubmitProposal(proposal)
          }, 1000)
        }}
        onClose={() => setShowDaoSubmitModal(false)}
      />

      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />

      <Alert
        open={showNoTurkeyAlert}
        close={() => {
          setShowNoTurkeyAlert(false)
        }}
        data={noTurkeyAlert}
      />

      <ProgressingModal open={isLoading} />
    </div>
  )
}

export default DaoLandingPage

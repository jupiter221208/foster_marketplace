import React, { useEffect, useState } from 'react'

import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useConnection } from '@solana/wallet-adapter-react'

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

const DAO_TREASURY_ADDRESS = new PublicKey('8urUAT6cdM8JL295vJvngWBcpXBybrs7rrpSa7vGoo5f')

const DaoLandingPage = props => {
  const { onDetail } = props
  const viewport = useViewport()
  const { connection } = useConnection()
  const [searchWord, setSearchWord] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [rowCount, setRowCount] = useState(10)
  const [showDaoSubmitModal, setShowDaoSubmitModal] = useState(false)

  const [solAmount, setSolAmount] = useState(0)
  const [solToUsdRate, setSolToUsdRate] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [proposals, setProposals] = useState([])

  useEffect(() => {
    fetchSolToUsdRate().then(setSolToUsdRate)
    connection.getBalance(DAO_TREASURY_ADDRESS).then(lamports => setSolAmount(lamports / LAMPORTS_PER_SOL))

    getProposals()

    const proposalName = 'TEST'
    setAlertData([
      {
        id: 0,
        title: 'Proposal Submitted',
        description: `${proposalName} has successfully been submitted for review.`,
        type: 'success',
      },
    ])
  }, [])

  const selectRowCount = count => {
    setRowCount(count)
  }

  const handleNextPage = () => {
    if (totalCount < (currentPage + 1) * rowCount) return
    const nextPage = currentPage + 1
  }

  const handlePreviousPage = () => {
    if (currentPage === 0) return
    const prevPage = currentPage - 1
  }

  const handleSubmitProposal = async proposal => {
    setIsLoading(true)
    try {
      let response = await axios.post('api/dao/submit', proposal)
      console.log('==========response=========', response)
      setTimeout(() => {
        setIsLoading(false)
        setTimeout(() => {
          setShowAlert(true)
        }, 1000)
      }, 1000)
    } catch {
      setTimeout(() => {
        setIsLoading(false)
        setTimeout(() => {
          setShowAlert(true)
        }, 1000)
      }, 1000)
    }
  }

  const getProposals = async () => {
    setIsLoading(true)

    try {
      let response = await axios.get('api/dao/proposals')
      console.log('=========response=========', response)
      if (response.data.success === true) setProposals(response.data.proposals)

      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    } catch {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
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
                <div className={styles.statsValue}>64</div>
              </div>
              <div className={styles.divider}></div>
              <div>
                <div className={styles.statsTitle}>Live</div>
                <div className={styles.statsValue}>64</div>
              </div>
              <div className={styles.divider}></div>
              <div>
                <div className={styles.statsTitle}>Pending</div>
                <div className={styles.statsValue}>64</div>
              </div>
              <div className={styles.divider}></div>
              <div>
                <div className={styles.statsTitle}>Closed</div>
                <div className={styles.statsValue}>64</div>
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
                <div className={styles.statsValue}>25</div>
                <div className={styles.statsTitle}>ALL</div>
              </div>
              <div className={styles.statsBG}>
                <div className={styles.statsValue}>50</div>
                <div className={styles.statsTitle}>LIVE</div>
              </div>
            </div>
            <div className="w-full flex gap-[5px]">
              <div className={styles.statsBG}>
                <div className={styles.statsValue}>13</div>
                <div className={styles.statsTitle}>PENDING</div>
              </div>
              <div className={styles.statsBG}>
                <div className={styles.statsValue}>10</div>
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
        <div className={styles.submitProposal} onClick={() => setShowDaoSubmitModal(true)}>
          <NotificationIcon />
          <div className={styles.submitText}>Submit Proposal</div>
        </div>
      </div>

      <div className="w-full mt-[30px] lg:hidden justify-between">
        <div className="w-full flex justify-end mb-[15px]">
          <div className={styles.submitProposal} onClick={() => setShowDaoSubmitModal(true)}>
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

      <ProgressingModal open={isLoading} />
    </div>
  )
}

export default DaoLandingPage

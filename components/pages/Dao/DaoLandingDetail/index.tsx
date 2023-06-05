import React, { useEffect, useState } from 'react'

import { LinearProgress, makeStyles } from '@material-ui/core'

import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useMetaplex } from 'hooks/useMetaplex'

// third party
import Tab01 from 'components/Tab/Tab01'
import Alert from 'components/Alert'
import ProgressingModal from 'components/Modal/ProgressingModal'
import DaoPendingButton from 'components/Table/Dao/LandingTable/DaoPendingButton'
import DaoClosedButton from 'components/Table/Dao/LandingTable/DaoClosedButton'
import DaoLiveButton from 'components/Table/Dao/LandingTable/DaoLiveButton'

// images and icons
import SolIcon from 'assets/icons/solana-logo-dark-medium.svg?component'
import SolMobileIcon from 'assets/icons/solana-logo-dark-small.svg?component'
import NotificationIcon from 'assets/icons/notification-icon-black.svg'
import NotificationMobileIcon from 'assets/icons/notification-icon-black-mobile.svg'
import ArrowLeftIcon from 'assets/icons/arrow-left-medium.svg?component'
import ArrowLeftMobileIcon from 'assets/icons/arrow-left-medium-mobile.svg?component'
import CopyAltLightGreenIcon from 'assets/icons/copy-alt-dark.svg?component'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import styled from 'styled-components'
import CastVoteModal from 'components/Modal/CastVoteModal'
import { trySendTransaction } from 'utils'
import { getShortAddress } from 'utils/wallet.util'
import { getDateLabel, getTimeLabel } from 'utils/helpers'
import { createVoteTransaction, getCurrentTurkeyNftCount } from 'utils/dao'
import { copyClipboardAlert, copyToClipboard } from 'utils/helpers'
import CopyClipboardChip from 'components/Chip/CopyClipboardChip'

// json
import TabList from 'assets/json/dao/tab-list.json'

// apis
import axios from 'axios'
import TableSection from './TableSection'
import StatsSearchBox from 'components/Input/StatsSearchBox'
import ProgressingModalWithContent from 'components/Modal/ProgressingModalWithContent'

const BorderLinearProgress = styled(LinearProgress)``
const useStyles = makeStyles({
  root: {
    height: '8px',
    '&.MuiLinearProgress-colorPrimary:not(.MuiLinearProgress-buffer)': {
      backgroundColor: 'var(--stats-search-bg)',
    },
    '& .MuiLinearProgress-barColorPrimary': {
      backgroundColor: 'var(--main-icon-color)',
    },
  },
})

const DaoLandingDetail = props => {
  const { proposal, onBack, turkyNfts, nftIsLoaded } = props
  const { connected, publicKey, signTransaction } = useWallet()
  const { metaplex } = useMetaplex()
  const { setVisible } = useWalletModal()

  const [isLoading, setIsLoading] = useState(false)
  const [isNftLoading, setIsNftLoading] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [proposalDetail, setProposalDetail] = useState(proposal)
  const [clickedCastVote, setClickedCastVote] = useState(false)
  const [disabledVote, setDisabledVote] = useState(true)
  const [showNoTurkeyAlert, setShowNoTurkeyAlert] = useState(false)
  const [noTurkeyAlert, setNoTurkeyAlert] = useState<any[]>([])
  const [tabList, setTabList] = useState<any>(TabList)
  const [activeTab, setActiveTab] = useState<any>(0)
  const [searchWord, setSearchWord] = useState('')
  const [voteHistory, setVoteHistory] = useState([])
  const [approvedRatio, setApprovedRatio] = useState('0')
  const [opposedRatio, setOpposedRatio] = useState('0')
  const [threshold, setThreshold] = useState(0)

  const classes = useStyles()
  const [showCastVoteModal, setShowCastVoteModal] = useState(false)

  const getEndDate = () => {
    var endDate = new Date(proposalDetail.vote_start)
    endDate.setHours(endDate.getHours() + proposalDetail.vote_duration)
    return endDate
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
    })
    setAlertData([
      {
        id: 0,
        title: 'Casted Vote',
        description: `You've successfully casted your vote for ${proposal.title}`,
        type: 'success',
      },
    ])
    if (proposal.status === 'live') {
      setDisabledVote(false)
    }

    setNoTurkeyAlert([
      {
        id: 0,
        title: 'CircusDAO Membership Not Detected',
        description: `The wallet you've connected with does not hold a Turkey Circus NFT`,
        type: 'error',
      },
    ])

    handleSelectedTab(0)

    getVoteHistory()
    ;(async () => {
      let threshold = await getCurrentTurkeyNftCount()
      setThreshold(Math.trunc(threshold * 0.6))
    })()
  }, [])

  useEffect(() => {
    if (nftIsLoaded) {
      setIsNftLoading(false)
    }
  }, [nftIsLoaded])

  useEffect(() => {
    let approveRatio = ((proposalDetail.approved_votes / proposalDetail.total_votes) * 100).toFixed(2)
    let opposedRatio = (100 - parseFloat(approveRatio)).toFixed(2)
    setApprovedRatio(approveRatio)
    setOpposedRatio(opposedRatio)
  }, [proposalDetail])

  const getVoteHistory = async () => {
    try {
      let vote = {
        proposal_id: proposal.id,
      }
      let response = await axios.post('api/dao/vote-history', vote)
      if (response.data.success === true) {
        setVoteHistory(response.data.votes)
      }
    } catch {}
  }

  const onRefreshProposal = async () => {
    try {
      let vote = {
        proposal_id: proposalDetail.id,
      }

      let response = await axios.post('api/dao/proposal-detail', vote)
      if (response.data.success === true) {
        let proposals = response.data.proposals

        if (proposals.length > 0) {
          console.log(proposals[0])
          setProposalDetail(proposals[0])
        }
      }
    } catch {}
  }

  const castVoteProposal = async status => {
    setIsLoading(true)
    try {
      let tx = createVoteTransaction({
        proposalKey: new PublicKey(proposalDetail.proposal_key),
        voter: publicKey,
        vote: status,
      })
      // TODO: add error handling
      let signature: null | string = await trySendTransaction(metaplex.connection, tx, signTransaction)
      if (!signature) throw new Error(`could not submit vote to chain`)

      let response = await axios.post('api/dao/vote', {
        proposal_id: proposalDetail.id,
        wallet_id: publicKey,
        vote_status: status,
        signature,
        weight: turkyNfts.length,
      })
      if (response.data.success === true) {
        onRefreshProposal()
        getVoteHistory()

        setTimeout(() => {
          setIsLoading(false)
          setTimeout(() => {
            setShowAlert(true)
          }, 1000)
        }, 1000)
      } else {
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    } catch {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }

  const onClickCastVoteBtn = async () => {
    if (!connected) {
      setClickedCastVote(true)
      setVisible(true)
      return
    }

    if (nftIsLoaded === false) {
      setIsNftLoading(true)
      return
    }

    if (turkyNfts.length === 0) {
      setShowNoTurkeyAlert(true)
      return
    }

    setShowCastVoteModal(true)
  }

  const handleSelectedTab = tab => {
    let array: any[] = []
    TabList.map(item => {
      let object: any = item
      if (item.id === tab) {
        object.selected = true
      } else {
        object.selected = false
      }
      array.push(object)
    })
    setTabList(array)
    setActiveTab(tab)
  }

  return (
    <div className={styles.container}>
      <div className="w-full h-[65px] lg:h-[47px] mt-[32px] lg:mt-[50px] overflow-auto">
        <Tab01 tabList={tabList} onChange={item => handleSelectedTab(item.id)} />
      </div>

      <div className="flex mt-[20px] lg:mt-[101px] items-center">
        <div className={styles.backBtn} onClick={onBack}>
          <div className={styles.backEllipse}></div>
          <div className="absolute inset-auto hidden lg:flex">
            <ArrowLeftIcon />
          </div>
          <div className="absolute inset-auto flex lg:hidden">
            <ArrowLeftMobileIcon />
          </div>
        </div>
        <div className={styles.backText}>Proposal {proposalDetail.id}</div>
        <div className="hidden lg:flex ml-[20px]">
          {proposalDetail.status === 'pending' ? (
            <DaoPendingButton label="Pending" />
          ) : proposalDetail.status === 'closed' ? (
            proposalDetail.vote_result === 'Passed' ? (
              <DaoLiveButton label="Passed" />
            ) : (
              <DaoClosedButton label="Rejected" />
            )
          ) : (
            <DaoLiveButton
              label={
                proposalDetail.status === 'closed' ? 'Closed' : proposalDetail.status === 'pending' ? 'Pending' : 'Live'
              }
            />
          )}
        </div>
      </div>
      <div className="flex mt-[6px] lg:mt-[25px] justify-between">
        <div className={styles.proposalText}>{proposalDetail.title}</div>
        <div className="hidden lg:flex">
          <GradientButton
            direction="rtl"
            fontSize={18}
            width={155}
            height={53}
            icon={NotificationIcon}
            disabled={disabledVote}
            label="Cast Vote"
            onClick={() => onClickCastVoteBtn()}
          />
        </div>
      </div>
      <div className="hidden lg:flex mt-[6px] lg:mt-[25px]">
        <div className={styles.proposedBy}>Proposed by</div>
        <div className={styles.proposedText}>{proposalDetail.author}</div>
        <div
          className="relative ml-[14px] hidden lg:flex h-[30px] gap-[8px] items-center hover:opacity-80"
          onClick={() => {
            copyToClipboard(proposalDetail.wallet_id || '')
            copyClipboardAlert('main-wallet')
          }}
        >
          <CopyAltLightGreenIcon />
          <div className={styles.clipboardBtn}>{getShortAddress(proposalDetail.wallet_id)}</div>
          <CopyClipboardChip identifier="main-wallet" height={24} fontSize={14} />
        </div>
      </div>

      <div className="flex lg:hidden mt-[6px] justify-between items-center">
        <div className="flex">
          <div className={styles.proposedBy}>Proposed by</div>
          <div className={styles.proposedText}>{proposalDetail.author}</div>
        </div>
        <div>
          <GradientButton
            direction="rtl"
            fontSize={12}
            gradientDirection="right"
            width={101}
            height={35}
            icon={NotificationMobileIcon}
            disabled={disabledVote}
            label="Cast Vote"
            borderRadius={8}
            onClick={() => onClickCastVoteBtn()}
          />
        </div>
      </div>

      <div className="mt-[32px] lg:mt-[60px]">
        <div className="w-full flex justify-between">
          <div className={styles.totalVotes}>Total Votes</div>
          <div className={styles.totalVotes}>({proposalDetail.total_votes}/3200)</div>
        </div>

        <div className="mt-[12px] mb-[12px] lg:mb-[18px] w-full">
          <BorderLinearProgress
            variant="determinate"
            className="rounded-md"
            classes={{
              root: classes.root,
            }}
            value={(proposalDetail.total_votes * 100) / 3200}
          />
        </div>

        <div className="w-full flex justify-between">
          <div>
            <div className={styles.approvedText}>Approved</div>
            <div className={styles.approvedValue}>{proposalDetail.approved_votes}</div>
            <div className={styles.approvedPercent}>
              {proposalDetail.total_votes === 0 ? '0%' : `${approvedRatio} %`}
            </div>
          </div>
          <div>
            <div className={styles.approvedText}>Opposed</div>
            <div className={styles.approvedValue}>{proposalDetail.opposed_votes}</div>
            <div className={styles.approvedPercent}>
              {proposalDetail.total_votes === 0 ? '0%' : `${opposedRatio} %`}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-wrap lg:flex-nowrap justify-around gap-[6px] lg:gap-[60px] xl:gap-[94px] mt-[30px] lg:mt-[48px]">
          <div className={styles.treasuryContainer}>
            <div className={styles.thresholdText}>Threshold</div>
            <div>
              <div className={styles.thresholdCurrent}>Current Threshold</div>
              <div className={styles.thresholdValue}>{threshold} votes</div>
            </div>
          </div>
          <div className={styles.treasuryContainer}>
            <div className={styles.thresholdText}>Ends</div>
            <div>
              <div className={styles.thresholdCurrent}>{getTimeLabel(getEndDate())}</div>
              <div className={styles.thresholdValue}>{getDateLabel(getEndDate())}</div>
            </div>
          </div>
          <div className={styles.treasuryContainer}>
            <div className={styles.thresholdText}>Snapshot</div>
            <div>
              <div className={styles.thresholdCurrent}>Solana Explorer</div>
              <div
                className={styles.viewProposal}
                onClick={() => window.open(`https://explorer.solana.com/tx/${proposalDetail.signature}`)}
              >
                View Proposal
              </div>
            </div>
          </div>
        </div>
      </div>
      {activeTab === 0 ? (
        <div>
          <div className="mt-[44px] lg:mt-[78px]">
            <div className={styles.description}>Overview</div>
            <div className={styles.descriptionText}>{proposalDetail.overview}</div>
          </div>
          <div className="mt-[30px] lg:mt-[50px]">
            <div className={styles.description}>Goals & Metrics</div>
            <div className={styles.descriptionText}>{proposalDetail.metrics}</div>
          </div>
          <div className="mt-[30px] lg:mt-[50px]">
            <div className={styles.description}>Estimated Treasury Spending</div>
            <div className="mt-[15px] lg:mt-[30px] w-full flex items-center gap-[9px]">
              <div className="hidden lg:flex">
                <SolIcon />
              </div>
              <div className="flex lg:hidden">
                <SolMobileIcon />
              </div>
              <div className={styles.estimateValue}>{proposalDetail.treasury}</div>
            </div>
          </div>
          <div className="mt-[30px] mt-[50px]">
            <div className={styles.description}>Estimated Timeline</div>
            <div className={styles.descriptionText}>{proposalDetail.eta_timeline}</div>
          </div>
          <div className="w-full h-[100px] lg:h-[200px]" />
        </div>
      ) : (
        <div>
          <div className="w-full hidden lg:mt-[48px] lg:flex justify-between">
            <StatsSearchBox
              value={searchWord}
              placeholder="Search by proposal name"
              onChange={value => setSearchWord(value)}
            />
          </div>
          <div className="w-full mt-[30px] lg:hidden justify-between">
            <StatsSearchBox
              value={searchWord}
              placeholder="Search by proposal name"
              onChange={value => setSearchWord(value)}
            />
          </div>
          <div className="mt-[20px] mb-[100px]">
            <TableSection data={voteHistory} />
          </div>
        </div>
      )}
      <CastVoteModal
        data={{}}
        open={showCastVoteModal}
        onSubmit={status => {
          setShowCastVoteModal(false)
          setTimeout(() => {
            castVoteProposal(status)
          }, 1000)
        }}
        onClose={() => setShowCastVoteModal(false)}
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

      <ProgressingModalWithContent
        open={isNftLoading}
        close={() => {
          setIsNftLoading(false)
        }}
        title="Wallet detection in progress..."
        tip="Fun Fact"
        content="If you have many NFTs in your wallet, this may take a little longer."
      />
    </div>
  )
}

export default DaoLandingDetail

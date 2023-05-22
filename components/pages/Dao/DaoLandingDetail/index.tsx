import React, { useEffect, useState } from 'react'

import { LinearProgress, makeStyles } from '@material-ui/core'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

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
import { getShortAddress } from 'utils/wallet.util'
import { getDateLabel, getTimeLabel } from 'utils/helpers'

// apis
import axios from 'axios'
import Alert from 'components/Alert'
import ProgressingModal from 'components/Modal/ProgressingModal'

const BorderLinearProgress = styled(LinearProgress)``
const useStyles = makeStyles({
  root: {
    height: '8px',
    '&.MuiLinearProgress-colorPrimary:not(.MuiLinearProgress-buffer)': {
      backgroundColor: '#2b2b2b',
    },
    '& .MuiLinearProgress-barColorPrimary': {
      backgroundColor: '#95dbd5',
    },
  },
})

const DaoLandingDetail = props => {
  const { proposal, onBack } = props
  const { connected, publicKey, signMessage } = useWallet()
  const { setVisible } = useWalletModal()

  const [isLoading, setIsLoading] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [proposalDetail, setProposalDetail] = useState(proposal)
  const [clickedCastVote, setClickedCastVote] = useState(false)

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
        title: 'Proposal Submitted',
        description: `You have successfully votted this proposal.`,
        type: 'success',
      },
    ])
  }, [])

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
      let vote = {
        proposal_id: proposalDetail.id,
        wallet_id: publicKey,
        vote_status: status,
      }
      let response = await axios.post('api/dao/vote', vote)
      if (response.data.success === true) {
        onRefreshProposal()
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
        setTimeout(() => {
          setShowAlert(true)
        }, 1000)
      }, 1000)
    }
  }

  const onClickCastVoteBtn = async () => {
    if (!connected) {
      setClickedCastVote(true)
      setVisible(true)
      return
    }

    setShowCastVoteModal(true)
  }

  useEffect(() => {
    if (clickedCastVote) {
      setShowCastVoteModal(true)
      setClickedCastVote(false)
    }
  }, [connected])

  return (
    <div className={styles.container}>
      <div className="flex mt-[20px] lg:mt-[117px] items-center">
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
        <div className="hidden lg:flex">
          <div className={styles.liveBtn}>Live</div>
        </div>
      </div>
      <div className="flex mt-[6px] lg:mt-[25px] justify-between">
        <div className={styles.proposalText}>{proposalDetail.title}</div>
        <div className="hidden lg:flex">
          {/* {proposalDetail.wallet_id !== publicKey?.toString() && ( */}
          <GradientButton
            direction="rtl"
            fontSize={18}
            width={155}
            height={53}
            icon={NotificationIcon}
            label="Cast Vote"
            onClick={() => onClickCastVoteBtn()}
          />
          {/* )} */}
        </div>
      </div>
      <div className="hidden lg:flex mt-[6px] lg:mt-[25px]">
        <div className={styles.proposedBy}>Proposed by</div>
        <div className={styles.proposedText}>{proposalDetail.author}</div>
        <div className="ml-[14px] hidden lg:flex h-[30px] gap-[8px] items-center">
          <CopyAltLightGreenIcon />
          <div className={styles.clipboardBtn}>{getShortAddress(proposalDetail.wallet_id)}</div>
        </div>
      </div>

      <div className="flex lg:hidden mt-[6px] justify-between items-center">
        <div className="flex">
          <div className={styles.proposedBy}>Proposed by</div>
          <div className={styles.proposedText}>Angooba</div>
        </div>
        <div>
          <GradientButton
            direction="rtl"
            fontSize={12}
            gradientDirection="right"
            width={101}
            height={35}
            icon={NotificationMobileIcon}
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
            value={proposalDetail.total_votes / 3200}
          />
        </div>

        <div className="w-full flex justify-between">
          <div>
            <div className={styles.approvedText}>Approved</div>
            <div className={styles.approvedValue}>{proposalDetail.approved_votes}</div>
            <div className={styles.approvedPercent}>
              {proposalDetail.total_votes === 0
                ? '0%'
                : `${(proposalDetail.approved_votes / proposalDetail.total_votes) * 100} %`}
            </div>
          </div>
          <div>
            <div className={styles.approvedText}>Opposed</div>
            <div className={styles.approvedValue}>{proposalDetail.opposed_votes}</div>
            <div className={styles.approvedPercent}>
              {proposalDetail.total_votes === 0
                ? '0%'
                : `${(proposalDetail.opposed_votes / proposalDetail.total_votes) * 100} %`}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-wrap lg:flex-nowrap justify-around gap-[6px] lg:gap-[94px] mt-[30px] lg:mt-[48px]">
          <div className={styles.treasuryContainer}>
            <div className={styles.thresholdText}>Threshold</div>
            <div>
              <div className={styles.thresholdCurrent}>Current Threshold</div>
              <div className={styles.thresholdValue}>{proposalDetail.threshold} votes</div>
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
              <div className={styles.thresholdCurrent}>Taken at block</div>
              <div className={styles.thresholdValue}>17163196</div>
            </div>
          </div>
        </div>
        <div className="mt-[44px] lg:mt-[78px]">
          <div className={styles.description}>Description</div>
          <div className={styles.descriptionText}>{proposalDetail.overview}</div>
        </div>
        <div className="mt-[30px] lg:mt-[50px]">
          <div className={styles.description}>How will it proliferate Foster Marketplace or Circus DAO?</div>
          <div className={styles.descriptionText}>
            Information on how this proposal will produce benefits to CircusDAO / Foster Marketplace / Solana.
            Information on how this initiative reflects the values of CircusDAO in its support of Foster Marketplace,
            Solana, and the integrity of artists. The answer should provide any qualitative or quantitative data that
            can be used to determine the success of the proposalDetail.
          </div>
        </div>
        <div className="mt-[30px] lg:mt-[50px]">
          <div className={styles.description}>Estimated Treasury Spending Required</div>
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
      </div>
      <div className="mt-[30px] mt-[50px]">
        <div className={styles.description}>Estimated Timeline</div>
        <div className={styles.descriptionText}>{proposalDetail.eta_timeline}</div>
      </div>
      <div className="w-full h-[100px] lg:h-[200px]" />

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

      <ProgressingModal open={isLoading} />
    </div>
  )
}

export default DaoLandingDetail

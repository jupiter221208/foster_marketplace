import React, { useEffect, useState } from 'react'

import { LinearProgress, makeStyles } from '@material-ui/core'

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
  console.log(proposal)
  const classes = useStyles()
  const [showCastVoteModal, setShowCastVoteModal] = useState(false)

  const getEndDate = () => {
    var endDate = new Date(proposal.vote_start)
    endDate.setHours(endDate.getHours() + proposal.vote_duration)
    return endDate
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
    })
  }, [])

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
        <div className={styles.backText}>Proposal {proposal.id}</div>
        <div className="hidden lg:flex">
          <div className={styles.liveBtn}>Live</div>
        </div>
      </div>
      <div className="flex mt-[6px] lg:mt-[25px] justify-between">
        <div className={styles.proposalText}>{proposal.title}</div>
        <div className="hidden lg:flex">
          <GradientButton
            direction="rtl"
            fontSize={18}
            width={155}
            height={53}
            icon={NotificationIcon}
            label="Cast Vote"
            onClick={() => setShowCastVoteModal(true)}
          />
        </div>
      </div>
      <div className="hidden lg:flex mt-[6px] lg:mt-[25px]">
        <div className={styles.proposedBy}>Proposed by</div>
        <div className={styles.proposedText}>{proposal.author}</div>
        <div className="ml-[14px] hidden lg:flex h-[30px] gap-[8px] items-center">
          <CopyAltLightGreenIcon />
          <div className={styles.clipboardBtn}>{getShortAddress(proposal.wallet_id)}</div>
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
            onClick={() => setShowCastVoteModal(true)}
          />
        </div>
      </div>

      <div className="mt-[32px] lg:mt-[60px]">
        <div className="w-full flex justify-between">
          <div className={styles.totalVotes}>Total Votes</div>
          <div className={styles.totalVotes}>({proposal.total_votes}/3200)</div>
        </div>

        <div className="mt-[12px] mb-[12px] lg:mb-[18px] w-full">
          <BorderLinearProgress
            variant="determinate"
            className="rounded-md"
            classes={{
              root: classes.root,
            }}
            value={20}
          />
        </div>

        <div className="w-full flex justify-between">
          <div>
            <div className={styles.approvedText}>Approved</div>
            <div className={styles.approvedValue}>{proposal.approved_votes}</div>
            <div className={styles.approvedPercent}>
              {proposal.total_votes === 0 ? '0%' : `${proposal.approved_votes / proposal.total_votes} %`}
            </div>
          </div>
          <div>
            <div className={styles.approvedText}>Opposed</div>
            <div className={styles.approvedValue}>{proposal.opposed_votes}</div>
            <div className={styles.approvedPercent}>
              {proposal.total_votes === 0 ? '0%' : `${proposal.opposed_votes / proposal.total_votes} %`}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-wrap lg:flex-nowrap justify-around gap-[6px] lg:gap-[94px] mt-[30px] lg:mt-[48px]">
          <div className={styles.treasuryContainer}>
            <div className={styles.thresholdText}>Threshold</div>
            <div>
              <div className={styles.thresholdCurrent}>Current Threshold</div>
              <div className={styles.thresholdValue}>{proposal.threshold} votes</div>
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
          <div className={styles.descriptionText}>{proposal.overview}</div>
        </div>
        <div className="mt-[30px] lg:mt-[50px]">
          <div className={styles.description}>How will it proliferate Foster Marketplace or Circus DAO?</div>
          <div className={styles.descriptionText}>
            Information on how this proposal will produce benefits to CircusDAO / Foster Marketplace / Solana.
            Information on how this initiative reflects the values of CircusDAO in its support of Foster Marketplace,
            Solana, and the integrity of artists. The answer should provide any qualitative or quantitative data that
            can be used to determine the success of the proposal.
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
            <div className={styles.estimateValue}>{proposal.treasury}</div>
          </div>
        </div>
      </div>
      <div className="mt-[30px] mt-[50px]">
        <div className={styles.description}>Estimated Timeline</div>
        <div className={styles.descriptionText}>{proposal.eta_timeline}</div>
      </div>
      <div className="w-full h-[100px] lg:h-[200px]" />

      <CastVoteModal
        data={{}}
        open={showCastVoteModal}
        onSubmit={() => {
          setShowCastVoteModal(false)
        }}
        onClose={() => setShowCastVoteModal(false)}
      />
    </div>
  )
}

export default DaoLandingDetail

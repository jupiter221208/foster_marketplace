import React, { useState } from 'react'

import { LinearProgress, makeStyles } from '@material-ui/core'

// images and icons
import DAOLogoMobile from 'assets/icons/dao-logo-small-mobile.svg?component'
import SolIcon from 'assets/icons/solana-logo-dark-big.svg?component'
import SolMobileIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import NotificationIcon from 'assets/icons/notification-icon-black.svg'
import ArrowLeftIcon from 'assets/icons/arrow-left-medium.svg?component'
import CopyAltLightGreenIcon from 'assets/icons/copy-alt-dark.svg?component'

// styles
import styles from './index.module.scss'
import { useViewport } from 'utils'
import GradientButton from 'components/Button/GradientButton'
import styled from 'styled-components'

const BorderLinearProgress = styled(LinearProgress)``
const useStyles = makeStyles({
  root: {
    height: '8px',
    '&.MuiLinearProgress-colorPrimary:not(.MuiLinearProgress-buffer)': {
      backgroundColor: '#2b2b2b',
    },
    // '& .MuiLinearProgress-colorPrimary': {
    //   backgroundColor: '#00ff00',
    // },
    '& .MuiLinearProgress-barColorPrimary': {
      backgroundColor: '#95dbd5',
    },
  },
})
const DaoLandingDetail = () => {
  const viewport = useViewport()
  const classes = useStyles()

  return (
    <div className={styles.container}>
      <div className="flex mt-[117px]">
        <div className={styles.backBtn}>
          <div className={styles.backEllipse}></div>
          <div className="absolute inset-auto">
            <ArrowLeftIcon />
          </div>
        </div>
        <div className={styles.backText}>Proposal 279</div>
        <div className={styles.liveBtn}>Live</div>
      </div>
      <div className="flex mt-[25px] justify-between">
        <div className={styles.proposalText}>Add Creator Merch Hub to the Artist Page</div>
        <GradientButton
          direction="rtl"
          fontSize={18}
          width={155}
          height={53}
          icon={NotificationIcon}
          label="Cost Vote"
        />
      </div>
      <div className="flex mt-[25px]">
        <div className={styles.proposedBy}>Proposed by</div>
        <div className={styles.proposedText}>Angooba</div>
        <div className="ml-[14px] flex h-[30px] gap-[8px] items-center">
          <CopyAltLightGreenIcon />
          <div className={styles.clipboardBtn}>6A8rF .. Rf8p</div>
        </div>
      </div>
      <div className="mt-[60px]">
        <div className="w-full flex justify-between">
          <div className={styles.totalVotes}>Total Votes</div>
          <div className={styles.totalVotes}>(1800/3200)</div>
        </div>

        <div className="mt-[12px] mb-[18px] w-full">
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
            <div className={styles.approvedValue}>1400</div>
            <div className={styles.approvedPercent}>75.8%</div>
          </div>
          <div>
            <div className={styles.approvedText}>Opposed</div>
            <div className={styles.approvedValue}>400</div>
            <div className={styles.approvedPercent}>22.2%</div>
          </div>
        </div>
        <div className="w-full flex justify-around gap-[94px] mt-[48px]">
          <div className={styles.treasuryContainer}>
            <div className={styles.thresholdText}>Threshold</div>
            <div>
              <div className={styles.thresholdCurrent}>Current Threshold</div>
              <div className={styles.thresholdValue}>180 votes</div>
            </div>
          </div>
          <div className={styles.treasuryContainer}>
            <div className={styles.thresholdText}>Ends</div>
            <div>
              <div className={styles.thresholdCurrent}>8:54 PM MST</div>
              <div className={styles.thresholdValue}>May 23, 2023</div>
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
      </div>
    </div>
  )
}

export default DaoLandingDetail

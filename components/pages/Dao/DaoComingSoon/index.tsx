import React, { useState } from 'react'

// images and icons

import DAOLogo from 'assets/icons/dao-logo.svg?component'
import DAOLogoMobile from 'assets/icons/dao-logo-small-mobile.svg?component'
import TurkeyLogo from 'assets/icons/turkey-logo.svg?component'

// styles
import styles from './index.module.scss'
import { useViewport } from 'utils'

const DaoComingSoon = props => {
  const { onConnect } = props
  const viewport = useViewport()

  return (
    <div className={styles.container}>
      <div className={styles.title}>Coming Soon</div>
      <div className="w-full flex justify-center mt-[30px]">
        {viewport === 'xs' || viewport === 'md' || viewport === 'sm' ? <DAOLogoMobile alt="" /> : <DAOLogo alt="" />}
      </div>
      <div className={styles.subTitle}>Connect your wallet to verify your Turkey Circus NFT</div>
      <div className={styles.text}>Official governance portal for CircusDAO coming soon!</div>
      <div className="mt-[70px] w-full flex justify-center">
        <div className={styles.joinDaoBG} onClick={onConnect}>
          <div className={styles.joinDao}>
            <TurkeyLogo />
            <div className="mt-[3px]">Connect</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DaoComingSoon

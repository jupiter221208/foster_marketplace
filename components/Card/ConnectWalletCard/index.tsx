import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// custom components
import GradientButton from 'components/Button/GradientButton'

// images and icons
import LogoDarkGreenIcon from 'assets/icons/logo-dark-green.svg'

// styles
import styles from './index.module.scss'

const ConnectWalletCard = props => {
  const { icon, type } = props
  const viewport = useViewport()

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Image src={icon} alt="" />
      </div>
      <div className="w-full max-w-[234px]">
        <GradientButton
          label="CONNECT WALLET"
          icon={LogoDarkGreenIcon}
          onClick={() => {}}
          gradientDirection="top"
          fontFamily="KCDurhamboxcar"
          fontSize="30px"
          fullWidth
          height="66px"
        />
      </div>
    </div>
  )
}

export default ConnectWalletCard

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
  const { icon } = props
  const viewport = useViewport()

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Image
          src={icon}
          alt=""
          width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '160px' : '244px'}
          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '160px' : '244px'}
        />
      </div>
      <div className="w-full max-w-[152px] lg:max-w-[234px]">
        <GradientButton
          backgroundColor01="#315251"
          backgroundColor02="#53AEA7"
          direction="both"
          fontFamily="KCDurhamboxcar"
          fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '21px' : '30px'}
          fullWidth
          gradientDirection="bottom"
          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '30px' : '51px'}
          icon={LogoDarkGreenIcon}
          label="COMING SOON"
          onClick={() => {}}
        />
      </div>
    </div>
  )
}

export default ConnectWalletCard

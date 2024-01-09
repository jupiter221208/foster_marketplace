import React, { FC, useEffect, useState } from 'react'

// third party components
import { useSelector } from 'react-redux'
import { useWallet } from '@solana/wallet-adapter-react'
import Lottie from 'lottie-react'

// custom functions
import { useViewport } from 'utils'

// custom components
import Navbar from 'components/Navbar'
import MobileMenu from 'components/Menu/MobileMenu'
import MobileSearchBox from 'components/MobileSearchBox'
import PrimaryHeader from 'components/Header/PrimaryHeader'
import PrimaryFooter from 'components/Footer/PrimaryFooter'
import ConnectWalletModal from 'components/Modal/ConnectWalletModal'
import ProfileSetupModal from 'components/Modal/ProfileSetupModal'

// resource
import PreLoaderIcon from 'assets/lottery/preloader.json'
import FosterHeroLogo from 'assets/icons/foster-hero-logo.svg?component'
import FosterHeroLogoMobile from 'assets/icons/foster-hero-logo-medium.svg?component'

// styles
import styles from './index.module.scss'
import { setColorTheme } from 'utils/helpers'
import { useRouter } from 'next/router'

interface PrimaryLayoutProps {
  children?: any
}

const PrimaryLayout: FC<PrimaryLayoutProps> = ({ children }) => {
  const viewport = useViewport()
  const router = useRouter()
  const openMobileMenu = useSelector<any>(state => state.openMobileMenu)
  const openMobileSearchBox = useSelector<any>(state => state.openMobileSearchBox)
  const profileSetup = useSelector<any>(state => state.profileSetup)
  const { connected } = useWallet()
  const lightDarkMode = useSelector(state => (state as any).lightMode)
  useEffect(() => {
    setColorTheme(lightDarkMode)
  }, [])

  return (
    <div className={styles.container}>
      <>
        {/* {connected && (viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <Navbar />} */}
        <PrimaryHeader />
        <ConnectWalletModal />
        {openMobileMenu && (viewport === 'xs' || viewport === 'sm' || viewport === 'md') && <MobileMenu />}
        {openMobileSearchBox && (viewport === 'xs' || viewport === 'sm' || viewport === 'md') && <MobileSearchBox />}

        <main className="w-full flex justify-center mt-[80px] lg:mt-[100px] min-h-[calc(100vh_-_80px)] lg:min-h-[calc(100vh_-_100px)]">
          {children}
        </main>
        {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <PrimaryFooter />}
        {connected && profileSetup && <ProfileSetupModal />}
      </>
    </div>
  )
}

export default PrimaryLayout

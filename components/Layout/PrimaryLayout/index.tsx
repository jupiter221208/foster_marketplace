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
  const showConnectAlert = useSelector<any>(state => state.showConnectAlert)
  const { connected } = useWallet()
  const lightDarkMode = useSelector(state => (state as any).lightMode)
  const firstLoaded = useSelector<any>(state => state.firstLoaded)
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
        {connected && profileSetup && !showConnectAlert && <ProfileSetupModal />}
      </>
      {!firstLoaded && (router.asPath === '/' || router.asPath === '/studio') && (
        <div className={styles.preLoaderView}>
          <div className="w-full mt-[150px] lg:mt-[216px]">
            <div className="w-full flex justify-center">
              <div className="lg:flex hidden">
                <FosterHeroLogo alt="" />
              </div>
              <div className="flex lg:hidden">
                <FosterHeroLogoMobile alt="" />
              </div>
            </div>
            <div className="w-full flex justify-center">
              <div className="w-[500px] h-[40px]">
                <Lottie width={500} height={40} animationData={PreLoaderIcon} loop={true} />
              </div>
            </div>
            <div className="w-full flex justify-center mt-[150px] lg:mt-[250px]">
              <div className={styles.justDoArt}>WELCOME HOME</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PrimaryLayout

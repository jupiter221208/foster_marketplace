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
  const [firstLoad, setFirstLoad] = useState(true)
  const firstLoaded = useSelector<any>(state => state.firstLoaded)

  useEffect(() => {
    setColorTheme(lightDarkMode)
    // setTimeout(() => {
    //   setFirstLoad(false)
    // }, 5000)
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
        <PrimaryFooter />
        {connected && profileSetup && !showConnectAlert && <ProfileSetupModal />}
      </>
      {!firstLoaded && router.asPath === '/' && (
        <div className={styles.preLoaderView}>
          <div className="w-full h-auto flex  items-center">
            <div className="w-full mt-[120px] lg:mt-[200px]">
              <div className="w-full flex justify-center">
                <div className={styles.welcome}>Welcome Home</div>
              </div>
              <div className="w-full h-[295px] flex justify-center  mt-[40px] mb-[46px]">
                <div className="w-[254px] h-[295px]">
                  <Lottie width={254} height={295} animationData={PreLoaderIcon} loop={true} />
                </div>
              </div>
              <div className="w-full flex justify-center">
                <div className={styles.justDoArt}>JUST DO ART.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PrimaryLayout

import React, { FC, useEffect } from 'react'

// third party components
import { useDispatch, useSelector } from 'react-redux'
import { useWallet } from '@solana/wallet-adapter-react'

// custom components
import Navbar from 'components/Navbar'
import MobileMenu from 'components/Menu/MobileMenu'
import MobileSearchBox from 'components/MobileSearchBox'
import PrimaryHeader from 'components/Header/PrimaryHeader'
import ConnectWalletModal from 'components/Modal/ConnectWalletModal'
import ProfileSetupModal from 'components/Modal/ProfileSetupModal'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'
import { setColorTheme } from 'utils/helpers'

interface SecondaryLayoutProps {
  children?: any
}

const SecondaryLayout: FC<SecondaryLayoutProps> = ({ children }) => {
  const viewport = useViewport()
  const openMobileMenu = useSelector<any>(state => state.openMobileMenu)
  const openMobileSearchBox = useSelector<any>(state => state.openMobileSearchBox)
  const profileSetup = useSelector<any>(state => state.profileSetup)
  const { connected } = useWallet()
  const lightMode = useSelector(state => (state as any).lightMode)

  useEffect(() => {
    setColorTheme(lightMode)
  }, [])

  return (
    <div className={styles.container}>
      <>
        {connected && (viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <Navbar />}
        <PrimaryHeader />
        <ConnectWalletModal />
        {/* <MobileMenu /> */}
        {openMobileMenu && (viewport === 'xs' || viewport === 'sm' || viewport === 'md') && <MobileMenu />}
        {openMobileSearchBox && (viewport === 'xs' || viewport === 'sm' || viewport === 'md') && <MobileSearchBox />}

        <main className="w-full flex justify-center mt-[80px] lg:mt-[100px] min-h-[calc(100vh_-_80px)] lg:min-h-[calc(100vh_-_100px)]">
          {children}
        </main>
        {connected && profileSetup && <ProfileSetupModal />}
      </>
    </div>
  )
}

export default SecondaryLayout

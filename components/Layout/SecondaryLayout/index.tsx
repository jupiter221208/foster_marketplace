import React, { FC, useEffect } from 'react'

// third party components
import { useSelector } from 'react-redux'
import { useWallet } from '@solana/wallet-adapter-react'

// custom components
import MobileMenu from 'components/Menu/MobileMenu'
import MobileSearchBox from 'components/MobileSearchBox'
import PrimaryHeader from 'components/Header/PrimaryHeader'
import ConnectWalletModal from 'components/Modal/ConnectWalletModal'
import ProfileSetupModal from 'components/Modal/ProfileSetupModal'
import ShoppingCartMobileMenu from 'components/Menu/ShoppingCartMobileMenu'

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
  const openShoppingCart = useSelector<any>(state => state.openShoppingCart)
  const profileSetup = useSelector<any>(state => state.profileSetup)
  const { connected } = useWallet()
  const lightDarkMode = useSelector(state => (state as any).lightMode)

  useEffect(() => {
    let lightDarkMode = localStorage.getItem('lightDarkMode')
    if (lightDarkMode === null || lightDarkMode === undefined) {
      localStorage.setItem('lightDarkMode', 'false')
      setColorTheme(false)
    } else if (lightDarkMode === 'true') {
      setColorTheme(true)
    } else {
      setColorTheme(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.container}>
      <>
        {/* {connected && (viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <Navbar />} */}
        <PrimaryHeader />
        <ConnectWalletModal />
        {/* <MobileMenu /> */}

        {openMobileMenu && (viewport === 'xs' || viewport === 'sm' || viewport === 'md') && <MobileMenu />}
        {openMobileSearchBox && (viewport === 'xs' || viewport === 'sm' || viewport === 'md') && <MobileSearchBox />}
        {openShoppingCart && (viewport === 'xs' || viewport === 'sm' || viewport === 'md') && (
          <ShoppingCartMobileMenu />
        )}
        <main className="w-full flex justify-center mt-[80px] lg:mt-[100px] min-h-[calc(100vh_-_80px)] lg:min-h-[calc(100vh_-_100px)]">
          {children}
        </main>
        {connected && profileSetup && <ProfileSetupModal />}
      </>
    </div>
  )
}

export default SecondaryLayout

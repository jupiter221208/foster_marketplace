import React, { FC } from 'react'

// third party components
import { useSelector } from 'react-redux'
import { useWallet } from '@solana/wallet-adapter-react'

// custom components
import Navbar from 'components/Navbar'
import MobileMenu from 'components/Menu/MobileMenu'
import MobileSearchBox from 'components/MobileSearchBox'
import PrimaryHeader from 'components/Header/PrimaryHeader'
import PrimaryFooter from 'components/Footer/PrimaryFooter'
import ConnectWalletModal from 'components/Modal/ConnectWalletModal'

// styles
import styles from './index.module.scss'

interface PrimaryLayoutProps {
  children?: any
}

const PrimaryLayout: FC<PrimaryLayoutProps> = props => {
  const { viewport } = props.children.props

  const openMobileMenu = useSelector<any>(state => state.openMobileMenu)
  const openMobileSearchBox = useSelector<any>(state => state.openMobileSearchBox)
  const { connected } = useWallet()

  return (
    <div className={styles.container}>
      <>
        {connected && (viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <Navbar viewport={viewport} />}
        <PrimaryHeader viewport={viewport} />
        <ConnectWalletModal viewport={viewport} />
        {openMobileMenu && (viewport === 'xs' || viewport === 'sm' || viewport === 'md') && <MobileMenu />}
        {openMobileSearchBox && (viewport === 'xs' || viewport === 'sm' || viewport === 'md') && (
          <MobileSearchBox viewport={viewport} />
        )}

        <main className="w-full flex justify-center mt-[80px] lg:mt-[100px] min-h-[calc(100vh_-_80px)] lg:min-h-[calc(100vh_-_100px)]">
          {props.children}
        </main>
        <PrimaryFooter viewport={viewport} />
      </>
    </div>
  )
}

export default PrimaryLayout

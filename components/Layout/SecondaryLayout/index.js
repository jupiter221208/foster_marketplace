import React from 'react'

// third party components
import { useSelector } from 'react-redux'

// custom components
import Navbar from 'components/Navbar'
import MobileMenu from 'components/Menu/MobileMenu'
import MobileSearchBox from 'components/MobileSearchBox'
import PrimaryHeader from 'components/Header/PrimaryHeader'
import ConnectWalletModal from 'components/Modal/ConnectWalletModal'

// styles
import styles from './index.module.scss'

const SecondaryLayout = ({ children }) => {
  const { viewport } = children.props
  const openMobileMenu = useSelector(state => state.openMobileMenu)
  const openMobileSearchBox = useSelector(state => state.openMobileSearchBox)
  const connectWalletStatus = useSelector(state => state.connectWalletStatus)

  return (
    <div className={styles.container}>
      {connectWalletStatus && (viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && (
        <Navbar viewport={viewport} />
      )}
      <PrimaryHeader viewport={viewport} />
      <ConnectWalletModal viewport={viewport} />
      {/* <MobileMenu /> */}
      {openMobileMenu && (viewport === 'xs' || viewport === 'sm' || viewport === 'md') && <MobileMenu />}
      {openMobileSearchBox && (viewport === 'xs' || viewport === 'sm' || viewport === 'md') && (
        <MobileSearchBox viewport={viewport} />
      )}

      <main className="w-full flex justify-center mt-[80px] lg:mt-[100px]">{children}</main>
    </div>
  )
}

export default SecondaryLayout

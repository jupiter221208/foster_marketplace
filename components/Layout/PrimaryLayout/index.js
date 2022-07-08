import React from 'react'

// third party components
import { useSelector } from 'react-redux'

// custom components
import Navbar from 'components/Navbar'
import PrimaryHeader from 'components/Header/PrimaryHeader'
import PrimaryFooter from 'components/Footer/PrimaryFooter'

// styles
import styles from './index.module.scss'

const PrimaryLayout = ({ children }) => {
  const viewport = useSelector(state => state.viewport)
  return (
    <div className={styles.container}>
      <Navbar />
      <PrimaryHeader />
      <main className="w-full g-container">{children}</main>
      <PrimaryFooter />
    </div>
  )
}

export default PrimaryLayout

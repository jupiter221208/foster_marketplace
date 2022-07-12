import React from 'react'

// custom components
import Navbar from 'components/Navbar'
import PrimaryHeader from 'components/Header/PrimaryHeader'
import PrimaryFooter from 'components/Footer/PrimaryFooter'

// styles
import styles from './index.module.scss'

const PrimaryLayout = ({ children }) => {
  const { viewport } = children.props
  return (
    <div className={styles.container}>
      {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <Navbar viewport={viewport} />}
      <PrimaryHeader viewport={viewport} />
      <main className="inline justify-center g-container">{children}</main>
      <PrimaryFooter viewport={viewport} />
    </div>
  )
}

export default PrimaryLayout

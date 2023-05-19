import React, { useState } from 'react'

// next images
import Head from 'next/head'
// import Image from 'next/image'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'
// import DaoOfCircusModal from 'components/Modal/DaoOfCircusModal'
// import DaoOfLiftModal from 'components/Modal/DaoOfLiftModal'
// import OutlineButton from 'components/Button/OutlineButton'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg?component'
// import TurkeyRingLeader from 'assets/images/turkey-ringleader.png'
// import DAOLogo from 'assets/icons/dao-logo.svg?component'
// import DAOLogoMobile from 'assets/icons/dao-logo-small-mobile.svg?component'
import DaoPreviewImage from 'assets/images/dao-preview-image.png'

// styles
import styles from './index.module.scss'
// import DaoSetupModal from 'components/Modal/DaoSetupModal'
import { useViewport } from 'utils'
import DaoComingSoon from 'components/pages/Dao/DaoComingSoon'
import DaoLandingPage from 'components/pages/Dao/DaoLandingPage'
import DaoLandingDetail from 'components/pages/Dao/DaoLandingDetail'

const Dao = () => {
  // const [showCircus, setShowCircus] = useState(false)
  // const [showLift, setShowLift] = useState(false)
  // const [daoSetup, setDaoSetup] = useState(false)
  const [daoPage, setDaoPage] = useState('start')
  const [proposal, setProposal] = useState()

  const viewport = useViewport()

  let pageTitle = `CircusDAO | Foster Marketplace`
  let pageImageUrl = DaoPreviewImage.src
  let pageDescription = 'A community of artists and builders shaping the evolution of Foster Marketplace.'

  return (
    <div className="g-container">
      <Head>
        <title>{pageTitle}</title>

        <meta name="description" content={pageDescription} />

        <meta name="og:title" content={pageTitle} />
        <meta name="og:description" content={pageDescription} />
        <meta name="og:image" content={pageImageUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImageUrl} />

        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="relative w-full flex justify-center">
        <div className={styles.topLeftEllipse}>
          {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
        </div>

        {daoPage === 'start' ? (
          <DaoComingSoon onConnect={() => setDaoPage('landing')} />
        ) : daoPage === 'landing' ? (
          <div className="w-full mt-[40px] lg:mt-[115px] z-10">
            <DaoLandingPage
              onDetail={item => {
                setProposal(item)
                setDaoPage('detail')
              }}
            />
          </div>
        ) : (
          <DaoLandingDetail proposal={proposal} onBack={() => setDaoPage('landing')} />
        )}
      </div>
    </div>
  )
}

export default Dao

Dao.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}

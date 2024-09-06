// next components
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// components
import PrimaryLayout from 'components/Layout/PrimaryLayout'
import MainSection from 'components/pages/Home/MainSection'
import TopRatedArtistsSection from 'components/pages/Home/TopRatedArtistsSection'
import MarketplaceReleaseSection from 'components/pages/Home/MarketplaceReleaseSection'
import TrendingCollectionSection from 'components/pages/Home/TrendingCollectionSection'
import LiveAuctionSection from 'components/pages/Home/LiveAuctionSection'

// images
import PreviewImage from 'assets/images/preview-image.png'
import SolonaLogoIcon from 'assets/icons/solana-logo-44x50.svg?component'
import ArrowIcon from 'assets/icons/arrow-right-13x10.svg?component'

// custom functions
import { useDetectRouterPath, useViewport } from 'utils'
import { getAbsoluteOgUrl } from 'utils/seo'

// third party components
import { useSelector } from 'react-redux'
import { setColorTheme } from 'utils/helpers'

import styles from './index.module.scss'
import LimitedEditionSection from 'components/pages/Home/LimitedEditionSection'
import OpenEditionSection from 'components/pages/Home/OpenEditionSection'

// api
import dashboardAPI from 'apis/dashboard'
import StudioHeroSection from 'components/pages/Home/StudioHeroSection'

const Home = () => {
  const viewport = useViewport()
  const router = useRouter()
  useDetectRouterPath(useRouter())

  let pageTitle = 'Foster Marketplace'
  let pageImageUrl = getAbsoluteOgUrl(PreviewImage.src)
  let pageDescription =
    'Home to creators, collectors, and curators around the world.\n' +
    'Pushing the boundaries of digital art on Solana.'

  const lightDarkMode = useSelector(state => (state as any).lightMode)

  const [limitedEditionList, setLimitedEditionList] = useState<any>([])
  const [openEditionList, setOpenEditionList] = useState<any>([])
  const [visibleBoundary, setVisibleBoundary] = useState(false)
  const [isEditionLoaded, setIsEditionLoaded] = useState(false)

  useEffect(() => {
    setColorTheme(lightDarkMode)

    dashboardAPI.getListedEditions('', '', 1, 15).then(response => {
      if (response) {
        if (Array.isArray(response.limitedEditions)) {
          setLimitedEditionList(response.limitedEditions)
        }
        if (Array.isArray(response.openEditions)) {
          setOpenEditionList(response.openEditions)
        }
      }
      setIsEditionLoaded(true)
    }),
      error => {
        console.log(error)
        setIsEditionLoaded(true)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    // <MaintenancePage />
    <div className="w-full">
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
      <div className="w-full flex justify-center">
        <div className="max-w-[1920px] w-full px-4 lg:px-0">
          <MainSection />
        </div>
      </div>
      <div className={styles.editionSection}>
        <div className="g-container w-full">
          <StudioHeroSection isEditionLoaded={isEditionLoaded} />
        </div>
      </div>
      <div className={styles.liveAuctionBG}>
        <div className="g-container">
          <LiveAuctionSection category={''} fromPage={'home'} />
        </div>
      </div>
      <div className={styles.editionSection}>
        <div className="g-container w-full">
          <OpenEditionSection category={''} isEditionLoaded={isEditionLoaded} editionList={openEditionList} />
        </div>
      </div>
      <div className={styles.limitEditionSection}>
        <div className="g-container">
          <LimitedEditionSection category={''} isEditionLoaded={isEditionLoaded} editionList={limitedEditionList} />
        </div>
      </div>
      <div className={styles.newReleaseSection}>
        <div className="g-container">
          <MarketplaceReleaseSection category={''} setVisibleBoundary={setVisibleBoundary} />
        </div>
      </div>

      {visibleBoundary && (
        <div className={styles.pushingBoundary}>
          <div className="g-container w-full flex justify-center items-center">
            <div className="lg:flex hidden gap-[28px]">
              <div>
                <SolonaLogoIcon />
              </div>
              <div className="">
                <div className={styles.pushTitle}>Pushing the boundaries of Digital Art on Solana</div>
                <div className={styles.pushText}>Home to creators, collectors, and curators around the world</div>
              </div>
              <div className={styles.buyButton} onClick={() => router.push('/explore')}>
                <div>Explore Art</div>
                <div className={styles.buttonIcon}>
                  <ArrowIcon className={styles.arrowIcon} />
                </div>
              </div>
            </div>
            {/* Mobile */}
            <div className="lg:hidden block gap-[28px]">
              <div className="w-full flex justify-center">
                <div>
                  <SolonaLogoIcon />
                </div>
              </div>
              <div className="mt-[15px]">
                <div className={styles.pushTitle}>Pushing the boundaries of Digital Art on Solana</div>
                <div className={styles.pushText}>
                  Home to creators, collectors, and curators
                  <br /> around the world
                </div>
              </div>
              <div className="w-full flex justify-center mt-[27px]">
                <div className={styles.buyButton} onClick={() => router.push('/explore')}>
                  <div>Explore Art</div>
                  <div className={styles.buttonIcon}>
                    <ArrowIcon className={styles.arrowIcon} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={styles.otherBG}>
        {viewport === 'xs' ? (
          <div className="w-full">
            <TopRatedArtistsSection />
          </div>
        ) : (
          <div className="g-container">
            <TopRatedArtistsSection />
          </div>
        )}
      </div>
      <div className={styles.collectionSection}>
        <div className="g-container">
          <TrendingCollectionSection category={''} loop={true} />
        </div>
      </div>

      {/* <div className={styles.shopMerchSection}>
        <div className="g-container">
          <ShopMerchSection />
        </div>
      </div> */}
    </div>
  )
}

export default Home

Home.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

export function getStaticProps() {
  return { props: {} }
}

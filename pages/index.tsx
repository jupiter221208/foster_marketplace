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
import SolonaLogoIcon from 'assets/icons/solana-logo-black.svg?component'

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
import GradientButton from 'components/Button/GradientButton'
import ShopMerchSection from 'components/pages/Home/ShopMerchSection'

const Home = () => {
  const viewport = useViewport()
  const router = useRouter()
  // const isLoading = useSelector<any>(state => state.isLoading)
  useDetectRouterPath(useRouter())

  let pageTitle = 'Foster Marketplace'
  let pageImageUrl = getAbsoluteOgUrl(PreviewImage.src)
  let pageDescription =
    'Home to creators, collectors, and curators around the world.\n' +
    'Pushing the boundaries of digital art on Solana.'

  const lightDarkMode = useSelector(state => (state as any).lightMode)
  const [editionList, setEditionList] = useState<any>([])
  const [limitedEditionList, setLimitedEditionList] = useState<any>([])
  const [openEditionList, setOpenEditionList] = useState<any>([])
  const [visibleBoundary, setVisibleBoundary] = useState(false)

  useEffect(() => {
    setColorTheme(lightDarkMode)

    setEditionList([])
    dashboardAPI.getListedEditions('', '', 1, 15).then(response => {
      if (Array.isArray(response.limitedEditions)) {
        setLimitedEditionList(response.limitedEditions)
      }
      if (Array.isArray(response.openEditions)) {
        setOpenEditionList(response.openEditions)
      }
    }),
      error => {
        console.log(error)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   if (editionList && Array.isArray(editionList)) {
  //     const openEditions = editionList.filter(item => item.maxSupply === '0' || item.maxSupply === null)
  //     setOpenEditionList(openEditions)
  //     const limitEditions = editionList.filter(
  //       item => item.maxSupply !== null && item.maxSupply !== '0' && item.maxSupply !== item.currentSupply
  //     )
  //     setLimitedEditionList(limitEditions)
  //   }
  // }, [editionList])

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
      {/* <PopularCategorySection type="home" /> */}
      <div className={styles.liveAuctionBG}>
        <div className="g-container">
          <LiveAuctionSection category={''} fromPage={'home'} />
        </div>
      </div>
      {/* {openEditionList.length > 0 && ( */}
      <div className={styles.editionSection}>
        <div className="g-container w-full">
          <OpenEditionSection category={''} editionList={openEditionList} />
        </div>
      </div>
      {/* )} */}
      {/* {limitedEditionList.length > 0 && ( */}
      <div className={styles.limitEditionSection}>
        <div className="g-container">
          <LimitedEditionSection category={''} editionList={limitedEditionList} />
        </div>
      </div>
      {/* )} */}
      <div className={styles.newReleaseSection}>
        <div className="g-container">
          <MarketplaceReleaseSection category={''} setVisibleBoundary={setVisibleBoundary} />
        </div>
      </div>

      {visibleBoundary && (
        <div className={styles.pushingBoundary}>
          <div className="g-container w-full flex justify-center items-center">
            <div className="lg:flex hidden gap-[28px]">
              <div className={styles.boundaryIcon}>
                <SolonaLogoIcon />
              </div>
              <div className="mt-[-5px]">
                <div className={styles.pushTitle}>Pushing the boundaries of Digital Art on Solana</div>
                <div className={styles.pushText}>Home to creators, collectors, and curators around the world</div>
              </div>
              <div className={styles.exploreBtn} onClick={() => router.push('/explore')}>
                Explore Art
              </div>
            </div>
            {/* Mobile */}
            <div className="lg:hidden block gap-[28px]">
              <div className="w-full flex justify-center">
                <div className={styles.boundaryIcon}>
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
                <div className={styles.exploreBtn} onClick={() => router.push('/explore')}>
                  Explore Art
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

      <div className={styles.shopMerchSection}>
        <div className="g-container">
          <ShopMerchSection />
        </div>
      </div>

      {/* <CreateSellNFTSection /> */}
      {/* <FullScreenLoadingModal open={isLoading} /> */}
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

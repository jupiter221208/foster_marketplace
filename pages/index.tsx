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
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'

// images
import PreviewImage from 'assets/images/preview-image.png'

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

const Home = () => {
  const viewport = useViewport()
  const isLoading = useSelector<any>(state => state.isLoading)
  useDetectRouterPath(useRouter())

  let pageTitle = 'Foster Marketplace'
  let pageImageUrl = getAbsoluteOgUrl(PreviewImage.src)
  let pageDescription =
    'Home to creators, collectors, and curators around the world.\n' +
    'Pushing the boundaries of digital art on Solana.'

  const lightDarkMode = useSelector(state => (state as any).lightMode)
  const [editionList, setEditionList] = useState<any>([])

  useEffect(() => {
    setColorTheme(lightDarkMode)

    setEditionList([])
    dashboardAPI.getListedEditions('', '', 1, 15).then(response => {
      if (response !== null && response !== undefined && response.length !== 0) {
        setEditionList(response)
      }
    }),
      error => {
        console.log(error)
      }
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
      {/* <PopularCategorySection type="home" /> */}
      <div className={styles.liveAuctionBG}>
        <div className="g-container">
          <LiveAuctionSection category={''} fromPage={'home'} />
        </div>
      </div>
      <div className={styles.newReleaseSection}>
        <div className="g-container">
          <MarketplaceReleaseSection category={''} />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="g-container">
          <LimitedEditionSection category={''} editions={editionList} />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="g-container ">
          <OpenEditionSection category={''} editions={editionList} />
        </div>
      </div>
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
      <div className="w-full flex justify-center">
        <div className="g-container">
          <TrendingCollectionSection category={''} loop={true} />
          {/* <CreateSellNFTSection /> */}
          <FullScreenLoadingModal open={isLoading} />
        </div>
      </div>
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

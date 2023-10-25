// next components
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// components
import PrimaryLayout from 'components/Layout/PrimaryLayout'
import MainSection from 'components/pages/Studio/MainSection'
import StudioArtistsSection from 'components/pages/Studio/StudioArtistsSection'
import NewStudioReleasesSection from 'components/pages/Studio/NewStudioReleasesSection'
import ExploreStudioArtworkSection from 'components/pages/Studio/ExploreStudioArtworkSection'
import TrendingSection from 'components/pages/Studio/TrendingSection'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'

// images
import StudioPreviewImage from 'assets/images/studio-preview-image.png'

// custom functions
import { useDetectRouterPath } from 'utils'
import { getAbsoluteOgUrl } from 'utils/seo'

// third party components
import { useDispatch, useSelector } from 'react-redux'
import { setColorTheme } from 'utils/helpers'

import styles from './index.module.scss'

const Studio = () => {
  const [heroState, setHeroState] = useState({
    selected: false,
    data: {},
  })
  const isLoading = useSelector<any>(state => state.isLoading)
  useDetectRouterPath(useRouter())

  let pageTitle = 'Foster Studio'
  let pageImageUrl = getAbsoluteOgUrl(StudioPreviewImage.src)
  let pageDescription = 'Pushing the boundaries of digital art on Solana'

  const lightDarkMode = useSelector(state => (state as any).lightMode)

  useEffect(() => {
    setColorTheme(lightDarkMode)
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
        <MainSection onchange={setHeroState} heroValue={heroState} />
      </div>
      <div className={styles.otherBG}>
        {heroState.selected && (
          <div className="g-container">
            <TrendingSection category={''} heroValue={heroState} />
          </div>
        )}
      </div>
      {heroState.selected && (
        <div className="w-full flex justify-center">
          <div className="g-container">
            <NewStudioReleasesSection category={''} heroValue={heroState} />
          </div>
        </div>
      )}
      <div className={styles.otherBG}>
        <div className="g-container">
          <StudioArtistsSection />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="g-container">
          <ExploreStudioArtworkSection category={''} loop={true} />
          <FullScreenLoadingModal open={isLoading} />
        </div>
      </div>
    </div>
  )
}

export default Studio

Studio.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

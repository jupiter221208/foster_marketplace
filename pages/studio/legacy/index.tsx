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

// images
import StudioPreviewImage from 'assets/images/studio-preview-image.png'

// custom functions
import { useDetectRouterPath } from 'utils'
import { getAbsoluteOgUrl } from 'utils/seo'

// third party components
import { useSelector } from 'react-redux'
import { setColorTheme } from 'utils/helpers'

import styles from './index.module.scss'
import StudioHelpSection from 'components/pages/Studio/StudioHelpSection'

const StudioLegacy = () => {
  const [heroState, setHeroState] = useState({
    selected: true,
    data: 'all',
  })
  const router = useRouter()
  useDetectRouterPath(useRouter())

  let pageTitle = 'Foster Studio'
  let pageImageUrl = getAbsoluteOgUrl(StudioPreviewImage.src)
  let pageDescription = 'Pushing the boundaries of digital art on Solana'

  const lightDarkMode = useSelector(state => (state as any).lightMode)

  useEffect(() => {
    setColorTheme(lightDarkMode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }, 500)
  }, [router.query.id])

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
        <MainSection onChange={setHeroState} heroValue={heroState} />
      </div>

      <div className={styles.helpSectionBG}>
        <div className="g-container">
          <StudioHelpSection />
        </div>
      </div>

      {heroState?.selected && (
        <div className="w-full flex justify-center mt-[30px]">
          <div className="g-container">
            <NewStudioReleasesSection type={'trending'} heroValue={heroState} onChange={setHeroState} />
          </div>
        </div>
      )}
      {heroState?.selected && (
        <div className="w-full flex justify-center mb-[30px]">
          <div className="g-container">
            <NewStudioReleasesSection type={'release'} heroValue={heroState} onChange={setHeroState} />
          </div>
        </div>
      )}
      <div className={styles.artistSectionBG}>
        <div className="g-container">
          <StudioArtistsSection />
        </div>
      </div>
      <div className="w-full flex justify-center mb-[100px] lg:mb-[0px]">
        <div className="g-container">
          <ExploreStudioArtworkSection category={''} loop={true} />
        </div>
      </div>
    </div>
  )
}

export default StudioLegacy

StudioLegacy.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

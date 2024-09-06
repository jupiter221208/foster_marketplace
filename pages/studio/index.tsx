// next components
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

// components
import PrimaryLayout from 'components/Layout/PrimaryLayout'

// images
import StudioPreviewImage from 'assets/images/studio-preview-image.png'

// custom functions
import { useDetectRouterPath } from 'utils'
import { getAbsoluteOgUrl } from 'utils/seo'

// third party components
import { useSelector } from 'react-redux'
import { setColorTheme } from 'utils/helpers'

import styles from './index.module.scss'
import StudioClothSign from 'assets/images/studio-sign.png'
import StudioClothDIY from 'assets/images/studio-diy.png'
import StudioCreateSection from 'components/pages/Studio/StudioCreateSection'
import FosterLogoIcon from 'assets/icons/foster-hero-logo-medium.svg?component'
import ImageWithFoster from 'components/ImageWithFoster'

const Studio = () => {
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

      <div className="w-full flex flex-col sm:flex-row z-10">
        <div className="relative w-full sm:w-[50%]">
          <div className={styles.imageArea}>
            <div className={styles.imageContent}>
              <div className="absolute inset-0">
                <div className="absolute inset-0">
                  <ImageWithFoster
                    src={'https://foster-marketplace-dev.s3.us-east-2.amazonaws.com/studio-2-bg.webp'}
                    quality={100}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* <div className="absolute inset-0">
                  <div className={styles.mask} />
                </div> */}
              </div>
              <div className="absolute inset-0 flex justify-center items-center">
                <div>
                  <div className={styles.title}>Studio 2.0</div>
                  <div className="mt-[9px]">
                    <div className={styles.desc}>{'Shop exclusive merch by Solana’s top artists.'}</div>
                    <div className={styles.desc}>{'Discover limited-edition apparel and collectibles.'}</div>
                  </div>
                  <div className="flex justify-center mt-[30px]">
                    <div className={styles.shopNow} onClick={() => router.push('/studio/signature')}>
                      Shop Now
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.border} sm:hidden block`} />

        <div className="relative w-full sm:w-[50%]">
          <div className={styles.imageArea}>
            <div className={styles.imageContent}>
              <div className="absolute inset-0">
                <div className="absolute inset-0">
                  <ImageWithFoster
                    src={'https://foster-marketplace-dev.s3.us-east-2.amazonaws.com/studio-1-bg.webp'}
                    quality={100}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* <div className="absolute inset-0">
                  <div className={styles.mask} />
                </div> */}
              </div>
              <div className="absolute inset-0 flex justify-center items-center">
                <div>
                  <div className={styles.title}>Studio 1.0</div>
                  <div className="mt-[9px]">
                    <div className={styles.desc}>{'Select artwork from the Studio NFT Library.'}</div>
                    <div className={styles.desc}>{'Curate your own merch.'}</div>
                  </div>
                  <div className="flex justify-center mt-[30px]">
                    <div className={styles.shopNow} onClick={() => router.push('/studio/legacy')}>
                      Shop Now
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.border} />

      <div className={styles.studioBG}>
        <div className="flex justify-center">
          <FosterLogoIcon />
        </div>
        <div className="flex justify-center mt-[15px] sm:mt-[30px]">
          <div className={styles.studioDesc}>A MERCH TOOL FOR ARTISTS ON SOLANA</div>
        </div>
      </div>

      <div className={styles.helpSectionBG}>
        <div className="g-container">
          <StudioCreateSection />
        </div>
      </div>
    </div>
  )
}

export default Studio

Studio.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

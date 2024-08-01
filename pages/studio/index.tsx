// next components
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// components
import PrimaryLayout from 'components/Layout/PrimaryLayout'

// images
import StudioPreviewImage from 'assets/images/studio-preview-image.png'

// custom functions
import { useDetectRouterPath } from 'utils'
import { getAbsoluteOgUrl } from 'utils/seo'

// third party components
import { useDispatch, useSelector } from 'react-redux'
import { setColorTheme } from 'utils/helpers'

import styles from './index.module.scss'
import StudioClothSign from 'assets/images/studio-sign.png'
import StudioClothDIY from 'assets/images/studio-diy.png'
import StudioCreateSection from 'components/pages/Studio/StudioCreateSection'
import StudioBallonIcon from 'assets/icons/studio-ballon.svg?component'

const Studio = () => {
  const [heroState, setHeroState] = useState({
    selected: true,
    data: 'all',
  })
  // const isLoading = useSelector<any>(state => state.isLoading)
  const dispatch = useDispatch()
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
                  <img src={StudioClothSign.src} alt="" />
                </div>
                <div className="absolute inset-0">
                  <div className={styles.mask} />
                </div>
              </div>
              <div className="absolute inset-0 flex justify-center items-center">
                <div>
                  <div className={styles.title}>Signature Creator Merch</div>
                  <div className={styles.desc}>
                    {'Shop exclusive merch by Solana’s top artists. Discover limited-edition apparel and collectibles.'}
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
                  <img src={StudioClothDIY.src} alt="" />
                </div>
                <div className="absolute inset-0">
                  <div className={styles.mask} />
                </div>
              </div>
              <div className="absolute inset-0 flex justify-center items-center">
                <div>
                  <div className={styles.title}>DIY: Curate Custom Merch</div>
                  <div className={styles.desc}>
                    {
                      'Select artwork from our Studio NFT Library and create your own merch. Choose a garment and place the design.'
                    }
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
          <StudioBallonIcon />
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

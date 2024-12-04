import React, { useEffect, useState, Suspense, lazy } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'

import Head from 'next/head'

// preview images
import PreviewImage from 'assets/images/preview-image.png'
import { getCategoryPreviewImage } from 'assets/images/categories'

// components
// import FreshMintSection from 'components/pages/Home/FreshMintSection'
// import TrendingCollectionSection from 'components/pages/Home/TrendingCollectionSection'
// import MostPopularSection from 'components/pages/Home/MostPopularSection'
// import MarketplaceReleaseSection from 'components/pages/Home/MarketplaceReleaseSection'
// import LiveAuctionSection from 'components/pages/Home/LiveAuctionSection'
// import OpenEditionSection from 'components/pages/Home/OpenEditionSection'
// import LimitedEditionSection from 'components/pages/Home/LimitedEditionSection'

// custom functions
import { useViewport } from 'utils'
import { getAbsoluteOgUrl } from 'utils/seo'

// json
import PopularCategoryList from 'assets/json/popular-category.json'

// styles
import styles from './index.module.scss'
import PrimaryLayout from 'components/Layout/PrimaryLayout'

// apis
import dashboardAPI from 'apis/dashboard'
import TopRatedArtistsSection from 'components/pages/Home/TopRatedArtistsSection'

const FreshMintSection = React.lazy(() => import('components/pages/Home/FreshMintSection'))
const TrendingCollectionSection = React.lazy(() => import('components/pages/Home/TrendingCollectionSection'))
const MostPopularSection = React.lazy(() => import('components/pages/Home/MostPopularSection'))
const MarketplaceReleaseSection = React.lazy(() => import('components/pages/Home/MarketplaceReleaseSection'))
const LiveAuctionSection = React.lazy(() => import('components/pages/Home/LiveAuctionSection'))
const OpenEditionSection = React.lazy(() => import('components/pages/Home/OpenEditionSection'))
const LimitedEditionSection = React.lazy(() => import('components/pages/Home/LimitedEditionSection'))

const Category = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [limitedEditionList, setLimitedEditionList] = useState<any>([])
  const [openEditionList, setOpenEditionList] = useState<any>([])
  const [isEditionLoaded, setIsEditionLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }, 500)
  }, [router.query.id])

  const rawQuery: string = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id ?? ''
  const cateQuery = rawQuery.toLowerCase()

  useEffect(() => {
    if (rawQuery !== cateQuery) router.replace(`/category/${cateQuery}`, undefined, { shallow: true, scroll: false })
  }, [rawQuery, cateQuery, router])

  useEffect(() => {
    if (cateQuery?.length > 0) {
      dashboardAPI.getListedEditions(cateQuery, '', 1, 15).then(response => {
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
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cateQuery])

  const categoryInfo = PopularCategoryList.find(({ query }) => query === cateQuery)

  let categoryTitle = `${categoryInfo?.name} | Foster Marketplace`
  let categoryImageUrl = getCategoryPreviewImage(cateQuery)
  if (!categoryImageUrl) {
    categoryTitle = 'Foster Marketplace'
    categoryImageUrl = PreviewImage.src
  }
  categoryImageUrl = getAbsoluteOgUrl(categoryImageUrl)
  let categoryDescription =
    'Home to creators, collectors, and curators around the world.\n' +
    'Pushing the boundaries of digital art on Solana.'

  const LoadingSpinner = () => {
    return (
      <div className="w-full h-[645px] lg:h-[610px]">
        <div className="w-[163px] h-[36px] mt-[60px] rounded-[18px] overflow-hidden">
          <div className="skeletonLoader" />
        </div>
        <div className="min-w-full h-[415px] lg:flex hidden justify-center gap-[29px] mt-[26px]">
          <div className="max-w-[295px] w-[20%] max-h-[415px] rounded-[10px] overflow-hidden">
            <div className="skeletonLoader" />
          </div>
          <div className="max-w-[295px] w-[20%] max-h-[415px] rounded-[10px] overflow-hidden">
            <div className="skeletonLoader" />
          </div>
          <div className="max-w-[295px] w-[20%] max-h-[415px] rounded-[10px] overflow-hidden">
            <div className="skeletonLoader" />
          </div>
          <div className="max-w-[295px] w-[20%] max-h-[415px] rounded-[10px] overflow-hidden">
            <div className="skeletonLoader" />
          </div>
          <div className="max-w-[295px] w-[20%] max-h-[415px] rounded-[10px] overflow-hidden">
            <div className="skeletonLoader" />
          </div>
        </div>
        <div className="w-full lg:hidden flex gap-[15px] justify-center mt-[20px]">
          <div className="min-w-[300px] w-[300px] h-[458px] rounded-[10px] overflow-hidden">
            <div className="skeletonLoader" />
          </div>

          <div className="w-[300px] h-[458px] rounded-[10px] overflow-hidden">
            <div className="skeletonLoader" />
          </div>
        </div>

        <div className="w-full lg:hidden flex justify-center mt-[30px]">
          <div className="w-[300px] h-[45px] rounded-[10px] overflow-hidden">
            <div className="skeletonLoader" />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="w-full">
      <Head>
        <title>{categoryTitle}</title>
        <meta property="description" content={categoryDescription} />

        <meta name="og:title" content={categoryTitle} />
        <meta property="og:description" content={categoryDescription} />
        <meta name="og:image" content={categoryImageUrl} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={categoryTitle} />
        <meta property="twitter:description" content={categoryDescription} />
        <meta property="twitter:image" content={categoryImageUrl} />
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className={styles.container}>
        <div className="relative w-full">
          {/* {categoryInfo?.banner_type === 'image' ? ( */}
          <div className={styles.imageContainer}>
            {/* <img
                src={viewport === 'xs' ? categoryInfo?.mobile_banner : categoryInfo?.banner}
                alt=""
                className="w-full object-cover opacity-90"
              /> */}
            <div className={styles.imageArea}>{categoryInfo?.name}</div>
          </div>
          {/* ) : (
            <></>
          )} */}
          {/* {categoryInfo?.banner_type === 'video' ? (
            <div className={styles.imageContainer}>
              {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                <img src={categoryInfo?.mobile_banner} alt="" className="w-full object-cover" />
              ) : (
                <video autoPlay loop muted>
                  <source type="video/mp4" src={categoryInfo?.banner} />
                </video>
              )}
            </div>
          ) : (
            <></>
          )} */}
        </div>
        {cateQuery.length > 0 && (
          <div className="flex justify-center">
            <div className="w-full">
              <div className={styles.liveAuctionBG}>
                <div className="g-container">
                  <Suspense fallback={<LoadingSpinner />}>
                    <LiveAuctionSection category={cateQuery} fromPage={'category'} />
                  </Suspense>
                </div>
              </div>
              <div className={styles.newReleaseSection}>
                <div className="g-container">
                  <Suspense fallback={<LoadingSpinner />}>
                    <OpenEditionSection
                      category={cateQuery}
                      isEditionLoaded={isEditionLoaded}
                      editionList={openEditionList}
                    />
                  </Suspense>
                </div>
              </div>
              <div className={styles.liveAuctionBG}>
                <div className="g-container">
                  <Suspense fallback={<LoadingSpinner />}>
                    <LimitedEditionSection
                      category={cateQuery}
                      isEditionLoaded={isEditionLoaded}
                      editionList={limitedEditionList}
                    />
                  </Suspense>
                </div>
              </div>
              <div className={styles.newReleaseSection}>
                <div className="g-container">
                  <Suspense fallback={<LoadingSpinner />}>
                    <MarketplaceReleaseSection category={cateQuery} setVisibleBoundary={() => {}} />
                  </Suspense>
                </div>
              </div>
              <div className={styles.liveAuctionBG}>
                <div className="g-container mt-[60px]">
                  <Suspense fallback={<LoadingSpinner />}>
                    <MostPopularSection category={cateQuery} />
                  </Suspense>
                </div>
              </div>

              <div className={styles.newReleaseSection}>
                <div className="g-container">
                  <Suspense fallback={<LoadingSpinner />}>
                    <TopRatedArtistsSection />
                  </Suspense>
                </div>
              </div>

              <div className={styles.liveAuctionBG}>
                <div className="g-container">
                  <Suspense fallback={<LoadingSpinner />}>
                    <FreshMintSection category={cateQuery} />
                  </Suspense>
                </div>
              </div>

              <div className={styles.liveAuctionBG}>
                <div className="g-container">
                  <Suspense fallback={<LoadingSpinner />}>
                    <TrendingCollectionSection category={cateQuery} loop={false} />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Category

Category.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

Category.getInitialProps = () => ({})

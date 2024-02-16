import React, { useEffect } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch, useSelector } from 'react-redux'

import Head from 'next/head'

// preview images
import PreviewImage from 'assets/images/preview-image.png'
import { getCategoryPreviewImage } from 'assets/images/categories'

// components
import TrendingCollectionSection from 'components/pages/Home/TrendingCollectionSection'
import MostPopularSection from 'components/pages/Home/MostPopularSection'
import MarketplaceReleaseSection from 'components/pages/Home/MarketplaceReleaseSection'
import LiveAuctionSection from 'components/pages/Home/LiveAuctionSection'
import FreshMintSection from 'components/pages/Home/FreshMintSection'

// custom functions
import { useViewport } from 'utils'
import { getAbsoluteOgUrl } from 'utils/seo'

// json
import PopularCategoryList from 'assets/json/popular-category.json'

// styles
import styles from './index.module.scss'
import PopularCategorySection from 'components/pages/Home/PopularCategorySection'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'
import PrimaryLayout from 'components/Layout/PrimaryLayout'

const Category = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const isLoading = useSelector<any>(state => state.isLoading)
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      dispatch({ type: 'set', isLoading: false })
    }, 500)
    dispatch({ type: 'set', isLoading: true })
  }, [router.query.id])

  const rawQuery: string = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id ?? ''
  const cateQuery = rawQuery.toLowerCase()
  useEffect(() => {
    if (rawQuery !== cateQuery) router.replace(`/category/${cateQuery}`, undefined, { shallow: true, scroll: false })
  }, [rawQuery, cateQuery, router])
  const categoryInfo = PopularCategoryList.find(({ query }) => query === cateQuery)

  let categoryTitle = `${categoryInfo?.name} | Foster Marketplace`
  let categoryImageUrl = getCategoryPreviewImage(cateQuery)
  if (!categoryImageUrl) {
    categoryTitle = 'Foster Marketplace'
    categoryImageUrl = PreviewImage.src
  }
  categoryImageUrl = getAbsoluteOgUrl(categoryImageUrl)
  let categoryDescription =
    "Solana's first DAO governed NFT marketplace for art and music.\n" + 'Create, collect and curate the flavor.\n'

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
          {categoryInfo?.banner_type === 'image' ? (
            <div className={styles.imageContainer}>
              <img
                src={viewport === 'xs' ? categoryInfo?.mobile_banner : categoryInfo?.banner}
                alt=""
                className="w-full object-cover opacity-90"
              />
              <div className={styles.imageArea}>{categoryInfo?.name}</div>
            </div>
          ) : (
            <></>
          )}
          {categoryInfo?.banner_type === 'video' ? (
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
          )}
        </div>
        {cateQuery.length > 0 && (
          <div className="flex justify-center">
            <div className="g-container lg:pt-[70px]">
              <TrendingCollectionSection category={cateQuery} loop={false} />
              <MostPopularSection category={cateQuery} />
              <MarketplaceReleaseSection category={cateQuery} />
              <LiveAuctionSection category={cateQuery} fromPage={'category'} />
              <FreshMintSection category={cateQuery} />
              <PopularCategorySection type="category" />
            </div>
          </div>
        )}
        <FullScreenLoadingModal open={isLoading} />
      </div>
    </div>
  )
}

export default Category

Category.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

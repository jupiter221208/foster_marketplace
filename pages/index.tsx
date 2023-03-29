// next components
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

// components
import PrimaryLayout from 'components/Layout/PrimaryLayout'
import MainSection from 'components/pages/Home/MainSection'
import PopularCategorySection from 'components/pages/Home/PopularCategorySection'
import TopRatedArtistsSection from 'components/pages/Home/TopRatedArtistsSection'
import MostPopularSection from 'components/pages/Home/MostPopularSection'
import MarketplaceReleaseSection from 'components/pages/Home/MarketplaceReleaseSection'
import FreshMintSection from 'components/pages/Home/FreshMintSection'
import TrendingCollectionSection from 'components/pages/Home/TrendingCollectionSection'
import LiveAuctionSection from 'components/pages/Home/LiveAuctionSection'
import CreateSellNFTSection from 'components/pages/Home/CreateSellNFTSection'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'

// images
import PreviewImage from 'assets/images/preview-image.png'

// custom functions
import { useDetectRouterPath } from 'utils'
import { getAbsoluteOgUrl } from 'utils/seo'

// third party components
import { useDispatch, useSelector } from 'react-redux'
import { setColorTheme } from 'utils/helpers'

const Home = () => {
  const isLoading = useSelector<any>(state => state.isLoading)
  useDetectRouterPath(useRouter())

  let pageTitle = 'Foster Marketplace'
  let pageImageUrl = getAbsoluteOgUrl(PreviewImage.src)
  let pageDescription =
    "Solana's first DAO governed NFT marketplace for art and music.\n" + 'Create, collect and curate the flavor.'

  const lightDarkMode = useSelector(state => (state as any).lightMode)

  useEffect(() => {
    setColorTheme(lightDarkMode)
  }, [])

  return (
    <div className="g-container">
      <Head>
        <title>{pageTitle}</title>
        <meta property="description" content={pageDescription} />

        <meta name="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta name="og:image" content={pageImageUrl} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={pageImageUrl} />

        <link rel="icon" href="/logo.png" />
      </Head>

      <MainSection />
      <PopularCategorySection type="home" />
      <TopRatedArtistsSection />
      <TrendingCollectionSection category={''} />
      <MostPopularSection category={''} />
      <MarketplaceReleaseSection category={''} />
      {/* <FreshMintSection category={''} /> */}
      <LiveAuctionSection category={''} />
      <CreateSellNFTSection />

      <FullScreenLoadingModal open={isLoading} />
    </div>
  )
}

export default Home

Home.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

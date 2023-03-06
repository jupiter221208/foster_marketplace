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

// third party components
import { useDispatch, useSelector } from 'react-redux'

const Home = () => {
  const isLoading = useSelector<any>(state => state.isLoading)
  useDetectRouterPath(useRouter())

  let pageTitle = 'Foster Marketplace'
  let pageImageUrl = PreviewImage.src
  let pageDescription =
    "Solana's first DAO governed NFT marketplace for art and music.\n" + 'Create, collect and curate the flavor.'

  const lightMode = useSelector(state => (state as any).lightMode)
  const dispatch = useDispatch()

  useEffect(() => {
    const doc = document.documentElement
    if (lightMode) {
      // Light Mode
      dispatch({ type: 'set', lightMode: true })
      doc.style.setProperty('--background-main-color', '#eff0f6')
      doc.style.setProperty('--text-gray-200-color', '#202427')
      doc.style.setProperty('--header-bg-color1', '185, 186, 192')
      doc.style.setProperty('--header-bg-color2', '227, 228, 235')
      doc.style.setProperty('--header-bg-color3', '228, 229, 236')
      doc.style.setProperty('--outline-button-border', '#202427')
      doc.style.setProperty('--outline-button-color', '#202427')
      doc.style.setProperty('--avatar-border-color1', '#202427')
      doc.style.setProperty('--avatar-border-color2', '#6a6c6e')
      doc.style.setProperty('--text-trending-card-color', 'rgba(149, 219, 213, 1)')
    } else {
      // Dark Mode
      dispatch({ type: 'set', lightMode: false })
      doc.style.setProperty('--background-main-color', '#0c1013')
      doc.style.setProperty('--text-gray-200-color', '#eff0f6')
      doc.style.setProperty('--header-bg-color1', '48, 98, 96')
      doc.style.setProperty('--header-bg-color2', '20, 32, 33')
      doc.style.setProperty('--header-bg-color3', '32, 36, 39')
      doc.style.setProperty('--outline-button-border', '#5ac3ba')
      doc.style.setProperty('--outline-button-color', '#eff0f6')
      doc.style.setProperty('--avatar-border-color1', '#4ea19b')
      doc.style.setProperty('--avatar-border-color2', '#304e4e')
      doc.style.setProperty('--text-trending-card-color', 'rgba(239, 240, 247, 0.75)')
    }
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
      <FreshMintSection category={''} />
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

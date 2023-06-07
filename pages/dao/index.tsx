import React, { useEffect, useState } from 'react'

// next images
import Head from 'next/head'

// solana
import { useWallet } from '@solana/wallet-adapter-react'
import { useMetaplex } from 'hooks/useMetaplex'
import { GetMyNFTsOutput, getMyNFTs } from 'utils/nfts.utils'
import { TURKEY_CIRCUS_COLLECTION_ID } from 'utils/dao'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg?component'
import DaoPreviewImage from 'assets/images/dao-preview-image.png'

// styles
import styles from './index.module.scss'
import { useViewport } from 'utils'
import DaoComingSoon from 'components/pages/Dao/DaoComingSoon'
import DaoLandingPage from 'components/pages/Dao/DaoLandingPage'
import DaoLandingDetail from 'components/pages/Dao/DaoLandingDetail'

const Dao = () => {
  // const [showCircus, setShowCircus] = useState(false)
  // const [showLift, setShowLift] = useState(false)
  // const [daoSetup, setDaoSetup] = useState(false)
  const [daoPage, setDaoPage] = useState('landing')
  const [proposal, setProposal] = useState()
  const { connected, publicKey } = useWallet()
  const { metaplex } = useMetaplex()
  const [nftIsLoaded, setNftIsLoaded] = useState(false)

  const [nfts, setNfts] = useState<GetMyNFTsOutput>([])

  useEffect(() => {
    ;(async () => {
      if (connected) {
        let nfts = await getMyNFTs(metaplex)
        setNftIsLoaded(true)
        setNfts(nfts)
      }
    })()
  }, [metaplex, connected])

  const [turkyNfts, setTurkeyNfts] = useState<GetMyNFTsOutput | null>(null)
  useEffect(() => {
    setTurkeyNfts(
      nfts.filter(({ collection }) => collection?.verified && TURKEY_CIRCUS_COLLECTION_ID.equals(collection.address))
    )
  }, [nfts])

  const viewport = useViewport()

  let pageTitle = `CircusDAO | Foster Marketplace`
  let pageImageUrl = DaoPreviewImage.src
  let pageDescription = 'A community of artists and builders shaping the evolution of Foster Marketplace.'

  return (
    <div className="g-container">
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
      <div className="w-full relative flex justify-center">
        <div className={styles.topLeftEllipse}>
          {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
        </div>

        {/* {daoPage === 'start' ? (
          <DaoComingSoon onConnect={() => setDaoPage('landing')} />
        ) :  */}
        <div className="w-full mt-[40px] lg:mt-[115px] z-10">
          <DaoLandingPage turkyNfts={turkyNfts} nftIsLoaded={nftIsLoaded} />
        </div>
      </div>
    </div>
  )
}

export default Dao

Dao.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}

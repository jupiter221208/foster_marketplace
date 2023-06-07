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
import DaoLandingDetail from 'components/pages/Dao/DaoLandingDetail'
import axios from 'axios'
import { useRouter } from 'next/router'

const Dao = () => {
  const router = useRouter()

  const [proposal, setProposal] = useState(null)
  const { connected, publicKey } = useWallet()
  const { metaplex } = useMetaplex()
  const [nftIsLoaded, setNftIsLoaded] = useState(false)

  const [nfts, setNfts] = useState<GetMyNFTsOutput>([])
  const { id } = router.query
  const proposal_title = id

  useEffect(() => {
    ;(async () => {
      if (connected) {
        let nfts = await getMyNFTs(metaplex)
        setNftIsLoaded(true)
        setNfts(nfts)
      }
      // get proposal detail
      getProposal()
    })()
  }, [metaplex, connected])

  const [turkyNfts, setTurkeyNfts] = useState<GetMyNFTsOutput | null>(null)
  useEffect(() => {
    setTurkeyNfts(
      nfts.filter(({ collection }) => collection?.verified && TURKEY_CIRCUS_COLLECTION_ID.equals(collection.address))
    )
  }, [nfts])

  const getProposal = async () => {
    try {
      let vote = {
        proposal_title,
      }

      let response = await axios.post('api/dao/proposal-detail-with-title', vote)
      if (response.data.success === true) {
        let proposals = response.data.proposals

        if (proposals.length > 0) {
          setProposal(proposals[0])
        }
      }
    } catch {}
  }

  const viewport = useViewport()

  let pageTitle = `CircusDAO | ${proposal_title}`
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
        {proposal !== null && (
          <DaoLandingDetail
            publicKey={publicKey}
            proposal={proposal}
            turkyNfts={turkyNfts}
            nftIsLoaded={nftIsLoaded}
            onBack={() => router.push('/dao')}
          />
        )}
      </div>
    </div>
  )
}

export default Dao

Dao.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}

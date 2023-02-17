import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// next components
import Head from 'next/head'
import Image from 'next/image'

// solana
import { Connection, PublicKey } from '@solana/web3.js'
import { Metaplex, type Nft, type LazyBid } from '@metaplex-foundation/js'
import { getNFTCategories } from 'utils/nfts.utils'

// third party components
import { useDispatch } from 'react-redux'

// components
import PrimaryLayout from 'components/Layout/PrimaryLayout'
import MainSection from 'components/pages/LiveAuction/MainSection'
import MoreCollectionSection from 'components/pages/LiveAuction/MoreCollectionSection'
import MoreArtistSection from 'components/pages/LiveAuction/MoreArtistSection'
import MoreCategorySection from 'components/pages/LiveAuction/MoreCategorySection'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import DefaultNftBG from 'assets/images/default-nft-bg.png'

// styles
import styles from './index.module.scss'

// api
import nftsAPI, { NFT } from 'apis/nfts'
import { isString } from 'utils/helpers'

interface LiveAuctionProps {
  nftDetail?: Nft
  error?: string
}

const LiveAuction = ({ nftDetail }: LiveAuctionProps) => {
  const dispatch = useDispatch()
  dispatch({ type: 'set', isLoading: false })
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [artistInfo, setArtistInfo] = useState(null)
  const categories = getNFTCategories(nftDetail)
  const collectionId = nftDetail.collection?.address.toString()

  useEffect(() => {
    if (!nftDetail) return
    nftsAPI.getDetail(nftDetail.address).then(
      (response: any) => {
        if (!isString(response)) {
          if (response.creator_address !== null) {
            setArtistInfo({ address: response.creator_address, name: response.creator_username })
          }
          setLoading(false)
        }
      },
      error => {
        setLoading(false)
      }
    )
  }, [nftDetail])

  let nftName = `${nftDetail?.name} | Foster Marketplace`
  let nftImageUrl = nftDetail?.json?.image ?? DefaultNftBG.src
  let nftDescription =
    "Solana's first DAO governed NFT marketplace for art and music.\n" + 'Create, collect and curate the flavor.'

  return (
    <div className="g-container">
      <Head>
        <title>{nftName}</title>
        <meta property="description" content={nftDescription} />

        <meta name="og:title" content={nftName} />
        <meta property="og:description" content={nftDescription} />
        <meta name="og:image" content={nftImageUrl} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={nftName} />
        <meta property="twitter:description" content={nftDescription} />
        <meta property="twitter:image" content={nftImageUrl} />

        <link rel="icon" href="/logo.png" />
      </Head>
      <div className={styles.container}>
        <div className={styles.topRightEllipse}>
          <Image src={EllipseGreen} width={2021} height={2021} alt="" objectFit="cover" />
        </div>
        <div className={styles.bottomLeftEllipse}>
          <Image src={EllipseGreen} width={2021} height={2021} alt="" objectFit="cover" />
        </div>
        <div className="z-10">
          <MainSection nftDetail={nftDetail} loading={loading} />
          {collectionId && <MoreCollectionSection collectionId={collectionId} />}
          {artistInfo && <MoreArtistSection artistInfo={artistInfo} />}
          <MoreCategorySection categories={categories} />
        </div>
      </div>
    </div>
  )
}

export default LiveAuction

LiveAuction.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

LiveAuction.getInitialProps = async function ({ res, query }): Promise<LiveAuctionProps> {
  let mintAddress
  try {
    mintAddress = new PublicKey(query.id)
  } catch (e: any) {
    console.error(e)
    return {
      error: `could not parse as public key: ${query.id}: ${e.message}`,
    }
  }

  let metaplex = await Metaplex.make(new Connection(process.env.PROVIDER_URL))

  let nftDetail
  try {
    nftDetail = await metaplex.nfts().findByMint({ mintAddress })
    return {
      nftDetail,
    }
  } catch (e: any) {
    console.error(e)
    return {
      error: `could not load metadata for nft ${mintAddress}: ${e.message}`,
    }
  }
}

import React, { useEffect, useState } from 'react'

// next components
import Head from 'next/head'
import Image from 'next/image'

// solana
import { Connection, PublicKey } from '@solana/web3.js'
import { Metaplex } from '@metaplex-foundation/js'
import type { Sft, Nft } from '@metaplex-foundation/js'

// components
import PrimaryLayout from 'components/Layout/PrimaryLayout'
import MainSection from 'components/pages/BrowseNFT/MainSection'
import MoreCollectionSection from 'components/pages/BrowseNFT/MoreCollectionSection'
import MoreArtistSection from 'components/pages/BrowseNFT/MoreArtistSection'
import MoreCategorySection from 'components/pages/BrowseNFT/MoreCategorySection'

// custom functions
import { getNFTCategories, NFTArtistInfo } from 'utils/nfts.utils'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import EllipseGreenLight from 'assets/icons/ellipse-green-light.svg'

// third party components
import { useDispatch, useSelector } from 'react-redux'

// styles
import styles from './index.module.scss'

// resources
import DefaultNftBG from 'assets/images/default-nft-bg.png'

import nftsAPI from 'apis/nfts'
import { isString } from 'utils/helpers'

export interface BrowseNFTProps {
  nftDetail?: Sft | Nft
  error?: string
}

const BrowseNFT = ({ nftDetail, error }: BrowseNFTProps) => {
  const dispatch = useDispatch()
  dispatch({ type: 'set', isLoading: false })
  const nftType = nftDetail?.json?.properties?.category as string
  const categories = getNFTCategories(nftDetail)
  const [nftInfo, setNftInfo] = useState(null)
  const [artistInfo, setArtistInfo] = useState<NFTArtistInfo | null>(null)
  const profileInfo = useSelector(state => (state as any).profileInfo)
  const lightMode = useSelector(state => (state as any).lightMode)

  useEffect(() => {
    if (!nftDetail) return
    nftsAPI.getDetail(nftDetail.address).then(
      (response: any) => {
        if (!isString(response)) {
          setNftInfo(response)
          if (response.creator_address !== null) {
            setArtistInfo({ address: response.creator_address, name: response.creator_username })
          }
        }
      },
      error => {}
    )
  }, [nftDetail, profileInfo])

  const collectionId = nftDetail?.collection?.address.toString()

  let nftTitle = `${(nftDetail?.name || nftDetail?.json?.name) ?? ''} | Foster Marketplace`
  let nftImageUrl = nftDetail?.json?.image ?? DefaultNftBG.src

  let nftDescription =
    "Solana's first DAO governed NFT marketplace for art and music.\n" + 'Create, collect and curate the flavor.\n'

  return (
    <div className="g-container">
      <Head>
        <title>{nftTitle}</title>
        <meta property="description" content={nftDescription} />

        <meta name="og:title" content={nftTitle} />
        <meta property="og:description" content={nftDescription} />
        {nftType && <meta name="og:type" content={nftType} />}
        <meta name="og:image" content={nftImageUrl} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={nftTitle} />
        <meta property="twitter:description" content={nftDescription} />
        <meta property="twitter:image" content={nftImageUrl} />

        <link rel="icon" href="/logo.png" />
      </Head>
      <div className={styles.container}>
        <div className={styles.topLeftEllipse}>
          <Image
            src={lightMode ? EllipseGreenLight : EllipseGreen}
            width={2021}
            height={2021}
            alt=""
            objectFit="cover"
          />
        </div>
        <div className={styles.topRightEllipse}>
          <Image
            src={lightMode ? EllipseGreenLight : EllipseGreen}
            width={2021}
            height={2021}
            alt=""
            objectFit="cover"
          />
        </div>
        <div className={styles.bottomLeftEllipse}>
          <Image
            src={lightMode ? EllipseGreenLight : EllipseGreen}
            width={2021}
            height={2021}
            alt=""
            objectFit="cover"
          />
        </div>
        <div className="z-10">
          {nftDetail && <MainSection nftDetail={nftDetail} artistInfo={artistInfo} nftInfo={nftInfo} />}
          {collectionId && <MoreCollectionSection collectionId={collectionId} />}
          {artistInfo && <MoreArtistSection artistInfo={artistInfo} />}
          <MoreCategorySection categories={categories} />
        </div>
      </div>
    </div>
  )
}

export default BrowseNFT

BrowseNFT.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

BrowseNFT.getInitialProps = async function ({ res, query }): Promise<any> {
  let mintAddress
  try {
    mintAddress = new PublicKey(query.id)
  } catch (e: any) {
    console.error(e)
    return {
      error: `could not parse as public key: ${query.id}: ${e.message}`,
    }
  }

  try {
    return {
      nftDetail: await Metaplex.make(new Connection(process.env.PROVIDER_URL)).nfts().findByMint({ mintAddress }),
    }
  } catch (e: any) {
    console.error(e)
    return {
      error: `could not load nft: ${query.id}: ${e.message}`,
    }
  }
}

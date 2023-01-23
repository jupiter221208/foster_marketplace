import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// next components
import Head from 'next/head'
import Image from 'next/image'

import type { GetServerSideProps } from 'next'

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
import { useViewport } from 'utils'
import {
  getNFTCategories,
  getNFTArtistInfo,
  NFTArtistInfo
} from 'utils/nfts.utils'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'

// third party components
import { useDispatch } from 'react-redux'

// styles
import styles from './index.module.scss'

// api
import nftsAPI, { NFT } from 'apis/nfts'
import { isString } from 'utils/helpers'

export interface BrowseNFTProps{
  nftDetail?: Sft | Nft;
  error?: string;
}

const BrowseNFT = ({ nftDetail, error }: BrowseNFTProps) => {
  const dispatch = useDispatch()
  dispatch({ type: 'set', isLoading: false })

  const nftType = nftDetail.json?.properties?.category as string;
  const categories = getNFTCategories(nftDetail)

  const [artistInfo, setArtistInfo] = useState<NFTArtistInfo | null>(null)
  useEffect(() => {
    getNFTArtistInfo(nftDetail)
      .then(setArtistInfo)
  }, [nftDetail])

  let nftTitle = nftDetail.name
  const collectionId = nftDetail.collection?.address.toString()

  return (
    <div className="g-container">
      <Head>
        <title>{`Foster Marketplace - ${nftTitle}}`}</title>
        <meta name="description" content={nftDetail.json?.description} />
        <meta name="og:title" content={nftTitle} />
        {nftType && <meta name="og:type" content={nftType} />}
        {
          // TODO: add default image url for broken images
          (typeof nftDetail.json?.animation_url == 'string')
          ? <meta name="og:video" content={nftDetail.json?.animation_url as string}  />
          : <meta name="og:image" content={nftDetail.json?.image ?? ''} />
        }

        <link rel="icon" href="/logo.svg" />
      </Head>
      <div className={styles.container}>
        <div className={styles.topRightEllipse}>
          <Image src={EllipseGreen} width={2021} height={2021} alt="" objectFit="cover" />
        </div>
        <div className={styles.bottomLeftEllipse}>
          <Image src={EllipseGreen} width={2021} height={2021} alt="" objectFit="cover" />
        </div>
        <div className="z-10">
          {nftDetail && <MainSection nftDetail={nftDetail} artistInfo={artistInfo} />}
          {collectionId !== null && <MoreCollectionSection collectionId={collectionId} />}
          {artistInfo !== null && <MoreArtistSection artistInfo={artistInfo} />}
          <MoreCategorySection categories={categories} />
        </div>
      </div>
    </div>
  )
}

BrowseNFT.getInitialProps = async function({ res, query }): Promise<any>{
  let mintAddress
  try{
    mintAddress = new PublicKey(query.id)
  }
  catch(e: any){
    console.error(`could not parse as public key: ${query.id}: ${e.message}`)
    console.error(e)

    res.redirect('/')
    return {
      error: e.toString()
    }
  }

  try{
    let nftDetail = await Metaplex
      .make(new Connection(process.env.PROVIDER_URL))
      .nfts()
      .findByMint({ mintAddress })

    if(!nftDetail){
      console.log(`could not load nft: ${mintAddress}`)
      res.redirect('/')
      return {}
    }

    return {
      nftDetail,
    }
  }
  catch(e: any){
    return {
      error: e.toString()
    }
  }
}

export default BrowseNFT

BrowseNFT.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

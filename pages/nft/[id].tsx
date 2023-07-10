import React, { useEffect, useState, useRef } from 'react'

// next components
import Head from 'next/head'
import Image from 'next/image'

// solana
import { Connection, PublicKey } from '@solana/web3.js'
import { Metaplex, toOriginalEditionAccount, type OriginalEditionAccountData } from '@metaplex-foundation/js'
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
import EllipseGreen from 'assets/icons/ellipse-green.svg?component'
import CloseIcon from 'assets/icons/close-screen.svg'

// third party components
import { useDispatch, useSelector } from 'react-redux'

// styles
import styles from './index.module.scss'

// resources
import DefaultNftBG from 'assets/images/default-nft-bg.png'

import nftsAPI from 'apis/nfts'
import { isString } from 'utils/helpers'
import { useViewport } from 'utils'
import { getAbsoluteOgUrl } from 'utils/seo'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'

export interface EditionDetail {
  number: number
  supply: number
  maxSupply?: number
}

export interface BrowseNFTProps {
  nftDetail?: Nft
  editionDetail?: EditionDetail
  originalEditionDetail?: OriginalEditionAccountData
  mintAddress?: PublicKey
  error?: string
}

const BrowseNFT = ({ nftDetail, editionDetail, originalEditionDetail, mintAddress, error }: BrowseNFTProps) => {
  const nftType = nftDetail?.json?.properties?.category as string
  const isLoading = useSelector<any>(state => state.isLoading)
  const categories = getNFTCategories(nftDetail)
  const [nftInfo, setNftInfo] = useState(null)
  const [artistInfo, setArtistInfo] = useState<NFTArtistInfo | null>(null)
  const profileInfo = useSelector(state => (state as any).profileInfo)
  const viewport = useViewport()

  useEffect(() => {
    setTimeout(
      () =>
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        }),
      500
    )
  }, [])

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

  let nftName = (nftDetail?.name || nftDetail?.json?.name) ?? ''
  if (editionDetail) {
    let { number, supply, maxSupply } = editionDetail
    let supplyInfo = `#${number}/${supply}`
    if (supply !== maxSupply) supplyInfo = `edition ${number}/${supply}, max ${maxSupply ?? '\u221e'}`
    nftName = `${nftName} (${supplyInfo})`
  }
  let nftTitle = `${nftName} | Foster Marketplace`
  let nftImageUrl = getAbsoluteOgUrl(nftDetail?.json?.image ?? DefaultNftBG.src)

  let nftDescription =
    "Solana's first DAO governed NFT marketplace for art and music.\n" + 'Create, collect and curate the flavor.\n'

  const [nftCoverUrl, setNftCoverUrl] = useState('')
  const [fullScreenMode, setFullScreenMode] = useState(false)

  const setFullScreenView = url => {
    window.scrollTo({
      top: 0,
    })
    document.body.style.overflow = 'hidden'
    setFullScreenMode(true)
    setNftCoverUrl(url)
  }

  const reloadNftData = () => {
    if (!nftDetail) return
    setNftInfo(null)
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
  }

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
          {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
        </div>
        <div className={styles.topRightEllipse}>
          {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
        </div>
        <div className={styles.bottomLeftEllipse}>
          {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
        </div>
        <div className="z-10">
          {nftDetail && (
            <MainSection
              nftDetail={nftDetail}
              editionDetail={editionDetail}
              artistInfo={artistInfo}
              nftInfo={nftInfo}
              setFullScreenView={setFullScreenView}
              reloadNftData={reloadNftData}
            />
          )}
          {collectionId && <MoreCollectionSection collectionId={collectionId} />}
          {artistInfo && <MoreArtistSection artistInfo={artistInfo} />}
          <MoreCategorySection categories={categories} />
        </div>
      </div>

      {fullScreenMode && (
        <div className={styles.fullScreen}>
          <img src={nftCoverUrl} alt="" className="h-full object-fit" />
          <div
            className={styles.closeScreen}
            onClick={() => {
              setFullScreenMode(false)
              document.body.style.overflow = 'unset'
            }}
          >
            <Image src={CloseIcon} alt="" width={18} height={18} />
          </div>
        </div>
      )}
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
    const metaplex = Metaplex.make(new Connection(process.env.PROVIDER_URL))
    let nftDetail = await metaplex.nfts().findByMint({ mintAddress })
    if (nftDetail.model == 'sft') throw new Error('expected nft, found sft')

    let editionDetail = null
    let originalEditionDetail = null
    if ('parent' in nftDetail.edition) {
      originalEditionDetail = toOriginalEditionAccount(await metaplex.rpc().getAccount(nftDetail.edition.parent)).data
      editionDetail = {
        number: nftDetail.edition.number.toNumber(),
        supply: originalEditionDetail.supply.toNumber(),
        maxSupply: originalEditionDetail.maxSupply?.toNumber(),
      }
    }
    return {
      nftDetail,
      editionDetail,
      originalEditionDetail,
      mintAddress,
    }
  } catch (e: any) {
    console.error(e)
    return {
      error: `could not load nft: ${query.id}: ${e.message}`,
    }
  }
}

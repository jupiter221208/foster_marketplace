import React, { useEffect, useState, useRef } from 'react'

// next components
import Head from 'next/head'
import Image from 'next/image'

// solana
import { Connection, PublicKey } from '@solana/web3.js'
import { Metaplex, toOriginalEditionAccount, OriginalEditionAccountData } from '@metaplex-foundation/js'
import type { Sft, Nft } from '@metaplex-foundation/js'
import { useWallet } from '@solana/wallet-adapter-react'

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
  const [collectionName, setCollectionName] = useState('')
  const [artistInfo, setArtistInfo] = useState<NFTArtistInfo | null>(null)
  const { connected } = useWallet()
  const profileInfo = useSelector(state => (state as any).profileInfo)
  const viewport = useViewport()
  const dispatch = useDispatch()
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    setTimeout(
      () =>
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        }),
      500
    )
    dispatch({ type: 'set', isLoading: true })
  }, [])

  useEffect(() => {
    if (isLoading === false) setShowLoading(false)
  }, [isLoading])

  useEffect(() => {
    if (!nftDetail) return
    if (connected) {
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
    } else {
      nftsAPI.get(nftDetail.address).then(
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
    'Home to creators, collectors, and curators around the world.\n' +
    'Pushing the boundaries of digital art on Solana.'

  const [nftCoverUrl, setNftCoverUrl] = useState('')
  const [fullScreen, setFullScreen] = useState(false)
  const setFullScreenView = url => {
    window.scrollTo({
      top: 0,
    })
    document.body.style.overflow = 'hidden'
    setFullScreen(true)
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
        <div className="z-10 mb-[100px] lg:mb-[0px]">
          {nftDetail && (
            <MainSection
              nftDetail={nftDetail}
              editionDetail={editionDetail}
              nftInfo={nftInfo}
              setFullScreenView={setFullScreenView}
              reloadNftData={reloadNftData}
              setCollectionName={setCollectionName}
            />
          )}
          {collectionId && <MoreCollectionSection collectionId={collectionId} collectionName={collectionName} />}
          {connected && artistInfo && <MoreArtistSection artistInfo={artistInfo} />}
          <MoreCategorySection categories={categories} />
        </div>
      </div>

      {fullScreen && (
        <div className={styles.fullScreen}>
          <img src={nftCoverUrl} alt="" className="w-full h-full max-w-full max-h-full object-contain" />
          <div
            className={styles.closeScreen}
            onClick={() => {
              setFullScreen(false)
              document.body.style.overflow = 'unset'
            }}
          >
            <Image src={CloseIcon} alt="" width={18} height={18} />
          </div>
        </div>
      )}

      <FullScreenLoadingModal open={showLoading} />
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

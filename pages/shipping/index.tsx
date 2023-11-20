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
import ShopApparelList from 'assets/json/browse-nft/shop-apparel-list.json'
import ShopWallartlList from 'assets/json/browse-nft/shop-wallart-list.json'

import nftsAPI from 'apis/nfts'
import { isString } from 'utils/helpers'
import { useViewport } from 'utils'
import { getAbsoluteOgUrl } from 'utils/seo'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'
import { useAuthentication } from 'hooks/useAuthentication'
import MerchApparelSection from 'components/pages/BrowseNFT/MerchSection/MerchApparelSection'
import ShippingApparelSection from 'components/pages/BrowseNFT/MerchSection/ShippingMerchApparelSection/ShippingApparelSection'
import ShippingMerchApparelSection from 'components/pages/BrowseNFT/MerchSection/ShippingMerchApparelSection'

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

const Shipping = ({ nftDetail, editionDetail }: BrowseNFTProps) => {
  const nftType = nftDetail?.json?.properties?.category as string
  const isLoading = useSelector<any>(state => state.isLoading)
  const orders = useSelector(state => (state as any).orders)
  const [apparelData, setApparelData] = useState(null)
  const [openApparelDetail, setOpenApparelDetail] = useState(false)
  const [finishEditing, setFinishEditing] = useState(false)
  const { connected } = useWallet()
  const { profileInfo } = useAuthentication()
  const [data, setData] = useState(null)
  const dispatch = useDispatch()
  const [showLoading, setShowLoading] = useState(true)
  const [showApparelMode, setShowApparelMode] = useState(null)
  const [apparel, setApparel] = useState(null)
  const [nftInfo, setNftInfo] = useState(null)
  const [artistInfo, setArtistInfo] = useState<NFTArtistInfo | null>(null)

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
    setApparelData(orders[0])
    nftsAPI.getDetail(orders[0].id).then((response: any) => {
      const nftName = response.name
      const nftCoverUrl = response.cover_image_url
      const mintAddress = response.address.toString()
      const item = ShopApparelList.find(apparel => apparel.name === orders[0].apparel.name)
      let params = {
        nftName,
        nftCoverUrl,
        mintAddress,
        category: item.category,
        subCategory: item.sub_type,
        base: item.base,
      }
      setData(params)
      setShowApparelMode(params.category === 'apparel')
    })
  }, [])

  useEffect(() => {
    if (data?.category === 'apparel') {
      setOpenApparelDetail(true)
    }
  }, [data])

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

  const [shopApparelList, setShopApparelList] = useState(ShopApparelList)
  const [merchToggle, setMerchToggle] = useState(false)

  return (
    <div className="w-full h-full">
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
      <div className="g-container z-10">
        <div className={styles.container}>
          <div className="w-full grid grid-cols-2 gap-10">
            <div className="col-span-2 lg:col-span-1 lg:flex hidden">
              <div className={styles.blurBackground}>
                <div className="absolute inset-0">
                  <img src={data?.nftCoverUrl} alt="" className="min-w-full min-h-full object-cover" />
                </div>
                <div className={styles.blurImage} />
                <ShippingApparelSection
                  canvasId="canvas"
                  nftName={data?.nftName}
                  apparel={apparel}
                  nftCoverUrl={data?.nftCoverUrl}
                  finishEditing={finishEditing}
                />
              </div>
            </div>
            <div className="col-span-2 lg:col-span-1 z-10">
              {openApparelDetail && (
                <ShippingMerchApparelSection
                  nftData={apparelData}
                  nftName={data?.nftName}
                  nftCoverUrl={data?.nftCoverUrl}
                  mintAddress={data?.mintAddress}
                  open={openApparelDetail}
                  subCategory={data?.subCategory}
                  base={data?.base}
                  setFinishEditing={editing => setFinishEditing(editing)}
                  setApparel={apparel => setApparel(apparel)}
                  setShowApparelMode={mode => setShowApparelMode(mode)}
                />
              )}
            </div>
          </div>
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

export default Shipping

Shipping.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

Shipping.getInitialProps = async function ({ res, query }): Promise<any> {
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

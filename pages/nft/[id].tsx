import React, { useEffect, useState, useRef } from 'react'

// next components
import Head from 'next/head'
import Image from 'next/image'

// solana
import { Connection, PublicKey } from '@solana/web3.js'
import { Metaplex, toOriginalEditionAccount, toOriginalOrPrintEditionAccount } from '@metaplex-foundation/js'
import { useWallet } from '@solana/wallet-adapter-react'

// components
import PrimaryLayout from 'components/Layout/PrimaryLayout'
import MainSection from 'components/pages/BrowseNFT/MainSection'
import MerchSection from 'components/pages/BrowseNFT/MerchSection'
import MoreCollectionSection from 'components/pages/BrowseNFT/MoreCollectionSection'
import MoreArtistSection from 'components/pages/BrowseNFT/MoreArtistSection'
import MoreCategorySection from 'components/pages/BrowseNFT/MoreCategorySection'
import ShopApparelSection from 'components/pages/BrowseNFT/ShopApparelSection'

// custom functions
import { determineCategory, getNFTCategories, getNftFromDAS, getNftFromRpc, NFTArtistInfo } from 'utils/nfts.utils'

// images and icons
import CloseIcon from 'assets/icons/close-screen.svg'

// third party components
import { useDispatch, useSelector } from 'react-redux'

// styles
import styles from './index.module.scss'

// resources
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import ShopApparelList from 'assets/json/browse-nft/shop-apparel-list.json'

import nftsAPI from 'apis/nfts'
import { isString } from 'utils/helpers'
import { getAbsoluteOgUrl } from 'utils/seo'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'
import { useAuthentication } from 'hooks/useAuthentication'
import ModelViewer from 'components/ModelViewer'
import { NftData, NftApiData } from 'types/nft'

export interface EditionDetail {
  number: number
  supply: number
  maxSupply?: number
}

export interface BrowseNFTProps {
  nftDetail?: NftData
  editionDetail?: EditionDetail
  mintAddress?: PublicKey
  error?: string
}

const BrowseNFT = ({ nftDetail, editionDetail }: BrowseNFTProps) => {
  const nftType = (nftDetail?.category as string) ?? 'image'
  const isLoading = useSelector<any>(state => state.isLoading)
  const apparelType = useSelector<any>(state => state.apparelType)
  const detailShow = useSelector<any>(state => state.detailShow)
  const categories = getNFTCategories(nftDetail)
  const [openMerchPage, setOpenMerchPage] = useState(false)
  const [merchData, setMerchData] = useState(null)
  const [nftInfo, setNftInfo] = useState<NftData>()
  const [collectionName, setCollectionName] = useState('')
  const [artistInfo, setArtistInfo] = useState<NFTArtistInfo | null>(null)
  const { connected } = useWallet()
  const { profileInfo } = useAuthentication()
  const dispatch = useDispatch()
  const [showLoading, setShowLoading] = useState(true)
  const [showAuctionSection, setShowAuctionSection] = useState(false)

  useEffect(() => {
    setTimeout(
      () =>
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        }),
      500
    )
    dispatch({ type: 'set', isLoading: false })
  }, [])

  useEffect(() => {
    if (isLoading === false) setShowLoading(false)
  }, [isLoading])

  useEffect(() => {
    if (detailShow === true) {
      if (apparelType !== undefined || apparelType !== '' || apparelType !== null) {
        const nftName = nftDetail.name ?? 'No name found'
        const nftCoverUrl = nftDetail.image ?? ''
        const mintAddress = nftDetail.mintAddress.toString()
        const item = ShopApparelList.find(apparel => apparel.name === apparelType)
        let params = {
          nftName,
          nftCoverUrl,
          mintAddress,
          category: item?.category,
          subCategory: item?.sub_type,
          base: item?.base,
        }
        setMerchData(params)
        setOpenMerchPage(true)
        dispatch({ type: 'set', detailShow: false })
      }
    }
  }, [detailShow, apparelType])

  useEffect(() => {
    const fetchData = async () => {
      if (!nftDetail) return
      if (connected) {
        await nftsAPI.getDetail(nftDetail.mintAddress).then(
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
        await nftsAPI.get(nftDetail.mintAddress).then(
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
    }
    fetchData()
  }, [nftDetail, profileInfo])

  const collectionId = nftDetail?.collection?.address && nftDetail?.collection?.address?.toString()

  let nftName = nftDetail?.name ?? ''
  if (editionDetail) {
    let { number, supply, maxSupply } = editionDetail
    let supplyInfo = `#${number}/${supply}`
    if (supply !== maxSupply) supplyInfo = `edition ${number}/${supply}, max ${maxSupply ?? '\u221e'}`
    nftName = `${nftName} (${supplyInfo})`
  }
  let nftTitle = `${nftName} | Foster Marketplace`
  let nftImageUrl = getAbsoluteOgUrl(nftDetail?.image ?? DefaultNftBG.src)

  let nftDescription = nftDetail?.description ?? ''

  const [nftCoverUrl, setNftCoverUrl] = useState()
  const [fullScreen, setFullScreen] = useState(false)
  const setFullScreenView = url => {
    window.scrollTo({
      top: 0,
    })
    document.body.style.overflow = 'hidden'
    setFullScreen(true)
    setNftCoverUrl(url)
  }

  const reloadNftData = async () => {
    if (!nftDetail) return
    if (connected) {
      await nftsAPI.getDetail(nftDetail.mintAddress).then(
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
      await nftsAPI.get(nftDetail.mintAddress).then(
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
  }

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
      <div className={styles.container}>
        {openMerchPage ? (
          <div className="flex justify-center">
            <div className="g-container z-10">
              <MerchSection
                data={merchData}
                openNftPage={() => {
                  setOpenMerchPage(false)
                }}
              />
            </div>
          </div>
        ) : (
          <div className="z-10 mb-[100px] lg:mb-[0px]">
            {nftDetail && (
              <div className={styles.mainBG}>
                <div className="g-container">
                  <MainSection
                    nftDetail={nftDetail}
                    editionDetail={editionDetail}
                    nftInfo={nftInfo}
                    setFullScreenView={setFullScreenView}
                    reloadNftData={reloadNftData}
                    enableMerch={setMerchToggle}
                    setCollectionName={setCollectionName}
                    fullScreen={fullScreen}
                    setShowAuctionSection={enable => setShowAuctionSection(enable)}
                  />
                </div>
              </div>
            )}
            {showAuctionSection ? (
              <></>
            ) : merchToggle ? (
              <div className={styles.centerScreen}>
                <div className="g-container">
                  <ShopApparelSection
                    title="Shop Apparel"
                    type="apparel"
                    nftDetail={nftDetail}
                    shopApparelList={ShopApparelList}
                    openMerchPage={data => {
                      setMerchData(data)
                      setOpenMerchPage(true)
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.centerScreen}>
                <div className="g-container">
                  <div>
                    {collectionId && (
                      <MoreCollectionSection
                        collectionId={collectionId}
                        collectionName={collectionName}
                        mintAddress={nftDetail.mintAddress.toString()}
                      />
                    )}
                    {connected && artistInfo && <MoreArtistSection artistInfo={artistInfo} />}
                    <MoreCategorySection categories={categories} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {fullScreen && (
        <div className={styles.fullScreen}>
          {nftType?.includes('vr') ? (
            <ModelViewer path={nftCoverUrl} fullScreen width={innerWidth} height={innerHeight} />
          ) : (
            <img src={nftCoverUrl} alt="" className="w-full h-full max-w-full max-h-full object-contain" />
          )}
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

BrowseNFT.getInitialProps = async function ({ res, query }): Promise<BrowseNFTProps> {
  // set cache headers
  if (res) {
    // cache for 30m, shared cache for 1h
    res.setHeader('cache-control', 'max-age=1800, s-maxage=3600')
  }

  let mintAddress: PublicKey
  try {
    mintAddress = new PublicKey(query.id)
  } catch (e: any) {
    console.error(e)
    return {
      error: `could not parse as public key: ${query.id}: ${e.message}`,
    }
  }

  let nftDetail

  try {
    const metaplex = Metaplex.make(new Connection(process.env.PROVIDER_URL))

    let nftDetail = (await getNftFromDAS(metaplex, query.id)) ?? (await getNftFromRpc(metaplex, query.id))

    let editionDetail: EditionDetail | undefined = undefined
    try {
      const { data: editionData } = await metaplex
        .rpc()
        .getAccount(metaplex.nfts().pdas().masterEdition({ mint: mintAddress }))
        .then(toOriginalOrPrintEditionAccount)

      if ('parent' in editionData) {
        let {
          data: { maxSupply, supply },
        } = await metaplex.rpc().getAccount(editionData.parent).then(toOriginalEditionAccount)
        editionDetail = {
          number: Number(editionData.edition),
          supply: Number(supply),
          maxSupply: maxSupply && Number(maxSupply),
        }
      }
    } catch (error) {
      console.error(error)
    }

    return {
      nftDetail,
      editionDetail,
      mintAddress,
    }
  } catch (e: any) {
    console.error(e)
    return {
      error: `could not load nft: ${query.id}: ${e.message}`,
    }
  }
}

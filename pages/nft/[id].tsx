import React, { useEffect, useState, useRef } from 'react'

// next components
import Head from 'next/head'
import Image from 'next/image'

// solana
import { Connection, PublicKey } from '@solana/web3.js'
import {
  Metaplex,
  toOriginalEditionAccount,
  OriginalEditionAccountData,
  toOriginalOrPrintEditionAccount,
} from '@metaplex-foundation/js'
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
import { determineCategory, getNFTCategories, getNftFromDAS, NFTArtistInfo } from 'utils/nfts.utils'

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
import { NftData, NftApiData, MasterEditionType } from 'types/nft'

export interface EditionDetail {
  number: number
  supply: number
  maxSupply?: number
}

export interface BrowseNFTProps {
  nftDetail?: NftApiData
  editionDetail?: EditionDetail
  originalEditionDetail?: OriginalEditionAccountData
  mintAddress?: PublicKey
  error?: string
}

const BrowseNFT = ({ nftDetail, editionDetail }: BrowseNFTProps) => {
  const nftType = (nftDetail?.json?.category as string) ?? 'image'
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
        const nftName = nftDetail.json?.name ?? 'No name found'
        const nftCoverUrl = nftDetail.json?.image ?? ''
        const mintAddress = nftDetail.address.toString()
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
        await nftsAPI.getDetail(nftDetail.address).then(
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
        await nftsAPI.get(nftDetail.address).then(
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

  let nftName = nftDetail?.json?.name ?? ''
  if (editionDetail) {
    let { number, supply, maxSupply } = editionDetail
    let supplyInfo = `#${number}/${supply}`
    if (supply !== maxSupply) supplyInfo = `edition ${number}/${supply}, max ${maxSupply ?? '\u221e'}`
    nftName = `${nftName} (${supplyInfo})`
  }
  let nftTitle = `${nftName} | Foster Marketplace`
  let nftImageUrl = getAbsoluteOgUrl(nftDetail?.json?.image ?? DefaultNftBG.src)

  let nftDescription = nftDetail?.json?.description ?? ''

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
      await nftsAPI.getDetail(nftDetail.address).then(
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
      await nftsAPI.get(nftDetail.address).then(
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
                        mintAddress={nftDetail.address.toString()}
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

  try {
    const metaplex = Metaplex.make(new Connection(process.env.PROVIDER_URL))

    const nftDataFromDas = await getNftFromDAS(query.id)
    const editionData = (await toOriginalOrPrintEditionAccount(
      await metaplex.rpc().getAccount(metaplex.nfts().pdas().masterEdition({ mint: mintAddress }))
    )) as unknown as MasterEditionType
    const edition = {
      address: editionData?.address || editionData?.publicKey,
      number: editionData?.data?.edition,
      parent: editionData?.data?.parent,
      maxSupply: editionData?.data?.maxSupply,
      supply: editionData?.data?.supply,
    }

    const metadataAddress = await metaplex.nfts().pdas().metadata({ mint: mintAddress })

    let nftDetail: NftApiData = {
      address: query.id,
      collection: {
        address:
          nftDataFromDas.grouping.length > 0
            ? nftDataFromDas.grouping.find(v => v.group_key === 'collection')?.group_value
            : undefined,
        verified: Boolean(nftDataFromDas.grouping?.find(v => v.group_key === 'collection')?.group_value),
      },
      creators: nftDataFromDas.creators,
      metadataAddress,
      model: nftDataFromDas.content?.metadata?.token_standard,
      symbol: nftDataFromDas.content.metadata.symbol,
      sellerFeeBasisPoints: nftDataFromDas.royalty.basis_points,
      json: {
        category: determineCategory(nftDataFromDas.content.files),
        image: nftDataFromDas.content?.files?.[0]?.cdn_uri || nftDataFromDas.content?.files?.[0]?.uri,
        animation_url: nftDataFromDas.content?.files?.[1]?.uri,
        name: nftDataFromDas.content?.metadata?.name,
        description: nftDataFromDas.content?.metadata?.description,
        sellerFeeBasisPoints: nftDataFromDas.royalty?.basis_points,
        attributes: nftDataFromDas.content.metadata.attributes,
      },
      edition,
    }

    if (!nftDetail.model.includes('NonFungible')) throw new Error('expected NonFungible')

    let editionDetail = null
    let originalEditionDetail = null
    try {
      if ('parent' in nftDetail.edition) {
        originalEditionDetail = await toOriginalEditionAccount(
          await metaplex.rpc().getAccount(new PublicKey(nftDetail.edition.parent))
        ).data
        editionDetail = {
          number:
            typeof nftDetail.edition.number === 'string' ? Number(nftDetail.edition.number) : nftDetail.edition.number,
          supply: originalEditionDetail.supply.toNumber(),
          maxSupply: originalEditionDetail.maxSupply?.toNumber(),
        }
      }
    } catch (error) {
      console.error(error)
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

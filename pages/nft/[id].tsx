import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// next components
import Head from 'next/head'
import Image from 'next/image'

// solana
import { Connection, PublicKey } from '@solana/web3.js'
import { Metaplex } from '@metaplex-foundation/js'
import { useWallet } from '@solana/wallet-adapter-react'

// components
import PrimaryLayout from 'components/Layout/PrimaryLayout'
import MainSection from 'components/pages/BrowseNFT/MainSection'
import MerchSection from 'components/pages/BrowseNFT/MerchSection'
import MoreCollectionSection from 'components/pages/BrowseNFT/MoreCollectionSection'
import MoreArtistSection from 'components/pages/BrowseNFT/MoreArtistSection'
import MoreCategorySection from 'components/pages/BrowseNFT/MoreCategorySection'
import ShopApparelSection from 'components/pages/BrowseNFT/ShopApparelSection'
import SelectedTab from 'components/Tab/SelectedTab'

// custom functions
import { getNFTCategories, getNftFromDAS, getNftFromRpc, getNFTOwner, NFTArtistInfo } from 'utils/nfts.utils'

// images and icons
import CloseIcon from 'assets/icons/close-screen.svg'
import ArrowRightIcon from 'assets/icons/arrow-right-line.svg?component'

// third party components
import { useDispatch, useSelector } from 'react-redux'

// styles
import styles from './index.module.scss'

// resources
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import ShopApparelList from 'assets/json/browse-nft/shop-apparel-list.json'
import TabList from 'assets/json/browse-nft/auction-list.json'
import MerchTabList from 'assets/json/browse-nft/merch-list.json'

import nftsAPI from 'apis/nfts'
import { isString, optimizeCdnUrlOgImage } from 'utils/helpers'
import { getAbsoluteOgUrl } from 'utils/seo'
import ModelViewer from 'components/ModelViewer'
import { NftData } from 'types/nft'
import { useViewport } from 'utils'
import NFTActivityInfoSection from 'components/pages/BrowseNFT/MainSection/NFTActivityInfoSection'
import collectionAPI from 'apis/collections'
import dashboardAPI from 'apis/dashboard'
import SecondaryLayout from 'components/Layout/SecondaryLayout'

export interface EditionDetail {
  supply: number
  maxSupply?: number
  print?: {
    number: number
  }
  isOriginal: boolean
  isSingleNft: boolean
  isOpenEdition: boolean
  isLimitedEdition: boolean
}

export interface BrowseNFTProps {
  nftDetail?: NftData
  nftOwner?: any
  editionDetail?: EditionDetail
  mintAddress?: PublicKey
  error?: string
}

const BrowseNFT = ({ nftDetail, nftOwner, editionDetail }: BrowseNFTProps) => {
  const router = useRouter()
  const viewport = useViewport()
  const nftType = (nftDetail?.category as string) ?? 'image'
  const apparelType = useSelector<any>(state => state.apparelType)
  const detailShow = useSelector<any>(state => state.detailShow)
  const [categories, setCategories] = useState(getNFTCategories(nftDetail))
  const [openMerchPage, setOpenMerchPage] = useState(false)
  const [merchData, setMerchData] = useState(null)
  const [nftInfo, setNftInfo] = useState<NftData>()
  const [collectionName, setCollectionName] = useState('')
  const [artistInfo, setArtistInfo] = useState<NFTArtistInfo | null>(null)
  const { connected, autoConnect } = useWallet()
  const dispatch = useDispatch()
  const [showAuctionSection, setShowAuctionSection] = useState(false)
  const [merchToggle, setMerchToggle] = useState(false)
  const [activeTab, setActiveTab] = useState<any>(0)
  const [tabList, setTabList] = useState<any[]>(TabList)
  const [activityList, setActivityList] = useState([])
  const [merchImages, setMerchImages] = useState([])
  const [selectedMerchImage, setSelectedMerchImage] = useState('')
  const [showStudioModal, setShowStudioModal] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }, 500)
    dispatch({ type: 'set', isLoading: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setProcessMerchImage = (images, idx) => {
    let list = []
    images.map((image, index) => list.push({ url: image.mockup_url, selected: index === idx }))
    setMerchImages(list)
    setSelectedMerchImage(list[idx].url)
  }

  useEffect(() => {
    if (detailShow === true) {
      if (apparelType !== undefined || apparelType !== '' || apparelType !== null) {
        const nftName = nftDetail.name ?? 'No name found'
        const nftCoverUrl = nftDetail.image ?? ''
        const nftUsername = ''
        const mintAddress = nftDetail.mintAddress.toString()
        const item = ShopApparelList.find(apparel => apparel.name === apparelType)
        let params = {
          nftName,
          nftUsername,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                setArtistInfo({
                  address: response.creator_address,
                  name: response.creator_username,
                  profile_image: response.creator_profile_image,
                })
                dispatch({ type: 'set', merchBy: response.creator_username })
              }
            }
          },
          error => {}
        )
      } else {
        if (autoConnect) return
        await nftsAPI.get(nftDetail.mintAddress).then(
          (response: any) => {
            if (!isString(response)) {
              setNftInfo(response)
              if (response.creator_address !== null) {
                setArtistInfo({
                  address: response.creator_address,
                  name: response.creator_username,
                  profile_image: response.creator_profile_image,
                })
                dispatch({ type: 'set', merchBy: response.creator_username })
              }
            }
          },
          error => {}
        )
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected])

  const collectionId = nftDetail?.collection?.address?.toString()

  let nftName = nftDetail?.name ?? ''
  if (editionDetail && !editionDetail?.isSingleNft) {
    let { print, supply, maxSupply } = editionDetail
    let supplyInfo = `#${print?.number}/${supply}`
    if (editionDetail.isOriginal) supplyInfo = `max ${maxSupply ?? '\u221e'}`
    else if (maxSupply != supply) supplyInfo = `edition ${print?.number}/${supply}, max ${maxSupply ?? '\u221e'}`
    nftName = `${nftName} (${supplyInfo})`
  }
  let nftTitle = `${nftName} | Foster Marketplace`
  let nftImageUrl = optimizeCdnUrlOgImage(getAbsoluteOgUrl(nftDetail?.image || DefaultNftBG.src))

  let nftDescription = nftDetail?.description ?? ''

  const [nftCoverUrl, setNftCoverUrl] = useState('')
  const [fullScreen, setFullScreen] = useState(false)
  const [fullScreenMerch, setFullScreenMerch] = useState(false)

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
              setArtistInfo({
                address: response.creator_address,
                name: response.creator_username,
                profile_image: response.creator_profile_image,
              })
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
              setArtistInfo({
                address: response.creator_address,
                name: response.creator_username,
                profile_image: response.creator_profile_image,
              })
            }
          }
        },
        error => {}
      )
    }
  }

  const handleSelectedTab = item => {
    setActiveTab(item.id)
  }

  useEffect(() => {
    let array: any[] = []
    let list
    if (merchToggle) {
      list = MerchTabList
    } else list = TabList
    list.map(item => {
      let object: any = item
      if (item.id === activeTab) {
        object.selected = true
      } else {
        object.selected = false
      }
      array.push(object)
    })
    setTabList(array)
  }, [activeTab, merchToggle])

  // more collection nfts
  const [collectionNFTs, setCollectionNFTs] = useState([])
  useEffect(() => {
    if (collectionId !== null) {
      collectionAPI.getCollectionNft(collectionId).then(
        response => {
          if (response instanceof Array) {
            let resData = response.filter(item => item.token_id !== nftDetail.mintAddress.toString())
            if (resData.length === 0) return
            if (viewport === 'xs' || viewport === 'sm' || viewport === 'md') {
              setCollectionNFTs(resData.filter(item => item.cover_image_url !== null))
            } else {
              setCollectionNFTs(resData)
            }
          }
        },
        error => {}
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId])

  // artist collections
  const [collectionList, setCollectionList] = useState([])
  useEffect(() => {
    if (artistInfo !== null && artistInfo.address) {
      collectionAPI.getOtherCollections(artistInfo.address).then(
        response => {
          if (response instanceof Array) {
            setCollectionList(response)
          }
        },
        error => {}
      )
    }
  }, [artistInfo])

  // category collection list
  const [categoryCollectionList, setCategoryCollectionList] = useState([])

  useEffect(() => {
    if (categories !== null && categories !== undefined && categories[0] !== undefined) {
      dashboardAPI.getTrendingCollections(categories[0], 'week').then(
        response => {
          if (response instanceof Array) {
            setCategoryCollectionList(response)
          }
        },
        error => {}
      )
    }
  }, [categories])

  useEffect(() => {
    if (categoryCollectionList.length > 0 || collectionList.length > 0 || collectionNFTs.length > 0) {
      setTabList(prev => {
        if (prev.some(t => t.label === 'Discover More')) {
          return prev
        } else {
          return [...prev, { id: 1, label: 'Discover More', value: 'Discover More', selected: false }]
        }
      })
    } else {
      setTabList(prev => prev.filter(t => t.label !== 'Discover More'))
    }
  }, [categoryCollectionList, collectionList, collectionNFTs, connected])

  return (
    <div className="w-full min-h-full">
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
          <div className="z-10 w-full h-full">
            {nftDetail &&
              (nftOwner === null ? (
                <div className="w-full flex justify-center lg:mt-[200px] mt-[150px]">
                  <div>
                    <div className={styles.noResult}>No results found</div>
                    <div className={styles.tokenFetch}>Token metadata unable to be fetched</div>
                    <div className="flex justify-center mt-[30px]">
                      <div className={styles.backHome} onClick={() => router.push('/')}>
                        Back Home
                        <ArrowRightIcon className={styles.rightIcon} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.mainBG}>
                  <div className="w-full h-full">
                    <MainSection
                      key={nftDetail.mintAddress.toString()}
                      nftDetail={nftDetail}
                      editionDetail={editionDetail}
                      nftInfo={nftInfo}
                      setFullScreenView={setFullScreenView}
                      reloadNftData={reloadNftData}
                      enableMerch={setMerchToggle}
                      setShowStudioModal={setShowStudioModal}
                      setCollectionName={setCollectionName}
                      fullScreen={fullScreen}
                      setShowAuctionSection={enable => setShowAuctionSection(enable)}
                      setMerchImages={images => setProcessMerchImage(images, 0)}
                      setFullScreenMerch={setFullScreenMerch}
                    />
                  </div>
                </div>
              ))}

            {/* {!showAuctionSection && nftDetail && nftOwner && (
              <div className={`${styles.activityContainer} mt-[30px] lg:mt-[20px]`}>
                <div className={styles.selectedTab}>
                  <div className="g-container">
                    <SelectedTab tabList={tabList} onChange={item => handleSelectedTab(item)} />
                  </div>
                  <div className={styles.selectedTabBorder} />
                </div>

                <div className={styles.background}>
                  <div className={`g-container ${styles.mainContainer}`}>
                    {activeTab === 0 ? (
                      <NFTActivityInfoSection activityList={activityList} />
                    ) : activeTab === 1 ? (
                      <div className="mt-[30px]">
                        {collectionId && collectionNFTs && (
                          <MoreCollectionSection
                            collectionNFTs={collectionNFTs}
                            collectionId={collectionId}
                            collectionName={collectionName}
                            mintAddress={nftDetail.mintAddress.toString()}
                          />
                        )}
                        {artistInfo && collectionList && (
                          <MoreArtistSection artistInfo={artistInfo} collectionList={collectionList} />
                        )}
                        <MoreCategorySection categories={categories} categoryCollectionList={categoryCollectionList} />
                      </div>
                    ) : (
                      merchToggle && (
                        <ShopApparelSection
                          title="Shop Apparel"
                          type="apparel"
                          nftDetail={nftDetail}
                          nftCreator={artistInfo?.name}
                          shopApparelList={ShopApparelList}
                          openMerchPage={data => {
                            setMerchData(data)
                            setOpenMerchPage(true)
                          }}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            )} */}
          </div>
        )}
      </div>

      {showStudioModal && (
        <div className={styles.fullScreen}>
          <div className="w-full h-full flex items-center">
            <div className="w-full h-[580px]">
              <ShopApparelSection
                title="Shop Apparel"
                type="apparel"
                nftDetail={nftDetail}
                nftCreator={artistInfo?.name}
                shopApparelList={ShopApparelList}
                openMerchPage={data => {
                  setMerchData(data)
                  setOpenMerchPage(true)
                }}
              />
            </div>
          </div>
          <div
            className={styles.closeScreen}
            onClick={() => {
              setShowStudioModal(false)
            }}
          >
            <Image src={CloseIcon} alt="" width={18} height={18} />
          </div>
        </div>
      )}

      {fullScreen && (
        <div className={styles.fullScreen}>
          {nftType?.includes('vr') ? (
            <ModelViewer path={nftCoverUrl} fullScreen />
          ) : (
            <img
              src={nftCoverUrl}
              onError={() => {
                setNftCoverUrl(nftDetail?.original?.image)
              }}
              alt=""
              className="w-full h-full max-w-full max-h-full object-contain"
            />
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

      {fullScreenMerch && (
        <div className={styles.fullScreenMerch}>
          <div>
            <div className="w-[370px] h-[370px] sm:w-[500px] sm:w-[500px] lg:w-[600px] lg:h-[600px]">
              <img src={selectedMerchImage} alt="" className="w-full h-full max-w-full max-h-full object-contain" />
            </div>
            <div className="mt-[30px] flex justify-center gap-[10px]">
              {merchImages.map((item, index) => (
                <div
                  className={item.selected ? styles.selectedMerch : styles.unselectedMerch}
                  key={index}
                  onClick={() => {
                    let images = []
                    merchImages.map(merch => images.push(merch.url))
                    let list = []
                    images.map((image, idx) => list.push({ url: image, selected: index === idx }))
                    setMerchImages(list)
                    setSelectedMerchImage(list[index].url)
                  }}
                >
                  <img src={item.url} className="max-w-full max-h-full object-conver" />
                </div>
              ))}
            </div>
          </div>
          <div
            className={styles.closeScreen}
            onClick={() => {
              setFullScreenMerch(false)
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
  return <SecondaryLayout>{page}</SecondaryLayout>
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
    let editionDetail: EditionDetail = {
      print: nftDetail.supply?.edition && { number: nftDetail.supply?.edition },
      supply: nftDetail.supply?.current,
      maxSupply: nftDetail.supply?.max,
      isOriginal: !nftDetail.supply?.edition,
      isSingleNft: nftDetail.supply?.max === 0,
      isOpenEdition: !nftDetail.supply?.edition && nftDetail.supply?.max == null,
      isLimitedEdition: !nftDetail.supply?.edition && nftDetail.supply?.max > 0,
    }

    let nftOwner = await getNFTOwner(metaplex, new PublicKey(nftDetail.mintAddress))
    return {
      nftDetail,
      nftOwner,
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

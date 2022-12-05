import React, { useEffect, useState } from 'react'

// next components
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { useDispatch, useSelector } from 'react-redux'

// components
import PrimaryLayout from 'components/Layout/PrimaryLayout'
import NFTFilter from 'components/Filter/NFTFilter'
import MobileNFTFilter from 'components/Filter/MobileNFTFilter'
import CollectionFilter from 'components/Filter/CollectionFilter'
import MobileCollectionFilter from 'components/Filter/MobileCollectionFilter'
import EcosystemFilter from 'components/Filter/EcosystemFilter'
import MobileEcosystemFilter from 'components/Filter/MobileEcosystemFilter'
import MobileSort from 'components/Sort/MobileSort'
import Select from 'components/Select'
import Tab from 'components/Tab'
import NFTCard from 'components/Card/NFTCard'
import CollectionCard from 'components/Card/CollectionCard'
import EcosystemCard from 'components/Card/EcosystemCard'
import OutlineButton from 'components/Button/OutlineButton'
import Pagination from 'components/Button/Pagination'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'

// json
import TabList from 'assets/json/explore/tab-list.json'
import NFTSortList from 'assets/json/explore/nft-sort.json'
import CollectionSortList from 'assets/json/explore/collection-sort.json'
import EcosystemSortList from 'assets/json/explore/ecosystem-sort.json'

import CollectionExploreList from 'assets/json/explore/collection-explore-list.json'
import EcosystemExploreList from 'assets/json/explore/ecosystem-explore-list.json'

import AvailabilityList from 'assets/json/explore/availability.json'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import FilterGrayIcon from 'assets/icons/filter-gray.svg'
import SortGrayIcon from 'assets/icons/sort-gray.svg'

// styles
import styles from './index.module.scss'

// solana
import { getListedNFTs } from 'utils/auction.util'
import { getNFTByAddress } from 'utils/nfts.utils'
import { useMetaplex } from 'hooks/useMetaplex'
import { getPriceValue } from 'utils/strings'
import { PublicKey } from '@solana/web3.js'

// custom functions
import { getShortAddress } from 'utils/strings'

// apis
import AuctionAPI from 'apis/auctions'

const Explore = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const isLoading = useSelector<any>(state => state.isLoading)

  const exploreTab = useSelector<any>(state => state.exploreTab)
  const [tabList, setTabList] = useState<any>(TabList)
  const [nftList, setNftList] = useState<any>([])
  const [showNftList, setShowNFTList] = useState<any>([])
  const [showCollectionList, setShowCollectionList] = useState<any>([])
  const [showEcosystemList, setShowEcosystemList] = useState<any>([])

  useEffect(() => {
    let array: any[] = []
    TabList.map(item => {
      let object: any = item
      if (item.id === exploreTab) {
        object.selected = true
      } else {
        object.selected = false
      }
      array.push(object)
    })
    setTabList(array)
  }, [exploreTab])

  const handleSelectedTab = item => {
    if (item.id === 2) item.id = 0
    dispatch({ type: 'set', exploreTab: item.id })
  }

  const [sortData, setSortData] = useState(NFTSortList)
  const [selectedSort, setSelectedSort] = useState(NFTSortList[0])

  const [selectedAvailability, setSelectedAvailability] = useState<any>(AvailabilityList[4])

  useEffect(() => {
    switch (exploreTab) {
      case 0:
        setSortData(NFTSortList)
        setSelectedSort(NFTSortList[0])
        if (selectedAvailability.value === 'Live Auction') {
          setAuctionsNFTs()
        } else {
          setListedNFTs()
        }
        break
      case 1:
        setSortData(CollectionSortList)
        setSelectedSort(CollectionSortList[0])
        // setNftList(CollectionExploreList)
        break
      case 2:
        setSortData(EcosystemSortList)
        setSelectedSort(EcosystemSortList[0])
        // setNftList(EcosystemExploreList)
        break
      default:
        break
    }
  }, [exploreTab, selectedAvailability])

  const [openMobileFilter, setOpenMobileFilter] = useState(false)
  const [openMobileSort, setOpenMobileSort] = useState(false)

  const { metaplex: mx } = useMetaplex()

  const setListedNFTs = async () => {
    dispatch({ type: 'set', isLoading: true })
    const listedNfts = await getListedNFTs(mx)
    const nfts = listedNfts.map(nft => {
      return {
        image: nft.asset.json ? nft.asset.json.image : '',
        name: nft.asset.json ? nft.asset.json.name : '',
        creator: nft.asset.creators[0].address.toString(),
        url: `/browse-nft?id=${nft.asset.address.toString()}`,
        price: nft.price.basisPoints,
      }
    })
    setNftList(nfts)
    dispatch({ type: 'set', isLoading: false })
  }

  const setAuctionsNFTs = async () => {
    dispatch({ type: 'set', isLoading: true })
    const listings = await AuctionAPI.getListings()
    const nfts = await Promise.all(
      listings.map(async listing => {
        const nft = await getNFTByAddress(mx, new PublicKey(listing.auction.mint_address))
        return {
          image: nft.json.image,
          name: nft.json.name,
          creator: nft.creators[0].address.toString(),
          url: `/live-auction?id=${nft.address.toString()}`,
          price: Number(listing.auction.reserve_price) * 1000000000,
        }
      })
    )
    setNftList(nfts)
    dispatch({ type: 'set', isLoading: false })
  }

  return (
    <div className="g-container">
      <Head>
        <title>Explore</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <div className={styles.container}>
        <div className={styles.topLeftEllipse}>
          <Image src={EllipseGreen} width={2021} height={2021} alt="" objectFit="cover" />
        </div>
        <div className={`${styles.title} w-full text-center lg:text-start`}>Explore the Circus</div>
        <div className="w-full flex justify-between gap-0 lg:gap-[30px] xl:gap-[75px] mt-[37px] xl:mt-[88px] z-10">
          {/* filter menu part */}
          <div className="hidden lg:flex max-w-[324px] min-w-[324px] w-full">
            {exploreTab === 0 && (
              <NFTFilter
                selectedAvailability={selectedAvailability}
                setSelectedAvailability={setSelectedAvailability}
              />
            )}
            {exploreTab === 1 && <CollectionFilter />}
            {exploreTab === 2 && <EcosystemFilter />}
          </div>
          {/* content part */}
          <div className="flex-1 flex-wrap">
            <div className="w-full flex flex-wrap justify-center lg:justify-between items-center mb-6 lg:mb-[88px] z-10">
              <div className={styles.tabContainer}>
                <Tab tabList={tabList} onChange={item => handleSelectedTab(item)} />
              </div>
              <div className="hidden lg:flex max-w-[260px] min-w-[260px] w-full z-20">
                <Select
                  data={sortData}
                  selected={selectedSort}
                  onChange={item => setSelectedSort(item)}
                  maxHeight="none"
                />
              </div>
            </div>
            <div className="flex lg:hidden w-full justify-between items-center gap-[11px] z-10 my-6">
              <OutlineButton
                label="Filter"
                onClick={() => setOpenMobileFilter(!openMobileFilter)}
                fullWidth
                color="#99A3A7"
                borderColor="#99A3A7"
                icon={FilterGrayIcon}
                direction="rtl"
              />
              <OutlineButton
                label="Sort"
                onClick={() => setOpenMobileSort(!openMobileSort)}
                fullWidth
                color="#99A3A7"
                borderColor="#99A3A7"
                icon={SortGrayIcon}
                direction="rtl"
              />
            </div>
            <div className="w-full relative -z-10">
              <div className={styles.topRightEllipse}>
                <Image src={EllipseGreen} width={1705} height={1705} alt="" objectFit="cover" />
              </div>

              <div className={styles.bottomRightEllipse}>
                <Image src={EllipseGreen} width={1705} height={1705} alt="" objectFit="cover" />
              </div>
              <div className={styles.bottomLeftEllipse}>
                <Image src={EllipseGreen} width={1399} height={1399} alt="" objectFit="cover" />
              </div>
            </div>
            <div className="w-full relative z-10">
              {exploreTab === 0 && (
                <div className="w-full grid grid-cols-12 gap-x-2 gap-y-4 xl:gap-x-10 xl:gap-y-8 z-10">
                  {showNftList.length !== 0 &&
                    showNftList?.map((item, index) => (
                      <div className="col-span-6 2xl:col-span-4 z-10" key={index}>
                        <NFTCard
                          image={item.image}
                          nftName={item.name}
                          artistName={getShortAddress(item.creator)}
                          onClick={() => {
                            dispatch({ type: 'set', isLoading: true })
                            router.push(item.url)
                          }}
                          price={getPriceValue(item.price)}
                        />
                      </div>
                    ))}
                </div>
              )}
              {exploreTab === 1 && (
                <div className="w-full grid grid-cols-12 gap-x-2 gap-y-4 xl:gap-x-10 xl:gap-y-8">
                  {showCollectionList.length !== 0 &&
                    showCollectionList.map((item, index) => (
                      <div className="col-span-6 2xl:col-span-4 z-10" key={index}>
                        <CollectionCard
                          image={item.image}
                          nftName={item.nftName}
                          category={item.category.split(',')}
                          artistName={item.artistName}
                          mintAddress={item.mintAddress}
                          price={item.price}
                          onClick={() => {
                            dispatch({ type: 'set', isLoading: true })
                            router.push(`/browse-collection/${item.mintAddress}`)
                          }}
                        />
                      </div>
                    ))}
                </div>
              )}
              {exploreTab === 2 && (
                <div className="w-full grid grid-cols-12 gap-x-2 gap-y-4 xl:gap-x-10 xl:gap-y-8">
                  {showEcosystemList.map((item, index) => (
                    <div className="col-span-6 lg:col-span-6 xl:col-span-6 2xl:col-span-4 z-10" key={index}>
                      {item.avatar && <EcosystemCard data={item} onClick={() => router.push('/artist-profile')} />}
                    </div>
                  ))}
                </div>
              )}
              <div className="w-full flex justify-end">
                <Pagination
                  data={exploreTab === 0 ? nftList : exploreTab === 1 ? CollectionExploreList : []}
                  getCurrentData={data => {
                    if (exploreTab === 0) setShowNFTList(data)
                    else if (exploreTab === 1) setShowCollectionList(data)
                    else setShowEcosystemList(data)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex lg:hidden w-full">
        {openMobileFilter && exploreTab === 0 && <MobileNFTFilter onClose={() => setOpenMobileFilter(false)} />}
        {openMobileFilter && exploreTab === 1 && <MobileCollectionFilter onClose={() => setOpenMobileFilter(false)} />}
        {openMobileFilter && exploreTab === 2 && <MobileEcosystemFilter onClose={() => setOpenMobileFilter(false)} />}
        {openMobileSort && <MobileSort data={sortData} onClose={() => setOpenMobileSort(false)} />}
      </div>
      <FullScreenLoadingModal open={isLoading} />
    </div>
  )
}

export default Explore

Explore.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

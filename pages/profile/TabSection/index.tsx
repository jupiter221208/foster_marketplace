import React, { useEffect, useState } from 'react'

// next components

// components
import LiveAuctionSection from 'components/pages/ArtistProfile/LiveAuctionSection'
import ActiveListingSection from 'components/pages/ArtistProfile/ActiveListingSection'
import NFTSwiperSection from 'components/pages/ArtistProfile/NFTSwiperSection'
import CollectionSwiperSection from 'components/pages/ArtistProfile/CollectionSwiperSection'
import LoadingComponent from 'pages/profile/LoadingComponent'
import TimeSlotButton from 'components/Button/TimeSlotButton'
import ListingStatusList from 'assets/json/profile-listing-status.json'
import ListingTypeList from 'assets/json/profile-listing-type.json'
import OwnershipList from 'assets/json/profile-ownership.json'
import StudioList from 'assets/json/profile-studio.json'
import SortList from 'assets/json/profile-sort.json'
import FilterIcon from 'assets/icons/filter-icon.svg?component'
import SortIcon from 'assets/icons/sort-icon-normal.svg?component'

// json
import TabList from 'assets/json/artist-profile/tab-list.json'

// resources

// styles
import styles from './index.module.scss'
import LiveEditionsSection from 'components/pages/ArtistProfile/LiveEditionsSection'
import ProfileTab from '../../../components/Tab/ProfileTab'
import StudioCategoryMenu from 'components/Menu/StudioCategoryMenu'

// api
import DashboardAPI from 'apis/dashboard'
import HomeNftCard from 'components/Card/HomeNFTCard'
import { useRouter } from 'next/router'
import LiveAuctionCard from 'components/Card/LiveAuctionCard'
import HomeEditionCard from 'components/Card/HomeEditionCard'
import { isExpired } from 'utils/helpers'

const TabSection = props => {
  const {
    createdNfts,
    collectedNfts,
    merchNfts,
    collections,
    wallet,
    isOwn,
    isLoaded,
    handleNextPage,
    setArtistEnable,
    setMerchEnable,
    setCollectorEnable,
    isVisibleFetchingCreated,
    isFetchingCreated,
    setIsFetchingCreated,
    isVisibleFetchingCollected,
    isFetchingCollected,
    setIsFetchingCollected,
    isVisibleFetchingMerch,
    isFetchingMerch,
    setIsFetchingMerch,
  } = props
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<any>(0)
  const [tabList, setTabList] = useState<any[]>(TabList)
  const [isMounted, setIsMounted] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(true)
  const [artworkType, setArtworkType] = useState('created')
  const [nftList, setNftList] = useState([])
  const [listingStatusList, setListingStatusList] = useState([])
  const [listingStatus, setListingStatus] = useState(null)
  const [listingTypeList, setListingTypeList] = useState([])
  const [listingType, setListingType] = useState(null)
  const [ownershipList, setOwnershipList] = useState([])
  const [ownership, setOwnership] = useState(null)
  const [studioList, setStudioList] = useState([])
  const [studio, setStudio] = useState(null)
  const [sortList, setSortList] = useState([])
  const [sort, setSort] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true)
    }, 1000)

    let array: any[] = []
    ListingStatusList.map(item => {
      let object: any = item
      object.checked = false
      array.push(object)
    })
    let listingAll = {
      id: 2,
      name: 'All',
      value: '',
      checked: true,
    }
    array.push(listingAll)
    setListingStatus(listingAll)
    setListingStatusList(array)

    let array1: any[] = []
    ListingTypeList.map(item => {
      let object: any = item
      object.checked = false
      array1.push(object)
    })
    let typeAll = {
      id: 3,
      name: 'All',
      value: '',
      checked: true,
    }
    array1.push(typeAll)
    setListingType(typeAll)
    setListingTypeList(array1)

    let array2: any[] = []
    OwnershipList.map(item => {
      let object: any = item
      object.checked = false
      array2.push(object)
    })
    let ownershipAll = {
      id: 3,
      name: 'All',
      value: '',
      checked: true,
    }
    array2.push(ownershipAll)
    setOwnership(ownershipAll)
    setOwnershipList(array2)

    let array3: any[] = []
    StudioList.map(item => {
      let object: any = item
      object.checked = false
      array3.push(object)
    })
    let studioAll = {
      id: 2,
      name: 'All',
      value: '',
      checked: true,
    }
    array3.push(studioAll)
    setOwnership(studioAll)
    setStudioList(array3)

    let array4: any[] = []
    SortList.map(item => {
      let object: any = item
      if (object.id === 1) object.checked = true
      else object.checked = false
      array4.push(object)
    })
    setSortList(array4)
  }, [])

  useEffect(() => {
    let array: any[] = []
    TabList.map(item => {
      let object: any = item
      if (item.id === activeTab) {
        object.selected = true
      } else {
        object.selected = false
      }
      array.push(object)
    })
    setTabList(array)

    if (activeTab === 0) {
    } else if (activeTab === 1) {
      setShowCollections(collections.slice(0, rowCount))
      setIsFetching(false)
      setIsVisibleFetching(true)
      setArtistEnable(false)
      setMerchEnable(false)
      setCollectorEnable(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, artworkType, collections])

  const handleSelectedTab = item => {
    setActiveTab(item.id)
  }

  const [showCollections, setShowCollections] = useState([])
  const [rowCount, setRowCount] = useState(10)
  const [pages, setPages] = useState(0)

  useEffect(() => {
    console.log(isFetching, '====================isFetching==============')
    if (isFetching === true) {
      let nextPage = pages + 1
      getNftItem(nextPage, listingStatusList, listingTypeList, ownershipList, studioList, sortList)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching])

  useEffect(() => {
    if (isFetchingCreated === true) {
      handleNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingCreated])

  useEffect(() => {
    if (isFetchingCollected === true) {
      handleNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingCollected])

  useEffect(() => {
    if (isFetchingMerch === true) {
      handleNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingMerch])

  const handleListingStatus = index => {
    let array = [...listingStatusList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setListingStatusList(array)
    setListingStatus(array[index])
    getNftItem(1, array, listingTypeList, ownershipList, studioList, sortList, true)
  }

  const handleListingType = index => {
    let array = [...listingTypeList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setListingTypeList(array)
    setListingType(array[index])
    getNftItem(1, listingStatusList, array, ownershipList, studioList, sortList, true)
  }

  const handleOwnership = index => {
    let array = [...ownershipList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setOwnershipList(array)
    setOwnership(array[index])
    getNftItem(1, listingStatusList, listingTypeList, array, studioList, sortList, true)
  }

  const handleSelectStudio = index => {
    let array = [...studioList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setStudioList(array)
    setStudio(array[index])
    getNftItem(1, listingStatusList, listingTypeList, ownershipList, array, sortList, true)
  }

  const handleSelectSort = index => {
    let array = [...sortList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setSortList(array)
    getNftItem(1, listingStatusList, listingTypeList, ownershipList, studioList, array, true)
  }

  const getNftItem = (page, listingStatusList, listingTypeList, ownershipList, studioList, sortList, reset = false) => {
    let sort = 'price-descending'
    sortList.map(item => {
      if (item.checked === true) {
        sort = item.value
      }
    })
    let listingStatus = null
    listingStatusList.map(item => {
      if (item.checked === true) {
        listingStatus = item
      }
    })
    let listingType = null
    if (listingStatus.id === 0 || listingStatus.id === 2) {
      listingTypeList.map(item => {
        if (item.checked === true) {
          listingType = item
        }
      })
    }
    let ownership = null
    ownershipList.map(item => {
      if (item.checked === true) {
        ownership = item
      }
    })
    let merch = null
    studioList.map(item => {
      if (item.checked === true) {
        merch = item
      }
    })
    let params = {
      sort: sort,
      page: page,
      per_page: rowCount.toString(),
    }
    if (ownership && ownership.id !== 2) {
      params['ownership'] = ownership.value
    }
    if (listingType && listingType.id !== 3) {
      params['listing'] = listingType.value
      params['per_page'] = 'all'
    }
    if (merch && merch.id !== 2) {
      params['merch_hub'] = merch.value
    }

    DashboardAPI.getArtworkList(wallet, params).then(
      response => {
        setIsFetching(false)
        let result = []
        response.map(item => {
          if (item.auction) {
            if (!isExpired(item.auction.end_time)) result.push(item)
          } else if (item.masterEdition) {
            if (!isExpired(item.masterEdition.endTime)) result.push(item)
          } else {
            result.push(item)
          }
        })
        if (reset) setNftList(result)
        else setNftList([...nftList, ...result])

        if (response.length < rowCount) {
          setIsVisibleFetching(false)
        } else {
          setPages(page)
          setIsVisibleFetching(true)
        }
      },
      error => {
        setIsVisibleFetching(false)
      }
    )
  }

  return (
    <div className={styles.container}>
      <div className="w-full flex z-0 relative overflow-hidden xs:h-[72px] sm:h-[72px] md:h-[80px] -ml-[20px]">
        <ProfileTab tabList={tabList} onChange={item => handleSelectedTab(item)} />
      </div>
      <div className={styles.divider} />

      {activeTab === 0 && (
        <div className="w-full">
          <div className="w-full flex justify-between mt-[30px]">
            <div className="flex gap-[15px]">
              <StudioCategoryMenu
                menuLabel="Listing Status"
                categoryList={listingStatusList}
                handleSelectCategory={handleListingStatus}
                icon={<FilterIcon />}
              />
              {(listingStatus?.id === 0 || listingStatus?.id === 2) && (
                <StudioCategoryMenu
                  menuLabel="Listing Type"
                  categoryList={listingTypeList}
                  handleSelectCategory={handleListingType}
                  icon={<FilterIcon />}
                />
              )}

              <StudioCategoryMenu
                menuLabel="Ownership"
                categoryList={ownershipList}
                handleSelectCategory={handleOwnership}
                icon={<FilterIcon />}
              />

              <StudioCategoryMenu
                menuLabel="Studio"
                categoryList={studioList}
                handleSelectCategory={handleSelectStudio}
                icon={<FilterIcon />}
              />
            </div>

            <StudioCategoryMenu
              menuLabel="Sort"
              categoryList={sortList}
              handleSelectCategory={handleSelectSort}
              icon={<SortIcon />}
            />
          </div>

          {/* {artworkType === 'all' && (
            <div className="w-full">
              <NFTSwiperSection nfts={createdNfts} showHideButton={isOwn} isLoaded={isLoaded} />
              {createdNfts?.length > 0 && isLoaded && isVisibleFetchingCreated && (
                <LoadingComponent isFetching={isFetchingCreated} setIsFetching={setIsFetchingCreated} />
              )}
            </div>
          )}

          {artworkType === 'auction' && <LiveAuctionSection category={''} artist={wallet} fromPage={'profile'} />}

          {artworkType === 'studio' && (
            <div className="w-full">
              <NFTSwiperSection nfts={merchNfts} showHideButton={isOwn} isLoaded={isLoaded} type="studio" />
              {merchNfts?.length > 0 && isLoaded && isVisibleFetchingMerch && (
                <LoadingComponent isFetching={isFetchingMerch} setIsFetching={setIsFetchingMerch} />
              )}
            </div>
          )} */}

          <div className="w-full mt-[30px]">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-[10px] lg:gap-[20px] xl:gap-[30px]">
              {nftList.map((item, index) => {
                return item.auction ? (
                  <LiveAuctionCard
                    data={{
                      token_id: item.tokenId,
                      nft_name: item.nftName,
                      asset_url: item.assetUrl,
                      artist_username: item.artistUsername,
                      asset_type: item.assetType,
                      artist_profile_picture: item.artistProfilePicture,
                      cover_image_url: item.coverImageUrl,
                      current_bid: item.currentBid,
                      reserve_price: item.auction?.reserve_price,
                      start_time: item.auction?.start_time,
                      end_time: item.auction?.end_time,
                    }}
                    onClick={() => {
                      router.push('/nft/' + item.token_id)
                    }}
                    setCardExpired={item => {}}
                    key={index}
                  />
                ) : item.masterEdition ? (
                  <HomeEditionCard
                    data={{
                      tokenId: item.tokenId,
                      nftName: item.nftName,
                      artistUsername: item.artistUsername,
                      artistProfilePicture: item.artistProfilePicture,
                      coverImageUrl: item.coverImageUrl,
                      assetUrl: item.assetUrl,
                      endTime: item.masterEdition?.endTime,
                      startTime: item.masterEdition?.startTime,
                      price: item.masterEdition?.price,
                      currentSupply: item.currentSupply,
                      maxSupply: item.maxSupply,
                    }}
                    type={item.maxSupply === null ? 'open' : 'limit'}
                    onClick={() => {
                      router.push('/nft/' + item.token_id)
                    }}
                    key={index}
                  />
                ) : (
                  <HomeNftCard
                    image={item.assetUrl}
                    token_id={item.tokenId}
                    nftName={item.nftName}
                    assetType={item.assetType}
                    coverImage={item.assetUrl}
                    artistName={item.artistUsername}
                    artistImage={item.artistProfilePicture}
                    collectionName={item.collectionName}
                    price={item.listPrice}
                    onClick={() => {
                      router.push(`/nft/${item.tokenId}`)
                    }}
                    key={index}
                  />
                )
              })}
            </div>
            {isVisibleFetching && <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />}
          </div>

          {/* {artworkType === 'collected' && (
            <div className="w-full">
              <NFTSwiperSection nfts={collectedNfts} showHideButton={isOwn} isLoaded={isLoaded} />
              {collectedNfts.length > 0 && isLoaded && isVisibleFetchingCollected && (
                <LoadingComponent isFetching={isFetchingCollected} setIsFetching={setIsFetchingCollected} />
              )}
            </div>
          )}

          {artworkType === 'listed' && (
            <div className="w-full">
              <ActiveListingSection artist={wallet} fromPage={'profile'} />
            </div>
          )}

          {artworkType === 'editions' && <LiveEditionsSection category={''} artist={wallet} fromPage={'profile'} />} */}
        </div>
      )}

      {activeTab === 1 && (
        <div className="w-full">
          <CollectionSwiperSection collections={showCollections} showRemoveButton={isOwn} />
          {collections.length > 0 && isMounted && isVisibleFetching && (
            <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
          )}
        </div>
      )}
    </div>
  )
}

export default TabSection

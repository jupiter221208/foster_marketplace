import React, { useEffect, useState } from 'react'

// next components

// components
import CollectionSwiperSection from 'components/pages/ArtistProfile/CollectionSwiperSection'
import LoadingComponent from 'pages/profile/LoadingComponent'
import ListingStatusList from 'assets/json/profile-listing-status.json'
import ListingTypeList from 'assets/json/profile-listing-type.json'
import OwnershipList from 'assets/json/profile-ownership.json'
import StudioList from 'assets/json/profile-studio.json'
import SortList from 'assets/json/profile-sort.json'
import FilterIcon from 'assets/icons/filter-icon.svg?component'
import SortIcon from 'assets/icons/sort-icon-normal.svg?component'
import FilterGrayIcon from 'assets/icons/filter-gray.svg?component'
import SortGrayIcon from 'assets/icons/sort-gray.svg?component'
import CloseIcon from 'assets/icons/close-white-9x9.svg?component'

// json
import TabList from 'assets/json/artist-profile/tab-list.json'
import TabListOwn from 'assets/json/artist-profile/tab-list-own.json'

// resources

// styles
import styles from './index.module.scss'
import ProfileTab from '../../../components/Tab/ProfileTab'
import StudioCategoryMenu from 'components/Menu/StudioCategoryMenu'

// api
import DashboardAPI from 'apis/dashboard'
import HomeNftCard from 'components/Card/HomeNFTCard'
import { useRouter } from 'next/router'
import LiveAuctionCard from 'components/Card/LiveAuctionCard'
import HomeEditionCard from 'components/Card/HomeEditionCard'
import BlackButton from 'components/Button/BlackButton'
import MobileProfileFilter from 'components/Filter/MobileProfileFilter'
import MobileStudioSort from 'components/Menu/MobileStudioSort'
import { useDispatch, useSelector } from 'react-redux'
import OfferSection from 'components/pages/Dashboard/OfferSection'
import ActivitySection from 'components/pages/Dashboard/ActivitySection'
import FavoriteSection from 'components/pages/Dashboard/FavoriteSection'
import HiddenSection from 'components/pages/Dashboard/HiddenSection'

const TabSection = props => {
  const {
    collections,
    wallet,
    isOwn,
    handleNextPage,
    isVisibleFetchingCreated,
    isFetchingCreated,
    setIsFetchingCreated,
  } = props
  const hideNftToken = useSelector(state => (state as any).hideNftToken)
  const profileTab = useSelector<any>(state => state.profileTab)
  const router = useRouter()
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState<any>(0)
  const [tabList, setTabList] = useState<any[]>(TabList)
  const [isMounted, setIsMounted] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)
  const [nftList, setNftList] = useState([])
  const [listingStatusList, setListingStatusList] = useState([])
  const [listingStatus, setListingStatus] = useState(null)
  const [listingTypeList, setListingTypeList] = useState([])
  const [ownershipList, setOwnershipList] = useState([])
  const [studioList, setStudioList] = useState([])
  const [sortList, setSortList] = useState([])
  const [openMobileFilter, setOpenMobileFilter] = useState(false)
  const [openMobileSort, setOpenMobileSort] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [selectedFilterList, setSelectedFilterList] = useState([])
  const [favoriteNfts, setFavoriteNfts] = useState([])
  const [favoriteCollections, setFavoriteCollections] = useState([])
  const [hiddenNfts, setHiddenNfts] = useState([])
  const [activityNfts, setActivityNfts] = useState([])
  const [offerNftsMade, setOfferNftsMade] = useState([])
  const [offerNftsReceived, setOfferNftsReceived] = useState([])

  useEffect(() => {
    if (isOwn) {
      setTabList(TabListOwn)
    } else {
      setTabList(TabList)
    }
  }, [isOwn])

  useEffect(() => {
    if (hideNftToken.length > 0) {
      let newNfts = nftList.filter(item => item.tokenId !== hideNftToken)
      setNftList(newNfts)
      dispatch({ type: 'set', hideNftToken: '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideNftToken])

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
    setListingTypeList(array1)

    let array2: any[] = []
    OwnershipList.map(item => {
      let object: any = item
      object.checked = false
      array2.push(object)
    })
    let ownershipAll = {
      id: 2,
      name: 'All',
      value: '',
      checked: true,
    }
    array2.push(ownershipAll)
    if (profileTab === 'created') {
      array2[0].checked = true
      array2[1].checked = false
      array2[2].checked = false
      dispatch({ type: 'set', profileTab: '' })
    }
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

  const resetFilter = () => {
    let array = [...listingStatusList]
    array.map(item => {
      item.checked = false
    })
    array[listingStatusList.length - 1].checked = true
    setListingStatusList(array)
    setListingStatus(array[listingStatusList.length - 1])

    let array1 = [...listingTypeList]
    array1.map(item => {
      item.checked = false
    })
    array1[listingTypeList.length - 1].checked = true
    setListingTypeList(array1)

    let array2 = [...ownershipList]
    array2.map(item => {
      item.checked = false
    })
    array2[ownershipList.length - 1].checked = true
    setOwnershipList(array2)

    let array3 = [...studioList]
    array3.map(item => {
      item.checked = false
    })
    array3[studioList.length - 1].checked = true
    setStudioList(array3)
  }

  const removeFilter = filter => {
    if (filter === 'Listed' || filter === 'Not Listed') {
      let array = [...listingStatusList]
      array.map(item => {
        item.checked = false
      })
      array[listingStatusList.length - 1].checked = true
      setListingStatusList(array)
      setListingStatus(array[listingStatusList.length - 1])
    } else if (filter === 'Live Auction' || filter === 'Live Edition' || filter === 'Quick Buy') {
      let array1 = [...listingTypeList]
      array1.map(item => {
        item.checked = false
      })
      array1[listingTypeList.length - 1].checked = true
      setListingTypeList(array1)
    } else if (filter === 'Created' || filter === 'Collected') {
      let array1 = [...ownershipList]
      array1.map(item => {
        item.checked = false
      })
      array1[ownershipList.length - 1].checked = true
      setOwnershipList(array1)
    } else if (filter === 'Merch Enabled' || filter === 'Merch Disabled') {
      let array1 = [...studioList]
      array1.map(item => {
        item.checked = false
      })
      array1[studioList.length - 1].checked = true
      setStudioList(array1)
    }

    setLoadingData(true)
    setTimeout(() => {
      setNftList([])
      getNftItem(1, listingStatusList, listingTypeList, ownershipList, studioList, sortList, true)
    }, 100)
  }

  useEffect(() => {
    let array: any[] = []
    let tab_list

    if (isOwn) tab_list = TabListOwn
    else tab_list = TabList

    tab_list.map(item => {
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
      setShowCollections(collections)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, collections])

  useEffect(() => {
    let list = []
    listingStatusList.map(item => {
      if (item.checked === true && item.name !== 'All') list.push(item.name)
    })
    listingTypeList.map(item => {
      if (item.checked === true && item.name !== 'All') list.push(item.name)
    })
    ownershipList.map(item => {
      if (item.checked === true && item.name !== 'All') list.push(item.name)
    })
    studioList.map(item => {
      if (item.checked === true && item.name !== 'All') list.push(item.name)
    })
    setSelectedFilterList(list)
  }, [listingStatusList, listingTypeList, ownershipList, studioList])

  const handleSelectedTab = item => {
    setActiveTab(item.id)
  }

  const [showCollections, setShowCollections] = useState([])
  const [rowCount, setRowCount] = useState(10)
  const [pages, setPages] = useState(0)

  useEffect(() => {
    setPages(0)
    setTimeout(() => {
      setIsVisibleFetching(true)
      setNftList([])
    }, 500)
  }, [wallet])

  useEffect(() => {
    if (isFetching === true && !loadingData) {
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

  const handleListingStatus = index => {
    let array = [...listingStatusList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setListingStatusList(array)
    setListingStatus(array[index])

    setLoadingData(true)
    setTimeout(() => {
      setNftList([])
      getNftItem(1, array, listingTypeList, ownershipList, studioList, sortList, true)
    }, 500)
  }

  const handleListingType = index => {
    let array = [...listingTypeList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setListingTypeList(array)
    setLoadingData(true)
    setTimeout(() => {
      setNftList([])
      getNftItem(1, listingStatusList, array, ownershipList, studioList, sortList, true)
    }, 500)
  }

  const handleOwnership = index => {
    let array = [...ownershipList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setOwnershipList(array)
    setLoadingData(true)
    setTimeout(() => {
      setNftList([])
      getNftItem(1, listingStatusList, listingTypeList, array, studioList, sortList, true)
    }, 500)
  }

  const handleSelectStudio = index => {
    let array = [...studioList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setStudioList(array)
    setLoadingData(true)
    setTimeout(() => {
      setNftList([])
      getNftItem(1, listingStatusList, listingTypeList, ownershipList, array, sortList, true)
    }, 500)
  }

  const handleSelectSort = index => {
    let array = [...sortList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setSortList(array)
    setLoadingData(true)
    setTimeout(() => {
      setNftList([])
      getNftItem(1, listingStatusList, listingTypeList, ownershipList, studioList, array, true)
    }, 100)
  }

  const getNftItem = (page, listingStatusList, listingTypeList, ownershipList, studioList, sortList, reset = false) => {
    let sort = 'price-descending'
    sortList.map(item => {
      if (item.checked === true) {
        sort = item.value
      }
    })

    let params = {
      sort: sort,
      page: page,
      per_page: rowCount.toString(),
    }

    let listingStatus = null
    listingStatusList.map(item => {
      if (item.checked === true) {
        listingStatus = item
      }
    })
    let listingType = null
    listingTypeList.map(item => {
      if (item.checked === true) {
        listingType = item
      }
    })
    let onlyListed = false
    if (listingStatus?.id === 0) {
      if (listingType) {
        if (listingType.id === 3) {
          params['per_page'] = 'all'
          onlyListed = true
        } else {
          params['listing'] = listingType.value
          params['per_page'] = 'all'
        }
      }
    } else if (listingStatus?.id === 2) {
      if (listingType.id !== 3) {
        params['listing'] = listingType.value
        params['per_page'] = 'all'
      }
    } else {
      params['listing'] = 'unlisted'
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

    if (ownership && ownership.id !== 2) {
      params['ownership'] = ownership.value
    }

    if (merch && merch.id !== 2) {
      params['merch_hub'] = merch.value
    }

    setIsVisibleFetching(true)

    DashboardAPI.getArtworkList(wallet, params, onlyListed).then(
      response => {
        setLoadingData(false)
        setIsFetching(false)

        if (reset) setNftList(response)
        else setNftList([...nftList, ...response])

        fetchNftData(response)

        if (response.length < rowCount) {
          setIsVisibleFetching(false)
        } else {
          setPages(page)
          setIsVisibleFetching(true)
          if (params['per_page'] !== 'all' && response.length < 5)
            setTimeout(() => {
              setIsFetching(true)
            }, 500)
        }

        if (params['per_page'] === 'all') setIsVisibleFetching(false)
      },
      error => {
        setIsVisibleFetching(false)
      }
    )
  }

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const fetchNftData = nfts => {
    if (nfts.length > 0) {
      ;(async () => {
        for (let index = 0; index < nfts.length; index++) {
          let data = nfts[index]
          fetch(`/nft/${data.tokenId}`).then(e => e.text())
          if (index % 3 == 2) {
            await sleep(1000)
          }
        }
      })()
    }
  }

  return (
    <div className={styles.container}>
      <div className="w-full flex z-0 relative overflow-hidden xs:h-[72px] sm:h-[72px] md:h-[80px] lg:-ml-[20px]">
        <ProfileTab tabList={tabList} onChange={item => handleSelectedTab(item)} />
      </div>
      <div className={styles.divider} />

      {activeTab === 0 && (
        <div className="w-full">
          <div className="w-full hidden lg:flex justify-between mt-[30px]">
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
          {selectedFilterList.length > 0 && (
            <div className="w-full hidden lg:flex mt-[15px] items-center gap-[15px]">
              <div className="flex gap-[15px]">
                {selectedFilterList.map((item, index) => {
                  return (
                    <div key={index} className={styles.selectedFilter} onClick={() => removeFilter(item)}>
                      {item}
                      <CloseIcon />
                    </div>
                  )
                })}
              </div>
              <div
                className={styles.clearAll}
                onClick={() => {
                  setSelectedFilterList([])
                  resetFilter()
                  setLoadingData(true)
                  setTimeout(() => {
                    setNftList([])
                    getNftItem(1, listingStatusList, listingTypeList, ownershipList, studioList, sortList, true)
                  }, 100)
                }}
              >
                Clear&nbsp;all
              </div>
            </div>
          )}
          <div className="w-full flex lg:hidden gap-[11px] justify-between mt-[30px]">
            <BlackButton
              label="Filter"
              onClick={() => setOpenMobileFilter(!openMobileFilter)}
              fullWidth
              height="40px"
              color={'var(--text-gray-200-color)'}
              icon1={<FilterGrayIcon alt="" />}
              backgroundColor01="var(--background-main-color)"
              backgroundColor02="var(--background-main-color)"
              gradientDirection="bottom"
              fontFamily="Muli-Regular"
              fontSize={14}
              borderRadius={8}
              borderWidth={1}
              borderColor={'rgba(var(--text-gray-200-color-rgb), 0.1)'}
              direction="rtl"
            />

            <BlackButton
              label="Sort"
              onClick={() => setOpenMobileSort(!openMobileSort)}
              fullWidth
              height="40px"
              color={'var(--text-gray-200-color)'}
              icon1={<SortGrayIcon alt="" />}
              backgroundColor01="var(--background-main-color)"
              backgroundColor02="var(--background-main-color)"
              gradientDirection="bottom"
              fontFamily="Muli-Regular"
              fontSize={14}
              borderRadius={8}
              borderWidth={1}
              borderColor={'rgba(var(--text-gray-200-color-rgb), 0.1)'}
              direction="rtl"
            />
          </div>

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
                    onClick={() => {}}
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
                    onClick={() => {}}
                    key={index}
                  />
                ) : (
                  <HomeNftCard
                    image={item.assetUrl}
                    token_id={item.tokenId}
                    nftName={item.nftName}
                    assetType={item.assetType}
                    coverImage={item.coverImageUrl}
                    artistName={item.artistUsername}
                    artistImage={item.artistProfilePicture}
                    collectionName={item.collectionName}
                    price={item.listPrice}
                    showHideButton={isOwn}
                    currentSupply={item.currentSupply}
                    maxSupply={item.maxSupply}
                    onClick={() => {}}
                    key={index}
                  />
                )
              })}
            </div>
            {isVisibleFetching && (
              <div className="w-full mt-[100px]">
                <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} text="Loading artworks" />
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="w-full">
          <CollectionSwiperSection collections={showCollections} showRemoveButton={isOwn} />
          {collections.length > 0 && isMounted && isVisibleFetchingCreated && (
            <LoadingComponent
              isFetching={isFetchingCreated}
              setIsFetching={setIsFetchingCreated}
              text="Loading collections"
            />
          )}
        </div>
      )}

      {activeTab === 2 && (
        <div className="w-full flex flex-wrap">
          <OfferSection
            offerNftsMade={offerNftsMade}
            setOfferNftsMade={setOfferNftsMade}
            offerNftsReceived={offerNftsReceived}
            setOfferNftsReceived={setOfferNftsReceived}
          />
        </div>
      )}

      {activeTab === 3 && (
        <div className="w-full flex flex-wrap">
          <ActivitySection activityNfts={activityNfts} setActivityNfts={setActivityNfts} />
        </div>
      )}
      {activeTab === 4 && (
        <div className="w-full flex flex-wrap">
          <FavoriteSection
            favoriteNfts={favoriteNfts}
            favoriteCollections={favoriteCollections}
            setFavoriteNfts={setFavoriteNfts}
            setFavoriteCollections={setFavoriteCollections}
          />
        </div>
      )}
      {activeTab === 5 && (
        <div className="w-full flex flex-wrap">
          <HiddenSection hiddenNfts={hiddenNfts} setHiddenNfts={setHiddenNfts} />
        </div>
      )}
      <div className="flex lg:hidden w-full">
        {openMobileFilter && (
          <MobileProfileFilter
            listingStatus={listingStatusList}
            listingType={listingTypeList}
            ownership={ownershipList}
            studio={studioList}
            onFilter={params => {
              let { listingStatus, listingType, ownership, studio } = params
              setListingStatusList(listingStatus)
              setListingTypeList(listingType)
              setOpenMobileFilter(false)
              setLoadingData(true)
              setTimeout(() => {
                setNftList([])
                getNftItem(1, listingStatus, listingType, ownership, studio, sortList, true)
              }, 100)
            }}
            onClose={() => setOpenMobileFilter(false)}
          />
        )}

        {openMobileSort && (
          <MobileStudioSort
            open={openMobileSort}
            sort={sortList}
            onSort={params => {
              setSortList(params)
              setOpenMobileSort(false)
              setLoadingData(true)
              setTimeout(() => {
                setNftList([])
                getNftItem(1, listingStatusList, listingTypeList, ownershipList, studioList, params, true)
              }, 100)
            }}
            onClose={() => setOpenMobileSort(false)}
          />
        )}
      </div>
    </div>
  )
}

export default TabSection

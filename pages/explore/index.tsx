import React, { useEffect, useState } from 'react'

// next components
import Head from 'next/head'
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
import Select from 'components/Select'
import Tab from 'components/Tab'
import NFTCard from 'components/Card/NFTCard'
import CollectionCard from 'components/Card/CollectionCard'
import EcosystemCard from 'components/Card/EcosystemCard'
import OutlineButton from 'components/Button/OutlineButton'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'

// json
import TabList from 'assets/json/explore/tab-list.json'
import NFTSortList from 'assets/json/explore/nft-sort.json'
import CollectionSortList from 'assets/json/explore/collection-sort.json'
import EcosystemSortList from 'assets/json/explore/ecosystem-sort.json'
import CategoryList from 'assets/json/popular-category.json'
import AvailabilityList from 'assets/json/explore/availability.json'
import MediumList from 'assets/json/explore/medium.json'
import MarketList from 'assets/json/explore/market.json'

// images and icons
import PreviewImage from 'assets/images/preview-image.png'
import FilterGrayIcon from 'assets/icons/filter-gray.svg?component'
import SortGrayIcon from 'assets/icons/sort-gray.svg?component'

// styles
import styles from './index.module.scss'

// solana
import { useViewport } from 'utils'
import { getAbsoluteOgUrl } from 'utils/seo'

// apis
import ExploreAPI from 'apis/explore'
import SortMobileModal from 'components/Menu/SortMobileModal'
import NFTAuctionCard from 'components/Card/NFTAuctionCard'
import { getTimeDifference, isAvailableDate } from 'utils/helpers'
import LoadingComponent from './LoadingComponent'
import GradientButton from 'components/Button/GradientButton'

const Explore = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const isLoading = useSelector<any>(state => state.isLoading)

  const [isMounted, setIsMounted] = useState(false)
  const availabilityFilter = useSelector<any>(state => state.availabilityFilter)
  const collectionCategory = useSelector<any>(state => state.collectionCategory)
  const artworkCategory = useSelector<any>(state => state.artworkCategory)
  const artworkSort = useSelector<any>(state => state.artworkSort)
  const exploreTab = useSelector<any>(state => state.exploreTab)
  const [tabList, setTabList] = useState<any>(TabList)
  const [nftList, setNftList] = useState<any>([])
  const [collectionList, setCollectionList] = useState<any>([])
  const [ecosystemList, setEcosystemList] = useState<any>([])
  const [categoryList, setCategoryList] = useState<any>([])
  const [nftCurrentPage, setNftCurrentPage] = useState(0)
  const [collectionCurrentPage, setCollectionCurrentPage] = useState(0)
  const [ecosystemCurrentPage, setEcoSystemCurrentPage] = useState(0)

  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [rowCount, setRowCount] = useState(12)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)

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
    dispatch({ type: 'set', exploreTab: item.id })
  }

  const [sortData, setSortData] = useState(NFTSortList)
  const [selectedSort, setSelectedSort] = useState(NFTSortList[0])
  const [selectedAvailability, setSelectedAvailability] = useState<any>(AvailabilityList[3])
  const [selectedMedium, setSelectedMedium] = useState<any>(MediumList[4])
  const [selectedMarket, setSelectedMarket] = useState<any>(MarketList[2])

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true)
    }, 1000)
    return () => {
      dispatch({ type: 'set', availabilityFilter: 3 })
      dispatch({ type: 'set', collectionSort: '' })
      dispatch({ type: 'set', artistSort: '' })
      dispatch({ type: 'set', artworkSort: '' })
      dispatch({ type: 'set', collectionCategory: '' })
      dispatch({ type: 'set', artworkCategory: '' })
    }
  }, [])

  useEffect(() => {
    setIsMounted(false)
    setIsFetching(false)
    setIsVisibleFetching(true)

    setTimeout(() => {
      setIsMounted(true)
    }, 2000)
    let availability = selectedAvailability
    if (availabilityFilter === 0) {
      availability = AvailabilityList[0]
      setSelectedAvailability(availability)
    } else if (availabilityFilter === 1) {
      availability = AvailabilityList[1]
      setSelectedAvailability(availability)
    }

    switch (exploreTab) {
      case 0:
        setSortData(NFTSortList)
        if (artworkSort === 'popular') {
          setSelectedSort(NFTSortList[2])
        } else {
          setSelectedSort(NFTSortList[0])
        }
        setCurrentPage(nftCurrentPage)
        let artworkCatelist = []
        CategoryList.filter(category => category.query == artworkCategory).forEach(item => {
          let object: any = item
          object.checked = true
          artworkCatelist.push(object)
        })
        setCategoryList(artworkCatelist)
        getExploreNFTData(
          nftCurrentPage,
          artworkCatelist,
          availability,
          selectedMedium,
          selectedMarket,
          NFTSortList[0],
          rowCount,
          true
        )
        break
      case 1:
        setSortData(CollectionSortList)
        let sortList
        setSelectedSort(CollectionSortList[2])
        sortList = CollectionSortList[2]
        setCurrentPage(collectionCurrentPage)
        let list = []
        CategoryList.filter(category => category.query == collectionCategory).forEach(item => {
          let object: any = item
          object.checked = true
          list.push(object)
        })
        setCategoryList(list)
        getExploreCollectionData(collectionCurrentPage, list, sortList, rowCount, true)
        break
      case 2:
        setSortData(EcosystemSortList)
        setSelectedSort(EcosystemSortList[2])
        setCurrentPage(ecosystemCurrentPage)
        getExploreArtistData(ecosystemCurrentPage, EcosystemSortList[2], rowCount, true)
        break
      default:
        break
    }
  }, [exploreTab, availabilityFilter])

  useEffect(() => {
    if (!isMounted) return

    switch (exploreTab) {
      case 0:
        getExploreNFTData(
          nftCurrentPage,
          categoryList,
          selectedAvailability,
          selectedMedium,
          selectedMarket,
          selectedSort,
          rowCount,
          true
        )
        break
      case 1:
        getExploreCollectionData(collectionCurrentPage, categoryList, selectedSort, rowCount, true)
        break
      case 2:
        getExploreArtistData(ecosystemCurrentPage, selectedSort, rowCount, true)
        break
      default:
        break
    }
  }, [selectedAvailability, selectedMedium, selectedMarket, selectedSort])

  const [openMobileFilter, setOpenMobileFilter] = useState(false)
  const [openMobileSort, setOpenMobileSort] = useState(false)

  const getExploreNFTData = async (curPage, categoryList, availability, medium, market, sort, count, reset = false) => {
    let categoryLabel = []
    categoryList.map(category => {
      if (category.checked === true) {
        categoryLabel.push(category.query)
      }
    })
    let page = curPage
    if (reset === true) {
      page = 0
    }

    if (nftList.length === 0) dispatch({ type: 'set', isLoading: true })

    ExploreAPI.getExploreNFT({
      categories: categoryLabel.length === 0 ? null : categoryLabel,
      availability: availability.value,
      medium: medium.value,
      market: market.value,
      sort: sort.value,
      page: page + 1,
      per_page: count,
    }).then(
      response => {
        dispatch({ type: 'set', isLoading: false })
        setIsFetching(false)
        let nfts = []
        if (response.length === rowCount) setIsVisibleFetching(true)
        else setIsVisibleFetching(false)

        if (availability.value === 'timed') {
          response.forEach(nft => {
            if (isAvailableAuctionCard(nft)) {
              nfts.push({
                token_id: nft.token_id,
                image: nft.asset_url,
                name: nft.nft_name,
                asset_type: nft.asset_type,
                cover_image_url: nft.cover_image_url,
                creator: nft.artist_username,
                url: `/nft/${nft.token_id}`,
                price: nft.list_price,
                current_bid: nft.current_bid,
                list_price: nft.list_price,
                start_time: nft.start_time,
                end_time: nft.end_time,
                reserve_price: nft.reserve_price,
                collection_name: nft.collection_name,
              })
            }
          })
        } else {
          nfts = response.map(nft => {
            return {
              token_id: nft.token_id,
              image: nft.asset_url,
              name: nft.nft_name,
              asset_type: nft.asset_type,
              cover_image_url: nft.cover_image_url,
              creator: nft.artist_username,
              url: `/nft/${nft.token_id}`,
              price: nft.list_price,
              current_bid: nft.current_bid,
              list_price: nft.list_price,
              start_time: nft.start_time,
              end_time: nft.end_time,
              reserve_price: nft.reserve_price,
              collection_name: nft.collection_name,
            }
          })
        }

        setCurrentPage(curPage)
        setNftCurrentPage(curPage)
        setTotalCount(count * curPage + nfts.length)

        if (reset === true) setNftList([...nfts])
        else setNftList([...nftList, ...nfts])
      },
      error => {
        dispatch({ type: 'set', isLoading: false })
        setIsFetching(false)
        setIsVisibleFetching(false)
      }
    )
  }

  const getExploreCollectionData = async (curPage, categoryList, sort, count, reset = false) => {
    let categoryLabel = []
    categoryList.map(category => {
      if (category.checked === true) {
        categoryLabel.push(category.query)
      }
    })

    if (collectionList.length === 0) dispatch({ type: 'set', isLoading: true })

    let page = curPage
    if (reset === true) {
      page = 0
    }

    ExploreAPI.getExploreCollection({
      categories: categoryLabel.length === 0 ? null : categoryLabel,
      availability: null,
      medium: null,
      market: null,
      sort: sort.value,
      page: page + 1,
      per_page: count,
    }).then(
      response => {
        dispatch({ type: 'set', isLoading: false })
        setIsFetching(false)
        if (response.length === rowCount) setIsVisibleFetching(true)
        else setIsVisibleFetching(false)
        const collections = response.map(nft => {
          return {
            collectionId: nft.collection_id,
            image: nft.cover_image,
            collectionName: nft.collection_name,
            artistName: nft.artist_username,
            url: `/collection?id=${nft.collection_id}`,
            mintAddress: nft.artist_id,
          }
        })
        setCurrentPage(curPage)
        setCollectionCurrentPage(curPage)
        setTotalCount(count * curPage + collections.length)
        if (reset === true) setCollectionList([...collections])
        else setCollectionList([...collectionList, ...collections])
      },
      error => {
        dispatch({ type: 'set', isLoading: false })
        setIsFetching(false)
        setIsVisibleFetching(false)
      }
    )
  }

  const getExploreArtistData = async (curPage, sort, count, reset = false) => {
    if (ecosystemList.length === 0) dispatch({ type: 'set', isLoading: true })

    let page = curPage
    if (reset === true) {
      page = 0
    }

    ExploreAPI.getExploreArtists({
      categories: null,
      availability: null,
      medium: null,
      market: null,
      sort: sort.value,
      page: page + 1,
      per_page: count,
    }).then(
      response => {
        dispatch({ type: 'set', isLoading: false })
        setIsFetching(false)
        if (response.length === rowCount) setIsVisibleFetching(true)
        else setIsVisibleFetching(false)

        setCurrentPage(curPage)
        setEcoSystemCurrentPage(curPage)
        setTotalCount(count * curPage + response.length)

        if (reset === true) setEcosystemList([...response])
        else setEcosystemList([...ecosystemList, ...response])
      },
      error => {
        dispatch({ type: 'set', isLoading: false })
        setIsFetching(false)
        setIsVisibleFetching(false)
      }
    )
  }

  const handleNextPage = () => {
    if (totalCount < (currentPage + 1) * rowCount) return
    const nextPage = currentPage + 1

    if (exploreTab === 0)
      getExploreNFTData(
        nextPage,
        categoryList,
        selectedAvailability,
        selectedMedium,
        selectedMarket,
        selectedSort,
        rowCount
      )
    else if (exploreTab === 1) getExploreCollectionData(nextPage, categoryList, selectedSort, rowCount)
    else if (exploreTab === 2) getExploreArtistData(nextPage, selectedSort, rowCount)
  }

  const selectCategory = categoryList => {
    setCategoryList(categoryList)

    if (exploreTab === 0)
      getExploreNFTData(
        currentPage,
        categoryList,
        selectedAvailability,
        selectedMedium,
        selectedMarket,
        selectedSort,
        rowCount,
        true
      )
    else if (exploreTab === 1) getExploreCollectionData(currentPage, categoryList, selectedSort, rowCount, true)
    else if (exploreTab === 2) getExploreArtistData(currentPage, selectedSort, rowCount, true)
  }

  const selectRowCount = count => {
    setRowCount(count)
    if (exploreTab === 0)
      getExploreNFTData(
        currentPage,
        categoryList,
        selectedAvailability,
        selectedMedium,
        selectedMarket,
        selectedSort,
        count
      )
    else if (exploreTab === 1) getExploreCollectionData(currentPage, categoryList, selectedSort, count)
    else if (exploreTab === 2) getExploreArtistData(currentPage, selectedSort, count)
  }

  const onMobileFilter = async params => {
    let categoryList = params['category']
    let newCateList = JSON.parse(JSON.stringify(categoryList))
    setCategoryList(newCateList)

    if (exploreTab === 0) {
      let availability = params['availability']
      setSelectedAvailability(availability)

      let medium = params['medium']
      setSelectedMedium(medium)

      let market = params['market']
      setSelectedMarket(market)
      getExploreNFTData(currentPage, newCateList, availability, medium, market, selectedSort, rowCount, true)
    } else if (exploreTab === 1) {
      getExploreCollectionData(currentPage, newCateList, selectedSort, rowCount, true)
    } else {
      getExploreArtistData(currentPage, selectedSort, rowCount, true)
    }
  }

  const onMobileSort = async params => {
    let sort = params['sort']
    setSelectedSort(sort)

    if (exploreTab === 0)
      getExploreNFTData(
        currentPage,
        categoryList,
        selectedAvailability,
        selectedMedium,
        selectedMarket,
        sort,
        rowCount,
        true
      )
    else if (exploreTab === 1) {
      getExploreCollectionData(currentPage, categoryList, sort, rowCount, true)
    } else {
      getExploreArtistData(currentPage, sort, rowCount, true)
    }
  }

  const isAvailableAuctionCard = nft => {
    let start_time = nft.start_time
    let end_time = nft.end_time
    if (start_time === null || end_time === null) return false
    if (getTimeDifference(end_time) < 0) return false
    if (isAvailableDate(start_time, end_time)) return true
    else return false
  }

  useEffect(() => {
    if (isFetching === true) {
      handleNextPage()
    }
  }, [isFetching])

  let pageTitle = 'Explore'
  let pageImageUrl = getAbsoluteOgUrl(PreviewImage.src)
  let pageDescription =
    'Home to creators, collectors, and curators around the world.\n' +
    'Pushing the boundaries of digital art on Solana.'

  return (
    <div className="g-container">
      <Head>
        <title>{pageTitle}</title>

        <meta name="description" content={pageDescription} />

        <meta name="og:title" content={pageTitle} />
        <meta name="og:description" content={pageDescription} />
        <meta name="og:image" content={pageImageUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImageUrl} />

        <link rel="icon" href="/logo.png" />
      </Head>
      <div className={styles.container}>
        {/* <div className={`${styles.title} w-full text-center hidden lg:flex lg:text-start`}>Explore</div> */}
        <div className="w-full flex justify-between gap-0 lg:gap-[30px] xl:gap-[75px] z-10">
          {/* filter menu part */}
          <div className="hidden lg:flex max-w-[324px] min-w-[324px] w-full">
            {exploreTab === 0 && (
              <NFTFilter
                selectedAvailability={selectedAvailability}
                setSelectedAvailability={setSelectedAvailability}
                selectCategory={selectCategory}
                selectedMedium={selectedMedium}
                setSelectedMedium={setSelectedMedium}
                selectedMarket={selectedMarket}
                setSelectedMarket={setSelectedMarket}
              />
            )}
            {exploreTab === 1 && <CollectionFilter selectCategory={selectCategory} />}
            {exploreTab === 2 && <EcosystemFilter />}
          </div>
          {/* content part */}
          <div className="w-full flex-1 flex-wrap">
            <div className="w-full flex flex-wrap justify-center lg:justify-between items-center mb-0 lg:mb-[80px] z-10">
              <div className={styles.tabContainer}>
                <Tab tabList={tabList} onChange={item => handleSelectedTab(item)} />
              </div>
              <div className="hidden lg:flex max-w-[280px] xl:min-w-[280px] xl:w-full z-20">
                <Select
                  data={sortData}
                  selected={selectedSort}
                  onChange={item => setSelectedSort(item)}
                  maxHeight="none"
                />
              </div>
            </div>
            <div className="flex lg:hidden w-full justify-between items-center gap-[11px] z-10 mb-6 mt-2">
              <GradientButton
                label="Filter"
                onClick={() => setOpenMobileFilter(!openMobileFilter)}
                fullWidth
                height="40px"
                color={'var(--text-gray-200-color)'}
                icon1={<FilterGrayIcon alt="" />}
                backgroundColor01="var(--resource-card-bg)"
                backgroundColor02="var(--resource-card-bg)"
                gradientDirection="bottom"
                fontFamily="Muli-Regular"
                fontSize={14}
                borderRadius={8}
                borderWidth={1}
                borderColor={'rgba(var(--text-gray-200-color-rgb), 0.1)'}
                direction="rtl"
              />
              <GradientButton
                label="Sort"
                onClick={() => setOpenMobileSort(!openMobileSort)}
                fullWidth
                height="40px"
                color={'var(--text-gray-200-color)'}
                icon1={<SortGrayIcon alt="" />}
                backgroundColor01="var(--resource-card-bg)"
                backgroundColor02="var(--resource-card-bg)"
                gradientDirection="bottom"
                fontFamily="Muli-Regular"
                fontSize={14}
                borderRadius={8}
                borderWidth={1}
                borderColor={'rgba(var(--text-gray-200-color-rgb), 0.1)'}
                direction="rtl"
              />
            </div>
            <div className="w-full relative z-10">
              {exploreTab === 0 && (
                <div className="w-full grid grid-cols-12 gap-x-2 gap-y-4 xl:gap-x-10 xl:gap-y-8 z-10">
                  {nftList.length !== 0 &&
                    nftList?.map((item, index) => {
                      return (
                        <div className="col-span-6 2xl:col-span-4 z-10" key={index}>
                          {selectedAvailability.value === 'timed' ? (
                            <NFTAuctionCard
                              image={item.image}
                              assetType={item.asset_type}
                              coverImage={item.cover_image_url}
                              currentBid={item.current_bid}
                              reservePrice={item.reserve_price}
                              endTime={item.end_time}
                              onClick={() => {
                                dispatch({ type: 'set', isLoading: true })
                                router.push(item.url)
                              }}
                              price={item.price}
                            />
                          ) : selectedAvailability.value === 'all' ? (
                            isAvailableAuctionCard(item) ? (
                              <NFTAuctionCard
                                image={item.image}
                                assetType={item.asset_type}
                                coverImage={item.cover_image_url}
                                currentBid={item.current_bid}
                                reservePrice={item.reserve_price}
                                endTime={item.end_time}
                                onClick={() => {
                                  dispatch({ type: 'set', isLoading: true })
                                  router.push(item.url)
                                }}
                                price={item.price}
                              />
                            ) : (
                              <NFTCard
                                token_id={item.token_id}
                                image={item.image}
                                nftName={item.name}
                                assetType={item.asset_type}
                                coverImage={item.cover_image_url}
                                artistName={item.creator}
                                collectionName={item.collection_name}
                                onClick={() => {
                                  dispatch({ type: 'set', isLoading: true })
                                  router.push(item.url)
                                }}
                                price={item.price}
                              />
                            )
                          ) : (
                            <NFTCard
                              token_id={item.token_id}
                              image={item.image}
                              nftName={item.name}
                              assetType={item.asset_type}
                              coverImage={item.cover_image_url}
                              artistName={item.creator}
                              collectionName={item.collection_name}
                              onClick={() => {
                                dispatch({ type: 'set', isLoading: true })
                                router.push(item.url)
                              }}
                              price={item.price}
                            />
                          )}
                        </div>
                      )
                    })}
                </div>
              )}
              {exploreTab === 1 && (
                <div className="w-full grid grid-cols-12 gap-x-2 gap-y-4 xl:gap-x-10 xl:gap-y-8">
                  {collectionList.length !== 0 &&
                    collectionList.map((item, index) => (
                      <div className="col-span-6 2xl:col-span-4 z-10" key={index}>
                        <CollectionCard
                          image={item.image}
                          nftName={item.collectionName}
                          artistName={item.artistName}
                          collectionName={item.collectionName}
                          price={item.price}
                          link={`/collection/${item.collectionId}`}
                        />
                      </div>
                    ))}
                </div>
              )}
              {exploreTab === 2 && (
                <div className="w-full grid grid-cols-12 gap-x-2 gap-y-4 xl:gap-x-10 xl:gap-y-8">
                  {ecosystemList.map((item, index) => (
                    <div className="col-span-6 lg:col-span-6 xl:col-span-6 2xl:col-span-4 z-10" key={index}>
                      <EcosystemCard data={item} />
                    </div>
                  ))}
                </div>
              )}
              {isMounted && isVisibleFetching && (
                <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
              )}
              {/* <div className="w-full flex justify-end">
                <ExplorePagination
                  currentPage={currentPage}
                  totalCount={totalCount}
                  rowCount={rowCount}
                  setRowCount={count => {
                    selectRowCount(count)
                  }}
                  handleNext={handleNextPage}
                  handlePrev={handlePreviousPage}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex lg:hidden w-full">
        {openMobileFilter && exploreTab === 0 && (
          <MobileNFTFilter
            category={categoryList}
            availability={selectedAvailability}
            medium={selectedMedium}
            market={selectedMarket}
            onFilter={params => {
              onMobileFilter(params)
              setOpenMobileFilter(false)
            }}
            onClose={() => setOpenMobileFilter(false)}
          />
        )}
        {openMobileFilter && exploreTab === 1 && (
          <MobileCollectionFilter
            category={categoryList}
            onFilter={params => {
              onMobileFilter(params)
              setOpenMobileFilter(false)
            }}
            onClose={() => setOpenMobileFilter(false)}
          />
        )}
        {openMobileFilter && exploreTab === 2 && <MobileEcosystemFilter onClose={() => setOpenMobileFilter(false)} />}
        {openMobileSort && (
          <SortMobileModal
            open={openMobileSort}
            data={sortData}
            sort={selectedSort}
            onSort={params => {
              onMobileSort(params)
              setOpenMobileSort(false)
            }}
            onClose={() => setOpenMobileSort(false)}
          />
        )}
      </div>
      <FullScreenLoadingModal open={isLoading} />
    </div>
  )
}

export default Explore

Explore.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

import React, { useEffect, useState } from 'react'

// next components

// components
import IconTab from 'components/Tab/IconTab'

// json
import TabList from 'assets/json/artist-profile/tab-list.json'

// resources
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'

// styles
import styles from './index.module.scss'
import LiveAuctionSection from 'components/pages/Home/LiveAuctionSection'
import ActiveListingSection from 'components/pages/ArtistProfile/ActiveListingSection'
import NFTSwiperSection from 'components/pages/ArtistProfile/NFTSwiperSection'
import ArtistPagination from 'components/Button/ArtistPagination'

// apis
import CollectionSwiperSection from 'components/pages/ArtistProfile/CollectionSwiperSection'
import LoadingComponent from 'pages/explore/LoadingComponent'
import SubTabSection from 'components/pages/ArtistProfile/SubTabSection'

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
    artistStatsInfo,
    collectorStatsInfo,
    setActiveListingLoaded,
    setLiveAuctionLoaded,
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

  const [activeTab, setActiveTab] = useState<any>(0)

  const [tabList, setTabList] = useState<any[]>(TabList)
  const [isMounted, setIsMounted] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true)
    }, 1000)
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

    if (activeTab === 1) {
      setArtistEnable(true)
      setMerchEnable(false)
      setCollectorEnable(false)
    } else if (activeTab === 2) {
      setArtistEnable(false)
      setMerchEnable(true)
      setCollectorEnable(false)
    } else if (activeTab === 4) {
      setShowCollections(collections.slice(0, rowCount))
      setIsFetching(false)
      setIsVisibleFetching(true)
      setArtistEnable(false)
      setMerchEnable(false)
      setCollectorEnable(false)
    }
  }, [activeTab])

  const handleSelectedTab = item => {
    setActiveTab(item.id)
  }

  const [showCollections, setShowCollections] = useState([])
  const [rowCount, setRowCount] = useState(12)

  useEffect(() => {
    if (isFetching === true) {
      if (activeTab === 1 || activeTab === 2) handleNextPage()
      else if (activeTab === 4) {
        setTimeout(() => {
          setIsFetching(false)
          if (showCollections.length + rowCount > collections.length) {
            setShowCollections([...showCollections, ...collections.slice(showCollections.length, collections.length)])
            setIsVisibleFetching(false)
          } else {
            setShowCollections([
              ...showCollections,
              ...collections.slice(showCollections.length, showCollections.length + rowCount),
            ])
            setIsVisibleFetching(true)
          }
        }, 2000)
      }
    }
  }, [isFetching])

  useEffect(() => {
    if (isFetchingCreated === true) {
      handleNextPage()
    }
  }, [isFetchingCreated])

  useEffect(() => {
    if (isFetchingCollected === true) {
      handleNextPage()
    }
  }, [isFetchingCollected])

  useEffect(() => {
    if (isFetchingMerch === true) {
      handleNextPage()
    }
  }, [isFetchingMerch])

  useEffect(() => {
    if (isFetching === true) {
      if (activeTab === 1 || activeTab === 2) handleNextPage()
      else if (activeTab === 4) {
        setTimeout(() => {
          setIsFetching(false)
          if (showCollections.length + rowCount > collections.length) {
            setShowCollections([...showCollections, ...collections.slice(showCollections.length, collections.length)])
            setIsVisibleFetching(false)
          } else {
            setShowCollections([
              ...showCollections,
              ...collections.slice(showCollections.length, showCollections.length + rowCount),
            ])
            setIsVisibleFetching(true)
          }
        }, 2000)
      }
    }
  }, [isFetching])

  return (
    <div className={styles.container}>
      <div className="relative w-full flex z-10 relative overflow-hidden xs:h-[72px] sm:h-[72px] md:h-[76px] -ml-[10px]">
        <IconTab tabList={tabList} onChange={item => handleSelectedTab(item)} />
      </div>
      <div className={styles.divider} />

      {activeTab === 0 && (
        <div className="w-full">
          <NFTSwiperSection nfts={createdNfts} showHideButton={isOwn} isLoaded={isLoaded} />
          {createdNfts?.length > 0 && isLoaded && isVisibleFetchingCreated && (
            <LoadingComponent isFetching={isFetchingCreated} setIsFetching={setIsFetchingCreated} />
          )}
        </div>
      )}

      {activeTab === 1 && (
        <div className="w-full">
          <SubTabSection
            category={''}
            artist={wallet}
            fromPage={'profile'}
            setLiveAuctionLoaded={() => setLiveAuctionLoaded(true)}
            loadCompleted={() => setActiveListingLoaded(true)}
          />
        </div>
      )}
      {activeTab === 2 && (
        <div className="w-full">
          <NFTSwiperSection nfts={merchNfts} showHideButton={isOwn} isLoaded={isLoaded} />
          {merchNfts?.length > 0 && isLoaded && isVisibleFetchingMerch && (
            <LoadingComponent isFetching={isFetchingMerch} setIsFetching={setIsFetchingMerch} />
          )}
          {/* <div className="w-full flex justify-end">
                  <ArtistPagination
                    currentPage={collectorCurrentPage}
                    rowCount={collectorRowCount}
                    totalCount={collectorTotalCount}
                    setRowCount={count => {
                      selectRowCount(count)
                    }}
                    handleNext={handleNextPage}
                    handlePrev={handlePreviousPage}
                  />
                </div> */}
        </div>
      )}

      {activeTab === 3 && (
        <div className="w-full">
          <NFTSwiperSection nfts={collectedNfts} showHideButton={isOwn} isLoaded={isLoaded} />
          {collectedNfts.length > 0 && isLoaded && isVisibleFetchingCollected && (
            <LoadingComponent isFetching={isFetchingCollected} setIsFetching={setIsFetchingCollected} />
          )}

          {/* <div className="w-full flex justify-end">
                  <ArtistPagination
                    currentPage={collectorCurrentPage}
                    rowCount={collectorRowCount}
                    totalCount={collectorTotalCount}
                    setRowCount={count => {
                      selectRowCount(count)
                    }}
                    handleNext={handleNextPage}
                    handlePrev={handlePreviousPage}
                  />
                </div> */}
        </div>
      )}

      {activeTab === 4 && (
        <div className="w-full">
          <CollectionSwiperSection collections={showCollections} />
          {collections.length > 0 && isMounted && isVisibleFetching && (
            <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
          )}
        </div>
      )}

      {activeTab === 5 && (
        <div className={styles.statsSection}>
          <div className="flex justify-between">
            <div>Total Volume Sold</div>
            <div className="flex gap-2 items-center">
              <div>
                <SolanaLogoIcon alt="" />
              </div>
              <div>{artistStatsInfo?.sales_volume}</div>
            </div>
          </div>
          <div className="flex justify-between mt-[30px]">
            <div>Total Volume Purchased</div>
            <div className="flex gap-2 items-center">
              <div>
                <SolanaLogoIcon alt="" />
              </div>
              <div>{collectorStatsInfo?.purchase_volume}</div>
            </div>
          </div>
          <div className="flex justify-between mt-[30px]">
            <div>Artwork Created</div>
            <div>{artistStatsInfo?.nfts_created}</div>
          </div>
          <div className="flex justify-between mt-[30px]">
            <div>Artwork Collected</div>
            <div>{collectorStatsInfo?.nfts_collected}</div>
          </div>
          <div className="flex justify-between mt-[30px]">
            <div>Collections Published</div>
            <div>{artistStatsInfo?.collections_created}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TabSection

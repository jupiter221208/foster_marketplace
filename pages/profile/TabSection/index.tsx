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
import LiveAuctionSection from 'components/pages/ArtistProfile/LiveAuctionSection'
import ActiveListingSection from 'components/pages/ArtistProfile/ActiveListingSection'
import NFTSwiperSection from 'components/pages/ArtistProfile/NFTSwiperSection'

// apis
import CollectionSwiperSection from 'components/pages/ArtistProfile/CollectionSwiperSection'
import LoadingComponent from 'pages/explore/LoadingComponent'
import SubTabSection from 'components/pages/ArtistProfile/SubTabSection'
import TimeSlotButton from 'components/Button/TimeSlotButton'
import AboutSection from 'components/pages/ArtistProfile/AboutSection'

const TabSection = props => {
  const {
    createdNfts,
    collectedNfts,
    merchNfts,
    collections,
    wallet,
    description,
    categoryList,
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
  const [artworkType, setArtworkType] = useState('created')

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

    if (activeTab === 0) {
      if (artworkType === 'created') {
        setArtistEnable(true)
        setMerchEnable(false)
        setCollectorEnable(false)
      } else if (artworkType === 'studio') {
        setArtistEnable(false)
        setMerchEnable(true)
        setCollectorEnable(false)
      } else if (artworkType === 'collected') {
        setArtistEnable(false)
        setMerchEnable(false)
        setCollectorEnable(true)
      }
    } else if (activeTab === 1) {
      setShowCollections(collections.slice(0, rowCount))
      setIsFetching(false)
      setIsVisibleFetching(true)
      setArtistEnable(false)
      setMerchEnable(false)
      setCollectorEnable(false)
    }
  }, [activeTab, artworkType])

  const handleSelectedTab = item => {
    setActiveTab(item.id)
  }

  const [showCollections, setShowCollections] = useState([])
  const [rowCount, setRowCount] = useState(12)

  useEffect(() => {
    if (isFetching === true) {
      if (activeTab === 0 && (artworkType === 'listed' || artworkType === 'studio')) handleNextPage()
      else if (activeTab === 1) {
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

  return (
    <div className={styles.container}>
      <div className="relative w-full flex z-10 relative overflow-hidden xs:h-[72px] sm:h-[72px] md:h-[76px] -ml-[10px]">
        <IconTab tabList={tabList} onChange={item => handleSelectedTab(item)} />
      </div>
      <div className={styles.divider} />

      {activeTab === 0 && (
        <div className="w-full">
          <div className="w-full flex overflow-x-scroll no-scrollbar mt-5 gap-2 lg:gap-4">
            {/* <TimeSlotButton
              label="All"
              width={50}
              height={42}
              fontFamily={'Muli-Regular'}
              color={artworkType === 'all' ? '#1A1A1A' : 'var(--time-slot-deselect-color)'}
              backgroundColor01={artworkType === 'all' ? 'var(--toggle-bg-color)' : 'var(--time-slot-bg)'}
              backgroundColor02={artworkType === 'all' ? 'var(--toggle-bg-color)' : 'var(--time-slot-bg)'}
              onClick={() => {
                setArtworkType('all')
              }}
            /> */}

            <TimeSlotButton
              label="Quick&nbsp;Buy"
              height={42}
              fontFamily={'Muli-Regular'}
              color={artworkType === 'listed' ? '#1A1A1A' : 'var(--time-slot-deselect-color)'}
              backgroundColor01={artworkType === 'listed' ? 'var(--toggle-bg-color)' : 'var(--time-slot-bg)'}
              backgroundColor02={artworkType === 'listed' ? 'var(--toggle-bg-color)' : 'var(--time-slot-bg)'}
              onClick={() => {
                setArtworkType('listed')
              }}
            />

            <TimeSlotButton
              label="Live&nbsp;Auction"
              height={42}
              fontFamily={'Muli-Regular'}
              color={artworkType === 'auction' ? '#1A1A1A' : 'var(--time-slot-deselect-color)'}
              backgroundColor01={artworkType === 'auction' ? 'var(--toggle-bg-color)' : 'var(--time-slot-bg)'}
              backgroundColor02={artworkType === 'auction' ? 'var(--toggle-bg-color)' : 'var(--time-slot-bg)'}
              onClick={() => {
                setArtworkType('auction')
              }}
            />

            <TimeSlotButton
              label="Studio"
              height={42}
              fontFamily={'Muli-Regular'}
              color={artworkType === 'studio' ? '#1A1A1A' : 'var(--time-slot-deselect-color)'}
              backgroundColor01={artworkType === 'studio' ? 'var(--toggle-bg-color)' : 'var(--time-slot-bg)'}
              backgroundColor02={artworkType === 'studio' ? 'var(--toggle-bg-color)' : 'var(--time-slot-bg)'}
              onClick={() => {
                setArtworkType('studio')
              }}
            />

            <TimeSlotButton
              label="Created"
              height={42}
              fontFamily={'Muli-Regular'}
              color={artworkType === 'created' ? '#1A1A1A' : 'var(--time-slot-deselect-color)'}
              backgroundColor01={artworkType === 'created' ? 'var(--toggle-bg-color)' : 'var(--time-slot-bg)'}
              backgroundColor02={artworkType === 'created' ? 'var(--toggle-bg-color)' : 'var(--time-slot-bg)'}
              onClick={() => {
                setArtworkType('created')
              }}
            />

            <TimeSlotButton
              label="Collected"
              height={42}
              fontFamily={'Muli-Regular'}
              color={artworkType === 'collected' ? '#1A1A1A' : 'var(--time-slot-deselect-color)'}
              backgroundColor01={artworkType === 'collected' ? 'var(--toggle-bg-color)' : 'var(--time-slot-bg)'}
              backgroundColor02={artworkType === 'collected' ? 'var(--toggle-bg-color)' : 'var(--time-slot-bg)'}
              onClick={() => {
                setArtworkType('collected')
              }}
            />
          </div>

          {artworkType === 'all' && (
            <div className="w-full">
              <NFTSwiperSection nfts={createdNfts} showHideButton={isOwn} isLoaded={isLoaded} />
              {createdNfts?.length > 0 && isLoaded && isVisibleFetchingCreated && (
                <LoadingComponent isFetching={isFetchingCreated} setIsFetching={setIsFetchingCreated} />
              )}
            </div>
          )}

          {artworkType === 'auction' && (
            <LiveAuctionSection
              category={''}
              artist={wallet}
              fromPage={'profile'}
              setLiveAuctionLoaded={setLiveAuctionLoaded}
            />
          )}

          {artworkType === 'studio' && (
            <div className="w-full">
              <NFTSwiperSection nfts={merchNfts} showHideButton={isOwn} isLoaded={isLoaded} />
              {merchNfts?.length > 0 && isLoaded && isVisibleFetchingMerch && (
                <LoadingComponent isFetching={isFetchingMerch} setIsFetching={setIsFetchingMerch} />
              )}
            </div>
          )}

          {artworkType === 'created' && (
            <div className="w-full">
              <NFTSwiperSection nfts={createdNfts} showHideButton={isOwn} isLoaded={isLoaded} />
              {createdNfts?.length > 0 && isLoaded && isVisibleFetchingCreated && (
                <LoadingComponent isFetching={isFetchingCreated} setIsFetching={setIsFetchingCreated} />
              )}
            </div>
          )}

          {artworkType === 'collected' && (
            <div className="w-full">
              <NFTSwiperSection nfts={collectedNfts} showHideButton={isOwn} isLoaded={isLoaded} />
              {collectedNfts.length > 0 && isLoaded && isVisibleFetchingCollected && (
                <LoadingComponent isFetching={isFetchingCollected} setIsFetching={setIsFetchingCollected} />
              )}
            </div>
          )}

          {artworkType === 'listed' && (
            <div className="w-full">
              <ActiveListingSection artist={wallet} fromPage={'profile'} loadCompleted={setActiveListingLoaded} />
            </div>
          )}
        </div>
      )}

      {activeTab === 1 && (
        <div className="w-full">
          <CollectionSwiperSection collections={showCollections} />
          {collections.length > 0 && isMounted && isVisibleFetching && (
            <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
          )}
        </div>
      )}

      {activeTab === 2 && (
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

      {activeTab === 3 && (
        <div className="w-full flex flex-wrap z-10">
          <AboutSection description={description} categories={categoryList} />
        </div>
      )}
    </div>
  )
}

export default TabSection

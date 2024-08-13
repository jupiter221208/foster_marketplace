import React, { useEffect, useState } from 'react'

// next components

// components
import LiveAuctionSection from 'components/pages/ArtistProfile/LiveAuctionSection'
import ActiveListingSection from 'components/pages/ArtistProfile/ActiveListingSection'
import NFTSwiperSection from 'components/pages/ArtistProfile/NFTSwiperSection'
import CollectionSwiperSection from 'components/pages/ArtistProfile/CollectionSwiperSection'
import LoadingComponent from 'pages/explore/LoadingComponent'
import TimeSlotButton from 'components/Button/TimeSlotButton'

// json
import TabList from 'assets/json/artist-profile/tab-list.json'

// resources

// styles
import styles from './index.module.scss'
import LiveEditionsSection from 'components/pages/ArtistProfile/LiveEditionsSection'
import ProfileTab from '../../../components/Tab/ProfileTab'

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, artworkType, collections])

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

  return (
    <div className={styles.container}>
      <div className="w-full flex z-0 relative overflow-hidden xs:h-[72px] sm:h-[72px] md:h-[80px] -ml-[20px]">
        <ProfileTab tabList={tabList} onChange={item => handleSelectedTab(item)} />
      </div>
      <div className={styles.divider} />

      {activeTab === 0 && (
        <div className="w-full">
          <div className="w-full flex overflow-x-scroll no-scrollbar mt-[34px] gap-2 lg:gap-4">
            <TimeSlotButton
              label="Live&nbsp;Auction"
              height={42}
              fontFamily={'Muli-Regular'}
              selected={artworkType === 'auction'}
              onClick={() => {
                setArtworkType('auction')
              }}
            />

            <TimeSlotButton
              label="Live Editions"
              height={42}
              fontFamily={'Muli-Regular'}
              selected={artworkType === 'editions'}
              onClick={() => {
                setArtworkType('editions')
              }}
              className="min-w-max"
            />

            <TimeSlotButton
              label="Quick&nbsp;Buy"
              height={42}
              fontFamily={'Muli-Regular'}
              selected={artworkType === 'listed'}
              onClick={() => {
                setArtworkType('listed')
              }}
            />

            <TimeSlotButton
              label="Created"
              height={42}
              fontFamily={'Muli-Regular'}
              selected={artworkType === 'created'}
              onClick={() => {
                setArtworkType('created')
              }}
            />

            <TimeSlotButton
              label="Collected"
              height={42}
              fontFamily={'Muli-Regular'}
              selected={artworkType === 'collected'}
              onClick={() => {
                setArtworkType('collected')
              }}
            />

            <TimeSlotButton
              label="Studio"
              height={42}
              fontFamily={'Muli-Regular'}
              selected={artworkType === 'studio'}
              onClick={() => {
                setArtworkType('studio')
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

          {artworkType === 'auction' && <LiveAuctionSection category={''} artist={wallet} fromPage={'profile'} />}

          {artworkType === 'studio' && (
            <div className="w-full">
              <NFTSwiperSection nfts={merchNfts} showHideButton={isOwn} isLoaded={isLoaded} type="studio" />
              {merchNfts?.length > 0 && isLoaded && isVisibleFetchingMerch && (
                <LoadingComponent isFetching={isFetchingMerch} setIsFetching={setIsFetchingMerch} />
              )}
            </div>
          )}

          {artworkType === 'created' && (
            <div className="w-full">
              <NFTSwiperSection nfts={createdNfts} showHideButton={isOwn} isLoaded={isLoaded} type="created" />
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
              <ActiveListingSection artist={wallet} fromPage={'profile'} />
            </div>
          )}

          {artworkType === 'editions' && <LiveEditionsSection category={''} artist={wallet} fromPage={'profile'} />}
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

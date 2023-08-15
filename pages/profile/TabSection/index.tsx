import React, { useEffect, useState } from 'react'
import Lottie from 'lottie-react'

// next components

// components
import IconTab from 'components/Tab/IconTab'
import Image from 'next/image'

// json
import TabList from 'assets/json/artist-profile/tab-list.json'

// resources
import RefreshLottery from 'assets/lottery/refresh.json'
import RefreshIcon from 'assets/icons/refresh-icon.svg'
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'

// styles
import styles from './index.module.scss'
import LiveAuctionSection from 'components/pages/Home/LiveAuctionSection'
import ActiveListingSection from 'components/pages/ArtistProfile/ActiveListingSection'
import NFTSwiperSection from 'components/pages/ArtistProfile/NFTSwiperSection'
import ArtistPagination from 'components/Button/ArtistPagination'

// apis
import nftsAPI from 'apis/nfts'
import CollectionSwiperSection from 'components/pages/ArtistProfile/CollectionSwiperSection'

const TabSection = props => {
  const {
    createdNfts,
    collectedNfts,
    collections,
    wallet,
    isOwn,
    isLoaded,
    artistCurrentPage,
    artistRowCount,
    artistTotalCount,
    collectorCurrentPage,
    collectorRowCount,
    collectorTotalCount,
    selectRowCount,
    handleNextPage,
    handlePreviousPage,
    setArtistEnable,
    reloadPage,
    artistStatsInfo,
    collectorStatsInfo,
    setActiveListingLoaded,
    setLiveAuctionLoaded,
  } = props

  const [activeTab, setActiveTab] = useState<any>(0)

  const [tabList, setTabList] = useState<any[]>(TabList)

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

    if (activeTab === 1) setArtistEnable(true)
    else if (activeTab === 2) setArtistEnable(false)
    else {
    }
  }, [activeTab])

  const handleSelectedTab = item => {
    setActiveTab(item.id)
  }

  return (
    <div className={styles.container}>
      <div className="relative w-full flex z-10 relative overflow-hidden xs:h-[72px] sm:h-[72px] md:h-[76px] -ml-[10px]">
        <IconTab tabList={tabList} onChange={item => handleSelectedTab(item)} />
      </div>
      <div className={styles.divider} />

      {activeTab === 0 && (
        <div className="w-full">
          <LiveAuctionSection
            category={''}
            artist={wallet}
            fromPage={'profile'}
            setLiveAuctionLoaded={() => setLiveAuctionLoaded(true)}
          />
          <ActiveListingSection
            artist={wallet}
            fromPage={'profile'}
            loadCompleted={() => setActiveListingLoaded(true)}
          />
        </div>
      )}

      {activeTab === 1 && (
        <div className="w-full">
          <NFTSwiperSection nfts={createdNfts} showHideButton={isOwn} isLoaded={isLoaded} />
          <div className="w-full flex justify-end">
            <ArtistPagination
              currentPage={artistCurrentPage}
              rowCount={artistRowCount}
              totalCount={artistTotalCount}
              setRowCount={count => {
                selectRowCount(count)
              }}
              handleNext={handleNextPage}
              handlePrev={handlePreviousPage}
            />
          </div>
        </div>
      )}
      {activeTab === 2 && (
        <div className="w-full">
          <NFTSwiperSection nfts={collectedNfts} showHideButton={isOwn} isLoaded={isLoaded} />
          <div className="w-full flex justify-end">
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
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="w-full">
          <CollectionSwiperSection collections={collections} />
        </div>
      )}

      {activeTab === 4 && (
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

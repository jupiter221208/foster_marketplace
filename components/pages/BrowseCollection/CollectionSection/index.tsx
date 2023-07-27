import React, { useEffect, useState } from 'react'

// components
import Tab from 'components/Tab'
import NFTSwiperSection from 'components/pages/BrowseCollection/NFTSwiperSection'
import ActivitySection from 'components/pages/BrowseCollection/ActivitySection'
import OtherCollectionSection from 'components/pages/BrowseCollection/OtherCollectionSection'

// json
import TabList from 'assets/json/browse-collection/tab-list.json'

// styles
import styles from './index.module.scss'
import LiveAuctionSection from 'components/pages/Home/LiveAuctionSection'
import ActiveListingSection from 'components/pages/ArtistProfile/ActiveListingSection'

const CollectionSection = props => {
  const { nfts, artistId, artistName = '', collectionId, collectionName } = props

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
  }, [activeTab])

  const handleSelectedTab = item => {
    setActiveTab(item.id)
  }
  return (
    <div className={styles.container}>
      <div className="w-full flex justify-center z-10">
        <Tab tabList={tabList} onChange={item => handleSelectedTab(item)} />
      </div>
      {activeTab === 0 && (
        <div className="w-full flex flex-wrap z-10">
          <NFTSwiperSection nfts={nfts} collectionName={collectionName} showHideButton={false} />
        </div>
      )}
      {activeTab === 1 && (
        <div className="w-full flex flex-wrap z-10">
          <ActivitySection collectionId={collectionId} />
        </div>
      )}
      <LiveAuctionSection category={''} artist={artistId} />
      <ActiveListingSection artist={artistId} />
      {/* <OtherCollectionSection artistId={artistId} artistName={artistName} /> */}
    </div>
  )
}

export default CollectionSection

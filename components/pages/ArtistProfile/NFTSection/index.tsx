import React, { useEffect, useState } from 'react'

// components
import Tab from 'components/Tab'
import NFTSwiperSection from 'components/pages/ArtistProfile/NFTSwiperSection'
import LiveAuctionSection from 'components/pages/Home/LiveAuctionSection'
import ExploreNFTSection from 'components/pages/ArtistProfile/ExploreNFTSection'
import CollectionSwiperSection from 'components/pages/ArtistProfile/CollectionSwiperSection'
import ExploreCollectionSection from 'components/pages/ArtistProfile/ExploreCollectionSection'

// json
import TabList from 'assets/json/artist-profile/tab-list.json'

// styles
import styles from './index.module.scss'

const NFTSection = () => {
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
      <div className="w-full flex justify-center">
        <Tab tabList={tabList} onChange={item => handleSelectedTab(item)} />
      </div>
      {activeTab === 0 && (
        <div className="w-full flex flex-wrap">
          <NFTSwiperSection />
          <LiveAuctionSection />
          <ExploreNFTSection />
        </div>
      )}
      {activeTab === 1 && (
        <div className="w-full flex flex-wrap">
          <CollectionSwiperSection />
          <ExploreCollectionSection />
        </div>
      )}
    </div>
  )
}

export default NFTSection

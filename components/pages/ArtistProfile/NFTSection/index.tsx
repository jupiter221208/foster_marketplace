import React, { useEffect, useState } from 'react'

// components
import Tab from 'components/Tab'
import NFTSwiperSection from 'components/pages/ArtistProfile/NFTSwiperSection'
import LiveAuctionSection from 'components/pages/Home/LiveAuctionSection'
import CollectionSwiperSection from 'components/pages/ArtistProfile/CollectionSwiperSection'

// json
import TabList from 'assets/json/artist-profile/tab-list.json'

// styles
import styles from './index.module.scss'
import ActiveListingSection from 'components/pages/ArtistProfile/ActiveListingSection'

const NFTSection = props => {
  const { nfts, collections, wallet, isOwn } = props
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
    <div>
      <div className={styles.tabContainer}>
        <Tab tabList={tabList} onChange={item => handleSelectedTab(item)} />
      </div>
      {activeTab === 0 && (
        <div className="w-full flex flex-wrap">
          <NFTSwiperSection nfts={nfts} showHideButton={isOwn} />
          <LiveAuctionSection category={''} artist={wallet} />
          <ActiveListingSection artist={wallet} />
        </div>
      )}
      {activeTab === 1 && (
        <div className="w-full flex flex-wrap">
          <CollectionSwiperSection collections={collections} />
        </div>
      )}
    </div>
  )
}

export default NFTSection

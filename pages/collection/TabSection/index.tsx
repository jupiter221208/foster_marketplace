import React, { useEffect, useState } from 'react'

// next components

// components
import IconTab from 'components/Tab/IconTab'

// json
import TabList from 'assets/json/browse-collection/tab-list.json'

// resources

// styles
import styles from './index.module.scss'
import LiveAuctionSection from 'components/pages/Home/LiveAuctionSection'
import ActiveListingSection from 'components/pages/ArtistProfile/ActiveListingSection'
import NFTSwiperSection from 'components/pages/BrowseCollection/NFTSwiperSection'

// apis
import ActivitySection from 'components/pages/BrowseCollection/ActivitySection'

const TabSection = props => {
  const { nfts, collectionName, collectionId } = props

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
      <div className="w-full flex z-10 relative overflow-hidden xs:h-[72px] sm:h-[72px] md:h-[76px] -ml-[10px]">
        <IconTab tabList={tabList} onChange={item => handleSelectedTab(item)} />
      </div>
      <div className={styles.divider} />

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
    </div>
  )
}

export default TabSection

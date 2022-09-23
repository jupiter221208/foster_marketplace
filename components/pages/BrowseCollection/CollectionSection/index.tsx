import React, { useEffect, useState } from 'react'

// components
import Tab from 'components/Tab'
import NFTSwiperSection from 'components/pages/BrowseCollection/NFTSwiperSection'
import ActivitySection from 'components/pages/BrowseCollection/ActivitySection'
import OtherCollectionSection from 'components/pages/BrowseCollection/OtherCollectionSection'
import ExploreCollectionSection from 'components/pages/BrowseCollection/ExploreCollectionSection'

// json
import TabList from 'assets/json/browse-collection/tab-list.json'

// styles
import styles from './index.module.scss'

const CollectionSection = () => {
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
        <div className="w-full flex flex-wrap">
          <NFTSwiperSection />
        </div>
      )}
      {activeTab === 1 && (
        <div className="w-full flex flex-wrap">
          <ActivitySection />
        </div>
      )}
      {/* <div className="w-full flex z-0"> */}
      <OtherCollectionSection />
      <ExploreCollectionSection />
      {/* </div> */}
    </div>
  )
}

export default CollectionSection

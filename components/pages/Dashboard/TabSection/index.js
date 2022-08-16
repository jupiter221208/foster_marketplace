import React, { useEffect, useState } from 'react'

// components
import IconTab from 'components/Tab/IconTab'
import MyNFTSection from 'components/pages/Dashboard/MyNFTSection'
import ListedNFTSection from 'components/pages/Dashboard/ListedNFTSection'
import ActivitySection from 'components/pages/Dashboard/ActivitySection'
import CollectedSection from 'components/pages/Dashboard/CollectedSection'
import MyCollectionSection from 'components/pages/Dashboard/MyCollectionSection'
import FavoriteSection from 'components/pages/Dashboard/FavoriteSection'
import HiddenSection from 'components/pages/Dashboard/HiddenSection'
import OfferSection from 'components/pages/Dashboard/OfferSection'

// json
import TabList from 'assets/json/dashboard/tab-list.json'

// styles
import styles from './index.module.scss'

const TabSection = props => {
  const { viewport } = props

  const [activeTab, setActiveTab] = useState(0)
  const [tabList, setTabList] = useState(TabList)
  useEffect(() => {
    let array = []
    TabList.map(item => {
      let object = item
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
        <IconTab tabList={tabList} onChange={item => handleSelectedTab(item)} />
      </div>
      {activeTab === 0 && (
        <div className="w-full flex flex-wrap">
          <MyNFTSection viewport={viewport} />
        </div>
      )}
      {activeTab === 1 && (
        <div className="w-full flex flex-wrap">
          <ListedNFTSection viewport={viewport} />
        </div>
      )}
      {activeTab === 2 && (
        <div className="w-full flex flex-wrap">
          <ActivitySection viewport={viewport} />
        </div>
      )}
      {activeTab === 3 && (
        <div className="w-full flex flex-wrap">
          <CollectedSection viewport={viewport} />
        </div>
      )}
      {activeTab === 4 && (
        <div className="w-full flex flex-wrap">
          <MyCollectionSection viewport={viewport} />
        </div>
      )}
      {activeTab === 5 && (
        <div className="w-full flex flex-wrap">
          <FavoriteSection viewport={viewport} />
        </div>
      )}
      {activeTab === 6 && (
        <div className="w-full flex flex-wrap">
          <HiddenSection viewport={viewport} />
        </div>
      )}
      {activeTab === 7 && (
        <div className="w-full flex flex-wrap">
          <OfferSection viewport={viewport} />
        </div>
      )}
    </div>
  )
}

export default TabSection

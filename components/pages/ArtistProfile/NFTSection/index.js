import React, { useEffect, useState } from 'react'

// components
import Tab from 'components/Tab'
import LiveAuctionSection from 'components/pages/Home/LiveAuctionSection'

// json
import TabList from 'assets/json/artist-profile/tab-list.json'

// styles
import styles from './index.module.scss'

const NFTSection = props => {
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
      <div className="w-full flex justify-center">
        <Tab tabList={tabList} onChange={item => handleSelectedTab(item)} />
      </div>
      {activeTab === 0 && (
        <div className="w-full flex flex-wrap">
          <div className="w-full flex justify-between">aaa</div>
          <div className="w-full">
            <LiveAuctionSection viewport={viewport} />
          </div>
        </div>
      )}
    </div>
  )
}

export default NFTSection

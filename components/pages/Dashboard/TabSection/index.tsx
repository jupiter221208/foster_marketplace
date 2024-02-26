import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// components
import IconTab from 'components/Tab/IconTab'
import MyNFTSection from 'components/pages/Dashboard/MyNFTSection'
import ListedNFTSection from 'components/pages/Dashboard/ListedNFTSection'
import ActivitySection from 'components/pages/Dashboard/ActivitySection'
import MyCollectionSection from 'components/pages/Dashboard/MyCollectionSection'
import FavoriteSection from 'components/pages/Dashboard/FavoriteSection'
import HiddenSection from 'components/pages/Dashboard/HiddenSection'
import OfferSection from 'components/pages/Dashboard/OfferSection'

// json
import TabList from 'assets/json/dashboard/tab-list.json'

// styles
import styles from './index.module.scss'
import CollectedSection from '../CollectedSection'
import DashboardTab from '../../../Tab/DashboardTab'

const TabSection = () => {
  const router = useRouter()
  const { tab, filter } = router.query

  const [activeTab, setActiveTab] = useState<any>(0)

  useEffect(() => {
    if (tab !== undefined) {
      setActiveTab(Number(tab))
    } else {
      setActiveTab(0)
    }
  }, [tab])

  const [tabList, setTabList] = useState<any[]>(TabList)
  const [detailCollection, setDetailCollection] = useState<boolean>(false)
  const [collectionId, setCollectionId] = useState(null)

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
    setDetailCollection(false)
  }, [activeTab])

  const handleSelectedTab = item => {
    setActiveTab(item.id)
  }

  return (
    <div className={styles.container}>
      <div className={styles.selectedTab}>
        <DashboardTab tabList={tabList} onChange={item => handleSelectedTab(item)} />
        <div className={styles.selectedTabBorder} />
      </div>

      {activeTab === 0 && (
        <div className="w-full flex flex-wrap">
          <MyNFTSection changeActiveTab={(selectedTab: number) => setActiveTab(selectedTab)} />
        </div>
      )}
      {activeTab === 1 && (
        <div className="w-full flex flex-wrap">
          <ListedNFTSection filter={filter} />
        </div>
      )}
      {activeTab === 2 && (
        <div className="w-full flex flex-wrap">
          <ActivitySection />
        </div>
      )}
      {activeTab === 3 && (
        <div className="w-full flex flex-wrap">
          <CollectedSection changeActiveTab={(selectedTab: number) => setActiveTab(selectedTab)} />
        </div>
      )}
      {activeTab === 4 && (
        <div className="w-full flex flex-wrap">
          <MyCollectionSection />
        </div>
      )}
      {activeTab === 5 && (
        <div className="w-full flex flex-wrap">
          <FavoriteSection />
        </div>
      )}
      {activeTab === 6 && (
        <div className="w-full flex flex-wrap">
          <OfferSection />
        </div>
      )}
      {activeTab === 7 && (
        <div className="w-full flex flex-wrap">
          <HiddenSection />
        </div>
      )}
    </div>
  )
}

export default TabSection

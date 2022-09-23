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
import DetailCollectedSection from '../DetailCollectedSection'

const TabSection = () => {
  const [activeTab, setActiveTab] = useState<any>(0)
  const [tabList, setTabList] = useState<any[]>(TabList)
  const [detailCollection, setDetailCollection] = useState<boolean>(false)

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
      <div className="w-full flex justify-center z-10 relative overflow-hidden xs:h-[72px] sm:h-[72px] md:h-auto">
        <IconTab tabList={tabList} onChange={item => handleSelectedTab(item)} />
      </div>
      {activeTab === 0 && (
        <div className="w-full flex flex-wrap">
          <MyNFTSection />
        </div>
      )}
      {activeTab === 1 && (
        <div className="w-full flex flex-wrap">
          <ListedNFTSection />
        </div>
      )}
      {activeTab === 2 && (
        <div className="w-full flex flex-wrap">
          <ActivitySection />
        </div>
      )}
      {activeTab === 3 && (
        <div className="w-full flex flex-wrap">
          {detailCollection ? (
            <div className="w-full z-10">
              <div className="w-full flex justify-end">
                <div
                  className={styles.return}
                  onClick={() => {
                    setDetailCollection(false)
                  }}
                >
                  Return
                </div>
              </div>
              <DetailCollectedSection></DetailCollectedSection>
            </div>
          ) : (
            <CollectedSection onClickItem={() => setDetailCollection(true)} />
          )}
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
          <HiddenSection />
        </div>
      )}
      {activeTab === 7 && (
        <div className="w-full flex flex-wrap">
          <OfferSection />
        </div>
      )}
    </div>
  )
}

export default TabSection

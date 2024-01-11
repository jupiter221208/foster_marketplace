import React, { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

// next components

// components
import IconTab from 'components/Tab/IconTab'
import ActivitySection from 'components/pages/BrowseCollection/ActivitySection'
import AddSection from 'components/pages/BrowseCollection/AddSection'
// json
import TabList from 'assets/json/browse-collection/tab-list.json'
import TabNoAddList from 'assets/json/browse-collection/tab-list-no-add.json'

// resources

// styles
import styles from './index.module.scss'
import NFTSwiperSection from 'components/pages/BrowseCollection/NFTSwiperSection'
import AboutSection from 'components/pages/BrowseCollection/AboutSection'

// apis

const TabSection = props => {
  const { nfts, collectionName, coverUrl, minter, description, categories, collectionId, hasloading } = props
  const { publicKey } = useWallet()

  const [activeTab, setActiveTab] = useState<any>(0)

  const [tabList, setTabList] = useState<any[]>(TabList)
  const [tabNoAdd, setTabNoAdd] = useState<any[]>(TabNoAddList)

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

    let array1: any[] = []
    TabNoAddList.map(item => {
      let object: any = item
      if (item.id === activeTab) {
        object.selected = true
      } else {
        object.selected = false
      }
      array1.push(object)
    })
    setTabNoAdd(array1)
  }, [activeTab])

  const handleSelectedTab = item => {
    setActiveTab(item.id)
  }

  return (
    <div className={styles.container}>
      <div className="w-full flex z-10 relative overflow-hidden xs:h-[72px] sm:h-[72px] md:h-[76px] -ml-[10px]">
        <IconTab
          tabList={minter === publicKey?.toString() ? tabList : tabNoAdd}
          onChange={item => handleSelectedTab(item)}
        />
      </div>
      <div className={styles.divider} />

      {activeTab === 0 && (
        <div className="w-full flex flex-wrap z-10">
          <NFTSwiperSection nfts={nfts} collectionName={collectionName} showHideButton={false} />
        </div>
      )}

      {activeTab === 1 && (
        <div className="w-full flex flex-wrap z-10">
          <ActivitySection collectionId={collectionId} hasloading={hasloading} />
        </div>
      )}

      {activeTab === 2 && (
        <div className="w-full flex flex-wrap z-10">
          <AboutSection description={description} categories={categories} />
        </div>
      )}

      {activeTab === 3 && (
        <div className="w-full flex flex-wrap z-10">
          <AddSection collectionId={collectionId} coverUrl={coverUrl} />
        </div>
      )}
    </div>
  )
}

export default TabSection

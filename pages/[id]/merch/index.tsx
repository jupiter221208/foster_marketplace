import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ArtistLayout from 'components/Layout/ArtistLayout'

import ShopBanner from 'assets/images/merch-shop-banner.png'

// json
import TabList from 'assets/json/creator-merch/tab-list.json'

import styles from './index.module.scss'
import Image from 'next/image'
import CreatorMerchTab from 'components/Tab/CreatorMerchTab'
import CreatorMerchShop from './shop'

const CreatorMerch = () => {
  const [tabList, setTabList] = useState<any[]>(TabList)
  const [activeTab, setActiveTab] = useState<any>(0)

  const handleSelectedTab = item => {
    setActiveTab(item.id)
  }

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

  return (
    <div className="w-full">
      <div className="w-full h-[350px] relative">
        <Image src={ShopBanner} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0">
          <div className="w-full h-full flex items-center justify-center">
            <div>
              <div className={styles.userName}>Circusdragon</div>
              <div className={styles.merchStore}>Official Merch Store</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0">
          <div className={styles.tabBorder} />
        </div>
      </div>
      <div className="g-container mt-[-42px]">
        <div className="w-full flex z-10 relative overflow-hidden h-[46px]">
          <CreatorMerchTab tabList={tabList} onChange={item => handleSelectedTab(item)} />
        </div>
        <div className="w-full mt-[35px]">{activeTab === 0 && <CreatorMerchShop />}</div>
      </div>
    </div>
  )
}

export default CreatorMerch

CreatorMerch.getLayout = function getLayout(page) {
  return <ArtistLayout>{page}</ArtistLayout>
}

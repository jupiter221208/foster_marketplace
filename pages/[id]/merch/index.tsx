import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// next component
import Image from 'next/image'

//components
import CreatorMerchTab from 'components/Tab/CreatorMerchTab'
import CreatorMerchShop from './shop'
import ArtistLayout from 'components/Layout/ArtistLayout'
// images
import ShopBanner from 'assets/images/merch-shop-banner.png'
import LeftArrow from 'assets/icons/arrow-left-white-big.svg?component'
import PlusIcon from 'assets/icons/cross-plus-icon.svg?component'
import ShareSocialIcon from 'assets/icons/share-social-icon.svg?component'

// json
import TabList from 'assets/json/creator-merch/tab-list.json'

// styles
import styles from './index.module.scss'

const CreatorMerch = props => {
  const { userName } = props
  const router = useRouter()
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
    <div className="w-full pb-[60px]">
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
        <div className="w-full mt-[30px] flex justify-between">
          <div
            className={styles.profile}
            onClick={() => {
              let path = window.location.href
              router.push(path.substring(0, path.lastIndexOf('/')))
            }}
          >
            <div>
              <LeftArrow />
            </div>
            <div className="mt-[-2px]">Profile</div>
          </div>
          <div className="flex gap-[15px]">
            <div
              className={styles.plus}
              onClick={() => {
                let path = window.location.href
                router.push(`${path}/new`)
              }}
            >
              <div className={styles.plusBG}>
                <PlusIcon />
              </div>
            </div>
            <div className={styles.share}>
              <ShareSocialIcon />
            </div>
          </div>
        </div>
        <div className="w-full mt-[52px]">{activeTab === 0 && <CreatorMerchShop />}</div>
      </div>
    </div>
  )
}

export default CreatorMerch

CreatorMerch.getLayout = function getLayout(page) {
  return <ArtistLayout>{page}</ArtistLayout>
}

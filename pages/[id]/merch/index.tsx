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
import MenuSocialShare from 'components/Menu/MenuSocialShare'
import CreatorMerchBadges from './badges'

interface CreatorMerchProps {
  artistPublicKey?: string
  publicArtistData?: any
  error?: string
}

const CreatorMerch = ({ publicArtistData }: CreatorMerchProps) => {
  const [artistInfo, setArtistInfo] = useState<any>(publicArtistData?.artist)
  const router = useRouter()
  // const [tabList, setTabList] = useState<any[]>(TabList)
  const [activeTab, setActiveTab] = useState<any>(0)

  const handleSelectedTab = tabIndex => {
    setActiveTab(tabIndex)
  }

  // useEffect(() => {
  //   let array: any[] = []
  //   TabList.map(item => {
  //     let object: any = item
  //     if (item.id === activeTab) {
  //       object.selected = true
  //     } else {
  //       object.selected = false
  //     }
  //     array.push(object)
  //   })
  //   setTabList(array)
  // }, [activeTab])

  return (
    <div className="w-full pb-[60px]">
      <div className="w-full h-[350px] relative">
        <img src={artistInfo.banner_picture} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0">
          <div className={styles.overlayBG}>
            <div className={styles.titleBG}>
              <div>
                <div className={styles.userName}>{artistInfo.username}</div>
                <div className={styles.merchStore}>Official Merch Store</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0">
          <div className={styles.tabBorder} />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="g-container">
          {/* <div className="w-full flex z-10 relative overflow-hidden h-[46px]">
            <CreatorMerchTab tabList={tabList} onChange={item => handleSelectedTab(item)} />
          </div> */}
          <div className="w-full mt-[30px] flex justify-between">
            <div className="flex gap-[15px]">
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
              <div className={activeTab === 0 ? styles.selected : styles.unselected} onClick={() => setActiveTab(0)}>
                <div className="mt-[-2px]">Shop</div>
              </div>
              <div className={activeTab === 1 ? styles.selected : styles.unselected} onClick={() => setActiveTab(1)}>
                <div className="mt-[-2px]">Reviews</div>
              </div>
              <div className={activeTab === 2 ? styles.selected : styles.unselected} onClick={() => setActiveTab(2)}>
                <div className="mt-[-2px]">Badges</div>
              </div>
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
              <div className={`${styles.iconContainer} w-[87px]`}>
                <MenuSocialShare
                  type="nft"
                  vote={true}
                  message={'Check out this artist on Foster Marketplace @foster_protocol #fostermarketplace'}
                  url={`/${artistInfo?.username}`}
                />
              </div>
            </div>
          </div>
          <div className="w-full mt-[30px]">
            {activeTab === 0 && <CreatorMerchShop username={artistInfo.username} />}
            {activeTab === 2 && <CreatorMerchBadges />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatorMerch

CreatorMerch.getLayout = function getLayout(page) {
  return <ArtistLayout>{page}</ArtistLayout>
}

CreatorMerch.getInitialProps = async function ({ res, query }): Promise<CreatorMerchProps> {
  let artistUsername = encodeURIComponent(query.id)

  try {
    let publicArtistData = await fetch(`${process.env.BACKEND_URL}v1/artists/${artistUsername}/username`).then(r =>
      r.json()
    )
    let artistPublicKey = publicArtistData.artist.wallet_id
    return {
      artistPublicKey,
      publicArtistData,
    }
  } catch (e: any) {
    console.error(e)
    return {
      error: `could not load artist details: ${artistUsername}: ${e.message}`,
    }
  }
}

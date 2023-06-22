import React, { useEffect, useState } from 'react'
import Lottie from 'lottie-react'

// components
import Tab from 'components/Tab'
import NFTSwiperSection from 'components/pages/ArtistProfile/NFTSwiperSection'
import LiveAuctionSection from 'components/pages/Home/LiveAuctionSection'
import CollectionSwiperSection from 'components/pages/ArtistProfile/CollectionSwiperSection'
import Image from 'next/image'

// json
import TabList from 'assets/json/artist-profile/tab-list.json'
import RefreshIcon from 'assets/icons/refresh-icon.svg'
import RefreshMobileIcon from 'assets/icons/refresh-icon-mobile.svg'
import RefreshLottery from 'assets/lottery/refresh.json'
import RefreshMobileLottery from 'assets/lottery/refresh-mobile.json'

// styles
import styles from './index.module.scss'
import ActiveListingSection from 'components/pages/ArtistProfile/ActiveListingSection'

// call apis
import nftsAPI from 'apis/nfts'
import ArtistPagination from 'components/Button/ArtistPagination'

const NFTSection = props => {
  const {
    nfts,
    collections,
    wallet,
    isOwn,
    currentPage,
    rowCount,
    selectRowCount,
    handleNextPage,
    handlePreviousPage,
    reloadPage,
  } = props
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

  const [refreshing, setRefreshing] = useState(false)
  const refreshNFT = () => {
    setRefreshing(true)
    nftsAPI.burntNft({ user: wallet, nfts: [] }).then(
      response => {
        setTimeout(() => {
          setRefreshing(false)
          reloadPage()
        }, 3000)
      },
      error => {
        console.log(error)
        setTimeout(() => {
          setRefreshing(false)
        }, 3000)
      }
    )
  }

  return (
    <div>
      <div className={styles.tabContainer}>
        <Tab tabList={tabList} onChange={item => handleSelectedTab(item)} />
        <div className="absolute right-0 w-[140px] h-[46px] lg:flex hidden">
          {refreshing ? (
            <Lottie animationData={RefreshLottery} loop={true} />
          ) : (
            <div className={styles.refreshButton} onClick={() => refreshNFT()}>
              <Image src={RefreshIcon} width={28} height={28} alt="" />
              <div className="mb-[4px]">Refresh</div>
            </div>
          )}
        </div>
        <div className="w-[26px] h-[26px] flex lg:hidden">
          {refreshing ? (
            <Lottie width={26} height={26} animationData={RefreshMobileLottery} loop={true} />
          ) : (
            <div onClick={() => refreshNFT()}>
              <Image src={RefreshMobileIcon} width={26} height={26} alt="" />
            </div>
          )}
        </div>
      </div>
      {activeTab === 0 && (
        <div className="w-full flex flex-wrap">
          <NFTSwiperSection nfts={nfts} showHideButton={isOwn} />
          <div className="w-full flex justify-end">
            <ArtistPagination
              currentPage={currentPage}
              totalCount={rowCount * (currentPage + 1)}
              rowCount={rowCount}
              setRowCount={count => {
                selectRowCount(count)
              }}
              handleNext={handleNextPage}
              handlePrev={handlePreviousPage}
            />
          </div>
          <LiveAuctionSection category={''} artist={wallet} />
          <ActiveListingSection artist={wallet} />
        </div>
      )}
      {activeTab === 1 && (
        <div className="w-full flex flex-wrap">
          <CollectionSwiperSection collections={collections} />
        </div>
      )}
    </div>
  )
}

export default NFTSection

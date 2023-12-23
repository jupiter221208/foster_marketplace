import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// next components
import Head from 'next/head'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'

import ArtworksSection from 'components/pages/Stats/ArtworksSection'

// custom functions
import { useViewport } from 'utils'

// json
import TabList from 'assets/json/stats/tab-list.json'
import PreviewImage from 'assets/images/preview-image.png'

// styles
import styles from './index.module.scss'
import StatsPreviewModal from 'components/Modal/StatsPreviewModal'
import HouseStatsTab from 'components/Tab/HouseStatsTab'
import CreatorsSection from 'components/pages/Stats/CreatorsSection'
import CollectorsSection from 'components/pages/Stats/CollectorsSection'
import CollectionsSection from 'components/pages/Stats/CollectionsSection'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'

// api
import StatsAPI from 'apis/stats'

const Stats = () => {
  const viewport = useViewport()
  const dispatch = useDispatch()
  const isLoading = useSelector<any>(state => state.isLoading)
  const status = useSelector<any>(state => state.activeTab)

  const [activeTab, setActiveTab] = useState<any>(0)
  const [tabList, setTabList] = useState<any[]>(TabList)
  const [previewMode, setPreviewMode] = useState(false)
  const [comingSoon, setComingSoon] = useState(false)
  const [artworks, setArtworks] = useState([])
  const [collections, setCollections] = useState([])
  const [creators, setCreators] = useState([])
  const [collectors, setCollectors] = useState([])

  useEffect(() => {
    dispatch({ type: 'set', isLoading: false })
    getArtworkData()
    getCollectionData()
    getCreatorData()
    getCollectorData()
  }, [])

  useEffect(() => {
    switch (status) {
      case 0:
        setActiveTab(0)
        break
      case 1:
        setActiveTab(1)
        break
      case 2:
        setActiveTab(2)
        break
      case 3:
        setActiveTab(3)
        break
    }
  }, [status])

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
    if (item.id != 4) setActiveTab(item.id)
  }

  const getArtworkData = () => {
    StatsAPI.getStatsArtwork({
      period: 'all',
      search: null,
      page: 1,
      per_page: 12,
    }).then(
      respone => {
        const nfts = respone.filter(item => item.asset_url !== '')
        setArtworks(nfts)
      },
      error => {}
    )
  }

  const getCollectionData = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    StatsAPI.getStatsCollection({
      period: 'all',
      search: null,
      page: 1,
      per_page: 12,
    }).then(
      respone => {
        const nfts = respone.filter(item => item.cover_image !== '')
        setCollections(nfts)
      },
      error => {}
    )
  }

  const getCreatorData = () => {
    StatsAPI.getStatsCreator({
      period: 'all',
      search: null,
      page: 1,
      per_page: 12,
    }).then(
      respone => {
        const nfts = respone.filter(item => item.pfp_url !== '')
        setCreators(nfts)
      },
      error => {}
    )
  }

  const getCollectorData = () => {
    StatsAPI.getStatsCollector({
      period: 'all',
      search: null,
      page: 1,
      per_page: 12,
    }).then(
      respone => {
        const nfts = respone.filter(item => item.pfp_url !== '')
        setCollectors(nfts)
      },
      error => {}
    )
  }

  let pageTitle = `House Stats | Foster Marketplace`
  let pageImageUrl = PreviewImage.src
  let pageDescription = 'An all-in-one hub that provides insights into marketplace trends for artists and collectors.'

  return (
    <div className="g-container">
      <Head>
        <title>{pageTitle}</title>

        <meta name="description" content={pageDescription} />

        <meta name="og:title" content={pageTitle} />
        <meta name="og:description" content={pageDescription} />
        <meta name="og:image" content={pageImageUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImageUrl} />

        <link rel="icon" href="/logo.png" />
      </Head>
      <div className={styles.container}>
        <div className="w-full flex flex-wrap">
          <div className="relative mt-[10px] lg:mt-[24px] w-full h-auto flex relative overflow-hidden  justify-between z-10 h-[56px] lg:h-[76px] ">
            <HouseStatsTab
              tabList={tabList}
              onChange={item => {
                if (item.coming_soon === true) {
                  setComingSoon(true)
                  setTimeout(() => {
                    setComingSoon(false)
                  }, 3000)
                } else handleSelectedTab(item)
              }}
            />
            {(viewport === 'xs' || viewport === 'sm' || viewport === 'md') && comingSoon && (
              <div className={styles.tooltip}>This feature is not available but is coming soon.</div>
            )}
          </div>
          {activeTab === 0 && (
            <div className="w-full z-10">
              <ArtworksSection artworks={artworks} />
            </div>
          )}
          {activeTab === 1 && (
            <div className="w-full z-10">
              <CollectionsSection collections={collections} />
            </div>
          )}
          {activeTab === 2 && (
            <div className="w-full z-10">
              <CreatorsSection creators={creators} />
            </div>
          )}
          {activeTab === 3 && (
            <div className="w-full z-10">
              <CollectorsSection collectors={collectors} />
            </div>
          )}
          {/* {activeTab === 4 && <MarketplaceSection />} */}
        </div>
      </div>
      <StatsPreviewModal
        open={previewMode}
        close={() => {
          window.history.go(-1)
          setPreviewMode(false)
        }}
      />
      <FullScreenLoadingModal open={isLoading} />
    </div>
  )
}

export default Stats

Stats.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// next components
import Head from 'next/head'

// components

import SecondaryLayout from 'components/Layout/SecondaryLayout'

import ApparelActivity from 'components/pages/MerchLogs/ApparelActivity'

// custom functions
import { useViewport } from 'utils'

// json
import TabList from 'assets/json/merch-logs/tab-list.json'
import EllipseGreen from 'assets/icons/ellipse-green.svg?component'
import StatsPreviewImage from 'assets/images/stats-preview-image.png'

// styles
import styles from './index.module.scss'
import StatsPreviewModal from 'components/Modal/StatsPreviewModal'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'

// api
import MerchAPI from 'apis/merch'
import HouseStatsTab from 'components/Tab/HouseStatsTab'

const MerchActivity = () => {
  const viewport = useViewport()
  const isLoading = useSelector<any>(state => state.isLoading)
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState<any>(0)
  const [tabList, setTabList] = useState<any[]>(TabList)
  const [previewMode, setPreviewMode] = useState(false)
  const [purchases, setPurchases] = useState([])
  const [sales, setSales] = useState([])

  useEffect(() => {
    dispatch({ type: 'set', isLoading: true })
    getAllOrder()
  }, [])

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

  const getAllOrder = () => {
    MerchAPI.getAllOrder().then(
      response => {
        setPurchases(response)
        setSales(response)
        dispatch({ type: 'set', isLoading: false })
      },
      error => {}
    )
  }

  let pageTitle = `Merch Hub Activity | Foster Marketplace`
  let pageImageUrl = StatsPreviewImage.src
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
        <div className={styles.topLeftEllipse}>
          {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
        </div>

        <div className="w-full flex flex-wrap">
          {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
            <div className="w-full flex justify-between">
              <div className={`${styles.title} z-10`}>Merch Hub Dashboard</div>
              <div className="flex gap-[15px]">
                <div className="flex gap-[6px]">
                  <div className={styles.countLabel}>$300.50</div>
                  <div className={styles.countValue}>Artist&nbsp;Commissions</div>
                </div>
                <div className="flex gap-[6px]">
                  <div className={styles.countLabel}>$300.50</div>
                  <div className={styles.countValue}>Total&nbsp;Purchases</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full mb-[30px] mt-[15px]">
              <div className={`${styles.title} z-10`}>Merch Hub Dashboard</div>
              <div className="flex gap-[5px] mt-[15px] lg:mt-[56px]">
                <div className={styles.countBG}>
                  <div className="w-full">
                    <div className={styles.countLabel}>$800.32</div>
                    <div className={styles.countValue}>ARTIST&nbsp;COMISSIONS</div>
                  </div>
                </div>
                <div className={styles.countBG}>
                  <div className="w-full">
                    <div className={styles.countLabel}>$800.32</div>
                    <div className={styles.countValue}>TOTAL&nbsp;PURCHASES</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="relative mt-[0px] lg:mt-[90px] mb-[10px] lg:mb-[90px] w-full h-auto flex overflow-hidden lg:justify-start justify-center z-10 h-[28px] lg:h-[76px] ">
            <HouseStatsTab
              tabList={tabList}
              onChange={item => {
                handleSelectedTab(item)
              }}
            />
          </div>
          {activeTab === 0 && (
            <div className="w-full z-10">
              <ApparelActivity avtivities={purchases} />
            </div>
          )}
          {activeTab === 1 && (
            <div className="w-full z-10">
              <ApparelActivity avtivities={sales} />
            </div>
          )}
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

export default MerchActivity

MerchActivity.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}

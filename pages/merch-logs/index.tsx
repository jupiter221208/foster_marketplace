import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// next components
import Head from 'next/head'

// components

import SecondaryLayout from 'components/Layout/SecondaryLayout'

import ApparelActivity from 'components/pages/MerchLogs/ApparelActivity'

// custom functions
import { useViewport } from 'utils'
import { useWallet } from '@solana/wallet-adapter-react'

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
import LoadingComponent from 'pages/explore/LoadingComponent'

const MerchActivity = () => {
  const viewport = useViewport()
  const { connected, publicKey } = useWallet()
  const isLoading = useSelector<any>(state => state.isLoading)
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState<any>(0)
  const [tabList, setTabList] = useState<any[]>(TabList)
  const [previewMode, setPreviewMode] = useState(false)
  const [purchases, setPurchases] = useState([])
  const [sales, setSales] = useState([])
  const [artistCommission, setArtistCommission] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [rowCount, setRowCount] = useState(10)
  const [buyerPages, setBuyerPages] = useState(1)
  const [sellerPages, setSellerPages] = useState(1)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleBuyerFetching, setIsVisibleBuyerFetching] = useState(true)
  const [isVisibleSellerFetching, setIsVisibleSellerFetching] = useState(true)

  useEffect(() => {
    dispatch({ type: 'set', isLoading: true })
    if (!connected) {
      setTimeout(() => {
        dispatch({ type: 'set', isLoading: false })
      }, 1000)
    }
  }, [])

  useEffect(() => {
    if (publicKey) {
      getOrderStats()
    }
  }, [publicKey])

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

  useEffect(() => {
    if (isFetching) {
      if (activeTab === 0) getBuyerOrder(buyerPages, rowCount)
      else getSellerOrder(sellerPages, rowCount)
    }
  }, [isFetching])

  const handleSelectedTab = item => {
    setActiveTab(item.id)
  }

  const getBuyerOrder = (page, rowCount, reset = false) => {
    MerchAPI.getBuyerOrder(page, rowCount).then(
      response => {
        setIsFetching(false)

        let purchaseOrders = []
        response.forEach(order => {
          if (order.transaction_id != null) {
            let keys = Object.keys(order.seller_shares)
            let creator = ''
            if (keys.length > 0) creator = keys[0]
            let new_order = { ...order, creator }
            purchaseOrders.push(new_order)
          }
        })

        if (reset) setPurchases([...purchaseOrders])
        else setPurchases([...purchases, ...purchaseOrders])
        if (response.length < rowCount) {
          setIsVisibleBuyerFetching(false)
        } else {
          setTimeout(() => {
            if (purchaseOrders != response.length) {
              setIsFetching(true)
            }
          }, 2000)
          setIsVisibleBuyerFetching(true)
          setBuyerPages(page + 1)
        }
      },
      error => {}
    )
  }

  const getSellerOrder = (page, rowCount, reset = false) => {
    MerchAPI.getSellerOrder(page, rowCount).then(
      response => {
        setIsFetching(false)

        let salesOrders = []
        response.forEach(order => {
          if (order.transaction_id != null) {
            let keys = Object.keys(order.seller_shares)
            let creator = order.buyer_address
            let new_order = { ...order, creator }
            salesOrders.push(new_order)
          }
        })

        if (reset === true) setSales([...salesOrders])
        else setSales([...sales, ...salesOrders])

        if (response.length < rowCount) {
          setIsVisibleSellerFetching(false)
        } else {
          setTimeout(() => {
            if (salesOrders != response.length) {
              setIsFetching(true)
            }
          }, 2000)
          setIsVisibleSellerFetching(true)
          setSellerPages(page + 1)
        }
      },
      error => {}
    )
  }

  const getOrderStats = () => {
    MerchAPI.getOrderStats().then(
      response => {
        setArtistCommission(response.sold?.totalArtistCommission)
        setTotalAmount(response.bought?.amount)
        dispatch({ type: 'set', isLoading: false })
      },
      error => {
        dispatch({ type: 'set', isLoading: false })
      }
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
                  <div className={styles.countLabel}>${artistCommission.toFixed(2)}</div>
                  <div className={styles.countValue}>Total&nbsp;Commissions</div>
                </div>
                <div className="flex gap-[6px]">
                  <div className={styles.countLabel}>${totalAmount.toFixed(2)}</div>
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
                    <div className={styles.countLabel}>${artistCommission.toFixed(2)}</div>
                    <div className={styles.countValue}>ARTIST&nbsp;COMISSIONS</div>
                  </div>
                </div>
                <div className={styles.countBG}>
                  <div className="w-full">
                    <div className={styles.countLabel}>${totalAmount.toFixed(2)}</div>
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
              <ApparelActivity avtivities={purchases} type="purchases" isLoading={isLoadingData} />
            </div>
          )}
          {activeTab === 1 && (
            <div className="w-full z-10">
              <ApparelActivity avtivities={sales} type="sales" isLoading={isLoadingData} />
            </div>
          )}
          {((activeTab === 0 && isVisibleBuyerFetching) || (activeTab === 1 && isVisibleSellerFetching)) && (
            <div className="w-full mt-[-100px] mb-[40px]">
              <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
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

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
import ArtistAPI from 'apis/artists'
import NftAPI from 'apis/nfts'
import HouseStatsTab from 'components/Tab/HouseStatsTab'
import LoadingComponent from 'pages/explore/LoadingComponent'
import NftItemActivity from 'components/pages/MerchLogs/NftItemActivity'

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
  const [enabledItems, setEnabledItems] = useState([])
  const [disabledItems, setDisabledItems] = useState([])
  const [artistCommission, setArtistCommission] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [rowCount, setRowCount] = useState(10)
  const [buyerPages, setBuyerPages] = useState(1)
  const [sellerPages, setSellerPages] = useState(1)
  const [enabledPages, setEnabledPages] = useState(1)
  const [disabledPages, setDisabledPages] = useState(1)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleBuyerFetching, setIsVisibleBuyerFetching] = useState(true)
  const [isVisibleSellerFetching, setIsVisibleSellerFetching] = useState(true)
  const [isVisibleEnabledFetching, setIsVisibleEnabledFetching] = useState(true)
  const [isVisibleDisabledFetching, setIsVisibleDisabledFetching] = useState(true)

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
      else if (activeTab === 1) getSellerOrder(sellerPages, rowCount)
      else if (activeTab === 2) getEnabledItem(enabledPages, rowCount)
      else if (activeTab === 3) getDisabledItem(disabledPages, rowCount)
    }
  }, [isFetching])

  const handleSelectedTab = item => {
    setActiveTab(item.id)
  }

  const getBuyerOrder = (page, rowCount, reset = false) => {
    MerchAPI.getBuyerOrder(page, rowCount).then(
      response => {
        setIsFetching(false)
        if (isLoadingData) setIsLoadingData(false)

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
            if (purchaseOrders.length != response.length) {
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

  const getSellerOrder = (page, rowCount) => {
    MerchAPI.getSellerOrder(page, rowCount).then(
      response => {
        setIsFetching(false)
        if (isLoadingData) setIsLoadingData(false)

        let salesOrders = []
        response.forEach(order => {
          if (order.transaction_id != null) {
            let keys = Object.keys(order.seller_shares)
            let creator = order.buyer_address
            let new_order = { ...order, creator }
            salesOrders.push(new_order)
          }
        })

        setSales([...sales, ...salesOrders])

        if (response.length < rowCount) {
          setIsVisibleSellerFetching(false)
        } else {
          setTimeout(() => {
            if (salesOrders.length != response.length) {
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

  const getEnabledItem = (page, rowCount) => {
    if (!publicKey) {
      setIsVisibleEnabledFetching(false)
      return
    }
    ArtistAPI.getMerchNfts(publicKey.toBase58(), rowCount, page, true).then(
      response => {
        setIsFetching(false)
        if (isLoadingData) setIsLoadingData(false)

        setEnabledItems([...enabledItems, ...response])
        if (response.length < rowCount) {
          setIsVisibleEnabledFetching(false)
        } else {
          setIsVisibleEnabledFetching(true)
          setEnabledPages(page + 1)
        }
      },
      error => {}
    )
  }

  const getDisabledItem = (page, rowCount) => {
    if (!publicKey) {
      setIsVisibleDisabledFetching(false)
      return
    }
    ArtistAPI.getMerchNfts(publicKey.toBase58(), rowCount, page, false).then(
      response => {
        setIsFetching(false)
        if (isLoadingData) setIsLoadingData(false)

        setDisabledItems([...disabledItems, ...response])
        if (response.length < rowCount) {
          setIsVisibleDisabledFetching(false)
        } else {
          setIsVisibleDisabledFetching(true)
          setDisabledPages(page + 1)
        }
      },
      error => {}
    )
  }

  const enableMerchNft = (id, toggle) => {
    if (toggle === true) {
      NftAPI.enableMerchHub(id, { value: true }).then(
        response => {
          if (response !== null) {
            let nft = disabledItems.filter(({ token_id }) => token_id === id)[0]
            setEnabledItems([nft, ...enabledItems])
            setDisabledItems(disabledItems.filter(({ token_id }) => token_id !== id))
          }
        },
        err => {}
      )
    } else {
      NftAPI.enableMerchHub(id, { value: false }).then(
        response => {
          if (response !== null) {
            let nft = enabledItems.filter(({ token_id }) => token_id === id)[0]
            setDisabledItems([nft, ...disabledItems])
            setEnabledItems(enabledItems.filter(({ token_id }) => token_id !== id))
          }
        },
        err => {}
      )
    }
  }

  const enableAllMerch = toggle => {
    if (toggle === true) {
      let tokenIds = []
      disabledItems.forEach(({ token_id }) => tokenIds.push(token_id))
      NftAPI.enableAllMerchHub({ tokenIds, value: true }).then(
        response => {
          if (response !== null) {
            setEnabledItems([...disabledItems])
            setDisabledItems([])
          }
        },
        err => {}
      )
    } else {
      let tokenIds = []
      enabledItems.forEach(({ token_id }) => tokenIds.push(token_id))
      NftAPI.enableAllMerchHub({ tokenIds, value: false }).then(
        response => {
          if (response !== null) {
            setDisabledItems([...enabledItems])
            setEnabledItems([])
          }
        },
        err => {}
      )
    }
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

  let pageTitle = `Creator Studio Activity | Foster Marketplace`
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
              <div className={`${styles.title} z-10`}>Creator Studio Dashboard</div>
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
              <div className={`${styles.title} z-10`}>Creator Studio Dashboard</div>
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
              <ApparelActivity activities={purchases} type="purchases" isLoading={isLoadingData} />
            </div>
          )}
          {activeTab === 1 && (
            <div className="w-full z-10">
              <ApparelActivity activities={sales} type="sales" isLoading={isLoadingData} />
            </div>
          )}
          {activeTab === 2 && (
            <div className="w-full z-10">
              <NftItemActivity
                activities={enabledItems}
                type="enabled"
                isLoading={isVisibleEnabledFetching}
                action={token_id => {
                  enableMerchNft(token_id, false)
                }}
                actionAll={() => {
                  enableAllMerch(false)
                }}
              />
            </div>
          )}
          {activeTab === 3 && (
            <div className="w-full z-10">
              <NftItemActivity
                activities={disabledItems}
                type="disabled"
                isLoading={isVisibleDisabledFetching}
                action={token_id => {
                  enableMerchNft(token_id, true)
                }}
                actionAll={() => {
                  enableAllMerch(true)
                }}
              />
            </div>
          )}
          {((activeTab === 0 && isVisibleBuyerFetching) ||
            (activeTab === 1 && isVisibleSellerFetching) ||
            (activeTab === 2 && isVisibleEnabledFetching) ||
            (activeTab === 3 && isVisibleDisabledFetching)) && (
            <div className="w-full mt-[0px] lg:mt-[-100px] mb-[40px]">
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

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuthentication } from 'hooks/useAuthentication'

// next components
import Head from 'next/head'

// components
import SelectedTab from 'components/Tab/SelectedTab'
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import ApparelActivity from 'components/pages/MerchLogs/ApparelActivity'

// custom functions
import { useViewport } from 'utils'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useMetaplex } from 'hooks/useMetaplex'

// json
import TabList from 'assets/json/merch-logs/tab-list.json'
import PreviewImage from 'assets/images/preview-image.png'
import SolanaIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import FosterLogoIcon from 'assets/icons/foster-hero-logo-medium.svg?component'
import FosterLogoMobileIcon from 'assets/icons/foster-hero-logo-mobile.svg?component'
import Lottie from 'lottie-react'
import animationData from 'assets/lottery/shopping-lottie.json'

// styles
import styles from './index.module.scss'
import StatsPreviewModal from 'components/Modal/StatsPreviewModal'

// api
import MerchAPI from 'apis/merch'
import ArtistAPI from 'apis/artists'
import NftAPI from 'apis/nfts'
import StoreAPI from 'apis/store'
import LoadingComponent from 'pages/explore/LoadingComponent'
import NftItemActivity from 'components/pages/MerchLogs/NftItemActivity'
import { getMyNFTs } from 'utils/nfts.utils'
import CreateMerchSudioModal from 'components/Modal/CreateMerchSudioModal'
import RemoveMerchSudioModal from 'components/Modal/RemoveMerchSudioModal'
import GradientButton from 'components/Button/GradientButton'
import ShoppingCartActivity from 'components/pages/MerchLogs/ShoppingCartActivity'
import { useRouter } from 'next/router'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'
import OutlineButton from 'components/Button/OutlineButton'
import MerchStoreActivity from 'components/pages/MerchLogs/MerchStoreActivity'

const MerchActivity = () => {
  const viewport = useViewport()
  const { connected, publicKey } = useWallet()
  const { connection } = useConnection()
  const { metaplex: mx } = useMetaplex()
  const { profileInfo } = useAuthentication()
  const defaultActiveTab = useSelector<any>(state => state.activeTab)
  const dispatch = useDispatch()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<any>(defaultActiveTab)
  const [tabList, setTabList] = useState<any[]>(TabList)
  const [previewMode, setPreviewMode] = useState(false)
  const [purchases, setPurchases] = useState([])
  const [noTxPurchases, setNoTxPurchases] = useState([])
  const [allPurchases, setAllPurchases] = useState([])
  const [sales, setSales] = useState([])
  const [noTxSales, setNoTxSales] = useState([])
  const [allSales, setAllSales] = useState([])
  const [merchStoreList, setMerchStoreList] = useState([])
  const [fosterMerchList, setFosterMerchList] = useState([])
  const [userMerchList, setUserMerchList] = useState([])
  const [enabledItems, setEnabledItems] = useState([])
  const [disabledItems, setDisabledItems] = useState([])
  const [artistCommission, setArtistCommission] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [rowCount, setRowCount] = useState(10)
  const [buyerPages, setBuyerPages] = useState(1)
  const [sellerPages, setSellerPages] = useState(1)
  const [enabledPages, setEnabledPages] = useState(1)
  const [loadMerchStore, setLoadMerchStore] = useState(false)
  const [isActiveNFT, setIsActiveNft] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [isMerchStoreFetching, setIsMerchStoreFetching] = useState(true)
  const [isVisibleBuyerFetching, setIsVisibleBuyerFetching] = useState(true)
  const [isVisibleSellerFetching, setIsVisibleSellerFetching] = useState(true)
  const [isVisibleEnabledFetching, setIsVisibleEnabledFetching] = useState(true)
  const [isVisibleDisabledFetching, setIsVisibleDisabledFetching] = useState(true)
  const [enableMerchModal, setEnableMerchModal] = useState(false)
  const [disableMerchModal, setDisableMerchModal] = useState(false)
  const [enableAllMerchModal, setEnableAllMerchModal] = useState(false)
  const [disableAllMerchModal, setDisableAllMerchModal] = useState(false)
  const [array, setArray] = useState([])
  const [cart, setCart] = useState([])
  const [currentSelect, setCurrentSelect] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const { solToUsdRate } = useSolToUsdRate()

  const [tokenId, setTokenId] = useState(false)
  const [selectAllCart, setSelectAllCart] = useState(false)

  useEffect(() => {
    if (mx && connection && publicKey && isVisibleDisabledFetching) {
      loadMyNFTs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mx, connection, publicKey, isVisibleDisabledFetching])

  useEffect(() => {
    if (publicKey) {
      getOrderStats()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (isFetching && publicKey) {
      if (activeTab === 1 && isActiveNFT) getEnabledItem(enabledPages, rowCount)
      else if (activeTab === 2) getBuyerOrder(buyerPages, rowCount)
      else if (activeTab === 3) getSellerOrder(sellerPages, rowCount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, publicKey, activeTab])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('data'))
    setArray(storedData)
    dispatch({ type: 'set', activeTab: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getcartList = () => {
    const storedData = JSON.parse(localStorage.getItem('data'))
    setArray(storedData)
  }

  const handleSelectedTab = item => {
    setActiveTab(item.id)
  }

  const handleOnClick = () => {
    const checkedData = []
    cart.forEach(item => {
      if (item.checked === true) checkedData.push(item)
    })
    if (checkedData.length > 0) {
      localStorage.setItem('checked', JSON.stringify(checkedData))
      router.push(`/shopping/`)
    }
  }

  useEffect(() => {
    if (profileInfo && loadMerchStore === false) {
      setLoadMerchStore(true)
      StoreAPI.getStoreItemByFoster(profileInfo?.id).then(
        res => {
          setFosterMerchList(res)
          setIsMerchStoreFetching(false)
        },
        error => {
          setIsMerchStoreFetching(false)
        }
      )
      StoreAPI.getStoreItemByUser(profileInfo?.id).then(
        res => {
          setUserMerchList(res.filter(item => item.master_edition_address === null))
          setIsMerchStoreFetching(false)
        },
        error => {
          setIsMerchStoreFetching(false)
        }
      )
    }
  }, [profileInfo])

  useEffect(() => {
    setMerchStoreList([...fosterMerchList, ...userMerchList])
  }, [fosterMerchList, userMerchList])

  const getBuyerOrder = (page, rowCount) => {
    MerchAPI.getBuyerOrder(page, rowCount).then(
      response => {
        setIsFetching(false)
        if (isLoadingData) setIsLoadingData(false)

        let purchaseOrders = []
        let noTxOrders = []
        let allOrders = []
        response.forEach(order => {
          let keys = Object.keys(order.seller_shares)
          let creator = ''
          if (keys.length > 0) creator = keys[0]
          let new_order = { ...order, creator }
          if (order.transaction_id != null && order.transaction_id !== '') {
            purchaseOrders.push(new_order)
          } else {
            noTxOrders.push(new_order)
          }
          allOrders.push(new_order)
        })

        setPurchases([...purchases, ...purchaseOrders])
        setNoTxPurchases([...noTxPurchases, ...noTxOrders])
        setAllPurchases([...allPurchases, ...allOrders])

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
        let noTxOrders = []
        let allOrders = []
        response.forEach(order => {
          let creator = order.buyer_address
          let new_order = { ...order, creator }
          if (order.transaction_id != null && order.transaction_id !== '') {
            salesOrders.push(new_order)
          } else {
            noTxOrders.push(new_order)
          }
          allOrders.push(new_order)
        })

        setSales([...sales, ...salesOrders])
        setNoTxSales([...noTxSales, ...noTxOrders])
        setAllSales([...allSales, ...allOrders])

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

  const loadMyNFTs = async () => {
    setIsVisibleDisabledFetching(true)
    let nfts = await getMyNFTs(mx)
    let eligibleNfts = nfts.filter(
      item =>
        item.creators?.length > 0 &&
        item.collectionDetails === null &&
        (item.category ?? 'image').includes('image') &&
        item.category !== 'image/gif' &&
        item.creators.some(({ address }) => publicKey?.toString() === address)
    )

    let nftStatus = await NftAPI.enableAllMerchHub({
      tokenIds: eligibleNfts.map(({ mintAddress }) => mintAddress),
    })
    if (!nftStatus) return
    let disabledNfts = eligibleNfts
      .filter(({ mintAddress }, index) => !nftStatus[mintAddress.toString()])
      .map(({ mintAddress, name, image }, index) => ({
        nft_name: name,
        token_id: mintAddress.toString(),
        asset_url: image,
      }))
    setDisabledItems(disabledNfts)

    setIsVisibleDisabledFetching(false)
  }

  const getNftDetail = (id, toggle) => {
    NftAPI.getDetail(id).then(
      response => {
        if (response != null) {
          enableMerchNft(id, toggle)
        }
      },
      err => {}
    )
  }

  const enableMerchNft = (id, toggle) => {
    if (toggle === true) {
      setEnableMerchModal(false)
      NftAPI.enableAllMerchHub({ tokenIds: [id], value: true }).then(
        response => {
          if (response !== null) {
            if (response.hasOwnProperty(id)) {
              let nft = disabledItems.filter(({ token_id }) => token_id === id)[0]
              setEnabledItems([nft, ...enabledItems])
              setDisabledItems(disabledItems.filter(({ token_id }) => token_id !== id))
            } else {
              getNftDetail(id, toggle)
            }
          }
        },
        err => {}
      )
    } else {
      setDisableMerchModal(false)
      NftAPI.enableMerchHub(id, { value: false }).then(
        response => {
          if (response !== null) {
            let nft = enabledItems.filter(({ token_id }) => token_id === id)[0]
            setDisabledItems([nft, ...disabledItems])
            setEnabledItems(enabledItems.filter(({ token_id }) => token_id !== id))
            setDisableAllMerchModal(false)
          }
        },
        err => {}
      )
    }
  }

  const enableAllMerch = toggle => {
    if (toggle === true) {
      setEnableAllMerchModal(false)
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
      setDisableAllMerchModal(false)
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
          {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
            <div className="w-full flex justify-between">
              <div>
                <FosterLogoIcon />
              </div>
              <div className="flex gap-[15px]">
                <div className="flex gap-[6px]">
                  <div className={styles.countLabel}>${artistCommission.toFixed(2)}</div>
                  <div className={styles.countValue}>Total&nbsp;Commissions</div>
                </div>
                <div className={styles.divider} />
                <div className="flex gap-[6px]">
                  <div className={styles.countLabel}>${totalAmount.toFixed(2)}</div>
                  <div className={styles.countValue}>Total&nbsp;Purchases</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full mb-[30px]">
              <div className="w-full flex justify-center my-[30px]">
                <FosterLogoMobileIcon />
              </div>
              <div className="flex gap-[5px] mt-[0px] lg:mt-[56px]">
                <div className={styles.countBG}>
                  <div className="w-full">
                    <div className={styles.countLabel}>${artistCommission.toFixed(2)}</div>
                    <div className={styles.countValue}>TOTAL&nbsp;COMISSIONS</div>
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
          <div className="relative mt-[0px] lg:mt-[86px] w-full h-auto flex overflow-hidden lg:justify-start justify-center z-10">
            <SelectedTab
              tabList={tabList}
              onChange={item => {
                handleSelectedTab(item)
              }}
            />
            <div className={styles.selectedTabBorder} />
          </div>

          <div className="w-full flex justify-between items-center">
            <div className={styles.description}>
              {activeTab === 0
                ? 'Displayed below are the merch items you created and added to your store.'
                : activeTab === 1
                ? 'Displayed below are legacy studio items.'
                : activeTab === 2
                ? 'Displayed below is a record of all your orders.'
                : activeTab === 3
                ? 'Displayed below is a record of all your sales.'
                : ''}
            </div>
            {activeTab === 1 && (
              <div className="flex gap-[16px]">
                <div
                  className={isActiveNFT ? styles.activeNftBtn : styles.inactiveNftBtn}
                  onClick={() => setIsActiveNft(true)}
                >
                  Active
                </div>
                <div
                  className={isActiveNFT ? styles.inactiveNftBtn : styles.activeNftBtn}
                  onClick={() => setIsActiveNft(false)}
                >
                  Eligible
                </div>
              </div>
            )}
          </div>

          {activeTab === 0 && (
            <div className="w-full z-10">
              <MerchStoreActivity storeList={merchStoreList} isLoading={isMerchStoreFetching} />
            </div>
          )}
          {activeTab === 1 &&
            (isActiveNFT ? (
              <div className="w-full z-10">
                <NftItemActivity
                  activities={enabledItems}
                  type={isActiveNFT}
                  isLoading={isVisibleEnabledFetching}
                  action={token_id => {
                    setTokenId(token_id)
                    setDisableMerchModal(true)
                  }}
                  actionAll={() => {
                    setDisableAllMerchModal(true)
                  }}
                />
              </div>
            ) : (
              <div className="w-full z-10">
                <NftItemActivity
                  activities={disabledItems}
                  type={isActiveNFT}
                  isLoading={isVisibleDisabledFetching}
                  action={token_id => {
                    setTokenId(token_id)
                    setEnableMerchModal(true)
                  }}
                  actionAll={() => {
                    setEnableAllMerchModal(true)
                  }}
                />
              </div>
            ))}

          {activeTab === 2 && (
            <div className="w-full z-10">
              <ApparelActivity
                activities={purchases}
                pendingList={noTxPurchases}
                allList={allPurchases}
                type="purchases"
                isLoading={isVisibleBuyerFetching}
              />
            </div>
          )}
          {activeTab === 3 && (
            <div className="w-full z-10">
              <ApparelActivity
                activities={sales}
                pendingList={noTxSales}
                allList={allSales}
                type="sales"
                isLoading={isVisibleSellerFetching}
              />
            </div>
          )}
          {activeTab === 3 && (
            <div className="w-full flex flex-col-reverse lg:grid grid-cols-3">
              {array && array.length && array.length > 0 ? (
                <>
                  <div className="col-span-2">
                    <div className={styles.shopCartContainer}>
                      <div className={styles.cartTitle}>Studio Shopping Cart</div>
                      <div className={styles.subCartTitle} onClick={() => setSelectAllCart(!selectAllCart)}>
                        {selectAllCart ? 'Deselect all items' : 'Select all items'}
                      </div>
                      <div className="mt-[10px] sm:mt-[30px]">
                        <ShoppingCartActivity
                          data={array}
                          getcartList={getcartList}
                          cart={cart}
                          setCart={setCart}
                          selectAllCart={selectAllCart}
                          setCurrentSelect={setCurrentSelect}
                          currentSelect={currentSelect}
                          setTotalCost={setTotalCost}
                          totalCost={totalCost}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex lg:col-span-1 lg:ml-[40px] h-[200px]">
                    <div className={styles.tableColor}>
                      <div className="flex flex-row items-center justify-between">
                        <div className={styles.subTotal}>Subtotal&nbsp;({currentSelect} items):</div>
                        <div className={`${styles.subTotal} flex flex-row items-center`}>
                          $&nbsp;{totalCost ? totalCost.toFixed(2) : '---'}&nbsp;
                          <div className={styles.costDivider} />
                          <div className="flex ml-[5px] items-center">
                            <SolanaIcon alt="" className="text-[20px] mt-[4px]" />
                            &nbsp;
                            {totalCost === 0 ? '---' : (totalCost / solToUsdRate).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex">
                        <GradientButton
                          label="Place Order"
                          fullWidth
                          disabled={currentSelect == 0}
                          fontFamily="Muli-SemiBold"
                          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53}
                          fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 15 : 18}
                          onClick={() => handleOnClick()}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="lg:mt-[-100px] col-start-2 col-span-1">
                  <Lottie animationData={animationData}></Lottie>
                  <div className="mt-[-50px] mb-[250px] lg:mt-[-70px]">
                    <div className={styles.lootieTitle}>Your cart is empty</div>
                    <div className={styles.lootieSubTitle}>Explore studio and foster your flavor</div>
                    <div className={styles.shopButton}>
                      <OutlineButton
                        width={145}
                        backgroundColor={'var(--second-home-bg)'}
                        borderColor={'var(--back-btn-border-mobile)'}
                        label={'Shop Studio'}
                        onClick={() => router.push('/studio/')}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {((activeTab === 0 && isMerchStoreFetching) ||
            (activeTab === 1 && isVisibleEnabledFetching) ||
            (activeTab === 2 && isVisibleDisabledFetching) ||
            (activeTab === 3 && isVisibleBuyerFetching) ||
            (activeTab === 4 && isVisibleSellerFetching)) && (
            <div className="w-full mt-[0px] lg:mt-[-100px] mb-[40px]">
              <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
            </div>
          )}
        </div>
      </div>
      {enableMerchModal && (
        <CreateMerchSudioModal
          onContinue={() => enableMerchNft(tokenId, true)}
          open={enableMerchModal}
          close={() => setEnableMerchModal(false)}
        />
      )}
      {disableMerchModal && (
        <RemoveMerchSudioModal
          onContinue={() => enableMerchNft(tokenId, false)}
          open={disableMerchModal}
          close={() => setDisableMerchModal(false)}
        />
      )}
      {enableAllMerchModal && (
        <CreateMerchSudioModal
          onContinue={() => enableAllMerch(true)}
          open={enableAllMerchModal}
          close={() => setEnableAllMerchModal(false)}
        />
      )}
      {disableAllMerchModal && (
        <RemoveMerchSudioModal
          onContinue={() => enableAllMerch(false)}
          open={disableAllMerchModal}
          close={() => setDisableAllMerchModal(false)}
        />
      )}
      <StatsPreviewModal
        open={previewMode}
        close={() => {
          window.history.go(-1)
          setPreviewMode(false)
        }}
      />
      {/* <FullScreenLoadingModal open={isLoading} /> */}
    </div>
  )
}

export default MerchActivity

MerchActivity.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}

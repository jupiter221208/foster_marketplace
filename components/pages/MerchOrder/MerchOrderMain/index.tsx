import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'
import Lottie from 'lottie-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
// next component

//components
import ImageWithFoster from 'components/ImageWithFoster'
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'
import SocialShareModal from 'components/Menu/SocialShareModal'
import SizeChartModal from 'components/Modal/SizeChartModal'
import { calculateAuctionTimeLeft, getTimeDifference } from 'utils/helpers'
import GradientButton from 'components/Button/GradientButton'

// images
import ShareDesktopIcon from 'assets/icons/share-icon-707070.svg?component'
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-13x11.svg?component'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'

// json
import ShopApparelList from 'assets/json/browse-nft/shop-apparel-list.json'
import SizeList from 'assets/json/print/size-chat-modal.json'
import MoreDetalsLightIcon from 'assets/lottery/more-details-light.json'
import MoreDetalsIcon from 'assets/lottery/more-details.json'

// styles
import styles from './index.module.scss'
import { getDisplayUserName } from 'utils/strings'
import OutlineButton from 'components/Button/OutlineButton'
import Alert from 'components/Alert'
import MerchOrderDetail from '../MerchOrderDetail'
import MenuEditMerch from 'components/Menu/MenuEditMerch'

const MerchOrderMain = props => {
  const {
    type,
    username,
    productDetail,
    userDetail,
    onClickBuyNow,
    setQuantity,
    setMerchSize,
    productId,
    data,
    merchList,
    rawList,
  } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const { solToUsdRate } = useSolToUsdRate()
  const [openShareModal, setOpenShareModal] = useState(false)
  const [share, setShare] = useState<boolean>(false)
  const [shareCount, setShareCount] = useState(0)
  const lightDarkMode = useSelector(state => (state as any).lightMode)
  const detailViewRef = useRef(null)

  const [tableModal, setTableModal] = useState(false)
  const [sizeList, setSizeList] = useState([])
  const [timeLeft, setTimeLeft] = useState(null)
  const [cardExpired, setCardExpired] = useState(false)
  const description = productDetail.description

  const [printArea, setPrintArea] = useState('')
  const [mintQty, setMintQty] = useState(1)
  const [buyNowLoading, setBuyNowLoading] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [showEditMerch, setShowEditMerch] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  console.log(userDetail, '=========userDetail======')
  useEffect(() => {
    if (productDetail.sale_end_at !== null && getTimeDifference(productDetail.sale_end_at) < 0) setIsExpired(true)

    let size_list
    switch (productDetail.product_type_id) {
      case 1:
      case 2:
        size_list = SizeList[2].size
        break
      case 3:
      case 4:
        size_list = SizeList[3].size
        break
      case 5:
      case 6:
        size_list = SizeList[0].size
        break
      case 7:
      case 8:
        size_list = SizeList[1].size
        break
      case 9:
      case 10:
        size_list = SizeList[4].size
        break
      case 12:
      case 13:
        let sizes = []
        productDetail.options.sizes.map((item, index) => sizes.push({ id: index, Size: item }))
        size_list = sizes
        break
      case 28:
      case 29:
      case 30:
        size_list = SizeList[5].size // XS - 3XL
        break
      case 25:
      case 26:
      case 22:
      case 23:
      case 31:
      case 32:
      case 33:
        size_list = SizeList[6].size // S - 3XL
        break
      case 27:
        size_list = SizeList[7].size // S - 4XL
        break
      case 38:
      case 39:
        size_list = SizeList[8].size // S - L
        break
      case 36:
      case 37:
        size_list = SizeList[9].size // S - 2XL
        break
      case 34:
      case 35:
        size_list = SizeList[10].size // XS - 2XL
        break
      case 40:
      case 41:
      case 42:
      case 43:
        size_list = []
        break
      default:
        size_list = []
        break
    }
    let sizes = []
    size_list.map((size, index) => {
      if (index === Math.round(size_list.length / 2)) {
        sizes.push({ id: index, name: size.Size, selected: true })
        setMerchSize(size.Size)
      } else {
        sizes.push({ id: index, name: size.Size, selected: false })
      }
    })
    setSizeList(sizes)
    if (productDetail.fulfillment_type === 'foster') {
      // Print Area
      let directiction = []
      let list = productDetail.options.addons
      list.map(item => {
        let direct_id = item.product_addon_id
        directiction.push(
          direct_id === 1
            ? 'Front'
            : direct_id === 2
            ? 'Back'
            : direct_id === 3
            ? 'Right'
            : direct_id === 4
            ? 'Left'
            : ''
        )
      })
      setPrintArea(directiction.join().replaceAll(',', ', '))
    }

    if (productDetail.sale_start_at !== null) {
      if (getStartTime() === null) return

      setTimeLeft(calculateAuctionTimeLeft(getStartTime()))

      const timer = setInterval(() => {
        let timeLeft = calculateAuctionTimeLeft(getStartTime())
        if (
          timeLeft['days'] === '00' &&
          timeLeft['hours'] === '00' &&
          timeLeft['minutes'] === '00' &&
          timeLeft['seconds'] === '00'
        )
          setCardExpired(true)
        setTimeLeft(timeLeft)
      }, 1000)

      return () => clearTimeout(timer)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDetail])

  const getStartTime = () => {
    let difference = getTimeDifference(productDetail.sale_start_at)

    if (difference >= 0) {
      return productDetail.sale_start_at
    } else {
      return productDetail.sale_end_at
    }
  }

  const onClickSize = index => {
    let newSize = []
    sizeList.map(item => {
      if (item.id === index) {
        newSize.push({ ...item, selected: true })
        setMerchSize(item.name)
      } else {
        newSize.push({ ...item, selected: false })
      }
    })
    setSizeList(newSize)
  }

  const getApparelName = () => {
    let type = 'Unisex'
    let name = 'Hoodie'

    if (productDetail.product_type_id === 1 || productDetail.product_type_id === 2) {
      name = 'Hoodie'
    } else if (productDetail.product_type_id === 3 || productDetail.product_type_id === 4) {
      name = 'Long Sleeve'
    } else if (productDetail.product_type_id === 5 || productDetail.product_type_id === 6) {
      name = 'Short Sleeve'
    } else if (productDetail.product_type_id === 7 || productDetail.product_type_id === 8) {
      name = 'Sweatshirt'
    } else if (productDetail.product_type_id === 9 || productDetail.product_type_id === 10) {
      name = "Women's Short Sleeve"
    }

    let list = ShopApparelList.filter(item => item.base === name && item.sub_type == type)
    if (list.length > 0) return list[0].name
    else return name
  }

  const getApparelLabel = () => {
    let type = 'Unisex'
    let name = 'Hoodie'

    if (productDetail.product_type_id === 1 || productDetail.product_type_id === 2) {
      name = 'Hoodie'
    } else if (productDetail.product_type_id === 3 || productDetail.product_type_id === 4) {
      name = 'Long Sleeve'
    } else if (productDetail.product_type_id === 5 || productDetail.product_type_id === 6) {
      name = 'Short Sleeve'
    } else if (productDetail.product_type_id === 7 || productDetail.product_type_id === 8) {
      name = 'Sweatshirt'
    } else if (productDetail.product_type_id === 9 || productDetail.product_type_id === 10) {
      name = "Women's Short Sleeve"
    }

    let list = ShopApparelList.filter(item => item.base === name && item.sub_type == type)
    if (list.length > 0) return list[0].label
    else return name
  }

  const getStartStatus = () => {
    if (getTimeDifference(productDetail.sale_start_at) > 0) return 'Starts in'

    if (productDetail.sale_end_at === null) return ''

    return 'Time Remaining'
  }

  const downloadFiles = async () => {
    let urls = []
    if (productDetail.fulfillment_type === 'foster') {
      productDetail.options.addons.map((item, index) => {
        urls.push(item.mockup_url)
      })
    } else {
      productDetail.options.product_images.map((item, index) => {
        urls.push(item)
      })
    }
    for (let index = 0; index < urls.length; index++) {
      const data = {
        url: urls[index],
      }
      let response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)

      // Create an anchor tag to perform the download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', `MerchFile-${index}.png`) // Set the default filename
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    }
  }

  const onClickAddCart = () => {
    if (!connected) {
      setVisible(true)
      return
    }

    let existingData = JSON.parse(localStorage.getItem('cart_v2')) || []
    if (!Array.isArray(existingData)) {
      existingData = []
    }

    let cart_data = {
      version: 'v2',
      type,
      merchEdition: false,
      cost: ((productDetail.selling_price / 100) * mintQty).toFixed(2),
      productId,
      data,
      fosterUrl: window.location.href,
      merchList,
      rawList,
    }
    existingData.push(cart_data)
    localStorage.setItem('cart_v2', JSON.stringify(existingData))

    setAlertData([
      {
        id: 0,
        title: 'Item Added to Your Cart!',
        description: `${data.name} is ready and waiting in your cart. Feel free to browse for more goodies or head to checkout whenever you're ready.`,
        type: 'success',
      },
    ])
    setShowAlert(true)

    dispatch({ type: 'set', cartUpdated: true })
  }

  return (
    <div className={styles.container}>
      <div className={styles.rightSection}>
        <div>
          <div className="w-full">
            <div className="w-full flex justify-between gap-[35px] items-center lg:items-start">
              <div className={styles.productName}>{productDetail?.name}</div>

              {/* <div className="mr-[10px] lg:mr-[0px]" onClick={() => setOpenShareModal(true)}>
                <ShareDesktopIcon alt="" />
              </div> */}
              <div className="flex items-center gap-[15px] lg:gap-[20px]">
                <MenuEditMerch
                  explorerURL={`/${username}/merch/${productDetail.id}`}
                  setShowEditMerch={setShowEditMerch}
                  isCreatedMerch={publicKey?.toBase58() === userDetail?.wallet_id}
                  setOpenShareModal={setOpenShareModal}
                />
              </div>
            </div>

            <div className="flex gap-[8px] mt-[10px]">
              <div className="flex gap-[6px] items-center mb-[2px]">
                <SolanaLogoIcon className="mt-[4px]" />
                <div className={styles.price}>
                  {((productDetail.selling_price / 100 / solToUsdRate) * mintQty).toFixed(2)}
                </div>
              </div>
              <div className={styles.priceUS}> ${((productDetail.selling_price / 100) * mintQty).toFixed(2)}</div>
            </div>
            <div className="mt-[20px] lg:mt-[30px] flex flex-wrap gap-[15px] lg:gap-[30px]">
              <div className="flex flex-wrap sm:gap-[30px] gap-[10px]">
                <div>
                  <div className={styles.creator}>Seller</div>
                  <Link href={`/${userDetail.username}`} passHref>
                    <a>
                      <div className={styles.creatorRound} onClick={() => router.push(`/${userDetail.username}`)}>
                        <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
                          <ImageWithFoster
                            src={userDetail.profile_picture?.length > 0 ? userDetail.profile_picture : DefaultAvatar}
                            alt=""
                          />
                        </div>
                        {getDisplayUserName(userDetail.username)}
                      </div>
                    </a>
                  </Link>
                </div>
                {type !== 'foster' && (
                  <div>
                    <div className={styles.creator}>{productDetail.supply ? 'Limited Supply' : 'Open Supply'}</div>
                    <div>
                      <div className={styles.supplyRound}>
                        {productDetail.supply
                          ? `${productDetail.supply - productDetail.current_supply}/${productDetail.supply} left`
                          : `${productDetail.current_supply} sold`}
                      </div>
                    </div>
                  </div>
                )}

                {type !== 'foster' &&
                  timeLeft &&
                  (productDetail.supply === null || productDetail.supply - productDetail.current_supply > 0) && (
                    <div>
                      <div className={styles.creator}>{getStartStatus()}</div>
                      <div>
                        <div className={styles.supplyRound}>
                          <div className={styles.bidCountContainer}>
                            {timeLeft && timeLeft['days'] !== '00' && (
                              <div>
                                <div className={styles.endTime}>
                                  {timeLeft && timeLeft['days']}
                                  {timeLeft && <div className={styles.bidDesc}>d</div>}
                                </div>
                              </div>
                            )}
                            <div className={styles.endTimeContainer}>
                              <div className={styles.endTime}>
                                {timeLeft && timeLeft['hours']}
                                {timeLeft && <div className={styles.bidDesc}>h</div>}
                              </div>
                            </div>
                            <div className={styles.endTimeContainer}>
                              <div className={styles.endTime}>
                                {timeLeft && timeLeft['minutes']}
                                {timeLeft && <div className={styles.bidDesc}>m</div>}
                              </div>
                            </div>
                            <div className={styles.endTimeContainer}>
                              <div className={styles.endTime}>
                                {timeLeft && timeLeft['seconds']}
                                {timeLeft && <div className={styles.bidDesc}>s</div>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {sizeList.length > 0 && (
              <div className="mt-[15px] lg:mt-[30px]">
                <div className="w-full flex justify-between items-center">
                  <div className={styles.selectSize}>Select Size</div>
                </div>
                <div className="mt-[15px]">
                  <div className="w-full flex flex-wrap gap-[10px]">
                    {sizeList.map((item, index) => (
                      <div
                        key={index}
                        className={item.selected ? styles.selectedSize : styles.unselectedSize}
                        onClick={() => onClickSize(index)}
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>
                {type === 'foster' && (
                  <div className={styles.sizeChart} onClick={() => setTableModal(true)}>
                    Size Chart »
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="w-full lg:mt-[35px] mt-[35px]">
            {type === 'foster' ? (
              <div className={styles.cartContainer}>
                <div className="w-full flex justify-between">
                  <div>
                    <div className={styles.supplyName}>{productDetail.supply ? 'Limited Supply' : 'Open Supply'}</div>
                    <div className={styles.supplyValue}>
                      {productDetail.supply
                        ? `${productDetail.supply - productDetail.current_supply}/${productDetail.supply} left`
                        : `${productDetail.current_supply} sold`}
                    </div>
                  </div>
                  <div>
                    {(productDetail.supply === null || productDetail.supply - productDetail.current_supply > 0) &&
                      (timeLeft ? (
                        <div>
                          <div className={`${styles.supplyName} text-right`}>{getStartStatus()}</div>
                          <div className="mt-[11px]">
                            {isExpired ? (
                              <div className={`${styles.supplyValue} text-end`}>Listing Expired</div>
                            ) : (
                              <div className={styles.bidCountContainer}>
                                {timeLeft && timeLeft['days'] !== '00' && (
                                  <div>
                                    <div className={styles.endTimeCart}>
                                      {timeLeft && timeLeft['days']}
                                      {timeLeft && <div className={styles.bidDescCart}>d</div>}
                                    </div>
                                  </div>
                                )}
                                <div className={styles.endTimeContainer}>
                                  <div className={styles.endTimeCart}>
                                    {timeLeft && timeLeft['hours']}
                                    {timeLeft && <div className={styles.bidDescCart}>h</div>}
                                  </div>
                                </div>
                                <div className={styles.endTimeContainer}>
                                  <div className={styles.endTimeCart}>
                                    {timeLeft && timeLeft['minutes']}
                                    {timeLeft && <div className={styles.bidDescCart}>m</div>}
                                  </div>
                                </div>
                                <div className={styles.endTimeContainer}>
                                  <div className={styles.endTimeCart}>
                                    {timeLeft && timeLeft['seconds']}
                                    {timeLeft && <div className={styles.bidDescCart}>s</div>}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className={`${styles.supplyName} text-end`}>{'Time Remaining'}</div>
                          <div className={styles.supplyValue}>{'No Expiration'}</div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="w-full flex flex-col lg:flex-row gap-[15px] lg:gap-[15px]">
                  {(productDetail.supply === null || productDetail.supply - productDetail.current_supply > 1) &&
                    (timeLeft === null || !isExpired) && (
                      <div className={styles.mintQty}>
                        <div
                          onClick={() => {
                            if (mintQty > 1) {
                              setMintQty(mintQty - 1)
                              setQuantity(mintQty - 1)
                            }
                          }}
                        >
                          <div className={styles.minus}>-</div>
                        </div>
                        <div className={styles.mintLabel}>
                          Qty&nbsp;<div className={styles.mintValue}>{mintQty}</div>
                        </div>
                        <div
                          onClick={() => {
                            if (productDetail.supply) {
                              if (mintQty < productDetail.supply - productDetail.current_supply) {
                                setMintQty(mintQty + 1)
                                setQuantity(mintQty + 1)
                              }
                            } else {
                              setMintQty(mintQty + 1)
                              setQuantity(mintQty + 1)
                            }
                          }}
                        >
                          <div className={styles.minus}>+</div>
                        </div>
                      </div>
                    )}
                  {(productDetail.supply === null || productDetail.supply - productDetail.current_supply > 0) &&
                    (timeLeft === null || !isExpired) && (
                      <div className="w-full lg:mt-[15px]">
                        <OutlineButton
                          fullWidth
                          height={45}
                          borderRadius={23}
                          label="Add to Cart"
                          fontFamily="Muli-Regular"
                          fontSize={16}
                          onClick={() => onClickAddCart()}
                        />
                      </div>
                    )}
                </div>

                {(productDetail.supply === null || productDetail.supply - productDetail.current_supply > 0) &&
                  (timeLeft === null || !isExpired) && (
                    <div className="w-full mt-[15px]">
                      {buyNowLoading ? (
                        <LoadingPrimaryButton fullWidth />
                      ) : (
                        <GradientButton
                          fullWidth
                          height={45}
                          borderRadius={23}
                          label="Buy Now"
                          disabled={getStartStatus() === 'Starts in' || isExpired}
                          onClick={() => onClickBuyNow()}
                        />
                      )}
                    </div>
                  )}
              </div>
            ) : (
              <div>
                <div className="w-full flex flex-col lg:flex-row gap-[15px] lg:gap-[30px]">
                  {(productDetail.supply === null || productDetail.supply - productDetail.current_supply > 1) &&
                    (timeLeft === null || !isExpired) && (
                      <div className={styles.mintQty}>
                        <div
                          onClick={() => {
                            if (mintQty > 1) {
                              setMintQty(mintQty - 1)
                              setQuantity(mintQty - 1)
                            }
                          }}
                        >
                          <div className={styles.minus}>-</div>
                        </div>
                        <div className={styles.mintLabel}>
                          Qty&nbsp;<div className={styles.mintValue}>{mintQty}</div>
                        </div>
                        <div
                          onClick={() => {
                            if (productDetail.supply) {
                              if (mintQty < productDetail.supply - productDetail.current_supply) {
                                setMintQty(mintQty + 1)
                                setQuantity(mintQty + 1)
                              }
                            } else {
                              setMintQty(mintQty + 1)
                              setQuantity(mintQty + 1)
                            }
                          }}
                        >
                          <div className={styles.minus}>+</div>
                        </div>
                      </div>
                    )}
                  {(productDetail.supply === null || productDetail.supply - productDetail.current_supply > 0) &&
                    (timeLeft === null || !isExpired) && (
                      <div className="w-full mt-[15px]">
                        {buyNowLoading ? (
                          <LoadingPrimaryButton fullWidth />
                        ) : (
                          <GradientButton
                            fullWidth
                            height={45}
                            borderRadius={23}
                            label="Buy Now"
                            disabled={getStartStatus() === 'Starts in' || isExpired}
                            onClick={() => onClickBuyNow()}
                          />
                        )}
                      </div>
                    )}
                </div>
                <div className="mt-[50px]">
                  <MerchOrderDetail
                    type={type}
                    userDetail={userDetail}
                    productDetail={productDetail}
                    description={description}
                    downloadFiles={downloadFiles}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {type === 'foster' && (
          <div
            className="w-full lg:flex hidden justify-center mb-[70px]"
            onClick={() => {
              detailViewRef.current?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <div className={styles.moreDetails}>
              More details
              <div className="w-[30px] h-[30px] mt-[-5px]">
                <Lottie animationData={lightDarkMode ? MoreDetalsLightIcon : MoreDetalsIcon} />
              </div>
            </div>
          </div>
        )}
      </div>

      {type === 'foster' && (
        <div ref={detailViewRef}>
          <MerchOrderDetail
            type={type}
            userDetail={userDetail}
            productDetail={productDetail}
            description={description}
            downloadFiles={downloadFiles}
          />
        </div>
      )}

      {openShareModal && (
        <SocialShareModal
          open={openShareModal}
          close={() => setOpenShareModal(false)}
          vote={share}
          setVote={setShare}
          voteCount={shareCount}
          setVoteCount={setShareCount}
          message={'Check out this fresh art on @foster_protocol #fostermarketplace'}
          url={`/${username}/merch/${productDetail.id}`}
        />
      )}

      <SizeChartModal
        open={tableModal}
        title={getApparelName()}
        label={getApparelLabel()}
        onClose={() => setTableModal(false)}
      />

      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
    </div>
  )
}

export default MerchOrderMain

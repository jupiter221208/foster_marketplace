import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'

// next component

//components
import MerchShopClipboardChip from 'components/Chip/MerchShopClipboardChip'

// images
import ShareDesktopIcon from 'assets/icons/share-icon-707070.svg?component'
import InfoIcon from 'assets/icons/info-green-small.svg?component'
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-13x11.svg?component'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'
import ArrowRightWhiteIcon from 'assets/icons/arrow-right-white-medium.svg?component'
import ArrowDownWhiteIcon from 'assets/icons/arrow-down-white.svg?component'

// json
import ShopApparelList from 'assets/json/browse-nft/shop-apparel-list.json'
import ProductTypeList from 'assets/json/merch-shop/product-type-list.json'
import SizeList from 'assets/json/print/size-chat-modal.json'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'
import PrimaryButton from 'components/Button/PrimaryButton'
import SocialShareModal from 'components/Menu/SocialShareModal'
import SizeChartModal from 'components/Modal/SizeChartModal'
import { calculateAuctionTimeLeft, getFirstUpperString, getTimeDifference } from 'utils/helpers'
import Link from 'next/link'

const MerchOrderMain = props => {
  const { type, username, productDetail, userDetail, onClickBuyNow, setQuantity, setMerchSize } = props
  const router = useRouter()
  const { solToUsdRate } = useSolToUsdRate()
  const [openShareModal, setOpenShareModal] = useState(false)
  const [share, setShare] = useState<boolean>(false)
  const [shareCount, setShareCount] = useState(0)
  const alertEmb = 'alert-emb'
  const alertEmbMobile = 'alert-emb-mobile'
  const alertNote = 'alert-note'
  const alertNoteMobile = 'alert-mobile'
  const [tableModal, setTableModal] = useState(false)
  const [sizeList, setSizeList] = useState([])
  const [timeLeft, setTimeLeft] = useState(null)
  const [cardExpired, setCardExpired] = useState(false)
  const [descCount, setDescCount] = useState(280)
  const description = productDetail.description
  const [isTruncated, setIsTruncated] = useState(true)
  const [tempNftDescription, setTempNftDescription] = useState('')
  const processedNftDescription = isTruncated ? tempNftDescription.slice(0, descCount) : tempNftDescription
  const shouldShowReadMore = tempNftDescription.length > descCount
  const [printArea, setPrintArea] = useState('')
  const [mintQty, setMintQty] = useState(1)
  const [buyNowLoading, setBuyNowLoading] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [showDescription, setShowDescription] = useState(false)
  const [showEmbroidery, setShowEmbroidery] = useState(false)
  const [showNotice, setShowNotice] = useState(false)

  useEffect(() => {
    function handleResize() {
      let screenWidth = window.innerWidth
      let count = screenWidth >= 1536 ? 240 : screenWidth >= 1280 ? 220 : screenWidth >= 1024 ? 200 : 200
      setDescCount(count)
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setTempNftDescription(description)
  }, [description])

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
      default:
        size_list = SizeList[5].size
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
            : 'Front'
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

  function toggleIsTruncated() {
    setIsTruncated(!isTruncated)
  }

  // useEffect(() => {
  //   if (productDetail.supply === null || productDetail.supply - productDetail.current_supply > 0) {
  //     document.getElementById(alertEmb).style.display = 'none'
  //     document.getElementById(alertEmbMobile).style.display = 'none'
  //     document.getElementById(alertNote).style.display = 'none'
  //     document.getElementById(alertNoteMobile).style.display = 'none'
  //   }
  // }, [])

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

    return 'Ends in'
  }

  return (
    <div className={styles.container}>
      <div className="w-full h-auto">
        <div className="w-full">
          <div className="w-full flex justify-between">
            <div className={styles.productName}>{productDetail?.name}</div>

            <div className={styles.shareIcon} onClick={() => setOpenShareModal(true)}>
              <div className="">
                <ShareDesktopIcon alt="" />
              </div>
              <div className={`${styles.shareText} mt-[-2px]`}>Share</div>
            </div>
          </div>

          <div className="mt-[35px] flex flex-wrap gap-[15px]">
            <div>
              <div className={styles.creator}>Seller</div>
              <Link href={`/${userDetail.username}`} passHref>
                <a>
                  <div className={styles.creatorRound} onClick={() => router.push(`/${userDetail.username}`)}>
                    <div className="w-[30px] h-[30px] rounded-full overflow-hidden ml-[-5px]">
                      <ImageWithFoster
                        src={userDetail.profile_picture?.length > 0 ? userDetail.profile_picture : DefaultAvatar}
                        alt=""
                      />
                    </div>
                    {userDetail.username}
                  </div>
                </a>
              </Link>
            </div>
            <div>
              <div className={styles.creator}>{productDetail.supply ? 'Limited Supply' : 'Open Supply'}</div>

              <div className={styles.creatorRound}>
                {productDetail.supply ? `3/3 left` : `${productDetail.current_supply} sold`}
              </div>
            </div>
          </div>

          {/* {type === 'foster' && <div className={`mt-[15px] ${styles.divider}`} />} */}

          {type === 'foster' && (
            <div className="lg:mt-[58px] mt-[20px]">
              <div className="w-full flex justify-between items-center">
                <div className={styles.desc}>Select Size</div>
                <div className={styles.sizeChart} onClick={() => setTableModal(true)}>
                  Size Chart »
                </div>
              </div>
              <div className="mt-[15px]">
                <div className="w-full flex flex-wrap gap-[9px]">
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
            </div>
          )}

          {/* {type === 'foster' && <div className={`mt-[20px] ${styles.divider}`} />} */}
        </div>

        <div className="w-full">
          <div className="lg:mt-[58px] mt-[20px]">
            <div className={`w-full ${timeLeft != null ? 'flex justify-between' : ''}`}>
              <div className="flex gap-[6px] items-center">
                <div className={styles.endsIn}>{getStartStatus()}</div>
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

              <div>
                <div className="flex gap-[6px] items-center mb-[2px]">
                  <SolanaLogoIcon className="mt-[4px]" />
                  <div className={styles.price}>
                    {((productDetail.selling_price / 100 / solToUsdRate) * mintQty).toFixed(2)}
                  </div>
                </div>
                {/* <div className={styles.priceUS}> ${((productDetail.selling_price / 100) * mintQty).toFixed(2)}</div> */}
              </div>
            </div>
            {(productDetail.supply === null || productDetail.supply - productDetail.current_supply > 1) && (
              <div className="w-full mt-[10px]">
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
              </div>
            )}
          </div>
          {/* {(productDetail.supply === null || productDetail.supply - productDetail.current_supply > 0) && (
            <div className={`mt-[20px] ${styles.divider}`} />
          )} */}
          {/* {(productDetail.supply === null || productDetail.supply - productDetail.current_supply > 0) && (
            <div className="w-full flex justify-between mt-[20px] relative">
              <div>
                <div className="flex gap-[7px] items-center relative">
                  <div className={styles.infoText}>
                    {type === 'foster' ? 'Embroidery Disclaimer' : 'Shipping & Handling'}
                  </div>
                  <div
                    onMouseEnter={() => {
                      document.getElementById(alertEmb).style.display = 'block'
                    }}
                    onMouseLeave={() => {
                      document.getElementById(alertEmb).style.display = 'none'
                    }}
                    onClick={() => {
                      document.getElementById(alertEmbMobile).style.display = 'block'
                      setTimeout(() => {
                        document.getElementById(alertEmbMobile).style.display = 'none'
                      }, 3000)
                    }}
                  >
                    <InfoIcon />
                  </div>
                  <div className="lg:block hidden">
                    <MerchShopClipboardChip
                      width={type === 'foster' ? null : '500px'}
                      title={type === 'foster' ? 'Embroidery Disclaimer' : 'Shipping & Handling'}
                      text={
                        type === 'foster'
                          ? 'Please note that the actual embroidered design may vary from the digital preview shown. While we strive for accuracy, the nature of embroidery can result in differences in color, texture, and placement.'
                          : 'Domestic & international shipping will be paid by the buyer.'
                      }
                      identifier={alertEmb}
                    />
                  </div>
                </div>

                <div className="flex gap-[7px] items-center mt-[10px] relative">
                  <div className={styles.infoText}>{type === 'foster' ? 'Customs Notice' : 'Liability Disclaimer'}</div>
                  <div
                    onMouseEnter={() => {
                      document.getElementById(alertNote).style.display = 'block'
                    }}
                    onMouseLeave={() => {
                      document.getElementById(alertNote).style.display = 'none'
                    }}
                    onClick={() => {
                      document.getElementById(alertNoteMobile).style.display = 'block'
                      setTimeout(() => {
                        document.getElementById(alertNoteMobile).style.display = 'none'
                      }, 3000)
                    }}
                  >
                    <InfoIcon />
                  </div>
                  <div className="lg:block hidden">
                    <MerchShopClipboardChip
                      title={type === 'foster' ? 'Customs Notice' : 'Liability Disclaimer'}
                      text={
                        type === 'foster'
                          ? 'All customers outside of the United States are responsible for the customs fees/duties that may be charged by their country for import. This amount may vary depending on your country. We advise looking up your country’s policies before purchasing so you are aware of any potential fees.'
                          : 'Users are solely responsible for conducting their own due diligence before engaging in any transaction. All transactions are conducted at your own risk. Any disputes arising from transactions conducted on the platform are to be resolved directly between the buyer and seller.'
                      }
                      identifier={alertNote}
                    />
                  </div>
                </div>

                <div className="lg:hidden block w-full">
                  <MerchShopClipboardChip
                    type="Embroidery"
                    title={type === 'foster' ? 'Embroidery Disclaimer' : 'Shipping & Handling'}
                    text={
                      type === 'foster'
                        ? 'Please note that the actual embroidered design may vary from the digital preview shown. While we strive for accuracy, the nature of embroidery can result in differences in color, texture, and placement.'
                        : 'Domestic & international shipping will be paid by the buyer.'
                    }
                    identifier={alertEmbMobile}
                  />
                </div>
                <div className="lg:hidden block w-full">
                  <MerchShopClipboardChip
                    type="custom"
                    title={type === 'foster' ? 'Customs Notice' : 'Liability Disclaimer'}
                    text={
                      type === 'foster'
                        ? 'All customers outside of the United States are responsible for the customs fees/duties that may be charged by their country for import. This amount may vary depending on your country. We advise looking up your country’s policies before purchasing so you are aware of any potential fees.'
                        : 'Users are solely responsible for conducting their own due diligence before engaging in any transaction. All transactions are conducted at your own risk. Any disputes arising from transactions conducted on the platform are to be resolved directly between the buyer and seller.'
                    }
                    identifier={alertNoteMobile}
                  />
                </div>
              </div>

              <div>
                <div className="flex gap-[6px] items-center mb-[2px]">
                  <SolanaLogoIcon className="mt-[4px]" />
                  <div className={styles.price}>
                    {((productDetail.selling_price / 100 / solToUsdRate) * mintQty).toFixed(2)}
                  </div>
                </div>
                <div className={styles.priceUS}> ${((productDetail.selling_price / 100) * mintQty).toFixed(2)}</div>
              </div>
            </div>
          )} */}
          {(productDetail.supply === null || productDetail.supply - productDetail.current_supply > 0) && (
            <div className="w-full mt-[20px]">
              {buyNowLoading ? (
                <LoadingPrimaryButton fullWidth />
              ) : (
                <PrimaryButton
                  fullWidth
                  type="buy-now"
                  label="Buy Now"
                  disabled={getStartStatus() === 'Starts in' || isExpired}
                  onClick={() => onClickBuyNow()}
                />
              )}
            </div>
          )}

          <div
            className="w-full flex justify-between items-center lg:mt-[58px] mt-[30px]"
            onClick={() => setShowDescription(!showDescription)}
          >
            <div className={styles.desc}>Description</div>
            <div>{showDescription ? <ArrowDownWhiteIcon /> : <ArrowRightWhiteIcon />}</div>
          </div>
          {showDescription && (
            <div>
              {productDetail.fulfillment_type === 'foster' && (
                <div className="mt-[15px]">
                  <div className="w-full flex justify-between mt-[7px]">
                    <div className={styles.content}>Apparel Type</div>
                    <div className={styles.contentValue}>{ProductTypeList[productDetail.product_type_id - 1].name}</div>
                  </div>
                  <div className="w-full flex justify-between mt-[6px]">
                    <div className={styles.content}>Print Technique</div>
                    <div className={styles.contentValue}>
                      {productDetail.options.print_technique === 'direct_to_garment'
                        ? 'Direct To Garment'
                        : 'Embroidery'}
                    </div>
                  </div>
                  <div className="w-full flex justify-between mt-[6px]">
                    <div className={styles.content}>Print Areas</div>
                    <div className={styles.contentValue}>{printArea}</div>
                  </div>
                  <div className="w-full flex justify-between mt-[6px]">
                    <div className={styles.content}>Color</div>
                    <div className={styles.contentValue}>{getFirstUpperString(productDetail.options.color)}</div>
                  </div>
                </div>
              )}
              {productDetail.fulfillment_type === 'user' && (
                <div className="mt-[15px]">
                  <div className={`mt-[10px] ${styles.endsTime}`}>
                    {processedNftDescription}
                    {shouldShowReadMore && (
                      <span onClick={toggleIsTruncated} className={`${styles.greenText} min-w-max cursor-pointer`}>
                        {isTruncated ? '... Expand' : ' Collapse'}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className={`mt-[15px] ${styles.divider}`} />

          {/* Embroidery Disclaimer */}
          <div
            className="w-full flex justify-between items-center mt-[15px]"
            onClick={() => setShowEmbroidery(!showEmbroidery)}
          >
            <div className={styles.desc}>{type === 'foster' ? 'Embroidery Disclaimer' : 'Shipping & Handling'}</div>
            <div>{showEmbroidery ? <ArrowDownWhiteIcon /> : <ArrowRightWhiteIcon />}</div>
          </div>
          {showEmbroidery && (
            <div className={`${styles.endsTime} mt-[15px]`}>
              {type === 'foster'
                ? 'Please note that the actual embroidered design may vary from the digital preview shown. While we strive for accuracy, the nature of embroidery can result in differences in color, texture, and placement.'
                : productDetail.shipping}
            </div>
          )}
          <div className={`mt-[15px] ${styles.divider}`} />

          {/* Customs Notice */}
          <div
            className="w-full flex justify-between items-center mt-[15px]"
            onClick={() => setShowNotice(!showNotice)}
          >
            <div className={styles.desc}>{type === 'foster' ? 'Customs Notice' : 'Liability Disclaimer'}</div>
            <div>{showNotice ? <ArrowDownWhiteIcon /> : <ArrowRightWhiteIcon />}</div>
          </div>
          {showNotice && (
            <div className={`${styles.endsTime} mt-[15px]`}>
              {type === 'foster'
                ? 'All customers outside of the United States are responsible for the customs fees/duties that may be charged by their country for import. This amount may vary depending on your country. We advise looking up your country’s policies before purchasing so you are aware of any potential fees.'
                : 'Users are solely responsible for conducting their own due diligence before engaging in any transaction. All transactions are conducted at your own risk. Any disputes arising from transactions conducted on the platform are to be resolved directly between the buyer and seller.'}
            </div>
          )}
          <div className={`mt-[15px] ${styles.divider}`} />
        </div>
      </div>

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
    </div>
  )
}

export default MerchOrderMain

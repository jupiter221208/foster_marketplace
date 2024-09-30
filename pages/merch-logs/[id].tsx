import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

// next component
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'

// components
import { getOrder, ShipStationShipment } from 'apis/merch'
import { findElement, getFirstUpperString, getLocalDateWithoutTime, isLoggedIn } from 'utils/helpers'
import { getShippingServiceName, getTrackingUrl } from 'utils/merch'
import { getShortAddress } from 'utils/strings'
import { useAuthentication } from 'hooks/useAuthentication'
import Alert from 'components/Alert'
import WriteReviewModal from 'components/Modal/WriteReviewModal'
import MakeShippedModal from 'components/Modal/MakeShippedModal'
import Button from 'components/Button'
import GradientButton from 'components/Button/GradientButton'

// Resources
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import ArrowLeftIcon from 'assets/icons/back-arrow.svg?component'

// Styles
import styles from './id.module.scss'
import OutlineButton from 'components/Button/OutlineButton'

// api
import StoreAPI from 'apis/store'

const MerchDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const { connected, publicKey } = useWallet()
  const { profileInfo } = useAuthentication()
  const type = useSelector<any>(state => state.orderVersion)
  const orderTabType = useSelector<any>(state => state.orderType)
  const [orderData, setOrderData] = useState<any | null>(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const [SSOrder, setSSOrder] = useState(null)
  const [fulfillment, setFulfillment] = useState(null)
  const [orderVersion, setOrderVersion] = useState('v1')
  const [itemDetails, setItemDetails] = useState(null)
  const [list, setList] = useState(null)
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [trackingDetails, setTrackingDetails] = useState<ShipStationShipment>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [isOwn, setIsOwn] = useState(false)
  const [helpTitle, setHelpTitle] = useState('')
  const [helpBody, setHelpBody] = useState('')
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewBody, setReviewBody] = useState('')
  const [commission, setCommission] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showShippedModal, setShowShippedModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])

  const [merchType, setMerchType] = useState('')

  useEffect(() => {
    if (publicKey) setEmailBody()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileInfo, publicKey])

  useEffect(() => {
    if (typeof id != 'string' || !Number.isFinite(parseInt(id))) return
    if (isLoggedIn()) {
      if (parseInt(id) > 1000) {
        setOrderVersion('v2')
        StoreAPI.getOrder(id).then(
          response => {
            setOrderData(response)
          },
          error => {}
        )
      } else {
        setOrderVersion('v1')
        getOrder(id).then(setOrderData)
      }
    }
  }, [id])

  useEffect(() => {
    // dispatch({ type: 'set', isLoading: false })

    if (!orderData) return
    let { order, shipment } = orderData
    let ssorder = orderVersion === 'v1' ? orderData?.ssorder : orderData?.externalOrder
    setSSOrder(ssorder)
    if (orderData?.fulfillments?.length > 0) setFulfillment(orderData?.fulfillments[0])

    if (shipment) setTrackingDetails(shipment)
    if (ssorder?.items.length === 1) {
      let localData = JSON.parse(localStorage.getItem('data'))

      let itemData = ssorder?.items[0]
      let options = itemData.options
      let nftName = findElement(options, 'name', 'nftName')
      let size = findElement(options, 'name', 'size')
      let optionType = findElement(options, 'name', 'type')
      let color = findElement(options, 'name', 'color')
      let apparel = findElement(options, 'name', 'apparel')
      apparel = apparel ? apparel['value'] : ''
      setMerchType(optionType['value'])
      if (optionType['value'] === 'foster' && apparel.length > 0) {
        apparel = apparel.split(' | ')[0]
      }
      let previewUrl = orderVersion === 'v1' ? itemData.imageUrl.split(',')[0] : itemData.imageUrl
      let fosterUrl = findElement(options, 'name', 'fosterUrl')
      let fosterUrlValue = previewUrl ? previewUrl : fosterUrl.value

      if (options) {
        let item = orderData.items && orderData.items[0]
        let itemDetails = {
          userId: item?.userId,
          merchId: item?.id,
          print: nftName ? nftName['value'] : itemData.name,
          description: item?.description,
          quantity: itemData.quantity,
          product: itemData.name,
          size: size ? size['value'] : '',
          color: color ? getFirstUpperString(color['value']) : '',
          apparel: apparel,
        }

        setItemDetails(itemDetails)
      }

      if (fosterUrlValue) {
        setPreviewUrl(fosterUrlValue)
        localData?.forEach(item => {
          if (item.printImageUrl === fosterUrlValue) {
            const index = localData.indexOf(item)
            localData.splice(index, 1)
          }
        })
        localStorage.setItem('data', JSON.stringify(localData))
      } else {
        setPreviewUrl(itemData.imageUrl)
      }
    } else {
      let localData = JSON.parse(localStorage.getItem('data'))

      let itemList = []
      ssorder?.items.forEach(itemData => {
        let options = itemData.options
        let nftName = findElement(options, 'name', 'nftName')
        let size = findElement(options, 'name', 'size')
        let color = findElement(options, 'name', 'color')
        let optionType = findElement(options, 'name', 'type')
        setMerchType(optionType['value'])
        let previewUrl = itemData.imageUrl
        let apparel = findElement(options, 'name', 'apparel')
        apparel = apparel ? apparel['value'] : ''
        if (optionType['value'] === 'foster' && apparel.lenght > 0) {
          apparel = apparel.split(' | ')[0]
        }

        let quantity = itemData.quantity
        if (options) {
          let itemDetails = {
            quantity: quantity,
            print: nftName ? nftName['value'] : itemData.name,
            size: size ? size['value'] : '',
            color: color ? getFirstUpperString(color['value']) : '',
            fosterUrl: previewUrl,
            apparel: apparel,
          }
          itemList.push(itemDetails)
        }
      })
      setList(itemList)

      localData?.forEach(item => {
        itemList?.forEach(otherItem => {
          if (item.printImageUrl === otherItem.fosterUrl) {
            const index = localData.indexOf(item)
            localData.splice(index, 1)
          }
        })
      })

      localStorage.setItem('data', JSON.stringify(localData))
    }

    if (type === 'sales') {
      let commissionData = Object.entries(orderVersion === 'v1' ? order.seller_shares : orderData.paymentSplits).map(
        ([address, value]) => {
          return { address, value }
        }
      )

      commissionData?.forEach(item => {
        if (item.address == publicKey?.toBase58()) {
          const index = commissionData.indexOf(item)
          setCommission(commissionData[index].value)
        }
      })

      setPaymentDetails({
        method: orderVersion === 'v1' ? order.payment_method : orderData.paymentMethod,
        status: 'Complete',
        shipping: orderVersion === 'v1' ? order.shipping_amount.toFixed(2) : ssorder.shippingAmount.toFixed(2),
        tax: orderVersion === 'v1' ? order.tax_amount.toFixed(2) : ssorder.taxAmount.toFixed(2),
        txId: orderVersion === 'v1' ? order.transaction_id : orderData.transactionId,
        paidBy: orderVersion === 'v1' ? order.buyer_address : '',
      })
    } else {
      setPaymentDetails({
        method: orderVersion === 'v1' ? order.payment_method : orderData.paymentMethod,
        status: 'Complete',
        shipping: orderVersion === 'v1' ? order.shipping_amount.toFixed(2) : ssorder.shippingAmount.toFixed(2),
        tax: orderVersion === 'v1' ? order.tax_amount.toFixed(2) : ssorder.taxAmount.toFixed(2),
        txId: orderVersion === 'v1' ? order.transaction_id : orderData.transactionId,
        paidBy: orderVersion === 'v1' ? order.buyer_address : '',
        commission: orderVersion === 'v1' ? order.artist_commission.toFixed(2) : '',
      })
    }

    if (orderVersion === 'v1') setIsOwn(order.buyer_address === publicKey?.toBase58())
    else setIsOwn(true)

    let keys = Object.keys(orderVersion === 'v1' ? order.seller_shares : orderData.paymentSplits)
    if (keys.length > 0) setPaidBy(keys[0])

    let billTo = ssorder.billTo
    setOrderDetails({
      orderNumber: orderVersion === 'v1' ? ssorder.orderNumber : orderData.id,
      orderPlaced: getLocalDateWithoutTime(ssorder.orderDate),
      total: orderVersion === 'v1' ? order.amount.toFixed(2) : ssorder?.amountPaid.toFixed(2),
      shipTo: billTo
        ? {
            street: billTo.street1 + ' ' + (billTo.street2 ?? ''),
            city:
              billTo.city.toLowerCase() === 'blink city'
                ? ''
                : [billTo.city, billTo.state + ' ' + billTo.postalCode, billTo.country].join(', '),
          }
        : { street: '---', city: '---' },
      service: getShippingServiceName(ssorder.requestedShippingService),
      delivery: getLocalDateWithoutTime(ssorder.paymentDate),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData])

  const setEmailBody = () => {
    setHelpTitle(`Foster Studio Support – Order# ${id}`)
    setReviewTitle(`Foster Studio Product Review – Order# ${id}`)
    let helpBody =
      `\nOrder#${id}\n` +
      `${profileInfo?.username ?? ''}\n` +
      `${publicKey}\n\n` +
      'How can we help you with this order?'
    let reviewBody =
      `\nOrder#${id}\n` +
      `${profileInfo?.username ?? ''}\n` +
      `${publicKey}\n\n` +
      'Please use the scale (1-4) below when rating your satisfaction for each question:\n' +
      '1 – Unsatisfied\n' +
      '2 – Needs Improvement\n' +
      '3 – Meets Expectation\n' +
      '4 – Exceeds Expectation\n\n\n' +
      'How satisfied are you with the delivery of the product?\n' +
      'How satisfied are you with the price of the product?\n' +
      'How satisfied are you with the commissions for the sale?\n' +
      'How satisfied are you with the quality of the product?\n' +
      'How satisfied are you with the quality of the art?\n\n' +
      'Additional Information:'
    setHelpBody(helpBody)
    setReviewBody(reviewBody)
  }

  const gotoTrackPage = () => {
    if (trackingDetails !== null && trackingDetails.trackingNumber.length > 0) {
      window.open(getTrackingUrl(trackingDetails))
    }
  }

  const retryPayment = () => {
    router.push(`/orders/${id}`)
  }

  const getShippingMethod = method => {
    if (method === 'gp_plus') {
      return 'GlobalPost Plus Intl'
    } else if (method === 'blinks') {
      if (SSOrder?.orderStatus === 'shipped') return 'BLINKS'
      else return 'Pending Order Creation'
    } else return method
  }

  return (
    <div className="g-container">
      <div className="flex gap-[15px] items-center mt-[30px] lg:mt-[65px]">
        <Link href="/merch-logs">
          <div
            onClick={() => {
              router.push('/merch-logs')
            }}
          >
            <div className="mr-[4px]">
              <ArrowLeftIcon alt="" />
            </div>
          </div>
        </Link>
        <div className={styles.orderTitle}>Order#&nbsp;{id}</div>
      </div>
      {/* Desktop */}
      <div className="w-full lg:block hidden mt-[30px]">
        <div className={styles.orderInfo}>
          <div>
            <div className={styles.infoTitle}>ORDER PLACED</div>
            <div className={styles.infoValue}>
              {!orderDetails ? (
                <div className="skeletonLoaderBasic w-[100px] h-[40px] rounded-[8px]"></div>
              ) : (
                orderDetails?.orderPlaced
              )}
            </div>
          </div>
          <div>
            <div className={styles.infoTitle}>TOTAL</div>
            <div className={styles.infoValue}>
              {!orderDetails ? (
                <div className="skeletonLoaderBasic w-[50px] h-[40px] rounded-[8px]"></div>
              ) : (
                '$' + orderDetails?.total
              )}
            </div>
          </div>
          <div>
            <div className={styles.infoTitle}>SHIP TO</div>

            {!orderDetails ? (
              <div className="skeletonLoaderBasic w-[200px] h-[40px] rounded-[8px] mt-[4px]"></div>
            ) : (
              <div className={styles.infoValue}>
                {orderDetails?.orderNumber === '' && !isOwn ? (
                  'Hidden for Buyer Safety'
                ) : (
                  <div>
                    {orderDetails?.shipTo.street}
                    <br />
                    {orderDetails?.shipTo.city}
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
            <div className={styles.infoTitle}>SHIPPING METHOD</div>
            {!orderDetails ? (
              <div className="skeletonLoaderBasic w-[150px] h-[20px] rounded-full mt-[4px]"></div>
            ) : SSOrder?.orderStatus === 'shipped' ? (
              <div className={styles.infoValue}>{fulfillment ? fulfillment.carrierCode : ''}</div>
            ) : (
              <div className={styles.infoValue}>
                {orderDetails?.orderNumber === '' && !isOwn
                  ? 'Hidden for Buyer Safety'
                  : getShippingMethod(orderDetails?.service)}
              </div>
            )}
          </div>
          <div>
            <div className={styles.infoTitle}>TRACKING NUMBER</div>
            {!orderDetails ? (
              <div className="skeletonLoaderBasic w-[200px] h-[40px] rounded-[8px] mt-[4px]"></div>
            ) : SSOrder?.orderStatus === 'shipped' ? (
              <div className={styles.infoValue}>{fulfillment ? fulfillment.trackingNumber : ''}</div>
            ) : (
              <div className={`${styles.infoValue} text-left`}>
                {orderDetails?.orderNumber === '' && !isOwn
                  ? 'Hidden for Buyer Safety'
                  : trackingDetails === null && connected
                  ? 'Pending Order Creation'
                  : trackingDetails?.trackingNumber}
              </div>
            )}
          </div>
        </div>
        {!orderData ? (
          <div className="w-full flex justify-between mt-[70px]">
            <div className="w-[183px] h-[183px] object-cover">
              <div className="skeletonLoaderBasic w-[183px] h-[183px] rounded-[12px]"></div>
            </div>
            <div className="max-w-[300px]">
              <div className={styles.detailTitle}>Item Details</div>
              <div className="skeletonLoaderBasic w-[200px] h-[20px] rounded-full mt-[15px]"></div>
              <div className="skeletonLoaderBasic w-[100px] h-[20px] rounded-full mt-[9px]"></div>
              <div className="skeletonLoaderBasic w-[250px] h-[20px] rounded-full mt-[9px]"></div>
            </div>

            <div>
              <div className={styles.detailTitle}>Payment Details</div>
              <div className="skeletonLoaderBasic w-[250px] h-[20px] rounded-full mt-[15px]"></div>
              <div className="skeletonLoaderBasic w-[250px] h-[20px] rounded-full mt-[15px]"></div>
              <div className="skeletonLoaderBasic w-[250px] h-[20px] rounded-full mt-[15px]"></div>
              <div className="skeletonLoaderBasic w-[260px] h-[20px] rounded-full mt-[15px]"></div>
              <div className="skeletonLoaderBasic w-[260px] h-[20px] rounded-full mt-[15px]"></div>
              {orderVersion === 'v1' && (
                <div className="skeletonLoaderBasic w-[200px] h-[20px] rounded-full mt-[15px]"></div>
              )}
              {orderVersion === 'v1' && (
                <div className="skeletonLoaderBasic w-[80px] h-[20px] rounded-full mt-[15px]"></div>
              )}

              <div className="skeletonLoaderBasic w-[50px] h-[20px] rounded-full mt-[15px]"></div>
            </div>

            <div>
              {paymentDetails?.txId === null || paymentDetails?.txId.length === 0 ? (
                <div>
                  <GradientButton width={335} height={48} label="Retry Payment" onClick={() => retryPayment()} />
                </div>
              ) : trackingDetails === null ? (
                <div>
                  <Button
                    height="48px"
                    fontSize="18px"
                    fontFamily="Muli-SemiBold"
                    paddingLeft="37px"
                    paddingRight="37px"
                    label="Track package"
                    disabled={true}
                    backgroundColor="transparent"
                    borderColor="var(--follow-btn-border-mobile)"
                    borderWidth={1}
                    color={'rgba(var(--main-bg-color-rgb), 0.5)'}
                    width={335}
                    onClick={() => {}}
                  />
                </div>
              ) : (
                <div>
                  <OutlineButton
                    borderColor="var(--follow-btn-border-mobile)"
                    width={335}
                    label="Track package"
                    onClick={() => {
                      window.location.href = 'mailto:admin@Fostermarketplace.app'
                    }}
                  />
                </div>
              )}

              <div className="mt-[12px]">
                <a
                  href={`mailto:admin@Fostermarketplace.app?${new URLSearchParams({
                    subject: helpTitle,
                    body: helpBody,
                  })}`}
                >
                  <OutlineButton
                    borderColor="var(--follow-btn-border-mobile)"
                    width={335}
                    label="Get help"
                    onClick={() => {
                      window.location.href = 'mailto:admin@Fostermarketplace.app'
                    }}
                  />
                </a>
              </div>

              {orderVersion === 'v2' && (
                <div className="mt-[12px]">
                  {orderTabType === 'sales' ? (
                    <Button
                      height="48px"
                      fontSize="18px"
                      fontFamily="Muli-SemiBold"
                      paddingLeft="37px"
                      paddingRight="37px"
                      label="Write a product review"
                      disabled={true}
                      backgroundColor="transparent"
                      borderColor="var(--follow-btn-border-mobile)"
                      borderWidth={1}
                      color={'rgba(var(--main-bg-color-rgb), 0.5)'}
                      width={335}
                      onClick={() => {}}
                    />
                  ) : (
                    <OutlineButton
                      borderColor="var(--follow-btn-border-mobile)"
                      width={335}
                      label="Write a product review"
                      onClick={() => {
                        setShowReviewModal(true)
                      }}
                    />
                  )}
                </div>
              )}

              {SSOrder?.orderStatus !== 'shipped' && merchType === 'user' && orderTabType === 'sales' && (
                <div className="mt-[12px]">
                  <GradientButton
                    width={335}
                    label="Mark as Shipped"
                    onClick={() => {
                      setShowShippedModal(true)
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ) : SSOrder?.items.length === 1 ? (
          <div className="w-full flex justify-between mt-[70px] gap-[30px]">
            <div className="w-[183px] h-[183px] object-cover">
              {!orderData ? (
                <div className="skeletonLoaderBasic w-[183px] h-[183px] rounded-[12px]"></div>
              ) : (
                <img src={previewUrl} alt="" />
              )}
            </div>
            <div className="max-w-[450px]">
              <div className={styles.detailTitle}>Item Details</div>
              <div className={`mt-[15px] ${styles.detailValue}`}>Name:&nbsp;{itemDetails?.print}</div>
              <div className={`mt-[9px] ${styles.detailValue}`}>Quantity:&nbsp;{itemDetails?.quantity}</div>
              <div className={`mt-[9px] ${styles.detailValue}`}>
                Description:&nbsp;
                {orderDetails?.service === 'blinks'
                  ? itemDetails?.description
                  : itemDetails?.apparel +
                    ' / ' +
                    (itemDetails?.size === 'S' || itemDetails?.size === 'YXS'
                      ? 'Small'
                      : itemDetails?.size === 'M' || itemDetails?.size === 'YS'
                      ? 'Medium'
                      : itemDetails?.size === 'L' || itemDetails?.size === 'YM'
                      ? 'Large'
                      : itemDetails?.size === 'XL' || itemDetails?.size === 'YL'
                      ? 'X-Large'
                      : itemDetails?.size === '2XL' || itemDetails?.size === 'YXL'
                      ? '2X-Large'
                      : '') +
                    ' / ' +
                    itemDetails?.color}
              </div>
            </div>

            <div>
              <div className={styles.detailTitle}>Payment Details</div>
              <div className={`mt-[15px] ${styles.detailValue}`}>Buyer:&nbsp;{SSOrder?.billTo.name}</div>
              <div className={`mt-[15px] ${styles.detailValue}`}>
                Buyer Email:&nbsp;
                <span
                  className={styles.buyerEmail}
                  onClick={() => {
                    window.location.href = 'mailto:' + SSOrder?.customerEmail
                  }}
                >
                  {SSOrder?.customerEmail}
                </span>
              </div>
              <div className={`mt-[15px] ${styles.detailValue}`}>
                Payment&nbsp;Method:&nbsp;{paymentDetails?.method}
              </div>
              <div className={`mt-[15px] ${styles.detailValue}`}>
                Payment&nbsp;Status:&nbsp;{paymentDetails?.txId?.length > 0 ? paymentDetails?.status : 'Pending'}
              </div>
              {merchType !== 'foster' && merchType !== 'user' && (
                <div className={`mt-[15px] ${styles.detailValue}`}>
                  Creator&nbsp;Commission:&nbsp;${paymentDetails?.commission}
                </div>
              )}
              {paymentDetails?.paidBy && (
                <div className={`mt-[15px] ${styles.detailValue}`}>
                  Paid&nbsp;by:&nbsp;{getShortAddress(paymentDetails?.paidBy)}
                </div>
              )}
              <div className={`mt-[15px] ${styles.detailValue}`}>
                Shipping&nbsp;&&nbsp;Handling:&nbsp;${paymentDetails?.shipping}
              </div>

              <div className={`mt-[15px] ${styles.detailValue}`}>Tax:&nbsp;${paymentDetails?.tax}</div>
            </div>

            <div>
              {paymentDetails?.txId === null || paymentDetails?.txId.length === 0 ? (
                <div>
                  <GradientButton width={335} height={48} label="Retry Payment" onClick={() => retryPayment()} />
                </div>
              ) : trackingDetails === null ? (
                <div>
                  <Button
                    height="48px"
                    fontSize="18px"
                    paddingLeft="37px"
                    paddingRight="37px"
                    label="Track package"
                    disabled={true}
                    backgroundColor="transparent"
                    borderColor="var(--follow-btn-border-mobile)"
                    borderWidth={1}
                    color={'rgba(var(--main-bg-color-rgb), 0.5)'}
                    width={335}
                    onClick={() => {
                      window.location.href = 'mailto:admin@Fostermarketplace.app'
                    }}
                  />
                </div>
              ) : (
                <div>
                  <OutlineButton
                    borderColor="var(--follow-btn-border-mobile)"
                    width={335}
                    label="Track package"
                    onClick={() => {
                      window.location.href = 'mailto:admin@Fostermarketplace.app'
                    }}
                  />
                </div>
              )}
              <div className="mt-[12px]">
                <a
                  href={`mailto:admin@Fostermarketplace.app?${new URLSearchParams({
                    subject: helpTitle,
                    body: helpBody,
                  })}`}
                >
                  <OutlineButton
                    borderColor="var(--follow-btn-border-mobile)"
                    width={335}
                    label="Get help"
                    onClick={() => {
                      window.location.href = 'mailto:admin@Fostermarketplace.app'
                    }}
                  />
                </a>
              </div>
              {orderVersion === 'v2' && (
                <div className="mt-[12px]">
                  {orderTabType === 'sales' ? (
                    <Button
                      height="48px"
                      fontSize="18px"
                      fontFamily="Muli-SemiBold"
                      paddingLeft="37px"
                      paddingRight="37px"
                      label="Write a product review"
                      disabled={true}
                      backgroundColor="transparent"
                      borderColor="var(--follow-btn-border-mobile)"
                      borderWidth={1}
                      color={'rgba(var(--main-bg-color-rgb), 0.5)'}
                      width={335}
                      onClick={() => {}}
                    />
                  ) : (
                    <OutlineButton
                      borderColor="var(--follow-btn-border-mobile)"
                      width={335}
                      label="Write a product review"
                      onClick={() => {
                        setShowReviewModal(true)
                      }}
                    />
                  )}
                </div>
              )}

              {SSOrder?.orderStatus !== 'shipped' && merchType === 'user' && orderTabType === 'sales' && (
                <div className="mt-[12px]">
                  <GradientButton
                    width={335}
                    label="Mark as Shipped"
                    onClick={() => {
                      setShowShippedModal(true)
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full flex mt-[70px] gap-20">
            <div className={styles.orderContainer}>
              <div className="flex flex-col gap-[37px] overflow-y-auto">
                {list &&
                  list.map((item, index) => (
                    <div key={index} className="flex flex-row justify-between w-full">
                      <div className="object-cover">
                        <img src={item.fosterUrl} style={{ height: '183px' }} alt="" />
                      </div>
                      <div className="w-1/2 flex flex-col justify-start">
                        <div className={styles.detailTitle}>Item Details</div>
                        <div className={`mt-[20px] ${styles.detailValue}`}>{item?.print}</div>
                        <div className={`mt-[9px] ${styles.detailValue}`}>{item?.color}</div>
                        <div className={`mt-[9px] ${styles.detailValue}`}>
                          {item?.apparel} (
                          {item?.size === 'S' || item?.size === 'YXS'
                            ? 'Small'
                            : item?.size === 'M' || item?.size === 'YS'
                            ? 'Medium'
                            : item?.size === 'L' || item?.size === 'YM'
                            ? 'Large'
                            : item?.size === 'XL' || item?.size === 'YL'
                            ? 'X-Large'
                            : item?.size === '2XL' || item?.size === 'YXL'
                            ? '2X-Large'
                            : ''}
                          )
                        </div>
                        <div className={`mt-[9px] ${styles.detailValue}`}>Qty: {item?.quantity}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex w-1/2 justify-between">
              <div>
                <div className={styles.detailTitle}>Payment Details</div>
                <div className={`mt-[15px] ${styles.detailValue}`}>
                  Payment&nbsp;Method:&nbsp;{paymentDetails?.method}
                </div>
                <div className={`mt-[15px] ${styles.detailValue}`}>
                  Payment&nbsp;Status:&nbsp;{paymentDetails?.txId?.length > 0 ? paymentDetails?.status : 'Pending'}
                </div>
                {type && type === 'sales' ? (
                  <div className={`mt-[15px] ${styles.detailValue}`}>
                    Creator&nbsp;Commission:&nbsp;${commission?.toFixed(2)}
                  </div>
                ) : (
                  <div className={`mt-[15px] ${styles.detailValue}`}>
                    Creator&nbsp;Commission:&nbsp;${paymentDetails?.commission}
                  </div>
                )}

                {paymentDetails?.paidBy && (
                  <div className={`mt-[15px] ${styles.detailValue}`}>
                    Paid&nbsp;by:&nbsp;{getShortAddress(paymentDetails?.paidBy)}
                  </div>
                )}
                <div className={`mt-[15px] ${styles.detailValue}`}>
                  Shipping&nbsp;&&nbsp;Handling:&nbsp;${paymentDetails?.shipping}
                </div>
                <div className={styles.detailValue}>Tax:&nbsp;${paymentDetails?.tax}</div>
              </div>

              <div>
                {paymentDetails?.txId === null || paymentDetails?.txId.length === 0 ? (
                  <div>
                    <GradientButton width={335} height={48} label="Retry Payment" onClick={() => retryPayment()} />
                  </div>
                ) : trackingDetails === null ? (
                  <div>
                    <Button
                      height="48px"
                      fontSize="18px"
                      paddingLeft="37px"
                      paddingRight="37px"
                      label="Track package"
                      disabled={true}
                      backgroundColor="transparent"
                      borderColor="var(--follow-btn-border-mobile)"
                      borderWidth={1}
                      color={'rgba(var(--main-bg-color-rgb), 0.5)'}
                      width={335}
                      onClick={() => {
                        window.location.href = 'mailto:admin@Fostermarketplace.app'
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <OutlineButton
                      borderColor="var(--follow-btn-border-mobile)"
                      width={335}
                      label="Track package"
                      onClick={() => {
                        window.location.href = 'mailto:admin@Fostermarketplace.app'
                      }}
                    />
                  </div>
                )}
                <div className="mt-[12px]">
                  <a
                    href={`mailto:admin@Fostermarketplace.app?${new URLSearchParams({
                      subject: helpTitle,
                      body: helpBody,
                    })}`}
                  >
                    <OutlineButton
                      borderColor="var(--follow-btn-border-mobile)"
                      width={335}
                      label="Get help"
                      onClick={() => {
                        window.location.href = 'mailto:admin@Fostermarketplace.app'
                      }}
                    />
                  </a>
                </div>

                {orderVersion === 'v2' && (
                  <div className="mt-[12px]">
                    {orderTabType === 'sales' ? (
                      <Button
                        height="48px"
                        fontSize="18px"
                        fontFamily="Muli-SemiBold"
                        paddingLeft="37px"
                        paddingRight="37px"
                        label="Write a product review"
                        disabled={true}
                        backgroundColor="transparent"
                        borderColor="var(--follow-btn-border-mobile)"
                        borderWidth={1}
                        color={'rgba(var(--main-bg-color-rgb), 0.5)'}
                        width={335}
                        onClick={() => {}}
                      />
                    ) : (
                      <OutlineButton
                        borderColor="var(--follow-btn-border-mobile)"
                        width={335}
                        label="Write a product review"
                        disabled={orderTabType === 'sales'}
                        onClick={() => {
                          setShowReviewModal(true)
                        }}
                      />
                    )}
                  </div>
                )}

                {SSOrder?.orderStatus !== 'shipped' && merchType === 'user' && orderTabType === 'sales' && (
                  <div className="mt-[12px]">
                    <GradientButton
                      width={335}
                      label="Mark as Shipped"
                      onClick={() => {
                        setShowShippedModal(true)
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="w-full flex justify-center mt-[75px]">
          <div className={styles.infoValue}>
            Shipping Status: {SSOrder?.orderStatus === 'shipped' ? 'Shipped' : 'Awaiting Shipment'}
          </div>
        </div>
        <div className="w-full flex justify-center mt-[75px]">
          <div className={styles.separator}></div>
        </div>
      </div>
      {/* Mobile */}
      <div className="w-full lg:hidden block mt-[30px]">
        {!orderData ? (
          <div className="skeletonLoaderBasic w-full h-[120px] rounded-[12px]"></div>
        ) : SSOrder?.items.length === 1 ? (
          <div className={styles.tableColor}>
            <div className="w-[auto]">
              <div className="w-[110px] h-auto object-cover">
                <img src={previewUrl} alt="" />
              </div>
            </div>
            <div className="w-full text-left ml-[22px]">
              <div className={styles.detailValue}>{itemDetails?.print}</div>
              <div className={styles.detailValue}>
                {itemDetails?.apparel.slice(0, 40)}&nbsp;
                {`(${
                  itemDetails?.size === 'S' || itemDetails?.size === 'YXS'
                    ? 'Small'
                    : itemDetails?.size === 'M' || itemDetails?.size === 'YS'
                    ? 'Medium'
                    : itemDetails?.size === 'L' || itemDetails?.size === 'YM'
                    ? 'Large'
                    : itemDetails?.size === 'XL' || itemDetails?.size === 'YL'
                    ? 'X-Large'
                    : itemDetails?.size === '2XL' || itemDetails?.size === 'YXL'
                    ? '2X-Large'
                    : ''
                })`}
              </div>
              <div className={styles.detailValue}>{itemDetails?.color}</div>
              <div className={styles.detailValue}>Qty: {itemDetails?.quantity}</div>
              <div className="mt-[20px]">
                {!orderDetails ? (
                  <div className="skeletonLoaderBasic w-[40px] h-[20px] rounded-full mt-[6px]"></div>
                ) : (
                  <div className={styles.priceValue}>${orderDetails ? orderDetails.total : '---'}</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.mobileContainer}>
            <div className="flex flex-col overflow-y-auto">
              {list &&
                list.map((item, index) => (
                  <div key={index} className={styles.tableColor}>
                    <div className="w-full flex">
                      <div className="w-[110px] h-auto object-cover">
                        <img src={item.fosterUrl} alt="" />
                      </div>
                    </div>
                    <div className="w-full text-left ml-[22px]">
                      <div className={styles.detailValue}>&nbsp;{item?.print}</div>
                      <div className={styles.detailValue}>
                        &nbsp;{item?.apparel.slice(30)}&nbsp;
                        {`(${
                          item?.size === 'S' || item?.size === 'YXS'
                            ? 'Small'
                            : item?.size === 'M' || item?.size === 'YS'
                            ? 'Medium'
                            : item?.size === 'L' || item?.size === 'YM'
                            ? 'Large'
                            : item?.size === 'XL' || item?.size === 'YL'
                            ? 'X-Large'
                            : item?.size === '2XL' || item?.size === 'YXL'
                            ? '2X-Large'
                            : ''
                        })`}
                      </div>
                      <div className={styles.detailValue}>&nbsp;{item?.color}</div>
                      <div className={styles.detailValue}>&nbsp;Qty: {item?.quantity}</div>
                      <div className="mt-[20px]">
                        {!orderDetails ? (
                          <div className="skeletonLoaderBasic w-[40px] h-[20px] rounded-full mt-[6px]"></div>
                        ) : (
                          <div className={styles.priceValue}>${orderDetails ? orderDetails.total : '---'}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className={styles.orderInfoBG}>
          <div className={styles.orderSummary}>Order Summary</div>

          <div className="mt-[25px]">
            <div className={styles.infoTitle}>Order Date</div>
            {!orderDetails ? (
              <div className="skeletonLoaderBasic w-[80px] h-[20px] rounded-full mt-[6px]"></div>
            ) : (
              <div className={styles.infoValue}>{orderDetails?.orderPlaced}</div>
            )}
          </div>

          <div className="mt-[20px]">
            <div className={styles.infoTitle}>Total</div>
            {!orderDetails ? (
              <div className="skeletonLoaderBasic w-[40px] h-[20px] rounded-full mt-[6px]"></div>
            ) : (
              <div className={styles.infoValue}>${orderDetails ? orderDetails.total : '---'}</div>
            )}
          </div>

          <div className="w-full mt-[20px]">
            <div className="text-start">
              <div className={styles.infoTitle}>Ship to</div>
              {!orderDetails ? (
                <div className="skeletonLoaderBasic w-[150px] h-[20px] rounded-full mt-[4px]"></div>
              ) : (
                <div>
                  {orderDetails?.orderNumber === '' && !isOwn ? (
                    <div className={styles.infoValue}>{'Hidden for Buyer Safety'}</div>
                  ) : (
                    <div>
                      <div className={styles.infoValue}>{orderDetails?.shipTo.street}</div>
                      <div className={styles.infoValue}>{orderDetails?.shipTo.city}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="w-full mt-[20px]">
            <div className="text-start">
              <div className={styles.infoTitle}>Shipping Method</div>
              {!orderDetails ? (
                <div className="skeletonLoaderBasic w-[150px] h-[20px] rounded-full mt-[4px]"></div>
              ) : SSOrder?.orderStatus === 'shipped' ? (
                <div className={styles.infoValue}>{fulfillment ? fulfillment.carrierCode : ''}</div>
              ) : (
                <div className={styles.infoValue}>
                  {orderDetails?.orderNumber === '' && !isOwn
                    ? 'Hidden for Buyer Safety'
                    : getShippingMethod(orderDetails?.service)}
                </div>
              )}
            </div>
          </div>

          <div className="w-full mt-[20px]">
            <div className={styles.infoTitle}>Tracking Number</div>
            {!orderDetails ? (
              <div className="skeletonLoaderBasic w-[200px] h-[40px] rounded-[8px] mt-[4px]"></div>
            ) : SSOrder?.orderStatus === 'shipped' ? (
              <div className={styles.infoValue}>{fulfillment ? fulfillment.trackingNumber : ''}</div>
            ) : (
              <div className={`${styles.infoValue} text-left`}>
                {orderDetails?.orderNumber === '' && !isOwn
                  ? 'Hidden for Buyer Safety'
                  : trackingDetails === null && connected
                  ? 'Pending Order Creation'
                  : trackingDetails?.trackingNumber}
              </div>
            )}
          </div>
        </div>

        <div className={styles.orderInfoBG}>
          <div className={styles.orderSummary}>Payment&nbsp;Details</div>

          <div className="w-full mt-[20px]">
            <div className={styles.infoTitle}>Payment Method</div>

            {!orderDetails ? (
              <div className="skeletonLoaderBasic w-[170px] h-[20px] rounded-full mt-[8px]"></div>
            ) : (
              <div className={styles.infoValue}>{paymentDetails?.method}</div>
            )}
          </div>

          {merchType !== 'foster' && merchType !== 'user' && (
            <div className="w-full mt-[20px]">
              <div className={styles.infoTitle}>Creator&nbsp;Commission</div>
              {type && type === 'sales' ? (
                !orderDetails ? (
                  <div className="skeletonLoaderBasic w-[220px] h-[20px] rounded-full mt-[8px]"></div>
                ) : (
                  <div className={`mt-[15px] ${styles.infoValue}`}>${commission?.toFixed(2)}</div>
                )
              ) : !orderDetails ? (
                <div className="skeletonLoaderBasic w-[220px] h-[20px] rounded-full mt-[8px]"></div>
              ) : (
                <div className={`mt-[15px] ${styles.infoValue}`}>${paymentDetails?.commission}</div>
              )}
            </div>
          )}

          {paymentDetails?.paidBy && (
            <div className="w-full mt-[20px]">
              <div className={styles.infoTitle}>Paid&nbsp;By</div>
              {!orderDetails ? (
                <div className="skeletonLoaderBasic w-[150px] h-[20px] rounded-full mt-[8px]"></div>
              ) : (
                <div className={styles.infoValue}>{getShortAddress(paymentDetails?.paidBy)}</div>
              )}
            </div>
          )}

          <div className="w-full mt-[20px]">
            <div className={styles.infoTitle}>Shipping&nbsp;&&nbsp;Handling</div>
            {!orderDetails ? (
              <div className="skeletonLoaderBasic w-[220px] h-[20px] rounded-full mt-[8px]"></div>
            ) : (
              <div className={styles.infoValue}>${paymentDetails?.shipping}</div>
            )}
          </div>

          <div className="w-full mt-[20px]">
            <div className={styles.infoTitle}>Tax</div>
            {!orderDetails ? (
              <div className="skeletonLoaderBasic w-[80px] h-[20px] rounded-full mt-[8px]"></div>
            ) : (
              <div className={styles.infoValue}>${paymentDetails?.tax}</div>
            )}
          </div>
        </div>
        <div className="w-full mt-[30px] flex justify-center">
          <div className="flex">
            <div className={styles.shipStatusTitle}>
              Shipping Status:&nbsp;
              <div className={styles.shipStatusValue}>
                {SSOrder?.orderStatus === 'shipped' ? 'Shipped' : 'Awaiting Shipment'}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mt-[30px] mb-[100px] flex justify-center">
          <div>
            {paymentDetails?.txId === null || paymentDetails?.txId.length === 0 ? (
              <div>
                <GradientButton width={335} height={48} label="Retry Payment" onClick={() => retryPayment()} />
              </div>
            ) : trackingDetails === null ? (
              <div>
                <Button
                  height="48px"
                  fontSize="16px"
                  paddingLeft="37px"
                  paddingRight="37px"
                  label="Track package"
                  disabled={true}
                  backgroundColor="transparent"
                  borderColor="var(--follow-btn-border-mobile)"
                  borderWidth={1}
                  color={'rgba(var(--main-bg-color-rgb), 0.5)'}
                  width={335}
                  onClick={() => {
                    window.location.href = 'mailto:admin@Fostermarketplace.app'
                  }}
                />
              </div>
            ) : (
              <div>
                <OutlineButton
                  borderColor="var(--follow-btn-border-mobile)"
                  width={335}
                  label="Track package"
                  onClick={() => {
                    window.location.href = 'mailto:admin@Fostermarketplace.app'
                  }}
                />
              </div>
            )}

            <div className="mt-[12px]">
              <Button
                height="48px"
                fontSize="16px"
                paddingLeft="37px"
                paddingRight="37px"
                label="Get help"
                backgroundColor="transparent"
                borderColor="var(--follow-btn-border-mobile)"
                borderWidth={1}
                color={'var(--text-gray-200-color)'}
                width={335}
                onClick={() => {
                  window.location.href = 'mailto:admin@Fostermarketplace.app'
                }}
              />
            </div>

            {orderVersion === 'v2' && (
              <div className="mt-[12px]">
                {orderTabType === 'sales' ? (
                  <Button
                    height="48px"
                    fontSize="16px"
                    fontFamily="Muli-SemiBold"
                    paddingLeft="37px"
                    paddingRight="37px"
                    label="Write a product review"
                    disabled={true}
                    backgroundColor="transparent"
                    borderColor="var(--follow-btn-border-mobile)"
                    borderWidth={1}
                    color={'rgba(var(--main-bg-color-rgb), 0.5)'}
                    width={335}
                    onClick={() => {}}
                  />
                ) : (
                  <Button
                    height="48px"
                    fontSize="16px"
                    paddingLeft="37px"
                    paddingRight="37px"
                    label="Write a product review"
                    backgroundColor="transparent"
                    borderColor="var(--follow-btn-border-mobile)"
                    borderWidth={1}
                    color={'var(--text-gray-200-color)'}
                    width={335}
                    onClick={() => {
                      setShowReviewModal(true)
                    }}
                  />
                )}
              </div>
            )}

            {SSOrder?.orderStatus !== 'shipped' && merchType === 'user' && orderTabType === 'sales' && (
              <div className="mt-[12px]">
                <GradientButton
                  width={335}
                  label="Mark as Shipped"
                  onClick={() => {
                    setShowShippedModal(true)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <WriteReviewModal
        open={showReviewModal}
        previewUrl={previewUrl}
        itemDetails={itemDetails}
        onClose={() => setShowReviewModal(false)}
        onSuccess={() => {
          setAlertData([
            {
              id: 0,
              title: 'Review Submitted!',
              description: 'Your review has been successfully sent to the seller',
              type: 'success',
            },
          ])
          setShowAlert(true)
        }}
      />

      <MakeShippedModal
        open={showShippedModal}
        orderId={orderData?.id}
        onClose={() => setShowShippedModal(false)}
        onSuccess={() => router.reload()}
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

export default MerchDetail

MerchDetail.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}

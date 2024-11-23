import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// next component
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'

// components
import { getOrder } from 'apis/merch'
import { findElement, getFirstUpperString, getLocalDateWithoutTime, isLoggedIn } from 'utils/helpers'
import { getShippingServiceName } from 'utils/merch'
import { useAuthentication } from 'hooks/useAuthentication'
import Alert from 'components/Alert'
import WriteReviewModal from 'components/Modal/WriteReviewModal'
import MakeShippedModal from 'components/Modal/MakeShippedModal'

// Resources
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import ArrowLeftIcon from 'assets/icons/back-arrow.svg?component'
import ArrowRightIcon from 'assets/icons/arrow-right-white-9x15.svg?component'
import ArrowDownIcon from 'assets/icons/down-arrow-icon-white.svg?component'

// Styles
import styles from './id.module.scss'

// api
import StoreAPI from 'apis/store'
import OrderListSection from 'components/pages/MerchLogs/OrderListSection'
import ShipToDropDown from 'components/pages/MerchLogs/ShipToDropDown'
import ShippingDetailDropDown from 'components/pages/MerchLogs/ShippingDetailDropDown'
import PaymentDetailDropDown from 'components/pages/MerchLogs/PaymentDetailDropDown'
import { getExplorerUrl } from 'utils/explorer'
import { useConnection } from '@solana/wallet-adapter-react'

const MerchDetail = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { id } = router.query
  const { connection } = useConnection()
  const { connected, publicKey } = useWallet()
  const { profileInfo } = useAuthentication()
  const [orderTabType, setOrderTabType] = useState('buyer')
  const [orderData, setOrderData] = useState<any | null>(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const [SSOrder, setSSOrder] = useState(null)
  const [fulfillment, setFulfillment] = useState(null)
  const [orderVersion, setOrderVersion] = useState('v1')
  const [itemDetails, setItemDetails] = useState(null)
  const [list, setList] = useState(null)
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [trackingDetails, setTrackingDetails] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [isOwn, setIsOwn] = useState(false)
  const [helpTitle, setHelpTitle] = useState('')
  const [helpBody, setHelpBody] = useState('')
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewBody, setReviewBody] = useState('')
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showShippedModal, setShowShippedModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [openOrderDetails, setOpenOrderDetails] = useState(false)
  const [openPaymentDetails, setOpenPaymentDetails] = useState(false)
  const [openShippingDetails, setOpenShippingDetails] = useState(false)

  const [merchType, setMerchType] = useState('')

  useEffect(() => {
    if (publicKey) setEmailBody()

    if (typeof id != 'string' || !Number.isFinite(parseInt(id))) return

    if (parseInt(id) > 1000) {
      if (profileInfo?.id == orderData?.userId) setOrderTabType('buyer')
      else setOrderTabType('seller')
    } else {
      setOrderTabType('buyer')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileInfo, publicKey, orderData])

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
    if (!orderData) return
    let { order, shipments, fulfillments } = orderData
    let ssorder = orderVersion === 'v1' ? orderData?.ssorder : orderData?.externalOrder
    setSSOrder(ssorder)
    if (orderData?.fulfillments?.length > 0) setFulfillment(orderData?.fulfillments[0])

    if (shipments && shipments.lenght > 0) setTrackingDetails(shipments)
    else if (fulfillments && fulfillments.length > 0) setTrackingDetails(fulfillments)

    let localData = JSON.parse(localStorage.getItem(orderVersion === 'v1' ? 'cart_v1' : 'cart_v2'))

    let itemList = []

    if (ssorder?.items?.length === 1) {
      let itemData = ssorder?.items[0]
      let options = itemData.options
      let nftName = findElement(options, 'name', 'nftName')
      let size = findElement(options, 'name', 'size')
      let optionType = findElement(options, 'name', 'type')
      let color = findElement(options, 'name', 'color')
      let apparel = findElement(options, 'name', 'apparel')
      apparel = apparel ? apparel['value'] : ''
      setMerchType(optionType['value'])
      if (optionType['value'] === 'foster' && apparel?.length > 0) {
        apparel = apparel.split(' | ')[0]
      }
      let previewUrl = orderVersion === 'v1' ? itemData.imageUrl?.split(',')[0] : itemData.imageUrl
      let fosterUrl = findElement(options, 'name', 'fosterUrl')
      let fosterUrlValue = previewUrl ? previewUrl : fosterUrl.value

      let item_details
      if (options) {
        let item = orderData.items && orderData.items[0]
        item_details = {
          userId: item?.userId,
          merchId: item?.id,
          type: optionType['value'],
          print: nftName ? nftName['value'] : itemData?.name,
          description: item?.description,
          quantity: itemData.quantity,
          product: itemData?.name,
          size: size ? size['value'] : '',
          color: color ? getFirstUpperString(color['value']) : '',
          apparel: apparel,
          price: orderVersion === 'v1' ? itemData.unitPrice : item?.sellingPrice / 100,
        }
        setItemDetails(item_details)
      }

      let preview_url
      if (fosterUrlValue) {
        preview_url = fosterUrlValue

        if (localData?.length > 0) {
          localData?.forEach(item => {
            if (item.version === 'v2') {
              if (item.merchList[0].url === fosterUrlValue && item.data.quantity === itemData.quantity) {
                const index = localData.indexOf(item)
                localData.splice(index, 1)
              }
            } else {
              if (item.printImageUrl === fosterUrlValue) {
                const index = localData.indexOf(item)
                localData.splice(index, 1)
              }
            }
          })
          localStorage.setItem(orderVersion === 'v1' ? 'cart_v1' : 'cart_v2', JSON.stringify(localData))
          dispatch({ type: 'set', cartUpdated: true })
        }
      } else {
        preview_url = itemData.imageUrl
      }
      setPreviewUrl(preview_url)

      itemList.push({ ...item_details, fosterUrl: preview_url })
      setList(itemList)
    } else {
      ssorder?.items.forEach((itemData, index) => {
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
          orderData.items.forEach(orderDataItem => {
            if (orderDataItem.id.toString() === itemData.lineItemKey) {
              let itemDetails = {
                userId: orderDataItem.userId,
                merchId: orderDataItem.id,
                quantity: quantity,
                print: nftName ? nftName['value'] : itemData?.name,
                type: optionType['value'],
                size: size ? size['value'] : '',
                color: color ? getFirstUpperString(color['value']) : '',
                fosterUrl: previewUrl,
                apparel: apparel,
                price: itemData.unitPrice,
              }
              itemList.push(itemDetails)
            }
          })
        }
      })
      setList(itemList)

      if (localData?.length > 0) {
        for (let index = localData?.length - 1; index >= 0; index--) {
          let item = localData[index]

          for (let idx = 0; idx < itemList?.length; idx++) {
            let otherItem = itemList[idx]

            if (item.version === 'v2') {
              if (item.merchList[0].url === otherItem.fosterUrl && item.data.quantity === otherItem.quantity) {
                const index = localData.indexOf(item)
                localData.splice(index, 1)
                break
              }
            } else {
              if (item.printImageUrl === otherItem.fosterUrl) {
                const index = localData.indexOf(item)
                localData.splice(index, 1)
                break
              }
            }
          }
        }

        localStorage.setItem(orderVersion === 'v1' ? 'cart_v1' : 'cart_v2', JSON.stringify(localData))
        dispatch({ type: 'set', cartUpdated: true })
      }
    }

    //   let commissionData = Object.entries(orderVersion === 'v1' ? order.seller_shares : orderData.paymentSplits).map(
    //     ([address, value]) => {
    //       return { address, value }
    //     }
    //   )

    //   commissionData?.forEach(item => {
    //     if (item.address == publicKey?.toBase58()) {
    //       const index = commissionData.indexOf(item)
    //       setCommission(commissionData[index].value)
    //     }
    //   })

    setPaymentDetails({
      method: orderVersion === 'v1' ? order.payment_method : orderData.paymentMethod,
      status: 'Complete',
      shipping: orderVersion === 'v1' ? order.shipping_amount.toFixed(2) : ssorder.shippingAmount.toFixed(2),
      tax: orderVersion === 'v1' ? order.tax_amount.toFixed(2) : ssorder.taxAmount.toFixed(2),
      txId: orderVersion === 'v1' ? order.transaction_id : orderData.transactionId,
      paidBy: orderVersion === 'v1' ? order.buyer_address : '',
    })
    // }

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
            country: billTo.city.toLowerCase() === 'blink city' ? '' : billTo.country,
            city:
              billTo.city.toLowerCase() === 'blink city'
                ? ''
                : [billTo.city, billTo.state + ' ' + billTo.postalCode].join(', '),
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

  const retryPayment = () => {
    router.push(`/orders/${id}`)
  }

  const getShippingMethod = method => {
    if (method === undefined) return 'Awaiting Shipment'
    else if (method === 'Other') return 'Not Specified'
    else if (method === 'gp_plus') {
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
          <div className="w-full flex lg:gap-[50px] xl:gap-[85px]">
            <div>
              <div className={styles.infoTitle}>Order Placed</div>
              <div className={styles.infoValue}>
                {!orderDetails ? (
                  <div className="skeletonLoaderBasic w-[90px] h-[22px] rounded-[8px]"></div>
                ) : (
                  orderDetails?.orderPlaced
                )}
              </div>
            </div>
            <div>
              <div className={styles.infoTitle}>Total</div>
              <div className={styles.infoValue}>
                {!orderDetails ? (
                  <div className="skeletonLoaderBasic w-[35px] h-[22px] rounded-[8px]"></div>
                ) : (
                  '$' + orderDetails?.total
                )}
              </div>
            </div>
            <div>
              <div className={styles.infoTitle}>Shipping Status</div>
              <div className={styles.infoValue}>
                {!orderDetails ? (
                  <div className="skeletonLoaderBasic w-[150px] h-[22px] rounded-[8px]"></div>
                ) : SSOrder?.orderStatus === 'shipped' ? (
                  'Shipped'
                ) : (
                  'Awaiting Shipment'
                )}
              </div>
            </div>
            {orderTabType === 'seller' && merchType === 'foster' ? (
              <></>
            ) : (
              <div>
                {!orderDetails ? (
                  <div>
                    <div className={styles.infoTitle}>Ship to</div>
                    <div className="skeletonLoaderBasic w-[120px] h-[22px] rounded-[8px] mt-[8px]"></div>
                  </div>
                ) : SSOrder?.billTo ? (
                  <div>
                    <div className={styles.infoTitle}>Ship to</div>
                    <ShipToDropDown
                      name={SSOrder?.billTo?.name}
                      address={
                        orderDetails?.orderNumber === '' && !isOwn ? (
                          'Hidden for Buyer Safety'
                        ) : orderDetails?.shipTo.street === '---' ? (
                          'Hidden for Buyer Safety'
                        ) : (
                          <div>
                            {orderDetails?.shipTo.street}
                            <br />
                            {orderDetails?.shipTo.city}
                            <br />
                            {orderDetails?.shipTo.country}
                          </div>
                        )
                      }
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
          <div>
            <div className={styles.orderNumber}>Order# {id}</div>
            <div className="flex gap-[14px] mt-[8px] items-center">
              {orderTabType === 'seller' && merchType === 'foster' ? (
                <></>
              ) : (
                <div className="flex gap-[14px] items-center">
                  <ShippingDetailDropDown
                    tracking={
                      orderDetails?.orderNumber === '' && !isOwn
                        ? 'Hidden for Buyer Safety'
                        : trackingDetails === null && connected
                        ? 'Pending Order Creation'
                        : trackingDetails
                        ? trackingDetails[0].trackingNumber
                        : 'Pending Order Creation'
                    }
                    shipping={
                      trackingDetails
                        ? getShippingMethod(trackingDetails[0].carrierCode)
                        : orderDetails?.orderNumber === '' && !isOwn
                        ? 'Hidden for Buyer Safety'
                        : 'Awaiting Shipment'
                    }
                  />
                  <div className={styles.border} />
                </div>
              )}
              <PaymentDetailDropDown SSOrder={SSOrder} paymentDetails={paymentDetails} />
            </div>
          </div>
        </div>

        <OrderListSection
          SSOrder={SSOrder}
          setShowShippedModal={setShowShippedModal}
          orderData={orderData}
          orderDetails={orderDetails}
          orderVersion={orderVersion}
          merchType={merchType}
          paymentDetails={paymentDetails}
          trackingDetails={trackingDetails}
          helpTitle={helpTitle}
          helpBody={helpBody}
          orderTabType={orderTabType}
          setShowReviewModal={setShowReviewModal}
          orderList={list}
          retryPayment={retryPayment}
        />

        <div className="w-full h-[100px]" />
      </div>
      {/* Mobile */}
      <div className="w-full lg:hidden block mt-[30px]">
        {openOrderDetails ? (
          <div className={styles.orderInfoBG} onClick={() => setOpenOrderDetails(false)}>
            <div className="w-full flex justify-between items-center">
              <div className={styles.orderSummary}>Order&nbsp;Details</div>
              <ArrowDownIcon />
            </div>
            <div className="mt-[19px]">
              <div className={styles.infoTitle}>Order Placed</div>
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

            <div className="mt-[20px]">
              <div className={styles.infoTitle}>Shipping Status</div>
              <div className={styles.infoValue}>
                {!orderDetails ? (
                  <div className="skeletonLoaderBasic w-[100px] h-[20px] rounded-full"></div>
                ) : SSOrder?.orderStatus === 'shipped' ? (
                  'Shipped'
                ) : (
                  'Awaiting Shipment'
                )}
              </div>
            </div>

            {SSOrder?.billTo && (
              <div className="w-full mt-[20px]">
                <div className="text-start">
                  <div className={styles.infoTitle}>Ship to</div>
                  {!orderDetails ? (
                    <div className="skeletonLoaderBasic w-[150px] h-[20px] rounded-full mt-[4px]"></div>
                  ) : (
                    <div>
                      <div className={styles.infoValue}>{SSOrder?.billTo?.name}</div>

                      {orderDetails?.orderNumber === '' && !isOwn ? (
                        <div className={styles.infoValue}>{'Hidden for Buyer Safety'}</div>
                      ) : orderDetails?.shipTo.street === '---' ? (
                        <div className={styles.infoValue}>{'Hidden for Buyer Safety'}</div>
                      ) : (
                        <div>
                          <div className={styles.infoValue}>{orderDetails?.shipTo.street}</div>
                          <div className={styles.infoValue}>{orderDetails?.shipTo.city}</div>
                          <div className={styles.infoValue}>{orderDetails?.shipTo.country}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.orderInfoBG} onClick={() => setOpenOrderDetails(true)}>
            <div className="w-full flex justify-between items-center">
              <div className={styles.orderSummary}>Order&nbsp;Details</div>
              <ArrowRightIcon />
            </div>
          </div>
        )}

        {openPaymentDetails ? (
          <div className={styles.orderInfoBG}>
            <div
              className="w-full flex justify-between items-center mb-[15px]"
              onClick={() => setOpenPaymentDetails(false)}
            >
              <div className={styles.orderSummary}>Payment&nbsp;Details</div>
              <ArrowDownIcon />
            </div>

            {SSOrder?.billTo && (
              <div className="w-full flex  items-center">
                <div className={styles.infoPayment}>Buyer:&nbsp;</div>

                {!orderDetails ? (
                  <div className="skeletonLoaderBasic w-[100px] h-[20px] rounded-full mt-[6px]"></div>
                ) : (
                  <div className={styles.infoPayment}>{SSOrder?.billTo?.name}</div>
                )}
              </div>
            )}

            {SSOrder?.billTo && (
              <div className="w-full flex items-center mt-[2px]">
                <div className={styles.infoPayment}>Buyer&nbsp;Email:&nbsp;</div>

                {!orderDetails ? (
                  <div className="skeletonLoaderBasic w-[100px] h-[20px] rounded-full mt-[6px]"></div>
                ) : (
                  <div
                    className={styles.infoPayment}
                    onClick={() => {
                      window.location.href = 'mailto:' + SSOrder?.customerEmail
                    }}
                  >
                    {SSOrder?.customerEmail}
                  </div>
                )}
              </div>
            )}

            <div className="w-full flex mt-[2px] items-center">
              <div className={styles.infoPayment}>Payment Method:&nbsp;</div>

              {!orderDetails ? (
                <div className="skeletonLoaderBasic w-[100px] h-[20px] rounded-full mt-[6px]"></div>
              ) : (
                <div className={styles.infoPayment}>{paymentDetails?.method}</div>
              )}
            </div>

            <div className="w-full flex items-center mt-[2px]">
              <div className={styles.infoPayment}>Payment&nbsp;Status:&nbsp;</div>
              {!orderDetails ? (
                <div className="skeletonLoaderBasic w-[100px] h-[20px] rounded-full mt-[6px]"></div>
              ) : (
                <div className={styles.infoPayment}>
                  {paymentDetails?.txId?.length > 0 ? paymentDetails?.status : 'Pending'}
                </div>
              )}
            </div>

            <div className="w-full flex items-center mt-[2px]">
              <div className={styles.infoPayment}>Shipping&nbsp;&&nbsp;Handling:&nbsp;</div>
              {!orderDetails ? (
                <div className="skeletonLoaderBasic w-[100px] h-[20px] rounded-full mt-[6px]"></div>
              ) : (
                <div className={styles.infoPayment}>${paymentDetails?.shipping}</div>
              )}
            </div>

            <div className="w-full flex items-center mt-[2px]">
              <div className={styles.infoPayment}>Tax:&nbsp;</div>
              {!orderDetails ? (
                <div className="skeletonLoaderBasic w-[100px] h-[20px] rounded-full mt-[6px]"></div>
              ) : (
                <div className={styles.infoPayment}>${paymentDetails?.tax}</div>
              )}
            </div>

            <div
              className={styles.viewTransaction}
              onClick={() => {
                window.open(getExplorerUrl(connection.rpcEndpoint, paymentDetails?.txId, 'tx'))
              }}
            >
              View Transaction
            </div>
          </div>
        ) : (
          <div className={styles.orderInfoBG} onClick={() => setOpenPaymentDetails(true)}>
            <div className="w-full flex justify-between items-center">
              <div className={styles.orderSummary}>Payment&nbsp;Details</div>
              <ArrowRightIcon />
            </div>
          </div>
        )}

        {orderTabType === 'seller' && merchType === 'foster' ? (
          <></>
        ) : openShippingDetails ? (
          <div className={styles.orderInfoBG} onClick={() => setOpenShippingDetails(false)}>
            <div className="w-full flex justify-between items-center">
              <div className={styles.orderSummary}>Shpping&nbsp;Details</div>
              <ArrowDownIcon />
            </div>
            <div className="w-full flex mt-[15px] items-center">
              <div className={styles.infoPayment}>Tracking:&nbsp;#&nbsp;</div>

              {!orderDetails ? (
                <div className="skeletonLoaderBasic w-[100px] h-[20px] rounded-full mt-[6px]"></div>
              ) : (
                <div className={styles.infoPayment}>
                  {orderDetails?.orderNumber === '' && !isOwn
                    ? 'Hidden for Buyer Safety'
                    : trackingDetails === null && connected
                    ? 'Pending Order Creation'
                    : trackingDetails
                    ? trackingDetails[0].trackingNumber
                    : 'Pending Order Creation'}
                </div>
              )}
            </div>
            <div className="w-full flex mt-[2px] items-center">
              <div className={styles.infoPayment}>Shipping&nbsp;Carrier:&nbsp;</div>

              {!orderDetails ? (
                <div className="skeletonLoaderBasic w-[100px] h-[20px] rounded-full mt-[6px]"></div>
              ) : (
                <div className={styles.infoPayment}>
                  {trackingDetails
                    ? getShippingMethod(trackingDetails[0].carrierCode)
                    : orderDetails?.orderNumber === '' && !isOwn
                    ? 'Hidden for Buyer Safety'
                    : 'Awaiting Shipment'}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.orderInfoBG} onClick={() => setOpenShippingDetails(true)}>
            <div className="w-full flex justify-between items-center">
              <div className={styles.orderSummary}>Shpping&nbsp;Details</div>
              <ArrowRightIcon />
            </div>
          </div>
        )}

        <OrderListSection
          SSOrder={SSOrder}
          setShowShippedModal={setShowShippedModal}
          orderData={orderData}
          orderDetails={orderDetails}
          orderVersion={orderVersion}
          merchType={merchType}
          paymentDetails={paymentDetails}
          trackingDetails={trackingDetails}
          helpTitle={helpTitle}
          helpBody={helpBody}
          orderTabType={orderTabType}
          setShowReviewModal={setShowReviewModal}
          orderList={list}
          retryPayment={retryPayment}
        />

        <div className="w-full h-[100px]" />
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

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// next component
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'

// Resources
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import ArrowLeftIcon from 'assets/icons/arrow-left-smallest.svg?component'
import ArrowLeftIconMobile from 'assets/icons/arrow-left-medium-mobile.svg?component'

// Styles
import styles from './id.module.scss'
import OutlineButton from 'components/Button/OutlineButton'

// api
import { getOrder, type OrderData, type ShipStationShipment } from 'apis/merch'
import { findElement, getLocalDateWithoutTime, isLoggedIn } from 'utils/helpers'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'
import { getShippingServiceName } from 'utils/merch'
import { getShortAddress } from 'utils/strings'
import Button from 'components/Button'
import { set } from '@project-serum/anchor/dist/cjs/utils/features'
import GradientButton from 'components/Button/GradientButton'
import { useAuthentication } from 'hooks/useAuthentication'

const MerchDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const { connected, publicKey } = useWallet()
  const { profileInfo } = useAuthentication()
  const isLoading = useSelector<any>(state => state.isLoading)
  const dispatch = useDispatch()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const [itemDetails, setItemDetails] = useState(null)
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [trackingDetails, setTrackingDetails] = useState<ShipStationShipment>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [isOwn, setIsOwn] = useState(false)
  const [helpTitle, setHelpTitle] = useState('')
  const [helpBody, setHelpBody] = useState('')
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewBody, setReviewBody] = useState('')

  useEffect(() => {
    dispatch({ type: 'set', isLoading: true })
  }, [])

  useEffect(() => {
    console.log(profileInfo)
    setEmailBody()
  }, [profileInfo])

  useEffect(() => {
    if (typeof id != 'string' || !Number.isFinite(parseInt(id))) return
    if (isLoggedIn()) {
      getOrder(id).then(setOrderData)
    }
  }, [id])

  useEffect(() => {
    dispatch({ type: 'set', isLoading: false })

    if (!orderData) return
    let { order, ssorder, shipment } = orderData

    if (shipment) setTrackingDetails(shipment)

    let itemData = orderData?.ssorder.items[0]
    let options = itemData.options
    let nftName = findElement(options, 'name', 'nftName')
    if (options) {
      let itemDetails = {
        print: nftName ? nftName['value'] : '',
        quantity: itemData.quantity,
        product: itemData.name,
      }
      setItemDetails(itemDetails)
    }

    setPaymentDetails({
      method: order.payment_method,
      status: 'Complete',
      commission: order.artist_commission.toFixed(2),
      shipping: order.shipping_amount.toFixed(2),
      tax: order.tax_amount.toFixed(2),
      txId: order.transaction_id,
      paidBy: order.buyer_address,
    })

    setIsOwn(order.buyer_address === publicKey?.toBase58())

    let keys = Object.keys(order.seller_shares)
    if (keys.length > 0) setPaidBy(keys[0])

    let billTo = ssorder.billTo
    setOrderDetails({
      orderNumber: ssorder.orderNumber,
      orderPlaced: getLocalDateWithoutTime(ssorder.orderDate),
      total: order.amount.toFixed(2),
      shipTo: billTo
        ? {
            street: billTo.street1 + ' ' + billTo.street2,
            city: [billTo.city, billTo.state + ' ' + billTo.postalCode, billTo.country].join(', '),
          }
        : { street: '---', city: '---' },
      service: getShippingServiceName(ssorder.requestedShippingService),
      delivery: getLocalDateWithoutTime(ssorder.paymentDate),
    })

    setPreviewUrl(itemData.imageUrl)
  }, [orderData])

  const setEmailBody = () => {
    setHelpTitle(`Foster Studio Support – Order# ${id}`)
    setReviewTitle(`Foster Studio Product Review – Order# ${id}`)
    let helpBody =
      `\nOrder#${id}\n` +
      `${profileInfo?.username ?? ''}\n` +
      `${publicKey.toBase58()}\n\n` +
      'How can we help you with this order?'
    let reviewBody =
      `\nOrder#${id}\n` +
      `${profileInfo?.username ?? ''}\n` +
      `${publicKey.toBase58()}\n\n` +
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
      window.open(
        `https://tools.usps.com/go/TrackConfirmAction.action?tLabels=${trackingDetails.trackingNumber.replaceAll(
          ' ',
          ''
        )}`
      )
    }
  }

  const retryPayment = () => {
    dispatch({ type: 'set', isLoading: true })
    router.push(`/orders/${id}`)
  }
  return (
    <div className="g-container">
      <div className="flex gap-[15px] items-center mt-[30px] lg:mt-[65px]">
        <Link href="/merch-logs">
          <div
            className={styles.backBG}
            onClick={() => {
              dispatch({ type: 'set', isLoading: true })
              router.push('/merch-logs')
            }}
          >
            <div className="hidden lg:flex mr-[2px]">
              <ArrowLeftIcon alt="" />
            </div>
            <div className="flex lg:hidden">
              <ArrowLeftIconMobile alt="" />
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
            <div className={styles.infoValue}>{orderDetails?.orderPlaced}</div>
          </div>
          <div>
            <div className={styles.infoTitle}>TOTAL</div>
            <div className={styles.infoValue}>${orderDetails?.total}</div>
          </div>
          <div>
            <div className={styles.infoTitle}>SHIP TO</div>

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
          </div>
          <div>
            <div className={styles.infoTitle}>SHIPPING METHOD</div>
            <div className={styles.infoValue}>
              {orderDetails?.orderNumber === '' && !isOwn ? 'Hidden for Buyer Safety' : orderDetails?.service}
            </div>
          </div>
          <div>
            <div className={styles.infoTitle}>TRACKING NUMBER</div>
            <div className={`${styles.infoValue} text-right`}>
              {orderDetails?.orderNumber === '' && !isOwn
                ? 'Hidden for Buyer Safety'
                : trackingDetails === null && connected
                ? 'Pending Order Creation'
                : trackingDetails?.trackingNumber}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-between mt-[70px]">
          <div className="w-[183px] h-[183px] object-cover">
            <img src={previewUrl} alt="" />
          </div>
          <div>
            <div className={styles.detailTitle}>Item Details</div>
            <div className={`mt-[15px] ${styles.detailValue}`}>Print:&nbsp;{itemDetails?.print}</div>
            <div className={`mt-[9px] ${styles.detailValue}`}>Quantity:&nbsp;{itemDetails?.quantity}</div>
            <div className={`mt-[9px] ${styles.detailValue}`}>Product:&nbsp;{itemDetails?.product}</div>
          </div>

          <div>
            <div className={styles.detailTitle}>Payment Details</div>
            <div className={`mt-[15px] ${styles.detailValue}`}>Payment&nbsp;Method:&nbsp;{paymentDetails?.method}</div>
            <div className={`mt-[15px] ${styles.detailValue}`}>
              Payment&nbsp;Status:&nbsp;{paymentDetails?.txId?.length > 0 ? paymentDetails?.status : 'Pending'}
            </div>
            <div className={`mt-[15px] ${styles.detailValue}`}>
              Creator&nbsp;Commission:&nbsp;${paymentDetails?.commission}
            </div>
            <div className={`mt-[15px] ${styles.detailValue}`}>
              Paid&nbsp;by:&nbsp;{getShortAddress(paymentDetails?.paidBy)}
            </div>
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
                />
              </div>
            ) : (
              <div>
                <OutlineButton
                  borderColor="var(--follow-btn-border-mobile)"
                  width={335}
                  label="Track package"
                  onClick={() => gotoTrackPage()}
                />
              </div>
            )}
            <div className="mt-[12px]">
              <a
                href={`mailto:admin@fostermarketplace.io?${new URLSearchParams({
                  subject: helpTitle,
                  body: helpBody,
                })}`}
              >
                <OutlineButton
                  borderColor="var(--follow-btn-border-mobile)"
                  width={335}
                  label="Get help"
                  onClick={() => {}}
                />
              </a>
            </div>
            <div className="mt-[12px]">
              <a
                href={`mailto:admin@fostermarketplace.io?${new URLSearchParams({
                  subject: reviewTitle,
                  body: reviewBody,
                })}`}
              >
                <OutlineButton
                  borderColor="var(--follow-btn-border-mobile)"
                  width={335}
                  label="Write a product review"
                  onClick={() => {}}
                  // onClick={() => {
                  //   window.location.href = 'mailto:admin@fostermarketplace.io'
                  // }}
                />
              </a>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center mt-[75px]">
          <div className={styles.infoValue}>
            Shipping Status: {orderData?.ssorder?.orderStatus === 'shipped' ? 'Shipped' : 'Awaiting Shipment'}
          </div>
        </div>
        <div className="w-full flex justify-center mt-[75px]">
          <div className={styles.separator}></div>
        </div>
      </div>
      {/* Mobile */}
      <div className="w-full lg:hidden block">
        <div className={styles.orderInfoBG}>
          <div className="w-full flex justify-between">
            <div>
              <div className={styles.infoTitle}>ORDER PLACED</div>
              <div className={styles.infoValue}>{orderDetails?.orderPlaced}</div>
            </div>
            <div className="text-end">
              <div className={styles.infoTitle}>TOTAL</div>
              <div className={styles.infoValue}>${orderDetails ? orderDetails.total : '---'}</div>
            </div>
          </div>

          <div className="w-full mt-[15px]">
            <div className="text-start">
              <div className={styles.infoTitle}>SHIP TO</div>
              {orderDetails?.orderNumber === '' && !isOwn ? (
                <div className={styles.infoValue}>{'Hidden for Buyer Safety'}</div>
              ) : (
                <div>
                  <div className={styles.infoValue}>{orderDetails?.shipTo.street}</div>
                  <div className={styles.infoValue}>{orderDetails?.shipTo.city}</div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full mt-[15px]">
            <div className="text-start">
              <div className={styles.infoTitle}>SHIPPING METHOD</div>
              <div className={styles.infoValue}>
                {orderDetails?.orderNumber === '' && !isOwn ? 'Hidden for Buyer Safety' : orderDetails?.service}
              </div>
            </div>
          </div>

          <div className="w-full mt-[15px]">
            <div className={styles.infoTitle}>Tracking Number</div>
            <div className={styles.infoValue}>
              {orderDetails?.orderNumber === '' && !isOwn
                ? 'Hidden for Buyer Safety'
                : trackingDetails === null && connected
                ? 'Pending Order Creation'
                : trackingDetails?.trackingNumber}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center mt-[30px]">
          <div className="w-[183px] h-auto object-cover">
            <img src={previewUrl} alt="" />
          </div>
        </div>
        <div className="w-full mt-[30px]">
          <div className={styles.detailTitle}>Item&nbsp;Details</div>
          <div className={styles.detailValue}>Print:&nbsp;{itemDetails?.print}</div>
          <div className={styles.detailValue}>Quantity:&nbsp;{itemDetails?.quantity}</div>
          <div className={styles.detailValue}>Product:&nbsp;{itemDetails?.product}</div>
        </div>
        <div className="w-full mt-[30px]">
          <div className={styles.detailTitle}>Payment&nbsp;Details</div>
          <div className={styles.detailValue}>Payment&nbsp;Method:&nbsp;{paymentDetails?.method}</div>
          <div className={styles.detailValue}>
            Payment&nbsp;Status:&nbsp;{paymentDetails?.txId.length > 0 ? paymentDetails?.status : 'Pending'}
          </div>
          <div className={styles.detailValue}>Creator&nbsp;Commission:&nbsp;${paymentDetails?.commission}</div>
          <div className={styles.detailValue}>Paid&nbsp;by:&nbsp;{getShortAddress(paymentDetails?.paidBy)}</div>
          <div className={styles.detailValue}>Shipping&nbsp;&&nbsp;Handling:&nbsp;${paymentDetails?.shipping}</div>
          <div className={styles.detailValue}>Tax:&nbsp;${paymentDetails?.tax}</div>
        </div>
        <div className="w-full mt-[45px] flex justify-center">
          <div className="flex">
            <div className={styles.shipStatusTitle}>
              Shipping Status: {orderData?.ssorder?.orderStatus === 'shipped' ? 'Shipped' : 'Awaiting Shipment'}
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
                />
              </div>
            ) : (
              <div>
                <OutlineButton
                  borderColor="var(--follow-btn-border-mobile)"
                  width={335}
                  label="Track package"
                  onClick={() => gotoTrackPage()}
                />
              </div>
            )}

            <div className="mt-[12px]">
              <OutlineButton
                borderColor="var(--follow-btn-border-mobile)"
                width={335}
                label="Get help"
                onClick={() => {
                  window.location.href = 'mailto:admin@fostermarketplace.io'
                }}
              />
            </div>
            <div className="mt-[12px]">
              <OutlineButton
                borderColor="var(--follow-btn-border-mobile)"
                width={335}
                label="Write a product review"
                onClick={() => {
                  window.location.href = 'mailto:admin@fostermarketplace.io'
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <FullScreenLoadingModal open={isLoading} />
    </div>
  )
}

export default MerchDetail

MerchDetail.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}

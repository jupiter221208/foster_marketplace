import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// next component
import Link from 'next/link'

// Resources
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import ArrowLeftIcon from 'assets/icons/arrow-left-smallest.svg?component'
import ArrowLeftIconMobile from 'assets/icons/arrow-left-medium-mobile.svg?component'

// Styles
import styles from './id.module.scss'
import OutlineButton from 'components/Button/OutlineButton'

// api
import MerchAPI from 'apis/merch'
import { getOrder, OrderData } from 'apis/merch'
import { findElement, getFirstUpperString, getLocalDateWithoutTime, isLoggedIn } from 'utils/helpers'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'
import { getShippingServiceName } from 'utils/merch'
import { getShortAddress } from 'utils/strings'
import Button from 'components/Button'

const MerchDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const isLoading = useSelector<any>(state => state.isLoading)
  const dispatch = useDispatch()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const [itemDetails, setItemDetails] = useState(null)
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [trackingDetails, setTrackingDetails] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [paidBy, setPaidBy] = useState('')

  useEffect(() => {
    dispatch({ type: 'set', isLoading: true })
  }, [])

  useEffect(() => {
    if (typeof id != 'string' || !Number.isFinite(parseInt(id))) return
    if (isLoggedIn()) {
      getOrder(id).then(setOrderData)
      MerchAPI.getAllOrder().then(
        response => {
          let orders = response.filter(item => item.id.toString() === id)
          if (orders.length > 0) {
            let order = orders[0]
            setPaidBy(order.buyer_address)
          }
        },
        error => {}
      )
    }
  }, [id])

  useEffect(() => {
    if (orderData) {
      dispatch({ type: 'set', isLoading: false })
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

      let order = orderData?.order
      if (order) {
        let paymentDetails = {
          method: order.payment_method,
          status: 'Complete',
          commission: order.artist_commission.toFixed(2),
          shipping: order.shipping_amount.toFixed(2),
          tax: order.tax_amount.toFixed(2),
        }
        setPaymentDetails(paymentDetails)
      }

      let ssorder = orderData?.ssorder
      if (ssorder) {
        let billTo = ssorder.billTo
        let orderDetails = {
          orderPlaced: getLocalDateWithoutTime(ssorder.orderDate),
          total: order.amount.toFixed(2),
          shipTo: {
            street: billTo.street1,
            city: billTo.city + ', ' + billTo.state + ' ' + billTo['postalCode'] + ', ' + billTo.country,
          },
          service: getShippingServiceName(ssorder.requestedShippingService),
          delivery: getLocalDateWithoutTime(ssorder.paymentDate),
        }
        setOrderDetails(orderDetails)
      }
      setTrackingDetails(orderData?.fulfillment)
      setPreviewUrl(itemData.imageUrl)
    }
  }, [orderData])

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
              {orderDetails?.shipTo.street}
              <br />
              {orderDetails?.shipTo.city}
            </div>
          </div>
          <div>
            <div className={styles.infoTitle}>SHIPING METHOD</div>
            <div className={styles.infoValue}>{orderDetails?.service}</div>
          </div>
          <div>
            <div className={styles.infoTitle}>TRACKING NUMBER</div>
            <div className={`${styles.infoValue} text-right`}>
              {trackingDetails === null ? 'Pending Order Creation' : trackingDetails?.trackingNumber}
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
            <div className={`mt-[15px] ${styles.detailValue}`}>Payment&nbsp;Status:&nbsp;{paymentDetails?.status}</div>
            <div className={`mt-[15px] ${styles.detailValue}`}>
              Creator&nbsp;Commission:&nbsp;${paymentDetails?.commission}
            </div>
            <div className={`mt-[15px] ${styles.detailValue}`}>Paid&nbsp;by:&nbsp;{getShortAddress(paidBy)}</div>
            <div className={`mt-[15px] ${styles.detailValue}`}>
              Shipping&nbsp;&&nbsp;Handling:&nbsp;${paymentDetails?.shipping}
            </div>
            <div className={styles.detailValue}>Tax:&nbsp;${paymentDetails?.tax}</div>
          </div>

          <div>
            {trackingDetails === null ? (
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
                  color="rgba(239, 240, 247, 0.5)"
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
        <div className="w-full flex justify-center mt-[75px]">
          <div className={styles.infoValue}>
            Shipping Status: {orderData?.ssorder.orderStatus === 'shipped' ? 'Shipped' : 'Awaiting Shipment'}{' '}
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
              <div className={styles.infoValue}>{orderDetails?.shipTo.street}</div>
              <div className={styles.infoValue}>{orderDetails?.shipTo.city}</div>
            </div>
          </div>

          <div className="w-full mt-[15px]">
            <div className="text-start">
              <div className={styles.infoTitle}>SHIPPING METHOD</div>
              <div className={styles.infoValue}>{orderDetails?.service}</div>
            </div>
          </div>

          <div className="w-full mt-[15px]">
            <div className={styles.infoTitle}>Tracking Number</div>
            <div className={styles.infoValue}>
              {trackingDetails === null ? 'Pending Order Creation' : trackingDetails?.delivery}
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
          <div className={styles.detailValue}>Payment&nbsp;Status:&nbsp;{paymentDetails?.status}</div>
          <div className={styles.detailValue}>Creator&nbsp;Commission:&nbsp;${paymentDetails?.commission}</div>
          <div className={styles.detailValue}>Paid&nbsp;by:&nbsp;{getShortAddress(paidBy)}</div>
          <div className={styles.detailValue}>Shipping&nbsp;&&nbsp;Handling:&nbsp;${paymentDetails?.shipping}</div>
          <div className={styles.detailValue}>Tax:&nbsp;${paymentDetails?.tax}</div>
        </div>
        <div className="w-full mt-[45px] flex justify-center">
          <div className="flex">
            <div className={styles.shipStatusTitle}>Shipping&nbsp;Status&nbsp;</div>
            <div className={styles.shipStatusValue}>
              {orderData && getFirstUpperString(orderData.ssorder.orderStatus)}
            </div>
          </div>
        </div>
        <div className="w-full mt-[30px] mb-[100px] flex justify-center">
          <div>
            {trackingDetails === null ? (
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
                  color="rgba(239, 240, 247, 0.5)"
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

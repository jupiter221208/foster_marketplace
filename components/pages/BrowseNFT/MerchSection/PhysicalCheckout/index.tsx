import React, { useState, useEffect } from 'react'
import { HelioCheckout } from '@heliofi/checkout-react'

// next components
import { useRouter } from 'next/router'
import Image from 'next/image'

// custom functions
import { createPaymentTransaction, createV2PaymentTransaction } from 'utils/merch'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
// json

// images
import USDCIcon from 'assets/icons/usdc-icon.svg'
import ArrowLeftIcon from 'assets/icons/arrow-left-24x24.svg?component'
import SolanaIcon from 'assets/icons/solana-logo-13x11.svg?component'
import SolanaIconForBtn from 'assets/icons/solana-logo-dark.svg?component'
import { useMetaplex } from 'hooks/useMetaplex'

// styles
import styles from './index.module.scss'
import Alert from 'components/Alert'
import { findElement, getFirstUpperString } from 'utils/helpers'
import { sendTransactionWithRetry } from 'utils/transactions'

// api
import StoreAPI from 'apis/store'
import { payOrder } from 'apis/merch'
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'

export interface PhysicalCheckoutProps {
  orderData?: any
  orderType: string
  merchType?: string
  total?: number
  paymentId?: number
  helioEnabled: any
  onBack: () => any
  onNext?: () => any
}

const PhysicalCheckout = ({
  orderData,
  orderType,
  merchType,
  onBack,
  total,
  paymentId = null,
  helioEnabled,
}: PhysicalCheckoutProps) => {
  const router = useRouter()
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()
  const { metaplex } = useMetaplex()
  const { solToUsdRate, solToUsdWithSlippage, refreshValue } = useSolToUsdRate()
  const [showAlert, setShowAlert] = useState(false)
  const [list, setList] = useState([])
  const [shipping, setShipping] = useState({ address: '', city: '', state: '', code: '', country: '' })
  const [alertData, setAlertData] = useState<any[]>([])
  const [isPaySol, setIsPaySol] = useState(false)
  const [isPayUsd, setIsPayUsd] = useState(false)
  const [shippingFee, setShippingFee] = useState(0)

  total ??= orderType === 'v1' ? orderData?.order.amount : orderData?.externalOrder.amountPaid
  const shippingRes = merchType === 'user' ? orderData?.items[0].options.shipping_responsibility : ''
  const shippingAmount = orderType === 'v1' ? orderData?.order.shipping_amount : orderData?.externalOrder.shippingAmount
  const taxAmount = orderType === 'v1' ? orderData?.order.tax_amount : orderData?.externalOrder.taxAmount
  const subTotalUsd = total - shippingAmount - taxAmount
  const solTotalAmount = subTotalUsd && solToUsdRate ? subTotalUsd / solToUsdWithSlippage() : 0
  const solAmount = total && solToUsdRate ? total / solToUsdWithSlippage() : 0
  const WALLET_ADAPTER_NETWORK = process.env.WALLET_ADAPTER_NETWORK

  type DisplayType = 'inline' | 'button'
  type NetworkType = 'main' | 'test'
  type EmbedThemeMode = 'light' | 'dark'
  type PrimaryPaymentMethod = 'fiat' | 'crypto'

  const helioConfig = {
    paylinkId: paymentId ? paymentId.toString() : '65f1ed912d926efac71bbed1',
    network: (WALLET_ADAPTER_NETWORK === 'devnet' ? 'test' : 'main') as NetworkType,
    display: 'button' as DisplayType,
    primaryPaymentMethod: 'fiat' as PrimaryPaymentMethod,
    // amount: total.toFixed(2),
    customTexts: {
      mainButtonTitle: 'Pay With Card',
    },
    theme: {
      colors: {
        primaryButtonBackground: 'var(--hero-card-bg)',
        primaryButtonBackgroundHover: 'var(--hero-card-bg)',
        primaryButtonText: 'var(--main-bg-color)',
      },
    } as HelioEmbedTheme,
    onSuccess: payment => {
      onCheckoutWithHelio(payment)
    },
  }

  interface HelioEmbedTheme {
    themeMode: EmbedThemeMode
    colors: {
      primaryButtonBackground?: string
      primaryButtonBackgroundHover?: string
      primaryButtonText?: string
      primaryButtonShadow?: string
      shadowPrimaryGray?: string
    }
  }

  useEffect(() => {
    let shipping_fee = 0
    let ssorder = orderType === 'v1' ? orderData?.ssorder : orderData?.externalOrder
    let shippingData = ssorder.shipTo

    if (shippingRes === 'd_buyer') {
      let config = orderData?.items[0].options.shipping_config
      if (config) {
        let shippingCountry = Object.keys(config)[0]
        if (shippingData.country === shippingCountry) {
          shipping_fee = config[shippingCountry]
        } else {
          shipping_fee = config['blink']
        }
        setShippingFee(shipping_fee)
      }
    }

    // let sol_amount = 0
    // if (shipping_fee > 0) {
    //   sol_amount = total && solToUsdRate ? (total + shipping_fee / 100) / solToUsdWithSlippage() : 0
    // } else {
    //   sol_amount = total && solToUsdRate ? total / solToUsdWithSlippage() : 0
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingRes, solToUsdRate])

  useEffect(() => {
    setAlertData([
      {
        id: 0,
        title: 'Order Placed!',
        description: 'You will receive an email once the order has been shipped. ',
        description2: `Your order number is #${orderType === 'v1' ? orderData.order.id : orderData.id}.`,
        type: 'success',
      },
    ])

    let ssorder = orderType === 'v1' ? orderData?.ssorder : orderData?.externalOrder
    let shippingData = ssorder.shipTo
    if (shippingData)
      setShipping({
        address: shippingData['street1'] + ' ' + shippingData['street2'],
        city: shippingData['city'],
        state: shippingData['state'],
        code: shippingData['postalCode'],
        country: shippingData['country'],
      })

    let itemList = []
    ssorder.items.forEach((item, index) => {
      let itemQuantity = item.quantity
      let options = item.options
      var type = findElement(options, 'name', 'type')['value']
      var nftName = findElement(options, 'name', 'nftName')['value']
      var apparel = findElement(options, 'name', 'apparel')
      apparel = apparel ? apparel['value'] : ''
      var size = findElement(options, 'name', 'size')
      size = size ? size['value'] : ''

      if (type === 'apparel') {
        var color = findElement(options, 'name', 'color')['value']
        let type = apparel
        let colorText = getFirstUpperString(color)
        let qty = itemQuantity
        itemList.push({ name: nftName, type, color: colorText, size, qty })
      } else if (type === 'foster') {
        var color = findElement(options, 'name', 'color')['value']
        let type = 'foster'
        let colorText = 'Color: ' + getFirstUpperString(color)
        let qty = itemQuantity
        itemList.push({ name: nftName, type, color: colorText, size, qty })
      } else if (type === 'user') {
        let type = 'user'
        let qty = itemQuantity
        itemList.push({ name: nftName, type, color: '', size, qty, productId: orderData?.items[index].productTypeId })
      }
    })
    setList(itemList)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onCheckout = async currency => {
    if (!connected) {
      setVisible(true)
      return
    }

    let result = false
    try {
      if (!orderData) throw new Error('orderData cannot be null for checkout')

      let { order } = orderData
      let ssorder = orderType === 'v1' ? orderData?.ssorder : orderData?.externalOrder
      if (ssorder.items.length == 0) throw new Error(`shipstation order ${order.id} has no items`)

      let transaction
      if (orderData.id > 1000) {
        transaction = await createV2PaymentTransaction({
          metaplex,
          sellerShares: orderData.paymentSplits,
          solToUsdRate: solToUsdWithSlippage(),
          currency,
        })
      } else {
        transaction = await createPaymentTransaction({
          metaplex,
          sellerShares: order.seller_shares,
          usdAmounts: {
            maddiesAmount: order.maddies_cost + order.shipping_amount,
            fosterAmount: order.foster_commission + order.tax_amount,
            artistAmount: order.artist_commission,
          },
          solToUsdRate: solToUsdWithSlippage(),
          currency,
        })
      }
      let { blockhash, lastValidBlockHeight } = await metaplex.connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      let signedTransaction = await metaplex.identity().signTransaction(transaction)
      let signature = await sendTransactionWithRetry({
        connection: metaplex.connection,
        transaction: signedTransaction,
        maxHeight: lastValidBlockHeight,
        retryInterval: 1000,
        skipPreflight: true,
      })

      if (signature?.length > 0) {
        // TODO: send signature to backend and update order
        let params = {
          payment_method: currency.toUpperCase(),
          payment_reference: signature,
        }
        let response
        if (orderData.id > 1000) {
          response = await StoreAPI.payStoreOrder(orderData.id, params)
        } else {
          response = await payOrder(order.id, params)
        }
        if (response?.status === 'success') result = true
      } else {
        setIsPaySol(false)
        setIsPayUsd(false)
      }
    } catch {
      setIsPaySol(false)
      setIsPayUsd(false)
    } finally {
      if (result) {
        setTimeout(() => {
          setShowAlert(true)
        }, 1000)
      }
    }
  }

  const onCheckoutWithHelio = async event => {
    let signature = event.data.transactionSignature
    let method = event.blockchainSymbol

    if (signature?.length > 0) {
      // TODO: send signature to backend and update order
      let params = {
        payment_method: method.toUpperCase(),
        payment_reference: signature,
      }

      let response
      if (orderData.id > 1000) {
        response = await StoreAPI.payStoreOrder(orderData.id, params)
      } else {
        response = await payOrder(orderData.id, params)
      }
      if (response?.status === 'success') {
        setTimeout(() => {
          setShowAlert(true)
        }, 1000)
      }
    }
  }

  return (
    <section className={styles.container}>
      <div className="w-full px-[0px] mt-[20px] lg:mt-[30px]">
        <div className="flex items-center gap-[12px]">
          <ArrowLeftIcon onClick={onBack} />

          <div className={styles.summary}>Order Summary</div>
        </div>
        <div className="w-full mt-[20px] lg:mt-[30px] h-[auto] overflow-auto">
          <div className={styles.productDetails}>Product Details</div>
          <div className="mt-[7px] mb-[7px]">
            {list.map((item, index) => (
              <div key={index} className="pb-[5px]">
                <div className={styles.itemDetails}>
                  {item.type === 'user'
                    ? item.productId === 12 || item.productId === 13
                      ? item.name + ' (' + item.size + ') x ' + item.qty
                      : item.name + ' x ' + item.qty
                    : item.name + ' (' + item.size + ') x ' + item.qty}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full mt-[15px]">
          <div className={styles.productDetails}>Shipping Address</div>
          <div className="mt-[7px]">
            <div className={styles.itemDetails}>{shipping.address}</div>
            <div className={styles.itemDetails}>{shipping.city + ', ' + shipping.state + ' ' + shipping.code}</div>
            <div className={styles.itemDetails}>{shipping.country === 'US' ? 'USA' : shipping.country}</div>
          </div>
        </div>

        <div className={styles.shippingArea}>
          <div className="w-full flex justify-between items-center">
            <div className={styles.subtotal}>Subtotal</div>
            <div className="flex gap-[11px] items-center">
              <div className="flex gap-[6px] items-center">
                <SolanaIcon className="mt-[3px]" />
                <div className={styles.solPrice}>
                  {(solTotalAmount - shippingFee / 100 / solToUsdWithSlippage()).toFixed(2)}
                </div>
              </div>
              <div className={styles.total}>${(subTotalUsd - shippingFee / 100).toFixed(2)}</div>
            </div>
          </div>
          {merchType === 'user' ? (
            <div className="w-full flex justify-between items-center mt-[16px]">
              <div className={styles.total}>Shipping & Handling</div>
              <div className={styles.total}>${(shippingFee / 100).toFixed(2)}</div>
            </div>
          ) : (
            <div className="w-full flex justify-between items-center mt-[16px]">
              <div className={styles.total}>Shipping & Handling</div>
              <div className={styles.total}>${shippingAmount.toFixed(2)}</div>
            </div>
          )}
          {merchType !== 'user' && (
            <div className="w-full flex justify-between items-center mt-[16px]">
              <div className={styles.total}>Taxes</div>
              <div className={styles.total}>${taxAmount.toFixed(2)}</div>
            </div>
          )}

          <div className={styles.border} />

          <div className="w-full flex justify-between items-center">
            <div className={styles.payNow}>Pay Now</div>
            <div className="flex gap-[11px] items-center">
              <div className="flex gap-[6px] items-center">
                <SolanaIcon className="mt-[3px]" />
                <div className={styles.solPrice}>{solAmount.toFixed(2)}</div>
              </div>
              <div className={styles.total}>${total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className="w-full flex flex-col gap-[10px] mb-[30px]">
          {isPayUsd ? (
            <LoadingPrimaryButton fullWidth />
          ) : (
            <div
              className={styles.payUsdBtn}
              onClick={() => {
                setIsPayUsd(true)
                onCheckout('usdc')
              }}
            >
              <div className="flex gap-[9px] items-center">
                <Image src={USDCIcon} width={20} height={20} alt="" className="pt-[5px]" />
                {'Pay with USDC'}
              </div>
            </div>
          )}
          {isPaySol ? (
            <LoadingPrimaryButton fullWidth />
          ) : (
            <div
              className={styles.paySolBtn}
              onClick={() => {
                setIsPaySol(true)
                onCheckout('sol')
              }}
            >
              <div className="flex gap-[9px] items-center">
                <SolanaIconForBtn className="mt-[3px]" />
                {'Pay with SOL'}
              </div>
            </div>
          )}

          {orderType === 'v2' && helioEnabled && (
            <div className={styles.helioContainer}>
              <HelioCheckout config={helioConfig} />
            </div>
          )}
          {/* {!helioEnabled && <SecondaryButton label="Back" type="back" onClick={onBack} fullWidth />} */}
          {/* <SecondaryButton label="Back" type="back" onClick={onBack} fullWidth /> */}
        </div>
      </div>
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
          setTimeout(() => {
            router.push(`/merch-logs/${orderType === 'v1' ? orderData.order.id : orderData.id}`)
          }, 1000)
        }}
        data={alertData}
      />
    </section>
  )
}

export default PhysicalCheckout

import React, { useState, useEffect } from 'react'
import { HelioCheckout } from '@heliofi/checkout-react'

// next components
import { useRouter } from 'next/router'
import Image from 'next/image'

// custom functions
import { ensureMaxDecimals } from 'utils'
import { createPaymentTransaction, createV2PaymentTransaction } from 'utils/merch'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
// json

// images
import SolanaLogoIcon from 'assets/icons/solana-logo-original.svg'
import USDCIcon from 'assets/icons/usdc-icon.svg'
import CARDIcon from 'assets/icons/card-icon.svg'
import HelioIcon from 'assets/icons/helio-icon.svg'
import SolanaIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'

import { useMetaplex } from 'hooks/useMetaplex'

// styles
import styles from './index.module.scss'
import Alert from 'components/Alert'
import { findElement, getFirstUpperString } from 'utils/helpers'

// api
import StoreAPI from 'apis/store'
import { payOrder } from 'apis/merch'
import PrimaryButton from 'components/Button/PrimaryButton'
import SecondaryButton from 'components/Button/SecondaryButton'
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'
import GradientButton from 'components/Button/GradientButton'

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
  onNext,
  total,
  paymentId = null,
  helioEnabled,
}: PhysicalCheckoutProps) => {
  const router = useRouter()
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()
  const { metaplex } = useMetaplex()
  const { solToUsdRate, solToUsdWithSlippage, refreshValue } = useSolToUsdRate()
  const [currency, setCurrency] = useState<'sol' | 'usdc' | 'card'>('sol')
  const [isLoad, setIsLoad] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [list, setList] = useState([])
  const [shipping, setShipping] = useState({ address: '', city: '', state: '', code: '', country: '' })
  const [alertData, setAlertData] = useState<any[]>([])
  const [helioOpacity, setHelioOpacity] = useState(0)

  //   {paylinkId: '6571e7cd4a2bee8095ee84da',
  //   network: 'test',
  //   display: 'button' as DisplayType,
  //   amount: '0',
  //   theme: {
  //     colors: {
  //       primaryButtonBackground: 'transparent',
  //       primaryButtonBackgroundHover: 'transparent',
  //       primaryButtonText: 'transparent',
  //     },
  //   } as HelioEmbedTheme,
  // }

  total ??= orderType === 'v1' ? orderData?.order.amount : orderData?.externalOrder.amountPaid
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
    amount: total.toFixed(2),
    customTexts: {
      mainButtonTitle: 'Pay With Card',
    },
    theme: {
      colors: {
        primaryButtonBackground: 'var(--bg-242424-E8E7E6)',
        primaryButtonBackgroundHover: 'var(--bg-242424-E8E7E6)',
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
    setTimeout(() => {
      setHelioOpacity(1)
    }, 5000)

    setAlertData([
      {
        id: 0,
        title: 'Order Placed!',
        description: 'You will receive an email once the order has been shipped. ',
        description2: `Your order number is #${orderData.id}.`,
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
    ssorder.items.forEach(item => {
      let itemQuantity = item.quantity
      let imageUrl = item.imageUrl
      let options = item.options
      var type = findElement(options, 'name', 'type')['value']
      var nftName = findElement(options, 'name', 'nftName')['value']
      var name = item.name
      var apparel = findElement(options, 'name', 'apparel')
      apparel = apparel ? apparel['value'] : ''
      var size = findElement(options, 'name', 'size')
      size = size ? size['value'] : ''

      if (type === 'apparel') {
        var color = findElement(options, 'name', 'color')['value']
        let type =
          apparel +
          ' ' +
          '(' +
          (size === 'XS'
            ? 'X-Small'
            : size === 'S' || size === 'YXS'
            ? 'Small'
            : size === 'M' || size === 'YS'
            ? 'Medium'
            : size === 'L' || size === 'YM'
            ? 'Large'
            : size === 'XL' || size === 'YL'
            ? 'X-Large'
            : size === '2XL' || size === 'YXL'
            ? '2X-Large'
            : size === '3XL'
            ? '3X-Large'
            : size === '4XL'
            ? '4X-Large'
            : size === '5XL'
            ? '5X-Large'
            : '') +
          ')'
        let colorText = getFirstUpperString(color)
        let qty = 'Qty:' + itemQuantity
        itemList.push({ name: nftName, type, color: colorText, qty })
      } else if (type === 'foster') {
        var color = findElement(options, 'name', 'color')['value']
        var technique = findElement(options, 'name', 'technique')['value']
        let type = 'Print Technique: ' + (technique === 'direct_to_garment' ? 'Direct To Garment' : 'Embroidery')
        let colorText = 'Color: ' + getFirstUpperString(color)
        let qty = 'Qty: ' + itemQuantity
        itemList.push({ name: 'Product: ' + nftName, type, color: colorText, qty })
      } else if (type === 'user') {
        let type = 'User Fulfilled Physical Print'
        let qty = 'Qty: ' + itemQuantity
        itemList.push({ name: 'Product: ' + nftName, type, color: '', qty })
      }
    })
    setList(itemList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onCheckout = async () => {
    if (!connected) {
      setVisible(true)
      return
    }

    setIsLoad(true)
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
      let { blockhash } = await metaplex.connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      let signedTransaction = await metaplex.identity().signTransaction(transaction)
      let { signature } = await metaplex.rpc().sendAndConfirmTransaction(signedTransaction)

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
          response = await payOrder(orderData.id, params)
        }
        if (response?.status === 'success') result = true
      } else {
        setIsLoad(false)
      }
    } catch {
      setIsLoad(false)
    } finally {
      // setIsLoad(false)
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
        <div className={styles.summary}>Order Summary</div>
        <div className="w-full mt-[20px] lg:mt-[30px] h-[auto] overflow-auto">
          <div className={styles.productDetails}>Production Details</div>
          <div className="mt-[7px] mb-[7px]">
            {list.map((item, index) => (
              <div key={index} className="pb-[5px]">
                <div className={styles.itemDetails}>{item.name}</div>
                <div className={styles.itemDetails}>{item.type}</div>
                {item.type != 'User Fulfilled Physical Print' && <div className={styles.itemDetails}>{item.color}</div>}
                <div className={styles.itemDetails}>{item.qty}</div>
              </div>
            ))}
          </div>
          {/* <TableSection data={list} /> */}
        </div>
        <div className="w-full mt-[15px]">
          <div className={styles.productDetails}>Shipping Address</div>
          <div className="mt-[7px]">
            <div className={styles.itemDetails}>{shipping.address}</div>
            <div className={styles.itemDetails}>{shipping.city + ', ' + shipping.state + ' ' + shipping.code}</div>
            <div className={styles.itemDetails}>{shipping.country === 'US' ? 'USA' : shipping.country}</div>
          </div>
        </div>

        <div className="w-full flex-wrap h-auto flex gap-[30px] mt-[15px] lg:mt-[24px]">
          <div className="w-full h-[160px] relative hidden lg:block">
            <div className={styles.paymentMethod}>
              Choose Payment Method <span>*</span>
            </div>
            <div className="w-full flex gap-[30px] mt-[16px]">
              <div
                className={`${styles.paymentBG} ${
                  currency === 'sol' ? styles.selectedCurrency : styles.deselectedCurrency
                }`}
                onClick={() => setCurrency('sol')}
              >
                <div className="w-full flex justify-center mt-[26px] mb-[15px]">
                  <Image src={SolanaLogoIcon} width={43} height={37} alt="" />
                </div>
                <div className={styles.currencyName}>SOL</div>
              </div>
              <div
                className={`${styles.paymentBG} ${
                  currency === 'usdc' ? styles.selectedCurrency : styles.deselectedCurrency
                }`}
                onClick={() => setCurrency('usdc')}
              >
                <div className="w-full flex justify-center mt-[26px] mb-[15px]">
                  <Image src={USDCIcon} width={37} height={37} alt="" />
                </div>
                <div className={styles.currencyName}>USDC</div>
              </div>
              {/* <div
                className={`relative ${styles.paymentBG} ${currency === 'card' ? styles.selectedCurrency : ''}`}
                onClick={() => setCurrency('card')}
              >
                <div className="w-full h-full flex justify-center items-center">
                  <div className="flex flex-col justify-center gap-[15px]">
                    <Image src={HelioIcon} width={37} height={37} alt="" />
                    <div className={styles.currencyName}>Helio</div>
                  </div>
                </div>
                {helioOpacity === 1 ? (
                  <div className="absolute inset-0 flex justify-center">
                    <div
                      className={styles.helioContainer}
                      style={{
                        opacity: helioOpacity,
                      }}
                    >
                      <HelioCheckout config={helioConfig} />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col justify-center items-center">
                    <div className={styles.payWithHelio}>PAY</div>
                    <div className={styles.payWithHelio}>WITH</div>
                    <div className={styles.payWithHelio}>HELIO</div>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </div>

        {/* SOL / USDC */}
        <div className="w-full h-auto relative lg:hidden mt-[15px] lg:mt-[30px]">
          <div className={styles.paymentMethod}>
            Choose Payment Method <span>*</span>
          </div>
          <div className="w-full flex gap-[8px] lg:gap-[30px] mt-[10px]">
            <div
              className={`${styles.paymentBG} ${
                currency === 'sol' ? styles.selectedCurrency : styles.deselectedCurrency
              }`}
              onClick={() => setCurrency('sol')}
            >
              <div className="w-full flex justify-center mt-[22px] lg:mt-[26px] mb-[13px] lg:mb-[15px]">
                <Image src={SolanaLogoIcon} width={43} height={37} alt="" />
              </div>
              <div className={styles.currencyName}>SOL</div>
            </div>
            <div
              className={`${styles.paymentBG} ${
                currency === 'usdc' ? styles.selectedCurrency : styles.deselectedCurrency
              }`}
              onClick={() => setCurrency('usdc')}
            >
              <div className="w-full flex justify-center mt-[22px] lg:mt-[26px] mb-[13px] lg:mb-[15px]">
                <Image src={USDCIcon} width={37} height={37} alt="" />
              </div>
              <div className={styles.currencyName}>USDC</div>
            </div>
            {/* <div
              className={`relative ${styles.paymentBG} ${currency === 'card' ? styles.selectedCurrency : ''}`}
              onClick={() => setCurrency('card')}
            >
              <div className="w-full h-full flex justify-center items-center">
                <div className="flex flex-col justify-center gap-[15px]">
                  <Image src={HelioIcon} width={37} height={37} alt="" />
                  <div className={styles.currencyName}>Helio</div>
                </div>
              </div>
              {helioOpacity === 1 ? (
                <div className="absolute inset-0 flex justify-center">
                  <div
                    className={styles.helioContainer}
                    style={{
                      opacity: helioOpacity,
                    }}
                  >
                    <HelioCheckout config={helioConfig} />
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <div className={styles.payWithHelio}>PAY</div>
                  <div className={styles.payWithHelio}>WITH</div>
                  <div className={styles.payWithHelio}>HELIO</div>
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className="w-full flex justify-between mb-[20px] px-[5px]">
          <div>
            <div className={styles.orderTotal}>Total</div>
            {merchType !== 'user' && <div className={styles.orderDesc}>Including taxes and shipping</div>}
          </div>
          <div className="">
            {/* <div className={styles.costDivider} /> */}
            <div className="flex gap-1 items-center justify-end">
              <SolanaIcon alt="" className="mt-[2px]" />
              <div className={styles.totalPrice}>{solAmount ? ensureMaxDecimals(solAmount, 2) : '---'}</div>
            </div>
            {merchType !== 'user' && <div className={styles.totalUSD}>${total ? total.toFixed(2) : '---'}</div>}
          </div>
        </div>
        <div className="w-full flex flex-col gap-[15px] mb-[30px]">
          {isLoad ? (
            <LoadingPrimaryButton fullWidth />
          ) : (
            // <PrimaryButton
            //   disabled={currency.length === 0}
            //   label="Make Payment"
            //   type="payment"
            //   fullWidth
            //   onClick={() => onCheckout()}
            // />
            <GradientButton
              disabled={currency.length === 0}
              label={
                currency === 'sol'
                  ? 'Pay with SOL'
                  : currency === 'usdc'
                  ? 'Pay with USDC'
                  : 'Use Selected Payment Method'
              }
              fullWidth
              height={50}
              onClick={() => onCheckout()}
            />
          )}

          {orderType === 'v2' && helioEnabled && (
            <div className={styles.helioContainer}>
              <HelioCheckout config={helioConfig} />
            </div>
          )}
          {!helioEnabled && <SecondaryButton label="Back" type="back" onClick={onBack} fullWidth />}
        </div>
      </div>
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
          setTimeout(() => {
            router.push(`/merch-logs/${orderData.id}`)
          }, 1000)
        }}
        data={alertData}
      />
    </section>
  )
}

export default PhysicalCheckout

import React, { useState, useEffect } from 'react'

// next components
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'

// custom functions
import { useViewport, ensureMaxDecimals } from 'utils'
import { createPaymentTransaction } from 'utils/merch'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
// json

// images
import SolanaLogoIcon from 'assets/icons/solana-logo-original.svg'
import USDCIcon from 'assets/icons/usdc-icon.svg'
import CARDIcon from 'assets/icons/card-icon.svg'
import SolanaIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'

import { useMetaplex } from 'hooks/useMetaplex'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import ProgressingModal from 'components/Modal/ProgressingModal'
import Alert from 'components/Alert'
import { findElement, getFirstUpperString } from 'utils/helpers'

// api
import { OrderData, payOrder } from 'apis/merch'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'
import OutlineButton from 'components/Button/OutlineButton'
import PrimaryButton from 'components/Button/PrimaryButton'
import SecondaryButton from 'components/Button/SecondaryButton'
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'

export interface PhysicalCheckoutProps {
  orderData?: OrderData
  type: string
  total?: number
  onBack: () => any
  onNext?: () => any
}

const PhysicalCheckout = ({ orderData, onBack, onNext, total }: PhysicalCheckoutProps) => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const isLoading = useSelector<any>(state => state.isLoading)
  const { id } = router.query
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
  total ??= orderData?.order.amount
  const solAmount = total && solToUsdRate ? total / solToUsdWithSlippage() : 0

  useEffect(() => {
    setAlertData([
      {
        id: 0,
        title: 'Order Placed!',
        description: 'You will receive an email once the order has been shipped. ',
        description2: `Your order number is #${id}.`,
        type: 'success',
      },
    ])

    let shippingData = orderData?.ssorder.shipTo

    setShipping({
      address: shippingData['street1'] + ' ' + shippingData['street2'],
      city: shippingData['city'],
      state: shippingData['state'],
      code: shippingData['postalCode'],
      country: shippingData['country'],
    })

    let itemList = []
    orderData?.ssorder.items.forEach(item => {
      let itemQuantity = item.quantity
      let imageUrl = item.imageUrl
      let options = item.options
      var type = findElement(options, 'name', 'type')['value']
      var nftName = findElement(options, 'name', 'nftName')['value']
      var name = item.name
      var apparel = findElement(options, 'name', 'apparel')['value']
      var size = findElement(options, 'name', 'size')['value']
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
      } else if (type === 'merch') {
        var color = findElement(options, 'name', 'color')['value']
        let type = 'Print Technique: Embroidery'
        let colorText = 'Color: ' + getFirstUpperString(color)
        let qty = 'Qty: ' + itemQuantity
        itemList.push({ name: 'Product: ' + nftName, type, color: colorText, qty })
      }
    })
    setList(itemList)
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

      let {
        order,
        ssorder: { items },
      } = orderData

      if (items.length == 0) throw new Error(`shipstation order ${order.id} has no items`)

      let transaction = await createPaymentTransaction({
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
      let { blockhash } = await metaplex.connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      let signedTransaction = await metaplex.identity().signTransaction(transaction)
      let { signature } = await metaplex.rpc().sendAndConfirmTransaction(signedTransaction)

      // TODO: send signature to backend and update order
      let params = {
        payment_method: currency.toUpperCase(),
        payment_reference: signature,
      }
      let response = await payOrder(id, params)
      if (response?.status === 'success') result = true
    } finally {
      // setIsLoad(false)
      if (result) {
        setTimeout(() => {
          setShowAlert(true)
        }, 1000)
      }
    }
  }

  return (
    <section className={styles.container}>
      <div className="w-full px-[0px] lg:px-[30px] mt-[0px] lg:mt-[30px]">
        <div className={styles.summary}>Order Summary</div>
        <div className="w-full mt-[15px] lg:mt-[30px] h-[130px] overflow-auto">
          <div className={styles.productDetails}>Product Details</div>
          <div className="mt-[7px] mb-[7px]">
            {list.map((item, index) => (
              <div key={index} className="pb-[5px]">
                <div className={styles.itemDetails}>{item.name}</div>
                <div className={styles.itemDetails}>{item.type}</div>
                <div className={styles.itemDetails}>{item.color}</div>
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
            <div className={styles.itemDetails}>{shipping.city + ' ' + shipping.code}</div>
            <div className={styles.itemDetails}>{shipping.state}</div>
            <div className={styles.itemDetails}>{shipping.country}</div>
          </div>
        </div>

        <div className="w-full flex-wrap h-auto flex gap-[30px] mt-[15px] lg:mt-[24px]">
          <div className="w-full h-[160px] relative hidden lg:block">
            <div className={styles.paymentMethod}>
              Choose Payment Method <span>*</span>
            </div>
            <div className="w-full flex gap-[30px] mt-[16px]">
              <div
                className={`${styles.paymentBG} ${currency === 'sol' ? styles.selectedCurrency : ''}`}
                onClick={() => setCurrency('sol')}
              >
                <div className="w-full flex justify-center mt-[26px] mb-[15px]">
                  <Image src={SolanaLogoIcon} width={43} height={37} alt="" />
                </div>
                <div className={styles.currencyName}>SOL</div>
              </div>
              <div
                className={`${styles.paymentBG} ${currency === 'usdc' ? styles.selectedCurrency : ''}`}
                onClick={() => setCurrency('usdc')}
              >
                <div className="w-full flex justify-center mt-[26px] mb-[15px]">
                  <Image src={USDCIcon} width={37} height={37} alt="" />
                </div>
                <div className={styles.currencyName}>USDC</div>
              </div>
              <div
                className={`${styles.paymentBG} ${currency === 'card' ? styles.selectedCurrency : ''}`}
                onClick={() => setCurrency('card')}
              >
                <div className="w-full flex justify-center mt-[26px] mb-[15px]">
                  <Image src={CARDIcon} width={37} height={37} alt="" />
                </div>
                <div className={styles.currencyName}>CARD</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Table */}
        {/* <div className="w-full lg:hidden">
          {list.map((item, index) => {
            return (
              <div key={index}>
                <div className={`${styles.tableColor} w-full flex justify-between px-3 mt-[30px]`}>
                  <div className="w-full h-full">
                    <img src={item.url} className="w-[50%] h-[50%]" />
                  </div>
                  <div className={`${styles.value} w-[200px] text-right`}>
                    <p dangerouslySetInnerHTML={{ __html: item.name }} />
                  </div>
                </div>

                <div className="w-full flex flex-col px-3 mt-[30px] mb-[30px]">
                  <div className={styles.value}>{'Shipping\nAddress:'}</div>
                  <div className={`${styles.value} text-left mt-[12px]`}>
                    <p dangerouslySetInnerHTML={{ __html: item.shipping }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div> */}

        {/* SOL / USDC */}
        <div className="w-full h-auto relative lg:hidden mt-[15px] lg:mt-[30px]">
          <div className={styles.paymentMethod}>
            Choose Payment Method <span>*</span>
          </div>
          <div className="w-full flex gap-[30px] mt-[10px]">
            <div
              className={`${styles.paymentBG} ${currency === 'sol' ? styles.selectedCurrency : ''}`}
              onClick={() => setCurrency('sol')}
            >
              <div className="w-full flex justify-center mt-[26px] mb-[15px]">
                <Image src={SolanaLogoIcon} width={43} height={37} alt="" />
              </div>
              <div className={styles.currencyName}>SOL</div>
            </div>
            <div
              className={`${styles.paymentBG} ${currency === 'usdc' ? styles.selectedCurrency : ''}`}
              onClick={() => setCurrency('usdc')}
            >
              <div className="w-full flex justify-center mt-[26px] mb-[15px]">
                <Image src={USDCIcon} width={37} height={37} alt="" />
              </div>
              <div className={styles.currencyName}>USDC</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className="w-full flex justify-between mb-[20px] px-[5px]">
          <div className={styles.orderTotal}>Total</div>
          <div className="flex gap-2 items-center">
            <div className={styles.totalPrice}>${total ? total.toFixed(2) : '---'}</div>
            <div className={styles.costDivider} />
            <div className="flex gap-1 items-center">
              <SolanaIcon alt="" className="mt-[2px]" />
              <div className={styles.totalPrice}>{solAmount ? ensureMaxDecimals(solAmount, 2) : '---'}</div>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-[15px]">
          {isLoad ? (
            <LoadingPrimaryButton fullWidth />
          ) : (
            <PrimaryButton
              disabled={currency.length === 0}
              label="Make Payment"
              type="payment"
              fullWidth
              onClick={() => onCheckout()}
            />
          )}
          <SecondaryButton label="Back" type="back" onClick={onBack} fullWidth />
        </div>
      </div>
      {/* <ProgressingModal open={isLoad} /> */}
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
          setTimeout(() => {
            dispatch({ type: 'set', isLoading: true })
            router.push(`/merch-logs/${id}`)
          }, 1000)
        }}
        data={alertData}
      />
      <FullScreenLoadingModal open={isLoading} />
    </section>
  )
}

export default PhysicalCheckout

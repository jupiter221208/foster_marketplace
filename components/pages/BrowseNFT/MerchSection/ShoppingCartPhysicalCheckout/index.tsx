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
import SolanaIcon from 'assets/icons/solana-logo-dark-small.svg?component'

import { useMetaplex } from 'hooks/useMetaplex'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import TableSection from './TableSection'
import ProgressingModal from 'components/Modal/ProgressingModal'
import Alert from 'components/Alert'
import { findElement, getFirstUpperString } from 'utils/helpers'

// api
import { OrderData, payOrder } from 'apis/merch'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'
import OutlineButton from 'components/Button/OutlineButton'

export interface PhysicalCheckoutProps {
  orderData?: OrderData
  type: string
  total?: number
  onBack: () => any
  onNext?: () => any
}

const ShoppingCartPhysicalCheckout = ({ orderData, onBack, onNext, total }: PhysicalCheckoutProps) => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const isLoading = useSelector<any>(state => state.isLoading)
  const { id } = router.query
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()
  const { metaplex } = useMetaplex()
  const { solToUsdRate, solToUsdWithSlippage, refreshValue } = useSolToUsdRate()

  const [currency, setCurrency] = useState<'sol' | 'usdc'>('sol')
  const [isLoad, setIsLoad] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [list, setList] = useState([])
  const [mobileList, setMobileList] = useState([])
  const [alertData, setAlertData] = useState<any[]>([])
  total ??= orderData?.order.amount
  const solAmount = total && solToUsdRate ? total / solToUsdWithSlippage() : 0

  useEffect(() => {
    setAlertData([
      {
        id: 0,
        title: 'Order Placed!',
        description: 'Your order was placed successfully!',
        description2:
          'Order details will be emailed to the address provided and can also be tracked on the Foster Creator Studio.',
        description3: `Your order number is #${id}.`,
        type: 'success',
      },
    ])
    let shippingData = orderData?.ssorder.shipTo
    let itemShipping = shippingData
      ? shippingData['street1'] +
        ' ' +
        shippingData['street2'] +
        '<br/>' +
        shippingData['city'] +
        ', ' +
        shippingData['state'] +
        ', ' +
        shippingData['postalCode'] +
        '<br/>' +
        shippingData['country']
      : '-'

    let itemList = []
    let mobilelistData = []
    orderData?.ssorder.items.forEach(item => {
      let itemQuantity = item.quantity

      let options = item.options
      var fosterUrl = item.imageUrl
      var type = findElement(options, 'name', 'type')['value']
      var nftName = findElement(options, 'name', 'nftName')['value']
      var name = item.name
      var apparel = findElement(options, 'name', 'apparel')['value']
      var size = findElement(options, 'name', 'size')['value']
      var itemName
      if (type === 'apparel') {
        var color = findElement(options, 'name', 'color')['value']
        itemName =
          nftName +
          '<br/>' +
          apparel +
          ' ' +
          '(' +
          (size === 'S' || size === 'YXS'
            ? 'Small'
            : size === 'M' || size === 'YS'
            ? 'Medium'
            : size === 'L' || size === 'YM'
            ? 'Large'
            : size === 'XL' || size === 'YL'
            ? 'X-Large'
            : size === '2XL' || size === 'YXL'
            ? '2X-Large'
            : '') +
          ')' +
          '<br/>' +
          getFirstUpperString(color) +
          '<br/>' +
          'Qty:' +
          itemQuantity
      } else {
        itemName = nftName + '<br/>' + name + '<br/>' + 'Qty:' + itemQuantity
      }
      itemList.push({ url: fosterUrl, name: itemName, shipping: itemShipping })
      mobilelistData.push({
        url: fosterUrl,
        nftName: nftName,
        size: size,
        color: color,
        quantity: itemQuantity,
        shipping: itemShipping,
        apparel: apparel,
      })
    })
    setList(itemList)
    setMobileList(mobilelistData)
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
      setIsLoad(false)
      if (result) {
        setTimeout(() => {
          setShowAlert(true)
        }, 1000)
      }
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles.summary}>Order Summary</div>
      <div className="mt-[20px] hidden lg:block">
        <TableSection data={list} />
      </div>
      <div className="w-full flex-wrap h-auto flex gap-[30px] lg:mt-[24px]">
        <div className="w-[286px] h-[160px] relative hidden lg:block">
          <div className={styles.paymentMethod}>Choose Payment Method*</div>
          <div className="w-full flex justify-between mt-[16px]">
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

      {/* Mobile Table */}
      <div className="w-full lg:hidden">
        <div className="flex flex-col overflow-auto mt-[20px]">
          {list.map((item, index) => (
            <div key={index} className={styles.tableColor}>
              <div className="w-full flex justify-between px-2 py-2">
                <div className="w-full h-full flex items-center ml-[10px]">
                  <img src={item?.url} className="w-[50%] h-[50%] px-2 py-2" />
                </div>
                <div className={`${styles.value} w-full text-right mr-[10px]`}>
                  <p dangerouslySetInnerHTML={{ __html: item.name }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col px-3 mt-[30px] mb-[30px]">
          <div className={styles.shipping}>{'Shipping\nAddress:'}</div>
          <div className={`${styles.shipping} text-left mt-[12px]`}>
            <p dangerouslySetInnerHTML={{ __html: list[0]?.shipping }} />
          </div>
        </div>
      </div>

      {/* SOL / USDC */}
      <div className="w-full h-auto relative lg:hidden mt-[30px]">
        <div className={styles.paymentMethod}>Choose Payment Method*</div>
        <div className="w-full flex justify-between mt-[16px]">
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

      <div className="w-full mt-[80px]">
        <div className="w-full flex justify-between mb-[30px] px-[5px]">
          <div className={styles.orderTotal}>TOTAL</div>
          <div className="flex gap-2 items-center">
            <div className={styles.totalPrice}>${total ? total.toFixed(2) : '---'}</div>
            <div className={styles.costDivider} />
            <div className="flex gap-1 items-center">
              <SolanaIcon alt="" />
              <div className={styles.totalPrice}>{solAmount ? ensureMaxDecimals(solAmount, 2) : '---'}</div>
            </div>
          </div>
        </div>
        <div className="w-full flex gap-[30px]">
          <OutlineButton
            label="Back"
            onClick={onBack}
            fullWidth
            fontFamily="Muli-SemiBold"
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53}
            borderColor={'rgba(var(--main-bg-color-rgb), 0.1)'}
            color={'var(--text-gray-200-color)'}
          />
          <GradientButton
            disabled={currency.length === 0}
            label="Place Order"
            fullWidth
            fontFamily="Muli-SemiBold"
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53}
            fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 15 : 18}
            onClick={() => onCheckout()}
          />
        </div>
      </div>
      <ProgressingModal open={isLoad} />
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

export default ShoppingCartPhysicalCheckout

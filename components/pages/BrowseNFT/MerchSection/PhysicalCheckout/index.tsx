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
import ArrowLeftIcon from 'assets/icons/arrow-left-smallest.svg?component'
import ArrowLeftIconMobile from 'assets/icons/arrow-left-medium-mobile.svg?component'
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

export interface PhysicalCheckoutProps {
  orderData?: OrderData
  type: string
  total?: number
  onBack: () => any
  onNext?: () => any
}

const PhysicalCheckout = ({ orderData, onBack, onNext, total }: PhysicalCheckoutProps) => {
  const SOL_USD_SLIPPAGE = 0.98
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const isLoading = useSelector<any>(state => state.isLoading)
  const { id } = router.query
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()
  const { metaplex } = useMetaplex()
  const { solToUsdRate, refreshValue } = useSolToUsdRate()

  const [currency, setCurrency] = useState<'sol' | 'usdc'>('sol')
  const [isLoad, setIsLoad] = useState(false)
  const [showAlert, setShowAlert] = useState(true)
  const [list, setList] = useState([])
  const [alertData, setAlertData] = useState<any[]>([])
  total ??= orderData?.order.amount
  const solAmount = total && solToUsdRate ? total / (solToUsdRate * SOL_USD_SLIPPAGE) : 0

  useEffect(() => {
    setAlertData([
      {
        id: 0,
        title: 'Order Placed!',
        description: 'Your order was placed successfully!',
        description2:
          'Order details will be emailed to the address provided and can also be tracked on the Foster Merch Hub.',
        description3: `Your order number is #${id}.`,
        type: 'success',
      },
    ])

    let shippingData = orderData?.ssorder.shipTo
    let itemShipping =
      shippingData['street1'] +
      '<br/>' +
      shippingData['city'] +
      ', ' +
      shippingData['state'] +
      ', ' +
      shippingData['postalCode'] +
      '<br/>' +
      shippingData['country']

    let itemList = []
    orderData?.ssorder.items.forEach(item => {
      let itemQuantity = item.quantity
      let options = item.options
      var type = findElement(options, 'name', 'type')['value']
      var nftName = findElement(options, 'name', 'nftName')['value']
      var name = item.name
      var size = findElement(options, 'name', 'size')['value']
      var itemName
      if (type === 'apparel') {
        var color = findElement(options, 'name', 'color')['value']
        itemName = nftName + '<br/>' + name + ' (' + size + ')' + '<br/>' + getFirstUpperString(color)
      } else {
        itemName = nftName + '<br/>' + name + ' (' + size + ')'
      }
      itemList.push({ name: itemName, quantity: itemQuantity, shipping: itemShipping })
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
      else if (items.length > 1)
        throw new Error(`shipstation order ${order.id} has more than one item: ${items.length}`)

      let nftAddress = items[0].options.find(({ name }) => name == 'nftAddress')?.value
      if (!nftAddress) throw new Error(`nftAddress missing in: order ${order.id} item ${items[0].orderItemId}`)

      let transaction = await createPaymentTransaction({
        metaplex,
        nftAddress,
        usdAmounts: {
          maddiesAmount: order.maddies_cost + order.shipping_amount,
          fosterAmount: order.foster_commission + order.tax_amount,
          artistAmount: order.artist_commission,
        },
        solToUsdRate: (await refreshValue()) * SOL_USD_SLIPPAGE,
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
      <div className="flex gap-[15px] mt-[20px] items-center">
        <div className={styles.backBG} onClick={onBack}>
          <div className="hidden lg:flex mr-[2px]">
            <ArrowLeftIcon alt="" />
          </div>
          <div className="flex lg:hidden">
            <ArrowLeftIconMobile alt="" />
          </div>
        </div>
        <div className={styles.selecteCategory}>Checkout</div>
      </div>

      <div className="mt-[20px] hidden lg:block">
        <TableSection data={list} />
      </div>
      <div className="lg:flex hidden">
        <div className={styles.tableDivider} />
      </div>

      <div className="w-full flex-wrap h-auto flex gap-[30px] mt-[24px]">
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
      <div className="w-full mt-[30px] lg:hidden">
        <div className={styles.tableHeader}>
          <div>Order</div>
          <div>Details</div>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index}>
              <div className="w-full flex justify-between px-3 mt-[30px]">
                <div className={styles.value}>Item</div>
                <div className={`${styles.value} w-[200px] text-right`}>
                  <p dangerouslySetInnerHTML={{ __html: item.name }} />
                </div>
              </div>
              <div className="w-full flex justify-between px-3 mt-[30px]">
                <div className={styles.value}>Quantity</div>
                <div className={styles.value}>{item.quantity}</div>
              </div>

              <div className="w-full flex justify-between px-3 mt-[30px] mb-[30px]">
                <div className={styles.value}>{'Shipping\nAddress'}</div>
                <div className={`${styles.value} w-[200px] text-right`}>
                  <p dangerouslySetInnerHTML={{ __html: item.shipping }} />
                </div>
              </div>
            </div>
          )
        })}
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
        <GradientButton
          disabled={currency.length === 0}
          label="Place Order"
          fullWidth
          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53}
          fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 15 : 18}
          onClick={() => onCheckout()}
        />
      </div>
      <ProgressingModal open={isLoad} />
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
          dispatch({ type: 'set', isLoading: true })
          router.push(`/merch-logs/${id}`)
        }}
        data={alertData}
      />
      <FullScreenLoadingModal open={isLoading} />
    </section>
  )
}

export default PhysicalCheckout

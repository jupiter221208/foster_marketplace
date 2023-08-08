import React, { useState, useEffect } from 'react'

// next components
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import Image from 'next/image'

// custom functions
import { useViewport, ensureMaxDecimals } from 'utils'
import { createPaymentTransaction } from 'utils/merch'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'

// json
import DomesticType from 'assets/json/print/domestic-ship.json'
import InternationType from 'assets/json/print/international-ship.json'

// images
import SolanaLogoIcon from 'assets/icons/solana-logo-original.svg'
import USDCIcon from 'assets/icons/usdc-icon.svg'
import ArrowLeftIcon from 'assets/icons/arrow-left-medium.svg?component'
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
  const { id } = router.query
  const dispatch = useDispatch()
  const { metaplex } = useMetaplex()
  const { solToUsdRate, refreshValue } = useSolToUsdRate()

  const [currency, setCurrency] = useState<'sol' | 'usdc'>('sol')
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [list, setList] = useState([])
  const [alertData, setAlertData] = useState<any[]>([])

  total ??= orderData.order.amount
  const solAmount = total && solToUsdRate ? total / (solToUsdRate * SOL_USD_SLIPPAGE) : 0

  useEffect(() => {
    setAlertData([
      {
        id: 0,
        title: 'PlaceOrder Success!',
        description: 'You placed the order successfully.',
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
      var color = findElement(options, 'name', 'color')['value']
      var itemName = nftName + '<br/>' + name + ' (' + size + ')' + '<br/>' + getFirstUpperString(color)
      itemList.push({ name: itemName, quantity: itemQuantity, shipping: itemShipping })
    })

    setList(itemList)
    // let name = ''
    // if (type === 'apparel') {
    //   name =
    //     nftName +
    //     '<br/>' +
    //     data['apparel'].description +
    //     ' (' +
    //     data['size'].name +
    //     ')' +
    //     '<br/>' +
    //     getFirstUpperString(data['color'].type)
    // } else {
    //   name =
    //     nftName +
    //     '<br/>' +
    //     getFirstUpperString(data.print.type) +
    //     ' (' +
    //     getFirstUpperString(data.orientation.type) +
    //     ')<br/>' +
    //     data.size.width +
    //     ' x ' +
    //     data.size.height
    // }
  }, [])

  const onCheckout = async () => {
    setIsLoading(true)
    let result = false
    try {
      let transactionBuilder = await createPaymentTransaction({
        metaplex,
        usdAmount: total,
        solToUsdRate: (await refreshValue()) * SOL_USD_SLIPPAGE,
        currency,
      })
      let {
        response: { signature },
      } = await transactionBuilder.sendAndConfirm(metaplex)

      // TODO: send signature to backend and update order
      let params = {
        payment_method: currency.toUpperCase(),
        payment_reference: signature,
      }
      let response = await payOrder(id, params)
      if (response?.status === 'success') result = true
      else result = false
    } finally {
      setIsLoading(false)
      if (result === true) {
        setShowAlert(true)
      }
    }
  }

  return (
    <section className={styles.container}>
      <div className="flex gap-[15px] mt-[20px] items-center">
        <div className={styles.backBG} onClick={onBack}>
          <div className="hidden lg:flex">
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
      <div className={styles.tableDivider} />

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

      <div className="w-full mt-[60px]">
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
      <ProgressingModal open={isLoading} />
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
          setTimeout(() => {
            router.push('/')
          }, 1000)
        }}
        data={alertData}
      />
    </section>
  )
}

export default PhysicalCheckout

import React, { useState, useEffect } from 'react'

// next components
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import Image from 'next/image'

// custom functions
import { useViewport, fetchSolToUsdRate, ensureMaxDecimals } from 'utils'

// json
import DomesticType from 'assets/json/print/domestic-ship.json'
import InternationType from 'assets/json/print/international-ship.json'

// images
import SolanaLogoIcon from 'assets/icons/solana-logo-original.svg'
import USDCIcon from 'assets/icons/usdc-icon.svg'
import ArrowLeftIcon from 'assets/icons/arrow-left-medium.svg?component'
import ArrowLeftIconMobile from 'assets/icons/arrow-left-medium-mobile.svg?component'
import SolanaIcon from 'assets/icons/solana-logo-dark-small.svg?component'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import TableSection from './TableSection'
import ProgressingModal from 'components/Modal/ProgressingModal'
import Alert from 'components/Alert'
import { getFirstUpperString } from 'utils/helpers'

// api

const PhysicalCheckout = props => {
  const { onBack, onNext, data, shippingData, nftName, type, total } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [currency, setCurrency] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [list, setList] = useState([])
  const [alertData, setAlertData] = useState<any[]>([])
  const [solToUsdRate, setSolToUsdRate] = useState(null)

  useEffect(() => {
    setAlertData([
      {
        id: 0,
        title: 'PlaceOrder Success!',
        description: 'You placed the order successfully.',
        type: 'success',
      },
    ])
    if (!data) return
    let name = ''
    if (type === 'apparel') {
      name =
        nftName +
        '<br/>' +
        data['apparel'].description +
        ' (' +
        data['size'].name +
        ')' +
        '<br/>' +
        getFirstUpperString(data['color'].type)
    } else {
      name =
        nftName +
        '<br/>' +
        getFirstUpperString(data.print.type) +
        ' (' +
        getFirstUpperString(data.orientation.type) +
        ')<br/>' +
        data.size.width +
        ' x ' +
        data.size.height
    }
    let quantity = data['quantity']
    let shipping =
      shippingData['street'] +
      '<br/>' +
      shippingData['city'] +
      ', ' +
      shippingData['state'].name +
      ', ' +
      shippingData['zipCode'] +
      '<br/>' +
      shippingData['country'].name

    setList([{ name, quantity, shipping }])

    fetchSolToUsdRate().then(setSolToUsdRate)
  }, [])

  const onCheckout = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => {
        setShowAlert(true)
      }, 500)
    }, 3000)
  }

  const isUniteState = () => {
    let country = shippingData['country'].name.toLowerCase()
    return country.includes('united state')
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
              <div className={styles.totalPrice}>
                {total && solToUsdRate ? ensureMaxDecimals(total / solToUsdRate, 2) : '---'}
              </div>
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
        }}
        data={alertData}
      />
    </section>
  )
}

export default PhysicalCheckout

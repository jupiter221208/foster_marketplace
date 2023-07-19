import React, { useState, useEffect } from 'react'

// next components
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// json
import DomesticType from 'assets/json/print/domestic-ship.json'
import InternationType from 'assets/json/print/international-ship.json'

// images
import SolanaLogoIcon from 'assets/icons/solana-logo-original.svg'
import USDCIcon from 'assets/icons/usdc-icon.svg'
import ArrowLeftIcon from 'assets/icons/arrow-left-medium.svg?component'
import ArrowLeftIconMobile from 'assets/icons/arrow-left-medium-mobile.svg?component'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import ProgressingModal from 'components/Modal/ProgressingModal'
import Alert from 'components/Alert'
import { getFirstUpperString } from 'utils/helpers'
import ShippingSelect from 'components/Select/ShippingSelect'

// api

const PhysicalShippingMethod = props => {
  const { onBack, onNext, data, shippingData, shippingMethod, nftName, type } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [currency, setCurrency] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [list, setList] = useState([])
  const [alertData, setAlertData] = useState<any[]>([])
  const [shipping, setShipping] = useState(null)
  const [shippingMethods, setShippingMethods] = useState(null)
  const [tax, setTax] = useState(null)
  const [total, setTotal] = useState(null)

  useEffect(() => {
    setAlertData([
      {
        id: 0,
        title: 'Checkout Success!',
        description: 'You purchased the apparel successfully.',
        type: 'success',
      },
    ])

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

    if (isUniteState()) {
      let methods = shippingMethod.shippingMethods.filter(
        item =>
          item.serviceName === 'USPS Priority Mail - Package' ||
          item.serviceName === 'USPS Priority Mail Express - Package'
      )
      setShippingMethods(methods)
    }
  }, [])

  useEffect(() => {
    if (shipping) {
      let tax = Math.floor(shipping.shipmentCost * shippingMethod.taxPercent) / 100
      let total = parseFloat(data.cost) + shipping.shipmentCost + tax

      setTax(tax)
      setTotal(total)
    }
  }, [shipping])

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
        <div className={styles.selecteCategory}>Select Shipping Method</div>
      </div>
      <div className="mt-[45px]">
        <div className={styles.shippingMethod}>Shipping Method*</div>
      </div>
      <div className="mt-[12px]">
        <ShippingSelect
          data={shippingMethods}
          selected={shipping}
          onChange={item => setShipping(item)}
          maxHeight="none"
        />
      </div>
      <div className="w-full h-auto gap-[30px] mt-[24px]">
        <div className="w-full h-[330px] relative">
          <div className={styles.orderView}>
            <div className="w-full flex items-center gap-[10px] -ml-[11px]">
              <div className={styles.orderTicket}></div>
              <div className={styles.orderTotal}>ORDER TOTAL</div>
            </div>
            <div className="w-full flex justify-between mt-[20px]">
              <div className={styles.orderTotal}>SUBTOTAL</div>
              <div className={styles.totalPrice}>${data.cost}</div>
            </div>
            <div className={`${styles.divider} mt-[15px]`} />
            <div className="w-full flex justify-between mt-[15px]">
              <div className={styles.orderTotal}>
                SHIPPING AND
                <br />
                HANDLING
              </div>
              <div className={styles.subPrice}>
                <div>Shipping: ${shipping ? shipping.shipmentCost : '---'}</div>
                {/* <div className="mt-[20px]">Handling Fee: ${shipping ? shipping.otherCost : '---'}</div> */}
                <div className="mt-[20px]">Tax: ${tax ? tax.toFixed(2) : '---'}</div>
              </div>
            </div>
            <div className={`${styles.divider} mt-[15px]`} />
            <div className="w-full flex justify-between mt-[20px]">
              <div className={styles.orderTotal}>TOTAL</div>
              <div className={styles.totalPrice}>${total ? total.toFixed(2) : '---'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-[30px]">
        <GradientButton
          disabled={!total}
          label="Proceed to Checkout"
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

export default PhysicalShippingMethod

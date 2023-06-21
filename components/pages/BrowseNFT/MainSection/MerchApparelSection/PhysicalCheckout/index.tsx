import React, { useState, useEffect } from 'react'

// next components
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// json

// images
import SolanaLogoIcon from 'assets/icons/solana-logo-original.svg'
import USDCIcon from 'assets/icons/usdc-icon.svg'
import ArrowLeftIcon from 'assets/icons/arrow-left-medium.svg?component'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import TableSection from './TableSection'
import ProgressingModal from 'components/Modal/ProgressingModal'
import Alert from 'components/Alert'
import { getFirstUpperString } from 'utils/helpers'

// api

const PhysicalCheckout = props => {
  const { onBack, onNext, apparelData, shippingData, nftName } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [currency, setCurrency] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [list, setList] = useState([])
  const [alertData, setAlertData] = useState<any[]>([])

  useEffect(() => {
    setAlertData([
      {
        id: 0,
        title: 'Checkout Success!',
        description: 'You purchased the apparel successfully.',
        type: 'success',
      },
    ])

    let name =
      nftName +
      '<br/>' +
      apparelData['apparel'].description +
      ' (' +
      apparelData['size'].name +
      ')' +
      '<br/>' +
      getFirstUpperString(apparelData['color'].type)
    let quantity = apparelData['quantity']
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

  return (
    <section className={styles.container}>
      <div className="flex gap-[15px] mt-[20px] items-center">
        <div className={styles.backBG} onClick={onBack}>
          <ArrowLeftIcon alt="" />
        </div>
        <div className={styles.selecteCategory}>Checkout</div>
      </div>
      <div className="w-full flex-wrap h-auto flex gap-[30px] mt-[24px]">
        <div className="w-[370px] h-[330px] relative">
          <div className={styles.orderView}>
            <div className="w-full flex items-center gap-[10px] -ml-[11px]">
              <div className={styles.orderTicket}></div>
              <div className={styles.orderTotal}>ORDER TOTAL</div>
            </div>
            <div className="w-full flex justify-between mt-[20px]">
              <div className={styles.orderTotal}>SUBTOTAL</div>
              <div className={styles.totalPrice}>${apparelData.cost}</div>
            </div>
            <div className={`${styles.divider} mt-[15px]`} />
            <div className="w-full flex justify-between mt-[15px]">
              <div className={styles.orderTotal}>
                SHIPPING AND
                <br />
                HANDLING
              </div>
              <div className={styles.subPrice}>
                <div>Shipping: $---</div>
                <div className="mt-[20px]">Handling Fee: $---</div>
                <div className="mt-[20px]">Tax: $---</div>
              </div>
            </div>
            <div className={`${styles.divider} mt-[15px]`} />
            <div className="w-full flex justify-between mt-[20px]">
              <div className={styles.orderTotal}>TOTAL</div>
              <div className={styles.totalPrice}>$ ---</div>
            </div>
          </div>
        </div>
        <div className="w-[286px] h-[160px] relative">
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
      <div className="mt-[20px]">
        <TableSection data={list} />
      </div>
      <div className={styles.tableDivider} />
      <div className="absolute bottom-8 left-10 right-10 flex gap-[30px]">
        <GradientButton
          disabled={currency.length === 0}
          label="Proceed to Checkout"
          fontSize={18}
          fullWidth
          height={53}
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

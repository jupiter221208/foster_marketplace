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

// api

const PhysicalCheckout = props => {
  const { onBack } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [enabled, setEnabled] = useState(false)
  const [currency, setCurrency] = useState('')
  const list = [
    {
      name: 'Cage of Conscience T-Shirt (Medium) White',
      quantity: 1,
      shipping: '1234 Dragonsville Ave. Phoenix, AZ 12345, United States',
    },
  ]
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
            <div className="w-full flex gap-[15px]">
              <div className={styles.orderTicket}></div>
              <div className={styles.orderTotal}>ORDER TOTAL</div>
            </div>
            <div className="w-full flex justify-between mt-[20px]">
              <div className={styles.orderTotal}>SUBTOTAL</div>
              <div className={styles.totalPrice}>$26.15</div>
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
      <div className="w-full mt-[40px] flex gap-[30px]">
        <GradientButton
          disabled={!enabled}
          label="Proceed to Checkout"
          fontSize={18}
          fullWidth
          height={53}
          onClick={() => {}}
        />
      </div>
    </section>
  )
}

export default PhysicalCheckout

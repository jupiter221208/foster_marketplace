import React, { useState, useEffect } from 'react'

// next components
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// custom functions
import { useViewport } from 'utils'

// json

// images
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import ArrowLeftIcon from 'assets/icons/arrow-left-medium.svg?component'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'

// api

const PhysicalCheckout = props => {
  const { onBack } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [enabled, setEnabled] = useState(false)

  return (
    <section className={styles.container}>
      <div className="flex gap-[15px] mt-[20px] items-center">
        <div className={styles.backBG} onClick={onBack}>
          <ArrowLeftIcon alt="" />
        </div>
        <div className={styles.selecteCategory}>Checkout</div>
      </div>
      <div className="w-full flex-wrap h-auto flex gap-[15px] mt-[48px]">
        <div className="w-[370px] h-[390px] relative">
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
                <div className="mt-[30px]">Handling Fee: $---</div>
                <div className="mt-[30px]">Tax: $---</div>
              </div>
            </div>
            <div className={`${styles.divider} mt-[15px]`} />
            <div className="w-full flex justify-between mt-[20px]">
              <div className={styles.orderTotal}>TOTAL</div>
              <div className={styles.totalPrice}>$ ---</div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-[50px] flex gap-[30px]">
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

import React, { useEffect, useState } from 'react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

const StudioCreateSection = () => {
  const viewport = useViewport()
  const dispatch = useDispatch()
  const router = useRouter()
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <div className="flex gap-[20px] items-center mt-[-10px]">
          <div className={styles.number}>1</div>
          <div>
            <div className={styles.title}>DESIGN & CREATE</div>
            <div className={styles.desc}>
              it&apos;s simple and intuitive to create merch, just select a garment and place the artwork
            </div>
          </div>
        </div>
        <div className={styles.border} />
        <div className={styles.button}>Risk Free</div>
      </div>
      <div className={styles.card}>
        <div className="flex gap-[20px] items-center">
          <div className={styles.number}>2</div>
          <div>
            <div className={styles.title}>BUY OR SELL</div>
            <div className={styles.desc}>buy from your favorite artists or enable studio and sell to your fans</div>
          </div>
        </div>
        <div className={styles.border} />
        <div className={styles.button}>No Minimum Orders</div>
      </div>
      <div className={styles.card}>
        <div className="flex gap-[20px] items-center">
          <div className={styles.number}>3</div>
          <div>
            <div className={styles.title}>WE PRINT & SHIP</div>
            <div className={styles.desc}>stress-free, on-demand production and fulfillment, globally</div>
          </div>
        </div>
        <div className={styles.border} />
        <div className={styles.button}>Scale your brand</div>
      </div>

      <div className="w-full lg:w-auto h-full flex justify-center lg:justify-end items-center lg:my-0 my-[30px]">
        <GradientButton
          label="Get Started"
          backgroundColor01="var(--main-icon-color)"
          backgroundColor02="var(--main-icon-color)"
          color="var(--background-main-color)"
          width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 124 : 144}
          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 40 : 54}
          borderRadius={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 20 : 27}
          fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 16 : 18}
          onClick={() => {
            if (connected) {
              dispatch({ type: 'set', activeTab: 1 })
              router.push(`/merch-logs`)
            } else {
              setVisible(true)
            }
          }}
        />
      </div>
    </section>
  )
}

export default StudioCreateSection

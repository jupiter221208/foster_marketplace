import React from 'react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// custom functions
import { useAuthentication } from 'hooks/useAuthentication'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import { useRouter } from 'next/router'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

const StudioCreateSection = () => {
  const router = useRouter()
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()
  const { profileInfo } = useAuthentication()

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <div className="flex gap-[20px] items-center mt-[-10px]">
          <div className={styles.number}>1</div>
          <div>
            <div className={styles.title}>DESIGN & CREATE</div>
            <div className={styles.desc}>creating merch is simple, just select a garment and add your designs</div>
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
            <div className={styles.desc}>buy signature merch from your favorite artists or sell to your fans</div>
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
        <div className="sm:hidden block w-full px-[16px]">
          <GradientButton
            label="Get Started"
            backgroundColor01="var(--main-icon-color)"
            backgroundColor02="var(--main-icon-color)"
            color="var(--background-main-color)"
            fullWidth
            height={54}
            borderRadius={27}
            fontSize={18}
            onClick={() => {
              if (connected) {
                router.push(`/${profileInfo?.username}/merch`)
              } else {
                setVisible(true)
              }
            }}
          />
        </div>
        <div className="sm:block hidden">
          <GradientButton
            label="Get Started"
            backgroundColor01="var(--main-icon-color)"
            backgroundColor02="var(--main-icon-color)"
            color="var(--background-main-color)"
            width={144}
            height={54}
            borderRadius={27}
            fontSize={18}
            onClick={() => {
              if (connected) {
                router.push(`/${profileInfo?.username}/merch`)
              } else {
                setVisible(true)
              }
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default StudioCreateSection

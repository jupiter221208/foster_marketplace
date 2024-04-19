import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Image from 'next/image'

// images
import MerchImage from 'assets/images/home-shop-merch.png'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import { useViewport } from 'utils'

const ShopMerchSection = props => {
  const router = useRouter()
  const viewport = useViewport()
  return (
    <section className={styles.container}>
      <div className={styles.imageArea}>
        <Image src={MerchImage} alt="" width={593} height={776} />
      </div>
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="mt-[60px] lg:mt-[130px]">
          <div className={styles.shopTitle}>Shop merch from your favorite artists</div>
          <div className="mt-[25px] w-full flex justify-center">
            <GradientButton
              width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 120 : 140}
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 40 : 50}
              borderRadius={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 20 : 25}
              fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 16 : 18}
              label="Buy Merch"
              color="var(--background-main-color)"
              borderColor="transparent"
              backgroundColor01="var(--main-icon-color)"
              backgroundColor02="var(--main-icon-color)"
              onClick={() => router.push('/studio')}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShopMerchSection

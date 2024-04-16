import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Image from 'next/image'

// images
import MerchImage from 'assets/images/home-shop-merch.png'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'

const ShopMerchSection = props => {
  const router = useRouter()
  return (
    <section className={styles.container}>
      <div className="w-full opacity-[25%] h-[877px] flex items-center justify-center">
        <Image src={MerchImage} alt="" width={593} height={776} />
      </div>
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="mt-[130px]">
          <div className={styles.shopTitle}>Shop merch from your favorite artists</div>
          <div className="mt-[25px] w-full flex justify-center">
            <GradientButton
              width={140}
              height={50}
              borderRadius={25}
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

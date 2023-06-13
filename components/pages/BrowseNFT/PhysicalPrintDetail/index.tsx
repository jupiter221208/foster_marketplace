import React, { useState, useEffect } from 'react'

// next components
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import Image from 'next/image'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components

// custom functions
import { useViewport } from 'utils'

// json

// images
import ArrowLeftIcon from 'assets/icons/arrow-left-medium.svg?component'
import ArrowRightEllipse from 'assets/icons/arrow-right-ellipse.svg?component'
import PrintApparelImage from 'assets/images/print_apparel.png'
import PrintWallArtImage from 'assets/images/print_wallart.png'
import PrintAccessoriesImage from 'assets/images/print_accessories.png'

// styles
import styles from './index.module.scss'

// api

const PhysicalPrintDetail = props => {
  const { image, onBack } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  return (
    <section className={styles.container}>
      <div className="flex gap-[15px] mt-[20px] items-center">
        <div className={styles.backBG} onClick={onBack}>
          <ArrowLeftIcon alt="" />
        </div>
        <div className={styles.selecteCategory}>Cage of Conscience - Apparel</div>
      </div>
    </section>
  )
}

export default PhysicalPrintDetail

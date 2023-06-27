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
import ArrowLeftIconMobile from 'assets/icons/arrow-left-medium-mobile.svg?component'
import ArrowRightEllipse from 'assets/icons/arrow-right-ellipse.svg?component'
import PrintApparelImage from 'assets/images/print_apparel.png'
import PrintWallArtImage from 'assets/images/print_wallart.png'
import PrintAccessoriesImage from 'assets/images/print_accessories.png'

// styles
import styles from './index.module.scss'

// api

const PrintCategorySection = props => {
  const { image, onBack, onDetail } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [collectionList, setCollectionList] = useState([])

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
        <div className={styles.selecteCategory}>Select Category</div>
      </div>
      <div className="w-full flex-wrap h-auto flex gap-[15px] mt-[48px]">
        <div className="w-[220px] h-[220px] relative rounded-[10px] overflow-hidden">
          <Image src={PrintApparelImage} alt="" />
          <div className={styles.bottomView}>
            <div className={styles.cardTitle}>Apparel</div>
            <div onClick={() => onDetail('apparel')}>
              <ArrowRightEllipse alt="" />
            </div>
          </div>
        </div>
        <div className="w-[220px] h-[220px] relative rounded-[10px] overflow-hidden">
          <Image src={PrintWallArtImage} alt="" />
          <div className={styles.bottomView}>
            <div className={styles.cardTitle}>Wall Art</div>
            <div onClick={() => onDetail('wall')}>
              <ArrowRightEllipse alt="" />
            </div>
          </div>
        </div>
        <div className="w-[220px] h-[220px] relative rounded-[10px] overflow-hidden">
          <Image src={PrintAccessoriesImage} alt="" />
          <div className={styles.bottomView}>
            <div className={styles.cardTitle}>Accessories</div>
            <div onClick={() => onDetail('accessories')}>
              <ArrowRightEllipse alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PrintCategorySection

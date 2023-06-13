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
import PrintGenderType from 'assets/json/print/gender.json'

// images
import ArrowLeftIcon from 'assets/icons/arrow-left-medium.svg?component'
import ArrowRightEllipse from 'assets/icons/arrow-right-ellipse.svg?component'
import PrintApparelImage from 'assets/images/print_apparel.png'
import PrintWallArtImage from 'assets/images/print_wallart.png'
import PrintAccessoriesImage from 'assets/images/print_accessories.png'

// styles
import styles from './index.module.scss'
import Selection from 'components/Selection'

// api

const PhysicalPrintDetail = props => {
  const { image, onBack } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [gender, setGender] = useState('')

  return (
    <section className={styles.container}>
      <div className="flex gap-[15px] mt-[20px] items-center">
        <div className={styles.backBG} onClick={onBack}>
          <ArrowLeftIcon alt="" />
        </div>
        <div className={styles.selecteCategory}>Cage of Conscience - Apparel</div>
      </div>
      <div className={styles.description}>
        Creator apparel is an excellent way to support your favorite artists and help them promote their brand. Foster
        is on a mission to help creators monetize their intellectual property in more than one way. Our Design Studio is
        simple to use and gives you the tools to foster your creative flavor.
      </div>
      <div className="w-full mt-[65px]">
        {/* <Selection label="GENDER:" data={PrintGenderType} selected={gender} onSelect={item => setGender(item)} /> */}
      </div>
    </section>
  )
}

export default PhysicalPrintDetail

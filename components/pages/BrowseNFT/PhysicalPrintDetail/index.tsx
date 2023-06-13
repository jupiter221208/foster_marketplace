import React, { useState, useEffect } from 'react'

// next components
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

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
import GenderType from 'assets/json/print/gender.json'
import ApparelType from 'assets/json/print/apparel.json'
import PrintType from 'assets/json/print/print.json'
import QualityType from 'assets/json/print/quality.json'
import SizeType from 'assets/json/print/size.json'
import ColorType from 'assets/json/print/color.json'

// images
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import ArrowLeftIcon from 'assets/icons/arrow-left-medium.svg?component'
import ArrowRightEllipse from 'assets/icons/arrow-right-ellipse.svg?component'
import PrintApparelImage from 'assets/images/print_apparel.png'
import PrintWallArtImage from 'assets/images/print_wallart.png'
import PrintAccessoriesImage from 'assets/images/print_accessories.png'

// styles
import styles from './index.module.scss'
import Selection from 'components/Selection'
import SelectionColor from 'components/SelectionColor'
import Input from 'components/Input'
import GradientButton from 'components/Button/GradientButton'
import SecondaryButton from 'components/Button/SecondaryButton'

// api

const PhysicalPrintDetail = props => {
  const { image, onBack } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [gender, setGender] = useState('')
  const [apparel, setApparel] = useState('')
  const [print, setPrint] = useState('')
  const [quality, setQuality] = useState('')
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [enabled, setEnabled] = useState(false)

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
        <Selection label="GENDER:" data={GenderType} selected={gender} onSelect={item => setGender(item)} />
      </div>
      <div className="w-full mt-[25px]">
        <Selection label="APPAREL:" data={ApparelType} selected={apparel} onSelect={item => setApparel(item)} />
      </div>
      <div className="w-full mt-[25px]">
        <Selection label="PRINT:" data={PrintType} selected={print} onSelect={item => setPrint(item)} />
      </div>
      <div className="w-full mt-[25px]">
        <Selection label="QUALITY:" data={QualityType} selected={quality} onSelect={item => setQuality(item)} />
      </div>
      <div className="w-full mt-[25px]">
        <SelectionColor label="COLOR:" data={ColorType} selected={color} onSelect={item => setColor(item)} />
      </div>
      <div className="w-full mt-[25px]">
        <Selection label="SIZE:" data={SizeType} selected={size} onSelect={item => setSize(item)} />
      </div>
      <div className="w-full mt-[25px] flex">
        <div className={styles.quantity}>QUANTITY:</div>
        <input type="number" min="0" placeholder="0" className={styles.inputArea} />
      </div>
      <div className="w-full mt-[60px] flex">
        <div className={styles.subTotal}>Subtotal:</div>
        <div className="flex ml-[20px] items-center">
          <div className={styles.price}>$ ----</div>
          <div className={styles.separator}></div>
          <div className="flex gap-[10px] items-center">
            <SolanaLogoIcon alt="" />
            <div className={styles.price}>----</div>
          </div>
        </div>
      </div>
      <div className="w-full mt-[50px] flex gap-[30px]">
        <SecondaryButton
          backgroundColor="transparent"
          label="Generate Preview"
          onClick={() => {}}
          fullWidth
          height="53px"
          fontSize="18px"
          color={enabled ? '#eff0f6' : '#818181'}
          borderColor={'#202427'}
        />
        <GradientButton disabled={!enabled} label="Next" fontSize={18} fullWidth height={53} onClick={() => {}} />
      </div>
    </section>
  )
}

export default PhysicalPrintDetail

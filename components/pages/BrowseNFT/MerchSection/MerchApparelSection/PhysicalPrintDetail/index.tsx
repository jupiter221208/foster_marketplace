import React, { useState, useEffect } from 'react'

// next components

// components

// custom functions

// json
import GenderType from 'assets/json/print/gender.json'
import ApparelType from 'assets/json/print/apparel.json'
import PrintType from 'assets/json/print/print.json'
import QualityType from 'assets/json/print/quality.json'
import SizeType from 'assets/json/print/size.json'
import ColorType from 'assets/json/print/color.json'

// images
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import ArrowLeftIcon from 'assets/icons/arrow-left-smallest.svg?component'
import ArrowLeftIconMobile from 'assets/icons/arrow-left-medium-mobile.svg?component'

// styles
import styles from './index.module.scss'
import Selection from 'components/Selection'
import SelectionColor from 'components/SelectionColor'
import GradientButton from 'components/Button/GradientButton'
import { useViewport } from 'utils'
import ApparelSection from '../ApparelSection'

// api

const PhysicalPrintDetail = props => {
  const { onBack, onPrint, onShipping, data, setData, nftName, nftCoverUrl, subCategory } = props
  const viewport = useViewport()
  const [gender, setGender] = useState({ name: '', type: '' })
  const [apparel, setApparel] = useState({ name: '' })
  const [print, setPrint] = useState({ name: '', type: '' })
  const [quality, setQuality] = useState({ name: '', type: '' })
  const [size, setSize] = useState({ name: '' })
  const [color, setColor] = useState({ name: '', type: '' })
  const [quantity, setQuantity] = useState(1)
  const [enabled, setEnabled] = useState(false)
  const [apparelType, setApparelType] = useState(ApparelType)
  const [qualityType, setQualityType] = useState(QualityType)
  const [cost, setCost] = useState('----')
  const [previewApparel, setPreviewApparel] = useState('')
  const [finishEditing, setFinishEditing] = useState(false)

  useEffect(() => {
    window.scrollTo({
      top: 0,
    })
  }, [])

  useEffect(() => {
    if (data !== null) {
      setGender(data.gender)
    }
  }, [data])

  useEffect(() => {
    if (subCategory.length > 0) {
      let gender = GenderType.filter(item => item.type === subCategory)
      setGender(gender[0])
    }
  }, [subCategory])

  useEffect(() => {
    if (gender.hasOwnProperty('id')) {
      let genderType = gender.type
      let newApparelType = []
      ApparelType.map(item => {
        if (item.hasOwnProperty(genderType)) newApparelType.push(item)
      })
      setApparelType(newApparelType)
      if (data) {
        setApparel(data.apparel)
        setColor(data.color)
        setPrint(data.print)
        setSize(data.size)
        setQuality(data.quality)
        setQuantity(data.quantity)
        setData(null)
      } else {
        setApparel({ name: '' })
        setQuality({ name: '', type: '' })
        setPrint({ name: '', type: '' })
        setCost('----')
        onPrint('')
        setPreviewApparel('')
        setColor({ name: '', type: '' })
      }
    } else {
      setEnabled(false)
    }
  }, [gender])

  useEffect(() => {
    if (apparel.hasOwnProperty('id')) {
      let apparelQualities = apparel[gender.type]
      let newQualityType = []
      QualityType.map(item => {
        if (apparelQualities.hasOwnProperty(item.type)) newQualityType.push(item)
      })
      setQualityType(newQualityType)
    }
  }, [apparel])

  useEffect(() => {
    if (!apparel.hasOwnProperty('id')) {
      setEnabled(false)
      return
    }

    if (!color.hasOwnProperty('id')) {
      setEnabled(false)
      return
    }

    if (!print.hasOwnProperty('id')) {
      setEnabled(false)
      return
    }

    if (!quality.hasOwnProperty('id')) {
      setEnabled(false)
      return
    }

    if (quantity <= 0) {
      setEnabled(false)
      return
    }

    if (apparel.hasOwnProperty(gender.type)) {
      if (apparel[gender.type].hasOwnProperty(quality.type)) {
        if (apparel[gender.type][quality.type].hasOwnProperty(color.type)) {
          onPrint(apparel[gender.type][quality.type][color.type].image[print.type])
          setPreviewApparel(apparel[gender.type][quality.type][color.type].image[print.type])
          let cost = apparel[gender.type][quality.type][color.type].cost
          setCost((cost * quantity).toFixed(2))
        } else {
          onPrint('')
          setPreviewApparel('')
        }
      } else {
        onPrint('')
        setPreviewApparel('')
      }
    } else {
      onPrint('')
      setPreviewApparel('')
    }

    if (!size.hasOwnProperty('id')) {
      setEnabled(false)
      return
    }

    setEnabled(true)
  }, [apparel, color, print, quality, size, quantity])

  return (
    <section className={styles.container}>
      <div className="flex gap-[15px] lg:mt-[20px] mt-[0px] items-center">
        <div className={styles.backBG} onClick={onBack}>
          <div className="hidden lg:flex mr-[2px]">
            <ArrowLeftIcon alt="" />
          </div>
          <div className="flex lg:hidden">
            <ArrowLeftIconMobile alt="" />
          </div>
        </div>
        <div className={styles.selecteCategory}>{nftName} - Apparel</div>
      </div>
      <div className={styles.description}>
        {viewport === 'lg' || viewport === 'xl' || viewport === '2xl'
          ? 'Creator apparel is an excellent way to support your favorite artists and help them promote their brand. Our creator merch hub is simple to use and gives you the tools to foster your creative flavor.'
          : 'Customize your apparel by selecting the base, color, placement, quality, and size.'}
      </div>
      <div className="w-full mt-[30px] lg:mt-[40px]">
        <Selection label="GENDER:" data={GenderType} selected={gender?.name} onSelect={item => setGender(item)} />
      </div>
      <div className="w-full mt-[25px]">
        <Selection label="APPAREL:" data={apparelType} selected={apparel?.name} onSelect={item => setApparel(item)} />
      </div>
      <div className="w-full mt-[25px]">
        <Selection label="PRINT:" data={PrintType} selected={print?.name} onSelect={item => setPrint(item)} />
      </div>
      <div className="w-full mt-[25px]">
        <Selection label="QUALITY:" data={qualityType} selected={quality?.name} onSelect={item => setQuality(item)} />
      </div>
      <div className="w-full mt-[25px]">
        <SelectionColor label="COLOR:" data={ColorType} selected={color?.name} onSelect={item => setColor(item)} />
      </div>
      <div className="w-full mt-[35px] lg:mt-[25px]">
        <Selection label="SELECT SIZE:" data={SizeType} selected={size?.name} onSelect={item => setSize(item)} />
      </div>
      <div className="w-full mt-[25px] flex">
        <div className={styles.quantity}>QUANTITY:</div>
        <input
          value={quantity}
          type="number"
          min="0"
          placeholder="0"
          className={styles.inputArea}
          onChange={event => setQuantity(parseInt(event.target.value))}
        />
      </div>
      <div className="w-full mt-[30px] lg:mt-[100px] flex">
        <div className={styles.subTotal}>Subtotal:</div>
        <div className="flex ml-[10px] lg:ml-[20px] items-center">
          <div className={styles.price}>$ {cost}</div>
          <div className={styles.separator}></div>
          <div className="flex gap-[10px] items-center">
            <SolanaLogoIcon alt="" />
            <div className={styles.price}>{cost === '----' ? '----' : (parseFloat(cost) / 14.7).toFixed(2)}</div>
          </div>
        </div>
      </div>
      <div className={styles.apparelBG}>
        <div className="absolute inset-0 w-full h-full"></div>
        <ApparelSection
          canvasId="canvas-mobile"
          nftName={nftName}
          apparel={previewApparel}
          nftCoverUrl={nftCoverUrl}
          finishEditing={finishEditing}
        />
      </div>

      <div className="w-full mt-[30px] flex gap-[30px]">
        <GradientButton
          disabled={!enabled}
          label="Next"
          fullWidth
          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53}
          fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 15 : 18}
          onClick={() => {
            let data = { apparel, gender, color, print, quality, size, quantity, cost }
            onShipping(data)
            setFinishEditing(true)
          }}
        />
      </div>
    </section>
  )
}

export default PhysicalPrintDetail

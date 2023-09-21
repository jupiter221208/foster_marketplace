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
import ShopApparelList from 'assets/json/browse-nft/shop-apparel-list.json'

// images
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'

// styles
import styles from './index.module.scss'
import Selection from 'components/Selection'
import SelectionColor from 'components/SelectionColor'
import GradientButton from 'components/Button/GradientButton'
import { useViewport } from 'utils'
import ApparelSection from '../ApparelSection'
import OutlineButton from 'components/Button/OutlineButton'

// api

const PhysicalPrintDetail = props => {
  const { onBack, onPrint, onShipping, data, setData, nftName, nftCoverUrl, subCategory, base } = props
  const viewport = useViewport()
  const [gender, setGender] = useState({ name: '', type: '' })
  const [apparel, setApparel] = useState(null)
  const [print, setPrint] = useState({
    id: 0,
    name: 'Front',
    type: 'front',
  })
  const [quality, setQuality] = useState({ name: '', type: '' })
  const [size, setSize] = useState({
    id: 3,
    name: 'L',
  })
  const [color, setColor] = useState({
    id: 0,
    name: '#FFFFFF',
    type: 'white',
    asset_url: '/images/apparel-color-white.png',
  })
  const [quantity, setQuantity] = useState(1)
  const [enabled, setEnabled] = useState(false)
  const [apparelList, setApparelList] = useState(ShopApparelList)
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
    if (base && base.length > 0) {
      let apparel = ApparelType.filter(item => item.name === base)
      setApparel(apparel[0])
    }
  }, [base])

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
        setQuality({ name: '', type: '' })
        setPrint({ id: 0, name: 'Front', type: 'front' })
        setCost('----')
        onPrint('')
        setPreviewApparel('')
        setColor({ id: 0, name: '#FFFFFF', type: 'white', asset_url: '/images/apparel-color-white.png' })
      }
    } else {
      setEnabled(false)
    }
  }, [gender])

  useEffect(() => {
    if (apparel && apparel.hasOwnProperty('id')) {
      let apparelQualities = apparel[gender.type]
      let newQualityType = []
      QualityType.map(item => {
        if (apparelQualities.hasOwnProperty(item.type)) newQualityType.push(item)
      })
      setQualityType(newQualityType)
      setQuality(newQualityType[0])
    }
  }, [apparel])

  useEffect(() => {
    if (!apparel) {
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

  const getApparelName = () => {
    if (apparel) {
      let type = gender.type
      let name = apparel?.name
      let list = apparelList.filter(item => item.base === name && item.sub_type == type)
      if (list.length > 0) return list[0].name
      else return name
    }
    return ''
  }

  return (
    <section className={styles.container}>
      <div className={`${styles.apparelBG} lg:hidden block`}>
        <div className={styles.previewBG}></div>
        <ApparelSection
          canvasId="canvas-mobile"
          nftName={nftName}
          apparel={previewApparel}
          nftCoverUrl={nftCoverUrl}
          finishEditing={finishEditing}
        />
      </div>
      <div className="flex gap-[10px] lg:gap-[15px] lg:mt-[20px] mt-[20px] items-center">
        {/* <div className={styles.backBG} onClick={onBack}>
          <div className="hidden lg:flex mr-[2px]">
            <ArrowLeftIcon alt="" />
          </div>
          <div className="flex lg:hidden">
            <ArrowLeftIconMobile alt="" />
          </div>
        </div> */}
        <div className={styles.selecteCategory}>
          {getApparelName()}&nbsp;<div className={styles.nftName}>({nftName})</div>
        </div>
      </div>
      <div className={styles.description}>
        Select the side of apparel you would like to place the print, fabric color, and quality.
      </div>
      {/* <div className="w-full mt-[30px] lg:mt-[40px]">
        <Selection
          label={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 'GENDER:' : 'Gender:'}
          data={GenderType}
          selected={gender?.name}
          onSelect={item => setGender(item)}
        />
      </div> */}
      {/* <div className="w-full mt-[25px]">
        <Selection
          label={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 'BASE:' : 'Base:'}
          data={apparelType}
          selected={apparel?.name}
          onSelect={item => setApparel(item)}
        />
      </div> */}
      <div className="w-full mt-[25px]">
        <Selection label={'Placement:'} data={PrintType} selected={print?.name} onSelect={item => setPrint(item)} />
      </div>
      <div className="w-full mt-[25px]">
        <Selection label={'Quality:'} data={qualityType} selected={quality?.name} onSelect={item => setQuality(item)} />
      </div>
      <div className="w-full mt-[25px]">
        <SelectionColor label={'Color:'} data={ColorType} selected={color?.type} onSelect={item => setColor(item)} />
      </div>
      <div className="w-full mt-[35px] lg:mt-[25px]">
        <Selection label={'Size:'} data={SizeType} selected={size?.name} onSelect={item => setSize(item)} />
      </div>
      <div className="w-full mt-[25px] block lg:flex">
        <div className={styles.quantity}>Quantity:</div>
        <div className="mt-[15px] lg:mt-[0px]">
          <input
            value={quantity}
            type="number"
            min="0"
            placeholder="0"
            className={styles.inputArea}
            onChange={event => setQuantity(parseInt(event.target.value))}
          />
        </div>
      </div>
      <div className="w-full mt-[30px] lg:mt-[160px] flex">
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

      <div className="w-full mt-[30px] flex gap-[30px]">
        <OutlineButton
          label="Back"
          onClick={onBack}
          fullWidth
          fontFamily="Muli-SemiBold"
          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53}
          borderColor={'rgba(var(--main-bg-color-rgb), 0.1)'}
          color={'var(--text-gray-200-color)'}
        />

        <GradientButton
          disabled={!enabled}
          label="Next"
          fontFamily="Muli-SemiBold"
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

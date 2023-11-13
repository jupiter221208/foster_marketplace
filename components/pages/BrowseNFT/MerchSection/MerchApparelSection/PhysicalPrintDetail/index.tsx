import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// next components
import { useRouter } from 'next/router'

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
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'
import ApparelSection from '../ApparelSection'
import OutlineButton from 'components/Button/OutlineButton'
import SizeChartModal from 'components/Modal/SizeChartModal'

// api

const PhysicalPrintDetail = props => {
  const { onBack, onPrint, onShipping, data, setData, nftName, nftCoverUrl, subCategory, base } = props
  const viewport = useViewport()
  const { solToUsdRate } = useSolToUsdRate()
  const [gender, setGender] = useState({ name: '', type: '' })
  const [apparel, setApparel] = useState(null)
  const [print, setPrint] = useState({
    id: 0,
    name: 'Front Side',
    type: 'front',
  })
  const [quality, setQuality] = useState({ name: '', type: '' })
  const [size, setSize] = useState({
    id: 2,
    name: 'L',
  })
  const [color, setColor] = useState({
    id: 0,
    name: '#FFFFFF',
    type: 'white',
    asset_url: '/images/apparel-color-white.png',
  })
  const dispatch = useDispatch()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [enabled, setEnabled] = useState(false)
  const [apparelList, setApparelList] = useState(ShopApparelList)
  const [apparelType, setApparelType] = useState(ApparelType)
  const [qualityType, setQualityType] = useState(QualityType)
  const [tableModal, setTableModal] = useState(false)
  const [cost, setCost] = useState('----')
  const [previewApparel, setPreviewApparel] = useState('')
  const [finishEditing, setFinishEditing] = useState(false)
  const apparelColor = useSelector<any>(state => state.apparelColor)
  const [isAddToCart, setIsAddToCart] = useState(false)

  useEffect(() => {
    const defaulteColor = apparelColor as number
    if (
      defaulteColor !== undefined &&
      defaulteColor !== null &&
      defaulteColor !== -1 &&
      defaulteColor < ColorType.length
    ) {
      setColor(ColorType[defaulteColor])
      dispatch({ type: 'set', apparelColor: -1 })
    }
  }, [apparelColor])

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

      if (genderType === 'youth') {
        setSize({
          id: 2,
          name: 'YM',
        })
      }
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
        setPrint({ id: 0, name: 'Front Side', type: 'front' })
        setCost('----')
        onPrint('')
        setPreviewApparel('')
        // setColor({ id: 0, name: '#FFFFFF', type: 'white', asset_url: '/images/apparel-color-white.png' })
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
  const getApparelDescription = () => {
    if (apparel) {
      let type = gender.type
      let name = apparel?.name
      let description = apparel?.description
      let list = apparelList.filter(item => item.base === name && item.sub_type == type)
      if (list.length > 0) return list[0].description
      else return description
    }
    return ''
  }
  const handleSaveData = () => {
    let existingData = JSON.parse(localStorage.getItem('data')) || []
    if (!Array.isArray(existingData)) {
      existingData = []
    }
    let data = { apparel, gender, color, print, quality, size, quantity, cost }
    setFinishEditing(true)
    setIsAddToCart(true)
    existingData.push(data)
    localStorage.setItem('data', JSON.stringify(existingData))
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
          isAddToCart={isAddToCart}
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
      <div className={styles.description}>{getApparelDescription()}</div>
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
      {/* <div className="w-full mt-[25px]">
        <Selection label={'Quality:'} data={qualityType} selected={quality?.name} onSelect={item => setQuality(item)} />
      </div> */}
      <div className="w-full mt-[25px]">
        <SelectionColor label={'Color:'} data={ColorType} selected={color?.type} onSelect={item => setColor(item)} />
      </div>
      <div className="w-full mt-[35px] lg:mt-[25px]">
        <Selection
          label={'Size:'}
          data={SizeType[`${gender?.type}`] == undefined ? [] : SizeType[`${gender?.type}`]}
          selected={size?.name}
          onSelect={item => setSize(item)}
        />
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
      <div className="w-full mt-[25px] block flex flex-row items-center gap-2">
        <div className={styles.sizeChart} onClick={() => setTableModal(true)}>
          Size Chart
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="10.542" height="6.247" viewBox="0 0 10.542 6.247">
          <path
            id="angle-down-9"
            d="M17,9.17a1,1,0,0,0-1.41,0L12,12.71,8.46,9.17a1,1,0,1,0-1.41,1.42l4.24,4.24a1,1,0,0,0,1.42,0L17,10.59a1,1,0,0,0,0-1.42Z"
            transform="translate(-6.754 -8.879)"
            fill="var(--chevron-up-icon-color)"
          />
        </svg>
      </div>
      <div className="w-full mt-[30px] lg:mt-[160px] flex">
        <div className={styles.subTotal}>Subtotal:</div>
        <div className="flex ml-[10px] lg:ml-[20px] items-center">
          <div className={styles.price}>$ {cost}</div>
          <div className={styles.separator}></div>
          <div className="flex gap-[10px] items-center">
            <SolanaLogoIcon alt="" />
            <div className={styles.price}>
              {cost === '----' ? '----' : (parseFloat(cost) / solToUsdRate).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-[30px] flex gap-[30px]">
        <OutlineButton
          label="Add to Cart"
          onClick={handleSaveData}
          fullWidth
          fontFamily="Muli-SemiBold"
          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53}
          borderColor={'rgba(var(--main-bg-color-rgb), 0.1)'}
          color={'var(--text-gray-200-color)'}
        />

        <GradientButton
          disabled={!enabled}
          label="Buy Now"
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
      <SizeChartModal open={tableModal} title={getApparelName()} onClose={() => setTableModal(false)} />
    </section>
  )
}

export default PhysicalPrintDetail

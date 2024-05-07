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
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'

// styles
import styles from './index.module.scss'
import { useViewport } from 'utils'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'
import ApparelSection from '../ApparelSection'
import SizeChartModal from 'components/Modal/SizeChartModal'
import Image from 'next/image'
import DropdownSizeMenu from 'components/Menu/DropdownSizeMenu'
import QuantityCard from 'components/Card/QuantityCard'
import { useAuthentication } from 'hooks/useAuthentication'
import PrimaryButton from 'components/Button/PrimaryButton'
import SecondaryButton from 'components/Button/SecondaryButton'

// api

const PhysicalPrintDetail = props => {
  const { onBack, onPrint, onShipping, onAddCart, data, setData, nftName, nftCoverUrl, subCategory, base } = props
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
    name: '#E2E3E8',
    type: 'white',
  })
  const dispatch = useDispatch()
  const router = useRouter()
  const id = router.query.id
  const { profileInfo } = useAuthentication()
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
  const merchBy: string = useSelector(state => (state as any).merchBy)
  const shippingDetail = useSelector<any>(state => state.shippingDetail)
  const printImageUrl = useSelector<any>(state => state.printImageUrl)
  const isAddToCart = useSelector(state => (state as any).isAddToCart)
  const [apparelAssets, setApparelAssets] = useState(null)

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
    if (shippingDetail) {
      onShipping(data)
      dispatch({ type: 'set', shippingDetail: false })
    }
  }, [shippingDetail])

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
          setApparelAssets(apparel[gender.type][quality.type][color.type].image)
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

  const getApparelLabel = () => {
    if (apparel) {
      let type = gender.type
      let name = apparel?.name
      let list = apparelList.filter(item => item.base === name && item.sub_type == type)
      if (list.length > 0) return list[0].label
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
    let data = { apparel, gender, color, print, quality, size, quantity, cost }
    onAddCart(data)
  }

  useEffect(() => {
    if (printImageUrl && isAddToCart) {
      let existingData = JSON.parse(localStorage.getItem('data')) || []
      if (!Array.isArray(existingData)) {
        existingData = []
      }

      let data = {
        previewApparel,
        apparel,
        gender,
        color,
        print,
        quality,
        size,
        quantity,
        cost,
        id,
        nftCoverUrl,
        nftName,
        printImageUrl,
      }
      existingData.push(data)
      localStorage.setItem('data', JSON.stringify(existingData))
      dispatch({ type: 'set', isAddToCart: false })
      dispatch({ type: 'set', printImageUrl: null })
    }
  }, [printImageUrl, isAddToCart])

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
      <div className={styles.rightPanel}>
        <div className="w-full">
          <div className={styles.nftName}>{nftName}</div>
          <div className="flex gap-[6px] mt-[8px] lg:mt-[10px] items-center">
            <div className={styles.merchBy}>Merch by</div>
            <div className={styles.username} onClick={() => router.push(`/${merchBy}`)}>
              {merchBy}
            </div>
          </div>
        </div>

        <div className="w-full mt-[20px] lg:mt-[30px]">
          <div className={styles.placementTitle}>Description</div>
          <div className={styles.description}>{getApparelDescription()}</div>
        </div>

        <div className="w-full mt-[20px] lg:mt-[30px]">
          <div className={styles.placementTitle}>Select Color</div>
          <div className="mt-[15px] flex gap-[11px] lg:gap-[15px]">
            <div
              className={`w-[34px] h-[34px] flex justify-center items-center ${
                color?.type === 'white' ? styles.colorBorder : ''
              }`}
            >
              <div className={styles.whiteColor} onClick={() => setColor(ColorType[0])} />
            </div>
            <div
              className={`w-[34px] h-[34px] flex justify-center items-center ${
                color?.type === 'black' ? styles.colorBorder : ''
              }`}
            >
              <div className={styles.blackColor} onClick={() => setColor(ColorType[1])} />
            </div>
          </div>
          {/* <SelectionColor label={'Color:'} data={ColorType} selected={color?.type} onSelect={item => setColor(item)} /> */}
        </div>

        <div className="w-full mt-[20px] lg:mt-[30px]">
          {/* <Selection label={'Placement:'} data={PrintType} selected={print?.name} onSelect={item => setPrint(item)} /> */}
          <div className={styles.placementTitle}>Select Placement</div>
          <div className="mt-[15px] flex gap-[16px] lg:gap-[30px]">
            <div onClick={() => setPrint(PrintType[0])}>
              <div className={print.type === 'front' ? styles.selectedPrint : styles.unselectedPrint}>
                <Image
                  src={apparelAssets ? apparelAssets['front'] : ''}
                  width={150}
                  height={150}
                  alt=""
                  className="w-full h-full"
                />
              </div>
              <div className={styles.selectedPrintText}>Front Side</div>
            </div>
            <div onClick={() => setPrint(PrintType[1])}>
              <div className={print.type === 'back' ? styles.selectedPrint : styles.unselectedPrint}>
                <Image
                  src={apparelAssets ? apparelAssets['back'] : ''}
                  width={170}
                  height={170}
                  alt=""
                  className="w-full h-full"
                />
              </div>
              <div className={styles.selectedPrintText}>Back Side</div>
            </div>
          </div>
        </div>

        <div className="w-full mt-[35px] lg:mt-[25px] flex flex-wrap gap-[16px] justify-between items-center">
          <div className="flex gap-[18px]">
            <DropdownSizeMenu
              label={size?.name}
              data={apparel && SizeType[`${apparel.name}`][`${gender?.type}`]}
              selectedItem={size}
              setSelectedItem={item => {
                setSize(item)
              }}
            />
            <QuantityCard
              qty={quantity}
              onMinus={() => {
                if (quantity > 1) setQuantity(quantity - 1)
              }}
              onPlus={() => {
                setQuantity(quantity + 1)
              }}
            />
          </div>
          <div className="flex gap-[7px] items-center">
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
        </div>

        <div className={styles.borderLine} />

        <div className="w-full mt-[18px] flex justify-between items-center">
          <div className={styles.subTotal}>Subtotal:</div>
          <div className="flex items-center gap-[15px]">
            <div className={styles.price}>$ {cost}</div>
            <div className={styles.separator}></div>
            <div className="flex gap-[10px] items-center">
              <SolanaLogoIcon alt="" className="mt-[2px]" />
              <div className={styles.price}>
                {cost === '----' ? '----' : (parseFloat(cost) / solToUsdRate).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-wrap mt-[20px] flex gap-[15px]">
          <PrimaryButton
            disabled={!enabled}
            label="Buy Now"
            type="buy-now"
            fullWidth
            onClick={() => {
              let data = { apparel, gender, color, print, quality, size, quantity, cost }
              onShipping(data)
              setFinishEditing(true)
            }}
          />
          <SecondaryButton label="Add to Cart" type="add-cart" onClick={() => handleSaveData()} fullWidth />
        </div>
      </div>
      <SizeChartModal
        open={tableModal}
        title={getApparelName()}
        label={getApparelLabel()}
        onClose={() => setTableModal(false)}
      />
    </section>
  )
}

export default PhysicalPrintDetail

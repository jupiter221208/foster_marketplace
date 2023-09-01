import React, { useState, useEffect } from 'react'
// next components

// components

// custom functions

// json
import PrintType from 'assets/json/wallart/print.json'
import OrientType from 'assets/json/wallart/orientation.json'
import SizeType from 'assets/json/wallart/size.json'

// images
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import ArrowLeftIcon from 'assets/icons/arrow-left-smallest.svg?component'
import ArrowLeftIconMobile from 'assets/icons/arrow-left-medium-mobile.svg?component'

// styles
import styles from './index.module.scss'
import Selection from 'components/Selection'
import GradientButton from 'components/Button/GradientButton'
import WalletTag from './WalletTag'
import SecondaryButton from 'components/Button/SecondaryButton'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'
import { useViewport } from 'utils'
import WallSection from '../WallSection'
import OutlineButton from 'components/Button/OutlineButton'

// api

const WallArtDetail = props => {
  const { onBack, onPrint, onShipping, subCategory, data, setData, nftName, nftImage } = props
  const viewport = useViewport()
  const [print, setPrint] = useState({ name: '', type: '', image: '' })
  const [orientation, setOrientation] = useState({ name: '', type: '' })
  const [size, setSize] = useState({ width: 1, height: 1, price: '' })
  const [sizes, setSizes] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [enabled, setEnabled] = useState(false)
  const [cost, setCost] = useState('----')
  const [openEditorModal, setOpenEditorModal] = useState(false)
  const [cropImage, setCropImage] = useState(null)
  const [previewSection, setPreviewSection] = useState(null)
  const [finishEditing, setFinishEditing] = useState(false)

  useEffect(() => {
    window.scrollTo({
      top: 0,
    })
  }, [])

  useEffect(() => {
    if (subCategory.length > 0) {
      let print = PrintType.filter(item => item.type === subCategory)
      setPrint(print[0])
    }
  }, [subCategory])

  useEffect(() => {
    if (data !== null) {
      setPrint(data.print)
      setOrientation(data.orientation)

      let sizeAll = SizeType.filter(item => item.type === data.print.type)[0]
      let sizes = []
      sizes = sizeAll[data.orientation.type].map(
        item => (item = { ...item, selected: item.id === data.size.id ? true : false })
      )
      setSize(data.size)
      setSizes(sizes)
      setQuantity(data.quantity)
      setCost(data.cost)
      setCropImage(data.cropImage)
      setEnabled(true)
      setTimeout(() => {
        setData(null)
      }, 2000)
    }
  }, [data])

  useEffect(() => {
    if (data !== null) return

    setEnabled(false)
    if (print.hasOwnProperty('id')) {
      setCost('----')
      setSizes([])
      setCropImage(null)
      setOrientation({ name: '', type: '' })
    }
  }, [print])

  useEffect(() => {
    if (data !== null) return

    setEnabled(false)
    if (print.hasOwnProperty('id') && orientation.hasOwnProperty('id')) {
      let sizeAll = SizeType.filter(item => item.type === print.type)[0]
      let sizes = []
      sizes = sizeAll[orientation.type].map(item => (item = { ...item, selected: false }))
      setSizes(sizes)
      setCost('----')
    }
  }, [orientation])

  useEffect(() => {
    if (data !== null) return

    if (print.hasOwnProperty('id')) {
      setEnabled(true)
      setCost(size.price)
    }

    if (quantity <= 0) {
      setEnabled(false)
      return
    }
  }, [size])

  useEffect(() => {
    if (data !== null) return

    if (quantity <= 0) {
      setEnabled(false)
      return
    }
  }, [quantity])

  const setSelectSize = item => {
    setSize(item)

    let newSizes = [...sizes]
    newSizes.map(element => {
      if (element.id === item.id) {
        element.selected = true
      } else {
        element.selected = false
      }
    })
    setSizes(newSizes)
    setOpenEditorModal(true)
  }

  const moveShippingPage = () => {
    let data = { print, orientation, sizes, size, quantity, cost, cropImage }
    onShipping(data)
    setPrint({ name: '', type: '', image: '' })
    setOrientation({ name: '', type: '' })
  }

  return (
    <section className={styles.container}>
      <div className="lg:hidden block">
        <div className={styles.wallartBG}>
          <div className="absolute inset-0 w-full h-full"></div>
          <WallSection
            canvasId="wallart-mobile"
            nftName={nftName}
            wallArt={previewSection}
            finishEditing={finishEditing}
          />
        </div>
      </div>
      <div className="flex gap-[15px] mt-[20px] lg:mt-[20px] items-center">
        {/* <div className={styles.backBG} onClick={onBack}>
          <div className="hidden lg:flex mr-[2px]">
            <ArrowLeftIcon alt="" />
          </div>
          <div className="flex lg:hidden mr-[2px]">
            <ArrowLeftIconMobile alt="" />
          </div>
        </div> */}
        <div className={styles.selecteCategory}>{nftName} - Wall Art</div>
      </div>
      <div className={styles.description}>
        {viewport === 'lg' || viewport === 'xl' || viewport === '2xl'
          ? 'Purchasing physical prints is an excellent way to support your favorite artists. Our creator merch hub is simple to use and provides the tools you need to take your creative flavor from wallets to walls.'
          : 'Customize your wall art by selecting the material, orientation, and size.'}
      </div>

      {/* <div className="w-full mt-[60px]">
        <Selection label="PRINT:" data={PrintType} selected={print?.name} onSelect={item => setPrint(item)} />
      </div> */}

      <div className="w-full mt-[25px]">
        <Selection
          label="Orientation:"
          data={OrientType}
          selected={orientation?.name}
          onSelect={item => setOrientation(item)}
        />
      </div>

      <div className="w-full mt-[25px]">
        <div className={styles.selectSize}>{'Size:'}</div>
        <div className="w-full flex flex-wrap gap-[15px] mt-[10px]">
          {sizes.map((item, index) => (
            <div key={index}>
              <WalletTag
                item={item}
                setSelect={item => {
                  setSelectSize(item)
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full mt-[20px] block lg:flex">
        <div className={styles.quantity}>Quantity:</div>
        <div className="mt-[10px] lg:mt-[0px]">
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

      <div className="lg:hidden block">
        <div className="w-full mt-[25px] flex">
          <div className={styles.subTotal}>Subtotal:</div>
          <div className="flex ml-[20px] items-center">
            <div className={styles.price}>$ {cost === '----' ? '----' : (parseFloat(cost) * quantity).toFixed(2)}</div>
            <div className={styles.separator}></div>
            <div className="flex gap-[10px] items-center">
              <SolanaLogoIcon alt="" />
              <div className={styles.price}>
                {cost === '----' ? '----' : ((parseFloat(cost) * quantity) / 14.7).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-[30px] flex gap-[30px] mb-[30px]">
          {/* <SecondaryButton
            backgroundColor="transparent"
            label="Generate Preview"
            fullWidth
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53}
            fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 14 : 18}
            color={enabled ? 'var(--text-gray-200-color)' : 'rgba(var(--text-gray-200-color-rgb), 0.5)'}
            borderColor={enabled ? 'var(--text-gray-200-color)' : 'rgba(var(--text-gray-200-color-rgb), 0.5)'}
            onClick={() => enabled && setOpenEditorModal(true)}
          /> */}
          <OutlineButton
            label="Back"
            onClick={onBack}
            fullWidth
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53}
            borderColor={'rgba(var(--main-bg-color-rgb), 0.1)'}
            color={'var(--text-gray-200-color)'}
          />
          <GradientButton
            disabled={!enabled}
            label="Next"
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53}
            fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 15 : 18}
            fullWidth
            onClick={() => {
              if (cropImage === null) {
                setOpenEditorModal(true)
              } else {
                moveShippingPage()
              }
            }}
          />
        </div>
      </div>

      <div className="absolute bottom-[60px] w-full lg:block hidden">
        <div className="w-full mt-[25px] flex">
          <div className={styles.subTotal}>Subtotal:</div>
          <div className="flex ml-[20px] items-center">
            <div className={styles.price}>$ {cost === '----' ? '----' : (parseFloat(cost) * quantity).toFixed(2)}</div>
            <div className={styles.separator}></div>
            <div className="flex gap-[10px] items-center">
              <SolanaLogoIcon alt="" />
              <div className={styles.price}>
                {cost === '----' ? '----' : ((parseFloat(cost) * quantity) / 14.7).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex mt-[30px] flex gap-[30px]">
          {/* <SecondaryButton
            backgroundColor="transparent"
            label="Generate Preview"
            fullWidth
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53}
            fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 14 : 18}
            color={enabled ? '#eff0f6' : '#818181'}
            borderColor={'#202427'}
            onClick={() => setOpenEditorModal(true)}
          /> */}
          <OutlineButton
            label="Back"
            onClick={onBack}
            fullWidth
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53}
            borderColor={'rgba(var(--main-bg-color-rgb), 0.1)'}
            color={'var(--text-gray-200-color)'}
          />
          <GradientButton
            disabled={!enabled}
            label="Next"
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 53}
            fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 15 : 18}
            fullWidth
            onClick={() => {
              if (cropImage === null) {
                setOpenEditorModal(true)
              } else {
                moveShippingPage()
              }
            }}
          />
        </div>
      </div>
      <NftImageEditorModal
        style={{ zIndex: 100001 }}
        open={openEditorModal}
        close={() => setOpenEditorModal(false)}
        nftUrl={[nftImage]}
        getCroppedImage={croppedImage => {
          setCropImage(croppedImage)
          setOpenEditorModal(false)
          let image = { art: croppedImage, wall: print.image, size: size }
          onPrint(image)
          setPreviewSection(image)
          setFinishEditing(true)
        }}
        dimension={{ value: [1080, (1080 * size.height) / size.width] }}
      />
    </section>
  )
}

export default WallArtDetail

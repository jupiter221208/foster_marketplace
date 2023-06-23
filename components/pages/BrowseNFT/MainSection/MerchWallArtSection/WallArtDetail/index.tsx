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
import ArrowLeftIcon from 'assets/icons/arrow-left-medium.svg?component'

// styles
import styles from './index.module.scss'
import Selection from 'components/Selection'
import GradientButton from 'components/Button/GradientButton'
import WalletTag from './WalletTag'
import SecondaryButton from 'components/Button/SecondaryButton'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'

// api

const WallArtDetail = props => {
  const { onBack, onPrint, onShipping, data, setData, nftName, nftImage } = props
  const [print, setPrint] = useState({ name: '', type: '', image: '' })
  const [orientation, setOrientation] = useState({ name: '', type: '' })
  const [size, setSize] = useState({ width: 1, height: 1, price: '' })
  const [sizes, setSizes] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [enabled, setEnabled] = useState(false)
  const [cost, setCost] = useState('----')
  const [openEditorModal, setOpenEditorModal] = useState(false)
  const [cropImage, setCropImage] = useState(null)

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
  }

  const moveShippingPage = () => {
    let data = { print, orientation, sizes, size, quantity, cost, cropImage }
    onShipping(data)
    setPrint({ name: '', type: '', image: '' })
    setOrientation({ name: '', type: '' })
  }

  return (
    <section className={styles.container}>
      <div className="flex gap-[15px] mt-[20px] items-center">
        <div className={styles.backBG} onClick={onBack}>
          <ArrowLeftIcon alt="" />
        </div>
        <div className={styles.selecteCategory}>{nftName} - Wall Art</div>
      </div>
      <div className={styles.description}>
        Purchasing physical prints is an excellent way to support your favorite artists. Our creator merch hub is simple
        to use and provides the tools you need to take your creative flavor from wallets to walls.
      </div>

      <div className="w-full mt-[40px]">
        <Selection label="PRINT:" data={PrintType} selected={print?.name} onSelect={item => setPrint(item)} />
      </div>

      <div className="w-full mt-[25px]">
        <Selection
          label="ORIENTATION:"
          data={OrientType}
          selected={orientation?.name}
          onSelect={item => setOrientation(item)}
        />
      </div>

      <div className="w-full mt-[25px]">
        <div className={styles.selectSize}>SELECT SIZE:</div>
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

      <div className="absolute left-10 right-10 bottom-10">
        <div className="w-full flex">
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
        <div className="w-full mt-[25px] flex">
          <div className={styles.subTotal}>Subtotal:</div>
          <div className="flex ml-[20px] items-center">
            <div className={styles.price}>$ {cost === '----' ? '----' : (parseFloat(cost) * quantity).toFixed(3)}</div>
            <div className={styles.separator}></div>
            <div className="flex gap-[10px] items-center">
              <SolanaLogoIcon alt="" />
              <div className={styles.price}>
                {cost === '----' ? '----' : ((parseFloat(cost) * quantity) / 14.7).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mt-[50px] flex gap-[30px]">
          <SecondaryButton
            backgroundColor="transparent"
            label="Generate Preview"
            fullWidth
            height="53px"
            fontSize="18px"
            color={enabled ? '#eff0f6' : '#818181'}
            borderColor={'#202427'}
            onClick={() => setOpenEditorModal(true)}
          />
          <GradientButton
            disabled={!enabled}
            label="Next"
            fontSize={18}
            fullWidth
            height={53}
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
          onPrint({ art: croppedImage, wall: print.image, size: size })
        }}
        dimension={{ value: [1080, (1080 * size.height) / size.width] }}
      />
    </section>
  )
}

export default WallArtDetail

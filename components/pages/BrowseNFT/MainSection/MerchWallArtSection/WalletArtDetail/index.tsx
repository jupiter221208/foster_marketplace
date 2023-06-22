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

// api

const WalletArtDetail = props => {
  const { onBack, onPrint, onShipping, data, setData, nftName } = props
  const [print, setPrint] = useState({ name: '', type: '' })
  const [orientation, setOrientation] = useState({ name: '', type: '' })
  const [size, setSize] = useState({ name: '', type: '', price: '' })
  const [sizes, setSizes] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [enabled, setEnabled] = useState(false)
  const [cost, setCost] = useState('----')

  useEffect(() => {
    setEnabled(false)
    if (print.hasOwnProperty('id')) {
      setCost('----')
    }
  }, [print])

  useEffect(() => {
    setEnabled(false)
    if (print.hasOwnProperty('id')) {
      let sizeAll = SizeType.filter(item => item.type === print.type)[0]
      let sizes = sizeAll[orientation.type].map(item => (item = { ...item, selected: false }))
      setSizes(sizes)
    }
  }, [orientation])

  useEffect(() => {
    if (!size.hasOwnProperty('id')) {
      setEnabled(false)
      return
    }

    if (quantity <= 0) {
      setEnabled(false)
      return
    }

    // if (apparel.hasOwnProperty(gender.type)) {
    //   if (apparel[gender.type].hasOwnProperty(quality.type)) {
    //     if (apparel[gender.type][quality.type].hasOwnProperty(color.type)) {
    //       onPrint(apparel[gender.type][quality.type][color.type].image[print.type])
    //       let cost = apparel[gender.type][quality.type][color.type].cost
    //       setCost((cost * quantity).toFixed(2))
    //     } else {
    //       onPrint('')
    //     }
    //   } else {
    //     onPrint('')
    //   }
    // } else {
    //   onPrint('')
    // }
  }, [quantity])

  useEffect(() => {
    if (print.hasOwnProperty('id')) {
      setEnabled(true)
      setCost(size.price)
    }
    if (quantity <= 0) {
      setEnabled(false)
      return
    }
  }, [size])

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
            onClick={() => {}}
          />
          <GradientButton disabled={!enabled} label="Next" fontSize={18} fullWidth height={53} onClick={() => {}} />
        </div>
      </div>
    </section>
  )
}

export default WalletArtDetail

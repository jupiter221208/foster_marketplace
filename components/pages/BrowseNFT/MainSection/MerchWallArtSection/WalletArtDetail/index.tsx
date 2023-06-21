import React, { useState, useEffect } from 'react'
// next components

// components

// custom functions

// json
import PrintType from 'assets/json/print/print.json'
import SizeType from 'assets/json/print/size.json'

// images
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import ArrowLeftIcon from 'assets/icons/arrow-left-medium.svg?component'

// styles
import styles from './index.module.scss'
import Selection from 'components/Selection'
import GradientButton from 'components/Button/GradientButton'

// api

const WalletArtDetail = props => {
  const { onBack, onPrint, onShipping, data, setData, nftName } = props
  const [print, setPrint] = useState({ name: '', type: '' })
  const [orientation, setOrientation] = useState({ name: '', type: '' })
  const [size, setSize] = useState({ name: '' })
  const [quantity, setQuantity] = useState(1)
  const [enabled, setEnabled] = useState(false)
  const [cost, setCost] = useState('----')

  useEffect(() => {
    if (!print.hasOwnProperty('id')) {
      setEnabled(false)
      return
    }

    if (!orientation.hasOwnProperty('id')) {
      setEnabled(false)
      return
    }

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
    setEnabled(true)
  }, [print, orientation, size, quantity])

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

      <div className="w-full mt-[25px]">
        <Selection label="PRINT:" data={PrintType} selected={print?.name} onSelect={item => setPrint(item)} />
      </div>

      <div className="w-full mt-[25px]">
        <Selection label="SIZE:" data={SizeType} selected={size?.name} onSelect={item => setSize(item)} />
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
      <div className="w-full mt-[60px] flex">
        <div className={styles.subTotal}>Subtotal:</div>
        <div className="flex ml-[20px] items-center">
          <div className={styles.price}>$ {cost}</div>
          <div className={styles.separator}></div>
          <div className="flex gap-[10px] items-center">
            <SolanaLogoIcon alt="" />
            <div className={styles.price}>{cost === '----' ? '----' : (parseFloat(cost) / 14.7).toFixed(2)}</div>
          </div>
        </div>
      </div>
      <div className="w-full mt-[50px] flex gap-[30px]">
        {/* <SecondaryButton
          backgroundColor="transparent"
          label="Generate Preview"
          fullWidth
          height="53px"
          fontSize="18px"
          color={enabled ? '#eff0f6' : '#818181'}
          borderColor={'#202427'}
          onClick={() => {}}
        /> */}
        <GradientButton disabled={!enabled} label="Next" fontSize={18} fullWidth height={53} onClick={() => {}} />
      </div>
    </section>
  )
}

export default WalletArtDetail

import React, { useState, useEffect } from 'react'
import fs from 'fs/promises'
import path from 'path'

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
import ArrowLeftIcon from 'assets/icons/arrow-left-medium.svg?component'

// styles
import styles from './index.module.scss'
import Selection from 'components/Selection'
import SelectionColor from 'components/SelectionColor'
import GradientButton from 'components/Button/GradientButton'
import SecondaryButton from 'components/Button/SecondaryButton'
import PrintEditorModal from 'components/Modal/PrintEditorModal'

// api

const PhysicalPrintDetail = props => {
  const { onBack, onPrint, onShipping, data, setData } = props
  const [gender, setGender] = useState({ name: '', type: '' })
  const [apparel, setApparel] = useState({ name: '' })
  const [print, setPrint] = useState({ name: '' })
  const [quality, setQuality] = useState({ name: '', type: '' })
  const [size, setSize] = useState({ name: '' })
  const [color, setColor] = useState({ name: '', type: '' })
  const [quantity, setQuantity] = useState(0)
  const [enabled, setEnabled] = useState(false)
  const [openEditorModal, setOpenEditorModal] = useState(false)
  const [apparelFile, setApparelFile] = useState(null)
  const [apparelType, setApparelType] = useState(ApparelType)
  const [qualityType, setQualityType] = useState(QualityType)
  const [cost, setCost] = useState('----')

  useEffect(() => {
    if (data !== null) {
      setApparel(data.apparel)
      setGender(data.gender)
      setColor(data.color)
      setPrint(data.print)
      setSize(data.size)
      setQuality(data.quality)
      setSize(data.size)
      setQuantity(data.quantity)
      setEnabled(true)
      setData(null)
    }
  }, [data])

  useEffect(() => {
    if (gender.hasOwnProperty('id')) {
      let genderType = gender.type
      let newApparelType = []
      ApparelType.map(item => {
        if (item.hasOwnProperty(genderType)) newApparelType.push(item)
      })
      setApparelType(newApparelType)
      setApparel({ name: '' })
      setQuality({ name: '', type: '' })
      setPrint({ name: '' })
      setCost('----')
      onPrint('')
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
    if (!gender.hasOwnProperty('id')) {
      setEnabled(false)
      return
    }

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

    if (apparel.hasOwnProperty(gender.type)) {
      if (apparel[gender.type].hasOwnProperty(quality.type)) {
        if (apparel[gender.type][quality.type].hasOwnProperty(color.type)) {
          onPrint(apparel[gender.type][quality.type][color.type].image)
          setCost(apparel[gender.type][quality.type][color.type].cost)
        } else {
          onPrint('')
        }
      } else {
        onPrint('')
      }
    } else {
      onPrint('')
    }

    if (!size.hasOwnProperty('id')) {
      setEnabled(false)
      return
    }

    if (quantity <= 0) {
      setEnabled(false)
      return
    }
    setEnabled(true)
    // }
  }, [gender, apparel, color, print, quality, size, quantity])

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
        <GradientButton
          disabled={!enabled}
          label="Next"
          fontSize={18}
          fullWidth
          height={53}
          onClick={() => {
            // if (previewMode) {
            let data = { apparel, gender, color, print, quality, size, quantity }
            onShipping(data)
            // } else {
            //   onPrint(apparel[gender.type][quality.type][color.type].image)
            //   setCost(apparel[gender.type][quality.type][color.type].cost)
            // }
          }}
        />
      </div>
      <PrintEditorModal
        style={{ zIndex: 100001 }}
        open={openEditorModal}
        close={() => setOpenEditorModal(false)}
        nftImage={apparelFile}
        getCroppedImage={croppedImage => {}}
        dimension={{ value: [1080, 1080] }}
      />
    </section>
  )
}

export default PhysicalPrintDetail

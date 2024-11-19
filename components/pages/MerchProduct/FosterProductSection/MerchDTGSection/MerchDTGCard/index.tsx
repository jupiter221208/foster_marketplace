import React from 'react'
import { useViewport } from 'utils'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// json
import { ProductModel } from 'utils/helpers'

// styles
import styles from './index.module.scss'

const MerchDTGCard = props => {
  const { cardId, image, selected = false, side = 'front', placement, technique, onSelect } = props
  const viewport = useViewport()

  const OldModelCount = 5

  const getLabel = () => {
    let label = ''
    if (side === 'front') {
      if (
        cardId === ProductModel.SweatPant ||
        cardId === ProductModel.OversizedTee ||
        cardId === ProductModel.TieHoodie ||
        cardId === ProductModel.CropShirt ||
        cardId === ProductModel.CropHoodie ||
        cardId === ProductModel.OversizedHoodie ||
        cardId === ProductModel.DadHat ||
        cardId === ProductModel.Beanie ||
        cardId === ProductModel.Foam ||
        cardId === ProductModel.HeavySleeve
      )
        return 'Front'

      if (cardId === ProductModel.ZipUp) return 'Left Chest'

      if (technique === 'dtg') label = 'Front'
      else {
        const chest = placement.hasOwnProperty('width_right_chest')
          ? 'right'
          : placement.hasOwnProperty('width_center')
          ? 'center'
          : 'left'
        if (viewport === 'xs' || viewport === 'sm' || viewport === 'md')
          label = chest === 'right' ? 'Right Chest' : chest === 'center' ? 'Left/Center Chest' : 'Left Chest'
        else label = chest === 'right' ? 'Right Chest' : chest === 'center' ? 'Left or Center Chest' : 'Left Chest'
      }
    } else if (side === 'back') {
      if (cardId === ProductModel.SweatPant) return 'Back'

      if (technique === 'emb') {
        if (
          cardId < OldModelCount ||
          cardId === ProductModel.CropShirt ||
          cardId === ProductModel.CropHoodie ||
          cardId === ProductModel.ZipUp
        )
          return 'Back (DTG)'
        if (cardId === ProductModel.HeavySleeve) return 'Back (DTF)'
      } else label = 'Back'
    } else if (side === 'right') {
      if (cardId === ProductModel.SweatPant) return 'Back left leg'
      if (cardId === ProductModel.DadHat) return 'Right panel'
      if (
        cardId === ProductModel.TShirt ||
        cardId === ProductModel.WomonTee ||
        cardId === ProductModel.OversizedTee ||
        cardId === ProductModel.OversizedHoodie ||
        cardId === ProductModel.PoloShirt ||
        cardId === ProductModel.HeavySleeve ||
        cardId === ProductModel.ZipUp
      )
        label = 'Right Sleeve'
      else if (technique === 'dtg') label = 'Right Sleeve'
      else label = 'Right Wrist'
    } else {
      if (cardId === ProductModel.SweatPant) return 'Back right leg'
      if (cardId === ProductModel.DadHat) return 'Left panel'
      if (
        cardId === ProductModel.TShirt ||
        cardId === ProductModel.WomonTee ||
        cardId === ProductModel.OversizedTee ||
        cardId === ProductModel.OversizedHoodie ||
        cardId === ProductModel.PoloShirt ||
        cardId === ProductModel.HeavySleeve ||
        cardId === ProductModel.ZipUp
      )
        label = 'Left Sleeve'
      else if (technique === 'dtg') label = 'Left Sleeve'
      else label = 'Left Wrist'
    }
    return label
  }
  return (
    <div className={styles.container} onClick={() => onSelect(side)}>
      <div className={`${styles.imageArea} ${selected ? styles.selected : ''}`}>
        <img src={image} alt="" />
      </div>
      <div className="flex flex-col gap-[2px] lg:mt-[11px] sm:mt-[11px] mt-[6px] justify-center items-center">
        <div className={styles.side}>
          <p>{getLabel()}</p>
        </div>
      </div>
    </div>
  )
}

export default MerchDTGCard

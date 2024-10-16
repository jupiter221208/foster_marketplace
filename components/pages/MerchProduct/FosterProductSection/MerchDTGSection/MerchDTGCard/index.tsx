import React, { useState, useEffect } from 'react'
import { useViewport } from 'utils'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// json

// styles
import styles from './index.module.scss'

const MerchDTGCard = props => {
  const { image, selected = false, side = 'front', type = '', centerPlacement, technique, onSelect } = props
  const viewport = useViewport()
  const getLabel = () => {
    let label = ''
    if (side === 'front') {
      if (technique === 'dtg') label = 'Front'
      else {
        if (viewport === 'xs' || viewport === 'sm' || viewport === 'md')
          label = centerPlacement ? 'Left/Center Chest' : 'Left Chest'
        else label = centerPlacement ? 'Left or Center Chest' : 'Left Chest'
      }
    } else if (side === 'back') {
      label = 'Back'
    } else if (side === 'right') {
      if (type === 2 || type === 4) label = 'Right sleeve'
      else if (technique === 'dtg') label = 'Right sleeve'
      else label = 'Right Wrist'
    } else {
      if (type === 2 || type === 4) label = 'Left sleeve'
      else if (technique === 'dtg') label = 'Left sleeve'
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
          {side === 'back' && technique !== 'dtg' && <div>(DTG)</div>}
        </div>
        {/* {label.length > 0 && <div className={styles.label}>{label}</div>}
        {type === 'DTG' && <div className={styles.dtg}>DTG</div>} */}
      </div>
    </div>
  )
}

export default MerchDTGCard

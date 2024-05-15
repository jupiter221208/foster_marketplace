import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// json

// styles
import styles from './index.module.scss'

const MerchDTGCard = props => {
  const { image, selected = false, side = 'front', type = '', label = '', onSelect } = props
  const [color, setColor] = useState('white')

  return (
    <div className={styles.container}>
      <div className={`${styles.imageArea} ${selected ? styles.selected : ''}`} onClick={() => onSelect(side)}>
        <img src={image} alt="" />
      </div>
      <div className="flex flex-col gap-[2px] mt-[4px] justify-center items-center">
        <div className={styles.side}>
          {side === 'front'
            ? 'Full Front'
            : side === 'back'
            ? 'Back'
            : side === 'right'
            ? 'Right sleeve'
            : 'Left sleeve'}
        </div>
        {label.length > 0 && <div className={styles.label}>{label}</div>}
        {type === 'DTG' && <div className={styles.dtg}>DTG</div>}
      </div>
    </div>
  )
}

export default MerchDTGCard

import React from 'react'

// styles
import styles from './index.module.scss'

const StudioCard = props => {
  const { data, onSelected } = props

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src={data['asset_url']} alt="" className={styles.imageStatus} loading="lazy" />
        <div className={styles.titleContainer}>
          <div className={styles.titleText}>{data.name}</div>
        </div>
      </div>
      <div className={styles.baseContainer}>
        <div className={styles.baseText}>
          {data.bases.map((item, index) => (
            <div
              key={index}
              className={item.selected === 'true' ? styles.selected : styles.deselected}
              onClick={() => onSelected(data.type, item.name, item.base)}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StudioCard

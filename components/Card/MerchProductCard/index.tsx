import React from 'react'

// styles
import styles from './index.module.scss'

const MerchProductCard = props => {
  const { data, onSelectedCard } = props

  return (
    <div className={styles.container}>
      <div className={styles.imageArea} onClick={() => onSelectedCard(data)}>
        <div className={styles.imageContent}>
          <img src={data.image} alt="" />
        </div>
      </div>
      <div className="w-full mt-[10px]">
        <div className={styles.name}>{data.name}</div>
      </div>
      <div className="w-full mt-[10px]">
        <div className={styles.description}>{data.description}</div>
      </div>
      <div className="w-full h-[20px] mt-[9px] flex justify-between">
        <div className="flex gap-[9px]">
          <div className={styles.blackColor} />
          <div className={styles.whiteColor} />
        </div>
        <div className={styles.size}>{data.size}</div>
      </div>

      <div className="w-full mt-[30px] mb-[10px]">
        <div
          className={data.selected ? styles.startEnableBtn : styles.startDisableBtn}
          onClick={() => onSelectedCard(data)}
        >
          Start&nbsp;Designing
        </div>
      </div>
    </div>
  )
}

export default MerchProductCard

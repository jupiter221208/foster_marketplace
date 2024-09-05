import React from 'react'

import styles from './index.module.scss'

const QuantityCard = props => {
  const { qty, onMinus, onPlus } = props

  return (
    <div className={styles.layout}>
      <div className={styles.mintQty}>
        <div onClick={() => onMinus()}>
          <div className={styles.minus}>-</div>
        </div>
        <div className={styles.mintLabel}>
          Qty&nbsp;<div className={styles.mintValue}>{qty}</div>
        </div>
        <div onClick={() => onPlus()}>
          <div className={styles.minus}>+</div>
        </div>
      </div>
    </div>
  )
}

export default QuantityCard

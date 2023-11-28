import React from 'react'
import styles from './index.module.scss'

const Radio = props => {
  const { onChange, disabled } = props

  return (
    <div className="flex justify-between my-3 lg:my-4 gap-4 z-10">
      <input className={styles.radio} type="radio" onClick={onChange} checked={!disabled} />
      <label className={styles.label} onClick={onChange}>
        Use same address from previous order
      </label>
    </div>
  )
}

export default Radio

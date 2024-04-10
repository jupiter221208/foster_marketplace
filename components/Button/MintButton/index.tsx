import React from 'react'

// styles
import styles from './index.module.scss'

const MintButton = props => {
  const { onClick, disabled = false } = props

  return (
    <button
      type="button"
      onClick={() => !disabled && onClick()}
      className={`${styles.container} ${disabled ? styles.disable : styles.enable}`}
    >
      <div className="flex gap-[9px] items-center">
        <div className="mt-[-4px]">Mint</div>
      </div>
    </button>
  )
}

export default MintButton

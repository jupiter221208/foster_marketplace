import React from 'react'

// next components
import Image from 'next/image'

// assets
import LeftArrow from '/assets/icons/arrow-left-black.svg?component'

// styles
import styles from './index.module.scss'

const BackButton = props => {
  const { onClick, disabled = false } = props

  return (
    <button
      type="button"
      onClick={() => !disabled && onClick()}
      className={`${styles.container} ${disabled ? styles.disable : styles.enable}`}
    >
      <div className="flex gap-[9px] items-center">
        <LeftArrow />
        <div className="mt-[-4px]">Back</div>
      </div>
    </button>
  )
}

export default BackButton

import React from 'react'

// next components

// assets
import RightArrow from '/assets/icons/arrow-right-black.svg?component'
import RightGrayArrow from '/assets/icons/arrow-right-gray.svg?component'

// styles
import styles from './index.module.scss'

const NextButton = props => {
  const { onClick, disabled = false } = props

  return (
    <button
      type="button"
      onClick={() => !disabled && onClick()}
      className={`${styles.container} ${disabled ? styles.disable : styles.enable}`}
    >
      <div className="flex gap-[9px] items-center">
        <div className="mt-[-4px]">Next</div>
        {disabled ? <RightGrayArrow /> : <RightArrow />}
      </div>
    </button>
  )
}

export default NextButton

import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const OutlineButton = props => {
  const {
    label,
    onClick,
    fullWidth,
    color,
    borderWidth = 1,
    borderColor,
    width = '',
    height = '',
    icon = '',
    direction = 'ltr',
  } = props
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={styles.container}
      style={{
        color: color,
        borderWidth: borderWidth,
        borderColor: borderColor,
        height: height,
        width: fullWidth ? '100%' : width,
      }}
    >
      {direction === 'rtl' && icon !== '' && (
        <div className="flex items-center mr-[15px]">
          <Image src={icon} alt="" />
        </div>
      )}
      <div>{label}</div>
      {direction === 'ltr' && icon !== '' && (
        <div className="flex items-center ml-[15px]">
          <Image src={icon} alt="" />
        </div>
      )}
    </button>
  )
}

export default OutlineButton

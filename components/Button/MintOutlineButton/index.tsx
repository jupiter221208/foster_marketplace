import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const MintOutlineButton = props => {
  const {
    borderColor,
    borderRadius = '',
    borderWidth = 1,
    color,
    direction = 'ltr',
    fullWidth,
    height = '',
    icon = '',
    label,
    onClick,
    width = '',
  } = props
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={`${styles.container} gap-2 xl:gap-4`}
      style={{
        color: color,
        borderWidth: borderWidth,
        borderColor: borderColor,
        borderRadius: borderRadius,
        height: height,
        width: fullWidth ? '100%' : width,
      }}
    >
      {direction === 'rtl' && icon !== '' && (
        <div className="flex items-center">
          <Image src={icon} alt="" />
        </div>
      )}
      {label !== '' && <div>{label}</div>}
      {direction === 'ltr' && icon !== '' && (
        <div className="flex items-center">
          <Image src={icon} alt="" />
        </div>
      )}
    </button>
  )
}

export default MintOutlineButton

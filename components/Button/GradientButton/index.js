import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const GradientButton = props => {
  const {
    label,
    onClick,
    fullWidth,
    color,
    backgroundColor01,
    backgroundColor02,
    width = '',
    height = '',
    direction = 'ltr',
    icon = '',
  } = props

  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={styles.container}
      style={{
        width: fullWidth ? '100%' : width,
        color: color,
        background: `linear-gradient(to left, ${backgroundColor01}, ${backgroundColor02})`,
        height: height,
      }}
    >
      {direction === 'rtl' && icon !== '' && (
        <div className="flex items-center mr-2 xl:mr-[15px]">
          <Image src={icon} alt="" />
        </div>
      )}
      <div>{label}</div>
      {direction === 'ltr' && icon !== '' && (
        <div className="flex items-center ml-2 xl:ml-[15px]">
          <Image src={icon} alt="" />
        </div>
      )}
    </button>
  )
}

export default GradientButton

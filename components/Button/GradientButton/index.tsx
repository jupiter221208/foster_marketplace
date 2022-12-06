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
    backgroundColor01 = '#5ac3ba',
    backgroundColor02 = '#378287',
    width = '',
    height = '',
    direction = 'ltr',
    gradientDirection = 'left',
    icon = '',
    fontFamily = '',
    fontSize = '',
    borderRadius = '',
    disabled = false,
    paddingLeft = '',
    paddingRight = '',
    opacity = 1,
  } = props

  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={styles.container}
      disabled={disabled}
      style={{
        width: fullWidth ? '100%' : width,
        color: color,
        background: `linear-gradient(to ${gradientDirection}, ${backgroundColor01}, ${backgroundColor02})`,
        height: height,
        fontFamily: fontFamily,
        fontSize: fontSize,
        borderRadius: borderRadius,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        opacity: disabled ? 0.5 : opacity,
      }}
    >
      {(direction === 'both' || direction === 'rtl') && icon !== '' && (
        <div className="flex items-center mr-2 xl:mr-[15px]">
          <Image src={icon} alt="" />
        </div>
      )}
      <div>{label}</div>
      {(direction === 'both' || direction === 'ltr') && icon !== '' && (
        <div className="flex items-center ml-2 xl:ml-[15px]">
          <Image src={icon} alt="" />
        </div>
      )}
    </button>
  )
}

export default GradientButton

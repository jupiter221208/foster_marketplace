import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const GradientButtonWithSVG = props => {
  const {
    label,
    onClick,
    fullWidth,
    color,
    backgroundColor01 = '#95DBD5',
    backgroundColor02 = '#4B6E6B',
    width = '',
    height = '',
    direction = 'ltr',
    gradientDirection = 'left',
    icon = '',
    fontFamily = '',
    fontSize = '',
    borderRadius = '',
    borderColor = '',
    borderWidth = '',
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
        borderColor: borderColor,
        borderWidth: borderWidth,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        opacity: disabled ? 0.5 : opacity,
      }}
    >
      {(direction === 'both' || direction === 'rtl') && icon !== '' && (
        <div className="flex items-center mr-2 xl:mr-[15px]">{icon}</div>
      )}
      <div>{label}</div>
      {(direction === 'both' || direction === 'ltr') && icon !== '' && (
        <div className="flex items-center ml-2 xl:ml-[15px]">{icon}</div>
      )}
    </button>
  )
}

export default GradientButtonWithSVG

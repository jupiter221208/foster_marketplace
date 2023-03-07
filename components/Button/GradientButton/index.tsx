import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'
import { useSelector } from 'react-redux'

const GradientButton = props => {
  const lightMode = useSelector(state => (state as any).lightMode)

  const {
    label,
    onClick,
    fullWidth,
    color,
    backgroundColor01 = lightMode ? '#4B6E6B' : '#5ac3ba',
    backgroundColor02 = lightMode ? '#95DBD5' : '#326B67',
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

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
    color = '#eff0f6',
    backgroundColor,
    backgroundColor01 = '#242424',
    backgroundColor02 = '#242424',
    width = '',
    height = '',
    direction = 'ltr',
    gradientDirection = 'left',
    icon = '',
    icon1 = '',
    fontFamily,
    fontSize = '',
    borderRadius = '',
    borderWidth = '',
    borderColor = 'rgba(239, 240, 247, 0.1)',
    disabled = false,
    paddingLeft = '',
    paddingRight = '',
    opacity = 1,
  } = props

  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={`${styles.container} min-w-max`}
      disabled={disabled}
      style={{
        width: fullWidth ? '100%' : width,
        color: color,
        background: backgroundColor
          ? 'var(--primary-btn-bg-right)'
          : `linear-gradient(to ${gradientDirection}, ${backgroundColor01}, ${backgroundColor02})`,
        height: height,
        fontFamily: fontFamily,
        fontSize: fontSize,
        borderRadius: borderRadius,
        borderWidth: borderWidth,
        borderColor: borderColor,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        opacity: disabled ? 0.5 : opacity,
      }}
    >
      {(direction === 'both' || direction === 'rtl') &&
        (icon1 !== '' ? (
          <div className="flex items-center mr-2 xl:mr-[15px]">{icon1}</div>
        ) : icon !== '' ? (
          <div className="flex items-center mr-2 xl:mr-[12px]">
            <Image src={icon} alt="" />
          </div>
        ) : (
          <></>
        ))}
      <div>{label}</div>
      {(direction === 'both' || direction === 'ltr') &&
        (icon1 !== '' ? (
          <div className="flex items-center ml-2 xl:ml-[15px]">{icon1}</div>
        ) : icon !== '' ? (
          <div className="flex items-center ml-2 xl:ml-[12px]">
            <Image src={icon} alt="" />
          </div>
        ) : (
          <></>
        ))}
    </button>
  )
}

export default GradientButton

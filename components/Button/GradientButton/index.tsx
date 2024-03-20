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
    color = '',
    backgroundColor,
    backgroundColor01 = 'var(--primary-btn-bg)',
    backgroundColor02 = 'var(--primary-btn-bg)',
    width = '',
    height = '',
    direction = 'ltr',
    gradientDirection = 'left',
    icon = '',
    icon1 = '',
    fontFamily,
    fontSize = '',
    borderRadius = '',
    borderWidth = '1px',
    borderColor = 'var(--primary-btn-border)',
    disabled = false,
    paddingLeft = '',
    paddingRight = '',
    opacity = 1,
  } = props

  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={`${styles.container} min-w-max ${disabled ? '' : styles.hoverBtn}`}
      disabled={disabled}
      style={{
        width: fullWidth ? '100%' : width,
        color: color,
        background: backgroundColor
          ? 'var(--primary-btn-bg)'
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

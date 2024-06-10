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
    width = '',
    height = '',
    direction = 'ltr',
    icon = '',
    icon1 = '',
    fontFamily,
    fontSize = '',
    borderRadius = '',
    borderWidth = '1px',
    borderColor = 'rgba(var(--main-bg-color-rgb), 0.1)',
    disabled = false,
    paddingLeft = '',
    paddingRight = '',
    opacity = 1,
  } = props

  return (
    <button
      type="button"
      onClick={() => !disabled && onClick()}
      className={`${styles.container} min-w-max ${disabled ? styles.disabledBtn : styles.hoverBtn}`}
      style={{
        width: fullWidth ? '100%' : width,
        height: height,
        fontFamily: fontFamily,
        fontSize: fontSize,
        borderRadius: borderRadius,
        borderWidth: borderWidth,
        borderColor: borderColor,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        opacity: opacity,
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
      <div className="mt-[-4px]">{label}</div>
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

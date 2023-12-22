import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const OutlineButton = props => {
  const {
    backgroundColor = '',
    borderColor,
    borderRadius = '',
    borderWidth = 1,
    color,
    direction = 'ltr',
    fontSize = '',
    fontFamily = '',
    fullWidth,
    height = '',
    icon = '',
    label,
    onClick,
    width = '',
    paddingLeft = '',
    paddingRight = '',
    justifyContent = 'center',
    gap = '',
    disabled = false,
  } = props

  return (
    <button
      type="button"
      onClick={() => onClick()}
      disabled={disabled}
      className={`${styles.container} gap-2 xl:gap-4 whitespace-nowrap`}
      style={{
        backgroundColor: backgroundColor,
        color: color,
        borderWidth: borderWidth,
        borderColor: borderColor,
        borderRadius: borderRadius,
        fontSize: fontSize,
        fontFamily: fontFamily,
        height: height,
        width: fullWidth ? '100%' : width,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        justifyContent: justifyContent,
        gap: gap,
      }}
    >
      {label !== '' && <div>{label}</div>}
      {direction === 'ltr' && icon !== '' && <div className="flex items-center">{icon}</div>}
    </button>
  )
}

export default OutlineButton

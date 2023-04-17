import React from 'react'
import { useSelector } from 'react-redux'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const SecondaryButton = props => {
  const {
    backgroundColor = '',
    borderColor,
    borderRadius = '',
    color,
    fontSize = '',
    fontFamily = '',
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
      className={`${styles.container} gap-2 xl:gap-4 whitespace-nowrap`}
      style={{
        backgroundColor: backgroundColor,
        color: color,
        borderColor: borderColor,
        borderRadius: borderRadius,
        fontSize: fontSize,
        fontFamily: fontFamily,
        height: height,
        width: fullWidth ? '100%' : width,
      }}
    >
      <div className="flex items-center">
        {/* <Image src={icon} alt="" /> */}
        {icon}
      </div>

      <div>{label}</div>
    </button>
  )
}

export default SecondaryButton

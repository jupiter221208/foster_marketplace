import React from 'react'

// next components

// styles
import styles from './index.module.scss'

const SecondaryButton = props => {
  const {
    borderColor,
    borderRadius = '',
    color,
    fullWidth,
    fontSize,
    fontFamily = '',
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
      className={`${styles.container} gap-2 xl:gap-[4px] whitespace-nowrap`}
      style={{
        color: color,
        borderColor: borderColor,
        borderRadius: borderRadius,
        height: height,
        fontSize: fontSize,
        fontFamily: fontFamily,
        width: fullWidth ? '100%' : width,
      }}
    >
      {icon !== '' && <div className="flex items-center">{icon}</div>}

      <div>{label}</div>
    </button>
  )
}

export default SecondaryButton

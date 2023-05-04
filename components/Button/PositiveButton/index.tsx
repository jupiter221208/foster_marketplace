import React from 'react'

// next components

// styles
import styles from './index.module.scss'

const PositiveButton = props => {
  const { label, width, height, borderRadius, fontFamily, fontSize, fontColor, onClick } = props
  return (
    <button
      type="button"
      style={{
        width: width,
        height: height,
        borderRadius: borderRadius,
        fontFamily: fontFamily,
        fontSize: fontSize,
        color: fontColor,
      }}
      onClick={() => onClick()}
      className={`${styles.container} gap-2 xl:gap-4 whitespace-nowrap`}
    >
      {label !== '' && <div>{label}</div>}
    </button>
  )
}

export default PositiveButton

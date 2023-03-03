import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'
import { useSelector } from 'react-redux'

const NegativeButton = props => {
  const { label, width, height, borderRadius, fontFamily, fontSize, fontColor, onClick } = props
  const lightMode = useSelector(state => (state as any).lightMode)

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
      className={`${styles.container} ${lightMode ? styles.lightColor : ''} gap-2 xl:gap-4 whitespace-nowrap`}
    >
      {label !== '' && <div>{label}</div>}
    </button>
  )
}

export default NegativeButton

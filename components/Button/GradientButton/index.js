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
    color,
    backgroundColor01,
    backgroundColor02,
    width = '',
    height = '',
    icon = '',
    direction = 'ltr',
  } = props
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={styles.container}
      style={{
        width: fullWidth ? '100%' : width,
        color: color,
        background: `linear-gradient(to left, ${backgroundColor01}, ${backgroundColor02})`,
        height: height,
      }}
    >
      {direction === 'ltr' ? (
        <div className="flex gap-3">
          {label}
          {icon !== '' && <Image src={icon} alt="" />}
        </div>
      ) : (
        <div className="flex gap-3">
          {icon !== '' && <Image src={icon} alt="" />}
          {label}
        </div>
      )}
    </button>
  )
}

export default GradientButton

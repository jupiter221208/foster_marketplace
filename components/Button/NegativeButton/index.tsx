import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const NegativeButton = props => {
  const { label, width, height, borderRadius, onClick } = props
  return (
    <button
      type="button"
      style={{
        width: width,
        height: height,
        borderRadius: borderRadius,
      }}
      onClick={() => onClick()}
      className={`${styles.container} gap-2 xl:gap-4 whitespace-nowrap`}
    >
      {label !== '' && <div>{label}</div>}
    </button>
  )
}

export default NegativeButton

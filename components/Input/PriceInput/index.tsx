import React from 'react'

// next components
import Image from 'next/image'

// import images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const PriceInput = props => {
  const {
    value,
    placeholder,
    onChange,
    fullWidth,
    width = '',
    height = '',
    fontSize = '',
    borderColor = '',
    borderRadius = '',
    paddingLeft = '',
    paddingRight = '',
  } = props
  return (
    <div
      className={styles.container}
      style={{
        width: fullWidth ? '100%' : width,
        height: height,
        fontSize: fontSize,
        borderColor: borderColor,
        borderRadius: borderRadius,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
      }}
    >
      <input
        className={styles.inputArea}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        style={{ fontSize }}
      />
      <Image src={SolanaLogoIcon} alt="" width={16} height={16} />
    </div>
  )
}

export default PriceInput

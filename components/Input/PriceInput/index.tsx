import React from 'react'

// next components
import Image from 'next/image'

// import images and icons
import SolanaLogoIcon from 'assets/icons/solana-price.svg'

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
      <div className="mx-[8px] flex items-center">
        <Image src={SolanaLogoIcon} alt="" width={15} height={15} />
      </div>

      <input
        className={styles.inputArea}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        style={{ fontSize }}
      />
    </div>
  )
}

export default PriceInput

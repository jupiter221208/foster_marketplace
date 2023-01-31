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
    onMax,
    fullWidth,
    width = '',
    height = '',
    fontSize = '',
    borderColor = '',
    backgroundColor = '',
    borderRadius = '',
    paddingLeft = '',
    paddingRight = '',
    showMax = false,
  } = props
  return (
    <div
      className={styles.container}
      style={{
        width: fullWidth ? '100%' : width,
        height: height,
        backgroundColor: backgroundColor,
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
        type="number"
        className={styles.inputArea}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        style={{ fontSize }}
      />

      {showMax && (
        <div className={styles.maxText} onClick={() => onMax()}>
          Max
        </div>
      )}
    </div>
  )
}

export default PriceInput

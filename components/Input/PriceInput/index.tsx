import React from 'react'

// next components

// import images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-green-mobile.svg?component'

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
    borderWidth = '',
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
        borderWidth: borderWidth,
        borderRadius: borderRadius,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
      }}
    >
      <div className="mx-[8px] flex items-center">
        <SolanaLogoIcon />
      </div>

      <input
        type="number"
        min="0"
        className={styles.inputArea}
        value={value}
        placeholder={placeholder}
        onChange={event => {
          let value = event.target.value
          let strValue = value.toString()
          let splitValues = strValue.split('.')
          if (splitValues.length > 1 && splitValues[1].length > 2) {
            if (splitValues[0].length === 0) {
              onChange('.' + splitValues[1].substring(0, 2))
            } else {
              onChange(Number(value).toFixed(2))
            }
          } else {
            onChange(value)
          }
        }}
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

import React from 'react'

// next components
import Image from 'next/image'

// import images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const PriceInput = props => {
  const { value, placeholder, onChange, fullWidth } = props
  return (
    <div className={styles.container} style={{ width: fullWidth ? '100%' : '' }}>
      <input
        className={styles.inputArea}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />
      <div className="w-6 h-6">
        <Image src={SolanaLogoIcon} alt="" />
      </div>
    </div>
  )
}

export default PriceInput

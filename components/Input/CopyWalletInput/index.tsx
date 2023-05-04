import React from 'react'

// next components

// import images and icons
import CopyAltLightGreenIcon from 'assets/icons/copy-alt-dark.svg?component'

// styles
import styles from './index.module.scss'

const CopyWalletInput = props => {
  const { value, placeholder, onChange, onClick } = props
  return (
    <div className={styles.container}>
      <input
        className={styles.inputArea}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        disabled
      />
      <CopyAltLightGreenIcon className="cursor-pointer" onClick={() => onClick()} />
    </div>
  )
}

export default CopyWalletInput

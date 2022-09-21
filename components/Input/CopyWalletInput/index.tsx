import React from 'react'

// next components
import Image from 'next/image'

// import images and icons
import CopyAltLightGreenIcon from 'assets/icons/copy-alt-light-green.svg'

// styles
import styles from './index.module.scss'

const CopyWalletInput = props => {
  const { value, placeholder, onChange, onClick, disabled } = props
  return (
    <div className={styles.container}>
      <input
        className={styles.inputArea}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        disabled
      />
      <Image src={CopyAltLightGreenIcon} alt="" className="cursor-pointer" onClick={() => onClick()} />
    </div>
  )
}

export default CopyWalletInput

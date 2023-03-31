import React from 'react'

// next components
import Image from 'next/image'

// images and icons
import FileCopyIcon from 'assets/icons/file-copy.svg?component'

// styles
import styles from './index.module.scss'

const AddressButton = props => {
  const { label, onClick } = props

  return (
    <button type="button" onClick={() => onClick()} className={styles.container}>
      <div className={styles.label}>{label}</div>
      {/* <Image src={FileCopyIcon} alt="" width={20} height={20} /> */}
      <FileCopyIcon />
    </button>
  )
}

export default AddressButton

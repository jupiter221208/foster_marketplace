import React from 'react'

// next components

// images and icons
import FileCopyIcon from 'assets/icons/file-copy.svg?component'

// styles
import styles from './index.module.scss'

const AddressButton = props => {
  const { label, onClick } = props

  return (
    <button type="button" onClick={() => onClick()} className={styles.container}>
      <div className={styles.label}>{label}</div>
      <FileCopyIcon />
    </button>
  )
}

export default AddressButton

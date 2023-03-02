import React from 'react'
import { useSelector } from 'react-redux'

// next components
import Image from 'next/image'

// images and icons
import FileCopyIcon from 'assets/icons/file-copy.svg'

// styles
import styles from './index.module.scss'

const AddressButton = props => {
  const { label, onClick } = props
  const lightMode = useSelector(state => (state as any).lightMode)

  return (
    <button type="button" onClick={() => onClick()} className={styles.container}>
      <div className={`${styles.label} ${lightMode ? styles.lightLabel : ''}`}>{label}</div>
      <Image src={FileCopyIcon} alt="" width={20} height={20} />
    </button>
  )
}

export default AddressButton

import React from 'react'

// next components
import Image from 'next/image'

// images and icons
import FileCopyIcon from 'assets/icons/file-copy.svg'

// styles
import styles from './index.module.scss'

const AddressButton = props => {
  const { label, onClick } = props
  return (
    <button type="button" onClick={() => onClick()} className={styles.container}>
      <div>{label}</div>
      <div className="flex items-center ml-[20px]">
        <Image src={FileCopyIcon} alt="" />
      </div>
    </button>
  )
}

export default AddressButton

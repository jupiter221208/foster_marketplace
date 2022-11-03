import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import FileCopyIcon from 'assets/icons/file-copy.svg'

// styles
import styles from './index.module.scss'

const AddressButton = props => {
  const { label, onClick } = props
  const viewport = useViewport()

  return (
    <button type="button" onClick={() => onClick()} className={styles.container}>
      {label}
      <Image
        src={FileCopyIcon}
        alt=""
        width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : 20}
        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : 20}
      />
    </button>
  )
}

export default AddressButton

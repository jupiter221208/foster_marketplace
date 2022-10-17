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
  const { label, onClick, width, height } = props
  const viewport = useViewport()

  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={styles.container}
      style={{ width: width, height: height }}
    >
      <div className={styles.label}>{label}</div>
      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        <div className="flex items-center ml-[12px]">
          <Image src={FileCopyIcon} alt="" width={12} height={12} />
        </div>
      ) : (
        <div className="flex items-center ml-[20px]">
          <Image src={FileCopyIcon} alt="" width={20} height={20} />
        </div>
      )}
    </button>
  )
}

export default AddressButton

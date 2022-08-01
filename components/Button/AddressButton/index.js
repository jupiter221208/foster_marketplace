import React from 'react'

// next components
import Image from 'next/image'

// images and icons
import FileCopyIcon from 'assets/icons/file-copy.svg'

// styles
import styles from './index.module.scss'

const AddressButton = props => {
  const { label, onClick, width, height, viewport } = props
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={styles.container}
      style={{ width: width, height: height }}
    >
      {(viewport === 'xs' || viewport === 'sm' || viewport === 'md') && (
        <div className="flex items-center mr-2">
          <Image src={FileCopyIcon} alt="" width={12} height={12} />
        </div>
      )}
      <div>{label}</div>
      {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && (
        <div className="flex items-center ml-[20px]">
          <Image src={FileCopyIcon} alt="" width={20} height={20} />
        </div>
      )}
    </button>
  )
}

export default AddressButton

import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const VerifyButton = props => {
  const { icon = '', icon_verified, label, verified = false, onClick } = props
  return (
    <button type="button" onClick={() => onClick()} className={verified ? `${styles.shadow}` : `${styles.container}`}>
      <div className="absolute left-[17px] items-center">
        <Image src={verified ? icon_verified : icon} alt="" />
      </div>

      <div>{verified ? 'Verified' : label}</div>
    </button>
  )
}

export default VerifyButton

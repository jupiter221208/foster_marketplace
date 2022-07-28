import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const SocialButton = props => {
  const { icon, onClick } = props
  return (
    <button type="button" className={styles.container} onClick={() => onClick()}>
      <div className={styles.image}>
        <Image src={icon} alt="" />
      </div>
    </button>
  )
}

export default SocialButton

import React, { useState } from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const SocialButton = props => {
  const { icon, iconHover, onClick } = props
  const [hover, setHover] = useState(false)

  return (
    <button
      type="button"
      className={styles.container}
      style={hover ? { borderColor: '#5ac3ba' } : {}}
      onClick={() => onClick()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={styles.image}>
        <Image src={hover ? iconHover : icon} alt="" />
      </div>
    </button>
  )
}

export default SocialButton

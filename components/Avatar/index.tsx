import React from 'react'

// next components
import Image from 'next/image'
// styles
import styles from './index.module.scss'

const Avatar = props => {
  const { avatar, width, height } = props

  return (
    <div className={styles.avatarArea} style={{ width: `${width + 4}px`, height: `${height + 4}px` }}>
      <Image src={avatar} width={width} height={height} className="rounded-full" alt="" />
    </div>
  )
}

export default Avatar

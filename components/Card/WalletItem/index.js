import React from 'react'

// next components
import Image from 'next/image'

//styles
import styles from './index.module.scss'

const WalletItem = props => {
  const { icon, name } = props
  return (
    <div className={styles.container}>
      <div className="w-full flex items-center">
        <div className={styles.line}></div>
        <div className={styles.icon}>
          <Image src={icon} alt="" width={40} height={40} />
        </div>
        <div className={styles.name}>{name}</div>
      </div>
      <div className={styles.connect}>Connect</div>
    </div>
  )
}

export default WalletItem

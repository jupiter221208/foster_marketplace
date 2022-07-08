import React, { useState } from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const ProfileMenu = props => {
  const { avatar, menuList, onSelect } = props
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <div className={styles.container} onClick={() => setOpen(!open)}>
        <Image src={avatar} alt="" width={42} height={42} layout="responsive" objectFit="cover" />
      </div>
      {open && (
        <div className={styles.menuArea}>
          {menuList.map((item, index) => (
            <div key={index} className={styles.menuItem} onClick={() => onSelect(item)}>
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfileMenu

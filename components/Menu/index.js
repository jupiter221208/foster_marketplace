import React, { useState } from 'react'

// next components
import Image from 'next/image'

// images and icons
import ArrowDownGreenIcon from 'assets/icons/arrow-down-green.svg'

// styles
import styles from './index.module.scss'

const Menu = props => {
  const { label, menuList, onSelect } = props

  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <div className={styles.container} onClick={() => setOpen(!open)}>
        <div className="mr-[9px]">{label}</div>
        <Image src={ArrowDownGreenIcon} alt="" />
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

export default Menu

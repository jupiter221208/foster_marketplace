import React, { useEffect, useRef, useState } from 'react'

// next components
import Image from 'next/image'

// images and icons
import ArrowDownGreenIcon from 'assets/icons/arrow-down-green.svg'

// styles
import styles from './index.module.scss'

const Menu = props => {
  const { label, menuList, onSelect } = props

  const [open, setOpen] = useState(false)

  const closeRef = useRef()

  const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
      const listener = event => {
        if (!ref.current || ref.current.contains(event.target)) {
          return
        }
        handler(!open)
      }
      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener)
      return () => {
        document.removeEventListener('mousedown', listener)
        document.removeEventListener('touchstart', listener)
      }
    }, [ref, handler])
  }

  useOnClickOutside(closeRef, () => handleSetOpen())

  const handleSetOpen = bool => {
    setOpen(bool)
  }

  return (
    <div className="relative">
      <div className={styles.container} onClick={() => setOpen(!open)}>
        <div className="mr-[9px]">{label}</div>
        <div className="w-3 h-3 flex justify-center items-center mt-1">
          <Image src={ArrowDownGreenIcon} alt="" />
        </div>
      </div>
      {open && (
        <div className={styles.menuArea} ref={closeRef}>
          {menuList.map((item, index) => (
            <div
              key={index}
              className={styles.menuItem}
              onClick={() => {
                setOpen(!open)
                onSelect(item)
              }}
            >
              <div className="w-10 h-10">
                <Image src={item.icon} alt="" width={40} height={40} />
              </div>
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Menu

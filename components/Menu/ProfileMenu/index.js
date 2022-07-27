import React, { useEffect, useRef, useState } from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const ProfileMenu = props => {
  const { avatar, menuList, onSelect } = props
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
        <Image src={avatar} alt="" width={42} height={42} layout="responsive" objectFit="cover" />
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
              {item.id === 0 ? (
                <div className="w-10 h-10 flex justify-center items-center">
                  <div className={styles.imageArea}>
                    <Image src={item.icon} alt="" width={24} height={24} className="rounded-full" />
                  </div>
                </div>
              ) : (
                <div className="w-10 h-10">
                  <Image src={item.icon} alt="" width={40} height={40} />
                </div>
              )}

              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfileMenu

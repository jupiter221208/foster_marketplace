import React, { MutableRefObject, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useViewport } from 'utils'

// component
import ShoppingCartSection from 'components/pages/ShoppingCart/ShoppingCartSection'

// third party components
import { Menu as HMenu } from '@headlessui/react'

// Icons
import ShoppingCartIcon from 'assets/icons/shoppingcart-icon-navbar.svg?component'

// styles
import styles from './index.module.scss'

// apis

const ShoppingCartMenu = () => {
  const dispatch = useDispatch()
  const viewport = useViewport()
  const menuRef = useRef<HTMLElement | null>(null)
  const itemRef = useRef<HTMLElement | null>(null)

  const [isMenuOpen, setIsMenuOpen] = React.useState(false) // Initially menu is hidden

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen) // Toggle the current boolean value
  }

  const handleClickOutside = event => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      itemRef.current &&
      !itemRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  return (
    <div className="flex items-center">
      <HMenu>
        <HMenu.Button onClick={toggleMenu} ref={itemRef as MutableRefObject<HTMLButtonElement>}>
          <div className={styles.container}>
            <div className={styles.iconArea}>
              <ShoppingCartIcon alt="" />
            </div>
          </div>
        </HMenu.Button>
        {isMenuOpen && (
          <div ref={menuRef as MutableRefObject<HTMLDivElement>} className={styles.menuArea}>
            <ShoppingCartSection onClose={() => toggleMenu()} />
          </div>
        )}
        {/* </Transition> */}
      </HMenu>
    </div>
  )
}

export default ShoppingCartMenu

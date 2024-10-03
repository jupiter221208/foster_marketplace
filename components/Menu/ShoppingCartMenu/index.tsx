import React, { MutableRefObject, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

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
  const openShoppingCart = useSelector(state => (state as any).openShoppingCart)
  const dispatch = useDispatch()

  const menuRef = useRef<HTMLElement | null>(null)
  const itemRef = useRef<HTMLElement | null>(null)

  const [isMenuOpen, setIsMenuOpen] = React.useState(false) // Initially menu is hidden

  useEffect(() => {
    if (openShoppingCart) {
      setIsMenuOpen(true)
    }
  }, [openShoppingCart])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen) // Toggle the current boolean value
    if (isMenuOpen) dispatch({ type: 'set', openShoppingCart: false })
  }

  const handleClickOutside = event => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      itemRef.current &&
      !itemRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false)
      dispatch({ type: 'set', openShoppingCart: false })
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
      </HMenu>
    </div>
  )
}

export default ShoppingCartMenu

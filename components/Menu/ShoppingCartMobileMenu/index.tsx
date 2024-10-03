import React from 'react'
import { useDispatch } from 'react-redux'

// next components
import ShoppingCartSection from 'components/pages/ShoppingCart/ShoppingCartSection'

// styles
import styles from './index.module.scss'

const ShoppingCartMobileMenu = () => {
  const dispatch = useDispatch()
  return (
    <div className={styles.menu}>
      <div className={styles.container}>
        <ShoppingCartSection
          onClose={() => {
            dispatch({ type: 'set', openShoppingCart: false })
            console.log('==============7================')
          }}
        />
      </div>
    </div>
  )
}

export default ShoppingCartMobileMenu

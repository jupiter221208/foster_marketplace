import React, { useState, useEffect } from 'react'

// component
import PrimaryButton from 'components/Button/PrimaryButton'
import ShoppingCartActivity from 'components/pages/MerchLogs/ShoppingCartActivity'

// resources
import SolIcon from 'assets/icons/solana-logo-14x12.svg?component'

// solana
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'

// styles
import styles from './index.module.scss'

const ShoppingCartSection = props => {
  const onCheckout = () => {}
  const [cartList, setCartList] = useState([])
  const [cart, setCart] = useState([])
  const [currentSelect, setCurrentSelect] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const { solToUsdRate } = useSolToUsdRate()

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('data'))
    setCartList(storedData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getcartList = () => {
    const storedData = JSON.parse(localStorage.getItem('data'))
    setCartList(storedData)
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>Studio Shopping Cart</div>
      <div className="w-full flex justify-between mt-[15px]">
        <div className={styles.selectAll}>Select all</div>
        <div className="flex gap-[13px]">
          <div className={styles.subtotal}>Subtotal</div>
          <div className="flex gap-[6px] items-center">
            <SolIcon className="mt-[2px]" />
            <div className={styles.price}>0.65</div>
          </div>
        </div>
      </div>
      <div className="w-full mt-[18px]">
        <PrimaryButton label="Checkout" type="buy-now" fullWidth onClick={() => onCheckout()} />
      </div>
      <div className="mt-[15px]">
        <ShoppingCartActivity
          data={cartList}
          getcartList={getcartList}
          cart={cart}
          setCart={setCart}
          setCurrentSelect={setCurrentSelect}
          currentSelect={currentSelect}
          setTotalCost={setTotalCost}
          totalCost={totalCost}
        />
      </div>
    </div>
  )
}

export default ShoppingCartSection

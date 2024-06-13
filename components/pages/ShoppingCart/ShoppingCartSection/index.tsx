import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import Lottie from 'lottie-react'

// component
import PrimaryButton from 'components/Button/PrimaryButton'
import ShoppingCartActivity from 'components/pages/MerchLogs/ShoppingCartActivity'

// resources
import SolIcon from 'assets/icons/solana-logo-14x12.svg?component'
import LeftArrowIcon from 'assets/icons/arrow-left-24x24.svg?component'
import animationData from 'assets/lottery/shopping-lottie.json'

// solana
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'

const ShoppingCartSection = props => {
  const { onClose } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const [cartList, setCartList] = useState([])
  const [cart, setCart] = useState([])
  const [currentSelect, setCurrentSelect] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const { solToUsdRate } = useSolToUsdRate()
  const [selectAllCart, setSelectAllCart] = useState(false)

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('data'))
    setCartList(storedData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getcartList = () => {
    const storedData = JSON.parse(localStorage.getItem('data'))
    setCartList(storedData)
  }

  const onCheckout = () => {
    const checkedData = []
    cart.forEach(item => {
      if (item.checked === true) checkedData.push(item)
    })
    if (checkedData.length > 0) {
      localStorage.setItem('checked', JSON.stringify(checkedData))
      router.push(`/shopping/`)
      onClose()
    }
  }

  return (
    <div className={styles.container}>
      {cartList?.length > 0 ? (
        <div className="relative">
          <div className="w-full flex justify-between sm:hidden">
            <div className="flex gap-[13px] items-center">
              <div
                onClick={() => {
                  dispatch({ type: 'set', openShoppingCart: false })
                }}
              >
                <LeftArrowIcon />
              </div>
              <div className={styles.title}>Shopping Cart</div>
            </div>
            <div className="flex items-end">
              <div className={styles.selectAll} onClick={() => setSelectAllCart(!selectAllCart)}>
                {selectAllCart ? 'Deselect All' : 'Select all'}
              </div>
            </div>
          </div>
          <div className="sm:block hidden">
            <div className={styles.title}>Studio Shopping Cart</div>
          </div>
          <div className="w-full sm:flex hidden justify-between mt-[15px]">
            <div className={styles.selectAll} onClick={() => setSelectAllCart(!selectAllCart)}>
              {selectAllCart ? 'Deselect All' : 'Select all'}
            </div>
            <div className="flex gap-[13px]">
              <div className={styles.subtotal}>Subtotal</div>
              <div className="flex gap-[6px] items-center">
                <SolIcon className="mt-[2px]" />
                <div className={styles.price}>{totalCost === 0 ? '---' : (totalCost / solToUsdRate).toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div className="w-full mt-[18px] sm:block hidden">
            <GradientButton
              disabled={totalCost === 0}
              label={currentSelect === 0 ? 'Checkout' : 'Checkout (' + currentSelect + ' items)'}
              fullWidth
              onClick={() => onCheckout()}
            />
          </div>
          <div className="mt-[20px] sm:mt-[30px] sm:h-[400px] overflow-auto">
            <ShoppingCartActivity
              data={cartList}
              getcartList={getcartList}
              cart={cart}
              setCart={setCart}
              selectAllCart={selectAllCart}
              setCurrentSelect={setCurrentSelect}
              currentSelect={currentSelect}
              setTotalCost={setTotalCost}
              totalCost={totalCost}
            />
          </div>
          <div className={styles.bottomSection}>
            <div className="flex justify-between">
              <div className={styles.subtotal}>Subtotal</div>
              <div className="flex gap-[6px] items-center">
                <SolIcon className="mt-[2px]" />
                <div className={styles.price}>{totalCost === 0 ? '---' : (totalCost / solToUsdRate).toFixed(2)}</div>
              </div>
            </div>
            <div className="w-full flex justify-center  mt-[19px]">
              <GradientButton
                disabled={totalCost === 0}
                label={currentSelect === 0 ? 'Checkout' : 'Checkout (' + currentSelect + ' items)'}
                fullWidth
                onClick={() => onCheckout()}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <div className="w-[400px] h-[313px]">
            <Lottie animationData={animationData}></Lottie>
          </div>
          <div className="mt-[65px]">
            <div className={styles.lootieTitle}>Your cart is empty</div>
            <div className={styles.lootieSubTitle}>Explore studio and foster your flavor</div>
            <div className="w-full flex justify-center mt-[30px]">
              <GradientButton
                width={165}
                height={50}
                label={'Shop Studio'}
                borderRadius={30}
                onClick={() => {
                  dispatch({ type: 'set', openShoppingCart: false })

                  router.push('/studio/')
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShoppingCartSection

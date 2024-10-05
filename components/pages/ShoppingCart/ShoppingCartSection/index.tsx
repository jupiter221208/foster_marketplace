import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import Lottie from 'lottie-react'

// component
import ShoppingCartActivity from 'components/pages/MerchLogs/ShoppingCartActivity'

// resources
import SolIcon from 'assets/icons/solana-logo-14x12.svg?component'
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
  const [currentSelect, setCurrentSelect] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const { solToUsdRate } = useSolToUsdRate()
  const [selectAllCart, setSelectAllCart] = useState(false)
  const [cartVersion, setCartVersion] = useState('v2')

  useEffect(() => {
    let storedData = JSON.parse(localStorage.getItem('cart_v2'))
    if (storedData === null || storedData === undefined || storedData.length === 0) {
      storedData = JSON.parse(localStorage.getItem('cart_v1'))
      if (storedData === null || storedData === undefined || storedData.length === 0) {
        setCartList([])
      } else {
        setCartVersion('v1')
        setCartList(storedData)
      }
    } else {
      setCartList(storedData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getcartList = () => {
    const storedData = JSON.parse(localStorage.getItem(cartVersion === 'v2' ? 'cart_v2' : 'cart_v1'))
    if (storedData === null || storedData === undefined || storedData.length === 0) {
      setCartList([])
    } else setCartList(storedData)
  }

  const onCheckout = () => {
    const checkedData = []
    cartList.forEach(item => {
      if (item.checked === true) checkedData.push(item)
    })
    if (checkedData.length > 0) {
      localStorage.setItem('cart_version', cartVersion)
      localStorage.setItem('checked', JSON.stringify(checkedData))
      router.push(`/shopping/`)
      onClose()
    }
  }

  return (
    <div className={styles.container}>
      {cartList?.length > 0 ? (
        <div className="relative">
          <div className="flex justify-between items-center">
            <div className={styles.title}>{cartVersion === 'v2' ? 'Studio 2.0 Cart' : 'Studio 1.0 Cart'}</div>
            <div
              className={styles.titleV1}
              onClick={() => {
                let newVersion = ''
                if (cartVersion === 'v1') newVersion = 'v2'
                else newVersion = 'v1'

                const storedData = JSON.parse(localStorage.getItem(newVersion === 'v2' ? 'cart_v2' : 'cart_v1'))
                if (storedData === null || storedData === undefined || storedData.length === 0) {
                  setCartList([])
                } else setCartList(storedData)

                setCartVersion(newVersion)
              }}
            >
              {cartVersion === 'v2' ? 'Studio 1.0 Cart »' : 'Studio 2.0 Cart »'}
            </div>
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
                {totalCost > 0 && (
                  <div className="flex items-center">
                    <div className={styles.usd}>{'$' + totalCost.toFixed(2)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full mt-[18px] sm:block hidden">
            <GradientButton
              disabled={currentSelect === 0}
              label={currentSelect === 0 ? 'Checkout' : 'Checkout (' + currentSelect + ' items)'}
              fullWidth
              onClick={() => onCheckout()}
            />
          </div>
          <div className="mt-[20px] w-[calc(100%+16px)] sm:w-full h-[calc(100vh-280px)] sm:mt-[30px] sm:h-[400px] overflow-auto">
            <ShoppingCartActivity
              cartVersion={cartVersion}
              data={cartList}
              getcartList={getcartList}
              selectAllCart={selectAllCart}
              setCurrentSelect={setCurrentSelect}
              setTotalCost={setTotalCost}
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
        <div className="relative w-full flex flex-col items-center">
          <div className="absolute right-[0px] top-[3px]">
            <div
              className={styles.titleV1}
              onClick={() => {
                let newVersion = ''
                if (cartVersion === 'v1') newVersion = 'v2'
                else newVersion = 'v1'

                const storedData = JSON.parse(localStorage.getItem(newVersion === 'v2' ? 'cart_v2' : 'cart_v1'))
                if (storedData === null || storedData === undefined || storedData.length === 0) {
                  setCartList([])
                } else setCartList(storedData)

                setCartVersion(newVersion)
              }}
            >
              {cartVersion === 'v2' ? 'Studio 1.0 Cart »' : 'Studio 2.0 Cart »'}
            </div>
          </div>
          <div className="w-[400px] h-[313px]">
            <Lottie animationData={animationData}></Lottie>
          </div>
          <div className="mt-[65px]">
            <div className={styles.lootieTitle}>Your cart is empty</div>
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

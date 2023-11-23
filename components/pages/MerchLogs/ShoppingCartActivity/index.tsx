import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// components
import CreatorSearchSection from '../CreatorSearchSection'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// json

// functions

// styles
import styles from './index.module.scss'
import SimpleCheckbox from 'components/Checkbox/SimpleCheckbox'

const ShoppingCartActivity = props => {
  const { data, setCart, getcartList, cart, setCurrentSelect, currentSelect, setTotalCost, totalCost } = props

  const [cartList, setCartList] = useState<any[]>([])
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    setCartList(props.data)
  }, [props.data])

  const handleSelectData = index => {
    let arrayData = [...data]
    if (arrayData[index]) {
      arrayData[index].checked = !arrayData[index].checked
    }
    if (arrayData[index].checked) {
      setCurrentSelect(currentSelect + 1)
      setTotalCost(totalCost + parseFloat(arrayData[index].cost) * arrayData[index].quantity)
    } else {
      setCurrentSelect(currentSelect - 1)
      setTotalCost(totalCost - parseFloat(arrayData[index].cost) * arrayData[index].quantity)
    }

    setCart(arrayData)
  }

  const handleRemove = index => {
    let arrayData = JSON.parse(localStorage.getItem('data'))

    arrayData.splice(index, 1)
    localStorage.setItem('data', JSON.stringify(arrayData))

    getcartList()
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>Studio Shopping Cart</div>
        <div className={styles.subTitle}>Deselected all items</div>
        <div className={styles.listContainer}>
          {cartList &&
            cartList.map((item, index) => (
              <div key={index}>
                {item?.imgPath && (
                  <>
                    <div className={styles.divider}></div>
                    <div className="w-full h-full flex flex-row justify-between ml-[40px]">
                      <div className="flex items-center">
                        <SimpleCheckbox onChange={() => handleSelectData(index)} />
                      </div>
                      <div className="w-[35%] h-[35%] flex ">
                        <img src={item.imgPath} className="px-[50px] py-[50px]" alt="Item Image" />
                      </div>
                      <div className="w-full flex flex-col px-[100px] mt-[40px]">
                        <div className={`${styles.detail} text-right flex`}>Item Details</div>
                        <div className={styles.content}>
                          <div>{item.nftName}</div>
                          <div>{item.apparel.name}</div>
                          <div>{item.color.type}</div>
                          <div>Qty: {item.quantity}</div>
                        </div>
                        <div className="flex mt-[20px] items-center">
                          <div className={styles.remove} onClick={() => handleRemove(index)}>
                            Remove Item
                          </div>
                          <div className={styles.costDivider} />
                          <div className={styles.edit}>Edit</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
        <div className={`${styles.divider} mb-[50px]`}></div>
      </div>

      {/* Mobile Table */}
      <div className={styles.mobileContainer}>
        {cartList &&
          cartList.map((item, index) => (
            <div key={index}>
              {item.imgPath && (
                <div className={styles.tableColor}>
                  <div className="flex items-center ml-[30px]">
                    <SimpleCheckbox checked={item.checked} onChange={() => handleSelectData(index)} />
                  </div>
                  <div className="w-[100px] h-[100px] flex ml-[15px] mt-[10px]">
                    <img src={item.imgPath} className="w-full h-full px-3 py-3" />
                  </div>
                  <div className="flex flex-col px-[10px]">
                    <div className={styles.mobileContent}>
                      <div className="w-[150px] overflow-x-auto">{item.nftName}</div>
                      <div>{item.apparel.name}</div>
                      <div>{item.color.type}</div>
                      <div>Qty: {item.quantity}</div>
                    </div>
                    <div className="flex mt-[5px] items-center">
                      <div className={styles.mobileRemove}>Delete</div>
                      <div className={styles.costDivider} />
                      <div className={styles.mobileEdit}>Edit</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  )
}

export default ShoppingCartActivity

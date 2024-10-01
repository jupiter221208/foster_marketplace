import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// components
import CreatorSearchSection from '../CreatorSearchSection'
import { getFirstUpperString } from 'utils/helpers'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// json

// functions

// styles
import styles from './index.module.scss'
import SimpleCheckbox from 'components/Checkbox/SimpleCheckbox'
import ImageWithFoster from 'components/ImageWithFoster'

const ShoppingCartActivity = props => {
  const { data, selectAllCart, getcartList, cartVersion, setCurrentSelect, setTotalCost } = props

  const [cartList, setCartList] = useState<any[]>([])
  const router = useRouter()
  const dispatch = useDispatch()
  const [selectAll, setSelectAll] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setCartList(props.data)
  }, [props.data])

  const handleSelectData = index => {
    let arrayData = [...data]

    if (arrayData[index]) {
      arrayData[index].checked = !arrayData[index].checked
    }

    let select = 0,
      cost = 0
    arrayData.map((item, idx) => {
      if (item.checked) {
        select += cartVersion === 'v1' ? item.quantity : item.data.quantity
        cost += parseFloat(arrayData[idx].cost)
      }
    })

    setCurrentSelect(select)
    setTotalCost(cost)
  }

  const handleRemove = index => {
    let arrayData = JSON.parse(localStorage.getItem(cartVersion === 'v1' ? 'cart_v1' : 'cart_v2'))

    arrayData.splice(index, 1)
    localStorage.setItem(cartVersion === 'v1' ? 'cart_v1' : 'cart_v2', JSON.stringify(arrayData))

    getcartList()
  }

  const handleEdit = index => {
    let arrayData = JSON.parse(localStorage.getItem('data'))

    let token_id = arrayData[index].id
    let color = arrayData[index].color.type
    let colorValue

    switch (color) {
      case 'white':
        colorValue = 0
        break
      case 'black':
        colorValue = 1
        break
      case 'gray':
        colorValue = 2
        break
      case 'navy':
        colorValue = 3
        break
      default:
        colorValue = null
    }
    let apparelType = arrayData[index].apparel.description
    dispatch({ type: 'set', detailShow: true })
    dispatch({ type: 'set', apparelType })
    dispatch({ type: 'set', apparelColor: colorValue })
    router.push(`/nft/${token_id}`)

    arrayData.splice(index, 1)
    localStorage.setItem('cart_v1', JSON.stringify(arrayData))

    getcartList()
  }

  useEffect(() => {
    const allSelected = selectAllCart
    let sumitemArray = 0
    cartList.forEach(item => {
      if (cartVersion === 'v1') sumitemArray += item.quantity
      else sumitemArray += item.data.quantity
    })
    setSelectAll(allSelected)
    setCurrentSelect(allSelected ? sumitemArray : 0)
    setTotalCost(allSelected ? cartList.reduce((total, item) => total + parseFloat(item.cost), 0) : 0)
    setChecked(!checked)
    const updatedCart = cartList.map(item => {
      item.checked = allSelected
      return item
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectAllCart])

  return (
    <>
      <div className={styles.container}>
        <div className={styles.listContainer}>
          {cartList &&
            cartList.map((item, index) => (
              <div key={index}>
                {item.version === 'v2' ? (
                  <>
                    <div className={styles.divider} />
                    <div className="w-full h-full flex flex-row my-[30px]">
                      <div className="flex items-center">
                        <SimpleCheckbox isChecked={item.checked} onChange={() => handleSelectData(index)} />
                      </div>
                      <div className="min-w-[180px] max-w-[180px] h-[183px] ml-[30px]">
                        <ImageWithFoster src={item.merchList[0].url} className="" />
                      </div>
                      <div className="ml-[30px] sm:mt-[10px]">
                        <div className={styles.detail}>Item Details</div>
                        <div className={styles.content}>
                          <div>{item.data.name}</div>
                          <div>{item.data.size}</div>
                          <div>{getFirstUpperString(item.data.color)}</div>
                          <div>Qty: {item.data.quantity}</div>
                          <div>Price: ${item.cost}</div>
                        </div>
                        <div className="flex mt-[20px] items-center gap-[15px]">
                          <div className={styles.remove} onClick={() => handleRemove(index)}>
                            Remove Item
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {item?.printImageUrl && (
                      <>
                        <div className={styles.divider} />
                        <div className="w-full h-full flex flex-row my-[30px]">
                          <div className="flex items-center">
                            <SimpleCheckbox isChecked={item.checked} onChange={() => handleSelectData(index)} />
                          </div>
                          <div className="min-w-[180px] max-w-[180px] h-[183px] ml-[30px]">
                            <ImageWithFoster src={item.printImageUrl} className="p-[10px]" />
                          </div>
                          <div className="ml-[30px] sm:mt-[10px]">
                            <div className={styles.detail}>Item Details</div>
                            <div className={styles.content}>
                              <div>{item.nftName}</div>
                              <div>
                                {item?.apparel?.description}&nbsp;(
                                {item.size.name === 'S' || item.size.name === 'YXS'
                                  ? 'Small'
                                  : item.size.name === 'M' || item.size.name === 'YS'
                                  ? 'Medium'
                                  : item.size.name === 'L' || item.size.name === 'YM'
                                  ? 'Large'
                                  : item.size.name === 'XL' || item.size.name === 'YL'
                                  ? 'X-Large'
                                  : item.size.name === '2XL' || item.size.name === 'YXL'
                                  ? '2X-Large'
                                  : ''}
                                )
                              </div>
                              <div>{item.color.type}</div>
                              <div>Qty: {item.quantity}</div>
                              <div>Price: ${item.cost}</div>
                            </div>
                            <div className="flex mt-[20px] items-center gap-[15px]">
                              <div className={styles.remove} onClick={() => handleRemove(index)}>
                                Remove Item
                              </div>
                              <div className={styles.costDivider} />
                              <div className={styles.remove} onClick={() => handleEdit(index)}>
                                Edit
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Mobile Table */}
      <div className={styles.mobileContainer}>
        {cartList &&
          cartList.map((item, index) => (
            <div key={index}>
              {item.printImageUrl && (
                <div className={styles.tableColor}>
                  <div className="flex gap-[9px]">
                    <div className="w-[117px] h-[117px]">
                      <ImageWithFoster src={item.printImageUrl} className="w-full h-full" />
                    </div>
                    <div className="flex flex-col px-[10px]">
                      <div className={styles.mobileContent}>
                        <div className="mt-[6px] w-[150px]">{item.nftName}</div>
                        <div>{item.apparel.name}</div>
                        <div>{item.color.type}</div>
                        <div>Qty: {item.quantity}</div>
                        <div className={styles.cost}>${item.cost}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-[15px] ml-[5px]">
                    <div className="flex items-center gap-[15px]">
                      <div className={styles.mobileRemove} onClick={() => handleRemove(index)}>
                        Remove Item
                      </div>
                      <div className={styles.costDivider} />
                      <div className={styles.mobileRemove} onClick={() => handleEdit(index)}>
                        Edit
                      </div>
                    </div>
                    <div className="flex items-center">
                      <SimpleCheckbox isChecked={item.checked} onChange={() => handleSelectData(index)} />
                    </div>
                  </div>
                  <div className={`${styles.divider} mt-[20px]`}></div>
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  )
}

export default ShoppingCartActivity

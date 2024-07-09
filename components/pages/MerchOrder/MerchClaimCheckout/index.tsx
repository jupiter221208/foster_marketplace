import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { getOrder, OrderData } from 'apis/merch'
import { findElement } from 'utils/helpers'

// styles
import styles from './index.module.scss'

// component
import PhysicalCheckout from 'components/pages/BrowseNFT/MerchSection/PhysicalCheckout'

const MerchClaimCheckout = props => {
  const { orderId, onBack } = props
  const router = useRouter()
  const dispatch = useDispatch()

  const [orderData, setOrderData] = useState<OrderData | null>(null)

  useEffect(() => {
    getOrder(orderId).then(setOrderData)
  }, [orderId])

  useEffect(() => {
    if (orderData) {
      let itemData = orderData?.ssorder.items[0]
      let type = findElement(itemData.options, 'name', 'type')['value']
    }
  }, [orderData])

  return (
    <div className={styles.container}>
      {orderData && (
        <PhysicalCheckout
          orderData={orderData}
          orderType="v2"
          onBack={() => {
            onBack()
          }}
        />
      )}
    </div>
  )
}

export default MerchClaimCheckout

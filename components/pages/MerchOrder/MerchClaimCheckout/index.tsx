import React, { useState, useEffect } from 'react'
import { OrderData } from 'apis/merch'

// styles
import styles from './index.module.scss'

// component
import PhysicalCheckout from 'components/pages/BrowseNFT/MerchSection/PhysicalCheckout'

// API
import StoreAPI from 'apis/store'

const MerchClaimCheckout = props => {
  const { orderId, onBack } = props

  const [orderData, setOrderData] = useState<OrderData | null>(null)

  useEffect(() => {
    StoreAPI.getOrder(orderId).then(
      response => {
        setOrderData(response)
      },
      error => {}
    )
  }, [orderId])

  return (
    <div className={styles.container}>
      {orderData && (
        <PhysicalCheckout
          orderData={orderData}
          orderType="v2"
          helioEnabled={false}
          onBack={() => {
            onBack()
          }}
        />
      )}
    </div>
  )
}

export default MerchClaimCheckout

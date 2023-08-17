import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'

// styles
import styles from './index.module.scss'

// component
import MerchStepper from 'components/MerchStepper'
import PhysicalCheckout from 'components/pages/BrowseNFT/MerchSection/PhysicalCheckout'
import PrimaryLayout from 'components/Layout/PrimaryLayout'

import { getOrder, OrderData } from 'apis/merch'
import { findElement } from 'utils/helpers'

const OrderSection = props => {
  const router = useRouter()
  const { id } = router.query

  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [merchType, setMerchType] = useState('')

  useEffect(() => {
    if (typeof id != 'string' || !Number.isFinite(parseInt(id))) return
    getOrder(id).then(setOrderData)
  }, [id])

  useEffect(() => {
    if (orderData) {
      let itemData = orderData?.ssorder.items[0]
      console.log(itemData, '==========itemData========')
      let type = findElement(itemData.options, 'name', 'type')['value']
      setMerchType(type)
      setPreviewUrl(itemData.imageUrl)
      setCoverUrl(findElement(itemData.options, 'name', 'assetUrl')['value'])
    }
  }, [orderData])

  return (
    <div className="g-container">
      <div className={styles.container}>
        <div className="w-full grid grid-cols-2 gap-10">
          <div className="col-span-2 lg:col-span-1">
            {merchType === 'apparel' ? (
              <div className={styles.blurBackground}>
                <div className="absolute inset-0">
                  <img src={coverUrl} alt="" className="min-w-full min-h-full object-cover" />
                </div>
                <div className={styles.blurImage} />
                <div className="absolute inset-x-20 z-11">
                  <img src={previewUrl} alt="" className="min-w-full min-h-full object-cover" />
                </div>
              </div>
            ) : merchType === 'wallart' ? (
              <div className={styles.blurBackground}>
                <div className="absolute inset-0">
                  <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="col-span-2 lg:col-span-1 z-10">
            <div className={styles.contentContainer}>
              <div className="w-full mb-[45px]">
                <MerchStepper currentStep={3} />
              </div>
              {orderData && (
                <PhysicalCheckout
                  orderData={orderData}
                  type="apparel"
                  onBack={() => {
                    router.back()
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSection

OrderSection.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

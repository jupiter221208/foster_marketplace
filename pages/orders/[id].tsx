import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'

// styles
import styles from './index.module.scss'

// component
import MerchStepper from 'components/MerchStepper'
import PhysicalCheckout from 'components/pages/BrowseNFT/MerchSection/PhysicalCheckout'
import PrimaryLayout from 'components/Layout/PrimaryLayout'

import { getOrder, type OrderData } from 'apis/merch'

const OrderSection = props => {
  const router = useRouter()
  const { id } = router.query
  const printImageUrl = useSelector(state => (state as any).printImageUrl)
  const merchData = useSelector(state => (state as any).merchData)

  const [orderData, setOrderData] = useState<OrderData | null>(null)
  useEffect(() => {
    getOrder(id).then(setOrderData)
  }, [id])

  return (
    <div className="g-container">
      <div className={styles.container}>
        <div className="w-full grid grid-cols-2 gap-10">
          <div className="col-span-2 lg:col-span-1">
            <div className={styles.blurBackground}>
              <div className="absolute inset-0">
                <img src={merchData?.nftCoverUrl} alt="" className="min-w-full min-h-full object-cover" />
              </div>
              <div className={styles.blurImage} />
              <div className="absolute inset-20 z-11">
                <img src={printImageUrl} alt="" className="min-w-full min-h-full object-cover" />
              </div>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-1 z-10">
            <div className={styles.contentContainer}>
              <div className="w-full mb-[45px]">
                <MerchStepper currentStep={3} />
              </div>
              <PhysicalCheckout
                data={merchData?.printData}
                shippingData={merchData?.shippingData}
                nftName={merchData?.nftName}
                type="apparel"
                total={merchData?.totalCost}
                onBack={() => {
                  router.back()
                }}
              />
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

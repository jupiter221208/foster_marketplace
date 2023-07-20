import React from 'react'
import { useSelector } from 'react-redux'

// styles
import styles from './index.module.scss'

// component
import MerchStepper from 'components/MerchStepper'
import PhysicalCheckout from 'components/pages/BrowseNFT/MerchSection/PhysicalCheckout'

const OrderSection = props => {
  const printImageUrl = useSelector(state => (state as any).printImageUrl)
  const merchData = useSelector(state => (state as any).merchData)

  return (
    <div className={styles.container}>
      <div className="w-full grid grid-cols-2 gap-10">
        <div className="col-span-2 lg:col-span-1">
          <div className={styles.blurBackground}>
            <div className="absolute inset-0">
              <img src={printImageUrl} alt="" className="min-w-full min-h-full object-cover" />
            </div>
            <div className={styles.blurImage} />
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
              onBack={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSection

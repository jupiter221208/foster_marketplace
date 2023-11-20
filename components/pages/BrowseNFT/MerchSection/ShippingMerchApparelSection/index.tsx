import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

//component
import PhysicalShipping from '../PhysicalShipping'
import MerchStepper from 'components/MerchStepper'

import styles from './index.module.scss'
import PhysicalShippingMethod from '../PhysicalShippingMethod'
import { useViewport } from 'utils'

const ShippingMerchApparelSection = props => {
  const {
    nftName,
    nftCoverUrl,
    mintAddress,
    subCategory,
    base,
    open,
    onBack,
    setFinishEditing,
    setShowApparelMode,
    setApparel,
  } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const [openPrintDetail, setOpenPrintDetail] = useState(false)
  const [openShippingDetail, setOpenShippingDetail] = useState(open)
  const [openShippingMethod, setOpenShippingMethod] = useState(false)
  const [printData, setPrintData] = useState(null)
  const [shippingData, setShippingData] = useState(null)
  const [shipppingMethod, setShippingMethod] = useState(null)
  const [currentStep, setCurrentStep] = useState(2)
  const [totalCost, setTotalCost] = useState(null)
  const viewport = useViewport()

  return (
    <section className={styles.container}>
      <div className="w-full mb-[45px] lg:flex hidden">
        <MerchStepper currentStep={currentStep} />
      </div>
      {openShippingDetail ? (
        <PhysicalShipping
          onBack={info => {
            setShippingData(info)
            setOpenPrintDetail(false)
            setOpenShippingDetail(false)
            setFinishEditing(false)
            setCurrentStep(1)
          }}
          onNext={info => {
            setShippingData(info.data)
            setShippingMethod(info.method)
            setOpenShippingDetail(false)
            setOpenShippingMethod(true)
            setCurrentStep(2)
          }}
          category={'apparel'}
          printData={printData}
          data={shippingData}
        />
      ) : openShippingMethod ? (
        <PhysicalShippingMethod
          data={printData}
          shippingData={shippingData}
          allShippingMethod={shipppingMethod}
          nftName={nftName}
          nftCoverUrl={nftCoverUrl}
          mintAddress={mintAddress}
          setTotalCost={setTotalCost}
          type="apparel"
          onBack={() => {
            setOpenShippingMethod(false)
            setOpenShippingDetail(true)
            setCurrentStep(2)
          }}
          onNext={orderId => {
            let data = {
              printData,
              shippingData,
              nftName,
              nftCoverUrl,
              totalCost,
            }
            dispatch({ type: 'set', merchData: data })
            router.push(`/orders/${orderId}`)
          }}
        />
      ) : (
        <></>
      )}
    </section>
  )
}

export default ShippingMerchApparelSection

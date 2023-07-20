import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

//component
import PhysicalPrintDetail from './PhysicalPrintDetail'
import PhysicalShipping from '../PhysicalShipping'
import PhysicalCheckout from '../PhysicalCheckout'
import MerchStepper from 'components/MerchStepper'

import styles from './index.module.scss'
import PhysicalShippingMethod from '../PhysicalShippingMethod'

const MerchApparelSection = props => {
  const { nftName, subCategory, open, onBack, setFinishEditing, setShowApparelMode, setApparel } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const [openPrintDetail, setOpenPrintDetail] = useState(open)
  const [openShippingDetail, setOpenShippingDetail] = useState(false)
  const [openShippingMethod, setOpenShippingMethod] = useState(false)
  const [openCheckoutView, setOpenCheckoutView] = useState(false)
  const [printData, setPrintData] = useState(null)
  const [shippingData, setShippingData] = useState(null)
  const [shipppingMethod, setShippingMethod] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [totalCost, setTotalCost] = useState(null)
  return (
    <section className={styles.container}>
      <div className="w-full mb-[45px]">
        <MerchStepper currentStep={currentStep} />
      </div>
      {openPrintDetail ? (
        <PhysicalPrintDetail
          onBack={() => {
            onBack()
            setApparel(null)
            setShowApparelMode(false)
          }}
          onPrint={apparel => {
            setApparel(apparel)
            setShowApparelMode(true)
          }}
          onShipping={item => {
            setPrintData(item)
            setOpenPrintDetail(false)
            setOpenShippingDetail(true)
            setFinishEditing(true)
            setCurrentStep(2)
          }}
          data={printData}
          subCategory={subCategory}
          setData={data => setPrintData(data)}
          nftName={nftName}
        />
      ) : openShippingDetail ? (
        <PhysicalShipping
          onBack={info => {
            setShippingData(info)
            setOpenPrintDetail(true)
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
          printData={printData}
          data={shippingData}
        />
      ) : openShippingMethod ? (
        <PhysicalShippingMethod
          data={printData}
          shippingData={shippingData}
          allShippingMethod={shipppingMethod}
          nftName={nftName}
          setTotalCost={setTotalCost}
          type="apparel"
          onBack={() => {
            setOpenShippingMethod(false)
            setOpenShippingDetail(true)
            setCurrentStep(2)
          }}
          onNext={orderId => {
            setOpenShippingMethod(false)
            // setOpenCheckoutView(true)
            // setCurrentStep(3)
            let data = {
              printData,
              shippingData,
              nftName,
              totalCost,
            }
            dispatch({ type: 'set', merchData: data })
            router.push(`/order/${orderId}`)
          }}
        />
      ) : openCheckoutView ? (
        <PhysicalCheckout
          data={printData}
          shippingData={shippingData}
          nftName={nftName}
          type="apparel"
          total={totalCost}
          onBack={() => {
            setOpenShippingMethod(true)
            setOpenCheckoutView(false)
            setCurrentStep(2)
          }}
        />
      ) : (
        <></>
      )}
    </section>
  )
}

export default MerchApparelSection

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

//component
import PhysicalPrintDetail from './PhysicalPrintDetail'
import PhysicalShipping from '../PhysicalShipping'
import MerchStepper from 'components/MerchStepper'

import styles from './index.module.scss'
import PhysicalShippingMethod from '../PhysicalShippingMethod'
import { useViewport } from 'utils'

const MerchApparelSection = props => {
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
  const [openPrintDetail, setOpenPrintDetail] = useState(open)
  const [openShippingDetail, setOpenShippingDetail] = useState(false)
  const [openShippingMethod, setOpenShippingMethod] = useState(false)
  const [printData, setPrintData] = useState(null)
  const [shippingData, setShippingData] = useState(null)
  const [shipppingMethod, setShippingMethod] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [totalCost, setTotalCost] = useState(null)
  const viewport = useViewport()

  return (
    <section className={styles.container}>
      <div className="w-full mb-[45px] lg:flex hidden">
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
            if (viewport === 'xs' || viewport === 'sm' || viewport === 'md') {
              setTimeout(() => {
                setOpenPrintDetail(false)
                setOpenShippingDetail(true)
              }, 2000)
            } else {
              setOpenPrintDetail(false)
              setOpenShippingDetail(true)
              setFinishEditing(true)
            }
            setCurrentStep(2)
          }}
          onAddCart={item => {
            setPrintData(item)
            dispatch({ type: 'set', isAddToCart: true })
            setFinishEditing(true)
          }}
          data={printData}
          subCategory={subCategory}
          base={base}
          setData={data => setPrintData(data)}
          nftName={nftName}
          nftCoverUrl={nftCoverUrl}
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

export default MerchApparelSection

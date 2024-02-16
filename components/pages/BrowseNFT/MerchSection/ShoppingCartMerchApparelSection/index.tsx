import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

//component
import ShoppingCartPhysicalShipping from '../ShoppingCartPhysicalShipping'
import MerchStepper from 'components/MerchStepper'

import styles from './index.module.scss'
import ShoppingCartPhysicalMethod from '../ShoppingCartPhysicalMethod'
import { useViewport } from 'utils'

const ShoppingCartMerchApparelSection = props => {
  const { nftName, nftCoverUrl, open, setFinishEditing, setApparel, apparelData } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const [openPrintDetail, setOpenPrintDetail] = useState(false)
  const [printData, setPrintData] = useState(null)
  const [openShippingDetail, setOpenShippingDetail] = useState(open)
  const [openShippingMethod, setOpenShippingMethod] = useState(false)
  const [shippingData, setShippingData] = useState(null)
  const [shipppingMethod, setShippingMethod] = useState(null)
  const [currentStep, setCurrentStep] = useState(2)
  const [totalCost, setTotalCost] = useState(null)
  const viewport = useViewport()

  useEffect(() => {
    setPrintData(JSON.parse(localStorage.getItem('checked')))
  }, [])

  return (
    <section className={styles.container}>
      <div className="w-full mb-[45px] lg:flex hidden">
        <MerchStepper currentStep={currentStep} />
      </div>
      {openShippingDetail ? (
        <ShoppingCartPhysicalShipping
          onBack={() => {
            dispatch({ type: 'set', activeTab: 4 })
            router.push(`/merch-logs`)
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
        <ShoppingCartPhysicalMethod
          apparelData={apparelData}
          printData={printData}
          shippingData={shippingData}
          allShippingMethod={shipppingMethod}
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
            router.push(`/orders/shopping/${orderId}`)
          }}
        />
      ) : (
        <></>
      )}
    </section>
  )
}

export default ShoppingCartMerchApparelSection

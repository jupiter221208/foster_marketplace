import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

// components

// custom functions

//component
import WallArtDetail from './WallArtDetail'
import PhysicalShipping from '../PhysicalShipping'
import PhysicalCheckout from '../PhysicalCheckout'

// json

// styles
import styles from './index.module.scss'
import MerchStepper from 'components/MerchStepper'
import PhysicalShippingMethod from '../PhysicalShippingMethod'

// api

const MerchWallArtSection = props => {
  const {
    nftName,
    nftImage,
    mintAddress,
    nftCoverUrl,
    open,
    subCategory,
    onBack,
    setFinishEditing,
    setShowWallArtMode,
    setWallArt,
  } = props
  const dispatch = useDispatch()
  const router = useRouter()
  const [openPrintDetail, setOpenPrintDetail] = useState(open)
  const [openShippingDetail, setOpenShippingDetail] = useState(false)
  const [openShippingMethod, setOpenShippingMethod] = useState(false)
  const [printData, setPrintData] = useState(null)
  const [shippingData, setShippingData] = useState(null)
  const [shipppingMethod, setShippingMethod] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [totalCost, setTotalCost] = useState(null)
  const [previewImage, setPreivewImage] = useState(null)

  return (
    <section className={styles.container}>
      <div className="w-full px-[20px] mb-[45px] lg:flex hidden">
        <MerchStepper currentStep={currentStep} />
      </div>
      {openPrintDetail ? (
        <WallArtDetail
          onBack={() => {
            onBack()
            setWallArt(null)
            setShowWallArtMode(false)
          }}
          onPrint={wallArt => {
            setWallArt(wallArt)
            setPreivewImage(wallArt)
            setShowWallArtMode(true)
          }}
          onShipping={item => {
            setPrintData(item)
            setOpenPrintDetail(false)
            setOpenShippingDetail(true)
            setFinishEditing(true)
            setCurrentStep(2)
          }}
          subCategory={subCategory}
          data={printData}
          setData={data => setPrintData(data)}
          nftName={nftName}
          nftImage={nftImage}
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
          category={'print'}
          printData={printData}
          wallArt={previewImage}
          data={shippingData}
          nftName={nftName}
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
          type="print"
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

export default MerchWallArtSection

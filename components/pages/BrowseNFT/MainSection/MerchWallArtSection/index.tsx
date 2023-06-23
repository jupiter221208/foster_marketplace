import React, { useState, useEffect } from 'react'

// components

// custom functions

//component
import WallArtDetail from './WallArtDetail'
import PhysicalShipping from '../PhysicalShipping'
import PhysicalCheckout from '../PhysicalCheckout'

// json

// styles
import styles from './index.module.scss'

// api

const MerchWallArtSection = props => {
  const { nftName, nftImage, open, onBack, setOpenPrintView, setFinishEditing, setShowWallArtMode, setWallArt } = props
  const [openPrintDetail, setOpenPrintDetail] = useState(open)
  const [openShippingDetail, setOpenShippingDetail] = useState(false)
  const [openCheckoutView, setOpenCheckoutView] = useState(false)
  const [printData, setPrintData] = useState(null)
  const [shippingData, setShippingData] = useState(null)
  return (
    <section>
      {openPrintDetail ? (
        <WallArtDetail
          onBack={() => {
            onBack()
            setOpenPrintView(true)
            setWallArt(null)
            setShowWallArtMode(false)
          }}
          onPrint={wallArt => {
            setWallArt(wallArt)
            setShowWallArtMode(true)
          }}
          onShipping={item => {
            setPrintData(item)
            setOpenPrintDetail(false)
            setOpenShippingDetail(true)
            setFinishEditing(true)
          }}
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
          }}
          onNext={info => {
            setShippingData(info)
            setOpenShippingDetail(false)
            setOpenCheckoutView(true)
          }}
          data={shippingData}
        />
      ) : openCheckoutView ? (
        <PhysicalCheckout
          data={printData}
          shippingData={shippingData}
          nftName={nftName}
          onBack={() => {
            setOpenShippingDetail(true)
            setOpenCheckoutView(false)
          }}
        />
      ) : (
        <></>
      )}
    </section>
  )
}

export default MerchWallArtSection

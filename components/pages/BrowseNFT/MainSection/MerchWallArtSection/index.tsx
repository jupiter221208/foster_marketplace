import React, { useState, useEffect } from 'react'

// components

// custom functions

//component
import WalletArtDetail from './WalletArtDetail'

// json

// styles
import styles from './index.module.scss'

// api

const MerchWallArtSection = props => {
  const { nftName, open, onBack, setOpenPrintView, setFinishEditing, setShowPrintMode, setApparel } = props
  const [openPrintDetail, setOpenPrintDetail] = useState(open)
  const [openShippingDetail, setOpenShippingDetail] = useState(false)
  const [openCheckoutView, setOpenCheckoutView] = useState(false)
  const [printData, setPrintData] = useState(null)
  const [shippingData, setShippingData] = useState(null)

  return (
    <section>
      {openPrintDetail ? (
        <WalletArtDetail
          onBack={() => {
            onBack()
            setOpenPrintView(true)
            setApparel(null)
            setShowPrintMode(false)
          }}
          onPrint={apparel => {
            setApparel(apparel)
            setShowPrintMode(true)
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
          apparelData={printData}
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

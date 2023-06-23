import React, { useState } from 'react'

// components

// custom functions

//component
import PhysicalPrintDetail from './PhysicalPrintDetail'
import PhysicalShipping from '../PhysicalShipping'
import PhysicalCheckout from '../PhysicalCheckout'

// json

// styles

// api

const MerchApparelSection = props => {
  const { nftName, open, onBack, setOpenPrintView, setFinishEditing, setShowApparelMode, setApparel } = props
  const [openPrintDetail, setOpenPrintDetail] = useState(open)
  const [openShippingDetail, setOpenShippingDetail] = useState(false)
  const [openCheckoutView, setOpenCheckoutView] = useState(false)
  const [printData, setPrintData] = useState(null)
  const [shippingData, setShippingData] = useState(null)

  return (
    <section>
      {openPrintDetail ? (
        <PhysicalPrintDetail
          onBack={() => {
            onBack()
            setOpenPrintView(true)
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

export default MerchApparelSection

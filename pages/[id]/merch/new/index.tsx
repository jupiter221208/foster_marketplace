import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

//components
import ArtistLayout from 'components/Layout/ArtistLayout'

// images
import ArrowLeft from 'assets/icons/arrow-left-black.svg?component'
import ArrowRightBlack from 'assets/icons/arrow-right-black.svg?component'

// styles
import GradientButton from 'components/Button/GradientButton'

import NewMerchStepper from 'components/NewMerchStepper'
import ProductDetails from './ProductDetails'
import AdditionalDetails from './AdditionalDetails'
import NoNavLayout from 'components/Layout/NoNavLayout'

const NewCreatorMerch = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [productDetail, setProductDetail] = useState(null)
  const [nextEnabled, setNextEnabled] = useState(false)

  useEffect(() => {
    if (!productDetail) {
      setNextEnabled(false)
      return
    }

    let snapshotUrl = productDetail?.snapshotAssetUrl

    if (snapshotUrl)
      if (
        snapshotUrl.front.length > 0 ||
        snapshotUrl.back.length > 0 ||
        snapshotUrl.left.length > 0 ||
        snapshotUrl.right.length > 0
      ) {
        let { product, description, name, type, shipping } = productDetail
        if (product.id === 0) {
          setNextEnabled(true)
        } else {
          if (name !== undefined && description !== undefined && type !== undefined && shipping !== undefined)
            setNextEnabled(true)
          else setNextEnabled(false)
        }
      } else setNextEnabled(false)
    else setNextEnabled(false)
  }, [productDetail])

  return (
    <div className="w-full relative">
      <div className="fixed g-container" style={{ background: 'var(--bg-new-color)', zIndex: 10001 }}>
        <div className="w-full mt-[22px] h-[78px] flex justify-between items-start">
          <GradientButton
            icon1={<ArrowLeft />}
            direction="rtl"
            width={122}
            height={53}
            label="Back"
            borderRadius={30}
            backgroundColor01="var(--place-bid-minimum-color)"
            backgroundColor02="var(--place-bid-minimum-color)"
            color="var(--time-slog-bg)"
            fontFamily="Muli-Regular"
            fontSize={18}
            onClick={() => {
              if (currentStep === 1) {
                let path = window.location.href
                router.push(path.substring(0, path.lastIndexOf('/')))
              } else {
                setCurrentStep(currentStep - 1)
                setNextEnabled(true)
              }
            }}
          />
          <div className="w-[50%]">
            <NewMerchStepper currentStep={currentStep} />
          </div>

          <GradientButton
            icon1={currentStep === 3 ? '' : <ArrowRightBlack />}
            width={122}
            height={53}
            label={currentStep === 3 ? 'Publish' : 'Next'}
            borderRadius={30}
            backgroundColor01="var(--place-bid-minimum-color)"
            backgroundColor02="var(--place-bid-minimum-color)"
            color="var(--background-main-color)"
            fontFamily="Muli-Regular"
            fontSize={18}
            disabled={!nextEnabled}
            onClick={() => {
              if (currentStep === 3) {
                // publish API
              } else {
                setCurrentStep(currentStep + 1)
              }
            }}
          />
        </div>
      </div>
      <div className="g-container mt-[165px]">
        {currentStep === 1 && <ProductDetails productDetail={productDetail} setProductDetail={setProductDetail} />}
        {currentStep >= 2 && (
          <AdditionalDetails productDetail={productDetail} step={currentStep} setEnableNext={setNextEnabled} />
        )}
      </div>
    </div>
  )
}

export default NewCreatorMerch

NewCreatorMerch.getLayout = function getLayout(page) {
  return <NoNavLayout>{page}</NoNavLayout>
}

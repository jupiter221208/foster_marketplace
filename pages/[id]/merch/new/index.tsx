import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

//components
import ArtistLayout from 'components/Layout/ArtistLayout'

// images
import ArrowLeft from 'assets/icons/arrow-left-black.svg?component'
import ArrowRightBlack from 'assets/icons/arrow-right-black.svg?component'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'

import NewMerchStepper from 'components/NewMerchStepper'
import ProductDetails from './ProductDetails'
import AdditionalDetails from './AdditionalDetails'

const NewCreatorMerch = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [productDetail, setProductDetail] = useState(null)
  const [nextEnabled, setNextEnabled] = useState(false)

  useEffect(() => {
    if (!productDetail) return

    let snapshotUrl = productDetail?.snapshotAssetUrl

    if (snapshotUrl)
      if (
        snapshotUrl.front.length > 0 ||
        snapshotUrl.back.length > 0 ||
        snapshotUrl.left.length > 0 ||
        snapshotUrl.right.length > 0
      )
        setNextEnabled(true)
      else setNextEnabled(false)
    else setNextEnabled(false)
  }, [productDetail])

  return (
    <div className="w-full g-container">
      <div className="w-full mt-[80px] flex justify-between items-start">
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
            }
          }}
        />
        <div className="w-[50%]">
          <NewMerchStepper currentStep={currentStep} />
        </div>

        <GradientButton
          icon1={<ArrowRightBlack />}
          width={122}
          height={53}
          label="Next"
          borderRadius={30}
          backgroundColor01="var(--place-bid-minimum-color)"
          backgroundColor02="var(--place-bid-minimum-color)"
          color="var(--background-main-color)"
          fontFamily="Muli-Regular"
          fontSize={18}
          disabled={!nextEnabled}
          onClick={() => {
            setCurrentStep(currentStep + 1)
          }}
        />
      </div>
      {currentStep === 1 && <ProductDetails productDetail={productDetail} setProductDetail={setProductDetail} />}
      {currentStep >= 2 && <AdditionalDetails productDetail={productDetail} step={currentStep} />}
    </div>
  )
}

export default NewCreatorMerch

NewCreatorMerch.getLayout = function getLayout(page) {
  return <ArtistLayout>{page}</ArtistLayout>
}

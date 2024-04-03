import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// next component
import Image from 'next/image'

//components
import ArtistLayout from 'components/Layout/ArtistLayout'

// images
import ArrowLeft from 'assets/icons/arrow-left-black.svg?component'
import ArrowRightGray from 'assets/icons/arrow-right-gray.svg?component'

// json
import ProductList from 'assets/json/creator-merch/product-list.json'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'

import NewMerchStepper from 'components/NewMerchStepper'
import ProductionListMenu from 'components/Menu/ProductionListMenu'
import FosterProductSection from 'components/pages/MerchProduct/FosterProductSection'

const NewCreatorMerch = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [product, setProduct] = useState({ id: -1, label: '' })

  return (
    <div className="w-full g-container">
      <div className="w-full mt-[80px] flex justify-between items-center">
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
        />
        <div className="w-[50%]">
          <NewMerchStepper currentStep={currentStep} />
        </div>
        <div className={styles.nextBtn}>
          Next
          <ArrowRightGray />
        </div>
      </div>
      <div className="w-full mt-[45px]">
        <div className={styles.border} />
      </div>
      <div className="w-full mt-[40px]">
        <div className={styles.setupText}>
          Easily setup your own merch store. You can either choose to have Foster manage the production and fulfillment
          of your merch, or you can choose to handle it.
        </div>
      </div>
      <div className="mt-[27px]">
        <ProductionListMenu
          label={product.id === -1 ? 'Select who will handle production and fulfillment' : product.label}
          data={ProductList}
          selectedItem={product}
          setSelectedItem={item => {
            setProduct(item)
          }}
        />
      </div>
      <FosterProductSection />
    </div>
  )
}

export default NewCreatorMerch

NewCreatorMerch.getLayout = function getLayout(page) {
  return <ArtistLayout>{page}</ArtistLayout>
}

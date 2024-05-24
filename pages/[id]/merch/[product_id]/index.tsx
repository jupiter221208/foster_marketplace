import React, { useState, useEffect } from 'react'

// next component

// components
import MerchOrderMain from 'components/pages/MerchOrder/main'

// images

// json

// styles
import styles from './index.module.scss'
import PrimaryLayout from 'components/Layout/PrimaryLayout'
import ImageWithFoster from 'components/ImageWithFoster'
import MerchOrderShipping from 'components/pages/MerchOrder/shipping'

const MerchOrderPage = () => {
  const [merchList, setMerchList] = useState([
    {
      url: 'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
      selected: true,
    },
    {
      url: 'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
      selected: false,
    },
    {
      url: 'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=900/https%3A%2F%2Farweave.net%2FxpAX_Uj698MWASLs4jUJD9PcrZBeYogUaJ9BOzFxbPk',
      selected: false,
    },
    {
      url: 'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
      selected: false,
    },
  ])
  const [selectedMerch, setSelectedMerch] = useState(merchList[0])
  const [currentStep, setCurrentStep] = useState(1)

  const onClickMerch = key => {
    let list = []
    merchList.map((merch, index) => {
      if (key === index) {
        list.push({ url: merch.url, selected: true })
        setSelectedMerch({ url: merch.url, selected: true })
      } else {
        list.push({ url: merch.url, selected: false })
      }
    })
    setMerchList(list)
  }

  const onClickBuyNow = () => {
    setCurrentStep(2)
  }

  return (
    <div className="g-container flex gap-[50px] ">
      <div className="w-[130px] flex flex-col gap-[16px] mt-[75px]">
        {merchList.map((merch, index) => {
          return (
            <div
              key={index}
              className={merch.selected ? styles.selected : styles.unselected}
              onClick={() => onClickMerch(index)}
            >
              <ImageWithFoster width={130} src={merch.url} />
            </div>
          )
        })}
      </div>
      <div className="flex-1 flex justify-between">
        <div className="w-[48%] h-[700px] mt-[75px]">
          <div className={styles.imageArea}>
            <div className={styles.imageContent}>
              <ImageWithFoster width={700} src={selectedMerch.url} />
            </div>
          </div>
        </div>
        <div className="w-[42%]">
          {currentStep === 1 && (
            <div className="w-full mt-[75px]">
              <MerchOrderMain onClickBuyNow={onClickBuyNow} />
            </div>
          )}
          {currentStep === 2 && (
            <div className="w-full mt-[57px]">
              <MerchOrderShipping onBack={() => setCurrentStep(1)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MerchOrderPage

MerchOrderPage.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

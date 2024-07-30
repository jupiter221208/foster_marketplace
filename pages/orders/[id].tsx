import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getOrder } from 'apis/merch'
import StoreAPI from 'apis/store'
import { findElement } from 'utils/helpers'

// styles
import styles from './index.module.scss'

// component
import PhysicalCheckout from 'components/pages/BrowseNFT/MerchSection/PhysicalCheckout'
import PrimaryLayout from 'components/Layout/PrimaryLayout'
import ImageWithFoster from 'components/ImageWithFoster'
import ArrowLeftIcon from 'assets/icons/arrow-left-24x24.svg?component'
import { useViewport } from 'utils'

const OrderSection = props => {
  const router = useRouter()
  const viewport = useViewport()
  const { id } = router.query

  const [orderData, setOrderData] = useState<any | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [merchType, setMerchType] = useState('')
  const [orderType, setOrderType] = useState('v1')
  const [merchList, setMerchList] = useState([])
  const [paymentId, setPaymentId] = useState(null)
  const [selectedMerch, setSelectedMerch] = useState(null)

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

  useEffect(() => {
    if (typeof id != 'string' || !Number.isFinite(parseInt(id))) return
    if (parseInt(id) > 1000) {
      setOrderType('v2')
      StoreAPI.getOrder(id).then(
        response => {
          setOrderData(response)
        },
        error => {}
      )
    } else {
      setOrderType('v1')
      getOrder(id).then(setOrderData)
    }

    StoreAPI.getPaymentId(id).then(
      response => {
        console.log(response)
        if (response) setPaymentId(response.paylink_id)
      },
      error => {}
    )
  }, [id])

  useEffect(() => {
    if (orderData) {
      let ssorder = orderType === 'v1' ? orderData?.ssorder : orderData?.externalOrder
      let itemData = ssorder.items[0]
      let type = findElement(itemData.options, 'name', 'type')['value']
      setMerchType(type)
      if (type === 'apparel' || type === 'wallart') {
        setPreviewUrl(itemData.imageUrl)
        setCoverUrl(findElement(itemData.options, 'name', 'assetUrl')['value'])
      } else {
        let list = []
        let mockupUrl = findElement(itemData.options, 'name', 'mockupUrl')['value']
        mockupUrl.split(',').map((item, index) => list.push({ url: item, selected: index === 0 }))
        setSelectedMerch(list[0])
        setMerchList(list)
      }
    }
  }, [orderData])

  return (
    <div className="w-full">
      <div className="w-full flex lg:flex-row flex-col">
        <div
          className={`w-[58%] ${
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'g-container' : 'g-left-container'
          }`}
        >
          {merchType === 'apparel' ? (
            <div className={styles.blurBackground}>
              <div className="absolute w-full h-full flex items-center justify-center">
                <ImageWithFoster src={previewUrl} width={800} className="w-[80%] lg:w-auto h-auto object-cover" />
              </div>
            </div>
          ) : merchType === 'wallart' ? (
            <div className={styles.blurBackground}>
              <div className="w-full h-full">
                <ImageWithFoster src={previewUrl} className="w-[80%] lg:w-auto h-full object-cover" />
              </div>
            </div>
          ) : merchType === 'foster' || merchType === 'user' ? (
            <div className="w-full lg:flex lg:h-[705px]">
              <div className="hidden lg:block mt-[70px] w-[130px]">
                <div className="lg:block hidden">
                  <div className={styles.backStore} onClick={() => router.push(`/${router.query.id}/merch`)}>
                    <ArrowLeftIcon />
                    Back to store
                  </div>
                </div>
                <div className="w-[130x] mt-[30px] w-[75px] lg:flex hidden flex-col gap-[11px]">
                  {merchList.map((merch, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => onClickMerch(index)}
                        className={merch.selected ? styles.image : styles.imageHover}
                      >
                        <div className={merch.selected ? styles.selected : styles.unselected}>
                          <ImageWithFoster width={130} src={merch.url} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {selectedMerch && (
                <div className="hidden lg:flex-1 h-full lg:w-[400px] xl:w-[500px] 2xl:w-[625px] lg:max-h-[705px] lg:flex items-center justify-center mt-[70px]">
                  <ImageWithFoster
                    src={selectedMerch.url}
                    width={700}
                    className="w-[80%] lg:w-auto h-auto object-cover"
                  />
                </div>
              )}

              <div className={`lg:hidden block h-auto w-full flex justify-center mb-[20px] mt-[20px]`}>
                <div className="max-w-[400px]">
                  <div className={styles.mobileImageArea}>
                    <div className={styles.imageArea}>
                      <div className={styles.imageContent}>
                        <ImageWithFoster
                          width={700}
                          src={selectedMerch ? selectedMerch.url : ''}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.imageSlider}>
                {merchList.map((merch, index) => {
                  return (
                    <div key={index} className={styles.image} onClick={() => onClickMerch(index)}>
                      <div className={merch.selected ? styles.selected : styles.unselected}>
                        <ImageWithFoster width={130} src={merch.url} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div
          className={`w-full lg:max-w-[42%] lg:max-w-[42%] z-10 ${
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'g-container' : 'g-right-container'
          } lg:flex lg:justify-end ${styles.rightBG}`}
        >
          <div className="lg:max-w-[545px] w-full mb-[50px] mt-[20px] lg:mt-[50px] lg:ml-[30px]">
            {orderData && (
              <PhysicalCheckout
                orderData={orderData}
                orderType={orderType}
                paymentId={paymentId}
                onBack={() => {
                  router.back()
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSection

OrderSection.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

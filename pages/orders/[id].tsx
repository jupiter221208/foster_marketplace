import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getOrder } from 'apis/merch'
import { findElement, isString } from 'utils/helpers'

// styles
import styles from './index.module.scss'

// component
import PhysicalCheckout from 'components/pages/BrowseNFT/MerchSection/PhysicalCheckout'
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import ImageWithFoster from 'components/ImageWithFoster'
import ArrowLeftIcon from 'assets/icons/arrow-left-24x24.svg?component'
import LeftBtnIcon from 'assets/icons/arrow-left-17x13.svg?component'
import RightBtnIcon from 'assets/icons/arrow-right-17x13.svg?component'

import { useViewport } from 'utils'

// api
import StoreAPI from 'apis/store'
import { useSelector } from 'react-redux'

const OrderSection = props => {
  const router = useRouter()
  const viewport = useViewport()
  const { id } = router.query
  let merchData = useSelector(state => (state as any).merchData)

  const [userName, setUsername] = useState('')
  const [orderData, setOrderData] = useState<any | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [merchType, setMerchType] = useState('')
  const [orderType, setOrderType] = useState('v1')
  const [merchList, setMerchList] = useState([])
  const [paymentId, setPaymentId] = useState(null)
  const [selectedMerch, setSelectedMerch] = useState(null)

  const onClickMerch = key => {
    let list = []
    merchList.map((merch, index) => {
      if (key === index) {
        list.push({ id: index, url: merch.url, selected: true })
        setSelectedMerch({ id: index, url: merch.url, selected: true })
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
          if (!isString(response)) setOrderData(response)
        },
        error => {}
      )
    } else {
      setOrderType('v1')
      getOrder(id).then(
        response => {
          if (!isString(response)) setOrderData(response)
        },
        error => {}
      )
    }
  }, [id])

  useEffect(() => {
    console.log(orderData, '========orderData=======')
    if (orderData) {
      let ssorder = orderType === 'v1' ? orderData?.ssorder : orderData?.externalOrder
      let itemData = ssorder.items[0]
      let type = findElement(itemData.options, 'name', 'type')['value']
      setMerchType(type)
      if (type === 'apparel' || type === 'wallart') {
        setPreviewUrl(itemData.imageUrl)
      } else {
        let list = []
        let mockupUrl = findElement(itemData.options, 'name', 'mockupUrl')['value']
        mockupUrl.split(',').map((item, index) => list.push({ id: index, url: item, selected: index === 0 }))
        setSelectedMerch(list[0])
        setMerchList(list)
      }

      setUsername(merchData?.username)

      if (orderType === 'v2') {
        StoreAPI.getPaymentId(id).then(
          response => {
            if (!isString(response)) setPaymentId(response.paylink_id)
          },
          error => {}
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData])

  return (
    <div className="w-full">
      <div className="w-full h-full flex lg:flex-row flex-col">
        <div
          className={`w-[58%] h-full flex items-center ${
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
              <div className="hidden lg:block w-[140px]">
                <div className="w-full lg:block hidden">
                  <div className={styles.backStore} onClick={() => router.push(`/${userName}/merch`)}>
                    <ArrowLeftIcon />
                    Back&nbsp;to&nbsp;store
                  </div>
                </div>
                <div className="mt-[30px] w-[75px] lg:flex hidden flex-col gap-[11px]">
                  {merchList.map((merch, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => onClickMerch(index)}
                        className={merch.selected ? styles.image : styles.imageHover}
                      >
                        <div className={merch.selected ? styles.selected : styles.unselected}>
                          <ImageWithFoster width={130} src={merch.url} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {selectedMerch && (
                <div className="w-full flex justify-center">
                  <div className="lg:block hidden sm:w-[640px] sm:h-[auto] lg:w-[400px] xl:w-[500px] 2xl:w-[625px] lg:h-[705px] mt-[20px] lg:mt-[0px]">
                    <div className={styles.imageArea}>
                      <div
                        className={styles.imageContent}
                        style={{
                          background: merchType === 'user' ? 'rgba(var(--main-bg-color-rgb), 0.05)' : 'transparent',
                          borderRadius: '15px',
                          overflow: 'hidden',
                        }}
                      >
                        <ImageWithFoster src={selectedMerch.url} width={625} className="w-ful h-full object-contain" />
                      </div>
                    </div>
                    {merchList.length > 1 && (
                      <div className="w-full mt-[30px] flex justify-center">
                        <div className="flex gap-[50px]">
                          <div
                            className={selectedMerch.id === 0 ? styles.arrowBtnDisabled : styles.arrowButton}
                            onClick={() => selectedMerch.id > 0 && onClickMerch(selectedMerch.id - 1)}
                          >
                            <LeftBtnIcon />
                          </div>
                          <div
                            className={
                              selectedMerch.id === merchList.length - 1 ? styles.arrowBtnDisabled : styles.arrowButton
                            }
                            onClick={() =>
                              selectedMerch.id < merchList.length - 1 && onClickMerch(selectedMerch.id + 1)
                            }
                          >
                            <RightBtnIcon />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className={`lg:hidden block h-auto w-full mb-[20px] mt-[${merchType === 'foster' ? 20 : 0}px]`}>
                <div className={styles.mobileImageArea}>
                  <div className={styles.imageArea}>
                    <div className={styles.imageContent}>
                      <ImageWithFoster
                        width={700}
                        src={selectedMerch ? selectedMerch.url : ''}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.imageSlider}>
                {merchList.map((merch, index) => {
                  return (
                    <div key={index} className={styles.image} onClick={() => onClickMerch(index)}>
                      <div className={merch.selected ? styles.selected : styles.unselected}>
                        <ImageWithFoster width={130} src={merch.url} className="w-full h-full object-cover" />
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
          className={`w-full min-h-full lg:max-w-[42%] lg:max-w-[42%] z-10 ${
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'g-container' : 'g-right-container'
          } lg:flex lg:justify-end ${styles.rightBG}`}
        >
          <div className="lg:max-w-[545px] w-full mb-[50px] mt-[20px] lg:mt-[50px] lg:ml-[30px]">
            {orderData && (
              <PhysicalCheckout
                orderData={orderData}
                orderType={orderType}
                merchType={merchType}
                helioEnabled={true}
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
  return <SecondaryLayout>{page}</SecondaryLayout>
}

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { getOrder, OrderData } from 'apis/merch'
import StoreAPI from 'apis/store'
import { findElement } from 'utils/helpers'

// styles
import styles from './index.module.scss'

// component
import PhysicalCheckout from 'components/pages/BrowseNFT/MerchSection/PhysicalCheckout'
import PrimaryLayout from 'components/Layout/PrimaryLayout'
import ImageWithFoster from 'components/ImageWithFoster'
import { error } from 'console'

const OrderSection = props => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { id } = router.query

  const [orderData, setOrderData] = useState<any | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [merchType, setMerchType] = useState('')
  const [orderType, setOrderType] = useState('v1')
  const [merchList, setMerchList] = useState([])

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
    <div className="g-container">
      <div className={styles.container}>
        <div className="w-full flex lg:flex-row flex-col lg:gap-[50px]">
          <div className="w-full">
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
            ) : merchType === 'foster' ? (
              <div className="w-full lg:flex lg:gap-[50px] lg:h-[700px]">
                <div className="w-[130px] lg:flex hidden flex-col gap-[16px]">
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
                {selectedMerch && (
                  <div className="hidden lg:flex-1 h-full lg:max-h-[700px] lg:flex items-center justify-center">
                    <ImageWithFoster
                      src={selectedMerch.url}
                      width={700}
                      className="w-[80%] lg:w-auto h-auto object-cover"
                    />
                  </div>
                )}

                <div className={`lg:hidden block h-auto w-full mb-[20px] mt-[20px]`}>
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

                <div className={styles.imageSlider}>
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
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="z-10">
            <div className={styles.contentContainer}>
              {orderData && (
                <PhysicalCheckout
                  orderData={orderData}
                  orderType={orderType}
                  onBack={() => {
                    router.back()
                  }}
                />
              )}
            </div>
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

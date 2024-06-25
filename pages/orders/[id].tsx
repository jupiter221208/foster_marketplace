import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { getOrder, OrderData } from 'apis/merch'
import { findElement } from 'utils/helpers'

// styles
import styles from './index.module.scss'

// component
import PhysicalCheckout from 'components/pages/BrowseNFT/MerchSection/PhysicalCheckout'
import PrimaryLayout from 'components/Layout/PrimaryLayout'
import ImageWithFoster from 'components/ImageWithFoster'

const OrderSection = props => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { id } = router.query

  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [merchType, setMerchType] = useState('')

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
    getOrder(id).then(setOrderData)
  }, [id])

  useEffect(() => {
    if (orderData) {
      let itemData = orderData?.ssorder.items[0]
      let type = findElement(itemData.options, 'name', 'type')['value']
      setMerchType(type)
      if (type === 'apparel' || type === 'wallart') {
        setPreviewUrl(itemData.imageUrl)
        setCoverUrl(findElement(itemData.options, 'name', 'assetUrl')['value'])
      } else {
        let list = []
        itemData.imageUrl.split(',').map((item, index) => list.push({ url: item, selected: index === 0 }))
        setSelectedMerch(list[0])
        setMerchList(list)
      }
    }
  }, [orderData])

  return (
    <div className="g-container">
      <div className={styles.container}>
        <div className="w-full flex lg:flex-row flex-col gap-[50px]">
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
              <div className="w-full flex gap-[50px] h-[700px]">
                <div className="w-[130px] flex flex-col gap-[16px]">
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
                  <div className="flex-1 h-full max-h-[700px] flex items-center justify-center">
                    <ImageWithFoster
                      src={selectedMerch.url}
                      width={700}
                      className="w-[80%] lg:w-auto h-auto object-cover"
                    />
                  </div>
                )}
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
                  type=""
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

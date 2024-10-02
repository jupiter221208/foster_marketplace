import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getOrder, OrderData } from 'apis/merch'
import { findElement } from 'utils/helpers'
import { useViewport } from 'utils'

// images
import LeftBtnIcon from 'assets/icons/arrow-left-17x13.svg?component'
import RightBtnIcon from 'assets/icons/arrow-right-17x13.svg?component'

// styles
import styles from './index.module.scss'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// component
import PrimaryLayout from 'components/Layout/PrimaryLayout'
import ShoppingCartPhysicalCheckout from 'components/pages/BrowseNFT/MerchSection/ShoppingCartPhysicalCheckout'
import ImageWithFoster from 'components/ImageWithFoster'

const OrderSection = props => {
  const router = useRouter()
  const { id } = router.query
  const viewport = useViewport()

  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [merchList, setMerchList] = useState([])
  const [selectedMerch, setSelectedMerch] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(1)

  useEffect(() => {
    if (typeof id != 'string' || !Number.isFinite(parseInt(id))) return
    getOrder(id).then(setOrderData)
  }, [id])

  useEffect(() => {
    if (orderData) {
      let imageArray = []
      orderData.ssorder.items.forEach(itemData => {
        let previewUrl = itemData.imageUrl
        let coverUrl = findElement(itemData.options, 'name', 'assetUrl').value
        imageArray.push({ previewUrl, coverUrl })
      })

      let list = []
      imageArray.map((item, index) => {
        list.push({
          id: index,
          url: item?.previewUrl,
          selected: index === 0,
        })
      })

      if (list.length > 0) {
        setMerchList(list)
        setSelectedMerch(list[0])
      }
    }
  }, [orderData])

  const onClickMerch = key => {
    let list = []
    merchList.map((merch, index) => {
      if (key === index) {
        list.push({ id: index, url: merch.url, selected: true })
        setSelectedMerch({ id: index, url: merch.url, selected: true })
        setSelectedIndex(index + 1)
      } else {
        list.push({ id: index, url: merch.url, selected: false })
      }
    })
    setMerchList(list)
  }

  return (
    <div className="w-full block lg:flex">
      <div
        className={`w-full lg:max-w-[58%] lg:min-w-[58%] ${
          viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'g-container' : 'g-left-container'
        }`}
      >
        <div className="w-full flex">
          {merchList.length > 1 && (
            <div className="hidden lg:block mt-[75px] min-w-[75px]">
              <div className={styles.backStore}>
                Item&nbsp;{selectedIndex}/{merchList.length}
              </div>
              <div className="lg:flex hidden w-[75px] h-[75px] flex flex-col gap-[11px] mt-[30px]">
                {merchList.map((merch, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => onClickMerch(index)}
                      className={merch.selected ? styles.image : styles.imageHover}
                    >
                      <div className={merch.selected ? styles.selected : styles.unselected}>
                        <ImageWithFoster
                          width={350}
                          height={350}
                          src={merch.url}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          <div className="flex-1 flex justify-center">
            <div className="w-full flex justify-center max-w-[400px] lg:max-w-[625px]">
              <div className={`lg:hidden block h-auto w-full mt-[20px] mb-[20px]`}>
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
                  {merchList.length > 1 && (
                    <div className="flex lg:hidden w-full mt-[20px] h-[75px] gap-[11px] pl-[16px]">
                      {merchList.map((merch, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => onClickMerch(index)}
                            className={merch.selected ? styles.image : styles.imageHover}
                          >
                            <div className={merch.selected ? styles.selected : styles.unselected}>
                              <ImageWithFoster
                                width={350}
                                height={350}
                                src={merch.url}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`lg:block hidden sm:w-[640px] sm:h-[auto] lg:w-[400px] xl:w-[500px] 2xl:w-[625px] lg:h-[705px] mt-[20px] lg:mt-[75px]`}
              >
                <div className={styles.imageArea}>
                  <div className={styles.imageContent}>
                    <ImageWithFoster
                      width={700}
                      src={selectedMerch ? selectedMerch.url : ''}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                {merchList.length > 1 && selectedMerch && (
                  <div className="w-full mt-[30px] flex justify-center">
                    <div className="flex gap-[50px]">
                      <div
                        className={styles.arrowButton}
                        onClick={() =>
                          selectedMerch.id > 0 ? onClickMerch(selectedMerch.id - 1) : onClickMerch(merchList.length - 1)
                        }
                      >
                        <LeftBtnIcon />
                      </div>
                      <div
                        className={styles.arrowButton}
                        onClick={() =>
                          selectedMerch.id < merchList.length - 1 ? onClickMerch(selectedMerch.id + 1) : onClickMerch(0)
                        }
                      >
                        <RightBtnIcon />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`w-full lg:max-w-[42%] lg:max-w-[42%] ${
          viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'g-container' : 'g-right-container'
        } lg:flex lg:justify-end ${styles.rightBG}`}
      >
        {orderData && (
          <ShoppingCartPhysicalCheckout
            orderData={orderData}
            type="apparel"
            onBack={() => {
              router.back()
            }}
          />
        )}
      </div>
    </div>
  )
}

export default OrderSection

OrderSection.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

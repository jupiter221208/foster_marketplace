import React, { useState, useEffect } from 'react'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Pagination, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// json
import merchProductList from 'assets/json/merch-shop/merch-product-list.json'

// styles
import MerchProductCard from 'components/Card/MerchProductCard'
import { useViewport } from 'utils'
import MerchDTGSection from './MerchDTGSection'
import MerchShopQuestionModal from 'components/Modal/MerchShopQuestionModal'

const FosterProductSection = props => {
  const { productDetail, setProductDetail } = props
  const viewport = useViewport()
  const [productList, setProductList] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    if (productDetail?.selectedCard) {
      setSelectedCard(productDetail.selectedCard)
    }
  }, [productDetail])

  useEffect(() => {
    let cardList = []
    merchProductList.map(item => cardList.push({ ...item, selected: false }))
    setProductList(cardList)
  }, [])

  useEffect(() => {
    if (!selectedCard) return
    let cardList = []
    merchProductList.map(item => {
      if (selectedCard.id === item.id) cardList.push({ ...item, selected: true })
      else cardList.push({ ...item, selected: false })
    })
    setProductList(cardList)

    window.scrollTo({
      top: 860,
      behavior: 'smooth',
    })
  }, [selectedCard])

  const isSaved = () => {
    if (!productDetail) return
    let snapshotAssetUrl = productDetail.snapshotAssetUrl
    if (
      snapshotAssetUrl['front'] === '' &&
      snapshotAssetUrl['back'] === '' &&
      snapshotAssetUrl['right'] === '' &&
      snapshotAssetUrl['left'] === ''
    )
      return false
    return true
  }

  return (
    <div className="w-full">
      <Swiper
        navigation={true}
        slidesPerView={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 1.23 : 5}
        spaceBetween={
          viewport === 'xs'
            ? 20
            : viewport === 'sm' || viewport === 'md'
            ? 20
            : viewport === 'lg'
            ? 20
            : viewport === '2xl'
            ? 60
            : 60
        }
        pagination={true}
        modules={[Autoplay, Lazy, Navigation, Pagination]}
        className={'noScrollNavigationSwiper'}
      >
        {productList.map((item, index) => (
          <SwiperSlide key={index}>
            <div key={index}>
              <MerchProductCard
                data={item}
                onSelectedCard={item => {
                  if (isSaved()) {
                    setSelectedItem(item)
                    setShowQuestionModal(true)
                  } else {
                    setSelectedCard(item)
                  }
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="w-full lg:mt-[60px] mt-[30px] mb-[60px]">
        {selectedCard !== null && (
          <MerchDTGSection
            selectedCard={selectedCard}
            productDetail={productDetail}
            setProductDetail={detail => setProductDetail({ ...detail, selectedCard })}
          />
        )}
      </div>

      <MerchShopQuestionModal
        type={'apparel'}
        open={showQuestionModal}
        close={status => {
          setShowQuestionModal(false)
        }}
        onContinue={type => {
          setShowQuestionModal(false)
          setSelectedCard(selectedItem)
        }}
      />
    </div>
  )
}

export default FosterProductSection

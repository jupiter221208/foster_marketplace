import React, { useState, useEffect } from 'react'
import { useViewport } from 'utils'
import { useRouter } from 'next/router'

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
import MerchDTGSection from './MerchDTGSection'
import MerchShopQuestionModal from 'components/Modal/MerchShopQuestionModal'

const FosterProductSection = props => {
  const { productDetail, setProductDetail, backClicked, setFosterCard } = props
  const viewport = useViewport()
  const router = useRouter()
  const [productList, setProductList] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    if (backClicked) {
      if (selectedCard) {
        setSelectedCard(null)
        setSelectedItem(null)
        setShowQuestionModal(false)
        setFosterCard(null)
        setProductDetail({ ...productDetail, selectedCard: null })
      } else {
        let path = window.location.href
        router.push(path.substring(0, path.lastIndexOf('/')))
      }
    }
  }, [backClicked])

  useEffect(() => {
    if (productDetail?.selectedCard) {
      setSelectedCard(productDetail.selectedCard)
      setFosterCard(productDetail.selectedCard)
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

    // window.scrollTo({
    //   top: viewport === 'xs' || viewport === 'sm' ? 790 : viewport === 'md' ? 730 : 860,
    //   behavior: 'smooth',
    // })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCard])

  const isSaved = () => {
    if (!productDetail) return false
    let snapshotAssetUrl = productDetail.snapshotAssetUrl
    if (!snapshotAssetUrl) return false
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
      {selectedCard === null && (
        <div className="g-container grid grid-cols-2 sm:grid-cols-5 gap-[9px] sm:gap-[20px] sm:gap-[20px] xl:gap-[30px] 2xl:gap-[52px] mt-[30px]">
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
                      setFosterCard(item)
                    }
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </div>
      )}

      <div className="w-full lg:mt-[100px] mt-[30px]">
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
          if (isSaved()) setShowQuestionModal(false)
          setProductDetail(null)
          setSelectedCard(selectedItem)
          setFosterCard(selectedItem)
        }}
      />
    </div>
  )
}

export default FosterProductSection

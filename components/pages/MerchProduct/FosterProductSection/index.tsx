import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Pagination, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// json
import merchProductList from 'assets/json/merch-shop/merch-product-list.json'

// styles
import styles from './index.module.scss'
import MerchProductCard from 'components/Card/MerchProductCard'
import { useViewport } from 'utils'
import MerchDTGSection from './MerchDTGSection'

const FosterProductSection = () => {
  const viewport = useViewport()
  const [productList, setProductList] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)

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
  }, [selectedCard])

  return (
    <div className="w-full">
      <Swiper
        navigation={true}
        slidesPerView={
          viewport === 'xs'
            ? 1.07
            : viewport === 'sm' || viewport === 'md'
            ? 2
            : viewport === '2xl'
            ? 5
            : viewport === 'xl'
            ? 4
            : 4
        }
        spaceBetween={viewport === 'xs' ? 9 : viewport === 'sm' || viewport === 'md' ? 30 : viewport === 'lg' ? 20 : 20}
        pagination={true}
        modules={[Autoplay, Lazy, Navigation, Pagination]}
        className={'auctionNavigationSwiper'}
      >
        {productList.map((item, index) => (
          <SwiperSlide key={index}>
            <div key={index}>
              <MerchProductCard data={item} onSelectedCard={item => setSelectedCard(item)} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="w-full mt-[60px] mb-[60px]">
        {selectedCard !== null && <MerchDTGSection selectedCard={selectedCard} />}
      </div>
    </div>
  )
}

export default FosterProductSection

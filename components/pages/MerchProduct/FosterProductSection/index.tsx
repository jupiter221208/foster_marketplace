import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Pagination, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// json

// styles
import styles from './index.module.scss'
import MerchProductCard from 'components/Card/MerchProductCard'
import { useViewport } from 'utils'

const FosterProductSection = () => {
  const viewport = useViewport()

  const [productList, setProductList] = useState([])
  useEffect(() => {
    setProductList([
      {
        id: 0,
        name: 'Unisex Premium Hoodie | Cotton Heritage M2580',
        description: 'DTG starting at $30.45 / Embroidery starting at $36.45',
        size: 'S - 3XL',
        image: '/images/apparel/man_hoodie_white_s.png',
      },
      {
        id: 0,
        name: 'Unisex Premium Hoodie | Cotton Heritage M2580',
        description: 'DTG starting at $30.45 / Embroidery starting at $36.45',
        size: 'S - 3XL',
        image: '/images/apparel/man_hoodie_white_s.png',
      },
      {
        id: 0,
        name: 'Unisex Premium Hoodie | Cotton Heritage M2580',
        description: 'DTG starting at $30.45 / Embroidery starting at $36.45',
        size: 'S - 3XL',
        image: '/images/apparel/man_hoodie_white_s.png',
      },
      {
        id: 0,
        name: 'Unisex Premium Hoodie | Cotton Heritage M2580',
        description: 'DTG starting at $30.45 / Embroidery starting at $36.45',
        size: 'S - 3XL',
        image: '/images/apparel/man_hoodie_white_s.png',
      },
      {
        id: 0,
        name: 'Unisex Premium Hoodie | Cotton Heritage M2580',
        description: 'DTG starting at $30.45 / Embroidery starting at $36.45',
        size: 'S - 3XL',
        image: '/images/apparel/man_hoodie_white_s.png',
      },
      {
        id: 0,
        name: 'Unisex Premium Hoodie | Cotton Heritage M2580',
        description: 'DTG starting at $30.45 / Embroidery starting at $36.45',
        size: 'S - 3XL',
        image: '/images/apparel/man_hoodie_white_s.png',
      },

      {
        id: 0,
        name: 'Unisex Premium Hoodie | Cotton Heritage M2580',
        description: 'DTG starting at $30.45 / Embroidery starting at $36.45',
        size: 'S - 3XL',
        image: '/images/apparel/man_hoodie_white_s.png',
      },
    ])
  }, [])

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
        loop
      >
        {productList.map((item, index) => (
          <SwiperSlide key={index}>
            <div key={index}>
              <MerchProductCard data={item} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default FosterProductSection

import React, { useState, useEffect } from 'react'

// next components
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import ShopCard from 'components/Card/ShopCard'

// custom functions
import { useViewport } from 'utils'

// json

// styles
import styles from './index.module.scss'
import WallArtCard from 'components/Card/WallArtCard'

// api

const ShopApparelSection = props => {
  const { title, nftDetail, shopApparelList, openMerchPage, type = '' } = props
  const viewport = useViewport()

  const openPage = item => {
    const nftName = (nftDetail.name || nftDetail.json?.name) ?? 'No name found'
    const nftCoverUrl = nftDetail.image ?? ''
    const mintAddress = nftDetail.mintAddress
    let params = {
      nftName,
      nftCoverUrl,
      mintAddress,
      category: item.category,
      subCategory: item.sub_type,
      base: item.base,
    }
    openMerchPage(params)
  }
  return (
    shopApparelList.length > 0 && (
      <section className={styles.container}>
        <div className="w-full flex justify-between items-center">
          <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
            <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>{title}</div>
          </div>
        </div>
        <div className="w-full mt-[15px] lg:mt-[34px]">
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={
              viewport === 'xs' ? 1.2 : viewport === 'sm' || viewport === 'md' ? 2 : viewport === 'lg' ? 3 : 3
            }
            spaceBetween={
              viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 20
            }
            modules={[Autoplay, Lazy, Navigation]}
            className="navigationSwiper"
          >
            {shopApparelList.map((item: any, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-wrap gap gap-[11px] lg:gap-[20px] xl:gap-[32px]">
                  {type === 'apparel' ? (
                    <ShopCard
                      data={item}
                      nftCoverUrl={nftDetail.image ?? ''}
                      onClick={() => {
                        openPage(item)
                      }}
                    />
                  ) : (
                    <WallArtCard data={item} onClick={() => openPage(item)} />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    )
  )
}

export default ShopApparelSection

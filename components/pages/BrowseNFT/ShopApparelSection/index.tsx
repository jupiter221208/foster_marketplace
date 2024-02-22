import React from 'react'

// next components
import { useDispatch } from 'react-redux'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import StudioReleaseCard from 'components/Card/StudioReleaseCard'

// custom functions
import { useViewport } from 'utils'

// json
import StudioApparelList from 'assets/json/hero/hero-apparel-list.json'

// styles
import styles from './index.module.scss'
import WallArtCard from 'components/Card/WallArtCard'

// api

const ShopApparelSection = props => {
  const { title, nftDetail, shopApparelList, openMerchPage, type = '' } = props
  const dispatch = useDispatch()
  const viewport = useViewport()
  const nftName = (nftDetail.name || nftDetail.json?.name) ?? 'No name found'
  const nftCoverUrl = nftDetail.image ?? ''
  const mintAddress = nftDetail.mintAddress

  const openPage = item => {
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

  const getStudioItem = item => {
    let studioList = StudioApparelList.filter(studio => studio.name === item.name)
    return studioList[0]
  }

  return (
    shopApparelList.length > 0 && (
      <section className={styles.container}>
        <div className="w-full mt-[15px] lg:mt-[34px]">
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={
              viewport === 'xs' ? 1.2 : viewport === 'sm' || viewport === 'md' ? 2 : viewport === 'lg' ? 3 : 4
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
                    <StudioReleaseCard
                      image={getStudioItem(item)}
                      nftImage={nftCoverUrl}
                      nftName={nftName}
                      onClick={colorNumber => {
                        dispatch({ type: 'set', apparelColor: colorNumber })
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

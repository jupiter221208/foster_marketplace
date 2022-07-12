import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import OutlineButton from 'components/Button/OutlineButton'
import Button from 'components/Button'
import TrendingCollectionCard from 'components/Card/TrendingCollectionCard'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'

// json
import TrendingCollectionList from 'assets/json/trending-collection.json'

// styles
import styles from './index.module.scss'

const TrendingCollectionSection = props => {
  const { viewport } = props
  const router = useRouter()

  const [trendingCollectionList, setTrendingCollectionList] = useState([])
  const [trendingList, setTrendingList] = useState([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (viewport === 'sm' || viewport === 'md') {
      let newList = []
      let tempItem = []
      TrendingCollectionList.map((item, index) => {
        tempItem.push(item)
        if (index % 2 === 1) {
          newList.push(tempItem)
          tempItem = []
        }
      })
      if (tempItem.length > 0) newList.push(tempItem)
      setTrendingCollectionList(newList)
    } else {
      setTrendingList(TrendingCollectionList)
    }
  }, [viewport])

  const handleChangeActive = value => {
    setActive(value)

    if (viewport === 'sm' || viewport === 'md') {
      let newList = []
      let tempItem = []
      TrendingCollectionList.map((item, index) => {
        tempItem.push(item)
        if (index % 3 === 2) {
          newList.push(tempItem)
          tempItem = []
        }
      })
      if (tempItem.length > 0) newList.push(tempItem)

      switch (value) {
        case 0:
          setTrendingCollectionList(newList.slice(0, 1))
          break
        case 1:
          setTrendingCollectionList(newList.slice(0, 2))
          break
        case 2:
          setTrendingCollectionList(newList.slice(0, 3))
          break
        default:
          setTrendingCollectionList(newList)
          break
      }
    } else {
      switch (value) {
        case 0:
          setTrendingList(TrendingCollectionList.slice(0, 5))
          break
        case 1:
          setTrendingList(TrendingCollectionList.slice(0, 10))
          break
        case 2:
          setTrendingList(TrendingCollectionList.slice(0, 15))
          break
        default:
          setTrendingList(TrendingCollectionList)
          break
      }
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles.topRightEllipse}>
        <Image src={EllipseGreen} alt="" />
      </div>
      <div className="w-full flex justify-between items-center z-10">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
          <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Trending Collections</div>
          <div className="hidden lg:flex z-10">
            <Button
              label="24 hrs"
              onClick={() => handleChangeActive(0)}
              color={active === 0 ? '#ffffff' : '#979EA2'}
              backgroundColor={active === 0 ? '#5ac3ba' : 'transparent'}
            />
            <Button
              label="7 days"
              onClick={() => handleChangeActive(1)}
              color={active === 1 ? '#ffffff' : '#979EA2'}
              backgroundColor={active === 1 ? '#5ac3ba' : 'transparent'}
            />
            <Button
              label="30 days"
              onClick={() => handleChangeActive(2)}
              color={active === 2 ? '#ffffff' : '#979EA2'}
              backgroundColor={active === 2 ? '#5ac3ba' : 'transparent'}
            />
          </div>
        </div>
        <div className="hidden lg:flex z-10">
          <OutlineButton label="See More" onClick={() => router.push('/see-more')} borderColor="#ffffff" />
        </div>
      </div>
      <div className="w-full mt-[15px] lg:mt-[34px] z-10">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          slidesPerView={viewport === 'sm' || viewport === 'md' ? 2 : viewport === 'lg' ? 3 : 4}
          spaceBetween={viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40}
          modules={[Autoplay, Lazy, Navigation]}
          className="navigationSwiper"
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {viewport === 'sm' || viewport === 'md'
            ? trendingCollectionList.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="flex flex-wrap gap gap-[11px] lg:gap-[20px] xl:gap-[34px]">
                    {item.map((trendingCollectionItem, trendingCollectionIndex) => (
                      <TrendingCollectionCard
                        image={trendingCollectionItem.image}
                        nftName={trendingCollectionItem.nftName}
                        nftType={trendingCollectionItem.nftType}
                        artistName={trendingCollectionItem.artistName}
                        nfts={trendingCollectionItem.nfts}
                        icon={trendingCollectionItem.icon}
                        price={trendingCollectionItem.price}
                        viewport={viewport}
                        key={trendingCollectionIndex}
                      />
                    ))}
                  </div>
                </SwiperSlide>
              ))
            : trendingList.map((item, index) => (
                <SwiperSlide key={index}>
                  <TrendingCollectionCard
                    image={item.image}
                    nftName={item.nftName}
                    nftType={item.nftType}
                    artistName={item.artistName}
                    nfts={item.nfts}
                    icon={item.icon}
                    price={item.price}
                    viewport={viewport}
                  />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
      <div className="w-full flex lg:hidden justify-center">
        <div className="w-full max-w-[242px] z-10">
          <OutlineButton
            label="See More"
            fullWidth
            onClick={() => router.push('/see-more')}
            borderColor="#ffffff"
            size="h40"
          />
        </div>
      </div>
    </section>
  )
}

export default TrendingCollectionSection

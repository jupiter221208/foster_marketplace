import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import Button from 'components/Button'
import OutlineButton from 'components/Button/OutlineButton'
import CollectionCard from 'components/Card/CollectionCard'

// images and icons
import FilterGreenIcon from 'assets/icons/filter-green.svg'

// json
import CollectionList from 'assets/json/artist-profile/collection-list.json'

// styles
import styles from './index.module.scss'

const CollectionSwiperSection = props => {
  const { viewport } = props
  const router = useRouter()

  const [collectionList, setCollectionList] = useState([])

  useEffect(() => {
    let newList = []
    let tempItem = []
    CollectionList.map((item, index) => {
      tempItem.push(item)
      if (index % 2 === 1) {
        newList.push(tempItem)
        tempItem = []
      }
    })
    if (tempItem.length > 0) newList.push(tempItem)
    setCollectionList(newList)
  }, [])

  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] z-10">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          centeredSlides={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? true : false}
          slidesPerView={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 2 : viewport === 'lg' ? 3 : 4}
          spaceBetween={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40}
          modules={[Autoplay, Lazy, Navigation]}
          className="navigationSwiper"
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {collectionList.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-wrap gap gap-[11px] lg:gap-[20px] xl:gap-[34px]">
                {item.map((collectionItem, collectionIndex) => (
                  <CollectionCard
                    image={collectionItem.image}
                    nftName={collectionItem.nftName}
                    nftType={collectionItem.nftType}
                    artistName={collectionItem.artistName}
                    nfts={collectionItem.nfts}
                    icon={collectionItem.icon}
                    price={collectionItem.price}
                    viewport={viewport}
                    key={collectionIndex}
                  />
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default CollectionSwiperSection

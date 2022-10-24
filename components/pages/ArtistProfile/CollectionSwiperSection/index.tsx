import React, { useEffect, useState } from 'react'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import CollectionCard from 'components/Card/CollectionCard'

// custom functions
import { useViewport } from 'utils'

// json
import CollectionList from 'assets/json/artist-profile/collection-list.json'

// styles
import styles from './index.module.scss'

const CollectionSwiperSection = () => {
  const viewport = useViewport()

  const [collectionList, setCollectionList] = useState<any[]>([])

  useEffect(() => {
    let newList: any[] = []
    let tempItem: any[] = []
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
      <div className="w-full z-10">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
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
                {item.map((collectionItem: any, collectionIndex: number) => (
                  <CollectionCard
                    image={collectionItem.image}
                    nftName={collectionItem.nftName}
                    category={collectionItem.category}
                    artistName={collectionItem.artistName}
                    mintAddress={item.mintAddress}
                    nfts={collectionItem.nfts}
                    icon={collectionItem.icon}
                    price={collectionItem.price}
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

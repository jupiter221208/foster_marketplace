import React, { useState, useEffect } from 'react'

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
import OutlineButton from 'components/Button/OutlineButton'
import CollectionCard from 'components/Card/CollectionCard'

// custom functions
import { useViewport } from 'utils'

// json
import MoreArtistList from 'assets/json/explore/collection-explore-list.json'

// styles
import styles from './index.module.scss'

// api
import collectionAPI from 'apis/collections'

const MoreArtistSection = props => {
  const { artistInfo } = props
  const viewport = useViewport()
  const router = useRouter()
  const [collectionList, setCollectionList] = useState([])

  useEffect(() => {
    if (artistInfo !== null) {
      collectionAPI.getOtherCollections(artistInfo.address).then(
        response => {
          setCollectionList(response)
        },
        error => {}
      )
    }
  }, [artistInfo])

  return (
    collectionList.length > 0 && (
      <section className={styles.container}>
        <div className="w-full flex justify-between items-center">
          <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
            <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>More from this Artist</div>
          </div>
          <div className="hidden lg:flex">
            <OutlineButton
              label="See More"
              onClick={() => router.push('/explore')}
              borderColor="#ffffff"
              height="42px"
            />
          </div>
        </div>
        <div className="w-full mt-[15px] lg:mt-[34px]">
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 2 : viewport === 'lg' ? 3 : 4}
            spaceBetween={
              viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40
            }
            modules={[Autoplay, Lazy, Navigation]}
            className="navigationSwiper"
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
          >
            {collectionList.map((item: any, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-wrap gap gap-[11px] lg:gap-[20px] xl:gap-[32px]">
                  <CollectionCard
                    image={item.cover_image}
                    nftName={item.collection_name}
                    category={item.categories.split(',')}
                    artistName={artistInfo.name}
                    mintAddress={item.collection_id}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-full flex lg:hidden justify-center">
          <div className="w-full max-w-[242px]">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => router.push('/explore')}
              borderColor="#ffffff"
              height="40px"
            />
          </div>
        </div>
      </section>
    )
  )
}

export default MoreArtistSection

import React from 'react'

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

// json
import MoreArtistList from 'assets/json/explore/collection-explore-list.json'

// styles
import styles from './index.module.scss'

const MoreArtistSection = props => {
  const { viewport } = props

  return (
    <section className={styles.container}>
      <div className="w-full flex justify-between items-center">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
          <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>More from this Artist</div>
        </div>
        <div className="hidden lg:flex">
          <OutlineButton
            label="See More"
            onClick={() => router.push('/see-more')}
            borderColor="#ffffff"
            height="42px"
          />
        </div>
      </div>
      <div className="w-full mt-[15px] lg:mt-[34px]">
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
          {MoreArtistList.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-wrap gap gap-[11px] lg:gap-[20px] xl:gap-[34px]">
                <CollectionCard
                  image={item.image}
                  nftName={item.nftName}
                  nftType={item.nftType}
                  artistName={item.artistName}
                  nfts={item.nfts}
                  icon={item.icon}
                  price={item.price}
                  viewport={viewport}
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
            onClick={() => router.push('/see-more')}
            borderColor="#ffffff"
            height="40px"
          />
        </div>
      </div>
    </section>
  )
}

export default MoreArtistSection

import React from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'
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

// styles
import styles from './index.module.scss'

const ExploreCollectionSection = props => {
  const { exploreCircus } = props

  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  return (
    exploreCircus.length !== 0 && (
      <section className={styles.container}>
        <div className={styles.topLeftEllipse} />
        <div className="w-full flex justify-between items-center z-10">
          <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
            <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Active Listings</div>
          </div>
          <div className="hidden lg:flex z-10">
            <OutlineButton
              label="See More"
              onClick={() => router.push('/explore')}
              borderColor="#ffffff"
              height="42px"
            />
          </div>
        </div>
        <div className="w-full mt-[15px] lg:mt-[34px] z-10">
          {exploreCircus.length > 4 ? (
            <Swiper
              navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
              slidesPerView={
                viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 2 : viewport === 'lg' ? 3 : 4
              }
              spaceBetween={
                viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40
              }
              modules={[Autoplay, Lazy, Navigation]}
              className="navigationSwiper"
              loop
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
            >
              {exploreCircus.map((item: any, index) => (
                <SwiperSlide key={index}>
                  <CollectionCard
                    image={item.artist.banner_picture}
                    artistName={item.artist.username}
                    mintAddress={item.artist.wallet_id}
                    nfts={item.number_of_nfts}
                    icon={item.artist.profile_picture}
                    onClick={() => {
                      dispatch({ type: 'set', isLoading: true })
                      router.push(`/collection/${item.artist.wallet_id}`)
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="grid grid-cols-12 gap gap-[11px] lg:gap-[20px] xl:gap-[34px] pb-[30px]">
              {exploreCircus.map((item, index) => (
                <div className="col-span-6 lg:col-span-4 xl:col-span-3" key={index}>
                  <CollectionCard
                    image={item.artist.banner_picture}
                    artistName={item.artist.username}
                    mintAddress={item.artist.wallet_id}
                    nfts={item.number_of_nfts}
                    icon={item.artist.profile_picture}
                    onClick={() => {
                      dispatch({ type: 'set', isLoading: true })
                      router.push(`/collection/${item.artist.wallet_id}`)
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-full flex lg:hidden justify-center">
          <div className="w-full max-w-[242px] z-10">
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

export default ExploreCollectionSection

import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch, useSelector } from 'react-redux'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import TrendingCard from 'components/Card/TrendingCard'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// call apis
import merchAPI from 'apis/merch'

const TrendingSection = props => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const apparelType = useSelector<any>(state => state.apparelType)
  const [trendingList, setTrendingList] = useState<any[]>([])

  useEffect(() => {
    merchAPI.getRecentOrders().then(response => {
      if (response !== null && response !== undefined && response.length !== 0) {
        let arr = Object.keys(response.nftData).map(key => response.nftData[key])
        setTrendingList(arr)
      }
    }),
      error => {
        console.log(error)
      }
  }, [])

  return (
    trendingList &&
    trendingList.length !== 0 && (
      <section className={styles.container}>
        <div className="w-full flex justify-between items-center z-10">
          <div className="w-full flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full flex justify-center items-center z-10">
                <div className={styles.title}>Recent Purchases</div>
              </div>
            ) : (
              <div className="w-full flex flex-row justify-between">
                <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Recent Purchases</div>
              </div>
            )}
          </div>
        </div>
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          slidesPerView={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 3 : 1}
          spaceBetween={40}
          centeredSlides={true}
          loop
          modules={[Navigation]}
          className={'auctionNavigationSwiper'}
        >
          <div className="w-full grid grid-cols-12 gap-[20px] lg:gap-[50px] mt-[10px] lg:mt-[34px] z-10">
            {trendingList.map((item: any, index) => (
              <SwiperSlide key={index}>
                <div className="w-full flex flex-col col-span-6 lg:col-span-4 2xl:col-span-3 items-center">
                  <TrendingCard
                    imagedata={props.heroValue.data}
                    nftName={item.nft.nft_name}
                    userName={item.artist.username}
                    assetUrl={item.nft.asset_url}
                    profilePicture={item.artist.profile_picture}
                    token_id={item.nft.token_id}
                    onClick={colorNumber => {
                      dispatch({ type: 'set', isLoading: true })
                      dispatch({ type: 'set', apparelType })
                      dispatch({ type: 'set', detailShow: true })
                      dispatch({ type: 'set', apparelColor: colorNumber })
                      router.push(`/nft/${item.nft.token_id}`)
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
      </section>
    )
  )
}

export default TrendingSection

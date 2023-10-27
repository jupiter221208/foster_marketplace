import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch, useSelector } from 'react-redux'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Pagination, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import OutlineButton from 'components/Button/OutlineButton'
import TrendingCard from 'components/Card/TrendingCard'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// call apis
import merchAPI from 'apis/merch'
import SeeMoreButton from 'components/Button/SeeMoreButton'

function checkArrayForName(array, nameValue) {
  return array.some(obj => obj.name === nameValue)
}

const TrendingSection = props => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const apparelType = useSelector<any>(state => state.apparelType)
  const [trendingList, setTrendingList] = useState<any[]>([])

  useEffect(() => {
    merchAPI.getRecentOrders().then(response => {
      if (response !== null && response !== undefined && response.length !== 0) {
        let newData = []
        response.map(item => {
          const ssorderItem = item.ssorder.items[0].options
          if (checkArrayForName(ssorderItem, 'assetUrl')) newData.push(item)
        })
        setTrendingList(newData)
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
        <div className="w-full flex justify-between items-center z-10 mb-[30px]">
          <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full flex justify-center items-center z-10">
                <div className={styles.title}>Trending</div>
              </div>
            ) : (
              <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Trending</div>
            )}
          </div>
        </div>
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          slidesPerView={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 3 : 1}
          spaceBetween={40}
          centeredSlides={true}
          loop
          modules={[Autoplay, Navigation]}
          className={'heroNavigationSwiper'}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          <div className="w-full grid grid-cols-12 gap-[20px] lg:gap-[50px] mt-[15px] lg:mt-[34px] z-10">
            {trendingList.map((item: any, index) => (
              <SwiperSlide key={index}>
                {/* <div key={index} className="flex col-span-6 lg:col-span-4 2xl:col-span-3 items-center"> */}
                <TrendingCard
                  imagedata={props.heroValue.data}
                  innerimage={item.ssorder.items[0].options}
                  nftAddress={
                    item.ssorder.items[0].options.find((option: any) => option.name === 'nftAddress')?.value || null
                  }
                  nftName={item.ssorder.items[0]?.options}
                  assetType={item.asset_type}
                  coverImage={item.cover_image_url}
                  artistName={item.artist_username}
                  onClick={color => {
                    dispatch({ type: 'set', isLoading: true })
                    dispatch({ type: 'set', apparelType })
                    dispatch({ type: 'set', detailShow: true })
                    dispatch({ type: 'set', apparelColor: color })
                    router.push(
                      `/nft/${
                        item.ssorder.items[0].options.find((option: any) => option.name === 'nftAddress')?.value || null
                      }`
                    )
                  }}
                />
                {/* </div> */}
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
      </section>
    )
  )
}

export default TrendingSection

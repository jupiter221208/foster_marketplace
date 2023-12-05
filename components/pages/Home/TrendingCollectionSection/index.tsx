import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'
import Lottie from 'lottie-react'
import PreLoaderIcon from 'assets/lottery/preloader.json'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// import Marquee from 'react-fast-marquee'

// components
import OutlineButton from 'components/Button/OutlineButton'
import TrendingCollectionCard from 'components/Card/TrendingCollectionCard'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import SeeMoreButton from 'components/Button/SeeMoreButton'
import TimeSlotButton from 'components/Button/TimeSlotButton'

const TrendingCollectionSection = props => {
  const { category, loop } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [trendingList, setTrendingList] = useState<any[]>([])
  const [active, setActive] = useState<any>(1)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setTrendingList([])
    getTrendingCollectionsFromServer(category, 'week')
  }, [category])

  const getTrendingCollectionsFromServer = (category, period) => {
    setIsLoading(true)
    dashboardAPI.getTrendingCollections(category, period).then(
      response => {
        setIsLoading(false)
        if (response instanceof Array) {
          setTrendingList(response)
        }
      },
      error => {
        setIsLoading(false)
        console.log(error)
      }
    )
  }

  const handleChangeActive = value => {
    setActive(value)

    switch (value) {
      case 0:
        getTrendingCollectionsFromServer(category, 'day')
        break
      case 1:
        getTrendingCollectionsFromServer(category, 'week')
        break
      case 2:
        getTrendingCollectionsFromServer(category, 'month')
        break
      case 3:
        getTrendingCollectionsFromServer(category, 'all')
        break
      default:
        getTrendingCollectionsFromServer(category, 'week')
        break
    }
  }

  return (
    (category.length === 0 || trendingList.length > 0) && (
      <section className={styles.container}>
        <div className="w-full flex justify-between items-center z-10">
          <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full flex justify-center items-center z-10 lg:mt-[5px]">
                <div className={styles.title}>Trending Collections</div>
              </div>
            ) : (
              <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Trending&nbsp;Collections</div>
            )}

            <div className="w-full hidden lg:flex h-[54px] z-10">
              <div className={styles.slotBG}>
                <TimeSlotButton
                  label="24 hrs"
                  onClick={() => handleChangeActive(0)}
                  fontFamily={'Muli-SemiBold'}
                  color={active === 0 ? '#1A1A1A' : '#979EA2'}
                  backgroundColor01={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
                  backgroundColor02={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
                  gradientDirection="bottom"
                  width={86}
                  boxShadow={active === 0 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
                />
                <TimeSlotButton
                  label="7 days"
                  onClick={() => handleChangeActive(1)}
                  fontFamily={'Muli-SemiBold'}
                  color={active === 1 ? '#1A1A1A' : '#979EA2'}
                  backgroundColor01={active === 1 ? 'var(--toggle-bg-color)' : 'transparent'}
                  backgroundColor02={active === 1 ? 'var(--toggle-bg-color)' : 'transparent'}
                  gradientDirection="bottom"
                  width={86}
                  boxShadow={active === 1 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
                />
                <TimeSlotButton
                  label="30 days"
                  onClick={() => handleChangeActive(2)}
                  fontFamily={'Muli-SemiBold'}
                  color={active === 2 ? '#1A1A1A' : '#979EA2'}
                  backgroundColor01={active === 2 ? 'var(--toggle-bg-color)' : 'transparent'}
                  backgroundColor02={active === 2 ? 'var(--toggle-bg-color)' : 'transparent'}
                  gradientDirection="bottom"
                  width={100}
                  boxShadow={active === 2 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
                />
                <TimeSlotButton
                  label="All Time"
                  onClick={() => handleChangeActive(3)}
                  fontFamily={'Muli-SemiBold'}
                  color={active === 3 ? '#1A1A1A' : '#979EA2'}
                  backgroundColor01={active === 3 ? 'var(--toggle-bg-color)' : 'transparent'}
                  backgroundColor02={active === 3 ? 'var(--toggle-bg-color)' : 'transparent'}
                  gradientDirection="bottom"
                  width={100}
                  boxShadow={active === 3 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
                />
              </div>
            </div>
          </div>
          <div className="hidden lg:flex z-10">
            <SeeMoreButton
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 1 })
                dispatch({ type: 'set', collectionSort: 'trending' })
                dispatch({ type: 'set', collectionCategory: category })
                router.push('/explore')
              }}
            />
          </div>
        </div>
        <div className="w-full flex lg:hidden h-[54px] mt-[15px] z-10">
          <div className={styles.slotBG}>
            <TimeSlotButton
              label="24 hrs"
              onClick={() => handleChangeActive(0)}
              fontFamily={'Muli-SemiBold'}
              color={active === 0 ? '#1A1A1A' : '#979EA2'}
              backgroundColor01={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
              backgroundColor02={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
              gradientDirection="bottom"
              width={86}
              boxShadow={active === 0 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
            />
            <TimeSlotButton
              label="7 days"
              onClick={() => handleChangeActive(1)}
              fontFamily={'Muli-SemiBold'}
              color={active === 1 ? '#1A1A1A' : '#979EA2'}
              backgroundColor01={active === 1 ? 'var(--toggle-bg-color)' : 'transparent'}
              backgroundColor02={active === 1 ? 'var(--toggle-bg-color)' : 'transparent'}
              gradientDirection="bottom"
              width={86}
              boxShadow={active === 1 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
            />
            <TimeSlotButton
              label="30 days"
              onClick={() => handleChangeActive(2)}
              fontFamily={'Muli-SemiBold'}
              color={active === 2 ? '#1A1A1A' : '#979EA2'}
              backgroundColor01={active === 2 ? 'var(--toggle-bg-color)' : 'transparent'}
              backgroundColor02={active === 2 ? 'var(--toggle-bg-color)' : 'transparent'}
              gradientDirection="bottom"
              width={86}
              boxShadow={active === 2 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
            />
            <TimeSlotButton
              label="All Time"
              onClick={() => handleChangeActive(3)}
              fontFamily={'Muli-SemiBold'}
              color={active === 3 ? '#1A1A1A' : '#979EA2'}
              backgroundColor01={active === 3 ? 'var(--toggle-bg-color)' : 'transparent'}
              backgroundColor02={active === 3 ? 'var(--toggle-bg-color)' : 'transparent'}
              gradientDirection="bottom"
              width={86}
              boxShadow={active === 3 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="w-full h-[500px] flex justify-center">
            <div className="w-[500px] h-[40px] mt-[100px]">
              <Lottie width={500} height={40} animationData={PreLoaderIcon} loop={true} />
            </div>
          </div>
        ) : (
          <div className="w-full mt-[30px] lg:mt-[34px] z-10 pb-[0px] lg:pb-[30px]">
            {trendingList !== null && trendingList !== undefined && trendingList.length !== 0 && (
              <Swiper
                navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
                slidesPerView={viewport === 'xs' ? 1.1 : viewport === 'sm' || viewport === 'md' ? 2 : 3.02}
                spaceBetween={
                  viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40
                }
                modules={[Autoplay, Lazy, Navigation]}
                className={trendingList.length > 3 ? 'auctionNavigationSwiper' : 'noScrollNavigationSwiper'}
                // loop={trendingList.length < 3 ? false : loop}
                // autoplay={{
                //   delay: 5000,
                //   disableOnInteraction: false,
                // }}
              >
                {trendingList.map((item: any, index) => (
                  <SwiperSlide key={index}>
                    <TrendingCollectionCard
                      collectionID={item.collection_id}
                      image={item.cover_image}
                      collectionName={item.collection_name}
                      artistName={item.artist_username}
                      nftCount={item.number_in_collections}
                      avatar={item.artist_profile_picture}
                      key={index}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              // <Marquee
              //   gradient={false}
              //   pauseOnHover={false}
              //   pauseOnClick={true}
              //   speed={
              //     viewport === 'xs'
              //       ? 40
              //       : viewport === 'sm'
              //       ? 50
              //       : viewport === 'md'
              //       ? 60
              //       : viewport === 'lg'
              //       ? 70
              //       : viewport === 'xl'
              //       ? 90
              //       : 110
              //   }
              // >
              // <div className="w-full flex gap-5 lg:gap-10 mx-[10px] py-2 lg:mx-5">
              //   {trendingList.map((item: any, index) => (
              //     <TrendingCollectionCard
              //       collectionID={item.collection_id}
              //       image={item.cover_image}
              //       collectionName={item.collection_name}
              //       artistName={item.artist_username}
              //       nftCount={item.number_in_collections}
              //       avatar={item.artist_profile_picture}
              //       key={index}
              //     />
              //   ))}
              // </div>
              // </Marquee>
            )}
          </div>
        )}
        <div className="w-full flex lg:hidden justify-center lg:mt-0 mt-[15px]">
          <div className="w-full max-w-[242px] z-10">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 1 })
                dispatch({ type: 'set', collectionSort: 'trending' })
                dispatch({ type: 'set', collectionCategory: category })
                router.push('/explore')
              }}
              borderColor={'var(--see-more-border)'}
              height="40px"
            />
          </div>
        </div>
      </section>
    )
  )
}

export default TrendingCollectionSection

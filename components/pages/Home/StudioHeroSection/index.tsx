import React from 'react'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// custom functions
import { useViewport } from 'utils'

// resources
import studioList from 'assets/json/home/studio-list.json'

// styles
import styles from './index.module.scss'
import StudioSeasonCard from 'components/Card/StudioSeasonCard'
import { TRUE } from 'sass'

// call apis

const StudioHeroSection = props => {
  const { isEditionLoaded } = props
  const viewport = useViewport()

  return studioList.length > 0 ? (
    <section className={styles.container}>
      <div className="relative w-full flex justify-between items-center z-10 ml-[5px]">
        <div className={styles.title}>{'Studio Season II'}</div>
      </div>
      <div className={`${styles.editionSwiper}`}>
        <Swiper
          navigation={viewport === 'xs' ? false : true}
          slidesPerView={viewport === 'xs' ? 1 : 1.36}
          spaceBetween={viewport === 'xs' ? 0 : 20}
          centeredSlides={true}
          loop={studioList.length > 1}
          modules={[Navigation]}
          className={studioList.length > 1 ? 'heroNavigationSwiper' : 'noScrollNavigationSwiper'}
        >
          {studioList.map((item, index) => (
            <SwiperSlide key={index}>
              <StudioSeasonCard data={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  ) : !isEditionLoaded ? (
    <div className="w-full h-[645px] lg:h-[760px]">
      <div className="w-[163px] h-[36px] mt-[60px] rounded-[18px] overflow-hidden">
        <div className="skeletonLoader" />
      </div>
      <div className="w-full lg:flex hidden justify-center">
        <div className="min-w-[100%] flex gap-[50px] items-center">
          <div className="min-w-[56px] h-[56px] rounded-[28px] overflow-hidden">
            <div className="skeletonLoader" />
          </div>
          <div className="flex-1 h-[575px] rounded-[20px] overflow-hidden mt-[30px]">
            <div className="skeletonLoader" />
          </div>
          <div className="min-w-[56px] h-[56px] rounded-[28px] overflow-hidden">
            <div className="skeletonLoader" />
          </div>
        </div>
      </div>

      <div className="w-full lg:hidden flex gap-[15px] justify-center mt-[20px]">
        <div className="min-w-[300px] w-[300px] h-[458px] rounded-[10px] overflow-hidden">
          <div className="skeletonLoader" />
        </div>

        <div className="w-[300px] h-[458px] rounded-[10px] overflow-hidden">
          <div className="skeletonLoader" />
        </div>
      </div>

      <div className="w-full lg:hidden flex justify-center mt-[30px]">
        <div className="w-[300px] h-[45px] rounded-[10px] overflow-hidden">
          <div className="skeletonLoader" />
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}

export default StudioHeroSection

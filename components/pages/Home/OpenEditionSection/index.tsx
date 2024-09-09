import React, { useEffect } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// custom functions
import { useViewport } from 'utils'

// resources
import SeeMoreButton from 'components/Button/SeeMoreButton'
import OutlineButton from 'components/Button/OutlineButton'
import OpenEditionCard from 'components/Card/OpenEditionCard'
import HomeEditionCard from 'components/Card/HomeEditionCard'

// styles
import styles from './index.module.scss'

// call apis

const OpenEditionSection = props => {
  const { category, isEditionLoaded, editionList } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    if (editionList.length > 0) {
      ;(async () => {
        for (let index = 0; index < editionList.length; index++) {
          let data = editionList[index]
          if (data.token_id !== undefined) fetch(`/nft/${data.tokenId}`).then(e => e.text())
          if (index % 4 == 3) {
            await sleep(1000)
          }
        }
      })()
    }
  }, [editionList])

  return editionList.length > 0 ? (
    <section className={styles.container}>
      <div className="relative w-full flex justify-between items-center z-10 ml-[5px]">
        <div className={styles.title}>Open&nbsp;Editions</div>
        <div className="z-10 sm:block hidden">
          <SeeMoreButton
            onClick={() => {
              dispatch({ type: 'set', exploreTab: 0 })
              dispatch({ type: 'set', availabilityFilter: 2 })
              dispatch({ type: 'set', artworkCategory: category })
              router.push('/explore')
            }}
          />
        </div>
      </div>
      <div className={`${styles.editionSwiper} lg:block hidden`}>
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          slidesPerView={1.36}
          spaceBetween={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 20 : 0}
          centeredSlides={true}
          loop={editionList.length > 1}
          modules={[Navigation]}
          className={editionList.length > 1 ? 'heroNavigationSwiper' : 'noScrollNavigationSwiper'}
        >
          {editionList.map((item, index) => (
            <SwiperSlide key={index}>
              <OpenEditionCard data={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Mobile */}
      <div className="w-full lg:hidden block mt-[20px] lg:mt-[30px] z-10">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          slidesPerView={viewport === 'xs' ? 1.13 : 2}
          spaceBetween={viewport === 'xs' ? 9 : viewport === 'sm' || viewport === 'md' ? 30 : 0}
          modules={[Navigation]}
          className={'heroNavigationSwiper'}
        >
          {editionList.map((item, index) => (
            <SwiperSlide key={index}>
              <HomeEditionCard data={item} type="open" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="w-full flex sm:hidden justify-center lg:mt-0 mt-[30px]">
        <div className="w-full max-w-[300px] z-10">
          <OutlineButton
            label="See More"
            fullWidth
            onClick={() => {
              dispatch({ type: 'set', exploreTab: 0 })
              dispatch({ type: 'set', availabilityFilter: 2 })
              dispatch({ type: 'set', artworkCategory: category })
              router.push('/explore')
            }}
            fontSize="16px"
            height="41px"
            borderRadius="8px"
          />
        </div>
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

export default OpenEditionSection

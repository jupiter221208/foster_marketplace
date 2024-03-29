import React, { useEffect, useState } from 'react'

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
import LiveAuctionCard from 'components/Card/LiveAuctionCard'

// custom functions
import { useViewport } from 'utils'

// resources

// styles
import styles from './index.module.scss'

// call apis
import SeeMoreButton from 'components/Button/SeeMoreButton'
import OutlineButton from 'components/Button/OutlineButton'
import LimitedEditionCard from 'components/Card/LimitedEditionCard'

const LimitedEditionSection = props => {
  const { category, artist = '', fromPage = 'home', setLiveAuctionLoaded = null } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [editionList, setEditionList] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getLimitedEditionsFromServer()
  }, [])

  const getLimitedEditionsFromServer = () => {
    return false
  }

  return (
    editionList.length > 0 && (
      <section className={styles.container}>
        <div className="w-full flex justify-between items-center z-10 ml-[5px]">
          <div className={styles.title}>Live&nbsp;Auctions</div>
          <div className="z-10 sm:block hidden">
            <SeeMoreButton
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 0 })
                dispatch({ type: 'set', availabilityFilter: 1 })
                dispatch({ type: 'set', artworkCategory: category })
                router.push('/explore')
              }}
            />
          </div>
        </div>
        <div className="w-full mt-[20px] lg:mt-[30px] z-10">
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={
              viewport === 'xs'
                ? 1.07
                : viewport === 'sm' || viewport === 'md'
                ? 2
                : viewport === '2xl'
                ? 5
                : viewport === 'xl'
                ? 4
                : 4
            }
            spaceBetween={
              viewport === 'xs' ? 9 : viewport === 'sm' || viewport === 'md' ? 30 : viewport === 'lg' ? 20 : 20
            }
            modules={[Autoplay, Lazy, Navigation]}
            className={
              editionList.length > 5
                ? 'auctionNavigationSwiper'
                : (viewport === 'lg' || viewport === 'xl') && editionList.length > 4
                ? 'auctionNavigationSwiper'
                : 'noScrollNavigationSwiper'
            }
          >
            {editionList.map((item, index) => (
              <SwiperSlide key={index}>
                <LimitedEditionCard
                  data={item}
                  onClick={() => {
                    dispatch({ type: 'set', isLoading: true })
                    router.push('/nft/' + item.token_id)
                  }}
                  setCardExpired={item => {}}
                  key={index}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="w-full flex sm:hidden justify-center lg:mt-0 mt-[10px]">
          <div className="w-full max-w-[300px] z-10">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 0 })
                dispatch({ type: 'set', availabilityFilter: 1 })
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
    )
  )
}

export default LimitedEditionSection

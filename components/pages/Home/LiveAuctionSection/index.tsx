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
import OutlineButton from 'components/Button/OutlineButton'
import Button from 'components/Button'
import LiveAuctionCard from 'components/Card/LiveAuctionCard'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'

const LiveAuctionSection = props => {
  const { category, artist = '' } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [allListAuctionList, setAllLiveAuctionList] = useState<any[]>([])
  const [liveAuctionList, setLiveAuctionList] = useState<any[]>([])
  const [active, setActive] = useState<any>(0)

  useEffect(() => {
    dashboardAPI.getLiveAuctions(category, artist).then(response => {
      if (response !== null && response !== undefined && response.length !== 0) {
        let lists = []
        response.forEach(item => {
          if (item.asset_url.length > 0) lists.push(item)
        })
        setAllLiveAuctionList(lists)
        setLiveAuctionList(lists)
      } else {
        setAllLiveAuctionList([])
        setLiveAuctionList([])
      }
    }),
      error => {
        console.log(error)
      }
  }, [artist, category])

  const handleChangeActive = value => {
    setActive(value)
    switch (value) {
      case 0:
        setLiveAuctionList(allListAuctionList.slice(0, 5))
        break
      case 1:
        setLiveAuctionList(allListAuctionList.slice(0, 10))
        break
      case 2:
        setLiveAuctionList(allListAuctionList.slice(0, 15))
        break
      default:
        setLiveAuctionList(allListAuctionList)
        break
    }
  }

  return (
    allListAuctionList.length !== 0 && (
      <section className={styles.container}>
        <div className={styles.topLeftEllipse} />
        <div className="w-full flex justify-between items-center z-10">
          <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
            <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
              {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                <div className="w-full flex justify-between items-center z-10">
                  <div className={styles.title}>Live Auctions</div>
                  <div
                    className={styles.seeMore}
                    onClick={() => {
                      dispatch({ type: 'set', exploreTab: 0 })
                      router.push('/explore')
                    }}
                  >
                    SEE MORE
                  </div>
                </div>
              ) : (
                <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Live Auctions</div>
              )}
            </div>
            <div className="hidden lg:flex z-10">
              <Button
                label="Recently Started"
                onClick={() => handleChangeActive(0)}
                color={active === 0 ? '#202427' : '#979EA2'}
                backgroundColor={active === 0 ? '#5ac3ba' : 'transparent'}
              />
              <Button
                label="Ending Soon"
                onClick={() => handleChangeActive(1)}
                color={active === 1 ? '#202427' : '#979EA2'}
                backgroundColor={active === 1 ? '#5ac3ba' : 'transparent'}
              />
              <Button
                label="All"
                onClick={() => handleChangeActive(2)}
                color={active === 2 ? '#202427' : '#979EA2'}
                backgroundColor={active === 2 ? '#5ac3ba' : 'transparent'}
              />
            </div>
          </div>
          {/* <div className="hidden lg:flex z-10">
            <OutlineButton
              label="See More"
              onClick={() => router.push('/explore')}
              borderColor="#ffffff"
              height="42px"
            />
          </div> */}
        </div>
        <div className="w-full mt-[15px] lg:mt-[34px] z-10">
          {liveAuctionList.length > 0 ? (
            <Swiper
              navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
              slidesPerView={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 1.5 : 3}
              spaceBetween={
                viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40
              }
              modules={[Autoplay, Lazy, Navigation]}
              className="navigationSwiper"
              loop={liveAuctionList.length >= 3}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
            >
              {liveAuctionList.map((item: any, index) => (
                <SwiperSlide key={index}>
                  <LiveAuctionCard
                    data={item}
                    onClick={() => {
                      dispatch({ type: 'set', isLoading: true })
                      router.push('/live-auction?id=' + item.token_id)
                    }}
                    key={index}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="grid grid-cols-12 gap gap-[11px] lg:gap-[20px] xl:gap-[34px] pb-[30px]">
              {liveAuctionList.map((item, index) => (
                <div className="col-span-6 lg:col-span-4 xl:col-span-3" key={index}>
                  <LiveAuctionCard
                    data={item}
                    onClick={() => {
                      dispatch({ type: 'set', isLoading: true })
                      router.push('/live-auction?id=' + item.token_id)
                    }}
                    key={index}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* <div className="w-full flex lg:hidden justify-center">
          <div className="w-full max-w-[242px] z-10">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => router.push('/explore')}
              borderColor="#ffffff"
              height="40px"
            />
          </div>
        </div> */}
      </section>
    )
  )
}

export default LiveAuctionSection

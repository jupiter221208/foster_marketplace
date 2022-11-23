import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'
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
import Button from 'components/Button'
import LiveAuctionCard from 'components/Card/LiveAuctionCard'

// custom functions
import { useViewport } from 'utils'

// json
import LiveAuctionList from 'assets/json/live-auction.json'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'

const LiveAuctionSection = () => {
  const viewport = useViewport()
  const router = useRouter()

  const [liveAuctionList, setLiveAuctionList] = useState<any[]>([])
  const [active, setActive] = useState<any>(0)

  const handleChangeActive = value => {
    setActive(value)

    switch (value) {
      case 0:
        setLiveAuctionList(LiveAuctionList.slice(0, 5))
        break
      case 1:
        setLiveAuctionList(LiveAuctionList.slice(0, 10))
        break
      case 2:
        setLiveAuctionList(LiveAuctionList.slice(0, 15))
        break
      default:
        setLiveAuctionList(LiveAuctionList)
        break
    }
  }

  useEffect(() => {
    dashboardAPI.getLiveAuctions().then(response => {
      if (response !== null && response !== undefined && response.length !== 0) {
        setLiveAuctionList(response)
      }
    }),
      error => {
        console.log(error)
      }
  }, [])

  return (
    <section className={styles.container}>
      <div className={styles.topLeftEllipse} />
      <div className="w-full flex justify-between items-center z-10">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
          <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Live Auctions</div>
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
        <div className="hidden lg:flex z-10">
          <OutlineButton label="See More" onClick={() => router.push('/explore')} borderColor="#ffffff" height="42px" />
        </div>
      </div>
      <div className="w-full mt-[15px] lg:mt-[34px] z-10">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
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
          {liveAuctionList.map((item: any, index) => (
            <SwiperSlide key={index}>
              <LiveAuctionCard
                data={item}
                onClick={() => router.push('/live-auction?id=' + item.token_id)}
                key={index}
              />
            </SwiperSlide>
          ))}
        </Swiper>
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
}

export default LiveAuctionSection

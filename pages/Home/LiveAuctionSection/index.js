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

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'

// json
import LiveAuctionList from 'assets/json/live-auction.json'

// styles
import styles from './index.module.scss'

const LiveAuctionSection = props => {
  const { viewport } = props
  const router = useRouter()

  const [liveAuctionList, setLiveAuctionList] = useState([])
  const [auctionList, setAuctionList] = useState([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (viewport === 'sm' || viewport === 'md') {
      let newList = []
      let tempItem = []
      LiveAuctionList.map((item, index) => {
        tempItem.push(item)
        if (index % 2 === 1) {
          newList.push(tempItem)
          tempItem = []
        }
      })
      if (tempItem.length > 0) newList.push(tempItem)
      setLiveAuctionList(newList)
    } else {
      setAuctionList(LiveAuctionList)
    }
  }, [viewport])

  const handleChangeActive = value => {
    setActive(value)

    if (viewport === 'sm' || viewport === 'md') {
      let newList = []
      let tempItem = []
      LiveAuctionList.map((item, index) => {
        tempItem.push(item)
        if (index % 3 === 2) {
          newList.push(tempItem)
          tempItem = []
        }
      })
      if (tempItem.length > 0) newList.push(tempItem)

      switch (value) {
        case 0:
          setLiveAuctionList(newList.slice(0, 1))
          break
        case 1:
          setLiveAuctionList(newList.slice(0, 2))
          break
        case 2:
          setLiveAuctionList(newList.slice(0, 3))
          break
        default:
          setLiveAuctionList(newList)
          break
      }
    } else {
      switch (value) {
        case 0:
          setAuctionList(LiveAuctionList.slice(0, 5))
          break
        case 1:
          setAuctionList(LiveAuctionList.slice(0, 10))
          break
        case 2:
          setAuctionList(LiveAuctionList.slice(0, 15))
          break
        default:
          setAuctionList(LiveAuctionList)
          break
      }
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles.topLeftEllipse} />
      <div className={styles.topLeftEllipse}>
        <Image src={EllipseGreen} alt="" />
      </div>
      <div className="w-full flex justify-between items-center z-10">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
          <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Live Auctions</div>
          <div className="hidden lg:flex z-10">
            <Button
              label="Recently Started"
              onClick={() => handleChangeActive(0)}
              color={active === 0 ? '#ffffff' : '#979EA2'}
              backgroundColor={active === 0 ? '#5ac3ba' : 'transparent'}
            />
            <Button
              label="Ending Soon"
              onClick={() => handleChangeActive(1)}
              color={active === 1 ? '#ffffff' : '#979EA2'}
              backgroundColor={active === 1 ? '#5ac3ba' : 'transparent'}
            />
            <Button
              label="All"
              onClick={() => handleChangeActive(2)}
              color={active === 2 ? '#ffffff' : '#979EA2'}
              backgroundColor={active === 2 ? '#5ac3ba' : 'transparent'}
            />
          </div>
        </div>
        <div className="hidden lg:flex z-10">
          <OutlineButton label="See More" onClick={() => router.push('/see-more')} borderColor="#ffffff" />
        </div>
      </div>
      <div className="w-full mt-[15px] lg:mt-[34px] z-10">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          slidesPerView={viewport === 'sm' || viewport === 'md' ? 2 : viewport === 'lg' ? 3 : 4}
          spaceBetween={viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40}
          modules={[Autoplay, Lazy, Navigation]}
          className="navigationSwiper"
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {viewport === 'sm' || viewport === 'md'
            ? liveAuctionList.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="flex flex-wrap gap gap-[11px] lg:gap-[20px] xl:gap-[34px]">
                    {item.map((liveAuctionItem, liveAuctionIndex) => (
                      <LiveAuctionCard
                        image={liveAuctionItem.image}
                        nftName={liveAuctionItem.nftName}
                        artistName={liveAuctionItem.artistName}
                        icon={liveAuctionItem.icon}
                        count={liveAuctionItem.count}
                        endsIn={liveAuctionItem.endsIn}
                        viewport={viewport}
                        key={liveAuctionIndex}
                      />
                    ))}
                  </div>
                </SwiperSlide>
              ))
            : auctionList.map((item, index) => (
                <SwiperSlide key={index}>
                  <LiveAuctionCard
                    image={item.image}
                    nftName={item.nftName}
                    artistName={item.artistName}
                    icon={item.icon}
                    count={item.count}
                    endsIn={item.endsIn}
                    viewport={viewport}
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
            onClick={() => router.push('/see-more')}
            borderColor="#ffffff"
            size="h40"
          />
        </div>
      </div>
    </section>
  )
}

export default LiveAuctionSection

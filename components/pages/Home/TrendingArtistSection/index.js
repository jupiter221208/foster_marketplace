import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { useSelector } from 'react-redux'
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import Button from 'components/Button'
import OutlineButton from 'components/Button/OutlineButton'
import TrendingArtistCard from 'components/Card/TrendingArtistCard'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'

// json
import TrendingArtistList from 'assets/json/trending-artist.json'

// styles
import styles from './index.module.scss'

const TrendingArtistSection = props => {
  const { viewport } = props
  const router = useRouter()

  const [trendingList, setTrendingList] = useState([])

  const [active, setActive] = useState(0)

  useEffect(() => {
    setTrendingList(TrendingArtistList)
  }, [])

  const handleChangeActive = value => {
    setActive(value)

    switch (value) {
      case 0:
        setTrendingList(TrendingArtistList.slice(0, 5))
        break
      case 1:
        setTrendingList(TrendingArtistList.slice(0, 10))
        break
      case 2:
        setTrendingList(TrendingArtistList.slice(0, 15))
        break
      default:
        setTrendingList(TrendingArtistList)
        break
    }
  }

  return (
    <section className={styles.container}>
      <div className="w-full flex justify-between items-center z-10">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
          <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Top Rated Artists</div>
          <div className="hidden lg:flex z-10">
            <Button
              label="24 hrs"
              onClick={() => handleChangeActive(0)}
              color={active === 0 ? '#000000' : '#979EA2'}
              backgroundColor={active === 0 ? '#5ac3ba' : 'transparent'}
            />
            <Button
              label="7 days"
              onClick={() => handleChangeActive(1)}
              color={active === 1 ? '#000000' : '#979EA2'}
              backgroundColor={active === 1 ? '#5ac3ba' : 'transparent'}
            />
            <Button
              label="30 days"
              onClick={() => handleChangeActive(2)}
              color={active === 2 ? '#000000' : '#979EA2'}
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
          slidesPerView={
            viewport === 'xs'
              ? 2
              : viewport === 'sm'
              ? 2.8
              : viewport === 'md'
              ? 3
              : viewport === 'lg'
              ? 4
              : viewport === 'xl'
              ? 5
              : 6
          }
          spaceBetween={
            viewport === 'xs' || viewport === 'sm' || viewport === 'md'
              ? 16
              : viewport === 'lg'
              ? 20
              : viewport === 'xl'
              ? 24
              : 30
          }
          modules={[Autoplay, Lazy, Navigation]}
          className="navigationSwiper"
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {trendingList.length !== 0 &&
            trendingList.map((item, index) => (
              <SwiperSlide key={index}>
                <TrendingArtistCard
                  image={item.image}
                  name={item.name}
                  nfts={item.nfts}
                  collections={item.collections}
                  onClick={() => router.push('/artist-profile')}
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

export default TrendingArtistSection

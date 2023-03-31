import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

import Marquee from 'react-fast-marquee'

import EllipseGreen from 'assets/icons/ellipse-green.svg?component'

// components
import OutlineButton from 'components/Button/OutlineButton'
import Button from 'components/Button'
import TrendingCollectionCard from 'components/Card/TrendingCollectionCard'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'

const TrendingCollectionSection = props => {
  const { category } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [allTrendingList, setAllTrendingList] = useState<any[]>([])
  const [trendingList, setTrendingList] = useState<any[]>([])
  const [active, setActive] = useState<any>(0)

  const handleChangeActive = value => {
    setActive(value)

    switch (value) {
      case 0:
        setTrendingList(allTrendingList.slice(0, 3))
        break
      case 1:
        setTrendingList(allTrendingList.slice(0, 10))
        break
      case 2:
        setTrendingList(allTrendingList.slice(0, 15))
        break
      default:
        setTrendingList(allTrendingList)
        break
    }
  }

  useEffect(() => {
    setAllTrendingList([])
    setTrendingList([])
    dashboardAPI.getTrendingCollections(category).then(
      response => {
        if (response instanceof Array) {
          setAllTrendingList(response)
          setTrendingList(response)
        }
      },
      error => {
        console.log(error)
      }
    )
  }, [category])

  return (
    <section className={styles.container}>
      <div className={styles.topRightEllipse}>
        {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
      </div>
      <div className="w-full flex justify-between items-center z-10">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
          {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
            <div className="w-full flex justify-center items-center z-10 lg:mt-[5px]">
              <div className={styles.title}>Trending Collections</div>
            </div>
          ) : (
            <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Trending Collections</div>
          )}
          {/* <div className="hidden lg:flex z-10">
            <Button
              label="24 hrs"
              onClick={() => handleChangeActive(0)}
              color={active === 0 ? '#000' : '#979EA2'}
              backgroundColor={active === 0 ? '#5ac3ba' : 'transparent'}
            />
            <Button
              label="7 days"
              onClick={() => handleChangeActive(1)}
              color={active === 1 ? '#000' : '#979EA2'}
              backgroundColor={active === 1 ? '#5ac3ba' : 'transparent'}
            />
            <Button
              label="30 days"
              onClick={() => handleChangeActive(2)}
              color={active === 2 ? '#000' : '#979EA2'}
              backgroundColor={active === 2 ? '#5ac3ba' : 'transparent'}
            />
          </div> */}
        </div>
        <div className="hidden lg:flex z-10">
          <OutlineButton
            label="See More"
            onClick={() => router.push('/explore')}
            borderColor={'var(--see-more-border)'}
            borderWidth={2}
            height="42px"
          />
        </div>
      </div>
      <div className="w-full mt-[15px] lg:mt-[34px] z-10 pb-[0px] lg:pb-[30px]">
        {trendingList !== null && trendingList !== undefined && trendingList.length !== 0 && (
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={viewport === 'xs' ? 1.2 : viewport === 'sm' || viewport === 'md' ? 2 : 3.02}
            spaceBetween={
              viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40
            }
            modules={[Autoplay, Lazy, Navigation]}
            className="navigationSwiper"
            loop
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
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
      <div className="w-full flex lg:hidden justify-center">
        <div className="w-full max-w-[242px] z-10">
          <OutlineButton
            label="See More"
            fullWidth
            onClick={() => {
              dispatch({ type: 'set', exploreTab: 1 })
              router.push('/explore')
            }}
            borderColor={'var(--see-more-border)'}
            height="40px"
          />
        </div>
      </div>
    </section>
  )
}

export default TrendingCollectionSection

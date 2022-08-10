import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import CollectionCard from 'components/Card/CollectionCard'
import ActivityTable from 'components/Table/ActivityTable'

// json
import ActivityList from 'assets/json/browse-collection/activity-list.json'

// styles
import styles from './index.module.scss'

const ActivitySection = props => {
  const { viewport } = props
  const router = useRouter()

  const [activityList, setActivityList] = useState([])

  useEffect(() => {
    let newList = []
    let tempItem = []
    ActivityList.map((item, index) => {
      tempItem.push(item)
      if (index % 10 === 9) {
        newList.push(tempItem)
        tempItem = []
      }
    })
    if (tempItem.length > 0) newList.push(tempItem)
    setActivityList(newList)
  }, [])

  return (
    <section className={styles.container}>
      <div className="w-full z-10">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          centeredSlides={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? true : false}
          slidesPerView={1}
          spaceBetween={0}
          modules={[Autoplay, Lazy, Navigation]}
          className="showNavigationSwiper"
          loop
        >
          {activityList.length !== 0 &&
            activityList.map((item, index) => (
              <SwiperSlide key={index}>
                <ActivityTable data={item} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  )
}

export default ActivitySection

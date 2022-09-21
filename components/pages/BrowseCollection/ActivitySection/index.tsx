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
import ActivityTable from 'components/Table/ActivityTable'
import ActivityAccordion from 'components/Accordion/ActivityAccordion'

// json
import ActivityList from 'assets/json/browse-collection/activity-list.json'

const ActivitySection = props => {
  const { viewport } = props
  const router = useRouter()

  const [activityList, setActivityList] = useState<any[]>([])

  useEffect(() => {
    let newList: any[] = []
    let tempItem: any[] = []
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
    <section className="w-full mt-6 lg:mt-12">
      <div className="w-full z-10">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          centeredSlides={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? true : false}
          slidesPerView={1}
          spaceBetween={4}
          modules={[Autoplay, Lazy, Navigation]}
          className="showNavigationSwiper"
          loop
        >
          {viewport === 'lg' || viewport === 'xl' || viewport === '2xl'
            ? activityList.length !== 0 &&
              activityList.map((item, index) => (
                <SwiperSlide key={index}>
                  <ActivityTable data={item} viewport={viewport} />
                </SwiperSlide>
              ))
            : activityList.length !== 0 &&
              activityList.map((item, index) => (
                <SwiperSlide key={index}>
                  <ActivityAccordion data={item} viewport={viewport} />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </section>
  )
}

export default ActivitySection

import React, { useEffect, useState } from 'react'

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

// custom functions
import { useViewport } from 'utils'

// api
import ActivityAPI from 'apis/activity'

const ActivitySection = props => {
  const { collectionId } = props
  const viewport = useViewport()

  const [activityList, setActivityList] = useState<any[]>([])

  useEffect(() => {
    ActivityAPI.getCollectionActivity(collectionId).then(
      response => {
        let newList: any[] = []
        let tempItem: any[] = []
        response.reverse().map((item, index) => {
          tempItem.push(item)
          if (index % 10 === 9) {
            newList.push(tempItem)
            tempItem = []
          }
        })
        if (tempItem.length > 0) newList.push(tempItem)
        setActivityList(newList)
      },
      error => {}
    )
  }, [])

  return (
    <section className="w-full mt-6 lg:mt-12">
      <div className="w-full z-10">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
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
                  <ActivityTable data={item} type={'collection'} />
                </SwiperSlide>
              ))
            : activityList.length !== 0 &&
              activityList.map((item, index) => (
                <SwiperSlide key={index}>
                  <ActivityAccordion data={item} />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </section>
  )
}

export default ActivitySection

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
import LoadingModal from 'components/Modal/LoadingModal'
import LoadingComponent from 'pages/explore/LoadingComponent'
import NoDataSection from 'components/pages/Dashboard/NoDataSection'

const ActivitySection = props => {
  const { collectionId } = props
  const [loading, setLoading] = useState(false)
  const viewport = useViewport()
  const [allList, setAllList] = useState<any[]>([])
  const [activityList, setActivityList] = useState<any[]>([])
  const [rowCount, setRowCount] = useState(10)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)

  useEffect(() => {
    ActivityAPI.getCollectionActivity(collectionId).then(
      response => {
        let tempItem: any[] = []
        response.reverse().map((item, index) => {
          tempItem.push(item)
        })
        setAllList(tempItem)
        setActivityList(tempItem.slice(0, rowCount))
        if (tempItem.length > rowCount) setIsVisibleFetching(true)
        setLoading(true)
      },
      error => {}
    )
  }, [collectionId])

  useEffect(() => {
    if (isFetching) {
      setIsFetching(false)
      if (activityList.length + rowCount > allList.length) {
        setActivityList([...activityList, ...allList.slice(activityList.length, allList.length)])
        setIsVisibleFetching(false)
      } else {
        setActivityList([...activityList, ...allList.slice(activityList.length, activityList.length + rowCount)])
        setIsVisibleFetching(true)
      }
    }
  }, [isFetching])

  return (
    <section className="w-full mt-6 lg:mt-12">
      <div className="w-full z-10">
        {loading === false ? (
          <div className="col-span-12">
            <LoadingModal open={!loading} />
          </div>
        ) : activityList.length > 0 ? (
          <div>
            {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
              <ActivityTable data={activityList} type={'dashboard'} />
            ) : (
              <ActivityAccordion data={activityList} />
            )}
            {isVisibleFetching && (
              <div className="w-full mt-[-50px] mb-[40px]">
                <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
              </div>
            )}
          </div>
        ) : (
          <div className="mt-[40px] lg:mt-[110px]">
            <NoDataSection
              title="No activity history available"
              description="This tab displays a log of all your activity on Foster Marketplace"
            />
          </div>
        )}
        {/* <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          slidesPerView={1}
          spaceBetween={4}
          modules={[Autoplay, Lazy, Navigation]}
          className="showNavigationSwiper"
          // loop
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
        </Swiper> */}
      </div>
    </section>
  )
}

export default ActivitySection

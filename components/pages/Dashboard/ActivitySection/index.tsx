import React, { useEffect, useState } from 'react'

// third party components
import { useWallet } from '@solana/wallet-adapter-react'

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
import NoDataSection from '../NoDataSection'
import LoadingComponent from 'pages/explore/LoadingComponent'
import LoadingModal from 'components/Modal/LoadingModal'
import { ActivityAPIData, NftData } from 'types/nft'

const ActivitySection = () => {
  const viewport = useViewport()
  const [loading, setLoading] = useState(false)
  const [rowCount, setRowCount] = useState(10)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)
  const [activityList, setActivityList] = useState<ActivityAPIData[]>([])
  const [allList, setAllList] = useState<ActivityAPIData[]>([])
  const { publicKey } = useWallet()

  useEffect(() => {
    ActivityAPI.getUserActivity(publicKey?.toBase58()).then(response => {
      if (response.length === 0) return
      let tempItem: ActivityAPIData[] = []
      response.reverse().map((item, index) => {
        tempItem.push(item)
      })
      setAllList(tempItem)
      setActivityList(tempItem.slice(0, rowCount))
      if (tempItem.length > rowCount) setIsVisibleFetching(true)
      setLoading(true)
    })
  }, [publicKey])

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
    <section className="w-full mt-6 lg:mt-[20px]">
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
      </div>
    </section>
  )
}

export default ActivitySection

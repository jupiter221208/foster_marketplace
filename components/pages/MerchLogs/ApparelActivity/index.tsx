import React, { useEffect, useState } from 'react'

// components
import TableSections from './TableSection'
import CreatorSearchSection from '../CreatorSearchSection'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// json

// functions

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'

const ApparelActivity = props => {
  const { activities, pendingList, allList, type, isLoading } = props

  const [searchWord, setSearchWord] = useState<any>('')
  const [filter, setFilter] = useState(0)
  const [list, setList] = useState<any[]>([])

  // useEffect(() => {
  //   setActivityList()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isLoading, filter])

  // const setActivityList = () => {
  //   if (filter === 0) setList(activities)
  //   else if (filter === 1) setList(pendingList)
  //   else setList(allList)
  // }

  // useEffect(() => {
  //   let length = searchWord?.length
  //   let searchData = []
  //   if (length > 0) {
  //     if (filter === 0) searchData = activities
  //     else if (filter === 1) searchData = pendingList
  //     else searchData = allList
  //     const results = searchData.filter(({ id }) => {
  //       return id.toString().includes(searchWord.toLowerCase())
  //     })
  //     setList(results)
  //   } else {
  //     if (length === 0) {
  //       setActivityList()
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchWord])

  return (
    <div className={styles.container}>
      {/* <div className="hidden lg:block">
        {activities.length > 0 && (
          <CreatorSearchSection
            placeholder={'Search'}
            searchWord={searchWord}
            setSearchWord={value => setSearchWord(value.toString())}
            onFilter={value => setFilter(value)}
          />
        )}
      </div> */}

      {activities.length > 0 && (
        <div className="mt-[10px]">
          <TableSections data={activities} type={type} />
        </div>
      )}

      {!isLoading && activities?.length === 0 && searchWord.length === 0 && (
        <div className="w-full mt-[50px] lg:mt-[0px]">
          {type === 'purchases' ? (
            <div className="w-full mt-[50px] lg:mt-[0px]">
              <div className={styles.noArtwork}>No order history detected</div>
              <div className={styles.text}>Explore merch from your favorite artists </div>
              <div className="w-full flex justify-center mt-[30px]">
                <GradientButton label="Shop Studio" width={144} height={54} borderRadius={30} onClick={() => {}} />
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.noArtwork}>No results found</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ApparelActivity

import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// components
import SearchSection from '../SearchSection'
import CollectionSection from './CollectionSection'
import TableSections from './TableSection'

// json
import CreatorsList from 'assets/json/stats/creators-list.json'
import PopularCategoryList from 'assets/json/popular-category.json'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// functions
import { stringLengthValidate } from 'utils/strings'
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

//apis
import StatsAPI from 'apis/stats'
import StatsArtistCard from 'components/Card/StatsArtistCard'
import ExplorePagination from 'components/Button/ExplorePagination'

const CreatorsSection = () => {
  const dispatch = useDispatch()
  const [searchWord, setSearchWord] = useState<any>('')
  const [creatorsList, setCreatorsList] = useState<any[]>([])
  const [allList, setAllList] = useState<any[]>([])
  const [list, setList] = useState<any[]>([])
  const viewport = useViewport()
  const [period, setPeriod] = useState('all')
  const [screenWidth, setScreenWidth] = useState(1920)
  const [isMounted, setIsMounted] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [rowCount, setRowCount] = useState(12)
  const [totalCount, setTotalCount] = useState(0)
  const [feedList, setFeedList] = useState([])

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    let nfts = [
      {
        id: 0,
        pfp_url: 'https://arweave.net/thumb2',
        purchase_volume: 0,
        creator_name: ' ',
      },
      {
        id: 1,
        pfp_url: 'https://arweave.net/thumb2',
        purchase_volume: 0,
        creator_name: ' ',
      },
      {
        id: 2,
        pfp_url: 'https://arweave.net/thumb2',
        purchase_volume: 0,
        creator_name: ' ',
      },
      {
        id: 3,
        pfp_url: 'https://arweave.net/thumb2',
        purchase_volume: 0,
        creator_name: ' ',
      },
    ]
    setFeedList(nfts)
  }, [])

  useEffect(() => {
    const resizeFunction = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  useEffect(() => {
    getCreatorData(currentPage, period, searchWord, rowCount)
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    getCreatorData(currentPage, period, searchWord, rowCount)
  }, [period])

  const getSearchData = () => {
    getCreatorData(currentPage, period, searchWord, rowCount)
  }

  const getCreatorData = (curPage, curDate, search, count) => {
    dispatch({ type: 'set', isLoading: true })
    StatsAPI.getStatsCreator({
      period: curDate,
      search: search?.length === 0 ? null : search,
      page: curPage + 1,
      per_page: count,
    }).then(
      respone => {
        dispatch({ type: 'set', isLoading: false })
        const nfts = respone
        setCurrentPage(curPage)
        setTotalCount(count * curPage + nfts.length)
        setList(nfts)
        if (feedList.length === 0) setFeedList(nfts)
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      },
      error => {
        dispatch({ type: 'set', isLoading: false })
      }
    )
  }

  const selectRowCount = count => {
    setRowCount(count)
    getCreatorData(currentPage, period, searchWord, count)
  }

  const handleNextPage = () => {
    if (totalCount < (currentPage + 1) * rowCount) return
    const nextPage = currentPage + 1
    getCreatorData(nextPage, period, searchWord, rowCount)
  }

  const handlePreviousPage = () => {
    if (currentPage === 0) return
    const prevPage = currentPage - 1
    getCreatorData(prevPage, period, searchWord, rowCount)
  }

  return (
    <div className={styles.container}>
      <div className="w-full mb-0 lg:mb-20 lg:mt-[25px]">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          slidesPerView={
            viewport === 'xs'
              ? 2
              : viewport === 'sm'
              ? 2.5
              : viewport === 'md'
              ? 3
              : viewport === 'lg'
              ? 3
              : viewport === 'xl'
              ? screenWidth >= 1400
                ? 4
                : 3.7
              : viewport === '2xl'
              ? screenWidth >= 1768
                ? 5
                : 4
              : 3
          }
          spaceBetween={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 20 : viewport === 'lg' ? 20 : 32}
          modules={[Autoplay, Lazy, Navigation]}
          className="hideNavigationSwiper"
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {feedList.map((item, index) => (
            <SwiperSlide key={index}>
              <StatsArtistCard data={item} type="creators" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <SearchSection
        searchWord={searchWord}
        setSearchWord={value => setSearchWord(value.toString())}
        period={period}
        setPeriod={setPeriod}
        onSearch={() => getSearchData()}
      />

      <div className="mt-[20px]">
        <TableSections data={list} />
      </div>

      <div className="w-full flex justify-end">
        <ExplorePagination
          currentPage={currentPage}
          totalCount={totalCount}
          rowCount={rowCount}
          setRowCount={count => {
            selectRowCount(count)
          }}
          handleNext={handleNextPage}
          handlePrev={handlePreviousPage}
        />
      </div>
    </div>
  )
}

export default CreatorsSection

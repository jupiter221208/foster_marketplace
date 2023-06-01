import React, { useEffect, useState } from 'react'

// components
import SearchSection from '../SearchSection'
import TableSections from './TableSection'

import { useDispatch } from 'react-redux'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

import ExplorePagination from 'components/Button/ExplorePagination'
import StatsCollectionCard from 'components/Card/StatsCollectionCard'
// import Marquee from 'react-fast-marquee'
import { useViewport } from 'utils'

// json

// functions

// styles
import styles from './index.module.scss'

// apis
import StatsAPI from 'apis/stats'

const ArtworksSection = props => {
  const { artworks } = props
  const dispatch = useDispatch()
  const viewport = useViewport()

  const [isMounted, setIsMounted] = useState(false)
  const [searchWord, setSearchWord] = useState<any>(null)
  const [list, setList] = useState<any[]>([])
  const [feedList, setFeedList] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [rowCount, setRowCount] = useState(12)
  const [period, setPeriod] = useState('all')
  const [screenWidth, setScreenWidth] = useState(1920)

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    let nfts = [
      {
        id: 0,
        asset_url: ' ',
        amount: ' ',
        asset_name: ' ',
      },
      {
        id: 1,
        asset_url: ' ',
        amount: ' ',
        asset_name: ' ',
      },
      {
        id: 2,
        asset_url: ' ',
        amount: ' ',
        asset_name: ' ',
      },
      {
        id: 3,
        asset_url: ' ',
        amount: ' ',
        asset_name: ' ',
      },
    ]
    setFeedList(nfts)
  }, [])

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    setFeedList(artworks)
    setList(artworks)
    setTotalCount(12)
    setIsMounted(true)
  }, [artworks])

  useEffect(() => {
    const resizeFunction = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  // useEffect(() => {
  //   getArtworkData(currentPage, period, searchWord, rowCount)
  //   setIsMounted(true)
  // }, [])

  useEffect(() => {
    if (!isMounted) return
    getArtworkData(currentPage, period, searchWord, rowCount)
  }, [period])

  const getSearchData = () => {
    getArtworkData(currentPage, period, searchWord, rowCount)
  }

  const getArtworkData = (curPage, curDate, search, count) => {
    console.log('=======getArtworkData========')
    dispatch({ type: 'set', isLoading: true })
    StatsAPI.getStatsArtwork({
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
        console.log(nfts)
        setList(nfts)
        if (feedList.length === 0) setFeedList(nfts)
        window.scrollTo({
          top: viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 400 : 800,
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
    getArtworkData(currentPage, period, searchWord, count)
  }

  const handleNextPage = () => {
    if (totalCount < (currentPage + 1) * rowCount) return
    const nextPage = currentPage + 1
    getArtworkData(nextPage, period, searchWord, rowCount)
  }

  const handlePreviousPage = () => {
    if (currentPage === 0) return
    const prevPage = currentPage - 1
    getArtworkData(prevPage, period, searchWord, rowCount)
  }

  return (
    <div className={styles.container}>
      <div className="w-full mb-0 lg:mb-20 lg:mt-[25px]">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          slidesPerView={
            viewport === 'xs'
              ? 1.6
              : viewport === 'sm'
              ? 2.5
              : viewport === 'md'
              ? 2.9
              : viewport === 'lg'
              ? 2.5
              : viewport === 'xl'
              ? screenWidth >= 1300
                ? 3
                : 2.8
              : viewport === '2xl'
              ? screenWidth >= 1768
                ? 4
                : 3.5
              : 4
          }
          spaceBetween={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 25}
          modules={[Autoplay, Lazy, Navigation]}
          className="navigationSwiper"
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {feedList.map((item: any, index) => (
            <SwiperSlide key={index}>
              <StatsCollectionCard key={index} data={item} type="artworks" />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* <Marquee
          gradient={false}
          pauseOnHover={false}
          pauseOnClick={true}
          speed={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 10 : viewport === 'lg' ? 30 : 30}
        >
          <div className="w-full flex gap-4 lg:gap-7 mx-[10px] lg:mx-5">
            {feedList.map((item: any, index) => (
              <StatsCollectionCard key={index} data={item} type="artworks" />
            ))}
          </div>
        </Marquee> */}

        {/* <CollectionSection list={feedList} /> */}
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

export default ArtworksSection

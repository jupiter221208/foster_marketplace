import React, { useEffect, useState } from 'react'

// components
import SearchSection from '../SearchSection'
import TableSections from './TableSection'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// json

// functions

// styles
import styles from './index.module.scss'

// apis
import StatsAPI from 'apis/stats'
import LoadingModal from 'components/Modal/LoadingModal'
import LoadingComponent from 'pages/profile/LoadingComponent'
import LoadingElement from 'pages/profile/LoadingComponent/LoadingElement'

const ArtworksSection = props => {
  const { artworks } = props

  const [isMounted, setIsMounted] = useState(false)
  const [searchWord, setSearchWord] = useState<any>(null)
  const [list, setList] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [rowCount, setRowCount] = useState(12)
  const [period, setPeriod] = useState('all')
  const [screenWidth, setScreenWidth] = useState(1920)
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)

  useEffect(() => {
    setScreenWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    if (artworks.length > 0) {
      setTimeout(() => {
        setLoading(false)
        setScreenWidth(window.innerWidth)
        setList(artworks)
        setIsMounted(true)
        setIsVisibleFetching(true)
      }, 1000)
    }
  }, [artworks])

  useEffect(() => {
    const resizeFunction = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  useEffect(() => {
    if (isFetching === true) {
      handleNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching])

  useEffect(() => {
    if (!isMounted) return
    setSearchLoading(true)
    setIsVisibleFetching(false)
    getArtworkData(currentPage, period, searchWord, rowCount, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period])

  const getArtworkData = (curPage, curDate, search, count, reset = false) => {
    let page = curPage
    if (reset === true) page = 0
    StatsAPI.getStatsArtwork({
      period: curDate,
      search: search?.length === 0 ? null : search,
      page: page + 1,
      per_page: count,
    }).then(
      response => {
        setIsFetching(false)
        setSearchLoading(false)
        const nfts = response.filter(item => item.asset_url !== '')
        setCurrentPage(curPage)

        if (reset === true) setList(nfts)
        else setList([...list, ...nfts])

        if (response.length === rowCount) setIsVisibleFetching(true)
        else setIsVisibleFetching(false)
      },
      error => {
        setIsFetching(false)
        setIsVisibleFetching(false)
      }
    )
  }

  const handleNextPage = () => {
    const nextPage = currentPage + 1
    getArtworkData(nextPage, period, searchWord, rowCount)
  }

  return (
    <div className={styles.container}>
      {loading && (
        <div className="mt-[100px]">
          <LoadingElement text="Loading artworks" />
        </div>
      )}

      {!loading && (
        <div className="w-full mt-[25px]">
          <SearchSection
            placeholder={'Search by artwork name'}
            searchWord={searchWord}
            setSearchWord={value => setSearchWord(value.toString())}
            period={period}
            setPeriod={setPeriod}
          />
        </div>
      )}

      {!loading && searchLoading && !isVisibleFetching && (
        <div className="mt-[-40px] lg:mt-[40px] mb-[80px] lg:mb-[160px]">
          <LoadingElement text="Loading artworks" />
        </div>
      )}

      {!searchLoading && list.length > 0 && (
        <div className="mt-[20px]">
          <TableSections data={list} />
        </div>
      )}

      {!loading && !searchLoading && list.length === 0 && <div className={styles.result}>No results found</div>}

      {isMounted && isVisibleFetching && (
        <div className="w-full mt-[-40px] lg:mt-[40px] mb-[80px] lg:mb-[160px]">
          <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} text="Loading artworks" />
        </div>
      )}
    </div>
  )
}

export default ArtworksSection

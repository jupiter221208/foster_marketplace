import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import LoadingComponent from 'pages/explore/LoadingComponent'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// api
import dashboardAPI from 'apis/dashboard'
import NFTCard from 'components/Card/NFTCard'

const ActiveListingSection = props => {
  const { artist = '', fromPage = '', loadCompleted = null } = props

  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [exploreList, setExploreList] = useState([])
  const [page, setPage] = useState(1)

  const [isMounted, setIsMounted] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)
  const [rowCount, setRowCount] = useState(8)

  useEffect(() => {
    dashboardAPI.getMarketplaceReleases('', artist, page).then(response => {
      if (loadCompleted) loadCompleted()
      setIsMounted(true)
      setIsFetching(false)

      if (response.length === rowCount) {
        setIsFetching(true)
        setIsVisibleFetching(true)
      } else setIsVisibleFetching(false)
      setExploreList([...exploreList, ...response])
    })
    error => {
      if (loadCompleted) loadCompleted()
      setIsMounted(true)
      setIsFetching(false)
      setIsVisibleFetching(false)

      console.log(error)
    }
  }, [artist])

  const getExploreList = nextpage => {
    dashboardAPI.getMarketplaceReleases('', artist, nextpage).then(response => {
      if (loadCompleted) loadCompleted()
      setIsMounted(true)
      setIsFetching(false)

      if (response.length === rowCount) setIsVisibleFetching(true)
      else setIsVisibleFetching(false)
      setExploreList([...exploreList, ...response])
    })
    error => {
      if (loadCompleted) loadCompleted()
      setIsMounted(true)
      setIsFetching(false)
      setIsVisibleFetching(false)
      console.log(error)
    }
  }

  useEffect(() => {
    if (isFetching) {
      setTimeout(() => {
        const nextpage = page + 1
        setPage(nextpage)
        getExploreList(nextpage)
      }, 2000)
    }
  }, [isFetching])

  return (
    exploreList.length !== 0 && (
      <section
        className={`${styles.container} ${
          fromPage === 'profile' ? 'mt-[10px] lg:mt-[20px]' : 'mt-[60px] lg:mt-[86px]'
        }`}
      >
        <div className={styles.topLeftEllipse} />
        <div className="w-full flex justify-between items-center z-10">
          <div
            className={`${
              fromPage === 'profile' ? 'justify-start' : 'justify-center'
            } w-full lg:w-auto flex items-center gap-4 lg:gap-8`}
          ></div>
        </div>
        <div className="w-full mt-[15px] lg:mt-[34px] z-10">
          <div className="grid sm:grid-cols-4 grid-cols-2 gap gap-[11px] lg:gap-[20px] xl:gap-[34px]">
            {exploreList.map((item, index) => (
              <div key={index}>
                <NFTCard
                  token_id={item.token_id}
                  image={item.asset_url}
                  nftName={item.nft_name}
                  assetType={item.asset_type}
                  coverImage={item.cover_image_url}
                  artistName={item.artist_username}
                  collectionName={item.collection_name}
                  price={item.list_price}
                  onClick={() => {
                    dispatch({ type: 'set', isLoading: true })
                    router.push(`/nft/${item.token_id}`)
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        {isMounted && isVisibleFetching && (
          <div className="w-full mt-[20px]">
            <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
          </div>
        )}
      </section>
    )
  )
}

export default ActiveListingSection

import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'

// swiper

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import NFTCard from 'components/Card/NFTCard'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'
import ArrowRightGreenIcon from 'assets/icons/arrow-right-white-medium.svg?component'

// call apis
import dashboardAPI from 'apis/dashboard'
import SeeMoreButton from 'components/Button/SeeMoreButton'
import { DashboardAPIData } from 'types/nft'

const MarketplaceReleaseSection = props => {
  const { category } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [marketplaceReleaseList, setMarketplaceReleaseList] = useState<DashboardAPIData[]>([])
  const [allMarketplaceReleaseList, setAllMarketplaceReleaseList] = useState<DashboardAPIData[]>([])
  const [page, setPage] = useState(1)

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    if (marketplaceReleaseList.length > 0) {
      ;(async () => {
        for (let index = 0; index < marketplaceReleaseList.length; index++) {
          let data = marketplaceReleaseList[index]
          fetch(`/nft/${data.token_id}`).then(e => e.text())
          if (index % 4 == 3) {
            await sleep(1000)
          }
        }
      })()
    }
  }, [marketplaceReleaseList, router])

  useEffect(() => {
    setAllMarketplaceReleaseList([])
    dashboardAPI.getMarketplaceReleases(category, '', page, 13).then(response => {
      if (response !== null && response !== undefined && response.length !== 0) {
        setAllMarketplaceReleaseList(response.slice(5, response.length))
      }
    }),
      error => {
        console.log(error)
      }
  }, [category])

  useEffect(() => {
    if (allMarketplaceReleaseList.length === 0) return
    setMarketplaceReleaseList(allMarketplaceReleaseList)
  }, [viewport, allMarketplaceReleaseList])

  return (
    marketplaceReleaseList.length !== 0 && (
      <section className={styles.container}>
        <div className="w-full flex justify-between items-center z-10">
          <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full flex justify-between items-center z-10">
                <div className={styles.title}>New Releases</div>
                <div className="flex gap-[8px] items-center">
                  <div
                    className={styles.seeMore}
                    onClick={() => {
                      dispatch({ type: 'set', exploreTab: 0 })
                      dispatch({ type: 'set', availabilityFilter: 0 })
                      dispatch({ type: 'set', artworkCategory: category })
                      router.push('/explore')
                    }}
                  >
                    See More
                  </div>
                  <ArrowRightGreenIcon alt="" />
                </div>
              </div>
            ) : (
              <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>New Releases</div>
            )}
          </div>
          <div className="hidden lg:flex z-10">
            <SeeMoreButton
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 0 })
                dispatch({ type: 'set', availabilityFilter: 0 })
                dispatch({ type: 'set', artworkCategory: category })
                router.push('/explore')
              }}
            />
          </div>
        </div>
        <div className="w-full grid grid-cols-12 gap-[20px] lg:gap-[50px] mt-[15px] lg:mt-[34px] z-10">
          {marketplaceReleaseList.map((item, index) => (
            <div key={index} className="flex col-span-6 lg:col-span-4 2xl:col-span-3 items-center">
              <NFTCard
                image={item.asset_url}
                token_id={item.token_id}
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
      </section>
    )
  )
}

export default MarketplaceReleaseSection

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

// call apis
import dashboardAPI from 'apis/dashboard'
import SeeMoreButton from 'components/Button/SeeMoreButton'
import { DashboardAPIData } from 'types/nft'
import OutlineButton from 'components/Button/OutlineButton'
import HomeNftCard from 'components/Card/HomeNFTCard'

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
    dashboardAPI.getMarketplaceReleases(category, '', page, 15).then(response => {
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
          <div className={`${styles.title}`}>New Releases</div>
          <div className="lg:block hidden">
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
        <div className="w-full grid xs:grid-cols-1 sm:grid-cols-20 gap-[18px] md:gap-[26px] lg:gap-[26px] mt-[15px] lg:mt-[23px] z-10 sm:px-[7px] lg:px-[0px]">
          {marketplaceReleaseList.map((item, index) => (
            <div
              key={index}
              className="flex xs:col-span-1 sm:col-span-10 lg:col-span-5 xl:col-span-5 2xl:col-span-4 items-center"
            >
              <HomeNftCard
                image={item.asset_url}
                token_id={item.token_id}
                nftName={item.nft_name}
                assetType={item.asset_type}
                coverImage={item.cover_image_url}
                artistName={item.artist_username}
                artistImage={item.artist_profile_picture}
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

        <div className="w-full flex sm:hidden justify-center lg:mt-0 mt-[25px]">
          <div className="w-full max-w-[300px] z-10">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 0 })
                dispatch({ type: 'set', availabilityFilter: 0 })
                dispatch({ type: 'set', artworkCategory: category })
                router.push('/explore')
              }}
              fontSize="16px"
              height="41px"
              borderRadius="8px"
            />
          </div>
        </div>
      </section>
    )
  )
}

export default MarketplaceReleaseSection

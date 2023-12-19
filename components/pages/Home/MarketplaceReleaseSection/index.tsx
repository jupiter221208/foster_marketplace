import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import OutlineButton from 'components/Button/OutlineButton'
import NFTCard from 'components/Card/NFTCard'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import SeeMoreButton from 'components/Button/SeeMoreButton'

const MarketplaceReleaseSection = props => {
  const { category } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [marketplaceReleaseList, setMarketplaceReleaseList] = useState<any[]>([])
  const [allMarketplaceReleaseList, setAllMarketplaceReleaseList] = useState<any[]>([])
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
    dashboardAPI.getMarketplaceReleases(category, '', page).then(response => {
      if (response !== null && response !== undefined && response.length !== 0) {
        setAllMarketplaceReleaseList(response)
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
              <div className="w-full flex justify-center items-center z-10">
                <div className={styles.title}>New Releases</div>
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
          {marketplaceReleaseList.map((item: any, index) => (
            <div key={index} className="flex col-span-6 lg:col-span-4 2xl:col-span-3 flex items-center">
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
        <div className="w-full flex lg:hidden justify-center lg:mt-0 mt-[15px]">
          <div className="w-full max-w-[242px] z-10">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 0 })
                dispatch({ type: 'set', availabilityFilter: 0 })
                dispatch({ type: 'set', artworkCategory: category })
                router.push('/explore')
              }}
              borderColor={'var(--see-more-border)'}
              height="40px"
            />
          </div>
        </div>
      </section>
    )
  )
}

export default MarketplaceReleaseSection

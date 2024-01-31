import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch, useSelector } from 'react-redux'

// swiper

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import StudioReleaseCard from 'components/Card/StudioReleaseCard'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// call apis
import merchAPI from 'apis/merch'

const MarketplaceReleaseSection = props => {
  const { type, heroValue } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const apparelType = useSelector<any>(state => state.apparelType)
  const [studioReleaseList, setStudioReleaseList] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(8)
  const [seed, setSeed] = useState(Math.random())
  const [refresh, setRefresh] = useState(new Date())

  useEffect(() => {
    if (type === 'trending') {
      merchAPI.getRecentOrders().then(response => {
        if (response !== null && response !== undefined && response.length !== 0) {
          let arr = Object.keys(response.nftData).map(key => response.nftData[key])
          setStudioReleaseList(arr)
        }
      }),
        error => {
          console.log(error)
        }
    } else {
      merchAPI.getRecentlyEnabledNfts(seed, page, perPage).then(response => {
        if (response !== null && response !== undefined && response.length !== 0) {
          setStudioReleaseList(response)
        }
      }),
        error => {
          console.log(error)
        }
    }
  }, [])

  return (
    studioReleaseList.length !== 0 && (
      <section className={styles.container}>
        <div className="w-full flex justify-between items-center z-10">
          <div className="w-full flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full flex justify-center items-center z-10">
                <div className={styles.title}>New Releases</div>
                {/* <div className={styles.filterButton}>
                  <div className={styles.filter}>Filter</div>
                  <FilterIcon />
                </div> */}
              </div>
            ) : (
              <div className="w-full flex flex-row justify-between">
                <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>New Studio Releases</div>
                {/* <div className={styles.filterButton}>
                  <div className={styles.filter}>Filter</div>
                  <FilterIcon />
                </div> */}
              </div>
            )}
          </div>
        </div>
        <div className="w-full grid grid-cols-12 gap-[20px] lg:gap-[50px] mt-[20px] lg:mt-[34px] z-10">
          {studioReleaseList.map((item: any, index) => (
            <div key={index} className="flex col-span-6 lg:col-span-4 2xl:col-span-3 flex items-center">
              <StudioReleaseCard
                image={heroValue.data}
                nftImage={item.nft.asset_url}
                token_id={item.nft.token_id}
                nftName={item.nft.nft_name}
                userName={item.artist.username}
                assetType={item.asset_type}
                coverImage={item.cover_image_url}
                artistName={item.artist_username}
                onClick={colorNumber => {
                  dispatch({ type: 'set', isLoading: true })
                  dispatch({ type: 'set', apparelType })
                  dispatch({ type: 'set', detailShow: true })
                  dispatch({ type: 'set', apparelColor: colorNumber })
                  router.push(`/nft/${item.nft.token_id}`)
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

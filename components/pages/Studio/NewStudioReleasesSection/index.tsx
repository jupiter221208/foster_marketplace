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
import FilterIcon from 'assets/icons/filter-icon.svg?component'

// call apis
import merchAPI from 'apis/merch'
import ApparelTypeMenu from 'components/Menu/ApparelTypeMenu'
import MobileApparelFilter from 'components/Filter/MobileApparelFilter'

const NewStudioReleasesSection = props => {
  const { type, heroValue, onChange } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const apparelType = useSelector<any>(state => state.apparelType)
  const [studioReleaseList, setStudioReleaseList] = useState<any[]>([])
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [filterName, setFilterName] = useState('Filter')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(8)
  const [seed, setSeed] = useState(Math.random())

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
        <div className="w-full relative">
          <div className="w-auto lg:w-full flex justify-start lg:justify-center items-center gap-4 lg:gap-8">
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className={styles.title}>{type === 'trending' ? 'Trending Now' : 'New Releases'}</div>
            ) : (
              <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>
                {type === 'trending' ? 'Trending Now' : 'New Releases'}
              </div>
            )}
          </div>
          <div className="hidden lg:block absolute top-[10px] right-[10px]">
            <ApparelTypeMenu base={heroValue.data['name']} onChange={onChange} setFilterName={setFilterName} />
          </div>
          <div className="block lg:hidden absolute top-[-10px] right-[0px]">
            <div className={styles.btnArea} onClick={() => setShowMobileFilter(true)}>
              {filterName}
              <FilterIcon alt="" />
            </div>
          </div>
        </div>
        <div className="w-full grid grid-cols-12 gap-[20px] lg:gap-[50px] mt-[20px] lg:mt-[34px] z-10">
          {studioReleaseList.map((item: any, index) => (
            <div
              key={index}
              className={`flex ${
                type === 'trending' ? 'col-span-12 lg:col-span-4' : 'col-span-6 lg:col-span-3'
              }  2xl:col-span-4 flex items-center`}
            >
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
        {showMobileFilter && (
          <div className="absolute left-0 top-0">
            <MobileApparelFilter
              base={heroValue.data['name']}
              setFilterName={setFilterName}
              onChange={onChange}
              onClose={() => setShowMobileFilter(false)}
            />
          </div>
        )}
      </section>
    )
  )
}

export default NewStudioReleasesSection

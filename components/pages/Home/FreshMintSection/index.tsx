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

const FreshMintSection = props => {
  const { category } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [allFreshMintsList, setAllFreshMintsList] = useState<DashboardAPIData[]>([])
  const [freshMintsList, setFreshMintsList] = useState<DashboardAPIData[]>([])
  const [cardLoop, setCardLoop] = useState(true)

  useEffect(() => {
    dashboardAPI.getFreshMints(category).then(
      response => {
        if (response !== null && response !== undefined) {
          setAllFreshMintsList(response)
          setFreshMintsList(response)
          if (response.length > 4) setCardLoop(true)
          else setCardLoop(false)
        }
      },
      error => {
        console.log(error)
      }
    )
  }, [category])

  useEffect(() => {
    if (allFreshMintsList.length === 0) return
    setFreshMintsList(allFreshMintsList)
  }, [viewport, allFreshMintsList])

  return (
    freshMintsList.length > 0 && (
      <section className={styles.container}>
        <div className="w-full flex justify-between items-center z-10">
          <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full flex justify-between items-center z-10">
                <div className={styles.title}>Fresh Mints</div>
              </div>
            ) : (
              <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Fresh Mints</div>
            )}
          </div>
          <div className="hidden lg:flex z-10">
            <SeeMoreButton
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 1 })
                router.push('/explore')
              }}
            />
          </div>
        </div>
        <div className="w-full mt-[15px] lg:mt-[34px] z-10">
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={
              viewport === 'xs'
                ? 1.13
                : viewport === 'sm'
                ? 1.92
                : viewport === 'md'
                ? 2
                : viewport === '2xl'
                ? 5
                : viewport === 'xl'
                ? 4
                : 4
            }
            spaceBetween={
              viewport === 'xs' ? 9 : viewport === 'sm' || viewport === 'md' ? 30 : viewport === 'lg' ? 30 : 30
            }
            modules={[Autoplay, Lazy, Navigation]}
            className={freshMintsList.length >= 4 ? 'navigationSwiper' : 'noScrollNavigationSwiper'}
            loop={cardLoop}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
          >
            {freshMintsList.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-wrap gap gap-[11px] lg:gap-[20px] xl:gap-[34px]">
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
                      router.push(`/nft/${item.token_id}`)
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-full flex sm:hidden justify-center lg:mt-0 mt-[20px]">
          <div className="w-full max-w-[300px] z-10">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 1 })
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

export default FreshMintSection

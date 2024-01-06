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

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg?component'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import SeeMoreButton from 'components/Button/SeeMoreButton'
import { NftData } from 'types/nft'

const MostPopularSection = props => {
  const { category } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [allMostPopularList, setAllMostPopularList] = useState<NftData[]>([])
  const [mostPopularList, setMostPopularList] = useState<NftData[]>([])
  const [cardLoop, setCardLoop] = useState(true)

  useEffect(() => {
    setAllMostPopularList([])
    dashboardAPI.getMostPopular(category).then(
      response => {
        if (response !== null && response !== undefined) {
          setAllMostPopularList(response)
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
    if (allMostPopularList.length === 0) return
    setMostPopularList(allMostPopularList)
  }, [viewport, allMostPopularList])

  return (
    mostPopularList.length > 0 && (
      <section className={styles.container}>
        <div className="w-full flex justify-between items-center z-10">
          <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full flex justify-center items-center z-10">
                <div className={styles.title}>Most Popular</div>
              </div>
            ) : (
              <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Most Popular</div>
            )}
          </div>
          <div className="hidden lg:flex z-10">
            <SeeMoreButton
              onClick={() => {
                dispatch({ type: 'set', artworkSort: 'popular' })
                dispatch({ type: 'set', exploreTab: 0 })
                dispatch({ type: 'set', artworkCategory: category })
                router.push('/explore')
              }}
            />
          </div>
        </div>
        <div className="w-full mt-[15px] lg:mt-[34px] z-10">
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 2 : viewport === 'lg' ? 3 : 4}
            spaceBetween={
              viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40
            }
            modules={[Autoplay, Lazy, Navigation]}
            className={'navigationSwiper'}
            loop={cardLoop}
            // autoplay={{
            //   delay: 5000,
            //   disableOnInteraction: false,
            // }}
          >
            {mostPopularList.map((item: any, index) => (
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
                      dispatch({ type: 'set', isLoading: true })
                      router.push(`/nft/${item.token_id}`)
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-full flex lg:hidden justify-center">
          <div className="w-full max-w-[242px] z-10">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => {
                dispatch({ type: 'set', artworkSort: 'popular' })
                dispatch({ type: 'set', exploreTab: 0 })
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

export default MostPopularSection

import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'
import Lottie from 'lottie-react'
import PreLoaderIcon from 'assets/lottery/preloader.json'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
import NFTCard from 'components/Card/NFTCard'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// import Marquee from 'react-fast-marquee'

// components
import OutlineButton from 'components/Button/OutlineButton'
import TrendingCollectionCard from 'components/Card/TrendingCollectionCard'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import SeeMoreButton from 'components/Button/SeeMoreButton'

const TrendingCollectionSection = props => {
  const { category, loop } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [marketplaceReleaseList, setMarketplaceReleaseList] = useState<any[]>([])
  const [active, setActive] = useState<any>(1)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setMarketplaceReleaseList
    getTrendingCollectionsFromServer(category, 'all')
  }, [category])

  const getTrendingCollectionsFromServer = (category, period) => {
    setIsLoading(true)
    dashboardAPI.getTrendingCollections(category, period).then(
      response => {
        setIsLoading(false)
        if (response instanceof Array) {
          setMarketplaceReleaseList(response)
        }
      },
      error => {
        setIsLoading(false)
        console.log(error)
      }
    )
  }

  return (
    (category.length === 0 || marketplaceReleaseList.length > 0) && (
      <section className={styles.container}>
        <div className="w-full flex justify-between items-center z-10">
          <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full flex justify-center items-center z-10 lg:mt-[5px]">
                <div className={styles.title}>Explore Studio Artwork</div>
              </div>
            ) : (
              <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Explore &nbsp;Studio Artwork</div>
            )}
          </div>
          <div className="hidden lg:flex z-10">
            <SeeMoreButton
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 1 })
                dispatch({ type: 'set', collectionSort: 'trending' })
                dispatch({ type: 'set', collectionCategory: category })
                router.push('/explore')
              }}
            />
          </div>
        </div>
        <div className="w-full mt-[30px] lg:mt-[34px] z-10 pb-[0px] lg:pb-[30px]">
          {marketplaceReleaseList !== null &&
            marketplaceReleaseList !== undefined &&
            marketplaceReleaseList.length !== 0 && (
              <Swiper
                navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
                slidesPerView={viewport === 'xs' ? 1.1 : viewport === 'sm' || viewport === 'md' ? 2 : 3.02}
                spaceBetween={
                  viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40
                }
                modules={[Autoplay, Lazy, Navigation]}
                className={marketplaceReleaseList.length > 3 ? 'auctionNavigationSwiper' : 'noScrollNavigationSwiper'}
                // loop={trendingList.length < 3 ? false : loop}
                // autoplay={{
                //   delay: 5000,
                //   disableOnInteraction: false,
                // }}
              >
                <div className="w-full grid grid-cols-12 gap-[20px] lg:gap-[50px] mt-[15px] lg:mt-[34px] z-10">
                  {marketplaceReleaseList.map((item: any, index) => (
                    <SwiperSlide>
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
                    </SwiperSlide>
                  ))}
                </div>
              </Swiper>
              // <Marquee
              //   gradient={false}
              //   pauseOnHover={false}
              //   pauseOnClick={true}
              //   speed={
              //     viewport === 'xs'
              //       ? 40
              //       : viewport === 'sm'
              //       ? 50
              //       : viewport === 'md'
              //       ? 60
              //       : viewport === 'lg'
              //       ? 70
              //       : viewport === 'xl'
              //       ? 90
              //       : 110
              //   }
              // >
              // <div className="w-full flex gap-5 lg:gap-10 mx-[10px] py-2 lg:mx-5">
              //   {trendingList.map((item: any, index) => (
              //     <TrendingCollectionCard
              //       collectionID={item.collection_id}
              //       image={item.cover_image}
              //       collectionName={item.collection_name}
              //       artistName={item.artist_username}
              //       nftCount={item.number_in_collections}
              //       avatar={item.artist_profile_picture}
              //       key={index}
              //     />
              //   ))}
              // </div>
              // </Marquee>
            )}
        </div>
        <div className="w-full flex lg:hidden justify-center lg:mt-0 mt-[15px]">
          <div className="w-full max-w-[242px] z-10">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 1 })
                dispatch({ type: 'set', collectionSort: 'trending' })
                dispatch({ type: 'set', collectionCategory: category })
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

export default TrendingCollectionSection

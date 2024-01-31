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
import merchAPI from 'apis/merch'
import SeeMoreButton from 'components/Button/SeeMoreButton'
import LoadingComponent from 'pages/explore/LoadingComponent'
import { NftData } from 'types/nft'

const MarketplaceReleaseSection = props => {
  const { category } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(8)
  const [seed, setSeed] = useState(Math.random())
  const [refresh, setRefresh] = useState(new Date())
  const [artworkList, setArtworkList] = useState<NftData[]>([])
  const [loading, setLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
      setIsFetching(false)
      setIsVisibleFetching(false)
    }, 2000)
  }, [refresh])

  useEffect(() => {
    merchAPI.getArtworkMerchHub(seed, page, perPage).then(response => {
      if (response !== null && response !== undefined && response.length !== 0) {
        setArtworkList(response)
      }
    }),
      error => {
        console.log(error)
      }
  }, [refresh])

  return (
    artworkList.length !== 0 && (
      <section className={styles.container}>
        <div className="w-full flex justify-between items-center z-10 mb-[30px]">
          <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full flex justify-center items-center z-10">
                <div className={styles.title}>Explore Studio Artwork</div>
              </div>
            ) : (
              <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Explore Studio Artwork</div>
            )}
          </div>
          <div className="hidden lg:flex z-10">
            <SeeMoreButton
              onClick={() => {
                setSeed(Math.random())
                setRefresh(new Date())
                setLoading(true)
                setIsFetching(true)
                setIsVisibleFetching(true)
              }}
            />
          </div>
        </div>
        {!loading && (
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 4 : 2}
            centeredSlides={false}
            spaceBetween={20}
            modules={[Autoplay, Navigation]}
            className={'auctionNavigationSwiper'}
            loop
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
          >
            <div className="w-full grid grid-cols-12 gap-[20px] lg:gap-[50px] mt-[15px] lg:mt-[34px] z-10">
              {artworkList.map((item: any, index) => (
                <SwiperSlide key={index}>
                  <div key={index} className="flex col-span-6 lg:col-span-4 2xl:col-span-3 items-center">
                    <NFTCard
                      image={item.nft.asset_url}
                      token_id={item.nft.token_id}
                      nftName={item.nft.nft_name}
                      assetType={item.asset_type}
                      coverImage={item.cover_image_url}
                      artistName={item.artist.username}
                      collectionName={item.collection_name}
                      onClick={() => {
                        dispatch({ type: 'set', isLoading: true })
                        router.push(`/nft/${item.nft.token_id}`)
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        )}
        <div className="w-full flex lg:hidden justify-center lg:mt-0 mt-[30px]">
          <div className="w-full max-w-[242px] z-10">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => {
                setSeed(Math.random())
                setRefresh(new Date())
              }}
              borderColor={'var(--see-more-border)'}
              height="40px"
            />
          </div>
        </div>

        {loading && isVisibleFetching && (
          <div className="w-full mt-[100px]">
            <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
          </div>
        )}
      </section>
    )
  )
}

export default MarketplaceReleaseSection

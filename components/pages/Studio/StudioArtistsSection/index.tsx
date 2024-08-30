import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import OutlineButton from 'components/Button/OutlineButton'
import ArtistCard from 'components/Card/ArtistCard'

// custom functions
import { useViewport } from 'utils'

// images and icons
import Artist from 'assets/images/dashboard-avatar.png'
import ArrowRightGreenIcon from 'assets/icons/arrow-right-white-medium.svg?component'

// styles
import styles from './index.module.scss'

// call apis
import merchAPI from 'apis/merch'
import SeeMoreButton from 'components/Button/SeeMoreButton'
import LoadingComponent from 'pages/explore/LoadingComponent'

const TopRatedArtistsSection = () => {
  const viewport = useViewport()
  const router = useRouter()

  const [artistsList, setArtistsList] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [seed, setSeed] = useState(Math.random())
  const [refresh, setRefresh] = useState(new Date())
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
    merchAPI.getArtistsMerchHub(seed, page, perPage).then(response => {
      if (response !== null && response !== undefined && response.length !== 0) {
        setArtistsList(response)
      }
    }),
      error => {
        console.log(error)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh])

  return (
    <section className={styles.container}>
      <div className="w-full flex justify-between items-center z-10 mb-[30px]">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center">
          {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
            <div className="w-full flex justify-between items-center z-10">
              <div className={styles.title}>Studio Artists</div>
              <div className="hidden lg:flex gap-[8px] items-center">
                <div
                  className={styles.seeMore}
                  onClick={() => {
                    setSeed(Math.random())
                    setRefresh(new Date())
                    setLoading(true)
                    setIsFetching(true)
                    setIsVisibleFetching(true)
                  }}
                >
                  See More
                </div>
                <ArrowRightGreenIcon alt="" />
              </div>
            </div>
          ) : (
            <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Studio&nbsp;Artists</div>
          )}
        </div>
        <div className="sm:w-full flex justify-end">
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
      </div>

      <div className="w-full mt-[30px] lg:mt-[34px] z-10">
        {!loading && (
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={
              viewport === 'xs'
                ? 2
                : viewport === 'sm'
                ? 2.5
                : viewport === 'md'
                ? 3
                : viewport === 'lg'
                ? 4
                : viewport === 'xl'
                ? 5
                : 6
            }
            spaceBetween={
              viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                ? 16
                : viewport === 'lg'
                ? 20
                : viewport === 'xl'
                ? 20
                : 24
            }
            initialSlide={5}
            modules={[Autoplay, Lazy, Navigation]}
            className={artistsList.length > 5 ? 'artistNavigationSwiper' : 'noScrollNavigationSwiper'}
          >
            <div>
              {artistsList.length !== 0 &&
                artistsList.map((item: any, index) => (
                  <SwiperSlide key={index}>
                    <ArtistCard
                      image={
                        item.profile_picture !== null &&
                        item.profile_picture !== undefined &&
                        item.profile_picture !== ''
                          ? item.profile_picture
                          : Artist.src
                      }
                      username={item.username}
                      onClick={() => {
                        router.push('/' + item.username)
                      }}
                      key={index}
                    />
                  </SwiperSlide>
                ))}
            </div>
          </Swiper>
        )}
      </div>

      {loading && isVisibleFetching && (
        <div className="w-full lg:mt-[0px] h-[221px] lg:h-[260px]">
          <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
        </div>
      )}

      <div className="w-full flex lg:hidden justify-center">
        <div className="w-full max-w-[265px] mt-[10px]">
          <OutlineButton
            label="See More"
            fullWidth
            onClick={() => {
              setSeed(Math.random())
              setRefresh(new Date())
              setLoading(true)
              setIsFetching(true)
              setIsVisibleFetching(true)
            }}
            fontFamily="Muli-Bold"
            fontSize="16px"
            height="40px"
            borderRadius="8px"
          />
        </div>
      </div>
    </section>
  )
}

export default TopRatedArtistsSection

import React, { useState, useEffect } from 'react'

// next components
import Image from 'next/image'
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
import CollectionCard from 'components/Card/CollectionCard'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// api
import collectionAPI from 'apis/collections'

const OtherCollectionSection = props => {
  const { artistId, artistName } = props

  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [collectionList, setCollectionList] = useState([])

  useEffect(() => {
    if (artistId !== null) {
      collectionAPI.getOtherCollections(artistId).then(
        response => {
          if (response instanceof Array) setCollectionList(response)
        },
        error => {}
      )
    }
  }, [artistId])

  return (
    collectionList.length > 0 && (
      <section className={styles.container}>
        <div className={styles.topRightEllipse}>
          <svg xmlns="http://www.w3.org/2000/svg" width="2321" height="2321" viewBox="0 0 2321 2321">
            <defs>
              <radialGradient id="radial-gradient" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
                <stop offset="0" stop-color="var(--ellipse-svg-1)" stop-opacity="0.404" />
                <stop offset="1" stop-color="var(--ellipse-svg-2)" stop-opacity="0" />
              </radialGradient>
            </defs>
            <circle
              id="Ellipse_4322"
              data-name="Ellipse 4322"
              cx="1010.5"
              cy="1010.5"
              r="1010.5"
              transform="translate(150 150)"
              fill="url(#radial-gradient)"
            />
          </svg>
        </div>
        <div className="w-full flex justify-between items-center z-10">
          <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
            <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Other Collections by Artist</div>
          </div>
          <div className="hidden lg:flex z-10">
            <OutlineButton
              label="See More"
              onClick={() => router.push(`/artist-profile?id=${artistId}`)}
              borderColor="#ffffff"
              height="42px"
            />
          </div>
        </div>
        <div className="w-full mt-[15px] lg:mt-[34px] z-10">
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 2 : viewport === 'lg' ? 3 : 4}
            spaceBetween={
              viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 32
            }
            modules={[Autoplay, Lazy, Navigation]}
            className="navigationSwiper"
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
          >
            {collectionList.map((item: any, index) => (
              <SwiperSlide key={index}>
                <CollectionCard
                  image={item.cover_image}
                  nftName={item.collection_name}
                  category={item.categories.split(',')}
                  artistName={artistName}
                  artistAddress={artistId}
                  mintAddress={item.collection_id}
                  onClick={() => {
                    dispatch({ type: 'set', isLoading: true })
                    router.push(`/browse-collection/${item.collection_id}`)
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-full flex lg:hidden justify-center">
          <div className="w-full max-w-[242px] z-10">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => router.push(`/artist-profile?id=${artistId}`)}
              borderColor={'var(--see-more-border)'}
              height="40px"
            />
          </div>
        </div>
      </section>
    )
  )
}

export default OtherCollectionSection

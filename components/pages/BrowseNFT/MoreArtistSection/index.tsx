import React, { useState, useEffect } from 'react'

// next components
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// third party components
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

// json

// styles
import styles from './index.module.scss'

// api
import SeeMoreButton from 'components/Button/SeeMoreButton'
import TrendingCollectionCard from 'components/Card/TrendingCollectionCard'

const MoreArtistSection = props => {
  const { artistInfo, collectionList } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    fetchCollectionData(collectionList)
  }, [collectionList])

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const fetchCollectionData = nfts => {
    if (nfts.length > 0) {
      ;(async () => {
        for (let index = 0; index < nfts.length; index++) {
          let data = nfts[index]
          fetch(`/collection/${data.collection_id}`).then(e => e.text())
          if (index % 4 == 3) {
            await sleep(1000)
          }
        }
      })()
    }
  }

  return (
    collectionList.length > 0 && (
      <section className={styles.container}>
        <div className="w-full flex justify-between items-center">
          <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
            <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>
              {artistInfo?.name.length > 0 && `More from ${artistInfo.name}`}
            </div>
          </div>
          <div className="hidden lg:flex">
            <SeeMoreButton
              onClick={() => {
                router.push(`/${artistInfo.name}`)
              }}
            />
          </div>
        </div>
        <div className="w-full mt-[15px] lg:mt-[34px]">
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 1 : viewport === 'lg' ? 3 : 4}
            spaceBetween={
              viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40
            }
            modules={[Autoplay, Lazy, Navigation]}
            className={collectionList.length >= 4 ? 'navigationSwiper' : 'noScrollNavigationSwiper'}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
          >
            {collectionList.map((item: any, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-wrap gap gap-[11px] lg:gap-[20px] xl:gap-[32px]">
                  <TrendingCollectionCard
                    collectionID={item.collection_id}
                    image={item.cover_image}
                    collectionName={item.collection_name}
                    artistName={artistInfo.name}
                    avatar={artistInfo.profile_image}
                    // nftCount={item.number_in_collections}
                    showRemoveButton={false}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-full flex lg:hidden justify-center">
          <div className="w-full max-w-[300px] mt-[10px]">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => {
                router.push(`/${artistInfo.name}`)
              }}
              fontSize="16px"
              height="40px"
              borderRadius="8px"
            />
          </div>
        </div>
      </section>
    )
  )
}

export default MoreArtistSection

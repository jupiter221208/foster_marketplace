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
import EllipseGreen from 'assets/icons/ellipse-green.svg?component'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import SeeMoreButton from 'components/Button/SeeMoreButton'

const FreshMintSection = props => {
  const { category } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [allFreshMintsList, setAllFreshMintsList] = useState<any[]>([])
  const [freshMintsList, setFreshMintsList] = useState<any[]>([])

  useEffect(() => {
    dashboardAPI.getFreshMints(category).then(
      response => {
        if (response !== null && response !== undefined) {
          setAllFreshMintsList(response)
          setFreshMintsList(response)
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
    <section className={styles.container}>
      <div className={styles.bottomLeftEllipse}>
        {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
      </div>
      <div className="w-full flex justify-between items-center z-10">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
          {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
            <div className="w-full flex justify-center items-center z-10">
              <div className={styles.title}>Fresh Mints</div>
            </div>
          ) : (
            <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Fresh Mints</div>
          )}
        </div>
        <div className="hidden lg:flex z-10">
          <SeeMoreButton onClick={() => router.push('/explore')} />
        </div>
      </div>
      <div className="w-full mt-[15px] lg:mt-[34px] z-10">
        {freshMintsList !== null && freshMintsList !== undefined && freshMintsList.length !== 0 && (
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 2 : viewport === 'lg' ? 3 : 4}
            spaceBetween={
              viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40
            }
            modules={[Autoplay, Lazy, Navigation]}
            className={'navigationSwiper'}
            loop
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
          >
            {freshMintsList.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-wrap gap gap-[11px] lg:gap-[20px] xl:gap-[34px]">
                  <NFTCard
                    tokenID={item.token_id}
                    image={item.asset_url}
                    nftName={item.nft_name}
                    assetType={item.asset_type}
                    coverImage={item.cover_image_url}
                    artistName={item.artist_username}
                    price={item.list_price}
                    onClick={() => {
                      dispatch({ type: 'set', isLoading: true })
                      router.push(`/browse-nft?id=${item.token_id}`)
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      <div className="w-full flex lg:hidden justify-center">
        <div className="w-full max-w-[242px] z-10">
          <OutlineButton
            label="See More"
            fullWidth
            onClick={() => {
              dispatch({ type: 'set', exploreTab: 1 })
              router.push('/explore')
            }}
            borderColor={'var(--see-more-border)'}
            height="40px"
          />
        </div>
      </div>
    </section>
  )
}

export default FreshMintSection

import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// custom functions
import { useViewport } from 'utils'

// resources

// styles
import styles from './index.module.scss'

// call apis
import SeeMoreButton from 'components/Button/SeeMoreButton'
import OutlineButton from 'components/Button/OutlineButton'
import OpenEditionCard from 'components/Card/OpenEditionCard'
import HomeEditionCard from 'components/Card/HomeEditionCard'

const OpenEditionSection = props => {
  const { category } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [editionList, setEditionList] = useState<any>([])

  useEffect(() => {
    getLimitedEditionsFromServer()
  }, [])

  const getLimitedEditionsFromServer = () => {
    setEditionList([
      {
        id: 1,
        nft_name: 'NFT NAME',
        artist_username: 'Creator Name',
        artist_profile_picture:
          'https://foster-marketplace-dev.s3.us-east-2.amazonaws.com/e5ca6496-ceb0-4bb8-8c39-339ea5fed484.jpg',
        asset_type: 'image/png',
        token_id: 'CFGdWbDsBL3nHoMZUYyg9wyoTTJ1XFD1xSHbg3WsUvP8',
        cover_image_url: '',
        asset_url:
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
        list_price: '2.0',
        supply: 8,
        max_supply: 10,
      },
      {
        id: 1,
        nft_name: 'NFT NAME',
        artist_username: 'Creator Name',
        artist_profile_picture:
          'https://foster-marketplace-dev.s3.us-east-2.amazonaws.com/e5ca6496-ceb0-4bb8-8c39-339ea5fed484.jpg',
        asset_type: 'image/png',
        token_id: 'CFGdWbDsBL3nHoMZUYyg9wyoTTJ1XFD1xSHbg3WsUvP8',
        cover_image_url: '',
        asset_url:
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
        list_price: '2.0',
        supply: 8,
        max_supply: 10,
      },
      {
        id: 1,
        nft_name: 'NFT NAME',
        artist_username: 'Creator Name',
        artist_profile_picture:
          'https://foster-marketplace-dev.s3.us-east-2.amazonaws.com/e5ca6496-ceb0-4bb8-8c39-339ea5fed484.jpg',
        asset_type: 'image/png',
        token_id: 'CFGdWbDsBL3nHoMZUYyg9wyoTTJ1XFD1xSHbg3WsUvP8',
        cover_image_url: '',
        asset_url:
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
        list_price: '2.0',
        supply: 8,
        max_supply: 10,
      },
      {
        id: 1,
        nft_name: 'NFT NAME',
        artist_username: 'Creator Name',
        artist_profile_picture:
          'https://foster-marketplace-dev.s3.us-east-2.amazonaws.com/e5ca6496-ceb0-4bb8-8c39-339ea5fed484.jpg',
        asset_type: 'image/png',
        token_id: 'CFGdWbDsBL3nHoMZUYyg9wyoTTJ1XFD1xSHbg3WsUvP8',
        cover_image_url: '',
        asset_url:
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
        list_price: '2.0',
        supply: 8,
        max_supply: 10,
      },
      {
        id: 1,
        nft_name: 'NFT NAME',
        artist_username: 'Creator Name',
        artist_profile_picture:
          'https://foster-marketplace-dev.s3.us-east-2.amazonaws.com/e5ca6496-ceb0-4bb8-8c39-339ea5fed484.jpg',
        asset_type: 'image/png',
        token_id: 'CFGdWbDsBL3nHoMZUYyg9wyoTTJ1XFD1xSHbg3WsUvP8',
        cover_image_url: '',
        asset_url:
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
        list_price: '2.0',
        supply: 8,
        max_supply: 10,
      },
    ])
    return false
  }

  return (
    editionList.length > 0 && (
      <section className={styles.container}>
        <div className="w-full flex justify-between items-center z-10 ml-[5px]">
          <div className={styles.title}>Open&nbsp;Editions</div>
          <div className="z-10 sm:block hidden">
            <SeeMoreButton
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 0 })
                dispatch({ type: 'set', availabilityFilter: 1 })
                dispatch({ type: 'set', artworkCategory: category })
                router.push('/explore')
              }}
            />
          </div>
        </div>
        <div className={`${styles.editionSwiper} lg:block hidden`}>
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={1.36}
            spaceBetween={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 20 : 0}
            centeredSlides={true}
            loop
            modules={[Navigation]}
            className={'heroNavigationSwiper'}
          >
            {editionList.map((item, index) => (
              <SwiperSlide key={index}>
                <OpenEditionCard data={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Mobile */}
        <div className="w-full lg:hidden block mt-[20px] lg:mt-[30px] z-10">
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={viewport === 'xs' ? 1 : 2}
            spaceBetween={viewport === 'xs' ? 9 : viewport === 'sm' || viewport === 'md' ? 30 : 0}
            modules={[Navigation]}
            className={'heroNavigationSwiper'}
          >
            {editionList.map((item, index) => (
              <SwiperSlide key={index}>
                <HomeEditionCard data={item} type="open" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="w-full flex sm:hidden justify-center lg:mt-0 mt-[10px]">
          <div className="w-full max-w-[300px] z-10">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 0 })
                dispatch({ type: 'set', availabilityFilter: 1 })
                dispatch({ type: 'set', artworkCategory: category })
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

export default OpenEditionSection

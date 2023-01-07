import React, { useEffect, useState } from 'react'

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
import Button from 'components/Button'
import OutlineButton from 'components/Button/OutlineButton'
import NFTCard from 'components/Card/NFTCard'

// custom functions
import { useViewport } from 'utils'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'

const FreshMintSection = props => {
  const { category } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [allFreshMintsList, setAllFreshMintsList] = useState<any[]>([])
  const [freshMintsList, setFreshMintsList] = useState<any[]>([])

  const [active, setActive] = useState<any>(0)

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
    let mobileVersion = viewport === 'xs' || viewport === 'sm' || viewport === 'md'
    if (mobileVersion) {
      let lists = []
      allFreshMintsList.forEach(item => {
        if (item.asset_type !== 'video') lists.push(item)
      })
      setFreshMintsList(lists)
    } else {
      setFreshMintsList(allFreshMintsList)
    }
  }, [viewport, allFreshMintsList])

  const handleChangeActive = value => {
    setActive(value)

    switch (value) {
      case 0:
        setFreshMintsList(allFreshMintsList.slice(0, 5))
        break
      case 1:
        setFreshMintsList(allFreshMintsList.slice(0, 10))
        break
      case 2:
        setFreshMintsList(allFreshMintsList.slice(0, 15))
        break
      default:
        setFreshMintsList(allFreshMintsList)
        break
    }
  }
  return (
    <section className={styles.container}>
      <div className={styles.bottomLeftEllipse}>
        <Image src={EllipseGreen} alt="" />
      </div>
      <div className="w-full flex justify-between items-center z-10">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
          <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>Fresh Mints</div>
          <div className="hidden lg:flex z-10">
            <Button
              label="24 hrs"
              onClick={() => handleChangeActive(0)}
              color={active === 0 ? '#202427' : '#979EA2'}
              backgroundColor={active === 0 ? '#5ac3ba' : 'transparent'}
            />
            <Button
              label="7 days"
              onClick={() => handleChangeActive(1)}
              color={active === 1 ? '#202427' : '#979EA2'}
              backgroundColor={active === 1 ? '#5ac3ba' : 'transparent'}
            />
            <Button
              label="30 days"
              onClick={() => handleChangeActive(2)}
              color={active === 2 ? '#202427' : '#979EA2'}
              backgroundColor={active === 2 ? '#5ac3ba' : 'transparent'}
            />
          </div>
        </div>
        <div className="hidden lg:flex z-10">
          <OutlineButton label="See More" onClick={() => router.push('/explore')} borderColor="#ffffff" height="42px" />
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
            className="navigationSwiper"
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
            onClick={() => router.push('/explore')}
            borderColor="#ffffff"
            height="40px"
          />
        </div>
      </div>
    </section>
  )
}

export default FreshMintSection

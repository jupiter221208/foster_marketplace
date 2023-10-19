import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Autoplay, Pagination, Navigation } from 'swiper'
import Hero1List from 'assets/json/hero/hero-list.json'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import { useDispatch, useSelector } from 'react-redux'

// components
import OutlineButton from 'components/Button/OutlineButton'
import StuidoCard from 'components/Card/StudioCard'
import CreateNFTModal from 'components/Modal/CreateNFTModal'

// custom functions
import { useViewport } from 'utils'

import Image from 'next/image'

// images and icons
import StudioAvatar from 'assets/images/studio-avatar.png'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import GradientButton from 'components/Button/GradientButton'
import StudioHeroCardMobile from 'components/Card/StudioCardMobile'
import StudioCard from 'components/Card/StudioCard'
import StudioHeroList from 'assets/json/hero/hero-list.json'
import StudioHeroMobileList from 'assets/json/hero/hero-mobile-list.json'

const MainSection = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const firstLoaded = useSelector<any>(state => state.firstLoaded)
  const openCreateNFTModal = useSelector<any>(state => state.openCreateNFTModal)
  const [heroList, setHeroList] = useState<any[]>([])
  const [artworkCnt, setArtworkCnt] = useState()
  const [collectionCnt, setCollectionCnt] = useState()
  const [nftCnt, setNftCnt] = useState()

  const handleCloseCreateNFTModal = () => {
    dispatch({ type: 'set', openCreateNFTModal: false })
  }

  useEffect(() => {
    dashboardAPI.getDashboardBanner().then(
      response => {
        if (response !== null && response !== undefined) {
          setHeroList(response.featured_nfts)
          setNftCnt(response.stats.users)
          setCollectionCnt(response.stats.collections)
          setArtworkCnt(response.stats.nfts)
        }
        if (!firstLoaded) {
          setTimeout(() => {
            dispatch({ type: 'set', firstLoaded: true })
          }, 2000)
        }
      },
      error => {
        console.log(error)
      }
    )
  }, [])

  return (
    <section id="main-section" className={styles.container}>
      <div className="w-full grid grid-cols-12 z-10 items-center">
        {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && (
          <div className="col-span-12 justify-center">
            <div className="flex justify-center mb-[40px]">
              <Image src={StudioAvatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div className={styles.text}>Ready to level-up your wardrobe?</div>
            <div className={styles.slug}>
              Pick your base and then select from the available studio artwork to begin designing.
            </div>
          </div>
        )}

        {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
          <div
            className="w-full col-span-12 min-h-[508px]"
            style={{
              width: viewport === 'xs' || viewport === 'sm' ? 'calc(100% + 32px)' : '100%',
              marginLeft: viewport === 'xs' || viewport === 'sm' ? '-16px' : '0px',
            }}
          >
            <div className={styles.contentArea}>
              <div className={styles.mobileTitle}>Ready to level-up your wardrobe?</div>
              <div className={styles.mobileText}>
                Pick your base and then select from the available studio artwork to begin designing.
              </div>
            </div>
            {StudioHeroMobileList.length !== 0 && (
              <div className="w-full relative" id="heroSwiperMobile">
                <Swiper
                  slidesPerView={2}
                  spaceBetween={30}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Autoplay, Pagination]}
                  className={'heroSwiperMobile'}
                  loop
                  // autoplay={{
                  //   delay: 5000,
                  //   disableOnInteraction: false,
                  // }}
                >
                  {StudioHeroMobileList.map((item, index) => (
                    <SwiperSlide key={index}>
                      <StudioHeroCardMobile data={item} />
                      <div className={styles.overlay} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        ) : (
          <div
            className="w-full col-span-12 lg:col-span-12 lg:pt-[40px] "
            style={{
              width: '100%',
              marginLeft: '0px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div className="g-container" style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="w-full relative bg-[#121212] rounded-[50px]" id="heroSwiper" style={{ width: '1435px' }}>
                {StudioHeroList.length !== 0 && (
                  <Swiper
                    navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
                    slidesPerView={4}
                    spaceBetween={0}
                    centeredSlides={false}
                    loop
                    pagination={{
                      clickable: true,
                    }}
                    modules={[Autoplay, Pagination, Navigation]}
                    className={'heroNavigationSwiper'}
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                    }}
                  >
                    {StudioHeroList.map((item: any, index) => (
                      <SwiperSlide key={index} style={{ width: 'fit-content' }}>
                        <StudioCard data={item} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <CreateNFTModal open={openCreateNFTModal} close={() => handleCloseCreateNFTModal()} />
    </section>
  )
}

export default MainSection

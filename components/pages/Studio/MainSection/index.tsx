import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { EffectCoverflow, Autoplay, Pagination, Navigation } from 'swiper'
import Hero1List from 'assets/json/hero/hero-list.json'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import { useDispatch, useSelector } from 'react-redux'

// components
import OutlineButton from 'components/Button/OutlineButton'
import StudioCard from 'components/Card/StudioCard'
import CreateNFTModal from 'components/Modal/CreateNFTModal'

// custom functions
import { useViewport } from 'utils'

import Image from 'next/image'

// images and icons
import StudioAvatar from 'assets/images/logo-02.png'
import StudioTitle from 'assets/icons/logo-studio.svg?component'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import GradientButton from 'components/Button/GradientButton'
import StudioHeroCardMobile from 'components/Card/StudioCardMobile'
import StudioHeroList from 'assets/json/hero/hero-list.json'
import StudioHeroMobileList from 'assets/json/hero/hero-mobile-list.json'
import { NextButton, PreviewButton } from './customButton'
SwiperCore.use([Navigation])

const MainSection = ({ onchange, heroValue }) => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const firstLoaded = useSelector<any>(state => state.firstLoaded)
  const openCreateNFTModal = useSelector<any>(state => state.openCreateNFTModal)
  const [heroList, setHeroList] = useState<any[]>([])
  const [artworkCnt, setArtworkCnt] = useState()
  const [collectionCnt, setCollectionCnt] = useState()
  const [nftCnt, setNftCnt] = useState()
  const [swiper, setSwiper] = useState(null)
  const goNext = () => {
    if (swiper !== null) swiper.slideNext()
  }

  const goPrev = () => {
    if (swiper !== null) swiper.slidePrev()
  }

  const handleCloseCreateNFTModal = () => {
    dispatch({ type: 'set', openCreateNFTModal: false })
  }

  useEffect(() => {
    if (!firstLoaded) {
      setTimeout(() => {
        dispatch({ type: 'set', firstLoaded: true })
      }, 2000)
    }
    error => {
      console.log(error)
    }
  }, [])

  return (
    <section id="main-section" className={styles.container}>
      <div className="w-full grid grid-cols-12 z-10 items-center">
        {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && (
          <div className="col-span-12 justify-center">
            {/* <div className="flex items-center justify-center mb-[20px]">
              <Image src={StudioAvatar} alt="" width={90} height={90} />
              <div className="flex ml-[20px]">
                <StudioTitle />
              </div>
            </div> */}
            <div className={styles.text}>LOVE THE ART. OWN THE MERCH.</div>
            <div className={styles.slug}>Pick the base garment and explore merch from your favorite artists.</div>
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
              <div className={styles.mobileTitle}>LOVE THE ART. OWN THE MERCH.</div>
              <div className={styles.mobileText}>
                Pick the base garment and explore merch from your favorite artists.
              </div>
            </div>
            {StudioHeroList.length !== 0 && (
              <div className="w-full relative px-[20px]" id="heroSwiperMobile">
                <Swiper
                  slidesPerView={1}
                  spaceBetween={0}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Pagination]}
                  className={'heroMobileStudioSwiper'}
                  loop
                >
                  <div>
                    {StudioHeroList.map((item, index) => (
                      <SwiperSlide key={index} className="">
                        <StudioHeroCardMobile data={item} change={onchange} value={heroValue} />
                        <div className={styles.overlay} />
                      </SwiperSlide>
                    ))}
                  </div>
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
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div className={styles.studio}>
                <div className="px-[65px] pt-[70px] pb-[30px]" id="heroStudioSwiper">
                  {StudioHeroList.length !== 0 && (
                    <Swiper
                      slidesPerView={4}
                      spaceBetween={15}
                      className={'heroStudioSwiper'}
                      pagination={{
                        clickable: true,
                      }}
                      modules={[Pagination]}
                      loop
                      onSwiper={setSwiper}
                    >
                      {StudioHeroList.map((item: any, index) => (
                        <SwiperSlide key={index}>
                          <StudioCard data={item} change={onchange} value={heroValue} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                  <div className={styles.nextButton} onClick={goNext}>
                    <NextButton />
                  </div>
                  <div className={styles.prevButton} onClick={goPrev}>
                    <PreviewButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.gradient}></div>
      <CreateNFTModal open={openCreateNFTModal} close={() => handleCloseCreateNFTModal()} />
    </section>
  )
}

export default MainSection

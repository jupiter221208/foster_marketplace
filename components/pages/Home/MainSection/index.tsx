import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import { useDispatch, useSelector } from 'react-redux'

// components
import OutlineButton from 'components/Button/OutlineButton'
import HeroCard from 'components/Card/HeroCard'
import CreateNFTModal from 'components/Modal/CreateNFTModal'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'
import Lottie from 'lottie-react'
import LoadingIcon from 'assets/lottery/loader-new.json'
import { Fade } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'

// call apis
import dashboardAPI from 'apis/dashboard'
import GradientButton from 'components/Button/GradientButton'
import HeroCardMobile from 'components/Card/HeroCardMobile'

import EllipseBlue from 'assets/icons/ellipse-blue.svg?component'
import EllipseGreen from 'assets/icons/ellipse-green-home.svg?component'
import ArrowRightGreenIcon from 'assets/icons/arrow-right-white-large.svg?component'
import ArrowLeftGreenIcon from 'assets/icons/arrow-left-white-large.svg?component'

import HeroEmptyList from 'assets/json/hero/hero-card-empty.json'
import HeroNewCard from 'components/Card/HeroNewCard'

const MainSection = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const firstLoaded = useSelector<any>(state => state.firstLoaded)
  const openCreateNFTModal = useSelector<any>(state => state.openCreateNFTModal)
  const [heroList, setHeroList] = useState(HeroEmptyList as any)
  const [artworkCnt, setArtworkCnt] = useState()
  const [collectionCnt, setCollectionCnt] = useState()
  const [nftCnt, setNftCnt] = useState()
  const [heroCardOpacity, setHeroCardOpacity] = useState(0)

  const handleCloseCreateNFTModal = () => {
    dispatch({ type: 'set', openCreateNFTModal: false })
  }

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    if (heroList.length > 0) {
      ;(async () => {
        for (let index = 0; index < heroList.length; index++) {
          let data = heroList[index]
          fetch(`/nft/${data.token_id}`).then(e => e.text())
          if (index % 3 == 2) {
            await sleep(1000)
          }
        }
      })()
    }
  }, [heroList, router])

  useEffect(() => {
    setTimeout(() => {
      setHeroCardOpacity(100)
    }, 2000)
    dashboardAPI.getMarketplaceReleases('', '', 1, 13).then(response => {
      if (response !== null && response !== undefined && response.length !== 0) {
        setHeroList(response.slice(0, 5))
      }
    }),
      error => {
        console.log(error)
      }
  }, [])

  useEffect(() => {
    if (heroList.length > 0) {
      ;(async () => {
        for (let index = 0; index < heroList.length; index++) {
          let data = heroList[index]
          fetch(`/nft/${data.token_id}`).then(e => e.text())
          fetch(`/${data.artist_username}`).then(e => e.text())
          if (index % 4 == 3) {
            await sleep(1000)
          }
        }
      })()
    }
  }, [heroList])

  return (
    <section id="main-section" className={styles.container}>
      <div className="w-full z-10 items-center relative">
        {/* <div className="flex lg:hidden w-[calc(100%+32px)]">
          <div className={styles.heroMobileSection}>
            <div className="w-full relative" id="heroSwiperMobile">
              {heroList.length !== 0 && (
                <Swiper
                  slidesPerView={1}
                  spaceBetween={20}
                  pagination={{
                    clickable: true,
                  }}
                  centeredSlides={true}
                  modules={[Pagination]}
                  className={'heroSwiperMobile'}
                  loop
                >
                  {heroList.map((item, index) => (
                    <SwiperSlide key={index}>
                      <HeroCardMobile data={item} />
                      <div className={styles.overlay} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
        </div> */}
        <div className="flex lg:hidden w-[calc(100%+32px)]">
          <div className="w-full -ml-[16px]">
            <Fade
              duration={3000}
              transitionDuration={600}
              pauseOnHover={false}
              canSwipe={true}
              autoplay={true}
              prevArrow={<></>}
              nextArrow={<></>}
            >
              {heroList.map((item, index) => {
                return (
                  <div key={index} className="w-full each-fade">
                    <HeroCardMobile data={item} />
                    <div
                      style={{
                        position: 'absolute',
                        left: '0px',
                        top: '0px',
                        width: '100%',
                        height: '100%',
                        background: 'var(--hero-overlay-color)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        zIndex: '0',
                      }}
                    />
                  </div>
                )
              })}
            </Fade>
          </div>
        </div>
        <div className="hidden lg:flex">
          <div className="w-full h-[592px] relative">
            <div className="absolute w-full h-[590px] inset-0">
              <Fade
                duration={3000}
                transitionDuration={600}
                pauseOnHover={false}
                canSwipe={true}
                autoplay={true}
                prevArrow={
                  <div className={`${styles.arrowBG} ml-[150px]`}>
                    <ArrowLeftGreenIcon alt="" />
                  </div>
                }
                nextArrow={
                  <div className={`${styles.arrowBG} mr-[150px]`}>
                    <ArrowRightGreenIcon alt="" />
                  </div>
                }
              >
                {heroList.map((item, index) => {
                  return (
                    <div key={index} className="min-w-full w-full each-fade">
                      <HeroNewCard data={item} />
                    </div>
                  )
                })}
              </Fade>
            </div>
            <div className={styles.heroBorder} />
          </div>
          {/* <div className="w-full relative" id="heroSwiper">
              <Swiper
                // navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
                // slidesPerView={viewport === 'lg' || viewport === 'xl' ? 1.2 : 1.4}
                // spaceBetween={viewport === 'lg' || viewport === 'xl' ? -20 : -40}
                navigation={true}
                slidesPerView={1}
                centeredSlides={true}
                loop
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination, Navigation]}
                className={`heroNavigationSwiper opacity-${heroCardOpacity}`}
              >
                {heroList.map((item, index) => (
                  <SwiperSlide key={index}>
                    <HeroCard data={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div> */}
          {heroCardOpacity === 0 && (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className={styles.loadingText}>
                <div className="flex items-center w-[200px]">
                  <Lottie animationData={LoadingIcon} loop={true} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
          <div className="w-full  flex justify-center lg:justify-end lg:mt-[20px]">
            <div className="w-full flex justify-center gap-8">
              <GradientButton
                width={88}
                fontSize={16}
                fontFamily="Muli-SemiBold"
                label="Explore"
                onClick={() => router.push('/explore')}
              />
              <OutlineButton
                label="Create"
                borderWidth={2}
                width={88}
                fontSize={16}
                fontFamily="Muli-SemiBold"
                borderColor={'var(--see-more-border)'}
                onClick={() => dispatch({ type: 'set', openCreateNFTModal: true })}
              />
            </div>
          </div>
        ) : (
          <></>
        )} */}

        {/* <div className={styles.leftEllipse}>
          <EllipseBlue />
        </div>
        <div className={styles.rightEllipse}>
          <EllipseGreen />
        </div> */}
      </div>
      <CreateNFTModal open={openCreateNFTModal} close={() => handleCloseCreateNFTModal()} />
    </section>
  )
}

export default MainSection

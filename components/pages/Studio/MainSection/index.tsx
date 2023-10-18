import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Autoplay, Pagination, Navigation } from 'swiper'

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

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg?component'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import GradientButton from 'components/Button/GradientButton'
import HeroCardMobile from 'components/Card/HeroCardMobile'
import StudioCard from 'components/Card/HeroCard'

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
          <div className="col-span-12">
            <div className={styles.text}>Ready to level-up your wardrobe?</div>
            <div className={styles.slug}>
              Pick your base and then select from the available studio artwork to begin designing.
            </div>

            {/* <div className="hidden lg:flex lg:mt-1 xl:mt-[80px] 2xl:mt-[190px] flex-wrap lg:gap-6 xl:gap-10 2xl:gap-20">
              <div className="block">
                <div className={styles.count}>{artworkCnt}</div>
                <div className={styles.countText}>Artworks</div>
              </div>
              <div className="block items-center">
                <div className={styles.count}>{collectionCnt}</div>
                <div className={styles.countText}>Collections</div>
              </div>
              <div className="block">
                <div className={styles.count}>{nftCnt}</div>
                <div className={styles.countText}>Ecosystem</div>
              </div>
            </div> */}
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

            {heroList.length !== 0 && (
              <div className="w-full relative" id="heroSwiperMobile">
                <Swiper
                  slidesPerView={1}
                  spaceBetween={30}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Autoplay, Pagination]}
                  className={'heroSwiperMobile'}
                  loop
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                >
                  {heroList.map((item, index) => (
                    <SwiperSlide key={index}>
                      <HeroCardMobile data={item} />
                      <div className={styles.overlay} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        ) : (
          <div className="w-[1450px] h-[500px]">
            <div
              className="w-full col-span-12 lg:col-span-12 lg:pt-[40px] "
              style={{
                width: '100%',
                marginLeft: '0px',
              }}
            >
              <div className="w-full relative" id="heroSwiper">
                {heroList.length !== 0 && (
                  <Swiper
                    navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
                    slidesPerView={3}
                    spaceBetween={0}
                    centeredSlides={true}
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
                    {heroList.map((item, index) => (
                      <SwiperSlide key={index}>
                        <StudioCard data={item} />
                      </SwiperSlide>
                    ))}
                    <div className={styles.leftSide} />
                    <div className={styles.rightSide} />
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

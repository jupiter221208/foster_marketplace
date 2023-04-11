import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper'

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

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg?component'
import FosterHeroLogo from 'assets/icons/foster-hero-logo.svg?component'
import FosterHeroMobileLogo from 'assets/icons/foster-hero-logo-mobile.svg?component'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import GradientButton from 'components/Button/GradientButton'
import HeroCardMobile from 'components/Card/HeroCardMobile'

const MainSection = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

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
      },
      error => {
        console.log(error)
      }
    )
  }, [])

  return (
    <section id="main-section" className={styles.container}>
      <div className={styles.topLeftEllipse}>
        {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
      </div>
      <div className={styles.topRightEllipse}>
        {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
      </div>
      <div className="w-full grid grid-cols-12 z-10 items-center">
        <div className="hidden lg:block lg:col-span-7 xl:col-span-7">
          <FosterHeroLogo alt="" />

          <div className={styles.text}>Home to Digital Creators on Solana</div>

          {viewport !== 'xs' && viewport !== 'sm' && viewport !== 'md' ? (
            <div className="mt-[35px] lg:mt-[50px] xl:mt-[70px] 2xl:mt-[90px] flex justify-center lg:justify-start gap-8">
              <GradientButton label="Explore" width={124} onClick={() => router.push('/explore')} />
              <OutlineButton
                label="Create"
                width={124}
                borderWidth={2}
                onClick={() => dispatch({ type: 'set', openCreateNFTModal: true })}
              />
            </div>
          ) : (
            <></>
          )}
          <div className="hidden lg:flex lg:mt-16 xl:mt-[80px] 2xl:mt-[200px] flex-wrap lg:gap-6 xl:gap-10 2xl:gap-20">
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
          </div>
        </div>

        {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
          <div
            className="w-full col-span-12 min-h-[508px]"
            style={{
              width: viewport === 'xs' || viewport === 'sm' ? 'calc(100% + 32px)' : '100%',
              marginLeft: viewport === 'xs' || viewport === 'sm' ? '-16px' : '0px',
            }}
          >
            <div className={styles.contentArea}>
              <div className={styles.mobileTitle}>Creator Inspired</div>
              <div className={styles.mobileText}>Digital Art Marketplace on Solana</div>
            </div>
            {heroList.length !== 0 && (
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                pagination={{
                  clickable: true,
                }}
                modules={[Autoplay, Pagination]}
                className={'heroSwiper'}
                loop
                autoplay={{
                  delay: 500000,
                  disableOnInteraction: false,
                }}
              >
                {heroList.map((item, index) => (
                  <SwiperSlide key={index}>
                    <HeroCardMobile data={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        ) : (
          <div
            className="w-full col-span-12 lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end lg:py-6"
            style={{
              width: viewport === 'xs' || viewport === 'sm' ? 'calc(100% + 32px)' : '100%',
              marginLeft: viewport === 'xs' || viewport === 'sm' ? '-16px' : '0px',
            }}
          >
            <div className="max-w-[550px] w-full">
              {heroList.length !== 0 && (
                <Swiper
                  slidesPerView={1}
                  spaceBetween={30}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Autoplay, Pagination]}
                  className={'heroSwiper'}
                  loop
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                >
                  {heroList.map((item, index) => (
                    <SwiperSlide key={index}>
                      <HeroCard data={item} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
        )}
        {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
          <div className="w-full col-span-12 lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end mt-[20px]">
            <div className="w-full flex justify-center gap-8">
              <GradientButton width={88} label="Explore" onClick={() => router.push('/explore')} />
              <OutlineButton
                label="Create"
                borderWidth={2}
                width={88}
                borderColor={'var(--see-more-border)'}
                onClick={() => dispatch({ type: 'set', openCreateNFTModal: true })}
              />
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <CreateNFTModal open={openCreateNFTModal} close={() => handleCloseCreateNFTModal()} />
    </section>
  )
}

export default MainSection

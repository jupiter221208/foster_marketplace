import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'
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
import GreenGradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'
import HeroCard from 'components/Card/HeroCard'
import CreateNFTModal from 'components/Modal/CreateNFTModal'

// custom functions
import { useViewport } from 'utils'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import EllipseGreenLight from 'assets/icons/ellipse-green-light.svg'
import FosterEnhancedIcon from 'assets/icons/foster-enhanced.svg'
import FosterEnhancedLightIcon from 'assets/icons/foster-enhanced-dark.svg'
import FosterEnhancedMobile from 'assets/icons/foster-enhanced-mobile.svg'
import FosterEnhancedLightMobile from 'assets/icons/foster-enhanced-mobile-dark.png'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import GradientButton from 'components/Button/GradientButton'

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

  const lightMode = useSelector(state => (state as any).lightMode)

  return (
    <section id="main-section" className={styles.container}>
      <div className={styles.topLeftEllipse}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '652' : '2021'}
          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '652' : '2021'}
          viewBox="0 0 2321 2321"
        >
          <defs>
            <radialGradient id="radial-gradient" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="var(--ellipse-svg-1)" stopOpacity="0.404" />
              <stop offset="1" stopColor="var(--ellipse-svg-2)" stopOpacity="0" />
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
      <div className={styles.topRightEllipse}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '652' : '2021'}
          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '652' : '2021'}
          viewBox="0 0 2321 2321"
        >
          <defs>
            <radialGradient id="radial-gradient" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="var(--ellipse-svg-1)" stopOpacity="0.404" />
              <stop offset="1" stopColor="var(--ellipse-svg-2)" stopOpacity="0" />
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
      <div className="w-full grid grid-cols-12 z-10 items-center">
        <div className="hidden lg:block lg:col-span-7 xl:col-span-7">
          {/* <p className="w-full flex justify-start">
            <span className={styles.whiteTitle}>The&nbsp;</span>
            <span className={styles.greenTitle}>House of Art,&nbsp;</span>
            <span className={styles.whiteTitle}>Solana Deserves</span>
          </p> */}
          {/* <Image
            src={lightMode ? FosterEnhancedLightIcon : FosterEnhancedIcon}
            width={624}
            height={141}
            alt=""
            objectFit="cover"
          /> */}

          {lightMode ? <FosterEnhancedLightIcon /> : <FosterEnhancedIcon />}

          <div className={styles.text}>Home to the Next Generation of Digital Creators.</div>

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
        <div
          className="w-full col-span-12 lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end lg:py-6"
          style={{
            width: viewport === 'xs' || viewport === 'sm' ? 'calc(100% + 32px)' : '100%',
            marginLeft: viewport === 'xs' || viewport === 'sm' ? '-16px' : '0px',
          }}
        >
          {viewport === 'xs' || viewport === 'md' || viewport === 'sm' ? (
            <div className={styles.contentArea}>
              <Image
                src={lightMode ? FosterEnhancedLightMobile : FosterEnhancedMobile}
                width={278}
                height={42}
                alt=""
                objectFit="cover"
              />
              <div className={styles.cardText}>CREATE. COLLECT. CURATE.</div>
            </div>
          ) : (
            <></>
          )}
          <div className="max-w-[550px] w-full mt-[85px] lg:mt-[0px]">
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

        {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
          <div className="w-full col-span-12 lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end mt-[20px]">
            <div className="w-full flex justify-center gap-8">
              <GradientButton
                backgroundColor01={'var(--explore-btn-bg-1)'}
                backgroundColor02={'var(--explore-btn-bg-2)'}
                width={88}
                label="Explore"
                onClick={() => router.push('/explore')}
              />
              <OutlineButton
                label="Create"
                borderWidth={2}
                width={88}
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

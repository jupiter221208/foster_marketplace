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
import FosterEnhancedLightMobile from 'assets/icons/foster-enhanced-mobile-dark.svg'

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
      <div className={`${styles.topLeftEllipse} ${lightMode ? '!opacity-100' : 'opacity-40'}`}>
        <Image src={lightMode ? EllipseGreenLight : EllipseGreen} alt="" objectFit="cover" />
      </div>
      <div className={`${styles.topRightEllipse} ${lightMode ? '!opacity-100' : 'opacity-40'}`}>
        <Image src={lightMode ? EllipseGreenLight : EllipseGreen} alt="" objectFit="cover" />
      </div>
      <div className="w-full grid grid-cols-12 z-10 items-center">
        <div className="hidden lg:block lg:col-span-7 xl:col-span-7">
          {/* <p className="w-full flex justify-start">
            <span className={styles.whiteTitle}>The&nbsp;</span>
            <span className={styles.greenTitle}>House of Art,&nbsp;</span>
            <span className={styles.whiteTitle}>Solana Deserves</span>
          </p> */}
          <Image
            src={lightMode ? FosterEnhancedLightIcon : FosterEnhancedIcon}
            width={610}
            height={94}
            alt=""
            objectFit="cover"
          />

          <div className={`${styles.text} ${lightMode ? styles.lightText : ''}`}>
            CREATED FOR ARTISTS. CURATED BY YOU.
          </div>

          {viewport !== 'xs' && viewport !== 'sm' && viewport !== 'md' ? (
            <div className="mt-[35px] lg:mt-[50px] xl:mt-[70px] 2xl:mt-[90px] flex justify-center lg:justify-start gap-8">
              <GradientButton
                backgroundColor01={lightMode ? '#202427' : '#5ac3ba'}
                backgroundColor02={lightMode ? '#121212' : '#378287'}
                gradientDirection={lightMode ? 'bottom' : 'left'}
                color={lightMode ? '#95DBD5' : ''}
                label="Explore"
                width={124}
                onClick={() => router.push('/explore')}
              />
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
              <div className={`${styles.count} ${lightMode ? styles.lightCount : ''}`}>{artworkCnt}</div>
              <div className={`${styles.countText} ${lightMode ? styles.lightCountText : ''}`}>Artworks</div>
            </div>
            <div className="block items-center">
              <div className={`${styles.count} ${lightMode ? styles.lightCount : ''}`}>{collectionCnt}</div>
              <div className={`${styles.countText} ${lightMode ? styles.lightCountText : ''}`}>Collections</div>
            </div>
            <div className="block">
              <div className={`${styles.count} ${lightMode ? styles.lightCount : ''}`}>{nftCnt}</div>
              <div className={`${styles.countText} ${lightMode ? styles.lightCountText : ''}`}>Ecosystem</div>
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
              {/* <div className="flex justify-center">
                <div className={styles.cardTitle}>The&nbsp;</div>
                <div className={styles.cardGreenTitle}>House of Art,</div>
                <div className={styles.cardTitle}>&nbsp;Solana Deserves</div>
              </div> */}
              <Image
                src={lightMode ? FosterEnhancedLightMobile : FosterEnhancedMobile}
                width={278}
                height={42}
                alt=""
                objectFit="cover"
              />

              <div className={lightMode ? styles.lightCardText : styles.cardText}>CREATE. COLLECT. CURATE.</div>
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
                className={lightMode ? 'lightHeroSwiper' : 'heroSwiper'}
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
              <GreenGradientButton width={88} label="Explore" onClick={() => router.push('/explore')} />
              <OutlineButton
                // borderColor="#fff"
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

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

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'

const MainSection = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const openCreateNFTModal = useSelector<any>(state => state.openCreateNFTModal)
  const [heroList, setHeroList] = useState<any[]>([])

  const handleCloseCreateNFTModal = () => {
    dispatch({ type: 'set', openCreateNFTModal: false })
  }

  useEffect(() => {
    dashboardAPI.getDashboardBanner().then(
      response => {
        if (response !== null && response !== undefined) {
          setHeroList(response.featured_nfts)
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
        <Image src={EllipseGreen} alt="" objectFit="cover" />
      </div>
      <div className={styles.topRightEllipse}>
        <Image src={EllipseGreen} width={1705} height={1705} alt="" objectFit="cover" />
      </div>
      <div className="w-full grid grid-cols-12 z-10 items-center">
        <div className="hidden lg:block lg:col-span-7 xl:col-span-7">
          <p className="w-full flex justify-start">
            <span className={styles.whiteTitle}>The&nbsp;</span>
            <span className={styles.greenTitle}>House of Art,&nbsp;</span>
            <span className={styles.whiteTitle}>Solana Deserves</span>
          </p>
          <div className={styles.text}>
            Created for Artists. Curated by You.
            <br />
            Foster The Flavor.
          </div>

          {viewport !== 'xs' && viewport !== 'sm' && viewport !== 'md' ? (
            <div className="mt-[35px] lg:mt-[50px] xl:mt-[70px] 2xl:mt-[85px] flex justify-center lg:justify-start gap-8">
              <GreenGradientButton label="Explore" width={124} onClick={() => router.push('/explore')} />
              <OutlineButton
                label="Create"
                width={124}
                onClick={() => dispatch({ type: 'set', openCreateNFTModal: true })}
              />
            </div>
          ) : (
            <></>
          )}
          <div className="hidden lg:flex lg:mt-16 xl:mt-[80px] 2xl:mt-[140px] flex-wrap lg:gap-6 xl:gap-10 2xl:gap-20">
            <div className="block">
              <div className={styles.count}>27k+</div>
              <div className={styles.countText}>Artworks</div>
            </div>
            <div className="block">
              <div className={styles.count}>17k+</div>
              <div className={styles.countText}>Collections</div>
            </div>
            <div className="block">
              <div className={styles.count}>12k+</div>
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
              <div className="flex justify-center">
                <div className={styles.cardTitle}>The&nbsp;</div>
                <div className={styles.cardGreenTitle}>House of Art</div>
                <div className={styles.cardTitle}>, Solana Deserves</div>
              </div>
              <div className={styles.cardText}>CREATED FOR ARTISTS. CURATED BY YOU.</div>
              <div className={styles.cardText}>FOSTER THE FLAVOR.</div>
            </div>
          ) : (
            <></>
          )}
          <div className="max-w-[550px] w-full mt-[110px] lg:mt-[0px]">
            {heroList.length !== 0 && (
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                pagination={{
                  clickable: true,
                }}
                modules={[Autoplay, Pagination]}
                className="heroSwiper"
                loop
                autoplay={{
                  delay: 500000,
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
          <div className="w-full col-span-12 lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full flex justify-center gap-8">
              <GreenGradientButton width={88} label="Explore" onClick={() => router.push('/explore')} />
              <OutlineButton
                borderColor="#fff"
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

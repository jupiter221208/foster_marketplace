import React, { useState } from 'react'

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
import HeroGreenIcon from 'assets/icons/hero-green.svg'
// json
import HeroList from 'assets/json/hero.json'

// styles
import styles from './index.module.scss'

const MainSection = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const openCreateNFTModal = useSelector<any>(state => state.openCreateNFTModal)

  const handleCloseCreateNFTModal = () => {
    dispatch({ type: 'set', openCreateNFTModal: false })
  }

  return (
    <section id="main-section" className={styles.container}>
      <div className={styles.topLeftEllipse}>
        <Image src={EllipseGreen} alt="" objectFit="cover" />
      </div>
      <div className={styles.topRightEllipse}>
        <Image src={EllipseGreen} width={1705} height={1705} alt="" objectFit="cover" />
      </div>
      <div className="w-full grid grid-cols-12 z-10 gap-8 items-center">
        <div className="col-span-12 lg:col-span-7 xl:col-span-7">
          <div className={styles.whiteTitle}>The Art of Blockchain</div>
          <div className={styles.heroTextContainer}>
            <div className={styles.greenTitle}>Foster the Flav</div>
            <div className={styles.heroGreen}>
              <Image
                src={HeroGreenIcon}
                width={
                  viewport === 'xs' ? 19 : viewport === 'sm' ? 22 : viewport === 'md' ? 26 : viewport === 'lg' ? 32 : 42
                }
                height={
                  viewport === 'xs' ? 19 : viewport === 'sm' ? 26 : viewport === 'md' ? 30 : viewport === 'lg' ? 36 : 48
                }
                alt=""
              />
            </div>
            <div className={styles.greenTitle}>r.</div>
          </div>
          {viewport === 'xs' || viewport === 'sm' ? (
            <div className={styles.text}>A Circus of Digital Creators and Curators on Solana - See Everything.</div>
          ) : (
            <div className={styles.text}>A Circus of Digital Creators and Curators on Solana - See Everything.</div>
          )}

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
        <div className="w-full col-span-12 lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end py-6">
          <div className="max-w-[550px] w-full">
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
                delay: 5000,
                disableOnInteraction: false,
              }}
            >
              {HeroList.map((item, index) => (
                <SwiperSlide key={index}>
                  <HeroCard
                    image={item.image}
                    nftName={item.nftName}
                    collectionName={item.collectionName}
                    avatar={item.avatar}
                    artistName={item.artistName}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
          <div className="w-full col-span-12 lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full flex justify-center gap-8">
              <GreenGradientButton width={88} label="Explore" onClick={() => router.push('/explore')} />
              <OutlineButton
                borderColor={viewport === 'lg' ? '#5AC3BA' : '#fff'}
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

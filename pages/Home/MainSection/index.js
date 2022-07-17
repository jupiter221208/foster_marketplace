import React from 'react'

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

// components
import GreenGradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'
import HeroCard from 'components/Card/HeroCard'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'

// json
import HeroList from 'assets/json/hero.json'

// styles
import styles from './index.module.scss'

const MainSection = props => {
  const { viewport } = props
  const router = useRouter()

  return (
    <section id="main-section" className={styles.container}>
      <div className={styles.topLeftEllipse}>
        <Image src={EllipseGreen} alt="" objectFit="cover" />
      </div>
      <div className={styles.topRightEllipse}>
        <Image src={EllipseGreen} alt="" objectFit="cover" />
      </div>
      <div className="w-full grid grid-cols-12 z-10 gap-8 items-center">
        <div className="col-span-12 lg:col-span-6 xl:col-span-7">
          <div className={styles.whiteTitle}>The Art of Blockchain.</div>
          <div className={styles.greenTitle}>Foster Your Flavor.</div>
          <div className={styles.text}>
            An Ecosystem of Digital Creators and Patrons on Solana.
            <br />
            Create, Inspire, and Experience the Digital Drip.
          </div>
          <div className="mt-[35px] lg:mt-[50px] xl:mt-[70px] 2xl:mt-[85px] flex justify-center lg:justify-start gap-8">
            <GreenGradientButton
              label="Explore"
              onClick={() => router.push('/explore')}
              size={viewport === 'sm' && 'h40'}
            />
            <OutlineButton label="Create" onClick={() => router.push('/create')} size={viewport === 'sm' && 'h40'} />
          </div>
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
        <div className="w-full col-span-12 lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end">
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
      </div>
    </section>
  )
}

export default MainSection

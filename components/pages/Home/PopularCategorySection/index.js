import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import OutlineButton from 'components/Button/OutlineButton'
import CategoryCard from 'components/Card/CategoryCard'

// json
import PopularCategoryList from 'assets/json/popular-category.json'

// styles
import styles from './index.module.scss'

const PopularCategorySection = props => {
  const { type, viewport } = props
  const router = useRouter()
  const [categoryList, setCategoryList] = useState([])

  useEffect(() => {
    setCategoryList(PopularCategoryList)
  }, [])
  return (
    <section className={styles.container}>
      <div className="w-full flex justify-center lg:justify-between items-center z-10">
        <div className={styles.title}>{type === 'home' ? 'Popular Categories' : 'Discover Something New'}</div>
        {type === 'home' && (
          <div className="hidden lg:flex">
            <OutlineButton
              label="See More"
              onClick={() => router.push('/see-more')}
              borderColor="#ffffff"
              height="42px"
            />
          </div>
        )}
      </div>
      <div className="w-full mt-[32px] lg:mt-[34px] z-10">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          slidesPerView={
            viewport === 'xs' || viewport === 'sm' ? 1.3 : viewport === 'md' ? 2 : viewport === 'lg' ? 3 : 4
          }
          spaceBetween={30}
          modules={[Autoplay, Lazy, Navigation]}
          className="navigationSwiper"
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {categoryList.map((item, index) => (
            <SwiperSlide key={index}>
              <CategoryCard
                viewport={viewport}
                image={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? item.mobile : item.image}
                name={item.name}
                type={item.type}
                nfts={item.nfts}
                collections={item.collections}
                onClick={() => router.push(`/category/${item.id}`)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        <></>
      ) : (
        type === 'home' && (
          <div className="w-full flex lg:hidden justify-center">
            <div className="w-full max-w-[242px] z-10">
              <OutlineButton
                label="See More"
                fullWidth
                onClick={() => router.push('/see-more')}
                borderColor="#ffffff"
                height="40px"
              />
            </div>
          </div>
        )
      )}
    </section>
  )
}

export default PopularCategorySection

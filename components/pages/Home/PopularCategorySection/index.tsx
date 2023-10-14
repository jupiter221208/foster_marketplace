import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import OutlineButton from 'components/Button/OutlineButton'
import CategoryCard from 'components/Card/CategoryCard'

// custom functions
import { useViewport } from 'utils'

// json
import PopularCategoryList from 'assets/json/popular-category.json'

// styles
import styles from './index.module.scss'

const PopularCategorySection = props => {
  const { type } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [categoryList, setCategoryList] = useState<any[]>([])

  useEffect(() => {
    let random = (Math.random() * 100) % PopularCategoryList.length
    let categoryList = [
      ...PopularCategoryList.slice(random, PopularCategoryList.length),
      ...PopularCategoryList.slice(0, random),
    ]
    setCategoryList(categoryList)
  }, [])

  return (
    <section className={styles.container}>
      <div className="w-full flex justify-center lg:justify-between items-center z-10">
        <div className={styles.title}>{type === 'home' ? 'Explore the Circus' : 'Discover Something New'}</div>
      </div>
      <div className="w-full mt-[4px] lg:mt-[30px] z-10">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          slidesPerView={
            viewport === 'xs' ? 1.7 : viewport === 'sm' ? 2.5 : viewport === 'md' ? 3 : viewport === 'lg' ? 3 : 4
          }
          spaceBetween={viewport === 'xs' ? 10 : 20}
          modules={[Autoplay, Lazy, Navigation]}
          className={'navigationSwiper'}
          loop
          // autoplay={{
          //   delay: 5000,
          //   disableOnInteraction: false,
          // }}
        >
          {categoryList.map((item: any, index) => (
            <SwiperSlide key={index}>
              <CategoryCard
                image={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? item.mobile : item.image}
                name={item.name}
                type={item.type}
                onClick={() => {
                  dispatch({ type: 'set', isLoading: true })
                  router.push(`/category/${item.query.toLowerCase()}`)
                }}
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
                onClick={() => router.push('/explore')}
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

import React, { useState, useEffect } from 'react'
import MerchShopCard from 'components/Card/MerchShopCard'

// styles
import styles from './index.module.scss'
import MerchPhysicalCard from 'components/Card/MerchPysicalCard'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Pagination, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

//apis
import StoreAPI from 'apis/store'
import { getTimeDifference } from 'utils/helpers'

const CreatorMerchShop = props => {
  const { username, userId } = props
  const [merchList, setMerchList] = useState([])
  const [editionList, setEditionList] = useState([])
  const [physicalList, setPhysicalList] = useState([])
  const [screenWidth, setScreenWidth] = useState(375)

  useEffect(() => {
    const resizeFunction = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  useEffect(() => {
    StoreAPI.getStoreItemByFoster(userId).then(
      res => {
        setMerchList(res.filter(item => item.sale_end_at === null || getTimeDifference(item.sale_end_at) > 0))
      },
      error => {}
    )

    StoreAPI.getStoreItemByEdition(userId).then(
      res => {
        setEditionList(res.filter(item => item.sale_end_at === null || getTimeDifference(item.sale_end_at) > 0))
      },
      error => {}
    )

    StoreAPI.getStoreItemByUser(userId).then(
      res => {
        setPhysicalList(
          res.filter(
            item =>
              item.master_edition_address === null &&
              (item.sale_end_at === null || getTimeDifference(item.sale_end_at) > 0)
          )
        )
      },
      error => {}
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full">
      {/* {merchList.length > 0 && <div className={styles.title}>Available merch for sale</div>} */}
      <div className="grid grid-cols-10 sm:grid-cols-20 gap-[9px] sm:gap-[20px] sm:gap-[20px] xl:gap-[30px] mt-[30px]">
        {merchList.map((item, index) => (
          <div className="col-span-5 sm:col-span-10 lg:col-span-5 2xl:col-span-4" key={index}>
            <MerchShopCard username={username} data={item} />
          </div>
        ))}
      </div>

      {editionList.length > 0 && (
        <div className={`${styles.title} mt-[30px] lg:mt-[50px] w-full text-center lg:text-start`}>Merch editions</div>
      )}
      <div className="grid grid-cols-10 sm:grid-cols-20 gap gap-[20px] sm:gap-[20px] xl:gap-[30px] mt-[15px] xl:mt-[30px]">
        {editionList.map((item, index) => (
          <div className="col-span-5 sm:col-span-10 lg:col-span-5 2xl:col-span-4" key={index}>
            <MerchShopCard username={username} data={item} />
          </div>
        ))}
      </div>

      {physicalList.length > 0 && (
        <div className={`${styles.title} mt-[30px] lg:mt-[50px] w-full text-center lg:text-start`}>
          Physicals by {username}
        </div>
      )}
      <div className="sm:block hidden">
        <div className="grid grid-cols-1 sm:grid-cols-20 gap gap-[20px] sm:gap-[20px] xl:gap-[30px] mt-[30px]">
          {physicalList.map((item, index) => (
            <div className="col-span-1 sm:col-span-10 lg:col-span-5 2xl:col-span-4" key={index}>
              <MerchPhysicalCard username={username} data={item} />
            </div>
          ))}
        </div>
      </div>
      <div className="sm:hidden block mt-[15px]">
        <Swiper
          slidesPerView={screenWidth / 327} //1.14
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          className={styles.swiperContainer}
          modules={[Autoplay, Lazy, Navigation, Pagination]}
          // loop
        >
          {physicalList.map((item, index) => (
            <SwiperSlide key={index}>
              <MerchPhysicalCard username={username} data={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default CreatorMerchShop

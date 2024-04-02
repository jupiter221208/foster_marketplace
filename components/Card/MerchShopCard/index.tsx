import React from 'react'
// component
import ImageWithFoster from 'components/ImageWithFoster'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Pagination, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

//images
import SolanaLogoIcon from 'assets/icons/solana-logo-13x11.svg?component'
import ShoppingCartIcon from 'assets/icons/shoppingcart-icon-navbar.svg?component'
import ShareSocialIcon from 'assets/icons/share-social-icon.svg?component'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'

const MerchShopCard = props => {
  const { data } = props

  return (
    <div className={styles.container}>
      <Swiper
        navigation={true}
        spaceBetween={0}
        // pagination={{
        //   clickable: true,
        // }}
        modules={[Autoplay, Lazy, Navigation, Pagination]}
        className={'merchShopCardSwiper'}
        loop
      >
        {data.assets.map((item, index) => (
          <SwiperSlide key={index}>
            <div key={index}>
              <div className={styles.imageArea}>
                <div className={styles.imageContent}>
                  <ImageWithFoster src={item} width={500} className="max-w-full max-h-full object-cover" />
                </div>
              </div>
              <div className="w-full h-[75px]" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="w-full mt-[25px] flex justify-between items-center">
        <div className={styles.nftName}>{data.productName}</div>
        <div className="flex gap-[4px] items-center">
          <div className="mt-[2px]">
            <SolanaLogoIcon />
          </div>
          <div className={styles.price}>{data.price}</div>
        </div>
      </div>
      <div className="w-full mt-[12px] flex justify-between">
        <div className={styles.artistName}>{data.merchType}</div>
        <div className={styles.dollarPrice}>$642.00</div>
      </div>
      <div className="w-full mt-[25px] flex justify-between">
        <div className="flex gap-[11px]">
          <div className={styles.shareBtn}>
            <ShoppingCartIcon />
          </div>
          <div className={styles.shareBtn}>
            <ShareSocialIcon />
          </div>
        </div>
        <GradientButton
          borderRadius={18}
          label="Buy Now"
          backgroundColor01="var(--place-bid-minimum-color)"
          backgroundColor02="var(--place-bid-minimum-color)"
          color="var(--time-slog-bg)"
          width={106}
          height={50}
        />
      </div>
    </div>
  )
}

export default MerchShopCard

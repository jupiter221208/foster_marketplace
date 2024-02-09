import React from 'react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// styles
import styles from './index.module.scss'
import TrendingCollectionCard from 'components/Card/TrendingCollectionCard'

const CollectionSwiperSection = props => {
  const { collections } = props

  return collections.length === 0 ? (
    <section className={styles.container}>
      <div className={styles.noData}>No collections available</div>
    </section>
  ) : (
    <section className={styles.container}>
      <div className="w-full z-10">
        <div className="grid grid-cols-12 gap gap-[11px] lg:gap-[20px] xl:gap-[34px] pb-[30px]">
          {collections.map((item, index) => (
            <div className="col-span-6 lg:col-span-4 xl:col-span-3" key={index}>
              <TrendingCollectionCard
                collectionID={item.collection_id}
                image={item.cover_image}
                collectionName={item.collection_name}
                artistName={item.artist_username}
                nftCount={item.number_in_collections}
                avatar={item.artist_profile_picture}
                key={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CollectionSwiperSection

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
import CollectionCard from 'components/Card/CollectionCard'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

const CollectionSwiperSection = props => {
  const { collections } = props

  const router = useRouter()
  const dispatch = useDispatch()

  const viewport = useViewport()

  const [collectionList, setCollectionList] = useState<any[]>([])

  useEffect(() => {
    let newList: any[] = []
    let tempItem: any[] = []
    collections.map((item, index) => {
      tempItem.push(item)
      if (index % 2 === 1) {
        newList.push(tempItem)
        tempItem = []
      }
    })
    if (tempItem.length > 0) newList.push(tempItem)
    setCollectionList(newList)
  }, [])

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
              <CollectionCard
                image={item.cover_image}
                nftName={item.collection_name}
                artistName={item.artist_username}
                mintAddress={item.artist_id}
                icon={item.artist_profile_picture}
                onClick={() => {
                  dispatch({ type: 'set', isLoading: true })
                  router.push(`/collection/${item.collection_id}`)
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CollectionSwiperSection

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
import LiveAuctionCard from 'components/Card/LiveAuctionCard'

// custom functions
import { useViewport } from 'utils'

// resources
import SeeMoreButton from 'components/Button/SeeMoreButton'
import OutlineButton from 'components/Button/OutlineButton'
import HomeEditionCard from 'components/Card/HomeEditionCard'

// styles
import styles from './index.module.scss'

// call apis

const LimitedEditionSection = props => {
  const { category, editions } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [editionList, setEditionList] = useState<any>([])
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    if (editions && editions != []) setEditionList(editions.filter(item => item.maxSupply !== null && item.maxSupply !== '0'))
  }, [editions])

  useEffect(() => {
    if (editionList.length > 0) {
      ;(async () => {
        for (let index = 0; index < editionList.length; index++) {
          let data = editionList[index]
          fetch(`/nft/${data.tokenId}`).then(e => e.text())
          if (index % 4 == 3) {
            await sleep(1000)
          }
        }
      })()
    }
  }, [editionList])

  return (
    editionList.length > 0 && (
      <section className={styles.container}>
        <div className="w-full flex justify-between items-center z-10 ml-[5px]">
          <div className={styles.title}>Limited&nbsp;Editions</div>
          <div className="z-10 sm:block hidden">
            <SeeMoreButton
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 0 })
                dispatch({ type: 'set', availabilityFilter: 2 })
                dispatch({ type: 'set', artworkCategory: category })
                router.push('/explore')
              }}
            />
          </div>
        </div>
        <div className="w-full mt-[25px] lg:mt-[30px] z-10 px-[10]">
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={
              viewport === 'xs'
                ? 1.13
                : viewport === 'sm' || viewport === 'md'
                ? 2
                : viewport === '2xl'
                ? 5
                : viewport === 'xl'
                ? 4
                : 4
            }
            spaceBetween={
              viewport === 'xs' ? 9 : viewport === 'sm' || viewport === 'md' ? 30 : viewport === 'lg' ? 26 : 26
            }
            modules={[Navigation]}
            className={
              editionList.length > 4
                ? 'auctionNavigationSwiper'
                : (viewport === 'lg' || viewport === 'xl') && editionList.length > 3
                ? 'auctionNavigationSwiper'
                : 'noScrollNavigationSwiper'
            }
          >
            {editionList.map((item, index) => (
              <SwiperSlide key={index}>
                <HomeEditionCard data={item} onClick={() => {}} key={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="w-full flex sm:hidden justify-center lg:mt-0 mt-[20px]">
          <div className="w-full max-w-[300px] z-10">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 0 })
                dispatch({ type: 'set', availabilityFilter: 2 })
                dispatch({ type: 'set', artworkCategory: category })
                router.push('/explore')
              }}
              fontSize="16px"
              height="41px"
              borderRadius="8px"
            />
          </div>
        </div>
      </section>
    )
  )
}

export default LimitedEditionSection

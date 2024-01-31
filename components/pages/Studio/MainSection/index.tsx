import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { EffectCoverflow, Autoplay, Pagination, Navigation } from 'swiper'
import Hero1List from 'assets/json/hero/hero-list.json'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import { useDispatch, useSelector } from 'react-redux'

// components
import OutlineButton from 'components/Button/OutlineButton'
import StudioCard from 'components/Card/StudioCard'
import CreateNFTModal from 'components/Modal/CreateNFTModal'

// custom functions
import { useViewport } from 'utils'

import Image from 'next/image'

// images and icons
import StudioAvatar from 'assets/images/logo-02.png'
import StudioTitle from 'assets/icons/logo-studio.svg?component'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import GradientButton from 'components/Button/GradientButton'
import StudioHeroCardMobile from 'components/Card/StudioCardMobile'
import StudioHeroList from 'assets/json/hero/hero-list.json'
import StudioHeroMobileList from 'assets/json/hero/hero-mobile-list.json'
import StudioApparelList from 'assets/json/hero/hero-apparel-list.json'
import { NextButton, PreviewButton } from './customButton'
SwiperCore.use([Navigation])

const MainSection = ({ onchange, heroValue }) => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const firstLoaded = useSelector<any>(state => state.firstLoaded)
  const openCreateNFTModal = useSelector<any>(state => state.openCreateNFTModal)
  const [studioHeroList, setStudioHeroList] = useState(StudioHeroList)
  const [heroList, setHeroList] = useState<any[]>([])
  const [artworkCnt, setArtworkCnt] = useState()
  const [collectionCnt, setCollectionCnt] = useState()
  const [nftCnt, setNftCnt] = useState()
  const [swiper, setSwiper] = useState(null)

  useEffect(() => {
    StudioApparelList.map(item => {
      if (item.name === 'Hoodie') {
        onchange({
          selected: true,
          data: item,
        })
      }
    })
  }, [])

  const handleCloseCreateNFTModal = () => {
    dispatch({ type: 'set', openCreateNFTModal: false })
  }

  useEffect(() => {
    if (!firstLoaded) {
      setTimeout(() => {
        dispatch({ type: 'set', firstLoaded: true })
      }, 2000)
    }
    error => {
      console.log(error)
    }
  }, [])

  const onSelected = (type, name, base) => {
    let newStudioList = []
    studioHeroList.map(studioData => {
      if (studioData.type === type) {
        let newData = { ...studioData }
        let newBases = []
        newData.bases.map(item => {
          if (item.name === name) item.selected = 'true'
          else item.selected = 'false'
          newBases.push(item)
        })
        newData['bases'] = newBases
        newStudioList.push(newData)

        StudioApparelList.map(item => {
          if (item.name === base) {
            onchange({
              selected: true,
              data: item,
            })
          }
          setTimeout(() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth',
            })
          }, 1000)
        })
      } else {
        let newData = { ...studioData }
        let newBases = []
        newData.bases.map(item => {
          item.selected = 'false'
          newBases.push(item)
        })
        newData['bases'] = newBases
        newStudioList.push(newData)
      }
    })
    setStudioHeroList(newStudioList)
  }

  return (
    <section id="main-section" className={styles.container}>
      <div className="g-container w-full h-full z-10">
        <div className="w-full">
          <div className="mt-[90px]">
            <div className={styles.text}>
              Solana Couture<span className={styles.slash}>&nbsp;/&nbsp;</span>By Foster Studio
            </div>
            <div className={styles.slug}>Fashion & Fulfillment</div>
            <div className="mt-[75px] flex gap-[20px]">
              <GradientButton
                backgroundColor01="var(--hero-artist-color)"
                backgroundColor02="var(--hero-artist-color)"
                width={150}
                height={50}
                label="Start Earning"
              />
              <OutlineButton width={150} height={50} borderColor="var(--follow-btn-border-mobile)" label="Dashboard" />
            </div>
          </div>

          <div className="w-full flex justify-around mt-[75px] gap-[20px]">
            {studioHeroList.map((item, index) => (
              <div key={index}>
                <StudioCard data={item} onSelected={onSelected} value={heroValue} />
              </div>
            ))}
          </div>
        </div>

        {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
          <div
            className="w-full min-h-[508px]"
            style={{
              width: viewport === 'xs' || viewport === 'sm' ? 'calc(100% + 32px)' : '100%',
              marginLeft: viewport === 'xs' || viewport === 'sm' ? '-16px' : '0px',
            }}
          >
            <div className={styles.contentArea}>
              <div className={styles.mobileTitle}>Solana Couture: Fashion & Fulfillment</div>
            </div>
            {StudioHeroList.length !== 0 && (
              <div className="w-full relative px-[20px]" id="heroSwiperMobile">
                <Swiper
                  slidesPerView={1}
                  spaceBetween={0}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Pagination]}
                  className={'heroMobileStudioSwiper'}
                  loop
                >
                  <div>
                    {StudioHeroList.map((item, index) => (
                      <SwiperSlide key={index} className="">
                        <StudioHeroCardMobile data={item} change={onchange} value={heroValue} />
                        <div className={styles.overlay} />
                      </SwiperSlide>
                    ))}
                  </div>
                </Swiper>
              </div>
            )}
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className={styles.gradient}></div>
      <CreateNFTModal open={openCreateNFTModal} close={() => handleCloseCreateNFTModal()} />
    </section>
  )
}

export default MainSection

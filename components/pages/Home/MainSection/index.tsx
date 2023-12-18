import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination, Navigation } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import { useDispatch, useSelector } from 'react-redux'

// components
import OutlineButton from 'components/Button/OutlineButton'
import HeroCard from 'components/Card/HeroCard'
import CreateNFTModal from 'components/Modal/CreateNFTModal'

// custom functions
import { useViewport } from 'utils'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg?component'

// styles
import styles from './index.module.scss'

// call apis
import dashboardAPI from 'apis/dashboard'
import GradientButton from 'components/Button/GradientButton'
import HeroCardMobile from 'components/Card/HeroCardMobile'

const MainSection = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const firstLoaded = useSelector<any>(state => state.firstLoaded)
  const openCreateNFTModal = useSelector<any>(state => state.openCreateNFTModal)
  const [heroList, setHeroList] = useState<any[]>([])
  const [artworkCnt, setArtworkCnt] = useState()
  const [collectionCnt, setCollectionCnt] = useState()
  const [nftCnt, setNftCnt] = useState()
  const [isSwiperShow, SetIsSwiperShow] = useState(false)

  const handleCloseCreateNFTModal = () => {
    dispatch({ type: 'set', openCreateNFTModal: false })
  }

  const swiperInit = () => {
    setTimeout(() => {
      SetIsSwiperShow(true)
    }, 500)
  }

  useEffect(() => {
    // Prefetch the hero cards
    if (heroList.length > 0) {
      console.log(heroList[0].token_id, '===========1========')
      console.log(heroList[1].token_id, '===========2========')
      console.log(heroList[2].token_id, '===========3========')

      router.prefetch(`/nft/${heroList[0].token_id}`)
      router.prefetch(`/nft/${heroList[1].token_id}`)
      router.prefetch(`/nft/${heroList[2].token_id}`)
    }
  }, [heroList])

  useEffect(() => {
    dashboardAPI.getDashboardBanner().then(
      response => {
        if (response !== null && response !== undefined) {
          setHeroList(response.featured_nfts)
          setNftCnt(response.stats.users)
          setCollectionCnt(response.stats.collections)
          setArtworkCnt(response.stats.nfts)
        }
        if (!firstLoaded) {
          setTimeout(() => {
            dispatch({ type: 'set', firstLoaded: true })
          }, 2000)
        }
      },
      error => {
        console.log(error)
      }
    )
  }, [])

  return (
    <section id="main-section" className={styles.container}>
      <div className="w-full grid grid-cols-12 z-10 items-center">
        {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && (
          <div className="col-span-12">
            <div className={styles.text}>Your Daily Dose of Art</div>
            <div className={styles.slug}>
              {/* Home to creators, collectors, and curators around the world.
              <br /> */}
              Pushing the Boundaries of Digital Art on Solana.
            </div>

            {/* <div className="hidden lg:flex lg:mt-1 xl:mt-[80px] 2xl:mt-[190px] flex-wrap lg:gap-6 xl:gap-10 2xl:gap-20">
              <div className="block">
                <div className={styles.count}>{artworkCnt}</div>
                <div className={styles.countText}>Artworks</div>
              </div>
              <div className="block items-center">
                <div className={styles.count}>{collectionCnt}</div>
                <div className={styles.countText}>Collections</div>
              </div>
              <div className="block">
                <div className={styles.count}>{nftCnt}</div>
                <div className={styles.countText}>Ecosystem</div>
              </div>
            </div> */}
          </div>
        )}
        {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
          <div
            className="w-full col-span-12 min-h-[508px]"
            style={{
              width: viewport === 'xs' || viewport === 'sm' ? 'calc(100% + 32px)' : '100%',
              marginLeft: viewport === 'xs' || viewport === 'sm' ? '-16px' : '0px',
            }}
          >
            <div className={styles.contentArea}>
              <div className={styles.mobileTitle}>Your Daily Dose of Art</div>
              <div className={styles.mobileText}>Pushing the Boundaries of Digital Art on Solana.</div>
            </div>
            {heroList.length !== 0 && (
              <div className="w-full relative" id="heroSwiperMobile">
                <Swiper
                  slidesPerView={1}
                  spaceBetween={20}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Pagination]}
                  className={'heroSwiperMobile'}
                  loop
                >
                  {heroList.map((item, index) => (
                    <SwiperSlide key={index}>
                      <HeroCardMobile data={item} />
                      <div className={styles.overlay} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        ) : (
          <div
            className="w-full col-span-12 lg:col-span-12 lg:pt-[20px] "
            style={{
              width: '100%',
              marginLeft: '0px',
              opacity: isSwiperShow ? 1 : 0,
            }}
          >
            <div className="w-full relative mt-[15px]" id="heroSwiper">
              {heroList.length !== 0 && (
                <Swiper
                  navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
                  slidesPerView={3}
                  spaceBetween={0}
                  centeredSlides={true}
                  loop
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Pagination, Navigation]}
                  className={'heroNavigationSwiper'}
                  onInit={swiperInit}
                >
                  {heroList.map((item, index) => (
                    <SwiperSlide key={index}>
                      <HeroCard data={item} />
                    </SwiperSlide>
                  ))}
                  <div className={styles.leftSide} />
                  <div className={styles.rightSide} />
                </Swiper>
              )}
            </div>
            <div className="mt-[35px] lg:mt-[0px] flex justify-center gap-8">
              <GradientButton label="Explore" width={124} onClick={() => router.push('/explore')} />
              <OutlineButton
                label="Create"
                width={124}
                borderWidth={2}
                onClick={() => dispatch({ type: 'set', openCreateNFTModal: true })}
              />
            </div>
          </div>
        )}

        {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
          <div className="w-full col-span-12 lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end lg:mt-[20px]">
            <div className="w-full flex justify-center gap-8">
              <GradientButton
                width={88}
                fontSize={16}
                fontFamily="Muli-SemiBold"
                label="Explore"
                onClick={() => router.push('/explore')}
              />
              <OutlineButton
                label="Create"
                borderWidth={2}
                width={88}
                fontSize={16}
                fontFamily="Muli-SemiBold"
                borderColor={'var(--see-more-border)'}
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

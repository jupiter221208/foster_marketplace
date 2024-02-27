import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
// swiper
import SwiperCore, { Navigation } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import { useDispatch, useSelector } from 'react-redux'

// components
import OutlineButton from 'components/Button/OutlineButton'
import StudioCard from 'components/Card/StudioCard'
import CreateNFTModal from 'components/Modal/CreateNFTModal'

// custom functions
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// images and icons

// styles
import styles from './index.module.scss'

// call apis
import GradientButton from 'components/Button/GradientButton'
import StudioHeroList from 'assets/json/hero/hero-list.json'
import StudioApparelList from 'assets/json/hero/hero-apparel-list.json'
SwiperCore.use([Navigation])

const MainSection = ({ onChange, heroValue }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()
  const firstLoaded = useSelector<any>(state => state.firstLoaded)
  const openCreateNFTModal = useSelector<any>(state => state.openCreateNFTModal)
  const [studioHeroList, setStudioHeroList] = useState(StudioHeroList)

  useEffect(() => {
    StudioApparelList.map(item => {
      if (item.name === 'Short Sleeve') {
        onChange({
          selected: true,
          data: item,
        })
        dispatch({ type: 'set', apparelType: item.name })
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
            onChange({
              selected: true,
              data: item,
            })
            dispatch({ type: 'set', apparelType: item.name })
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
          <div className="mt-[100px] lg:mt-[90px]">
            <div className="w-full lg:block hidden">
              <div className={styles.text}>
                Solana Couture<span className={styles.slash}>&nbsp;/&nbsp;</span>By Foster Studio
              </div>
              <div className={`${styles.slug} lg:flex hidden`}>Fashion & Fulfillment</div>
            </div>
            <div className="mt-[25px] gap-[20px] hidden lg:flex">
              <GradientButton
                width={150}
                height={50}
                label="Start Earning"
                onClick={() => {
                  if (!connected) {
                    setVisible(true)
                    return
                  }
                  dispatch({ type: 'set', activeTab: 1 })
                  router.push(`/merch-logs`)
                }}
              />
              <OutlineButton
                width={150}
                height={50}
                borderColor="var(--follow-btn-border-mobile)"
                label="Dashboard"
                onClick={() => {
                  if (!connected) {
                    setVisible(true)
                    return
                  }
                  router.push(`/merch-logs`)
                }}
              />
            </div>
          </div>

          <div className="hidden lg:flex w-full justify-around mt-[75px] gap-[20px]">
            {studioHeroList.map((item, index) => (
              <div key={index}>
                <StudioCard data={item} onSelected={onSelected} value={heroValue} />
              </div>
            ))}
          </div>
          <div className="lg:hidden w-full flex flex-wrap gap-[16px] mt-[16px]">
            {studioHeroList.map((item, index) => (
              <div key={index}>
                <StudioCard data={item} onSelected={onSelected} value={heroValue} />
              </div>
            ))}
          </div>
          <div className="w-full mt-[58px] flex gap-[20px] block lg:hidden">
            <GradientButton
              fontSize={16}
              fontFamily="Muli-SemiBold"
              fullWidth
              height={45}
              label="Start Earning"
              onClick={() => {
                if (!connected) {
                  setVisible(true)
                  return
                }
                dispatch({ type: 'set', activeTab: 1 })
                router.push(`/merch-logs`)
              }}
            />
            <OutlineButton
              fullWidth
              height={45}
              fontFamily="Muli-SemiBold"
              borderColor="var(--follow-btn-border-mobile)"
              label="Dashboard"
              onClick={() => {
                if (!connected) {
                  setVisible(true)
                  return
                }
                router.push(`/merch-logs`)
              }}
            />
          </div>
        </div>
      </div>
      <div className={styles.gradient}></div>
      <CreateNFTModal open={openCreateNFTModal} close={() => handleCloseCreateNFTModal()} />
    </section>
  )
}

export default MainSection

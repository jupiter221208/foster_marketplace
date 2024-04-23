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
import CreateNFTModal from 'components/Modal/CreateNFTModal'

// custom functions
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// images and icons
import StudioClothBG from 'assets/images/studio-cloth-bg.png'
import StudioCloth from 'assets/images/studio-cloth.png'
import WorldWide from 'assets/icons/studio-world.svg?component'
import EasyCheckout from 'assets/icons/studio-checkout.svg?component'
import QualityThreads from 'assets/icons/studio-quality.svg?component'
import Monetization from 'assets/icons/studio-monetization.svg?component'

// styles
import styles from './index.module.scss'

// call apis
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

  const onSelected1 = (type, name, base) => {
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

  const [items, setItems] = useState([
    // { label: 'All', name: 'All', selected: true },
    { label: 'Tees', name: 'Short Sleeve', selected: false },
    { label: 'Long Sleeves', name: 'Long Sleeve', selected: false },
    { label: 'Hoodies', name: 'Hoodie', selected: false },
    { label: 'Crewnecks', name: 'Sweatshirt', selected: false },
    { label: `Women's Tees`, name: `Women's Short Sleeve`, selected: false },
  ])

  const onSelected = data => {
    let newItems = []
    items.map(item => {
      if (data.name === item.name) {
        newItems.push({ label: item.label, name: item.name, selected: true })
      } else {
        newItems.push({ label: item.label, name: item.name, selected: false })
      }
    })
    setItems(newItems)

    StudioApparelList.map(item => {
      if (item.name === data.name) {
        onChange({
          selected: true,
          data: item,
        })
        dispatch({ type: 'set', apparelType: item.name })
      }
      setTimeout(() => {
        window.scrollTo({
          top: window.innerHeight - 140,
          behavior: 'smooth',
        })
      }, 1000)
    })
  }

  return (
    <section id="main-section" className={styles.container}>
      <div className="g-container w-full h-full z-10">
        <div className="w-full">
          <div className="w-full flex">
            <div className="w-[25%]">
              <div className="w-full h-full flex items-center">
                <div className={styles.information}>
                  <div className={styles.topBorder} />
                  <div className="flex gap-[24px] mt-[27px] items-center">
                    <WorldWide />
                    WORLDWIDE SHIPPING
                  </div>
                  <div className="flex gap-[24px] mt-[25px] items-center">
                    <EasyCheckout />
                    EASY CHECKOUT
                  </div>
                  <div className="flex gap-[24px] mt-[25px] items-center">
                    <QualityThreads />
                    QUALITY ASSURED
                  </div>
                  <div className="flex gap-[24px] mt-[25px] items-center">
                    <Monetization />
                    SEAMLESS MONETIZATION
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-[50%] mt-[66px]">
              <div className="flex justify-center">
                <img src={StudioClothBG.src} alt="" />
              </div>
              <div className="absolute inset-0">
                <div className="flex justify-center mt-[66px]">
                  <img src={StudioCloth.src} alt="" />
                </div>
                <div className={styles.solanaText}>
                  Solana Couture
                  <br />
                  by&nbsp;<span>Foster Studio</span>
                </div>
              </div>
            </div>
            <div className="w-[25%]"></div>
            {/* <div className="w-full lg:block hidden">
              <div className={styles.text}>
                Solana Couture<span className={styles.slash}>&nbsp;/&nbsp;</span>By Foster Studio
              </div>
              <div className={`${styles.slug} lg:flex hidden`}>Fashion & Fulfillment</div>
            </div> */}
            {/* <div className="mt-[25px] gap-[20px] hidden lg:flex">
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
            </div> */}
          </div>
          <div className="flex justify-center mt-[150px]">
            <div className={styles.connecting}>Connecting creators with their audience through fashion.</div>
          </div>
          <div className="w-full flex justify-center">
            <div className="flex gap-[25px] mt-[60px]">
              {items.map((item, index) => (
                <div
                  key={index}
                  className={item.selected ? styles.selected : styles.unselected}
                  onClick={() => onSelected(item)}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          {/* <div className="hidden lg:flex w-full justify-around mt-[75px] gap-[20px]">
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
          </div> */}
          {/* <div className="w-full mt-[58px] flex gap-[20px] block lg:hidden">
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
          </div> */}
        </div>
      </div>
      {/* <div className={styles.gradient}></div> */}
      <CreateNFTModal open={openCreateNFTModal} close={() => handleCloseCreateNFTModal()} />
    </section>
  )
}

export default MainSection

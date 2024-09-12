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

// images and icons
import StudioClothBG from 'assets/images/studio-cloth-bg.png'
import StudioCloth from 'assets/images/studio-cloth.png'

// styles
import styles from './index.module.scss'

// call apis
import StudioApparelList from 'assets/json/hero/hero-apparel-list.json'
SwiperCore.use([Navigation])

const MainSection = ({ onChange, heroValue }) => {
  const dispatch = useDispatch()
  const firstLoaded = useSelector<any>(state => state.firstLoaded)
  const openCreateNFTModal = useSelector<any>(state => state.openCreateNFTModal)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [items, setItems] = useState([
    { label: 'All', name: 'All', selected: true },
    { label: 'Tees', name: 'Short Sleeve', selected: true },
    { label: 'Long Sleeves', name: 'Long Sleeve', selected: false },
    { label: 'Hoodies', name: 'Hoodie', selected: false },
    { label: 'Crewnecks', name: 'Sweatshirt', selected: false },
    { label: `Women's Tees`, name: `Women's Short Sleeve`, selected: false },
  ])

  return (
    <section id="main-section" className={styles.container}>
      <div className="g-container w-full h-full z-10">
        <div className="w-full">
          <div className="w-full lg:flex hidden justify-center">
            <div className="relative w-[50%] mt-[74px] mt-[66px]">
              <div className="flex justify-center">
                <img src={StudioClothBG.src} alt="" />
              </div>
              <div className="absolute inset-0">
                <div className="flex justify-center mt-[66px]">
                  <img src={StudioCloth.src} alt="" />
                </div>
                <div className={styles.solanaText}>
                  Solana&nbsp;Fashion
                  <br />
                  <span>On-Demand</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:hidden block">
            <div className="w-full flex justify-center">
              <div className="relative w-[76%] mt-[74px]">
                <div className="w-full flex justify-center">
                  <img src={StudioClothBG.src} alt="" />
                </div>
                <div className="absolute inset-0">
                  <div className="flex justify-center mt-[45px]">
                    <img src={StudioCloth.src} alt="" />
                  </div>
                  <div className="w-full flex justify-center">
                    <div className={styles.solanaText}>
                      Solana&nbsp;Fashion
                      <br />
                      <span>On-Demand</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateNFTModal open={openCreateNFTModal} close={() => handleCloseCreateNFTModal()} />
    </section>
  )
}

export default MainSection

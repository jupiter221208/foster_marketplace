import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

import OutlineButton from 'components/Button/OutlineButton'
import SeeMoreButton from 'components/Button/SeeMoreButton'
import TimeSlotButton from 'components/Button/TimeSlotButton'
import LiveAuctionSection from '../LiveAuctionSection'
import ActiveListingSection from '../ActiveListingSection'

const SubTabSection = props => {
  const { category, artist, fromPage, setLiveAuctionLoaded, setActiveListingLoaded } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [liveAuctionList, setLiveAuctionList] = useState<any[]>([])
  const [active, setActive] = useState<any>(0)
  const [cardLoop, setCardLoop] = useState(true)
  const [type, setType] = useState('recent_started')
  const [isLoaded, setIsLoaded] = useState(false)
  const [showSection, setShowSection] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)

  // useEffect(() => {
  //   getLiveAuctionsFromServer(category, artist, 'recent_started')
  // }, [artist, category])

  const handleChangeActive = value => {
    setActive(value)

    // switch (value) {
    //   case 0:
    //     getLiveAuctionsFromServer(category, artist, 'upcoming')
    //     setType('upcoming')
    //     break
    //   case 1:
    //     getLiveAuctionsFromServer(category, artist, 'recent_started')
    //     setType('recent_started')
    //     break
    // }
  }

  useEffect(() => {}, [liveAuctionList])

  return showSection ? (
    <section className={styles.container}>
      {fromPage !== 'profile' && (
        <div className="w-full lg:w-auto flex items-center gap-4 lg:gap-8 mb-[0px] lg:mb-[50px]">
          <div className={`w-full flex justify-center items-center z-10`}>
            <div className={fromPage === 'profile' ? styles.smallTitle : styles.title}>Live Auctions</div>
          </div>
        </div>
      )}
      <div className="w-full flex lg:hidden justify-center h-[54px] mt-[15px] z-10">
        <div className={styles.slotBG}>
          <TimeSlotButton
            label="Fixed Price"
            onClick={() => handleChangeActive(0)}
            fontFamily={'Muli-SemiBold'}
            color={active === 0 ? '#1A1A1A' : '#979EA2'}
            backgroundColor01={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
            backgroundColor02={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
            gradientDirection="bottom"
            width={140}
            boxShadow={active === 0 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
          />
          <TimeSlotButton
            label="Live Auctions"
            onClick={() => handleChangeActive(1)}
            fontFamily={'Muli-SemiBold'}
            color={active === 1 ? '#1A1A1A' : '#979EA2'}
            backgroundColor01={active === 1 ? 'var(--toggle-bg-color)' : 'transparent'}
            backgroundColor02={active === 1 ? 'var(--toggle-bg-color)' : 'transparent'}
            gradientDirection="bottom"
            width={140}
            boxShadow={active === 1 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
          />
        </div>
      </div>
      <div className="w-full flex justify-between z-10 flex-col items-start">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start items-start gap-4 lg:gap-8">
          <div className="hidden lg:flex w-full h-[54px] ml-[18px] z-10">
            <div className={styles.slotBG}>
              <TimeSlotButton
                label="Fixed Price"
                onClick={() => handleChangeActive(0)}
                fontFamily={'Muli-SemiBold'}
                color={active === 0 ? '#1A1A1A' : '#979EA2'}
                backgroundColor01={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
                backgroundColor02={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
                gradientDirection="bottom"
                width={140}
                boxShadow={active === 0 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
              />
              <TimeSlotButton
                label="Live Auctions"
                onClick={() => handleChangeActive(1)}
                fontFamily={'Muli-SemiBold'}
                color={active === 1 ? '#1A1A1A' : '#979EA2'}
                backgroundColor01={active === 1 ? 'var(--toggle-bg-color)' : 'transparent'}
                backgroundColor02={active === 1 ? 'var(--toggle-bg-color)' : 'transparent'}
                gradientDirection="bottom"
                width={140}
                boxShadow={active === 1 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
              />
            </div>
          </div>
        </div>
        <div className="hidden lg:flex z-10">
          {fromPage !== 'profile' && (
            <SeeMoreButton
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 0 })
                dispatch({ type: 'set', availabilityFilter: 1 })
                dispatch({ type: 'set', artworkCategory: category })
                router.push('/explore')
              }}
            />
          )}
        </div>
        {active === 0 ? (
          <ActiveListingSection artist={artist} fromPage={'profile'} loadCompleted={setActiveListingLoaded} />
        ) : (
          <LiveAuctionSection
            category={''}
            artist={artist}
            fromPage={'profile'}
            setLiveAuctionLoaded={setLiveAuctionLoaded}
          />
        )}
      </div>

      {fromPage !== 'profile' && (
        <div className="w-full flex lg:hidden justify-center lg:mt-0 mt-[15px]">
          <div className="w-full max-w-[242px] z-10">
            <OutlineButton
              label="See More"
              fullWidth
              onClick={() => {
                dispatch({ type: 'set', exploreTab: 0 })
                dispatch({ type: 'set', availabilityFilter: 1 })
                dispatch({ type: 'set', artworkCategory: category })
                router.push('/explore')
              }}
              borderColor={'var(--see-more-border)'}
              height="40px"
            />
          </div>
        </div>
      )}
    </section>
  ) : fromPage === 'profile' ? (
    <div className="w-full h-[30px] lg:h-[50px]" />
  ) : (
    <></>
  )
}

export default SubTabSection

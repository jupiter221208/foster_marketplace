import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useDispatch, useSelector } from 'react-redux'

// custom components
import SearchBox from 'components/Input/SearchBox'
import Menu from 'components/Menu'
import WalletButton from 'components/Button/WalletButton'
import ProfileMenu from 'components/Menu/ProfileMenu'
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'

// custom functions
import { useViewport } from 'utils'

// images and icons
import AvatarImage from 'assets/images/dashboard-avatar.png'
import SearchWhiteIcon from 'assets/icons/search-white.svg?component'
import DarkLightModeIcon from 'assets/icons/dark-light-mode-mobile.svg?component'
import LightDarkModeIcon from 'assets/icons/light-dark-mode-mobile.svg?component'

// json
import ExploreMenuList from 'assets/json/explore-menu.json'
import CreateMenuList from 'assets/json/create-menu.json'
import ProfileMenuList from 'assets/json/profile-menu.json'

// styles
import styles from './index.module.scss'

// call apis
import authAPI from 'apis/auth'
import searchAPI from 'apis/search'
import { setColorTheme } from 'utils/helpers'

const PrimaryHeader = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const loginAndRefresh = useSelector(state => (state as any).loginAndRefresh)
  const [lightMode, setLightMode] = useState(useSelector(state => (state as any).lightMode))
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchList, setSearchList] = useState({ nfts: [], artists: [], collections: [] })
  const [profileImage, setProfileImage] = useState('')
  let timer = null

  const handleThemeMode = () => {
    setColorTheme(!lightMode)
    dispatch({ type: 'set', lightMode: !lightMode })
    setLightMode(!lightMode)
  }

  useEffect(() => {
    if (searchKeyword !== '' && searchKeyword.length >= 2) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      timer = setTimeout(() => {
        searchAPI.search(searchKeyword).then(
          response => {
            let object: any = {}
            object.nfts = response.nfts
            object.artists = response.artists
            object.collections = response.collections
            setSearchList(object)
          },
          error => {
            console.log(error)
          }
        )
      }, 500)
    } else {
      setSearchList({ nfts: [], artists: [], collections: [] })
    }
  }, [searchKeyword])

  const handleClear = () => {
    setSearchKeyword('')
    setSearchList({ nfts: [], artists: [], collections: [] })
  }

  const handleClose = () => {
    setSearchKeyword('')
    setSearchList({ nfts: [], artists: [], collections: [] })
  }

  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const openMobileMenu = useSelector(state => (state as any).openMobileMenu)
  const openMobileSearchBox = useSelector(state => (state as any).openMobileSearchBox)
  const profileInfo = useSelector(state => (state as any).profileInfo)
  const routePath = router.pathname

  // update profile menu list
  const [profileMenuList, setProfileMenuList] = useState(ProfileMenuList)
  useEffect(() => {
    if (publicKey !== null) {
      let array = [...profileMenuList]
      array.forEach(item => {
        if (item.label === 'Profile' && item.path === '/artist-profile?id=') {
          item.path += publicKey.toString()
        }
      })
      setProfileMenuList(array)
    }
  }, [publicKey])

  useEffect(() => {
    if (profileInfo && profileInfo.profile_picture) {
      setProfileImage(profileInfo.profile_picture)
    }
  }, [profileInfo])

  const handleExploreMenu = item => {
    dispatch({ type: 'set', exploreTab: item.id })
    router.push(item.path)
  }

  const handleOpenMobileSearchBox = () => {
    dispatch({ type: 'set', openMobileSearchBox: !openMobileSearchBox })
  }

  const handleOpenMobileMenu = () => {
    dispatch({ type: 'set', openMobileMenu: !openMobileMenu })
  }

  const handleGotoHomepage = () => {
    dispatch({ type: 'set', openMobileSearchBox: false })
    dispatch({ type: 'set', openMobileMenu: false })
    router.push('/')
  }

  const [offset, setOffset] = useState([0, 0])
  const [profileOffset, setProfileOffset] = useState([0, 0])

  useEffect(() => {
    if (document.getElementById('walletButton') !== null) {
      let offsets = document?.getElementById('walletButton')?.getBoundingClientRect() || { top: 0, left: 0 }
      setOffset([offsets.top, offsets.left])
    }
    if (document.getElementById('profileButton') !== null) {
      let offsets = document?.getElementById('profileButton')?.getBoundingClientRect() || { top: 0, left: 0 }
      setProfileOffset([offsets.top, offsets.left])
    }
  }, [connected])

  useEffect(() => {
    const resizeFunction = () => {
      if (document.getElementById('walletButton') !== null) {
        let offsets = document?.getElementById('walletButton')?.getBoundingClientRect() || { top: 0, left: 0 }
        setOffset([offsets.top, offsets.left])
      }
      if (document.getElementById('profileButton') !== null) {
        let offsets = document?.getElementById('profileButton')?.getBoundingClientRect() || { top: 0, left: 0 }
        setProfileOffset([offsets.top, offsets.left])
      }
    }
    window.addEventListener('resize', resizeFunction)
  }, [connected])

  useEffect(() => {
    if (connected) {
      if (!profileInfo && !loginAndRefresh) {
        authAPI.login({ wallet_id: publicKey?.toBase58() || '' }).then(
          response => {
            if (response.new_user === true) {
              dispatch({ type: 'set', profileSetup: true })
            }
            dispatch({ type: 'set', profileInfo: response.user })
            dispatch({ type: 'set', bidWalletLock: response.bid_wallet_lock })
            dispatch({ type: 'set', offerWalletLock: response.offer_wallet_lock })
          },
          error => {
            console.log(error)
          }
        )
      }
    }
  }, [connected])

  const handleSelectMenu = (item: any) => {
    if (connected) {
      router.push(item.path)
    } else {
      setVisible(true)
    }
  }

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div>
      <div className={styles.blurContainer}>
        <div className={styles.container}>
          <div className="g-container w-full h-full flex justify-between items-center gap-4">
            {routePath !== '/' && (
              <div className={styles.logoArea} onClick={() => router.push('/')}>
                <svg
                  id="Component_2298"
                  data-name="Component 2298"
                  xmlns="http://www.w3.org/2000/svg"
                  width="30.582"
                  height="35.506"
                  viewBox="0 0 30.582 35.506"
                >
                  <path
                    id="Path_105643"
                    data-name="Path 105643"
                    d="M216.776,111.277a1.725,1.725,0,0,1,.341-.9c-1.908-2.484-7.555-8.567-9.842-16.315C207.274,94.06,202.487,101.214,216.776,111.277Z"
                    transform="translate(-206.504 -82.563)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105644"
                    data-name="Path 105644"
                    d="M232,48.433c-7.9-17.439-5.1-23.613-5.1-23.613-1.661.138-5.745,2.863-5.481,6.607.446,6.426,7.13,15.1,9.242,17.7A4.541,4.541,0,0,1,232,48.433Z"
                    transform="translate(-219.58 -21.786)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105645"
                    data-name="Path 105645"
                    d="M279.569,26.2c.17,0,.339,0,.507.012.394-5.721,1.123-19.9.733-23.821-.416-4.156-6.752-2.127-7.72.276-2.737,6.8,2.689,20.2,4.253,23.787A9.6,9.6,0,0,1,279.569,26.2Z"
                    transform="translate(-264.285 0.005)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105646"
                    data-name="Path 105646"
                    d="M341.13,32.516a8.555,8.555,0,0,1,1.386.273c3.259-6.53,5.932-15.09,5.424-20.828-.446-5.03-5.576-4.847-5.576-4.847C343.091,14.449,341.591,28.514,341.13,32.516Z"
                    transform="translate(-324.675 -6.243)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105647"
                    data-name="Path 105647"
                    d="M364.621,40.35c.815,8.236-4.262,18.761-5.891,21.886a3.7,3.7,0,0,1,1.1.708c3.2-4.546,7.465-9.591,8.589-15.647C369.345,42.283,364.621,40.35,364.621,40.35Z"
                    transform="translate(-340.123 -35.419)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105648"
                    data-name="Path 105648"
                    d="M379.983,94.06c-.46,5.98-6.673,13.626-9.193,16.5a1.672,1.672,0,0,1,.174.439C386.354,101.661,379.983,94.06,379.983,94.06Z"
                    transform="translate(-350.709 -82.563)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105649"
                    data-name="Path 105649"
                    d="M300.66,220.27c-2.375,0-4.3.856-4.3,1.919a4.827,4.827,0,0,0,.331,1.885,3.9,3.9,0,0,0,.253.56,1.422,1.422,0,0,1,.225-.295,2.719,2.719,0,0,1,.868-.548,6.936,6.936,0,0,1,2.624-.463,7.594,7.594,0,0,1,2.063.268,3.336,3.336,0,0,1,1.43.743,1.458,1.458,0,0,1,.229.3,4.011,4.011,0,0,0,.252-.56,4.838,4.838,0,0,0,.332-1.885C304.962,221.129,303.037,220.27,300.66,220.27Z"
                    transform="translate(-285.375 -193.345)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105650"
                    data-name="Path 105650"
                    d="M308.11,250.07c-1.823,0-3.3.438-3.3.978s1.478.978,3.3.978,3.3-.438,3.3-.978S309.933,250.07,308.11,250.07Z"
                    transform="translate(-292.795 -219.503)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105651"
                    data-name="Path 105651"
                    d="M314.416,271.442a21.012,21.012,0,0,0-2.689-.755c-.284-.031-.747.037-.747.592s.465,1.881,3.014,1.821c1.088-.024,1.7-.275,1.847-.611S315.737,271.993,314.416,271.442Z"
                    transform="translate(-298.211 -237.595)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105652"
                    data-name="Path 105652"
                    d="M325.229,269.379l2.413.79s.583.174.733-.2.171-.794-.455-.835S323.742,268.891,325.229,269.379Z"
                    transform="translate(-310.4 -236.169)"
                    fill="var(--chevron-up-icon-color)"
                  />
                </svg>
              </div>
            )}
            <div className="w-full max-w-[708px] min-w-[448px] flex items-center">
              <SearchBox
                value={searchKeyword}
                placeholder="Search by NFT, Collection, or Artist"
                onChange={value => setSearchKeyword(value)}
                searchList={searchList}
                onClick={() => handleClear()}
                onClose={() => handleClose()}
              />
              <div className={styles.alphaArea}>
                <svg
                  id="Alpha_Icon_SVG_-_95DBD5_-_Desktop"
                  data-name="Alpha Icon SVG - 95DBD5 - Desktop"
                  xmlns="http://www.w3.org/2000/svg"
                  width="104.19"
                  height="17.641"
                  viewBox="0 0 104.19 17.641"
                >
                  <g id="Alpha_Icon_SVG_-_95DBD5" data-name="Alpha Icon SVG - 95DBD5">
                    <path
                      id="Path_108463"
                      data-name="Path 108463"
                      transform="translate(0 0.091)"
                      fill="var(--mint-btn-bg-1)"
                      fillRule="evenodd"
                    />
                    <path
                      id="Path_108464"
                      data-name="Path 108464"
                      d="M4.846,8.428C2.308,13.1.2,17.018.16,17.131s.612.2,1.534.2H3.3l3.077-5.587C8.07,8.675,9.505,6.161,9.568,6.161s1.139,1.861,2.394,4.137l2.281,4.137-2.337.061-2.337.061v2.779h4.74a22.336,22.336,0,0,0,4.668-.2c-.171-.49-9.312-17.2-9.408-17.2-.059,0-2.184,3.824-4.722,8.5m20.605.3V17.55H36.184V14.756H28.463L28.406,7.4,28.35.036,26.9-.028,25.452-.091v8.82m37.347-.1v8.7h3V-.071h-3v8.7M75.893,3.474V7.02H67.5l.064,1.343.064,1.343,4.132.058,4.132.058v7.512h3V-.071h-3V3.474M90.059,8.428c-2.538,4.674-4.647,8.59-4.686,8.7s.612.2,1.534.2h1.606l3.077-5.587c1.692-3.073,3.128-5.587,3.19-5.587s1.139,1.861,2.394,4.137l2.281,4.137-2.337.061-2.337.061v2.779h4.74a22.336,22.336,0,0,0,4.668-.2c-.172-.49-9.312-17.2-9.408-17.2-.059,0-2.184,3.824-4.722,8.5M42.666,1.272,42.731,2.4l3.971.107c4.174.113,4.424.169,5.393,1.217a3.132,3.132,0,0,1,1.046,2.544,3.134,3.134,0,0,1-1.046,2.544c-1.054,1.14-1.4,1.217-5.6,1.217H42.623V17.55h3V12.673l2.576-.139c4.09-.22,6.085-1.191,7.393-3.6a4.435,4.435,0,0,0,.62-2.684,4.28,4.28,0,0,0-.647-2.7A7.3,7.3,0,0,0,53.9,1.619C52.214.331,51.292.143,46.666.143H42.6l.065,1.128"
                      transform="translate(0 0.091)"
                      fill="var(--mint-btn-bg-1)"
                      fillRule="evenodd"
                    />
                  </g>
                </svg>
              </div>
            </div>
            <div className="cursor-pointer min-w-[40px] xl:min-w-[70px] 2xl:min-w-[280px] flex items-center" />
            <div id="exploreButton" className="h-full w-[100px] min-w-[100px]" />
            <div id="createButton" className="h-full min-w-[80px]" />
            <div id="walletButton" className={connected ? 'h-full min-w-[180px]' : 'h-full min-w-[220px]'} />
            <div id="profileButton" className="h-full min-w-[40px]" />
          </div>
        </div>
      </div>
      {offset[1] !== 0 && (
        <div style={{ zIndex: 10000, position: 'fixed', top: `${offset[0] + 38}px`, left: `${offset[1] - 262}px` }}>
          <Menu label="Explore" menuList={ExploreMenuList} onSelect={item => handleExploreMenu(item)} />
        </div>
      )}
      {offset[1] !== 0 && (
        <div style={{ zIndex: 10000, position: 'fixed', top: `${offset[0] + 38}px`, left: `${offset[1] - 130}px` }}>
          <Menu label="Create" menuList={CreateMenuList} onSelect={item => handleSelectMenu(item)} />
        </div>
      )}
      {offset[1] !== 0 && (
        <div style={{ zIndex: 10000, position: 'fixed', top: `${offset[0] + 25}px`, left: `${offset[1]}px` }}>
          <WalletButton />
        </div>
      )}
      {profileOffset[1] !== 0 && (
        <div
          style={{
            zIndex: 10000,
            position: 'fixed',
            top: `${profileOffset[0] + 27}px`,
            left: `${profileOffset[1] - 0}px`,
          }}
        >
          <ProfileMenu
            avatar={profileImage.length > 0 ? profileImage : AvatarImage}
            menuList={profileMenuList}
            onSelect={item => router.push(item.path)}
            connectWalletStatus={connected}
          />
        </div>
      )}

      <div
        style={{
          zIndex: 10000,
          position: 'fixed',
          width: 83,
          height: 44,
          top: `${profileOffset[0] + 27}px`,
          left: `${profileOffset[1] + 70}px`,
        }}
        onClick={() => handleThemeMode()}
      >
        {lightMode ? <LightDarkModeIcon /> : <DarkLightModeIcon />}
      </div>
    </div>
  ) : (
    <div className={styles.mobileBlurContainer}>
      <div className={styles.mobileContainer}>
        <div className="g-container flex justify-between items-center">
          <div className="flex">
            <div className="cursor-pointer" onClick={() => handleGotoHomepage()}>
              {/* <Image src={lightMode ? LogoDarkIcon : LogoIcon} alt="" /> */}
              <svg
                id="Component_2298"
                data-name="Component 2298"
                xmlns="http://www.w3.org/2000/svg"
                width="30.582"
                height="35.506"
                viewBox="0 0 30.582 35.506"
              >
                <path
                  id="Path_105643"
                  data-name="Path 105643"
                  d="M216.776,111.277a1.725,1.725,0,0,1,.341-.9c-1.908-2.484-7.555-8.567-9.842-16.315C207.274,94.06,202.487,101.214,216.776,111.277Z"
                  transform="translate(-206.504 -82.563)"
                  fill="var(--mint-btn-bg-1)"
                />
                <path
                  id="Path_105644"
                  data-name="Path 105644"
                  d="M232,48.433c-7.9-17.439-5.1-23.613-5.1-23.613-1.661.138-5.745,2.863-5.481,6.607.446,6.426,7.13,15.1,9.242,17.7A4.541,4.541,0,0,1,232,48.433Z"
                  transform="translate(-219.58 -21.786)"
                  fill="var(--mint-btn-bg-1)"
                />
                <path
                  id="Path_105645"
                  data-name="Path 105645"
                  d="M279.569,26.2c.17,0,.339,0,.507.012.394-5.721,1.123-19.9.733-23.821-.416-4.156-6.752-2.127-7.72.276-2.737,6.8,2.689,20.2,4.253,23.787A9.6,9.6,0,0,1,279.569,26.2Z"
                  transform="translate(-264.285 0.005)"
                  fill="var(--mint-btn-bg-1)"
                />
                <path
                  id="Path_105646"
                  data-name="Path 105646"
                  d="M341.13,32.516a8.555,8.555,0,0,1,1.386.273c3.259-6.53,5.932-15.09,5.424-20.828-.446-5.03-5.576-4.847-5.576-4.847C343.091,14.449,341.591,28.514,341.13,32.516Z"
                  transform="translate(-324.675 -6.243)"
                  fill="var(--mint-btn-bg-1)"
                />
                <path
                  id="Path_105647"
                  data-name="Path 105647"
                  d="M364.621,40.35c.815,8.236-4.262,18.761-5.891,21.886a3.7,3.7,0,0,1,1.1.708c3.2-4.546,7.465-9.591,8.589-15.647C369.345,42.283,364.621,40.35,364.621,40.35Z"
                  transform="translate(-340.123 -35.419)"
                  fill="var(--mint-btn-bg-1)"
                />
                <path
                  id="Path_105648"
                  data-name="Path 105648"
                  d="M379.983,94.06c-.46,5.98-6.673,13.626-9.193,16.5a1.672,1.672,0,0,1,.174.439C386.354,101.661,379.983,94.06,379.983,94.06Z"
                  transform="translate(-350.709 -82.563)"
                  fill="var(--mint-btn-bg-1)"
                />
                <path
                  id="Path_105649"
                  data-name="Path 105649"
                  d="M300.66,220.27c-2.375,0-4.3.856-4.3,1.919a4.827,4.827,0,0,0,.331,1.885,3.9,3.9,0,0,0,.253.56,1.422,1.422,0,0,1,.225-.295,2.719,2.719,0,0,1,.868-.548,6.936,6.936,0,0,1,2.624-.463,7.594,7.594,0,0,1,2.063.268,3.336,3.336,0,0,1,1.43.743,1.458,1.458,0,0,1,.229.3,4.011,4.011,0,0,0,.252-.56,4.838,4.838,0,0,0,.332-1.885C304.962,221.129,303.037,220.27,300.66,220.27Z"
                  transform="translate(-285.375 -193.345)"
                  fill="var(--mint-btn-bg-1)"
                />
                <path
                  id="Path_105650"
                  data-name="Path 105650"
                  d="M308.11,250.07c-1.823,0-3.3.438-3.3.978s1.478.978,3.3.978,3.3-.438,3.3-.978S309.933,250.07,308.11,250.07Z"
                  transform="translate(-292.795 -219.503)"
                  fill="var(--mint-btn-bg-1)"
                />
                <path
                  id="Path_105651"
                  data-name="Path 105651"
                  d="M314.416,271.442a21.012,21.012,0,0,0-2.689-.755c-.284-.031-.747.037-.747.592s.465,1.881,3.014,1.821c1.088-.024,1.7-.275,1.847-.611S315.737,271.993,314.416,271.442Z"
                  transform="translate(-298.211 -237.595)"
                  fill="var(--mint-btn-bg-1)"
                />
                <path
                  id="Path_105652"
                  data-name="Path 105652"
                  d="M325.229,269.379l2.413.79s.583.174.733-.2.171-.794-.455-.835S323.742,268.891,325.229,269.379Z"
                  transform="translate(-310.4 -236.169)"
                  fill="var(--mint-btn-bg-1)"
                />
              </svg>
            </div>
            <div className={styles.alphaArea}>
              {/* <Image src={lightMode ? alphaBlackMobileIcon : alphaGreenMobileIcon} alt="" width="71" height="12" /> */}
              <svg
                id="Alpha_Icon_SVG_-_95DBD5_-_Mobile"
                data-name="Alpha Icon SVG - 95DBD5 - Mobile"
                xmlns="http://www.w3.org/2000/svg"
                width="70.98"
                height="12.018"
                viewBox="0 0 70.98 12.018"
              >
                <g id="Alpha_Icon_SVG_-_95DBD5_-_Desktop" data-name="Alpha Icon SVG - 95DBD5 - Desktop">
                  <g id="Alpha_Icon_SVG_-_95DBD5" data-name="Alpha Icon SVG - 95DBD5">
                    <path
                      id="Path_108463"
                      data-name="Path 108463"
                      transform="translate(0 0.091)"
                      fill="var(--mint-btn-bg-1)"
                      fillRule="evenodd"
                    />
                    <path
                      id="Path_108464"
                      data-name="Path 108464"
                      d="M3.35,5.713C1.622,8.9.186,11.565.16,11.641s.416.139,1.045.139H2.3L4.392,7.974C5.544,5.881,6.522,4.168,6.564,4.168s.776,1.268,1.63,2.818L9.746,9.8l-1.591.041-1.591.041v1.894H9.791a15.2,15.2,0,0,0,3.178-.139C12.853,11.307,6.63-.076,6.565-.076c-.04,0-1.487,2.605-3.215,5.789m14.028.205v6.009h7.306v-1.9H19.427L19.389,5.01,19.35,0l-.986-.043-.986-.043V5.918M42.8,5.852v5.929h2.046V-.078H42.8V5.852m8.913-3.514V4.754H46l.043.915.044.915,2.813.04,2.813.04v5.118h2.046V-.078H51.716V2.338M61.36,5.713C59.632,8.9,58.2,11.565,58.17,11.641s.416.139,1.045.139h1.093L62.4,7.974c1.152-2.094,2.129-3.806,2.172-3.806s.776,1.268,1.63,2.818L67.756,9.8l-1.591.041-1.591.041v1.894H67.8a15.2,15.2,0,0,0,3.178-.139c-.117-.334-6.339-11.718-6.4-11.718-.04,0-1.487,2.605-3.215,5.789M29.1.837l.044.769,2.7.073c2.841.077,3.012.115,3.672.829a2.134,2.134,0,0,1,.712,1.733,2.136,2.136,0,0,1-.712,1.733c-.718.777-.956.829-3.811.829H29.067v5.124h2.046V8.6l1.754-.094C35.651,8.36,37.009,7.7,37.9,6.06a3.023,3.023,0,0,0,.422-1.829,2.917,2.917,0,0,0-.441-1.839,4.97,4.97,0,0,0-1.137-1.319C35.6.2,34.969.069,31.819.069H29.052L29.1.837"
                      transform="translate(0 0.091)"
                      fill="var(--mint-btn-bg-1)"
                      fillRule="evenodd"
                    />
                  </g>
                </g>
              </svg>
            </div>
          </div>
          <div className="flex">
            <div className="w-[39px] h-[39px] flex justify-center items-center">
              <SearchWhiteIcon onClick={() => handleOpenMobileSearchBox()} />
            </div>
            {/* <IconButton
              icon={SearchWhiteIcon}
              onClick={() => handleOpenMobileSearchBox()}
              backgroundColor="transparent"
            /> */}
            <div>
              <IconButtonWithSVG
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="13.2" viewBox="0 0 22 13.2">
                    <path
                      id="bars-2"
                      d="M3.1,8.2H22.9a1.1,1.1,0,1,0,0-2.2H3.1a1.1,1.1,0,1,0,0,2.2ZM22.9,17H3.1a1.1,1.1,0,0,0,0,2.2H22.9a1.1,1.1,0,1,0,0-2.2Zm0-5.5H3.1a1.1,1.1,0,0,0,0,2.2H22.9a1.1,1.1,0,1,0,0-2.2Z"
                      transform="translate(-2 -6)"
                      fill="var(--mint-btn-bg-1)"
                    />
                  </svg>
                }
                onClick={() => handleOpenMobileMenu()}
                backgroundColor="transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrimaryHeader

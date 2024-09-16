import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useWallet } from '@solana/wallet-adapter-react'
import { useDispatch, useSelector } from 'react-redux'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// custom components
import Alert from 'components/Alert'
import AccordionMenu from 'components/Menu/AccordionMenu'
import MyWalletSubMenu from 'components/Menu/MyWalletSubMenu'

// images and icons
import DarkLightModeIcon from 'assets/icons/dark-light-mode-mobile.svg?component'
import LightDarkModeIcon from 'assets/icons/light-dark-mode-mobile.svg?component'
import InstagramLightGreenIcon from 'assets/icons/instagram-light-green.svg?component'
import DiscordLightGreenIcon from 'assets/icons/discord-light-green.svg?component'
import TwitterLightGreenIcon from 'assets/icons/twitter-light-green.svg?component'
import GithubLightGreenIcon from 'assets/icons/github-light-green.svg?component'

// json data
import ProfileMenuList from 'assets/json/profile-menu-mobile.json'
import ExploreMenuList from 'assets/json/explore-mobile-menu.json'
import CreateMenuList from 'assets/json/create-menu.json'
import LeaderboardsList from 'assets/json/leaderboard-menu.json'

// styles
import styles from './index.module.scss'

// call apis
import { setColorTheme } from 'utils/helpers'
import { deleteCookie } from 'cookies-next'
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'
import { useAuthentication } from 'hooks/useAuthentication'
import { getDisplayUserName } from 'utils/strings'
import AccordionNewProfileMenu from '../AccordionNewProfileMenu'

const MobileMenu = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { connected, disconnect } = useWallet()
  const [lightMode, setLightMode] = useState(useSelector(state => (state as any).lightMode))
  const { setVisible } = useWalletModal()

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [buttonClicked, setButtonClicked] = useState(false)

  const { profileInfo } = useAuthentication()
  const [profileImage, setProfileImage] = useState(null)
  const [profileName, setProfileName] = useState('')

  // update profile menu list
  const [profileMenuList, setProfileMenuList] = useState(ProfileMenuList)
  useEffect(() => {
    if (profileInfo !== null) {
      let array = [...profileMenuList]
      array.forEach(item => {
        if (item.label === 'Profile' && item.path === '/') {
          item.path += profileInfo.username.replaceAll(' ', '%20')
        } else if (item.label === 'My Store' && item.path === '/') {
          item.path += profileInfo.username.replaceAll(' ', '%20') + '/merch'
        }
      })
      setProfileMenuList(array)

      if (profileInfo.username) {
        setProfileName(profileInfo.username)
      }
      setProfileImage(profileInfo.profile_picture)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileInfo])

  useEffect(() => {
    if (!buttonClicked) {
      return
    }

    if (connected) {
      setButtonClicked(false)
    } else {
      setButtonClicked(true)

      setAlertData([
        {
          id: 0,
          title: 'Wallet Disconnected!',
          description: `You've successfully disconnected your wallet!`,
          type: 'success',
        },
      ])
      setShowAlert(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected])

  const handleThemeMode = () => {
    if (lightMode) {
      localStorage.setItem('lightDarkMode', 'false')
    } else {
      localStorage.setItem('lightDarkMode', 'true')
    }
    setColorTheme(!lightMode)
    dispatch({ type: 'set', lightMode: !lightMode })
    setLightMode(!lightMode)
  }

  const logout = () => {
    setButtonClicked(true)
    if (localStorage.getItem('walletName') === '"Phantom"') {
      localStorage.removeItem('walletName')
      ;(window as any).solana.disconnect()
    } else disconnect()

    localStorage.removeItem('token')
    dispatch({ type: 'set', profileInfo: null })
    localStorage.removeItem('expiryDate')
    localStorage.removeItem('signature')
    deleteCookie('token')
  }

  return (
    <div className={styles.menu}>
      <div className={styles.container}>
        {connected ? (
          <div className="w-full flex flex-wrap">
            <AccordionNewProfileMenu
              icon={profileImage}
              label={getDisplayUserName(profileName)}
              type="avatar"
              data={profileMenuList}
              lightMode={lightMode}
              logout={logout}
              handleThemeMode={handleThemeMode}
            />
            <MyWalletSubMenu label="Wallet" type="" username={profileInfo?.username} />

            <AccordionMenu label="Create" type="create" data={CreateMenuList} username={profileInfo?.username} />
            <AccordionMenu label="Explore" type="explore" data={ExploreMenuList} />
            <AccordionMenu label="Leaderboards" type="leaderboards" data={LeaderboardsList} />
          </div>
        ) : (
          <div className="w-full">
            <div className="w-full">
              <div className="w-full h-[53px] flex justify-between items-center">
                <div
                  className={styles.signIn}
                  onClick={() => {
                    setButtonClicked(true)
                    setVisible(true)
                  }}
                >
                  Sign in
                </div>
              </div>
              <div className={styles.signBorder} />
            </div>
            <div className="w-full flex flex-col flex-wrap items-start">
              <AccordionMenu label="Create" type="create" data={CreateMenuList} />
              <AccordionMenu label="Explore" type="explore" data={ExploreMenuList} />
              <AccordionMenu label="Leaderboards" type="leaderboards" data={LeaderboardsList} />
            </div>
            <Alert
              open={showAlert}
              close={() => {
                router.push('/')
                setShowAlert(false)
              }}
              data={alertData}
            />
          </div>
        )}

        <div className="w-full flex items-center gap-[15px] mt-[30px]" onClick={() => handleThemeMode()}>
          <button>{lightMode ? <LightDarkModeIcon /> : <DarkLightModeIcon />}</button>
          <div className={styles.colorMode}>{lightMode ? 'Light Mode' : 'Dark Mode'}</div>
        </div>

        <div className="w-full mt-[15px]">
          <div className={styles.footerText}>
            <a target="_blank" href="https://about.fostermarketplace.app/" rel="noopener noreferrer">
              About
            </a>
          </div>
          <div className={styles.footerText} onClick={() => router.push('/dao')}>
            Governance
          </div>
          <div className={styles.footerText}>
            <a target="_blank" href={process.env.NEXT_PUBLIC_COMMUNITY} rel="noopener noreferrer">
              Community
            </a>
          </div>
          <div
            className={styles.footerText}
            onClick={() => {
              dispatch({ type: 'set', openMobileMenu: false })
              router.push('/resources')
            }}
          >
            Resources
          </div>
          <div className={styles.footerText}>
            <a target="_blank" href={process.env.NEXT_PUBLIC_TERMS_OF_USE} rel="noopener noreferrer">
              Terms of Service
            </a>
          </div>
          <div className={styles.footerText}>
            <a target="_blank" href={process.env.NEXT_PUBLIC_PRIVACY_POLICY} rel="noopener noreferrer">
              Privacy Policy
            </a>
          </div>
        </div>
        <div className={styles.allRights}>2023 Foster © All Rights Reserved</div>
        <div className="flex flex-wrap mt-[15px] gap-[18px] justify-start mb-[100px]">
          <div>
            <a target="_blank" href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} rel="noopener noreferrer">
              <IconButtonWithSVG
                backgroundColor="var(--social-bg-color)"
                icon={<InstagramLightGreenIcon />}
                onClick={() => {}}
              />
            </a>
          </div>
          <div>
            <a target="_blank" href={process.env.NEXT_PUBLIC_DISCORD_URL} rel="noopener noreferrer">
              <IconButtonWithSVG
                backgroundColor="var(--social-bg-color)"
                icon={<DiscordLightGreenIcon />}
                onClick={() => {}}
              />
            </a>
          </div>
          <div>
            <a target="_blank" href={process.env.NEXT_PUBLIC_TWITTER_URL} rel="noopener noreferrer">
              <IconButtonWithSVG
                backgroundColor="var(--social-bg-color)"
                icon={<TwitterLightGreenIcon />}
                onClick={() => {}}
              />
            </a>
          </div>
          <div>
            <a target="_blank" href={process.env.NEXT_PUBLIC_GITHUB_URL} rel="noopener noreferrer">
              <IconButtonWithSVG
                backgroundColor="var(--social-bg-color)"
                icon={<GithubLightGreenIcon />}
                onClick={() => {}}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu

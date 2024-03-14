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
        }
      })
      setProfileMenuList(array)

      if (profileInfo.username) {
        setProfileName(profileInfo.username)
      }
      setProfileImage(profileInfo.profile_picture)
    }
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
  }, [connected])

  const handleThemeMode = () => {
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
      {connected ? (
        <div className={styles.container}>
          <div className="w-full flex flex-wrap gap-[10px]">
            <AccordionNewProfileMenu
              icon={profileImage}
              label={getDisplayUserName(profileName)}
              type="avatar"
              data={profileMenuList}
              lightMode={lightMode}
              logout={logout}
              handleThemeMode={handleThemeMode}
            />
            <MyWalletSubMenu label="My Wallet" type="" />
            {/* <AccordionMenu label="Stats" type="stats" data={[]} path="/stats" />
            <AccordionMenu label="DAO" type="dao" data={[]} path="/dao" />
            <AccordionMenu label="Resources" type="resources" data={[]} path="/resources" /> */}

            <AccordionMenu label="Explore" type="explore" data={ExploreMenuList} />
            <AccordionMenu label="Create" type="create" data={CreateMenuList} />
            <AccordionMenu label="Leaderboards" type="leaderboards" data={LeaderboardsList} />
          </div>
          {/* <div className="w-full mt-5">
            <div
              className={styles.logout}
              onClick={() => {
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
              }}
            >
              <div>Logout</div>
              <div className="flex items-center ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18.057" height="18.063" viewBox="0 0 18.057 18.063">
                  <path
                    id="sign-out-alt"
                    d="M3.359,13.83a.9.9,0,0,1,1.21.406,7.225,7.225,0,1,0,0-6.412.909.909,0,1,1-1.626-.813,9.031,9.031,0,1,1,0,8.037.9.9,0,0,1,.415-1.219Zm-.452-3.7h8.661L9.491,8.06a.907.907,0,0,1,1.282-1.282l3.612,3.612a.934.934,0,0,1,0,1.282l-3.612,3.612A.907.907,0,1,1,9.491,14l2.077-2.068H2.908a.9.9,0,0,1,0-1.806Z"
                    transform="translate(-2.005 -1.999)"
                    fill="var(--logout-icon-color)"
                  />
                </svg>
              </div>
            </div>
          </div> */}

          <div className={styles.separator} />
          <div className="w-full mt-[15px]">
            <div className={styles.footerText}>
              <a target="_blank" href="https://about.fostermarketplace.app/" rel="noopener noreferrer">
                About
              </a>
            </div>
            <div className={styles.footerText}>
              <a
                target="_blank"
                href="https://indd.adobe.com/view/a323ff9d-9b79-45ed-9f33-45ee566e9603"
                rel="noopener noreferrer"
              >
                Whitepaper
              </a>
            </div>
            <div className={styles.footerText}>
              <a target="_blank" href={process.env.NEXT_PUBLIC_COMMUNITY} rel="noopener noreferrer">
                Community
              </a>
            </div>
            <div className={styles.footerText}>
              <a target="_blank" href="https://circus.fostermarketplace.app/" rel="noopener noreferrer">
                Resources
              </a>
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
          {/* connect wallet alert */}
          <Alert
            open={showAlert}
            close={() => {
              setShowAlert(false)
              // handleLogin()
            }}
            data={alertData}
          />
        </div>
      ) : (
        <div className={styles.container}>
          <div className="w-full mb-[22px]">
            <div className="w-full h-[74px] flex justify-between items-center">
              <div
                className={styles.signIn}
                onClick={() => {
                  setButtonClicked(true)
                  setVisible(true)
                }}
              >
                Sign in
              </div>
              <button className="ml-7" onClick={() => handleThemeMode()}>
                {lightMode ? <LightDarkModeIcon /> : <DarkLightModeIcon />}
              </button>
            </div>
            <div className={styles.signBorder} />
          </div>
          <div className="w-full flex flex-col flex-wrap items-start gap-[10px]">
            {/* <AccordionMenu label="Studio" type="studio" data={[]} path="/studio" /> */}
            <AccordionMenu label="Explore" type="explore" data={ExploreMenuList} />
            <AccordionMenu label="Create" type="create" data={CreateMenuList} />
            <AccordionMenu label="Leaderboards" type="leaderboards" data={LeaderboardsList} />

            {/* <AccordionMenu label="Stats" type="stats" data={[]} path="/stats" />
            <AccordionMenu label="DAO" type="dao" data={[]} path="/dao" />
            <AccordionMenu label="Resources" type="resources" data={[]} path="/resources" />
            <div className="w-full flex justify-end mt-[10px]" onClick={() => handleThemeMode()}>
              {lightMode ? <LightDarkModeIcon /> : <DarkLightModeIcon />}
            </div> */}
          </div>
          {/* <div className="w-full flex items-end mt-5">
            <WalletButton fullWidth />
          </div> */}
          <div className={styles.separator} />
          <div className="w-full mt-[15px]">
            <div className={styles.footerText}>
              <a target="_blank" href="https://about.fostermarketplace.app/" rel="noopener noreferrer">
                About
              </a>
            </div>
            <div className={styles.footerText}>
              <a
                target="_blank"
                href="https://indd.adobe.com/view/a323ff9d-9b79-45ed-9f33-45ee566e9603"
                rel="noopener noreferrer"
              >
                Governance
              </a>
            </div>
            <div className={styles.footerText}>
              <a target="_blank" href={process.env.NEXT_PUBLIC_COMMUNITY} rel="noopener noreferrer">
                Community
              </a>
            </div>
            <div className={styles.footerText}>
              <a target="_blank" href="https://circus.fostermarketplace.app/" rel="noopener noreferrer">
                Resources
              </a>
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
          {/* disconnect wallet alert */}
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
    </div>
  )
}

export default MobileMenu

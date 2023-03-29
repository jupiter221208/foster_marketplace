import React, { useState } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// custom components
import IconButton from 'components/Button/IconButton'
import Subscriber from 'components/Input/Subscriber'

// custom functions
import { useViewport } from 'utils'

// images and icons
import LogoText01Icon from 'assets/icons/logo-text-01.svg?component'
import LogoText01MobileIcon from 'assets/icons/logo-text-01-mobile.svg?component'
import InstagramLightGreenIcon from 'assets/icons/instagram-light-green.svg'
import DiscordLightGreenIcon from 'assets/icons/discord-light-green.svg'
import TwitterLightGreenIcon from 'assets/icons/twitter-light-green.svg'
import TelegramLightGreenIcon from 'assets/icons/telegram-light-green.svg'
import GithubLightGreenIcon from 'assets/icons/github-light-green.svg'
import DarkLightModeIcon from 'assets/icons/dark-light-mode.svg?component'
import LightDarkModeIcon from 'assets/icons/light-dark-mode.svg?component'
import DarkLightModeMobileIcon from 'assets/icons/dark-light-mode-mobile.svg?component'
import LightDarkModeMobileIcon from 'assets/icons/light-dark-mode-mobile.svg?component'

// styles
import styles from './index.module.scss'
import { setColorTheme } from 'utils/helpers'

const PrimaryFooter = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [lightMode, setLightMode] = useState(useSelector(state => (state as any).lightMode)) // =

  const handleThemeMode = () => {
    setColorTheme(!lightMode)
    dispatch({ type: 'set', lightMode: !lightMode })
    setLightMode(!lightMode)
  }

  return (
    <div className={styles.container} data-testid="footer-container">
      {viewport !== 'xs' && viewport !== 'sm' && viewport !== 'md' ? (
        <div className="g-container flex flex-wrap justify-between gap-4 z-10">
          <div className="max-w-[347px] block justify-start">
            <div className="w-full cursor-pointer">
              <div onClick={() => router.push('/')}>
                <LogoText01Icon alt="" />
              </div>
              <div className={styles.lightDarkMode} onClick={() => handleThemeMode()}>
                {lightMode ? <LightDarkModeIcon /> : <DarkLightModeIcon />}
              </div>
            </div>
            {/* <div className={styles.text}>
              Join the Foster circus and Experience a unique, yet familiar way to interact with your favorite NFT’s.
            </div> */}
          </div>
          <div className="max-w-[347px] block justify-start">
            <div className={styles.title}>About</div>
            <div className={`${styles.linkText} !mt-[49px]`}>
              <a target="_blank" href={process.env.NEXT_PUBLIC_ABOUT_US} rel="noopener noreferrer">
                Foster House
              </a>
            </div>
            <div className={styles.linkText}>
              <a target="_blank" href={process.env.NEXT_PUBLIC_TURKEY_CIRCUS} rel="noopener noreferrer">
                Turkey Circus
              </a>
            </div>
            {/* <div className={styles.linkText}>
              <a target="_blank" href={process.env.NEXT_PUBLIC_CAREERS} rel="noopener noreferrer">
                Careers
              </a>
            </div> */}
            <div className={styles.linkText}>
              <a target="_blank" href={process.env.NEXT_PUBLIC_TERMS_OF_USE} rel="noopener noreferrer">
                Terms of Service
              </a>
            </div>
            <div className={styles.linkText}>
              <a target="_blank" href={process.env.NEXT_PUBLIC_PRIVACY_POLICY} rel="noopener noreferrer">
                Privacy Policy
              </a>
            </div>
          </div>
          <div className="max-w-[347px] block justify-start">
            <div className={styles.title}>Resources</div>
            <div className={`${styles.linkText} !mt-[49px]`}>
              <a target="_blank" href={process.env.NEXT_PUBLIC_WHITEPAPER} rel="noopener noreferrer">
                Whitepaper
              </a>
            </div>
            <div className={styles.linkText}>
              <a target="_blank" href={process.env.NEXT_PUBLIC_BRAND_DESIGN} rel="noopener noreferrer">
                Brand & Design
              </a>
            </div>
            {/* <div className={styles.linkText}>
              <a target="_blank" href={process.env.NEXT_PUBLIC_DEVELOPMENT} rel="noopener noreferrer">
                Development
              </a>
            </div> */}
            <div className={styles.linkText}>
              <a target="_blank" href={process.env.NEXT_PUBLIC_COMMUNITY} rel="noopener noreferrer">
                Community
              </a>
            </div>
            <div className={styles.linkText}>
              <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_US}`}>Media Inquiries</a>
            </div>
          </div>
          <div className="max-w-[347px] block justify-start">
            {/* <div className={styles.title}>Stay Connected</div>
            <div className="mt-[29px]">
              <Subscriber value={email} placeholder="Email" onChange={value => setEmail(value)} onClick={() => {}} />
            </div> */}
            <div className="flex flex-wrap mt-[0px] gap-5">
              <div>
                <a target="_blank" href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} rel="noopener noreferrer">
                  <IconButton iconWidth={20} iconHeight={20} icon={InstagramLightGreenIcon} onClick={() => {}} />
                </a>
              </div>
              <div>
                <a target="_blank" href={process.env.NEXT_PUBLIC_DISCORD_URL} rel="noopener noreferrer">
                  <IconButton iconWidth={20} iconHeight={20} icon={DiscordLightGreenIcon} onClick={() => {}} />
                </a>
              </div>
              <div>
                <a target="_blank" href={process.env.NEXT_PUBLIC_TWITTER_URL} rel="noopener noreferrer">
                  <IconButton iconWidth={20} iconHeight={20} icon={TwitterLightGreenIcon} onClick={() => {}} />
                </a>
              </div>
              {/* <div>
                <a target="_blank" href={process.env.NEXT_PUBLIC_TELEGRAM_URL} rel="noopener noreferrer">
                  <IconButton iconWidth={20} iconHeight={20} icon={TelegramLightGreenIcon} onClick={() => {}} />
                </a>
              </div> */}
              <div>
                <a target="_blank" href={process.env.NEXT_PUBLIC_GITHUB_URL} rel="noopener noreferrer">
                  <IconButton iconWidth={20} iconHeight={20} icon={GithubLightGreenIcon} onClick={() => {}} />
                </a>
              </div>
            </div>
          </div>
          <div className={styles.greenText}>© All Rights Reserved</div>
        </div>
      ) : (
        <div className="relative g-container flex flex-wrap justify-center gap-4 my-[60px] z-10">
          <div className="w-full flex flex-wrap justify-center">
            <div className="w-full flex justify-center cursor-pointer" onClick={() => router.push('/')}>
              <LogoText01MobileIcon width={176} height={40} alt="" />
            </div>
            <div
              className="w-full mt-[70px] mr-[50px] flex justify-end cursor-pointer"
              onClick={() => handleThemeMode()}
            >
              {lightMode ? <LightDarkModeMobileIcon /> : <DarkLightModeMobileIcon />}
            </div>
          </div>
          <div className="w-full flex justify-around mt-[4px]">
            <div className="w-full block justify-center text-center">
              <div className={styles.title}>About</div>
              <div className={`${styles.linkText} !mt-[20px]`}>
                <a target="_blank" href={process.env.NEXT_PUBLIC_ABOUT_US} rel="noopener noreferrer">
                  Foster House
                </a>
              </div>
              <div className={styles.linkText}>
                <a target="_blank" href={process.env.NEXT_PUBLIC_TURKEY_CIRCUS} rel="noopener noreferrer">
                  Turkey Circus
                </a>
              </div>
              {/* <div className={styles.linkText}>
                <a target="_blank" href={process.env.NEXT_PUBLIC_CAREERS} rel="noopener noreferrer">
                  Careers
                </a>
              </div> */}
              <div className={styles.linkText}>
                <a target="_blank" href={process.env.NEXT_PUBLIC_TERMS_OF_USE} rel="noopener noreferrer">
                  Terms of Service
                </a>
              </div>
              <div className={styles.linkText}>
                <a target="_blank" href={process.env.NEXT_PUBLIC_PRIVACY_POLICY} rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </div>
            </div>
            <div className="w-full block justify-center text-center">
              <div className={styles.title}>Resources</div>
              <div className={`${styles.linkText} !mt-[23px]`}>
                <a target="_blank" href={process.env.NEXT_PUBLIC_WHITEPAPER} rel="noopener noreferrer">
                  Whitepaper
                </a>
              </div>
              <div className={styles.linkText}>
                <a target="_blank" href={process.env.NEXT_PUBLIC_BRAND_DESIGN} rel="noopener noreferrer">
                  Brand & Design
                </a>
              </div>
              {/* <div className={styles.linkText}>
                <a target="_blank" href={process.env.NEXT_PUBLIC_DEVELOPMENT} rel="noopener noreferrer">
                  Development
                </a>
              </div> */}
              <div className={styles.linkText}>
                <a target="_blank" href={process.env.NEXT_PUBLIC_COMMUNITY} rel="noopener noreferrer">
                  Community
                </a>
              </div>
              <div className={styles.linkText}>
                <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_US}`}>Media Inquiries</a>
              </div>
            </div>
          </div>

          <div className="w-full block justify-center text-center mt-[42px]">
            {/* <div className={styles.stayTitle}>Stay Connected</div>
            <div className="mt-[26px] flex justify-center z-10">
              <Subscriber value={email} placeholder="Email" onChange={value => setEmail(value)} onClick={() => {}} />
            </div> */}
            <div className="flex flex-wrap mt-[44px] gap-[18px] justify-center">
              <div>
                <a target="_blank" href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} rel="noopener noreferrer">
                  <IconButton icon={InstagramLightGreenIcon} onClick={() => {}} />
                </a>
              </div>
              <div>
                <a target="_blank" href={process.env.NEXT_PUBLIC_DISCORD_URL} rel="noopener noreferrer">
                  <IconButton icon={DiscordLightGreenIcon} onClick={() => {}} />
                </a>
              </div>
              <div>
                <a target="_blank" href={process.env.NEXT_PUBLIC_TWITTER_URL} rel="noopener noreferrer">
                  <IconButton icon={TwitterLightGreenIcon} onClick={() => {}} />
                </a>
              </div>
              {/* <div>
                <a target="_blank" href={process.env.NEXT_PUBLIC_GITHUB_URL} rel="noopener noreferrer">
                  <IconButton icon={TelegramLightGreenIcon} onClick={() => {}} />
                </a>
              </div> */}
              <div>
                <a target="_blank" href={process.env.NEXT_PUBLIC_MEDIUM_URL} rel="noopener noreferrer">
                  <IconButton icon={GithubLightGreenIcon} onClick={() => {}} />
                </a>
              </div>
            </div>
          </div>
          <div className={styles.greenText}>© All Rights Reserved</div>
        </div>
      )}
    </div>
  )
}

export default PrimaryFooter

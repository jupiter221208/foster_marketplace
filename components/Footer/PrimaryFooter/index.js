import React, { useState } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// custom components
import IconButton from 'components/Button/IconButton'
import Subscriber from 'components/Input/Subscriber'

// images and icons
import LogoText01Icon from 'assets/icons/logo-text-01.svg'
import InstagramWhiteIcon from 'assets/icons/instagram-white.svg'
import DiscordWhiteIcon from 'assets/icons/discord-white.svg'
import TwitterWhiteIcon from 'assets/icons/twitter-white.svg'
import GithubWhiteIcon from 'assets/icons/github-white.svg'
import MediumWhiteIcon from 'assets/icons/medium-white.svg'

// styles
import styles from './index.module.scss'

const PrimaryFooter = props => {
  const router = useRouter()

  const [email, setEmail] = useState('')
  return (
    <div className={styles.container}>
      <div className="g-container flex flex-wrap justify-between gap-4">
        <div className="max-w-[347px] block justify-start">
          <div className="w-full cursor-pointer" onClick={() => router.push('/')}>
            <Image src={LogoText01Icon} alt="" />
          </div>
          <div className={styles.text}>
            Join the Foster circus and Experience a unique, yet familiar way to interact with your favorite NFT’s.
          </div>
          <div className="flex flex-wrap mt-[54px] gap-5">
            <div>
              <IconButton
                icon={InstagramWhiteIcon}
                onClick={() => router.push(process.env.NEXT_PUBLIC_INSTAGRAM_URL)}
              />
            </div>
            <div>
              <IconButton icon={DiscordWhiteIcon} onClick={() => router.push(process.env.NEXT_PUBLIC_DISCORD_URL)} />
            </div>
            <div>
              <IconButton icon={TwitterWhiteIcon} onClick={() => router.push(process.env.NEXT_PUBLIC_TWITTER_URL)} />
            </div>
            <div>
              <IconButton icon={GithubWhiteIcon} onClick={() => router.push(process.env.NEXT_PUBLIC_GITHUB_URL)} />
            </div>
            <div>
              <IconButton icon={MediumWhiteIcon} onClick={() => router.push(process.env.NEXT_PUBLIC_MEDIUM_URL)} />
            </div>
          </div>
        </div>
        <div className="max-w-[347px] block justify-start">
          <div className={styles.title}>About Us</div>
          <div className={`${styles.linkText} !mt-[52px]`} onClick={() => router.push('/#')}>
            White Paper
          </div>
          <div className={styles.linkText} onClick={() => router.push('/#')}>
            Brand & Design Guide
          </div>
          <div className={styles.linkText} onClick={() => router.push('/#')}>
            Press Releases
          </div>
          <div className={styles.linkText} onClick={() => router.push('/#')}>
            Terms & Conditions
          </div>
          <div className={styles.linkText} onClick={() => router.push('/#')}>
            Private Policy
          </div>
        </div>
        <div className="max-w-[347px] block justify-start">
          <div className={styles.title}>Contact Us</div>
          <div className={`${styles.linkText} !mt-[52px]`} onClick={() => router.push('/#')}>
            {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
          </div>
        </div>
        <div className="max-w-[347px] block justify-start">
          <div className={styles.title}>Newsletter</div>
          <div className="mt-[52px]">
            <Subscriber value={email} placeholder="Email" onChange={value => setEmail(value)} onClick={() => {}} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrimaryFooter

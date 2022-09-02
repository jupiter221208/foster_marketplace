import React, { useState } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// custom components
import IconButton from 'components/Button/IconButton'
import Subscriber from 'components/Input/Subscriber'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import LogoText01Icon from 'assets/icons/logo-text-01.svg'
import InstagramLightGreenIcon from 'assets/icons/instagram-light-green.svg'
import DiscordLightGreenIcon from 'assets/icons/discord-light-green.svg'
import TwitterLightGreenIcon from 'assets/icons/twitter-light-green.svg'
import GithubLightGreenIcon from 'assets/icons/github-light-green.svg'
import MediumLightGreenIcon from 'assets/icons/medium-light-green.svg'

// styles
import styles from './index.module.scss'

const PrimaryFooter = props => {
  const { viewport } = props
  const router = useRouter()

  const [email, setEmail] = useState('')
  return (
    <div className={styles.container}>
      {viewport !== 'xs' && viewport !== 'sm' && viewport !== 'md' ? (
        <div className="g-container flex flex-wrap justify-between gap-4 z-10">
          <div className="max-w-[347px] block justify-start">
            <div className="w-full cursor-pointer" onClick={() => router.push('/')}>
              <Image src={LogoText01Icon} alt="" />
            </div>
            {/* <div className={styles.text}>
              Join the Foster circus and Experience a unique, yet familiar way to interact with your favorite NFT’s.
            </div> */}
          </div>
          <div className="max-w-[347px] block justify-start">
            <div className={styles.title}>About</div>
            <div
              className={`${styles.linkText} !mt-[49px]`}
              onClick={() => router.push(process.env.NEXT_PUBLIC_ABOUT_US)}
            >
              About us
            </div>
            <div className={styles.linkText} onClick={() => router.push(process.env.NEXT_PUBLIC_COMMUNITY)}>
              Community
            </div>
            <div className={styles.linkText} onClick={() => router.push(process.env.NEXT_PUBLIC_CAREERS)}>
              Careers
            </div>
            <div className={styles.linkText} onClick={() => router.push(process.env.NEXT_PUBLIC_TERMS_OF_USE)}>
              Terms of Use
            </div>
            <div className={styles.linkText} onClick={() => router.push(process.env.NEXT_PUBLIC_PRIVACY_POLICY)}>
              Private Policy
            </div>
          </div>
          <div className="max-w-[347px] block justify-start">
            <div className={styles.title}>Resources</div>
            <div
              className={`${styles.linkText} !mt-[49px]`}
              onClick={() => router.push(process.env.NEXT_PUBLIC_WHITEPAPER)}
            >
              Whitepaper
            </div>
            <div className={styles.linkText} onClick={() => router.push(process.env.NEXT_PUBLIC_BRAND_DESIGN)}>
              Brand & Design
            </div>
            <div className={styles.linkText} onClick={() => router.push(process.env.NEXT_PUBLIC_DEVELOPMENT)}>
              Development
            </div>
            <div className={styles.linkText} onClick={() => router.push(process.env.NEXT_PUBLIC_PRESS_RELEASES)}>
              Press Releases
            </div>
            <div className={styles.linkText}>
              <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_US}`}>Contact Us</a>
            </div>
          </div>
          <div className="max-w-[347px] block justify-start">
            <div className={styles.title}>See Everything</div>
            <div className="mt-[29px]">
              <Subscriber value={email} placeholder="Email" onChange={value => setEmail(value)} onClick={() => {}} />
            </div>
            <div className="flex flex-wrap mt-[62px] gap-5">
              <div>
                <IconButton
                  icon={InstagramLightGreenIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_INSTAGRAM_URL)}
                />
              </div>
              <div>
                <IconButton
                  icon={DiscordLightGreenIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_DISCORD_URL)}
                />
              </div>
              <div>
                <IconButton
                  icon={TwitterLightGreenIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_TWITTER_URL)}
                />
              </div>
              <div>
                <IconButton
                  icon={GithubLightGreenIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_GITHUB_URL)}
                />
              </div>
              <div>
                <IconButton
                  icon={MediumLightGreenIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_MEDIUM_URL)}
                />
              </div>
            </div>
          </div>
          <div className={styles.greenText}>© All Rights Reserved</div>
        </div>
      ) : (
        <div className="relative g-container flex flex-wrap justify-center gap-4 my-[60px] z-10">
          <div className={styles.topLeftEllipse}>
            <Image src={EllipseGreen} width={652} height={652} alt="" />
          </div>
          <div className="w-full flex flex-wrap justify-center">
            <div className="w-full flex justify-center cursor-pointer" onClick={() => router.push('/')}>
              <Image src={LogoText01Icon} width={176} height={40} alt="" />
            </div>
          </div>
          <div className="w-full flex justify-around">
            <div className="w-full block justify-center text-center mt-[44px]">
              <div className={styles.title}>About</div>
              <div
                className={`${styles.linkText} !mt-[23px]`}
                onClick={() => router.push(process.env.NEXT_PUBLIC_ABOUT_US)}
              >
                About us
              </div>
              <div className={styles.linkText} onClick={() => router.push(process.env.NEXT_PUBLIC_COMMUNITY)}>
                Community
              </div>
              <div className={styles.linkText} onClick={() => router.push(process.env.NEXT_PUBLIC_CAREERS)}>
                Careers
              </div>
              <div className={styles.linkText} onClick={() => router.push(process.env.NEXT_PUBLIC_TERMS_OF_USE)}>
                Terms of Use
              </div>
              <div className={styles.linkText} onClick={() => router.push(process.env.NEXT_PUBLIC_PRIVACY_POLICY)}>
                Private Policy
              </div>
            </div>
            <div className="w-full block justify-center text-center mt-[44px]">
              <div className={styles.title}>Resources</div>
              <div className={`${styles.linkText} !mt-[23px]`} onClick={() => router.push('/#')}>
                Whitepaper
              </div>
              <div className={styles.linkText} onClick={() => router.push(process.env.NEXT_PUBLIC_BRAND_DESIGN)}>
                Brand & Design
              </div>
              <div className={styles.linkText} onClick={() => router.push(process.env.NEXT_PUBLIC_DEVELOPMENT)}>
                Development
              </div>
              <div className={styles.linkText} onClick={() => router.push(process.env.NEXT_PUBLIC_PRESS_RELEASES)}>
                Press Releases
              </div>
              <div className={styles.linkText}>
                <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_US}`}>Contact Us</a>
              </div>
            </div>
          </div>

          <div className="w-full block justify-center text-center mt-[44px]">
            <div className={styles.title}>See Everything</div>
            <div className="mt-[26px] flex justify-center z-10">
              <Subscriber value={email} placeholder="Email" onChange={value => setEmail(value)} onClick={() => {}} />
            </div>
            <div className="flex flex-wrap mt-[44px] gap-[18px] justify-center">
              <div>
                <IconButton
                  icon={InstagramLightGreenIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_INSTAGRAM_URL)}
                />
              </div>
              <div>
                <IconButton
                  icon={DiscordLightGreenIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_DISCORD_URL)}
                />
              </div>
              <div>
                <IconButton
                  icon={TwitterLightGreenIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_TWITTER_URL)}
                />
              </div>
              <div>
                <IconButton
                  icon={GithubLightGreenIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_GITHUB_URL)}
                />
              </div>
              <div>
                <IconButton
                  icon={MediumLightGreenIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_MEDIUM_URL)}
                />
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

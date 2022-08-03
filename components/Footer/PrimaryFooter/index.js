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
import InstagramWhiteIcon from 'assets/icons/instagram-white.svg'
import DiscordGreenIcon from 'assets/icons/discord-green.svg'
import TwitterGreenIcon from 'assets/icons/twitter-green.svg'
import GithubWhiteIcon from 'assets/icons/github-white.svg'
import MediumWhiteIcon from 'assets/icons/medium-white.svg'

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
            <div className={`${styles.linkText} !mt-[49px]`} onClick={() => router.push('/#')}>
              About us
            </div>
            <div className={styles.linkText} onClick={() => router.push('/#')}>
              Our Community
            </div>
            <div className={styles.linkText} onClick={() => router.push('/#')}>
              Careers
            </div>
            <div className={styles.linkText} onClick={() => router.push('/#')}>
              Terms of Use
            </div>
            <div className={styles.linkText} onClick={() => router.push('/#')}>
              Private Policy
            </div>
          </div>
          <div className="max-w-[347px] block justify-start">
            <div className={styles.title}>Resources</div>
            <div className={`${styles.linkText} !mt-[49px]`} onClick={() => router.push('/#')}>
              Whitepaper
            </div>
            <div className={styles.linkText} onClick={() => router.push('/#')}>
              Brand Guide
            </div>
            <div className={styles.linkText} onClick={() => router.push('/#')}>
              Design Library
            </div>
            <div className={styles.linkText} onClick={() => router.push('/#')}>
              Press Releases
            </div>
            <div className={styles.linkText} onClick={() => router.push('/#')}>
              Contact Us
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
                  icon={InstagramWhiteIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_INSTAGRAM_URL)}
                />
              </div>
              <div>
                <IconButton icon={DiscordGreenIcon} onClick={() => router.push(process.env.NEXT_PUBLIC_DISCORD_URL)} />
              </div>
              <div>
                <IconButton icon={TwitterGreenIcon} onClick={() => router.push(process.env.NEXT_PUBLIC_TWITTER_URL)} />
              </div>
              <div>
                <IconButton icon={GithubWhiteIcon} onClick={() => router.push(process.env.NEXT_PUBLIC_GITHUB_URL)} />
              </div>
              <div>
                <IconButton icon={MediumWhiteIcon} onClick={() => router.push(process.env.NEXT_PUBLIC_MEDIUM_URL)} />
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
              <Image src={LogoText01Icon} width={179} height={41} alt="" />
            </div>
          </div>
          <div className="w-full flex justify-around">
            <div className="w-full block justify-center text-center mt-[44px]">
              <div className={styles.title}>About</div>
              <div className={`${styles.linkText} !mt-[23px]`} onClick={() => router.push('/#')}>
                About us
              </div>
              <div className={styles.linkText} onClick={() => router.push('/#')}>
                Our Community
              </div>
              <div className={styles.linkText} onClick={() => router.push('/#')}>
                Careers
              </div>
              <div className={styles.linkText} onClick={() => router.push('/#')}>
                Terms of Use
              </div>
              <div className={styles.linkText} onClick={() => router.push('/#')}>
                Private Policy
              </div>
            </div>
            <div className="w-full block justify-center text-center mt-[44px]">
              <div className={styles.title}>Resources</div>
              <div className={`${styles.linkText} !mt-[23px]`} onClick={() => router.push('/#')}>
                Whitepaper
              </div>
              <div className={styles.linkText} onClick={() => router.push('/#')}>
                Brand Guide
              </div>
              <div className={styles.linkText} onClick={() => router.push('/#')}>
                Design Library
              </div>
              <div className={styles.linkText} onClick={() => router.push('/#')}>
                Press Releases
              </div>
              <div className={styles.linkText} onClick={() => router.push('/#')}>
                Contact Us
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
                  icon={InstagramWhiteIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_INSTAGRAM_URL)}
                />
              </div>
              <div>
                <IconButton icon={DiscordGreenIcon} onClick={() => router.push(process.env.NEXT_PUBLIC_DISCORD_URL)} />
              </div>
              <div>
                <IconButton icon={TwitterGreenIcon} onClick={() => router.push(process.env.NEXT_PUBLIC_TWITTER_URL)} />
              </div>
              <div>
                <IconButton icon={GithubWhiteIcon} onClick={() => router.push(process.env.NEXT_PUBLIC_GITHUB_URL)} />
              </div>
              <div>
                <IconButton icon={MediumWhiteIcon} onClick={() => router.push(process.env.NEXT_PUBLIC_MEDIUM_URL)} />
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

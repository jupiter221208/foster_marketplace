import React from 'react'

// next components
import Image from 'next/image'

// custom components
import GreenLineCard from 'components/Card/GreenLineCard'
import GradientButton from 'components/Button/GradientButton'
import HamburgerMenuSocialShare from 'components/Menu/HamburgerMenuSocialShare'

// custom functions
import { useViewport } from 'utils'

// images and icons
import LogoImage from 'assets/images/logo-02.png'

// styles
import styles from './index.module.scss'

const ReferralSection = prop => {
  const { success } = prop

  const viewport = useViewport()

  return (
    <div className={styles.container}>
      <div className="w-full hidden lg:flex justify-start">
        <div className={styles.title}>Referral Program</div>
      </div>
      <div className="w-full flex justify-center">
        <div className={styles.content}>
          <div className="w-full mt-[30px] mb-12">
            <GreenLineCard content="The referral program allows you to earn a claim on the future issuance of LIFT tokens based on the number of referrals you make for active users." />
          </div>
          <div className="w-full flex flex-wrap gap-12 mb-[95px] lg:mb-[73px]">
            <div className="w-full flex justify-between">
              <div className="grid gap-1">
                <div className={styles.subTitle}>Referral Link</div>
                <a href="https://www.fostermarketplace.app/referral/username" className={styles.linkText}>
                  www.fostermarketplace.app/referral/username
                </a>
              </div>
              <HamburgerMenuSocialShare />
            </div>
            <div className="w-full flex justify-between">
              <div className="grid gap-1">
                <div className={styles.subTitle}>Total Referrals</div>
                <div className={styles.text}>
                  The number of referrals that visited the marketplace using your referral link
                </div>
              </div>
              <div className={styles.number}>32</div>
            </div>
            <div className="w-full flex justify-between">
              <div className="grid gap-1">
                <div className={styles.subTitle}>Active Referrals</div>
                <div className={styles.text}>
                  The number of referrals that visited the marketplace and connected their wallet
                </div>
              </div>
              <div className={styles.number}>32</div>
            </div>
            <div className="w-full flex justify-between">
              <div className="grid gap-1">
                <div className={styles.subTitle}>Creator Referrals</div>
                <div className={styles.text}>The number of referrals that minted an NFT</div>
              </div>
              <div className={styles.number}>32</div>
            </div>
            <div className="w-full flex justify-between">
              <div className="grid gap-1">
                <div className={styles.subTitle}>Collector Referrals</div>
                <div className={styles.text}>The number of referrals that purchased an NFT</div>
              </div>
              <div className={styles.number}>32</div>
            </div>
            <div className="w-full flex lg:hidden justify-between">
              <div className="grid gap-1">
                <div className={styles.subTitle}>LIFT Rewards Balance:</div>
                <div className={styles.text}>Your LIFT rewards can be claimed after the token generation event.</div>
              </div>
              <div className="flex gap-1 items-center">
                <div className={styles.number}>1000</div>
                <div className="w-6 h-6">
                  <Image src={LogoImage} alt="" width={22} height={22} layout="responsive" objectFit="cover" />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-between mb-20">
            <div className="hidden lg:flex gap-[10px] items-center">
              <div className={styles.middleTitle}>LIFT Rewards Balance:</div>
              <div className={styles.number}>1000</div>
              <div className="w-6 h-6">
                <Image src={LogoImage} alt="" width={22} height={22} layout="responsive" objectFit="cover" />
              </div>
            </div>
            <div className="w-full lg:w-auto flex justify-center lg:justify-end">
              <GradientButton
                label="Claim"
                onClick={() => {
                  success()
                }}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '53px'}
                paddingLeft="41px"
                paddingRight="41px"
                fontSize="18px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReferralSection

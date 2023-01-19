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
      <div className="w-full flex justify-center">
        <div className={styles.content}>
          <div className="w-full mt-[10px] mb-12">
            <GreenLineCard content="The referral program allows you to earn a claim on the future issuance of LIFT tokens based on the number of referrals you make for active users." />
          </div>
          <div className="w-full flex flex-wrap gap-12 mb-[60px] lg:mb-[73px]">
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
                <div className={styles.subTitle}>User Referrals</div>
                <div className={styles.text}>The total number of unique referrals that connected their wallet</div>
              </div>
              <div className={styles.number}>32</div>
            </div>
            <div className="w-full flex justify-between">
              <div className="grid gap-1">
                <div className={styles.subTitle}>Creator Referrals</div>
                <div className={styles.text}>The total number of unique referrals that minted an NFT</div>
              </div>
              <div className={styles.number}>32</div>
            </div>
            <div className="w-full flex justify-between">
              <div className="grid gap-1">
                <div className={styles.subTitle}>Collector Referrals</div>
                <div className={styles.text}>The total number of unique referrals that purchased an NFT</div>
              </div>
              <div className={styles.number}>32</div>
            </div>
            <div className="w-full flex justify-between">
              <div className="grid gap-1">
                <div className={styles.subTitle}>LIFT Rewards Balance</div>
                <div className={styles.text}>The available rewards balance for future LIFT token issuance</div>
              </div>
              <div className="flex gap-1 items-center">
                <div className="w-6 h-6 mr-[2px]">
                  <Image src={LogoImage} alt="" width={22} height={22} layout="responsive" objectFit="cover" />
                </div>
                <div className={styles.number}>1000</div>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end mb-20">
            {/* <div className="hidden lg:flex gap-[10px] items-center">
              <div className={styles.middleTitle}>LIFT Rewards Balance:</div>
              <div className={styles.number}>1000</div>
              <div className="w-6 h-6">
                <Image src={LogoImage} alt="" width={22} height={22} layout="responsive" objectFit="cover" />
              </div>
            </div> */}
            <div className="w-full lg:w-auto flex justify-end">
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

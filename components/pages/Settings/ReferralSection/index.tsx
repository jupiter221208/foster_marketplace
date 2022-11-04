import React from 'react'

// next components
import Image from 'next/image'

// custom components
import GreenLineCard from 'components/Card/GreenLineCard'
import GradientButton from 'components/Button/GradientButton'
import HamburgerMenuSocialShare from 'components/Menu/HamburgerMenuSocialShare'

// images and icons
import LogoImage from 'assets/images/logo-02.png'

// styles
import styles from './index.module.scss'

const ReferralSection = prop => {
  const { success } = prop

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
          <div className="w-full flex flex-wrap gap-12 mb-[171px] lg:mb-[94px]">
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
                <div className={styles.subTitle}>Count of Referrals</div>
                <div className={styles.text}>Description of referral metric</div>
              </div>
              <div className={styles.number}>32</div>
            </div>
            <div className="w-full flex justify-between">
              <div className="grid gap-1">
                <div className={styles.subTitle}>Referral Metric (Placeholder)</div>
                <div className={styles.text}>Description of referral metric</div>
              </div>
              <div className={styles.number}>32</div>
            </div>
            <div className="w-full flex justify-between">
              <div className="grid gap-1">
                <div className={styles.subTitle}>Referral Metric (Placeholder)</div>
                <div className={styles.text}>Description of referral metric</div>
              </div>
              <div className={styles.number}>32</div>
            </div>
          </div>
          <div className="w-full flex justify-between mb-20">
            <div className="flex gap-[10px] items-center">
              <div className={styles.middleTitle}>LIFT Rewards Balance:</div>
              <div className={styles.number}>1000</div>
              <div className="w-6 h-6">
                <Image src={LogoImage} alt="" width={22} height={22} layout="responsive" objectFit="cover" />
              </div>
            </div>
            <GradientButton
              label="Claim"
              onClick={() => {
                success()
              }}
              height="53px"
              paddingLeft="41px"
              paddingRight="41px"
              fontSize="18px"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReferralSection

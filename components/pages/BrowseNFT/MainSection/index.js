import React, { useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import Blur from 'react-blur'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'

// components
import IconButton from 'components/Button/IconButton'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// images and icons
import Avatar from 'assets/images/NFT-Display-Group.png'
import HeartUnfilledWhiteIcon from 'assets/icons/heart-unfilled-white.svg'
import SendWhiteIcon from 'assets/icons/send-white.svg'
import CandyWhiteIcon from 'assets/icons/candy-white.svg'
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'
import QuickBuyBlackIcon from 'assets/icons/quick-buy-black.svg'
import TagWhiteIcon from 'assets/icons/tag-white.svg'

// styles
import styles from './index.module.scss'

const MainSection = props => {
  const { viewport } = props
  return (
    <div className={styles.container}>
      <div className="w-full grid grid-cols-2 gap-10">
        <div className="col-span-2 lg:col-span-1">
          <div className={styles.blurBackground}>
            {typeof Avatar.src !== Object && (
              <Blur
                img={Avatar.src}
                blurRadius={50}
                enableStyles
                shouldResize
                className="w-full flex justify-center items-center"
              >
                <div className={styles.blurBackground}>
                  <div className={styles.imageArea}>
                    <Image src={Avatar} alt="" objectFit="cover" />
                  </div>
                </div>
              </Blur>
            )}
          </div>
        </div>
        <div className="col-span-2 lg:col-span-1">
          <div className={styles.nftDetailCard}>
            <div className="w-full flex justify-between items-center">
              <div className={styles.greenTitle}>The GB Series</div>
              <div className="flex gap-4">
                <IconButton icon={HeartUnfilledWhiteIcon} backgroundColor="transparent" onClick={() => {}} />
                <IconButton icon={SendWhiteIcon} backgroundColor="transparent" onClick={() => {}} />
                <IconButton icon={CandyWhiteIcon} backgroundColor="transparent" onClick={() => {}} />
              </div>
            </div>
            <div className="w-full flex mt-[38px]">
              <div className={styles.title}>The Glass Banana</div>
            </div>
            <div className="w-full flex mt-7">
              <div className={`${styles.grayText} mr-3`}>Fostered by</div>
              <div className={`${styles.greenText} mr-[34px]`}>BillBudz</div>
              <div className={`${styles.grayText} mr-3`}>Created by</div>
              <div className={styles.greenText}>Plumpadoodle</div>
            </div>
            <div className="w-full flex items-center mt-[100px]">
              <div className={`${styles.greenTitle} mr-4`}>Price</div>
              <Image
                src={SolanaLogoIcon}
                alt=""
                width={viewport === 'xs' ? 15 : viewport === 'sm' || viewport === 'md' ? 18 : 23}
                height={viewport === 'xs' ? 15 : viewport === 'sm' || viewport === 'md' ? 18 : 23}
              />
              <div className={`${styles.whiteTitle} ml-[6px]`}>1.1</div>
            </div>
            <div className="w-full flex mt-[14px] gap-10">
              <GradientButton label="Quick Buy" onClick={() => {}} icon={QuickBuyBlackIcon} direction="rtl" />
              <OutlineButton
                label="Make Offer"
                onClick={() => {}}
                icon={TagWhiteIcon}
                direction="rtl"
                borderColor="#ffffff"
                borderWidth={2}
              />
            </div>
            <div className="w-full flex mt-[14px]">
              <div className={styles.whiteDiscription}>
                By selecting "Quick Buy" or "Make an offer", you agree to the&nbsp;
              </div>
              <div className={styles.greenDiscription}>Terms of Service</div>
            </div>
            <div className="w-full mt-4 gap-5">
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between">
                      <div className={styles.subTitle}>Description</div>
                      <ChevronUpIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`}
                        style={{ color: '#DEEFD0' }}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel></Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainSection

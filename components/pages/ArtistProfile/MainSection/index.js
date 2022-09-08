import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

import OutlineButton from 'components/Button/OutlineButton'

// images and icons
import HeaderImage from 'assets/images/profile-header.png'
import AvatarImage from 'assets/images/artist-avatar.png'
import AvatarFollowIcon from 'assets/icons/avatar-follow.svg'
import FacebookWhiteIcon from 'assets/icons/facebook-white.svg'
import DiscordWhiteIcon from 'assets/icons/discord-white.svg'
import TwitterWhiteIcon from 'assets/icons/twitter-white.svg'
import YoutubeWhiteIcon from 'assets/icons/youtube-white.svg'
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'
import YoutubeHoverIcon from 'assets/icons/youtube-hover.svg'
import TwitterHoverIcon from 'assets/icons/twitter-hover.svg'
import DiscordHoverIcon from 'assets/icons/discord-hover.svg'
import FacebookHoverIcon from 'assets/icons/facebook-hover.svg'

import ProfileArtistCard from 'components/Card/ProfileArtistCard'
import GradientButton from 'components/Button/GradientButton'
import SocialButton from 'components/Button/SocialButton'
import AddressButton from 'components/Button/AddressButton'
import CategoryChip from 'components/Chip/CategoryChip'

// styles
import styles from './index.module.scss'

const MainSection = props => {
  const { viewport } = props
  const [follow, setFollow] = useState(false)

  const router = useRouter()
  const categoryList = [
    {
      id: 17,
      image: '/images/hero.png',
      banner: '/images/category-banner-surreal.png',
      mobile: '/images/hero.png',
      mobile_banner: '/images/category-banner-surreal.png',
      name: 'Surreal',
      type: 'image',
      nfts: 2131,
      collections: 287,
    },
    {
      id: 18,
      image: '/images/popular-category-audiovisual.webm',
      banner: '/images/category-banner-audiovisual.webm',
      mobile: '/images/popular-category-mobile-audiovisual.mp4',
      mobile_banner: '/images/category-banner-mobile-audiovisual.mp4',
      name: 'Audiovisual',
      type: 'video',
      nfts: 2131,
      collections: 287,
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.headerImage}>
        <Image src={HeaderImage} alt="" objectFit="cover" className="rounded-[20px]" />
      </div>
      <div className="w-full">
        <div className="grid grid-cols-12 items-center -mt-[60px] lg:mt-[-95px]">
          <div className="col-span-3">
            {follow ? (
              <OutlineButton
                label="Connected"
                onClick={() => setFollow(false)}
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '89px' : '146px'}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '29px' : '51px'}
                fontSize={viewport === 'xs' ? '12px' : viewport === 'sm' ? '14px' : viewport === 'md' ? '14px' : '18px'}
              />
            ) : (
              <GradientButton
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '89px' : '146px'}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '29px' : '51px'}
                label="Connect"
                direction={'rtl'}
                icon={AvatarFollowIcon}
                onClick={() => setFollow(true)}
              />
            )}
          </div>
          <div className="col-span-6">
            <ProfileArtistCard image={AvatarImage} name={'The Stars Collector'} viewport={viewport} />
            <div className="hidden lg:flex justify-center mt-[16px]">
              <AddressButton
                label={'cGtKb..3fRm'}
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '89px' : '192px'}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '29px' : '51px'}
                onClick={() => {}}
                viewport={viewport}
              />
            </div>
            <div className="flex lg:hidden w-full justify-center mt-[5px] gap-[10px]">
              <div>
                <SocialButton
                  icon={YoutubeWhiteIcon}
                  iconHover={YoutubeHoverIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_DISCORD_URL)}
                />
              </div>
              <div>
                <SocialButton
                  icon={TwitterWhiteIcon}
                  iconHover={TwitterHoverIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_TWITTER_URL)}
                />
              </div>
              <div>
                <SocialButton
                  icon={DiscordWhiteIcon}
                  iconHover={DiscordHoverIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_GITHUB_URL)}
                />
              </div>
              <div>
                <SocialButton
                  icon={FacebookWhiteIcon}
                  iconHover={FacebookHoverIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_MEDIUM_URL)}
                />
              </div>
            </div>
          </div>
          <div className="col-span-3 flex justify-end">
            <div className="flex lg:hidden justify-center lg:mt-[16px]">
              <AddressButton
                label={'cGb.fRm'}
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '89px' : '146px'}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '29px' : '51px'}
                onClick={() => {}}
                viewport={viewport}
              />
            </div>
            <div className="hidden lg:flex gap-[10px]">
              <div>
                <SocialButton
                  icon={YoutubeWhiteIcon}
                  iconHover={YoutubeHoverIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_DISCORD_URL)}
                />
              </div>
              <div>
                <SocialButton
                  icon={TwitterWhiteIcon}
                  iconHover={TwitterHoverIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_TWITTER_URL)}
                />
              </div>
              <div>
                <SocialButton
                  icon={DiscordWhiteIcon}
                  iconHover={DiscordHoverIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_GITHUB_URL)}
                />
              </div>
              <div>
                <SocialButton
                  icon={FacebookWhiteIcon}
                  iconHover={FacebookHoverIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_MEDIUM_URL)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full mt-[32px]">
          <div className="max-w-[734px]">
            <div className={styles.description}>
              Proin ac quam et lectus vestibulum blandit. Nunc maximus nibh at placerat tincidunt. Nam sem lacus, ornare
              non ante sed.
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-[16px]">
          <div className={`${styles.nftInfo} grid grid-cols-12`}>
            <div className="col-span-3 flex justify-center items-center">
              <div className="text-center">
                <div className={styles.nftInfoLabel}>800</div>
                <div className={styles.nftInfoValue}>NFTs</div>
              </div>
            </div>
            <div className="col-span-3 flex justify-center items-center">
              <div className="text-center">
                <div className={styles.nftInfoLabel}>03</div>
                <div className={styles.nftInfoValue}>Collections</div>
              </div>
            </div>
            <div className="col-span-3 flex justify-center items-center">
              <div className="text-center">
                <div className={styles.nftInfoLabel}>1.2k</div>
                <div className={styles.nftInfoValue}>Collections</div>
              </div>
            </div>
            <div className="col-span-3 flex justify-center items-center">
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Image src={SolanaLogoIcon} alt="" />
                  <div className={`${styles.nftInfoLabel} ml-[6px]`}>62.3</div>
                </div>

                <div className={styles.nftInfoValue}>Total Volume</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-[30px]">
          <div className={styles.categoryList}>
            {categoryList.map((item, index) => (
              <div key={index}>
                <CategoryChip data={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  )
}

export default MainSection

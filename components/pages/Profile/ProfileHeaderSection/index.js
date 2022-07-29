import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// images and icons
import HeaderImage from 'assets/images/profile-header.png'
import AvatarImage from 'assets/images/artist-avatar.png'
import AvatarFollowIcon from 'assets/icons/avatar-follow.svg'
import FacebookWhiteIcon from 'assets/icons/facebook-white.svg'
import DiscordWhiteIcon from 'assets/icons/discord-white.svg'
import TwitterWhiteIcon from 'assets/icons/twitter-white.svg'
import YoutubeWhiteIcon from 'assets/icons/youtube-white.svg'
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

import ProfileArtistCard from 'components/Card/ProfileArtistCard'
import GradientButton from 'components/Button/GradientButton'
import SocialButton from 'components/Button/SocialButton'
import AddressButton from 'components/Button/AddressButton'
import ArtistTypeCard from 'components/Card/ArtistTypeCard'

// styles
import styles from './index.module.scss'

const ProfileHeaderSection = props => {
  const { viewport } = props
  const [userType, setUserType] = useState([])

  useEffect(() => {
    setUserType(['Abstract', 'Design Art', 'Collectible'])
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.headerImage}>
        <Image src={HeaderImage} alt="" objectFit="cover" />
      </div>
      <div className="w-full">
        <div className="grid grid-cols-12 items-center mt-[-95px]">
          <div className="col-span-3">
            <GradientButton width={146} label="Follow" direction={'rtl'} icon={AvatarFollowIcon} />
          </div>
          <div className="col-span-6">
            <ProfileArtistCard image={AvatarImage} name={'The Stars Collector'} />
            <div className="flex justify-center mt-[16px]">
              <AddressButton label={'cGtKb..3fRm'} />
            </div>
          </div>
          <div className="col-span-3 flex justify-end">
            <div className="flex gap-[10px]">
              <div>
                <SocialButton
                  icon={YoutubeWhiteIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_DISCORD_URL)}
                />
              </div>
              <div>
                <SocialButton
                  icon={TwitterWhiteIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_TWITTER_URL)}
                />
              </div>
              <div>
                <SocialButton icon={DiscordWhiteIcon} onClick={() => router.push(process.env.NEXT_PUBLIC_GITHUB_URL)} />
              </div>
              <div>
                <SocialButton
                  icon={FacebookWhiteIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_MEDIUM_URL)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-[32px]">
          <div className={styles.description}>
            Proin ac quam et lectus vestibulum blandit. Nunc maximus nibh at placerat tincidunt. Nam sem lacus, ornare
            non ante sed.
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
          <div className={styles.userType}>
            {userType.map((item, index) => (
              <div key={index}>
                <ArtistTypeCard name={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  )
}

export default ProfileHeaderSection

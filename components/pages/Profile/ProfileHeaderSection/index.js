import React from 'react'

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

import ProfileArtistCard from 'components/Card/ProfileArtistCard'
import GradientButton from 'components/Button/GradientButton'
import SocialButton from 'components/Button/SocialButton'
import AddressButton from 'components/Button/AddressButton'

// styles
import styles from './index.module.scss'

const ProfileHeaderSection = props => {
  const { viewport } = props
  return (
    <div className={styles.container}>
      <div className={styles.headerImage}>
        <Image src={HeaderImage} alt="" objectFit="cover" />

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
      </div>
      <div></div>
    </div>
  )
}

export default ProfileHeaderSection

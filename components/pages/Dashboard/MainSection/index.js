import React, { useMemo, useRef, useState } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { useWallet } from '@solana/wallet-adapter-react'
import { getShortAddress } from 'utils/wallet.util'

// custom components
import DashboardArtistCard from 'components/Card/DashboardArtistCard'
import SocialButton from 'components/Button/SocialButton'
import AddressButton from 'components/Button/AddressButton'
import IconButton from 'components/Button/IconButton'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import BannerImage from 'assets/images/alexander-ant.png'
import AvatarImage from 'assets/images/dashboard-avatar.png'
import CameraWhiteIcon from 'assets/icons/camera-white.svg'
import FacebookWhiteIcon from 'assets/icons/facebook-white.svg'
import DiscordWhiteIcon from 'assets/icons/discord-white.svg'
import TwitterWhiteIcon from 'assets/icons/twitter-white.svg'
import YoutubeWhiteIcon from 'assets/icons/youtube-white.svg'
import SettingWhiteIcon from 'assets/icons/setting-white.svg'
import YoutubeHoverIcon from 'assets/icons/youtube-hover.svg'
import TwitterHoverIcon from 'assets/icons/twitter-hover.svg'
import DiscordHoverIcon from 'assets/icons/discord-hover.svg'
import FacebookHoverIcon from 'assets/icons/facebook-hover.svg'
import SettingGreenIcon from 'assets/icons/setting-green-01.svg'

// styles
import styles from './index.module.scss'

const MainSection = props => {
  const { viewport } = props

  const router = useRouter()

  const { publicKey } = useWallet()
  const shortAddress = useMemo(() => getShortAddress(publicKey), [publicKey])

  const inputFile = useRef(null)
  const [bannerImage, setBannerImage] = useState(BannerImage)

  const handleChangeBannerImage = event => {
    setBannerImage(URL.createObjectURL(event.target.files[0]))
  }

  const copyToClipboard = value => {
    navigator.clipboard.writeText(value)
  }

  return (
    <div className={styles.container}>
      <div className={styles.topLeftEllipse}>
        <Image src={EllipseGreen} alt="" objectFit="cover" />
      </div>
      <div className={styles.bannerImage}>
        <Image src={bannerImage} alt="" width={1535} height={460} objectFit="cover" className="rounded-[30px]" />
        <div className="absolute bottom-7 right-7 cursor-pointer z-20">
          <IconButton icon={CameraWhiteIcon} onClick={() => inputFile.current.click()} backgroundColor="transparent" />
          <input
            type="file"
            id="file"
            ref={inputFile}
            style={{ display: 'none' }}
            onChange={event => handleChangeBannerImage(event)}
          />
        </div>
      </div>
      <div className="w-full z-10">
        <div className="grid grid-cols-12 items-center -mt-[60px] lg:mt-[-95px]">
          <div className="col-span-3" />
          <div className="col-span-6">
            <DashboardArtistCard image={AvatarImage} artistName="Artist Name" viewport={viewport} />
            <div className="hidden lg:flex justify-center mt-[16px]">
              <AddressButton
                label={shortAddress}
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '89px' : '192px'}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '29px' : '51px'}
                onClick={() => copyToClipboard(publicKey.toBase58())}
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
              <div>
                <SocialButton
                  icon={SettingWhiteIcon}
                  iconHover={SettingGreenIcon}
                  onClick={() => router.push('/settings')}
                />
              </div>
            </div>
          </div>
          <div className="col-span-3 flex justify-end">
            <div className="flex lg:hidden justify-center lg:mt-[16px]">
              <AddressButton
                label={shortAddress}
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '89px' : '146px'}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '29px' : '51px'}
                onClick={() => copyToClipboard(publicKey.toBase58())}
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
              <div>
                <SocialButton
                  icon={SettingWhiteIcon}
                  iconHover={SettingGreenIcon}
                  onClick={() => router.push('/settings')}
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
      </div>
    </div>
  )
}

export default MainSection

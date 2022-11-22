import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// next components
import Image from 'next/image'

// third party components
import { getShortAddress } from 'utils/wallet.util'

// custom components
import ProfileArtistCard from 'components/Card/ProfileArtistCard'
import SocialButton from 'components/Button/SocialButton'
import AddressButton from 'components/Button/AddressButton'
import CategoryChip from 'components/Chip/CategoryChip'

// custom functions
import { useViewport } from 'utils'

// images and icons
import Rect1620x480Image from 'assets/icons/rect-1620x480.svg'
import Rect512x512Image from 'assets/icons/rect-512x512.svg'
import TelegramWhiteIcon from 'assets/icons/telegram-white.svg'
import DiscordWhiteIcon from 'assets/icons/discord-white.svg'
import TwitterWhiteIcon from 'assets/icons/twitter-white.svg'
import IGWhiteIcon from 'assets/icons/instagram-white.svg'
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'
import IGHoverIcon from 'assets/icons/instagram-hover.svg'
import TwitterHoverIcon from 'assets/icons/twitter-hover.svg'
import DiscordHoverIcon from 'assets/icons/discord-hover.svg'
import TelegramHoverIcon from 'assets/icons/telegram-hover.svg'

// styles
import styles from './index.module.scss'

const MainSection = prop => {
  const { artistInfo, categoryList } = prop

  const router = useRouter()

  const viewport = useViewport()

  const [follow, setFollow] = useState(false)

  const copyToClipboard = value => {
    navigator.clipboard.writeText(value)
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerImage}>
        <img
          src={
            artistInfo.banner_picture !== undefined && artistInfo.banner_picture !== null
              ? artistInfo.banner_picture
              : Rect1620x480Image.src
          }
          alt=""
          width={1620}
          height={480}
          className="w-full object-cover rounded-[15px] lg:rounded-[30px]"
        />
      </div>
      <div className="w-full">
        <div className="grid grid-cols-12 items-center mt-[-60px]">
          <div className="col-span-3 mt-[-70px]">
            <div className="flex gap-[15px]">
              <div className="cursor-pointer flex hover:opacity-60">
                <div className="text-[#EFF0F6] font-bold">444</div>&nbsp;<div className="text-[#B5B6BA]">Followers</div>
              </div>
              <div className="cursor-pointer flex hover:opacity-60">
                <div className="text-[#EFF0F6] font-bold">444</div>&nbsp;<div className="text-[#B5B6BA]">Following</div>
              </div>
            </div>
          </div>
          <div className="col-span-6">
            <ProfileArtistCard
              image={
                artistInfo.profile_picture !== undefined && artistInfo.profile_picture !== null
                  ? artistInfo.profile_picture
                  : Rect512x512Image.src
              }
              name={artistInfo.username}
            />
            <div className="flex justify-center mt-[9px] lg:mt-[16px]">
              <AddressButton
                label={getShortAddress(artistInfo.wallet_id)}
                onClick={() => copyToClipboard(artistInfo.wallet_id || '')}
              />
            </div>

            <div className="flex lg:hidden w-full h-8 justify-center mt-[15px] gap-[10px]">
              {artistInfo.ig_url !== null && (
                <div>
                  <SocialButton
                    icon={IGWhiteIcon}
                    iconHover={IGHoverIcon}
                    onClick={() => router.push(artistInfo.ig_url)}
                  />
                </div>
              )}
              {artistInfo.discord_url !== null && (
                <div>
                  <SocialButton
                    icon={DiscordWhiteIcon}
                    iconHover={DiscordHoverIcon}
                    onClick={() => router.push(artistInfo.discord_url)}
                  />
                </div>
              )}
              {artistInfo.twitter_url !== null && (
                <div>
                  <SocialButton
                    icon={TwitterWhiteIcon}
                    iconHover={TwitterHoverIcon}
                    onClick={() => router.push(artistInfo.twitter_url)}
                  />
                </div>
              )}
              {artistInfo.telegram_url !== null && (
                <div>
                  <SocialButton
                    icon={TelegramWhiteIcon}
                    iconHover={TelegramHoverIcon}
                    onClick={() => router.push(artistInfo.telegram_url)}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="col-span-3 flex justify-end mt-[-80px]">
            <div className="hidden lg:flex gap-[10px] h-[46px]">
              {artistInfo.ig_url !== null && (
                <div>
                  <SocialButton
                    icon={IGWhiteIcon}
                    iconHover={IGHoverIcon}
                    onClick={() => router.push(artistInfo.ig_url)}
                  />
                </div>
              )}
              {artistInfo.discord_url !== null && (
                <div>
                  <SocialButton
                    icon={DiscordWhiteIcon}
                    iconHover={DiscordHoverIcon}
                    onClick={() => router.push(artistInfo.discord_url)}
                  />
                </div>
              )}
              {artistInfo.twitter_url !== null && (
                <div>
                  <SocialButton
                    icon={TwitterWhiteIcon}
                    iconHover={TwitterHoverIcon}
                    onClick={() => router.push(artistInfo.twitter_url)}
                  />
                </div>
              )}
              {artistInfo.telegram_url !== null && (
                <div>
                  <SocialButton
                    icon={TelegramWhiteIcon}
                    iconHover={TelegramHoverIcon}
                    onClick={() => router.push(artistInfo.telegram_url)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className={`flex justify-center w-full ${
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'mt-[12px]' : 'mt-[12px]'
          }`}
        >
          <div className="max-w-[734px]">
            <div className={styles.description}>{artistInfo.bio}</div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
            <></>
          ) : (
            <div className="flex justify-center mt-[20px] mb-[10px]">
              <div className={styles.categoryList}>
                {categoryList.map((item, index) => (
                  <div key={index}>{item.length > 0 && <CategoryChip data={{ value: item }} />}</div>
                ))}
              </div>
            </div>
          )}
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
                <div className={styles.nftInfoValue}>Collectors</div>
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
      </div>
      <div></div>
    </div>
  )
}

export default MainSection

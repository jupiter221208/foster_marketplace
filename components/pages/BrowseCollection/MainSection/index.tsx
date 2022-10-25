import React, { useMemo } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// custom components
import BrowseArtistCard from 'components/Card/BrowseArtistCard'
import SocialButton from 'components/Button/SocialButton'
import CategoryChip from 'components/Chip/CategoryChip'

// images and icons
import HeaderImage from 'assets/images/browse-collection-header.png'
import TelegramWhiteIcon from 'assets/icons/telegram-white.svg'
import DiscordWhiteIcon from 'assets/icons/discord-white.svg'
import TwitterWhiteIcon from 'assets/icons/twitter-white.svg'
import instagramWhiteIcon from 'assets/icons/instagram-white.svg'
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'
import SolanaSolLogoIcon from 'assets/icons/solana-sol-logo.svg'
import InstagramHoverIcon from 'assets/icons/instagram-hover.svg'
import TwitterHoverIcon from 'assets/icons/twitter-hover.svg'
import DiscordHoverIcon from 'assets/icons/discord-hover.svg'
import TelegramHoverIcon from 'assets/icons/telegram-hover.svg'

// styles
import styles from './index.module.scss'
import { Url } from 'url'
import { useSelector } from 'react-redux'
import LoadingModal from 'components/Modal/LoadingModal'

import { getPriceValue } from 'utils/strings'

const MainSection = ({ collection }) => {
  const { creators, json, nfts } = collection

  const router = useRouter()

  const isLoading = useSelector<any>(state => state.isLoading)

  const items = useMemo(() => nfts?.length || 0, nfts)

  const owners = useMemo(() => {
    let owners = []
    if (nfts)
      nfts.forEach(nft => {
        if (owners[nft.owner] === undefined) {
          owners.push(nft.owner)
        }
      })
    return owners.length
  }, nfts)

  const floorPrice = useMemo(() => {
    let prices = []
    if (nfts)
      nfts.forEach(nft => {
        if (nft.price) prices.push(nft.price)
      })
    if (prices.length === 0) return 0
    return Math.min.apply(Math, prices)
  }, nfts)

  const totalVolume = useMemo(() => {
    let totalVolume = 0
    if (nfts)
      nfts.forEach(nft => {
        if (nft.price) totalVolume += nft.price
      })
    return totalVolume
  }, nfts)

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.headerLoading} />
      ) : (
        <div className={styles.headerImage}>
          <img src={HeaderImage.src} alt="" className="rounded-[20px]" />
        </div>
      )}
      <div className="w-full">
        <div className="grid grid-cols-12 items-center -mt-[60px] lg:mt-[-95px]">
          <div className="col-span-3" />
          <div className="col-span-6">
            <BrowseArtistCard image={json?.image} collectionName={json?.name} artistName={creators} />
            {isLoading && (
              <div className="col-span-12 py-10">
                <LoadingModal open={isLoading} />
              </div>
            )}

            <div className="flex lg:hidden w-full justify-center mt-[5px] gap-[10px]">
              <div>
                <SocialButton
                  icon={instagramWhiteIcon}
                  iconHover={InstagramHoverIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_INSTAGRAM_URL as unknown as Url)}
                />
              </div>
              <div>
                <SocialButton
                  icon={TwitterWhiteIcon}
                  iconHover={TwitterHoverIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_TWITTER_URL as unknown as Url)}
                />
              </div>
              <div>
                <SocialButton
                  icon={DiscordWhiteIcon}
                  iconHover={DiscordHoverIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_DISCORD_URL as unknown as Url)}
                />
              </div>
              <div>
                <SocialButton
                  icon={TelegramWhiteIcon}
                  iconHover={TelegramHoverIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_MEDIUM_URL as unknown as Url)}
                />
              </div>
            </div>
          </div>
          <div className="col-span-3 flex justify-end">
            <div className="hidden lg:flex gap-[10px]">
              <div>
                <SocialButton
                  icon={instagramWhiteIcon}
                  iconHover={InstagramHoverIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_DISCORD_URL as unknown as Url)}
                />
              </div>
              <div>
                <SocialButton
                  icon={TwitterWhiteIcon}
                  iconHover={TwitterHoverIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_TWITTER_URL as unknown as Url)}
                />
              </div>
              <div>
                <SocialButton
                  icon={DiscordWhiteIcon}
                  iconHover={DiscordHoverIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_GITHUB_URL as unknown as Url)}
                />
              </div>
              <div>
                <SocialButton
                  icon={TelegramWhiteIcon}
                  iconHover={TelegramHoverIcon}
                  onClick={() => router.push(process.env.NEXT_PUBLIC_TELEGRAM_URL as unknown as Url)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full mt-[32px]">
          <div className="max-w-[734px]">
            <div className={styles.description}>{json?.description}</div>
          </div>
        </div>
        <div className="flex justify-center mt-[16px]">
          <div className={`${styles.nftInfo} grid grid-cols-12`}>
            {!isLoading && (
              <>
                <div className="col-span-3 flex justify-center items-center">
                  <div className="text-center">
                    <div className={styles.nftInfoLabel}>{items}</div>
                    <div className={styles.nftInfoValue}>Items</div>
                  </div>
                </div>
                <div className="col-span-3 flex justify-center items-center">
                  <div className="text-center">
                    <div className={styles.nftInfoLabel}>{owners}</div>
                    <div className={styles.nftInfoValue}>Owners</div>
                  </div>
                </div>
                <div className="col-span-3 flex justify-center items-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <Image src={SolanaLogoIcon} alt="" />
                      <div className={`${styles.nftInfoLabel} ml-[8px]`}>{getPriceValue(floorPrice)}</div>
                    </div>
                    <div className={styles.nftInfoValue}>Floor Price</div>
                  </div>
                </div>
                <div className="col-span-3 flex justify-center items-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <Image src={SolanaSolLogoIcon} alt="" />
                      <div className={`${styles.nftInfoLabel} ml-[8px]`}>{getPriceValue(totalVolume)}</div>
                    </div>

                    <div className={styles.nftInfoValue}>Total Volume</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-[30px]">
          <div className={styles.categoryList}>
            {json?.attributes &&
              json?.attributes.map((item, index) => (
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

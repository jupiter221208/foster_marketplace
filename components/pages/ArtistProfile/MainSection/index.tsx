import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// next components
import Image from 'next/image'

// third party components
import { getShortAddress } from 'utils/wallet.util'

// custom components
import ReadMoreModal from 'components/Modal/ReadMoreModal'
import ProfileArtistCard from 'components/Card/ProfileArtistCard'
import AddressButton from 'components/Button/AddressButton'
import FollowModal from 'components/Modal/FollowModal'
import GradientButton from 'components/Button/GradientButton'
import AvatarFollowIcon from 'assets/icons/avatar-follow.svg'
import OutlineButton from 'components/Button/OutlineButton'

// custom functions
import { useViewport } from 'utils'

// images and icons
import Rect1620x480Image from 'assets/icons/rect-1620x480.svg'
import Rect512x512Image from 'assets/icons/rect-512x512.svg'
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

// api endpoint
import artistsAPI from 'apis/artists'
import SwitchButton from 'components/SwitchButton'

const MainSection = prop => {
  const { artistInfo, categoryList, isOwn } = prop

  const viewport = useViewport()

  const [showFollowModal, setShowFollowModal] = useState(false)
  const [showReadMore, setShowReadMore] = useState(false)
  const [type, setType] = useState(0)
  const [follow, setFollow] = useState(false)
  const [collectorEnable, setCollectorEnable] = useState(false)

  useEffect(() => {
    setFollow(artistInfo ? artistInfo.followed : false)
  }, artistInfo)

  const copyToClipboard = value => {
    navigator.clipboard.writeText(value)
  }

  const followArtist = wallet => {
    artistsAPI.followArtist(wallet).then(response => {
      if (response && response.followed_wallet_id) {
        setFollow(true)
      }
    })
  }

  const unfollowArtist = wallet => {
    artistsAPI.unfollowArtist(wallet).then(response => {
      setFollow(false)
    })
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
          {isOwn === false ? (
            <div className="col-span-3 mt-[-20px] lg:mt-[-70px]">
              {follow ? (
                <OutlineButton
                  label="Following"
                  onClick={() => unfollowArtist(artistInfo.wallet_id)}
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '89px' : '146px'}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '29px' : '51px'}
                  fontSize={
                    viewport === 'xs' ? '12px' : viewport === 'sm' ? '14px' : viewport === 'md' ? '14px' : '18px'
                  }
                />
              ) : (
                <GradientButton
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '89px' : '146px'}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '29px' : '51px'}
                  fontSize={
                    viewport === 'xs' ? '12px' : viewport === 'sm' ? '14px' : viewport === 'md' ? '14px' : '18px'
                  }
                  borderRadius={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '6px' : '12px'}
                  label="Follow"
                  direction={'rtl'}
                  icon={AvatarFollowIcon}
                  onClick={() => followArtist(artistInfo.wallet_id)}
                />
              )}
            </div>
          ) : (
            <div className="col-span-3 mt-[-20px] lg:mt-[-70px]">
              <div className="gap-[15px] mt-[16px] lg:flex lg:mt-[0px]">
                <div
                  className="cursor-pointer flex hover:opacity-60"
                  onClick={() => {
                    setType(0)
                    setShowFollowModal(true)
                  }}
                >
                  <div className="text-[#EFF0F6] text-[14px] lg:text-[16px] font-bold">{artistInfo.followers}</div>
                  &nbsp;
                  <div className="text-[#B5B6BA] text-[14px] lg:text-[16px]">Followers</div>
                </div>
                <div
                  className="cursor-pointer flex hover:opacity-60"
                  onClick={() => {
                    setType(1)
                    setShowFollowModal(true)
                  }}
                >
                  <div className="text-[#EFF0F6] text-[14px] lg:text-[16px] font-bold">{artistInfo.following}</div>
                  &nbsp;
                  <div className="text-[#B5B6BA] text-[14px] lg:text-[16px]">Following</div>
                </div>
              </div>
            </div>
          )}
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
          </div>
          <div className="col-span-3 flex justify-end mt-[-20px] lg:mt-[-80px]">
            {/* <div className="hidden lg:flex gap-[10px] h-[46px]"> */}
            <div className="lg:flex flex-nowrap gap-[10px]">
              <div className={`${styles.collectorProfile} hidden lg:flex`}>Artist Profile</div>
              <SwitchButton enabled={collectorEnable} onChange={() => setCollectorEnable(!collectorEnable)} />
            </div>
          </div>
        </div>
        <div
          className={`flex justify-center w-full ${
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'mt-[12px]' : 'mt-[12px]'
          }`}
        >
          <div className="max-w-[678px]">
            <div className={styles.description}>
              {artistInfo.bio}&nbsp;
              <span className={styles.readMore} onClick={() => setShowReadMore(!showReadMore)}>
                Read more
              </span>
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

      {showFollowModal && (
        <FollowModal
          open={showFollowModal}
          close={() => setShowFollowModal(false)}
          type={type}
          wallet={artistInfo.wallet_id}
        />
      )}

      {showReadMore && (
        <ReadMoreModal
          open={showReadMore}
          close={() => setShowReadMore(false)}
          type={type}
          artistInfo={artistInfo}
          categoryList={categoryList}
        />
      )}
    </div>
  )
}

export default MainSection

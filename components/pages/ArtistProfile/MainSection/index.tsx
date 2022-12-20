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
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import PositiveButton from 'components/Button/PositiveButton'
import NegativeButton from 'components/Button/NegativeButton'

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
import ProfileArtistMobileCard from 'components/Card/ProfileArtistMobileCard'

const MainSection = prop => {
  const { artistInfo, categoryList, isOwn } = prop

  const viewport = useViewport()

  const [showFollowModal, setShowFollowModal] = useState(false)
  const [showReadMore, setShowReadMore] = useState(false)
  const [type, setType] = useState(0)
  const [follow, setFollow] = useState(false)
  const [artistEnable, setArtistEnable] = useState(false)

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

  const getShortDescription = description => {
    if (description === null || description === undefined) return ''
    if (viewport === 'xs') {
      if (description.length > 120) return description.slice(0, 120) + '...'
    } else if (viewport === 'sm') {
      if (description.length > 200) return description.slice(0, 200) + '...'
    } else if (viewport === 'md') {
      if (description.length > 200) return description.slice(0, 200) + '...'
    } else {
      if (description.length > 200) return description.slice(0, 220) + '...'
    }
    return description
  }

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
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
          className="w-full object-cover rounded-[30px]"
        />
      </div>
      <div className="w-full">
        <div className={styles.topLeftEllipse}>
          <Image src={EllipseGreen} width={2021} height={2021} alt="" />
        </div>
        <div className="grid grid-cols-12 items-center mt-[-80px] z-10">
          <div className="col-span-3 h-full flex items-center">
            <div className="flex gap-[15px]">
              <div
                className="cursor-pointer flex hover:opacity-60"
                onClick={() => {
                  setType(0)
                  setShowFollowModal(true)
                }}
              >
                <div className={styles.whiteText}>{artistInfo.followers}</div>
                &nbsp;
                <div className={styles.grayText}>Followers</div>
              </div>
              <div
                className="cursor-pointer flex hover:opacity-60"
                onClick={() => {
                  setType(1)
                  setShowFollowModal(true)
                }}
              >
                <div className={styles.whiteText}>{artistInfo.following}</div>
                &nbsp;
                <div className={styles.grayText}>Following</div>
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
          </div>

          <div className="col-span-3 h-full flex justify-end items-center">
            {follow ? (
              <NegativeButton
                width={146}
                height={53}
                label="Following"
                onClick={() => unfollowArtist(artistInfo.wallet_id)}
              />
            ) : (
              <PositiveButton
                width={146}
                height={53}
                label="Follow"
                onClick={() => followArtist(artistInfo.wallet_id)}
              />
            )}
          </div>
        </div>
        <div className="flex justify-center w-full mt-[12px]">
          <div className="max-w-[678px] w-full flex flex-wrap justify-center mt-[9px]">
            {artistInfo.wallet_id && (
              <AddressButton
                label={getShortAddress(artistInfo.wallet_id)}
                onClick={() => copyToClipboard(artistInfo.wallet_id || '')}
              />
            )}

            <span className={styles.description}>
              {getShortDescription(artistInfo.bio)}&nbsp;
              {artistInfo.bio && (
                <span className={styles.readMore} onClick={() => setShowReadMore(!showReadMore)}>
                  Read&nbsp;more
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="flex justify-center mt-[16px]">
          <div className={styles.statesBack}>
            <div className="w-full flex justify-between">
              <div className={styles.collectorProfile}>{artistEnable ? 'Artist Profile' : 'Collector Profile'}</div>
              <SwitchButton enabled={artistEnable} onChange={() => setArtistEnable(!artistEnable)} />
            </div>
            <div className={`${styles.nftInfo} grid grid-cols-12 gap-[20px] xs:gap-[24px] lg:gap-[35px] mt-[10px]`}>
              <div className="col-span-3 flex justify-center items-center">
                <div className="text-center">
                  <div className="flex justify-center">
                    <div className={styles.nftInfoLabel}>800</div>
                  </div>
                  <div className={styles.nftInfoValue}>{artistEnable ? 'NFTS CREATED' : 'NFTS COLLECTED'}</div>
                </div>
              </div>
              <div className="col-span-3 flex justify-center items-center">
                <div className="text-center">
                  <div className="flex justify-center">
                    <div className={styles.nftInfoLabel}>20</div>
                  </div>
                  <div className={styles.nftInfoValue}>
                    {artistEnable ? 'COLLECTIONS PUBLISHED' : 'UNIQUE COLLECTIONS'}
                  </div>
                </div>
              </div>
              <div className="col-span-3 flex justify-center items-center">
                <div className="text-center">
                  <div className="flex justify-center">
                    <div className={styles.nftInfoLabel}>1000</div>
                  </div>
                  <div className={styles.nftInfoValue}>{artistEnable ? 'MONTHLY VISITORS' : 'CREATORS SUPPORTED'}</div>
                </div>
              </div>
              <div className="col-span-3 flex justify-center items-center">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <div className={styles.nftInfoLabel}>
                      <Image src={SolanaLogoIcon} width={23} height={23} alt="" />
                      <div className={'ml-[6px]'}>62.3</div>
                    </div>
                  </div>

                  <div className={styles.nftInfoValue}>{artistEnable ? 'SALES VOLUME' : 'PURCHASE VOLUME'}</div>
                </div>
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
  ) : (
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
          className="w-full object-cover rounded-none"
        />
      </div>
      <div className="w-full">
        <div className={styles.topLeftEllipse}>
          <Image src={EllipseGreen} width={2021} height={2021} alt="" />
        </div>
        <div className="grid grid-cols-12 items-center mt-[-50px] lg:mt-[-80px]">
          <div className="col-span-6">
            <ProfileArtistMobileCard
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

          <div className="col-span-3 flex justify-end mt-[-20px] lg:mt-[-50px]">
            {follow ? (
              <NegativeButton
                width={80}
                height={29}
                label="Following"
                onClick={() => unfollowArtist(artistInfo.wallet_id)}
              />
            ) : (
              <PositiveButton
                width={80}
                height={29}
                label="Follow"
                onClick={() => followArtist(artistInfo.wallet_id)}
              />
            )}
          </div>
        </div>
        <div className="flex justify-center w-full mt-[12px]">
          <div className="max-w-[678px]">
            <span className={styles.description}>
              {getShortDescription(artistInfo.bio) + ' '}
              <span className={styles.readMore} onClick={() => setShowReadMore(!showReadMore)}>
                Read&nbsp;more
              </span>
            </span>
          </div>
        </div>
        <div className="flex justify-center mt-[16px]">
          <div className={styles.statesBack}>
            <div className="w-full flex justify-between">
              <div className={styles.collectorProfile}>{artistEnable ? 'Artist Profile' : 'Collector Profile'}</div>
              <SwitchButton enabled={artistEnable} onChange={() => setArtistEnable(!artistEnable)} />
            </div>
            <div className={`${styles.nftInfo} grid grid-cols-12 gap-[20px] xs:gap-[24px] lg:gap-[35px] mt-[10px]`}>
              <div className="col-span-3 flex justify-center items-center">
                <div className="text-center">
                  <div className="flex justify-center">
                    <div className={styles.nftInfoLabel}>800</div>
                  </div>
                  <div className={styles.nftInfoValue}>NFTS</div>
                </div>
              </div>
              <div className="col-span-3 flex justify-center items-center">
                <div className="text-center">
                  <div className="flex justify-center">
                    <div className={styles.nftInfoLabel}>20</div>
                  </div>
                  <div className={styles.nftInfoValue}>COLLECTIONS</div>
                </div>
              </div>
              <div className="col-span-3 flex justify-center items-center">
                <div className="text-center">
                  <div className="flex justify-center">
                    <div className={styles.nftInfoLabel}>1000</div>
                  </div>
                  <div className={styles.nftInfoValue}>{artistEnable ? 'VISITORS' : 'SUPPORTED'}</div>
                </div>
              </div>
              <div className="col-span-3 flex justify-center items-center">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <div className={styles.nftInfoLabel}>
                      <Image src={SolanaLogoIcon} width={18} height={18} alt="" />
                      <div className={'ml-[6px]'}>62.3</div>
                    </div>
                  </div>

                  <div className={styles.nftInfoValue}>{artistEnable ? 'SALES' : 'PURCHASES'}</div>
                </div>
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

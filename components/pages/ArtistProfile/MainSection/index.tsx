import React, { useEffect, useState } from 'react'

import { useWallet } from '@solana/wallet-adapter-react'

// next components
import Image from 'next/image'

// third party components
import { getShortAddress } from 'utils/wallet.util'
import { getShortDescription } from 'utils/strings'

// custom components
import ReadMoreModal from 'components/Modal/ReadMoreModal'
import ProfileArtistCard from 'components/Card/ProfileArtistCard'
import AddressButton from 'components/Button/AddressButton'
import FollowModal from 'components/Modal/FollowModal'
import FollowModalMobile from 'components/Modal/FollowModalMobile'
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

const MainSection = prop => {
  const { artistInfo, statsInfo, categoryList, isOwn, artistEnable, setArtistEnable } = prop

  const viewport = useViewport()
  const { publicKey } = useWallet()

  const [showFollowModal, setShowFollowModal] = useState(false)
  const [showReadMore, setShowReadMore] = useState(false)
  const [type, setType] = useState(0)
  const [follow, setFollow] = useState(false)
  const [artistFollowing, setArtistFollowing] = useState(artistInfo.following)
  const [artistFollowers, setArtistFollowers] = useState(artistInfo.followers)

  useEffect(() => {
    setFollow(artistInfo ? artistInfo.followed : false)
    setArtistFollowing(artistInfo.following)
    setArtistFollowers(artistInfo.followers)
  }, [artistInfo])

  const copyToClipboard = value => {
    navigator.clipboard.writeText(value)
  }

  const followArtist = wallet => {
    artistsAPI.followArtist(wallet).then(response => {
      if (response && response.followed_wallet_id) {
        setFollow(true)
        setArtistFollowing(artistFollowing + 1)
      }
    })
  }

  const unfollowArtist = wallet => {
    artistsAPI.unfollowArtist(wallet).then(response => {
      setFollow(false)
      setArtistFollowing(artistFollowing - 1)
    })
  }

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    // desktop view
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
        <div className="grid grid-cols-12 items-center mt-[-70px] z-10">
          <div className="col-span-3 h-full flex items-center">
            <div className="flex gap-[15px] z-10">
              <div
                className="cursor-pointer flex hover:opacity-60"
                onClick={() => {
                  setType(0)
                  setShowFollowModal(true)
                }}
              >
                <div className={styles.whiteText}>{artistFollowers}</div>
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
                <div className={styles.whiteText}>{artistFollowing}</div>
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
          {!isOwn && (
            <div className="col-span-3 h-full flex justify-end items-center pt-[10px]">
              {follow ? (
                <NegativeButton
                  width={146}
                  height={53}
                  fontFamily="KCDurhamBoxcar"
                  fontSize={30}
                  label="Following"
                  onClick={() => unfollowArtist(artistInfo.wallet_id)}
                />
              ) : (
                <PositiveButton
                  width={146}
                  height={53}
                  fontFamily="KCDurhamBoxcar"
                  fontSize={30}
                  label="Follow"
                  onClick={() => followArtist(artistInfo.wallet_id)}
                />
              )}
            </div>
          )}
        </div>
        <div className="w-full flex justify-center mt-[12px]">
          <div className="max-w-[678px] w-full flex flex-wrap justify-center mt-[9px] z-10">
            {artistInfo.wallet_id && (
              <AddressButton
                label={getShortAddress(artistInfo.wallet_id)}
                onClick={() => copyToClipboard(artistInfo.wallet_id || '')}
              />
            )}

            {artistInfo.bio && (
              <span className={styles.description}>
                {getShortDescription(viewport, artistInfo.bio)}&nbsp;
                <span className={styles.readMore} onClick={() => setShowReadMore(!showReadMore)}>
                  Read&nbsp;more
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="w-full flex justify-center mt-[30px] cursor-pointer">
          {artistEnable ? (
            <div className={styles.switchArea}>
              <div className="w-[50%] h-full " onClick={() => setArtistEnable(false)}>
                <div className={styles.switchDisabled}>Collector</div>
              </div>
              <div className="w-[50%] h-full absolute top-0 right-0">
                <div className={styles.switchEnabled}>Artist</div>
              </div>
            </div>
          ) : (
            <div className={styles.switchArea}>
              <div className="w-[50%] h-full">
                <div className={styles.switchEnabled}>Collector</div>
              </div>
              <div
                className="w-[50%] h-full absolute top-0 right-0 cursor-pointer"
                onClick={() => setArtistEnable(true)}
              >
                <div className={styles.switchDisabled}>Artist</div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full flex justify-center mt-[14px] lg:mt-[15px]">
          <div className="max-w-[698px] w-full flex justify-center">
            <div className={styles.statesBack}>
              <div className="w-full flex justify-between items-center">
                <div className="flex justify-center items-center">
                  <div className="text-center">
                    <div className="flex justify-center">
                      <div className={styles.nftInfoLabel}>
                        {artistEnable ? statsInfo.nfts_created : statsInfo.nfts_collected}
                      </div>
                    </div>
                    <div className={styles.nftInfoValue}>{artistEnable ? 'NFTS CREATED' : 'NFTS COLLECTED'}</div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="text-center">
                    <div className="flex justify-center">
                      <div className={styles.nftInfoLabel}>
                        {artistEnable ? statsInfo.collections_created : statsInfo.collections_collected}
                      </div>
                    </div>
                    <div className={styles.nftInfoValue}>
                      {artistEnable ? 'COLLECTIONS PUBLISHED' : 'UNIQUE COLLECTIONS'}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="text-center">
                    <div className="flex justify-center">
                      <div className={styles.nftInfoLabel}>
                        {artistEnable ? statsInfo.unique_collectors : statsInfo.unique_artists_owned}
                      </div>
                    </div>
                    <div className={styles.nftInfoValue}>
                      {artistEnable ? 'MONTHLY COLLECTORS' : 'CREATORS SUPPORTED'}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <div className={styles.nftInfoLabel}>
                        <Image src={SolanaLogoIcon} width={23} height={23} alt="" />
                        <div className={'ml-[6px]'}>
                          {artistEnable ? statsInfo.sales_volume : statsInfo.purchase_volume}
                        </div>
                      </div>
                    </div>

                    <div className={styles.nftInfoValue}>{artistEnable ? 'SALES VOLUME' : 'PURCHASE VOLUME'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFollowModal && (
        <FollowModal
          open={showFollowModal}
          ownWallet={publicKey?.toBase58()}
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
    // mobile view
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
          className="w-full h-full object-cover rounded-none"
        />
      </div>
      <div className="w-full">
        <div className="z-0">
          <div className={styles.topLeftEllipse}>
            <Image src={EllipseGreen} width={2021} height={2021} alt="" />
          </div>
        </div>
        <div className="w-full flex justify-between items-center mt-[-50px] z-10">
          <ProfileArtistCard
            image={
              artistInfo.profile_picture !== undefined && artistInfo.profile_picture !== null
                ? artistInfo.profile_picture
                : Rect512x512Image.src
            }
            name={artistInfo.username}
          />
          {!isOwn && (
            <div className="mt-10">
              {follow ? (
                <NegativeButton
                  width={80}
                  height={29}
                  fontFamily="KCDurhamBoxcar"
                  fontSize={18}
                  label="Following"
                  onClick={() => unfollowArtist(artistInfo.wallet_id)}
                />
              ) : (
                <PositiveButton
                  width={80}
                  height={29}
                  fontFamily="KCDurhamBoxcar"
                  fontSize={18}
                  label="Follow"
                  onClick={() => followArtist(artistInfo.wallet_id)}
                />
              )}
            </div>
          )}
        </div>
        <div className="mt-2 z-10">
          {artistInfo.wallet_id && (
            <AddressButton
              label={getShortAddress(artistInfo.wallet_id)}
              onClick={() => copyToClipboard(artistInfo.wallet_id || '')}
            />
          )}
        </div>
        <div className="flex gap-[15px] mt-2">
          <div
            className="cursor-pointer flex hover:opacity-60 z-10"
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
            className="cursor-pointer flex hover:opacity-60 z-10"
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
      <div className="flex justify-center w-full flex-wrap mt-[12px] z-10">
        {artistInfo.bio && (
          <span className={styles.description}>
            {getShortDescription(viewport, artistInfo.bio) + ' '}
            <span className={styles.readMore} onClick={() => setShowReadMore(!showReadMore)}>
              Read&nbsp;more
            </span>
          </span>
        )}
      </div>

      <div className="w-full flex justify-center mt-[30px] cursor-pointer">
        {artistEnable ? (
          <div className={styles.switchArea}>
            <div className="w-[50%] h-full " onClick={() => setArtistEnable(false)}>
              <div className={styles.switchDisabled}>Collector</div>
            </div>
            <div className="w-[50%] h-full absolute top-0 right-0">
              <div className={styles.switchEnabled}>Artist</div>
            </div>
          </div>
        ) : (
          <div className={styles.switchArea}>
            <div className="w-[50%] h-full">
              <div className={styles.switchEnabled}>Collector</div>
            </div>
            <div className="w-[50%] h-full absolute top-0 right-0 cursor-pointer" onClick={() => setArtistEnable(true)}>
              <div className={styles.switchDisabled}>Artist</div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex justify-center mt-5">
        <div className={styles.statesBack}>
          <div className="w-full flex justify-between items-center">
            <div className="flex justify-center items-center">
              <div className="text-center">
                <div className="flex justify-center">
                  <div className={styles.nftInfoLabel}>
                    {artistEnable ? statsInfo.nfts_created : statsInfo.nfts_collected}
                  </div>
                </div>
                <div className={styles.nftInfoValue}>NFTS</div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="text-center">
                <div className="flex justify-center">
                  <div className={styles.nftInfoLabel}>
                    {artistEnable ? statsInfo.collections_created : statsInfo.collections_collected}
                  </div>
                </div>
                <div className={styles.nftInfoValue}>COLLECTIONS</div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="text-center">
                <div className="flex justify-center">
                  <div className={styles.nftInfoLabel}>
                    {artistEnable ? statsInfo.unique_collectors : statsInfo.unique_artists_owned}
                  </div>
                </div>
                <div className={styles.nftInfoValue}>{artistEnable ? 'COLLECTORS' : 'SUPPORTED'}</div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <div className={styles.nftInfoLabel}>
                    <Image src={SolanaLogoIcon} width={18} height={18} alt="" />
                    <div className={'ml-[6px]'}>
                      {artistEnable ? statsInfo.sales_volume : statsInfo.purchase_volume}
                    </div>
                  </div>
                </div>

                <div className={styles.nftInfoValue}>{artistEnable ? 'SALES' : 'PURCHASES'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFollowModal && (
        <FollowModalMobile
          open={showFollowModal}
          ownWallet={publicKey?.toBase58()}
          close={() => setShowFollowModal(false)}
          username={artistInfo.username}
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

import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// next components

// third party components
import { getShortAddress } from 'utils/wallet.util'
import { getShortDescription } from 'utils/strings'

// custom components
import ReadMoreModal from 'components/Modal/ReadMoreModal'
import ProfileArtistCard from 'components/Card/ProfileArtistCard'
import AddressButton from 'components/Button/AddressButton'
import FollowModal from 'components/Modal/FollowModal'
import FollowModalMobile from 'components/Modal/FollowModalMobile'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark.svg?component'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'
import BannerImage from 'assets/images/banner-image.png'
import InstagramIcon from 'assets/icons/social-ig.svg?component'
import TwitterIcon from 'assets/icons/social-twitter.svg?component'
import ShareSmallIcon from 'assets/icons/share-black-desktop-small.svg?component'

// styles
import styles from './index.module.scss'

// api endpoint
import artistsAPI from 'apis/artists'
import MenuSocialShare from 'components/Menu/MenuSocialShare'
import { copyClipboardAlert, copyToClipboard, isLoggedIn, validUrl } from 'utils/helpers'
import CopyClipboardChip from 'components/Chip/CopyClipboardChip'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'
import SocialShareModal from 'components/Menu/SocialShareModal'
import ReactPlaceholder from 'react-placeholder/lib'

const MainSection = prop => {
  const { artistInfo, statsInfo, categoryList, isOwn, artistEnable, setArtistEnable, isLoaded } = prop
  const dispatch = useDispatch()
  const viewport = useViewport()
  const { publicKey } = useWallet()
  const { setVisible } = useWalletModal()

  const [openShareModal, setOpenShareModal] = useState(false)
  const [showFollowModal, setShowFollowModal] = useState(false)
  const [showReadMore, setShowReadMore] = useState(false)
  const [type, setType] = useState(0)
  const [follow, setFollow] = useState(false)
  const [artistFollowing, setArtistFollowing] = useState(artistInfo?.following)
  const [artistFollowers, setArtistFollowers] = useState(artistInfo?.followers)

  useEffect(() => {
    if (artistInfo) {
      setFollow(artistInfo ? artistInfo.followed : false)
      setArtistFollowing(artistInfo.following)
      setArtistFollowers(artistInfo.followers)
    }
  }, [artistInfo])

  const followArtist = wallet => {
    if (isLoggedIn()) {
      artistsAPI.followArtist(wallet).then(response => {
        if (response && response.followed_wallet_id) {
          setFollow(true)
          setArtistFollowers(artistFollowers + 1)
        }
      })
    } else {
      dispatch({ type: 'set', loginAndRefresh: true })
      setVisible(true)
    }
  }

  const unfollowArtist = wallet => {
    artistsAPI.unfollowArtist(wallet).then(response => {
      setFollow(false)
      setArtistFollowers(artistFollowers - 1)
    })
  }

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    // desktop view
    <div className={styles.container}>
      <div className={styles.headerImage}>
        <img
          src={
            artistInfo && artistInfo.banner_picture !== undefined && artistInfo.banner_picture !== null
              ? artistInfo?.banner_picture
              : BannerImage.src
          }
          alt=""
          width={1620}
          height={480}
          className="w-full object-cover rounded-[30px]"
        />
      </div>
      <div className="w-full">
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
                artistInfo?.profile_picture !== undefined && artistInfo?.profile_picture !== null
                  ? artistInfo?.profile_picture
                  : DefaultAvatar.src
              }
              name={artistInfo?.username}
            />
          </div>
          {!isOwn && (
            <div className="col-span-3 h-full flex justify-end items-center pt-[10px]">
              <div className="mr-[11px] lg:mr-[24px]">
                <MenuSocialShare
                  type="image"
                  vote={true}
                  message={'Check out this artist on Foster Marketplace @foster_protocol #fostermarketplace'}
                  url={`/${artistInfo?.username}`}
                />
              </div>
              <div>
                {follow ? (
                  <OutlineButton
                    width={146}
                    height={53}
                    label="Following"
                    fontSize={18}
                    borderColor="var(--follow-btn-border-mobile)"
                    borderWidth={2}
                    onClick={() => unfollowArtist(artistInfo?.wallet_id)}
                  />
                ) : (
                  <GradientButton
                    width={146}
                    height={53}
                    fontSize={18}
                    label="Follow"
                    onClick={() => followArtist(artistInfo?.wallet_id)}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex justify-center mt-[12px]">
          <div className="max-w-[678px] w-full flex flex-wrap justify-center mt-[9px] z-10">
            {artistInfo?.wallet_id && (
              <div className="relative">
                <AddressButton
                  label={getShortAddress(artistInfo?.wallet_id)}
                  onClick={() => {
                    copyToClipboard(artistInfo?.wallet_id || '')
                    copyClipboardAlert('wallet-address')
                  }}
                />
                <CopyClipboardChip identifier="wallet-address" />
              </div>
            )}

            <div className="w-full flex gap-[20px] justify-center items-center mt-[13px]">
              {artistInfo?.ig_url !== null && (
                <div>
                  <InstagramIcon onClick={() => window.open(validUrl(artistInfo?.ig_url))} />
                </div>
              )}
              {artistInfo?.twitter_url !== null && (
                <div>
                  <TwitterIcon onClick={() => window.open(validUrl(artistInfo?.twitter_url))} />
                </div>
              )}
            </div>

            {artistInfo?.bio && (
              <span className={styles.description}>
                {getShortDescription(viewport, artistInfo?.bio)}&nbsp;
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
                <div className={styles.switchLeftEnabled}>Collector</div>
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
                        {isLoaded === false ? (
                          <div className="w-full h-full">
                            <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={false} color="#202427">
                              <div></div>
                            </ReactPlaceholder>
                          </div>
                        ) : (
                          <div>{artistEnable ? statsInfo.nfts_created : statsInfo.nfts_collected}</div>
                        )}
                      </div>
                    </div>
                    <div className={styles.nftInfoValue}>{artistEnable ? 'NFTS CREATED' : 'NFTS COLLECTED'}</div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="text-center">
                    <div className="flex justify-center">
                      <div className={styles.nftInfoLabel}>
                        {isLoaded === false ? (
                          <div className="w-full h-full">
                            <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={false} color="#202427">
                              <div></div>
                            </ReactPlaceholder>
                          </div>
                        ) : (
                          <div>{artistEnable ? statsInfo.collections_created : statsInfo.collections_collected}</div>
                        )}
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
                        {isLoaded === false ? (
                          <div className="w-full h-full">
                            <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={false} color="#202427">
                              <div></div>
                            </ReactPlaceholder>
                          </div>
                        ) : (
                          <div> {artistEnable ? statsInfo.unique_collectors : statsInfo.unique_artists_owned}</div>
                        )}
                      </div>
                    </div>
                    <div className={styles.nftInfoValue}>
                      {artistEnable ? 'UNIQUE COLLECTORS' : 'CREATORS SUPPORTED'}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <div className={styles.nftInfoLabel}>
                        {isLoaded === false ? (
                          <div className="w-full h-full">
                            <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={false} color="#202427">
                              <div></div>
                            </ReactPlaceholder>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <SolanaLogoIcon alt="" />
                            <div className={'ml-[6px]'}>
                              {artistEnable ? statsInfo.sales_volume : statsInfo.purchase_volume}
                            </div>
                          </div>
                        )}
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
            artistInfo?.banner_picture !== undefined && artistInfo?.banner_picture !== null
              ? artistInfo?.banner_picture
              : BannerImage.src
          }
          alt=""
          width={1620}
          height={480}
          className="w-full h-full object-cover rounded-none"
        />
        {/* <div className={styles.overlay} /> */}
      </div>
      <div className="w-full">
        <div className="z-0">
          {/* <div className={styles.topLeftEllipse}>
            <EllipseGreen />
          </div> */}
        </div>
        <div className="w-full flex justify-between items-center mt-[-50px] z-10">
          <ProfileArtistCard
            image={
              artistInfo?.profile_picture !== undefined && artistInfo?.profile_picture !== null
                ? artistInfo?.profile_picture
                : DefaultAvatar.src
            }
            name={artistInfo?.username}
            ig_url={artistInfo?.ig_url}
            twitter_url={artistInfo?.twitter_url}
          />
          {!isOwn && (
            <div className="mt-10 flex">
              <div className="mr-[11px] lg:mr-[24px]">
                <div onClick={() => setOpenShareModal(true)}>
                  <ShareSmallIcon alt="" />
                </div>
              </div>
              <div className="w-[80px]">
                {follow ? (
                  <OutlineButton
                    width={80}
                    height={29}
                    fontSize={12}
                    borderRadius={8}
                    label="Following"
                    borderColor="var(--follow-btn-border-mobile)"
                    onClick={() => unfollowArtist(artistInfo?.wallet_id)}
                  />
                ) : (
                  <OutlineButton
                    width={80}
                    height={29}
                    fontSize={12}
                    label="Follow"
                    borderColor="transparent"
                    color="var(--follow-btn-color)"
                    backgroundColor="var(--follow-btn-bg)"
                    borderRadius={8}
                    onClick={() => followArtist(artistInfo?.wallet_id)}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        <div className="mt-2 z-10">
          {artistInfo?.wallet_id && (
            <div className="relative w-[110px]">
              <AddressButton
                label={getShortAddress(artistInfo?.wallet_id)}
                onClick={() => {
                  copyToClipboard(artistInfo?.wallet_id || '')
                  copyClipboardAlert('wallet-address-mobile')
                }}
              />
              <CopyClipboardChip identifier="wallet-address-mobile" />
            </div>
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
            <div className={styles.whiteText}>{artistInfo?.followers}</div>
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
            <div className={styles.whiteText}>{artistInfo?.following}</div>
            &nbsp;
            <div className={styles.grayText}>Following</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full flex-wrap mt-[12px] z-10">
        {artistInfo?.bio && (
          <span className={styles.description}>
            {getShortDescription(viewport, artistInfo?.bio) + ' '}
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
              <div className={styles.switchLeftEnabled}>Collector</div>
            </div>
            <div className="w-[50%] h-full absolute top-0 right-0 cursor-pointer" onClick={() => setArtistEnable(true)}>
              <div className={styles.switchDisabled}>Artist</div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex justify-center mt-2">
        <div className={styles.statesBack}>
          <div className="w-full flex justify-between items-center gap-[5px]">
            <div className={styles.statsArea}>
              {isLoaded === false ? (
                <div className="w-full h-full">
                  <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={false} color="#202427">
                    <div></div>
                  </ReactPlaceholder>
                </div>
              ) : (
                <div className="text-center mt-[9px] mb-[9px]">
                  <div className="flex justify-center">
                    <div className={styles.nftInfoLabelMobile}>
                      {artistEnable ? statsInfo.nfts_created : statsInfo.nfts_collected}
                    </div>
                  </div>
                  <div className={styles.nftInfoValueMobile}>{artistEnable ? 'NFTS CREATED' : 'NFTS COLLECTED'}</div>
                </div>
              )}
            </div>
            <div className={styles.statsArea}>
              {isLoaded === false ? (
                <div className="w-full h-full">
                  <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={false} color="#202427">
                    <div></div>
                  </ReactPlaceholder>
                </div>
              ) : (
                <div className="text-center mt-[9px] mb-[9px]">
                  <div className="flex justify-center">
                    <div className={styles.nftInfoLabelMobile}>
                      {artistEnable ? statsInfo.collections_created : statsInfo.collections_collected}
                    </div>
                  </div>
                  <div className={styles.nftInfoValueMobile}>
                    {artistEnable ? 'COLLECTIONS CREATED' : 'UNIQUE COLLECTIONS'}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full flex justify-between items-center gap-[5px] mt-[5px]">
            <div className={styles.statsArea}>
              {isLoaded === false ? (
                <div className="w-full h-full">
                  <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={false} color="#202427">
                    <div></div>
                  </ReactPlaceholder>
                </div>
              ) : (
                <div className="text-center mt-[9px] mb-[9px]">
                  <div className="flex justify-center">
                    <div className={styles.nftInfoLabelMobile}>
                      {artistEnable ? statsInfo.unique_collectors : statsInfo.unique_artists_owned}
                    </div>
                  </div>
                  <div className={styles.nftInfoValueMobile}>
                    {artistEnable ? 'UNIQUE COLLECTORS' : 'CREATORS SUPPORTED'}
                  </div>
                </div>
              )}
            </div>
            <div className={styles.statsArea}>
              {isLoaded === false ? (
                <div className="w-full h-full">
                  <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={false} color="#202427">
                    <div></div>
                  </ReactPlaceholder>
                </div>
              ) : (
                <div className="text-center mt-[9px] mb-[9px]">
                  <div className="flex items-center justify-center">
                    <div className={styles.nftInfoLabelMobile}>
                      <SolanaLogoMobileIcon />
                      <div className={'ml-[6px]'}>
                        {artistEnable ? statsInfo.sales_volume : statsInfo.purchase_volume}
                      </div>
                    </div>
                  </div>
                  <div className={styles.nftInfoValueMobile}>{artistEnable ? 'SALES VOLUME' : 'PURCHASE VOLUME'}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showFollowModal && (
        <FollowModalMobile
          open={showFollowModal}
          ownWallet={publicKey?.toBase58()}
          close={() => setShowFollowModal(false)}
          username={artistInfo?.username}
          type={type}
          wallet={artistInfo?.wallet_id}
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
      {openShareModal && (
        <SocialShareModal
          open={openShareModal}
          close={() => setOpenShareModal(false)}
          vote={true}
          message={'Check out this artist on Foster Marketplace @foster_protocol #fostermarketplace'}
          url={`/${artistInfo?.username}`}
        />
      )}
    </div>
  )
}

export default MainSection

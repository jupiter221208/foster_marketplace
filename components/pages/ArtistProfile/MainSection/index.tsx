import React, { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// next components
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'
import Image from 'next/image'

// third party components
import { getShortAddress } from 'utils/wallet.util'
import { getShortDescription } from 'utils/strings'
import Lottie from 'lottie-react'

// custom components
import ReadMoreModal from 'components/Modal/ReadMoreModal'
import ProfileArtistCard from 'components/Card/ProfileArtistCard'
import AddressButton from 'components/Button/AddressButton'
import FollowModal from 'components/Modal/FollowModal'
import FollowModalMobile from 'components/Modal/FollowModalMobile'
import IconButton from 'components/Button/IconButton'
import RefreshMobileLottery from 'assets/lottery/refresh-mobile.json'
import RefreshMobileIcon from 'assets/icons/refresh-icon-mobile.svg'

// custom functions
import { useViewport, namePublicFile } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark.svg?component'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'
import BannerImage from 'assets/images/banner-image.png'
import InstagramIcon from 'assets/icons/social-ig.svg?component'
import TwitterIcon from 'assets/icons/social-twitter.svg?component'
import WebSiteIcon from 'assets/icons/website-icon.svg?component'
import ShareSmallIcon from 'assets/icons/share-black-desktop-small.svg?component'
import EditorGreenIcon from 'assets/icons/editor-green.svg'
import CameraWhiteIcon from 'assets/icons/camera-white.svg'

import MenuSocialShare from 'components/Menu/MenuSocialShare'
import { copyClipboardAlert, copyToClipboard, isLoggedIn, validUrl } from 'utils/helpers'
import CopyClipboardChip from 'components/Chip/CopyClipboardChip'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'
import SocialShareModal from 'components/Menu/SocialShareModal'
import Alert from 'components/Alert'

// styles
import styles from './index.module.scss'

// api endpoint
import artistsAPI from 'apis/artists'
import userAPI from 'apis/user'
import uploadFileToS3API from 'apis/aws'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'
import nftsAPI from 'apis/nfts'

const MainSection = prop => {
  const { artistInfo, categoryList, isOwn, isLoaded, setFullScreenView, wallet, reloadPage, hasLoading } = prop
  const dispatch = useDispatch()
  const viewport = useViewport()
  const { publicKey } = useWallet()
  const { setVisible } = useWalletModal()

  // banner part
  const inputBannerFile = useRef<any>(null)
  const [updateBanner, setUpdateBanner] = useState(false)
  const [openBannerEditorModal, setOpenBannerEditorModal] = useState(false)
  const [croppedBanner, setCroppedBanner] = useState('')
  const [banner, setBanner] = useState<any>()
  const [bannerUploadingToS3, setBannerUploadingToS3] = useState<boolean>(false)
  const [bannerPictureUrl, setBannerPictureUrl] = useState('')
  const [alertData, setAlertData] = useState<any[]>([])
  const [showAlert, setShowAlert] = useState(false)

  // avatar part
  const [updateAvatar, setUpdateAvatar] = useState(false)
  const [openAvatarEditorModal, setOpenAvatarEditorModal] = useState(false)
  const [avatar, setAvatar] = useState<any>()
  const [croppedAvatar, setCroppedAvatar] = useState('')

  const [avatarUploadingToS3, setAvatarUploadingToS3] = useState<boolean>(false)
  const [avatarPictureUrl, setAvatarPictureUrl] = useState('')

  const [openShareModal, setOpenShareModal] = useState(false)
  const [showFollowModal, setShowFollowModal] = useState(false)
  const [showReadMore, setShowReadMore] = useState(false)
  const [type, setType] = useState(0)
  const [follow, setFollow] = useState(false)
  const [artistFollowing, setArtistFollowing] = useState(artistInfo?.following)
  const [artistFollowers, setArtistFollowers] = useState(artistInfo?.followers)
  const [followLoaded, setFollowLoaded] = useState(false)

  useEffect(() => {
    if (artistInfo) {
      setFollow(artistInfo ? artistInfo.followed : false)
      setArtistFollowing(artistInfo.following)
      setArtistFollowers(artistInfo.followers)

      if (
        artistInfo?.banner_picture !== null &&
        artistInfo?.banner_picture !== undefined &&
        artistInfo?.banner_picture !== ''
      ) {
        setCroppedBanner(artistInfo?.banner_picture)
      } else {
        setCroppedBanner('')
      }

      if (
        artistInfo?.profile_picture !== null &&
        artistInfo?.profile_picture !== undefined &&
        artistInfo?.profile_picture !== ''
      ) {
        setCroppedAvatar(artistInfo?.profile_picture)
      } else {
        setCroppedAvatar('')
      }
    }
  }, [artistInfo])

  useEffect(() => {
    if (isLoaded) setFollowLoaded(true)
  }, [isLoaded])

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

  const showAlertModal = () => {
    setAlertData([
      {
        id: 0,
        title: 'Max File Size Exceeded',
        description: `Oops! It looks like your file exceeded the max file size of 30mb`,
        type: 'error',
      },
    ])
    setShowAlert(true)
  }

  useEffect(() => {
    if (bannerPictureUrl.length === 0) return
    userAPI.update({ wallet_id: publicKey?.toBase58() || '', banner_picture: bannerPictureUrl }).then(
      response => {
        if (response !== null) {
          dispatch({ type: 'set', profileInfo: response })
        }
      },
      error => {
        console.log(error)
      }
    )
  }, [bannerPictureUrl])

  useEffect(() => {
    if (avatarPictureUrl.length === 0) return
    userAPI.update({ wallet_id: publicKey?.toBase58() || '', profile_picture: avatarPictureUrl }).then(
      response => {
        if (response !== null) {
          dispatch({ type: 'set', profileInfo: response })
        }
      },
      error => {
        console.log(error)
      }
    )
  }, [avatarPictureUrl])

  useEffect(() => {
    if (croppedBanner !== '' && updateBanner) {
      const fetchData = async url => {
        let response = await fetch(url)
        let blob = await response.blob()
        const file = new File([blob], 'banner.jpg', {
          type: 'image/jpeg',
        })
        const filename = namePublicFile('banner.jpg')
        uploadBannerFile(file, filename)
      }
      fetchData(croppedBanner)
      setUpdateBanner(false)
    }
  }, [updateBanner])

  useEffect(() => {
    if (croppedAvatar !== '' && updateAvatar) {
      const fetchData = async url => {
        let response = await fetch(url)
        let blob = await response.blob()
        const file = new File([blob], 'avatar.jpg', {
          type: 'image/jpeg',
        })
        const filename = namePublicFile('avatar.jpg')
        uploadAvatarFile(file, filename)
      }
      fetchData(croppedAvatar)
      setUpdateAvatar(false)
    }
  }, [updateAvatar])

  const uploadBannerFile = async (file: any, filename: string) => {
    setBannerUploadingToS3(true)
    const { url } = await uploadFileToS3API(file, filename)
    setBannerPictureUrl(url)
    setBannerUploadingToS3(false)
  }

  const uploadAvatarFile = async (file: any, filename: string) => {
    setAvatarUploadingToS3(true)
    const { url } = await uploadFileToS3API(file, filename)
    setAvatarPictureUrl(url)
    setAvatarUploadingToS3(false)
  }

  const handleChangeBannerImage = event => {
    const file = event.target.files
    if (file?.length === 0) return

    if (file[0].size > 31457280) {
      showAlertModal()
      return
    }
    setBanner(file)
    setOpenBannerEditorModal(true)
  }

  const handleChangeAvatar = event => {
    const file = event.target.files
    if (file?.length === 0) return

    if (file[0].size > 31457280) {
      showAlertModal()
      return
    }
    setAvatar(file)
    setOpenAvatarEditorModal(true)
  }

  const [refreshing, setRefreshing] = useState(false)
  const refreshNFT = () => {
    setRefreshing(true)
    nftsAPI.burntNft({ user: wallet, nfts: [] }).then(
      response => {
        reloadPage()
        setTimeout(() => {
          setRefreshing(false)
        }, 3000)
      },
      error => {
        console.log(error)
        setTimeout(() => {
          setRefreshing(false)
        }, 3000)
      }
    )
  }

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    // desktop view
    <div className={styles.container}>
      {hasLoading ? (
        <div className={`${styles.skeletonLoader} ${styles.bannerImage}`}></div>
      ) : (
        <div className={styles.bannerImage}>
          <img
            src={croppedBanner !== '' ? croppedBanner : banner !== undefined ? banner : BannerImage.src}
            alt=""
            className="w-full h-full object-cover"
          />
          {isOwn && (
            <div className="absolute top-2 lg:top-auto bottom-auto lg:bottom-7 right-2 lg:right-7 cursor-pointer z-20">
              <div className={styles.iconBlurView}>
                <div className="w-full h-full flex justify-center items-center">
                  <IconButton
                    icon={EditorGreenIcon}
                    onClick={() => inputBannerFile.current.click()}
                    backgroundColor={'transparent'}
                    borderRadius="100%"
                    width={20}
                    height={20}
                    iconWidth={20}
                    iconHeight={20}
                    disabled={bannerUploadingToS3}
                  />
                </div>
              </div>
              <input
                type="file"
                id="banner-file"
                accept="image/png, image/jpeg, image/gif"
                ref={inputBannerFile}
                style={{ display: 'none' }}
                onChange={event => handleChangeBannerImage(event)}
              />
            </div>
          )}
          {/* <div className={styles.bottomMask}></div> */}
        </div>
      )}

      <div className="g-container">
        <div className="grid grid-cols-12 items-center mt-[-70px] z-10">
          <div className="col-span-9">
            <div className="w-content relative">
              <ProfileArtistCard
                isOwn={isOwn}
                image={croppedAvatar !== '' ? croppedAvatar : avatar !== undefined ? avatar : DefaultAvatar.src}
                name={artistInfo?.username}
                avatarUploadingToS3={avatarUploadingToS3}
                handleChangeAvatar={handleChangeAvatar}
                hasLoading={hasLoading}
                setFullScreenView={() =>
                  setFullScreenView(
                    croppedAvatar !== '' ? croppedAvatar : avatar !== undefined ? avatar : DefaultAvatar.src
                  )
                }
              />
            </div>
          </div>

          <div className="col-span-3 h-full flex justify-end items-center pt-[10px]">
            {hasLoading ? (
              <div className={`${styles.skeletonLoader} w-[33px] h-[33px] mt-[4px] mr-[20px] rounded-md`}></div>
            ) : (
              <div className="w-[26px] h-[26px] flex items-center mt-[4px] mr-[20px]">
                {refreshing ? (
                  <Lottie width={26} height={26} animationData={RefreshMobileLottery} loop={true} className="mb-1" />
                ) : (
                  <div onClick={() => refreshNFT()}>
                    <Image src={RefreshMobileIcon} width={26} height={26} alt="" />
                  </div>
                )}
              </div>
            )}
            {hasLoading ? (
              <div className={`${styles.skeletonLoader} w-[40px] h-[40px] mt-[4px] mr-[20px] rounded-md`}></div>
            ) : (
              <div className="mr-[11px] ">
                <MenuSocialShare
                  type="image"
                  vote={true}
                  message={'Check out this artist on Foster Marketplace @foster_protocol #fostermarketplace'}
                  url={`/${artistInfo?.username}`}
                />
              </div>
            )}
            {!isOwn && (
              <div className="w-[100px] h-[45px] lg:ml-[10px] overflow-hidden">
                {!followLoaded && (
                  <div className="w-[100px] h-[45px] overflow-hidden rounded-[12px]">
                    <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={followLoaded} color="#202427">
                      <div></div>
                    </ReactPlaceholder>
                  </div>
                )}
                {follow ? (
                  hasLoading ? (
                    <div className={`${styles.skeletonLoader} w-[100px] h-[45px] rounded-md`}></div>
                  ) : (
                    <OutlineButton
                      width={100}
                      height={45}
                      label="Following"
                      fontSize={18}
                      borderColor="var(--follow-btn-border-mobile)"
                      borderWidth={2}
                      onClick={() => unfollowArtist(artistInfo?.wallet_id)}
                    />
                  )
                ) : hasLoading ? (
                  <div className={`${styles.skeletonLoader} w-[100px] h-[45px] rounded-md`}></div>
                ) : (
                  <GradientButton
                    width={100}
                    height={45}
                    fontSize={18}
                    label="Follow"
                    backgroundColor
                    onClick={() => followArtist(artistInfo?.wallet_id)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="w-full flex justify-center mt-[12px]">
          <div className="w-full flex flex-wrap mt-[9px] z-10">
            {artistInfo?.wallet_id &&
              (hasLoading ? (
                <div className={`${styles.skeletonLoader} w-[150px] h-[35px] rounded-full `}></div>
              ) : (
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
              ))}
            <div className="flex gap-[20px] items-center ml-[11px]">
              {artistInfo?.ig_url !== null &&
                artistInfo?.ig_url.length > 0 &&
                (hasLoading ? (
                  <div className={`${styles.skeletonLoader} w-[35px] h-[30px] rounded-full`}></div>
                ) : (
                  <div>
                    <InstagramIcon onClick={() => window.open(validUrl(artistInfo?.ig_url))} />
                  </div>
                ))}
              {artistInfo?.twitter_url !== null &&
                artistInfo?.twitter_url.length > 0 &&
                (hasLoading ? (
                  <div className={`${styles.skeletonLoader} w-[35px] h-[35px] rounded-full`}></div>
                ) : (
                  <div>
                    <TwitterIcon onClick={() => window.open(validUrl(artistInfo?.twitter_url))} />
                  </div>
                ))}
              {artistInfo?.site_url !== null &&
                artistInfo?.site_url.length > 0 &&
                (hasLoading ? (
                  <div className={`${styles.skeletonLoader} w-[35px] h-[35px] rounded-full`}></div>
                ) : (
                  <div>
                    <WebSiteIcon onClick={() => window.open(validUrl(artistInfo?.site_url))} />
                  </div>
                ))}
            </div>

            <div className="w-full h-[24px] mt-[17px] mb-[34px] flex items-center">
              <div className="flex gap-[15px] z-10">
                {hasLoading ? (
                  <div
                    className={`${styles.skeletonLoader} ${styles.whiteText} w-[150px] h-[24px] mt-[17px] mb-[34px] rounded-full`}
                  ></div>
                ) : (
                  <div
                    className="cursor-pointer flex hover:opacity-60"
                    onClick={() => {
                      if (!isLoggedIn()) {
                        setVisible(true)
                        return
                      }
                      setType(0)
                      setShowFollowModal(true)
                    }}
                  >
                    <div className={styles.whiteText}>{artistFollowers}</div>
                    &nbsp;
                    <div className={styles.grayText}>Followers</div>
                  </div>
                )}
                {hasLoading ? (
                  <div
                    className={`${styles.skeletonLoader} ${styles.whiteText} w-[150px] h-[24px] mt-[17px] mb-[34px] rounded-full`}
                  ></div>
                ) : (
                  <div
                    className="cursor-pointer flex hover:opacity-60"
                    onClick={() => {
                      if (!isLoggedIn()) {
                        setVisible(true)
                        return
                      }
                      setType(1)
                      setShowFollowModal(true)
                    }}
                  >
                    <div className={styles.whiteText}>{artistFollowing}</div>
                    &nbsp;
                    <div className={styles.grayText}>Following</div>
                  </div>
                )}
              </div>
            </div>
            {hasLoading ? (
              <div className={`${styles.skeletonLoader} w-[450px] h-[24px] mt-[17px] mb-[34px] rounded-full`}></div>
            ) : (
              artistInfo?.bio && <span className={styles.description}>{artistInfo?.bio}</span>
            )}
          </div>
        </div>

        {/* <div className="w-full flex justify-center mt-[30px] cursor-pointer">
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
        </div> */}

        {/* <div className="w-full flex justify-center mt-[14px] lg:mt-[15px]">
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
        </div> */}
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

      <NftImageEditorModal
        open={openBannerEditorModal}
        close={() => setOpenBannerEditorModal(false)}
        nftImage={banner}
        getCroppedImage={croppedImage => {
          setUpdateBanner(true)
          setCroppedBanner(croppedImage)
          setOpenBannerEditorModal(false)
        }}
        dimension={{ value: [1080, 320] }}
      />
      <NftImageEditorModal
        open={openAvatarEditorModal}
        close={() => setOpenAvatarEditorModal(false)}
        nftImage={avatar}
        getCroppedImage={croppedImage => {
          setUpdateAvatar(true)
          setCroppedAvatar(croppedImage)
          setOpenAvatarEditorModal(false)
        }}
        dimension={{ value: [512, 512] }}
      />
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
    </div>
  ) : (
    // mobile view
    <div className={styles.container}>
      {hasLoading ? (
        <div className={`${styles.skeletonLoader} ${styles.headerImage}`}></div>
      ) : (
        <div className={styles.headerImage}>
          <img
            src={croppedBanner !== '' ? croppedBanner : banner !== undefined ? banner : BannerImage.src}
            alt=""
            width={1620}
            height={480}
            loading="lazy"
            className="w-full h-full object-cover rounded-none"
          />
          {isOwn && (
            <div className="absolute bottom-2 right-6 cursor-pointer z-20 flex justify-center">
              <div className={styles.iconBlurView}>
                <div className="w-full h-full flex justify-center items-center">
                  <IconButton
                    icon={EditorGreenIcon}
                    onClick={() => inputBannerFile.current.click()}
                    backgroundColor={'transparent'}
                    borderRadius="100%"
                    width={20}
                    height={20}
                    iconWidth={20}
                    iconHeight={20}
                    disabled={bannerUploadingToS3}
                  />
                </div>
              </div>
              <input
                type="file"
                id="banner-file"
                accept="image/png, image/jpeg, image/gif"
                ref={inputBannerFile}
                style={{ display: 'none' }}
                onChange={event => handleChangeBannerImage(event)}
              />
            </div>
          )}
        </div>
      )}

      <div className="g-container">
        <div className="z-0"></div>
        <div className="w-full relative items-center mt-[-50px] z-10">
          <ProfileArtistCard
            isOwn={isOwn}
            image={croppedAvatar !== '' ? croppedAvatar : avatar !== undefined ? avatar : DefaultAvatar.src}
            name={artistInfo?.username}
            ig_url={artistInfo?.ig_url}
            site_url={artistInfo?.site_url}
            twitter_url={artistInfo?.twitter_url}
            avatarUploadingToS3={avatarUploadingToS3}
            handleChangeAvatar={handleChangeAvatar}
            hasLoading={hasLoading}
            setFullScreenView={() =>
              setFullScreenView(
                croppedAvatar !== '' ? croppedAvatar : avatar !== undefined ? avatar : DefaultAvatar.src
              )
            }
          />

          <div className="absolute flex right-0 top-[60px]">
            <div className="w-[26px] h-[26px] flex items-center mt-[4px] mr-[10px]">
              {hasLoading ? (
                <div className={`${styles.skeletonLoader} w-[26px] h-[26px] rounded-md`}></div>
              ) : refreshing ? (
                <Lottie width={26} height={26} animationData={RefreshMobileLottery} loop={true} className="mb-1" />
              ) : (
                <div onClick={() => refreshNFT()}>
                  <Image src={RefreshMobileIcon} width={26} height={26} alt="" />
                </div>
              )}
            </div>
            {hasLoading ? (
              <div className={`${styles.skeletonLoader} w-[26px] h-[26px] mt-[4px] rounded-md`}></div>
            ) : (
              <div>
                <div onClick={() => setOpenShareModal(true)}>
                  <ShareSmallIcon alt="" />
                </div>
              </div>
            )}

            {!isOwn && (
              <div className="w-[80px] h-[29px] ml-[11px] flex overflow-hidden">
                {followLoaded ? (
                  follow ? (
                    hasLoading ? (
                      <div className={`${styles.skeletonLoader} w-[80px] h-[29px] rounded-md`}></div>
                    ) : (
                      <OutlineButton
                        width={80}
                        height={29}
                        fontSize={12}
                        borderRadius={8}
                        label="Following"
                        borderColor="var(--follow-btn-border-mobile)"
                        onClick={() => unfollowArtist(artistInfo?.wallet_id)}
                      />
                    )
                  ) : hasLoading ? (
                    <div className={`${styles.skeletonLoader} w-[80px] h-[29px] rounded-md`}></div>
                  ) : (
                    <OutlineButton
                      width={80}
                      height={29}
                      fontSize={12}
                      label="Follow"
                      borderColor="transparent"
                      color="var(--twitter-text-color)"
                      backgroundColor="var(--primary-btn-bg-right)"
                      borderRadius={8}
                      onClick={() => followArtist(artistInfo?.wallet_id)}
                    />
                  )
                ) : (
                  <div className="w-[80px] h-[29px] rounded-[8px] overflow-hidden">
                    <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={followLoaded} color="#202427">
                      <div></div>
                    </ReactPlaceholder>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 z-10">
          {artistInfo?.wallet_id && (
            <div className="relative w-[130px]">
              {hasLoading ? (
                <div className={`${styles.skeletonLoader} w-[120px] h-[22px] rounded-full`}></div>
              ) : (
                <>
                  <AddressButton
                    label={getShortAddress(artistInfo?.wallet_id)}
                    onClick={() => {
                      copyToClipboard(artistInfo?.wallet_id || '')
                      copyClipboardAlert('wallet-address-mobile')
                    }}
                  />

                  <CopyClipboardChip identifier="wallet-address-mobile" />
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-[15px] mt-2">
          {hasLoading ? (
            <div className={`${styles.skeletonLoader} w-[100px] h-[22px] rounded-full`}></div>
          ) : (
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
          )}

          {hasLoading ? (
            <div className={`${styles.skeletonLoader} w-[100px] h-[22px] rounded-full`}></div>
          ) : (
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
          )}
        </div>

        {hasLoading ? (
          <div className={`${styles.skeletonLoader} w-[280px] h-[24px] mt-[17px] mb-[34px] rounded-full`}></div>
        ) : (
          <div className="flex justify-center w-full flex-wrap mt-[12px] z-10">
            {artistInfo?.bio && (
              <span className={styles.description}>
                {artistInfo?.bio}
                {/* <span className={styles.readMore} onClick={() => setShowReadMore(!showReadMore)}>
              Read&nbsp;more
            </span> */}
              </span>
            )}
          </div>
        )}
      </div>

      {/* <div className="w-full flex justify-center mt-[30px] cursor-pointer">
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
      </div> */}

      {/* <div className="w-full flex justify-center mt-2">
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
      </div> */}

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

      <NftImageEditorModal
        open={openBannerEditorModal}
        close={() => setOpenBannerEditorModal(false)}
        nftImage={banner}
        getCroppedImage={croppedImage => {
          setUpdateBanner(true)
          setCroppedBanner(croppedImage)
          setOpenBannerEditorModal(false)
        }}
        dimension={{ value: [1080, 320] }}
      />
      <NftImageEditorModal
        open={openAvatarEditorModal}
        close={() => setOpenAvatarEditorModal(false)}
        nftImage={avatar}
        getCroppedImage={croppedImage => {
          setUpdateAvatar(true)
          setCroppedAvatar(croppedImage)
          setOpenAvatarEditorModal(false)
        }}
        dimension={{ value: [512, 512] }}
      />
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
    </div>
  )
}

export default MainSection

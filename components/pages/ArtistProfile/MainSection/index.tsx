import React, { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// next components
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'
import Image from 'next/image'

// third party components
import { getShortAddress } from 'utils/wallet.util'
import Lottie from 'lottie-react'

// custom components
import ReadMoreModal from 'components/Modal/ReadMoreModal'
import ProfileArtistCard from 'components/Card/ProfileArtistCard'
import FollowModal from 'components/Modal/FollowModal'
import FollowModalMobile from 'components/Modal/FollowModalMobile'
import RefreshMobileLottery from 'assets/lottery/refresh-mobile.json'
import RefreshMobileIcon from 'assets/icons/refresh-icon-mobile.svg'

// custom functions
import { useViewport, namePublicFile } from 'utils'

// images and icons
import DefaultAvatar from 'assets/images/dashboard-avatar.png'
import BannerImage from 'assets/images/banner-image.png'
import ShareSmallIcon from 'assets/icons/share-black-menu.svg?component'
import ShareDesktopIcon from 'assets/icons/share-icon-707070.svg?component'

import EditorGreenIcon from 'assets/icons/editor-green.svg?component'
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import CreatorMerchIcon from 'assets/icons/creator-merch-icon.svg?component'

import { copyToClipboard, isLoggedIn } from 'utils/helpers'
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
import ImageWithFoster from 'components/ImageWithFoster'
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'
import WalletFilterMenu from 'components/Menu/WalletFilterMenu'

const MainSection = prop => {
  const {
    artistInfo,
    artistStatsInfo,
    collectorStatsInfo,
    categoryList,
    isOwn,
    isLoaded,
    isColletorLoaded,
    setFullScreenView,
    wallet,
    reloadPage,
    hasLoading,
  } = prop
  const dispatch = useDispatch()
  const router = useRouter()
  const viewport = useViewport()
  const { publicKey } = useWallet()
  const { setVisible } = useWalletModal()

  // redux

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
  const [showBannerBoard, setShowBannerBoard] = useState(false)
  const [showSocialBoard, setShowSocialBoard] = useState(false)
  const [walletList, setWalletList] = useState([])
  const [selectedWallet, setSelectedWallet] = useState({ id: 0, label: getShortAddress(publicKey) })
  const [descCount, setDescCount] = useState(235)
  const [tempNftDescription, setTempNftDescription] = useState('')
  const [isTruncated, setIsTruncated] = useState(true)

  const processedNftDescription = isTruncated ? tempNftDescription?.slice(0, descCount) : tempNftDescription
  const shouldShowReadMore = tempNftDescription?.length > descCount

  useEffect(() => {
    function handleResize() {
      let screenWidth = window.innerWidth
      let count = screenWidth >= 1024 ? 1000 : 235
      setDescCount(count)
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (artistInfo?.bio !== undefined && artistInfo?.bio !== null) setTempNftDescription(artistInfo?.bio)
  }, [artistInfo?.bio])

  function toggleIsTruncated() {
    setIsTruncated(!isTruncated)
  }

  useEffect(() => {
    if (publicKey?.toBase58() === artistInfo?.wallet_id) {
      const isVisibleBannerBoard = localStorage.getItem('isVisibleBannerBoard')
      if (isVisibleBannerBoard === 'true') {
        setShowBannerBoard(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey])

  useEffect(() => {
    if (artistInfo) {
      setFollow(artistInfo ? artistInfo.followed : false)
      setArtistFollowing(artistInfo.following)
      setArtistFollowers(artistInfo.followers)

      let list = [{ id: 0, label: getShortAddress(artistInfo?.wallet_id), type: 'address' }]
      if (artistInfo?.twitter_url?.length > 0) list.push({ id: list.length, label: 'Twitter', type: 'twitter' })
      if (artistInfo?.ig_url?.length > 0) list.push({ id: list.length, label: 'Instagram', type: 'instagram' })
      if (artistInfo?.site_url?.length > 0) list.push({ id: list.length, label: 'Website', type: 'website' })
      if (artistInfo?.three_land_url?.length > 0) list.push({ id: list.length, label: '3.Land', type: 'land' })
      if (artistInfo?.solarplex_url?.length > 0) list.push({ id: list.length, label: 'Solarplex', type: 'solar' })
      setWalletList(list)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const isVisibleSocialBoard = localStorage.getItem('isVisibleSocialBoard')
      if (isVisibleSocialBoard === 'true') {
        setTimeout(() => {
          setShowSocialBoard(true)
        }, 1000)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return viewport === 'md' || viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    // desktop view
    <div className={styles.container}>
      {hasLoading ? (
        <div className={`${styles.skeletonLoader} ${styles.bannerImage}`}></div>
      ) : (
        <div className={styles.bannerImage}>
          <ImageWithFoster
            showPlaceHolder={false}
            src={croppedBanner !== '' ? croppedBanner : banner !== undefined ? banner : BannerImage.src}
            className="w-full h-full object-cover"
          />
          {isOwn && (
            <div className="absolute top-2 lg:top-auto bottom-auto lg:bottom-7 right-2 lg:right-7 cursor-pointer z-20">
              <div className={styles.iconBlurView}>
                <div className="w-full h-full flex justify-center items-center">
                  <IconButtonWithSVG
                    icon={<EditorGreenIcon />}
                    onClick={() => {
                      if (showBannerBoard || showSocialBoard) return
                      inputBannerFile.current.click()
                    }}
                    backgroundColor="transparent"
                    borderRadius="100%"
                    width={40}
                    height={40}
                    iconWidth={40}
                    iconHeight={40}
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
          {showBannerBoard && (
            <div className={styles.bannerBoard}>
              <div className={styles.boardTitle}>Upload your profile banner</div>
              <div className={styles.boardText}>Recommended dimensions are 1920 x 452</div>
              <div className="flex justify-end mt-[15px]">
                <div className="flex gap-[9px]">
                  <OutlineButton
                    width={78}
                    height={37}
                    borderRadius={12}
                    label="Skip"
                    fontFamily="Muli-SemiBold"
                    fontSize={14}
                    onClick={() => {
                      setShowBannerBoard(false)
                      localStorage.setItem('isVisibleBannerBoard', 'false')

                      setTimeout(() => {
                        setShowSocialBoard(true)
                      }, 1000)
                    }}
                  />
                  <GradientButton
                    label="Upload"
                    width={78}
                    height={37}
                    border={12}
                    fontFamily="Muli-SemiBold"
                    fontSize={14}
                    onClick={() => {
                      setShowBannerBoard(false)
                      localStorage.setItem('isVisibleSocialBoard', 'false')
                      inputBannerFile.current.click()
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          {showSocialBoard && (
            <div className={styles.bannerBoard}>
              <div className={styles.boardTitle}>Setup your socials and bio</div>
              <div className={styles.boardText}>Edit your profile bio and link your social accounts</div>
              <div className="flex justify-end mt-[15px]">
                <div className="flex gap-[9px]">
                  <OutlineButton
                    width={78}
                    height={37}
                    borderRadius={12}
                    label="Skip"
                    fontFamily="Muli-SemiBold"
                    fontSize={14}
                    onClick={() => {
                      setShowSocialBoard(false)
                      localStorage.setItem('isVisibleSocialBoard', 'false')
                    }}
                  />
                  <GradientButton
                    label="Settings"
                    width={78}
                    height={37}
                    border={12}
                    fontFamily="Muli-SemiBold"
                    fontSize={14}
                    onClick={() => {
                      setShowSocialBoard(false)
                      localStorage.setItem('isVisibleSocialBoard', 'false')
                      router.push('/settings')
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="g-container">
        <div className="grid grid-cols-12 items-center mt-[-45px] lg:mt-[-70px] z-10">
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

          <div className="col-span-3 h-full flex justify-end items-center pt-[30px] lg:pt-[10px]">
            {!isOwn && (
              <div className="w-[120px] h-[45px] lg:ml-[10px] overflow-hidden">
                {!followLoaded && (
                  <div className="w-[120px] h-[45px] overflow-hidden rounded-[12px]">
                    <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={followLoaded} color="#202427">
                      <div></div>
                    </ReactPlaceholder>
                  </div>
                )}
                {follow ? (
                  hasLoading ? (
                    <div className={`${styles.skeletonLoader} w-[120px] h-[45px] rounded-md`}></div>
                  ) : (
                    <OutlineButton
                      width={120}
                      height={45}
                      label="Following"
                      fontSize={18}
                      borderRadius={22}
                      onClick={() => unfollowArtist(artistInfo?.wallet_id)}
                    />
                  )
                ) : hasLoading ? (
                  <div className={`${styles.skeletonLoader} w-[120px] h-[45px] rounded-md`}></div>
                ) : (
                  <GradientButton
                    width={120}
                    height={45}
                    color="var(--background-main-color)"
                    backgroundColor01="var(--main-icon-color)"
                    backgroundColor02="var(--main-icon-color)"
                    fontSize={18}
                    label="Follow"
                    borderRadius={22}
                    onClick={() => followArtist(artistInfo?.wallet_id)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="w-full flex flex-wrap z-10">
            <div className="w-full h-[24px] mt-[19px] flex items-center">
              <div className="flex gap-[15px] z-10 items-center">
                {hasLoading ? (
                  <div className={`${styles.skeletonLoader} ${styles.whiteText} w-[100px] h-[35px] rounded-full`}></div>
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
                  <div className={`${styles.skeletonLoader} ${styles.whiteText} w-[100px] h-[35px] rounded-full`}></div>
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
            <div className="w-full h-[24px] mt-[19px]">
              <div className="flex gap-[11px] z-10 items-center">
                {hasLoading ? (
                  <div className={`${styles.skeletonLoader} w-[100px] h-[35px] rounded-md`}></div>
                ) : (
                  <div className={`${styles.iconContainer} w-[100px] px-[8px] gap-[8px]`} onClick={() => refreshNFT()}>
                    <div className="w-[26px] h-[26px] flex items-center mt-[6px]">
                      {refreshing ? (
                        <Lottie
                          width={26}
                          height={26}
                          animationData={RefreshMobileLottery}
                          loop={true}
                          className="mb-1"
                        />
                      ) : (
                        <div>
                          <Image src={RefreshMobileIcon} width={26} height={26} alt="" />
                        </div>
                      )}
                    </div>
                    <div className={styles.refereshText}>Refresh</div>
                  </div>
                )}

                {hasLoading ? (
                  <div className={`${styles.skeletonLoader} w-[87px] h-[35px] rounded-md`}></div>
                ) : (
                  <WalletFilterMenu
                    label={'Links'}
                    data={walletList}
                    selectedItem={selectedWallet}
                    setSelectedItem={item => {
                      if (item.type === 'address') {
                        copyToClipboard(artistInfo?.wallet_id || '')
                      } else if (item.type === 'twitter') {
                        window.open(artistInfo?.twitter_url)
                      } else if (item.type === 'instagram') {
                        window.open(artistInfo?.ig_url)
                      } else if (item.type === 'website') {
                        window.open(artistInfo?.site_url)
                      } else if (item.type === 'land') {
                        window.open(artistInfo?.three_land_url)
                      } else if (item.type === 'solar') {
                        window.open(artistInfo?.solarplex_url)
                      }
                    }}
                  />
                )}

                {/* {hasLoading ? (
                  <div className={`${styles.skeletonLoader} w-[87px] h-[35px] rounded-md`}></div>
                ) : (
                  <div
                    className={`${styles.iconContainer} w-[87px] px-[8px] gap-[8px]`}
                    onClick={() => {
                      router.push(`/${artistInfo?.username}/merch`)
                    }}
                  >
                    <CreatorMerchIcon alt="" />
                    <div className={styles.refereshText}>Merch</div>
                  </div>
                )} */}

                {hasLoading ? (
                  <div className={`${styles.skeletonLoader} w-[87px] h-[35px] rounded-md`}></div>
                ) : (
                  <div
                    className={`${styles.iconContainer} w-[87px] gap-[9px]`}
                    onClick={() => {
                      setOpenShareModal(true)
                    }}
                  >
                    <div>
                      <ShareDesktopIcon alt="" />
                    </div>
                    <div className={`${styles.shareText} mt-[-2px]`}>Share</div>
                  </div>
                )}
              </div>
            </div>

            {artistInfo?.bio && (
              <div className={`w-full mt-[30px] ${styles.bioText}`}>
                {processedNftDescription}
                {shouldShowReadMore && (
                  <span onClick={toggleIsTruncated} className={`${styles.greenText} min-w-max cursor-pointer`}>
                    {isTruncated ? '... Expand' : ' Collapse'}
                  </span>
                )}
              </div>
            )}

            <div className="w-full mt-[30px] mb-[30px] flex gap-[15px] items-center">
              {!isColletorLoaded ? (
                <div className={`${styles.skeletonLoader} ${styles.whiteText} w-[90px] h-[30px] rounded-full`}></div>
              ) : (
                <div className="flex gap-[6px] items-center">
                  <div className={styles.statisticValue}>{artistStatsInfo?.nfts_created}</div>
                  <div className={styles.statisticLabel}>Created</div>
                </div>
              )}

              <div className={styles.statisticBorder} />

              {!isColletorLoaded ? (
                <div className={`${styles.skeletonLoader} ${styles.whiteText} w-[90px] h-[30px] rounded-full`}></div>
              ) : (
                <div className="flex gap-[6px] items-center">
                  <div className={styles.statisticValue}>{collectorStatsInfo?.nfts_collected}</div>
                  <div className={styles.statisticLabel}>Collected</div>
                </div>
              )}

              <div className={styles.statisticBorder} />

              {!isColletorLoaded ? (
                <div className={`${styles.skeletonLoader} ${styles.whiteText} w-[90px] h-[30px] rounded-full`}></div>
              ) : (
                <div className="flex gap-[6px] items-center">
                  <SolanaLogoIcon alt="" className="mt-[2px]" />
                  <div className={styles.statisticValue}>{artistStatsInfo?.sales_volume}</div>
                  <div className={styles.statisticLabel}>Sold</div>
                </div>
              )}

              <div className={styles.statisticBorder} />

              {!isColletorLoaded ? (
                <div className={`${styles.skeletonLoader} ${styles.whiteText} w-[90px] h-[30px] rounded-full`}></div>
              ) : (
                <div className="flex gap-[6px] items-center">
                  <SolanaLogoIcon alt="" className="mt-[2px]" />
                  <div className={styles.statisticValue}>{collectorStatsInfo?.purchase_volume}</div>
                  <div className={styles.statisticLabel}>Purchased</div>
                </div>
              )}
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
  ) : (
    // mobile view
    <div className={styles.container}>
      {hasLoading ? (
        <div className={`${styles.skeletonLoader} ${styles.headerImage}`}></div>
      ) : (
        <div className={styles.headerImage}>
          {/* <ImageWithFoster
            showPlaceHolder={false}
            src={croppedBanner !== '' ? croppedBanner : banner !== undefined ? banner : BannerImage.src}
            className="w-full h-full object-cover rounded-none"
          /> */}
          <img
            src={croppedBanner !== '' ? croppedBanner : banner !== undefined ? banner : BannerImage.src}
            alt=""
            className="w-full h-full object-cover rounded-none"
          />
          {isOwn && (
            <div className="absolute bottom-2 right-6 cursor-pointer z-20 flex justify-center">
              <div className={styles.iconBlurView}>
                <div className="w-full h-full flex justify-center items-center">
                  <IconButtonWithSVG
                    icon={<EditorGreenIcon />}
                    onClick={() => {
                      if (showBannerBoard || showSocialBoard) return
                      inputBannerFile.current.click()
                    }}
                    backgroundColor="transparent"
                    borderRadius="100%"
                    width={40}
                    height={40}
                    iconWidth={40}
                    iconHeight={40}
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
          {showBannerBoard && (
            <div className={styles.bannerBoard}>
              <div className={styles.boardTitle}>Upload your profile banner</div>
              <div className={styles.boardText}>Recommended dimensions are 1920 x 452</div>
              <div className="flex justify-end mt-[25px]">
                <div className="flex gap-[9px]">
                  <OutlineButton
                    width={78}
                    height={37}
                    borderRadius={12}
                    label="Skip"
                    fontFamily="Muli-SemiBold"
                    fontSize={14}
                    onClick={() => {
                      setShowBannerBoard(false)
                      localStorage.setItem('isVisibleBannerBoard', 'false')
                      setTimeout(() => {
                        setShowSocialBoard(true)
                      }, 1000)
                    }}
                  />
                  <GradientButton
                    label="Upload"
                    width={78}
                    height={37}
                    border={12}
                    fontSize={14}
                    onClick={() => {
                      setShowBannerBoard(false)
                      localStorage.setItem('isVisibleBannerBoard', 'false')
                      inputBannerFile.current.click()
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          {showSocialBoard && (
            <div className={styles.bannerBoard}>
              <div className={styles.boardTitle}>Setup your socials and bio</div>
              <div className={styles.boardText}>Edit your profile bio and link your social accounts</div>
              <div className="flex justify-end mt-[15px]">
                <div className="flex gap-[9px]">
                  <OutlineButton
                    width={78}
                    height={37}
                    borderRadius={12}
                    label="Skip"
                    fontFamily="Muli-SemiBold"
                    fontSize={14}
                    onClick={() => {
                      setShowSocialBoard(false)
                      localStorage.setItem('isVisibleSocialBoard', 'false')
                    }}
                  />
                  <GradientButton
                    label="Settings"
                    width={78}
                    height={37}
                    border={12}
                    fontSize={14}
                    onClick={() => {
                      setShowSocialBoard(false)
                      localStorage.setItem('isVisibleSocialBoard', 'false')
                      router.push('/settings')
                    }}
                  />
                </div>
              </div>
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
            three_land_url={artistInfo?.three_land_url}
            solarplex_url={artistInfo?.solarplex_url}
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
            {!isOwn && (
              <div className="w-[100px] h-[40px] ml-[11px] flex overflow-hidden">
                {followLoaded ? (
                  follow ? (
                    hasLoading ? (
                      <div className={`${styles.skeletonLoader} w-[100px] h-[40px] rounded-md`}></div>
                    ) : (
                      <OutlineButton
                        width={100}
                        height={40}
                        fontSize={16}
                        borderRadius={20}
                        label="Following"
                        onClick={() => unfollowArtist(artistInfo?.wallet_id)}
                      />
                    )
                  ) : hasLoading ? (
                    <div className={`${styles.skeletonLoader} w-[100px] h-[40px] rounded-md`}></div>
                  ) : (
                    <GradientButton
                      width={100}
                      height={40}
                      backgroundColor01="var(--main-icon-color)"
                      backgroundColor02="var(--main-icon-color)"
                      color="var(--background-main-color)"
                      fontSize={16}
                      label="Follow"
                      borderRadius={20}
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

        <div className="flex gap-[15px] mt-2">
          {hasLoading ? (
            <div className={`${styles.skeletonLoader} w-[100px] h-[35px] rounded-full`}></div>
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
            <div className={`${styles.skeletonLoader} w-[100px] h-[35px] rounded-full`}></div>
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
        <div className="w-full flex gap-[11px] mt-[15px]">
          {hasLoading ? (
            <div className={`${styles.skeletonLoader} w-[100px] h-[35px] rounded-md`}></div>
          ) : (
            <div className={`${styles.iconContainer} w-[100px] px-[8px] gap-[8px]`} onClick={() => refreshNFT()}>
              <div className="w-[26px] h-[26px] flex items-center mt-[6px]">
                {refreshing ? (
                  <Lottie width={26} height={26} animationData={RefreshMobileLottery} loop={true} className="mb-1" />
                ) : (
                  <div>
                    <Image src={RefreshMobileIcon} width={26} height={26} alt="" />
                  </div>
                )}
              </div>
              <div className={styles.refereshText}>Refresh</div>
            </div>
          )}

          {hasLoading ? (
            <div className={`${styles.skeletonLoader} w-[87px] h-[35px] rounded-md`}></div>
          ) : (
            <WalletFilterMenu
              label={'Links'}
              data={walletList}
              selectedItem={selectedWallet}
              setSelectedItem={item => {
                if (item.type === 'address') {
                  copyToClipboard(artistInfo?.wallet_id || '')
                } else if (item.type === 'twitter') {
                  window.open(artistInfo?.twitter_url)
                } else if (item.type === 'instagram') {
                  window.open(artistInfo?.ig_url)
                } else if (item.type === 'website') {
                  window.open(artistInfo?.site_url)
                } else if (item.type === 'land') {
                  window.open(artistInfo?.three_land_url)
                } else if (item.type === 'solar') {
                  window.open(artistInfo?.solarplex_url)
                }
              }}
            />
          )}

          {/* {hasLoading ? (
            <div className={`${styles.skeletonLoader} w-[87px] h-[35px] rounded-md`}></div>
          ) : (
            <div
              className={`${styles.iconContainer} w-[87px] px-[8px] gap-[8px]`}
              onClick={() => {
                router.push(`/${artistInfo?.username}/merch`)
              }}
            >
              <CreatorMerchIcon alt="" />
              <div className={styles.refereshText}>Merch</div>
            </div>
          )} */}

          {hasLoading ? (
            <div className={`${styles.skeletonLoader} w-[35px] h-[35px] rounded-md`}></div>
          ) : (
            <div className={`${styles.iconContainer} w-[35px]`} onClick={() => setOpenShareModal(true)}>
              <div>
                <ShareSmallIcon alt="" />
              </div>
            </div>
          )}
        </div>

        {artistInfo?.bio && (
          <div className={`w-full mt-[15px] ${styles.bioText}`}>
            {processedNftDescription}
            {shouldShowReadMore && (
              <span onClick={toggleIsTruncated} className={`${styles.greenText} min-w-max cursor-pointer`}>
                {isTruncated ? '... Expand' : ' Collapse'}
              </span>
            )}
          </div>
        )}

        <div className="w-full mt-[15px] flex gap-[5px]">
          <div className={styles.statsConatiner}>
            {!isColletorLoaded ? (
              <div className={`${styles.skeletonLoader} ${styles.whiteText} w-[100px] h-[35px] rounded-[5px]`}></div>
            ) : (
              <div>
                <div className={styles.statisticValue}>{artistStatsInfo?.nfts_created}</div>
                <div className={styles.statisticLabel}>Created</div>
              </div>
            )}
          </div>
          <div className={styles.statsConatiner}>
            {!isColletorLoaded ? (
              <div className={`${styles.skeletonLoader} ${styles.whiteText} w-[100px] h-[35px] rounded-[5px]`}></div>
            ) : (
              <div>
                <div className={styles.statisticValue}>{collectorStatsInfo?.nfts_collected}</div>
                <div className={styles.statisticLabel}>Collected</div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full mt-[5px] flex gap-[5px]">
          <div className={styles.statsConatiner}>
            {!isColletorLoaded ? (
              <div className={`${styles.skeletonLoader} ${styles.whiteText} w-[100px] h-[35px] rounded-[5px]`}></div>
            ) : (
              <div>
                <div className="flex gap-[6px] items-center">
                  <SolanaLogoIcon alt="" className="mt-[4px]" />
                  <div className={styles.statisticValue}>{artistStatsInfo?.sales_volume}</div>
                </div>
                <div className={styles.statisticLabel}>Sold</div>
              </div>
            )}
          </div>
          <div className={styles.statsConatiner}>
            {!isColletorLoaded ? (
              <div className={`${styles.skeletonLoader} ${styles.whiteText} w-[100px] h-[35px] rounded-[5px]`}></div>
            ) : (
              <div>
                <div className="flex gap-[6px] items-center">
                  <SolanaLogoIcon alt="" className="mt-[4px]" />
                  <div className={styles.statisticValue}>{collectorStatsInfo?.purchase_volume}</div>
                </div>
                <div className={styles.statisticLabel}>Purchased</div>
              </div>
            )}
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

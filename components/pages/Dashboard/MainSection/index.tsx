import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { useWallet } from '@solana/wallet-adapter-react'
import { getShortAddress } from 'utils/wallet.util'
import { PublicKey } from '@solana/web3.js'

// custom components
import DashboardArtistCard from 'components/Card/DashboardArtistCard'
import SocialButton from 'components/Button/SocialButton'
import AddressButton from 'components/Button/AddressButton'
import IconButton from 'components/Button/IconButton'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'

// custom functions
import { useViewport, namePublicFile } from 'utils'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import BannerImage from 'assets/images/banner-image.png'
import AvatarImage from 'assets/images/dashboard-avatar.png'
import EditorGreenIcon from 'assets/icons/editor-green.svg'
import CameraWhiteIcon from 'assets/icons/camera-white.svg'
import TelegramWhiteIcon from 'assets/icons/telegram-white.svg'
import DiscordWhiteIcon from 'assets/icons/discord-white.svg'
import TwitterWhiteIcon from 'assets/icons/twitter-white.svg'
import IGWhiteIcon from 'assets/icons/instagram-green.svg'
import SettingWhiteIcon from 'assets/icons/setting-white.svg'
import IGHoverIcon from 'assets/icons/instagram-hover.svg'
import TwitterHoverIcon from 'assets/icons/twitter-hover.svg'
import DiscordHoverIcon from 'assets/icons/discord-hover.svg'
import TelegramHoverIcon from 'assets/icons/telegram-hover.svg'
import SettingGreenIcon from 'assets/icons/setting-green-01.svg'
import Alert from 'components/Alert'

// styles
import styles from './index.module.scss'

// call apis
import userAPI from 'apis/user'
import uploadFileToS3API from 'apis/aws'
import { copyClipboardAlert, copyToClipboard } from 'utils/helpers'
import CopyClipboardChip from 'components/Chip/CopyClipboardChip'

const MainSection = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const profileInfo = useSelector(state => (state as any).profileInfo)

  const { publicKey } = useWallet()
  const shortAddress = useMemo(() => getShortAddress(publicKey || ('' as unknown as PublicKey)), [publicKey])

  // banner part
  const inputBannerFile = useRef<any>(null)
  const [updateBanner, setUpdateBanner] = useState(false)
  const [openBannerEditorModal, setOpenBannerEditorModal] = useState(false)
  const [banner, setBanner] = useState<any>()
  const [croppedBanner, setCroppedBanner] = useState('')

  const [bannerUploadingToS3, setBannerUploadingToS3] = useState<boolean>(false)
  const [bannerPictureUrl, setBannerPictureUrl] = useState('')

  // avatar part
  const inputAvatarFile = useRef<any>(null)
  const [updateAvatar, setUpdateAvatar] = useState(false)
  const [openAvatarEditorModal, setOpenAvatarEditorModal] = useState(false)
  const [avatar, setAvatar] = useState<any>()
  const [croppedAvatar, setCroppedAvatar] = useState('')

  const [avatarUploadingToS3, setAvatarUploadingToS3] = useState<boolean>(false)
  const [avatarPictureUrl, setAvatarPictureUrl] = useState('')

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])

  useEffect(() => {
    if (
      profileInfo?.banner_picture !== null &&
      profileInfo?.banner_picture !== undefined &&
      profileInfo?.banner_picture !== ''
    ) {
      setCroppedBanner(profileInfo?.banner_picture)
    } else {
      setCroppedBanner('')
    }

    if (
      profileInfo?.profile_picture !== null &&
      profileInfo?.profile_picture !== undefined &&
      profileInfo?.profile_picture !== ''
    ) {
      setCroppedAvatar(profileInfo?.profile_picture)
    } else {
      setCroppedAvatar('')
    }
  }, [profileInfo])

  const getPrefixUrl = (url: string) => {
    let prefix = 'http'
    if (url.substring(0, prefix.length) !== prefix) {
      url = prefix + '://' + url
    }
    return url
  }

  const profileName = profileInfo?.username ? profileInfo?.username : ''
  const instagramUrl = profileInfo?.ig_url ? getPrefixUrl(profileInfo?.ig_url) : ''
  const discordUrl = profileInfo?.discord_url ? getPrefixUrl(profileInfo?.discord_url) : ''
  const twitterUrl = profileInfo?.twitter_url ? getPrefixUrl(profileInfo?.twitter_url) : ''
  const telegramUrl = profileInfo?.telegram_url ? getPrefixUrl(profileInfo?.telegram_url) : ''

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

  const handleChangeBannerImage = event => {
    const file = event.target.files
    if (file[0].size > 31457280) {
      showAlertModal()
      return
    }
    setBanner(file)
    setOpenBannerEditorModal(true)
  }

  const handleChangeAvatar = event => {
    const file = event.target.files
    if (file[0].size > 31457280) {
      showAlertModal()
      return
    }
    setAvatar(file)
    setOpenAvatarEditorModal(true)
  }

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
    const { data, url } = await uploadFileToS3API(file, filename)
    setBannerPictureUrl(url + filename)
    setBannerUploadingToS3(false)
  }

  const uploadAvatarFile = async (file: any, filename: string) => {
    setAvatarUploadingToS3(true)
    const { data, url } = await uploadFileToS3API(file, filename)
    setAvatarPictureUrl(url + filename)
    setAvatarUploadingToS3(false)
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

  return (
    <div className={styles.container}>
      <div className={styles.topLeftEllipse}>
        <Image src={EllipseGreen} alt="" objectFit="cover" />
      </div>
      <div className={styles.bannerImage}>
        <img
          src={croppedBanner !== '' ? croppedBanner : banner !== undefined ? banner : BannerImage.src}
          alt=""
          width={1620}
          height={480}
          className="w-full object-cover rounded-[15px] lg:rounded-[30px]"
        />
        <div className="absolute top-2 lg:top-auto bottom-auto lg:bottom-7 right-2 lg:right-7 cursor-pointer z-20">
          <div className={styles.iconBlurView}>
            <IconButton
              icon={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? EditorGreenIcon : CameraWhiteIcon}
              onClick={() => inputBannerFile.current.click()}
              backgroundColor={'transparent'}
              borderRadius="100%"
              width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '32px' : '46px'}
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '32px' : '46px'}
              iconWidth={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 20 : 46}
              iconHeight={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 20 : 46}
              disabled={bannerUploadingToS3}
            />
          </div>
          <input
            type="file"
            id="banner-file"
            // accept="image/png, image/jepg, image/gif"
            ref={inputBannerFile}
            style={{ display: 'none' }}
            onChange={event => handleChangeBannerImage(event)}
          />
        </div>
      </div>
      <div className="w-full z-10">
        <div className="grid grid-cols-12 items-center -mt-[60px] lg:mt-[-95px]">
          <div className="col-span-3" />
          <div className="col-span-6 justify-center">
            <div className="w-full flex justify-center">
              <div className="w-content relative">
                <DashboardArtistCard
                  image={croppedAvatar !== '' ? croppedAvatar : avatar !== undefined ? avatar : AvatarImage.src}
                />
                <div className="absolute bottom-1 lg:bottom-2 right-1 lg:right-2 cursor-pointer z-20">
                  <div className={styles.iconProfileBlurView}>
                    <IconButton
                      icon={
                        viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? EditorGreenIcon : CameraWhiteIcon
                      }
                      onClick={() => inputAvatarFile.current.click()}
                      backgroundColor={'transparent'}
                      borderRadius="100%"
                      width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '32px' : '46px'}
                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '32px' : '46px'}
                      iconWidth={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 20 : 46}
                      iconHeight={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 20 : 46}
                      disabled={avatarUploadingToS3}
                    />
                  </div>
                  <input
                    type="file"
                    id="avatar-file"
                    ref={inputAvatarFile}
                    style={{ display: 'none' }}
                    onChange={event => handleChangeAvatar(event)}
                  />
                </div>
              </div>
            </div>
            <div className={styles.bottomSection}>
              <div className={styles.artistName}>{profileName.length > 0 ? profileName : 'Username'}</div>
            </div>
            <div className="relative flex lg:hidden w-full justify-center mt-[3px] gap-[10px]">
              <div className="relative">
                <AddressButton
                  label={shortAddress}
                  onClick={() => {
                    copyToClipboard(publicKey?.toBase58() || '')
                    copyClipboardAlert('wallet-address-mobile')
                  }}
                />
                <CopyClipboardChip identifier="wallet-address-mobile" />
              </div>
            </div>
            <div className="hidden lg:flex justify-center mt-[16px]">
              <div className="relative">
                <AddressButton
                  label={shortAddress}
                  onClick={() => {
                    copyToClipboard(publicKey?.toBase58() || '')
                    copyClipboardAlert('wallet-address')
                  }}
                />
                <CopyClipboardChip identifier="wallet-address" />
              </div>
            </div>
            <div className="flex lg:hidden w-full justify-center mt-[15px] gap-[10px]">
              <div>
                <SocialButton icon={IGWhiteIcon} iconHover={IGHoverIcon} onClick={() => window.open(instagramUrl)} />
              </div>
              {/* <div>
                <SocialButton
                  icon={DiscordWhiteIcon}
                  iconHover={DiscordHoverIcon}
                  onClick={() => window.open(discordUrl)}
                />
              </div> */}
              <div>
                <SocialButton
                  icon={TwitterWhiteIcon}
                  iconHover={TwitterHoverIcon}
                  onClick={() => window.open(twitterUrl)}
                />
              </div>
              {/* <div>
                <SocialButton
                  icon={TelegramWhiteIcon}
                  iconHover={TelegramHoverIcon}
                  onClick={() => window.open(telegramUrl)}
                />
              </div> */}
            </div>
          </div>
          <div className="col-span-3 flex justify-end">
            <div className="flex lg:hidden justify-center mt-[-45px]">
              <div>
                <IconButton
                  icon={SettingWhiteIcon}
                  iconHover={SettingGreenIcon}
                  onClick={() => router.push('/settings')}
                  backgroundColor="transparent"
                  borderColor="#ECEEF4"
                  width="32px"
                  height="32px"
                  borderRadius="6px"
                />
              </div>
            </div>
            <div className="hidden lg:flex gap-[10px]">
              <div>
                <SocialButton icon={IGWhiteIcon} iconHover={IGHoverIcon} onClick={() => window.open(instagramUrl)} />
              </div>
              {/* <div>
                <SocialButton
                  icon={DiscordWhiteIcon}
                  iconHover={DiscordHoverIcon}
                  onClick={() => {
                    window.open(discordUrl)
                  }}
                />
              </div> */}
              <div>
                <SocialButton
                  icon={TwitterWhiteIcon}
                  iconHover={TwitterHoverIcon}
                  onClick={() => window.open(twitterUrl)}
                />
              </div>
              {/* <div>
                <SocialButton
                  icon={TelegramWhiteIcon}
                  iconHover={TelegramHoverIcon}
                  onClick={() => window.open(telegramUrl)}
                />
              </div> */}
              <div>
                <IconButton
                  icon={SettingWhiteIcon}
                  iconHover={SettingGreenIcon}
                  onClick={() => router.push('/settings')}
                  backgroundColor="transparent"
                  borderColor="#ECEEF4"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full mt-[32px]">
          <div className="max-w-[734px]">
            <div className={styles.description}>{profileInfo?.bio}</div>
          </div>
        </div>
      </div>
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

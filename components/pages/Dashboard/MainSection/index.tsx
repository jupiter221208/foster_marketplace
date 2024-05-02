import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

// next components
import { useRouter } from 'next/router'

// third party components
import { useWallet } from '@solana/wallet-adapter-react'
import { getShortAddress } from 'utils/wallet.util'
import { PublicKey } from '@solana/web3.js'

// custom components
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'

// custom functions
import { useViewport, namePublicFile } from 'utils'

// images and icons
import BannerImage from 'assets/images/banner-image.png'
import AvatarImage from 'assets/images/dashboard-avatar.png'
import SettingsIcon from 'assets/icons/settings-icon.svg?component'
import SettingsMobileIcon from 'assets/icons/settings-mobile-icon.svg?component'

import Alert from 'components/Alert'

// styles
import styles from './index.module.scss'

// call apis
import userAPI from 'apis/user'
import uploadFileToS3API from 'apis/aws'
import { copyToClipboard } from 'utils/helpers'
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'
import { useAuthentication } from 'hooks/useAuthentication'
import WalletFilterMenu from 'components/Menu/WalletFilterMenu'

const MainSection = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const { profileInfo } = useAuthentication()

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
  const [walletList, setWalletList] = useState([])
  const [selectedWallet, setSelectedWallet] = useState({ id: 0, label: getShortAddress(publicKey) })
  const getPrefixUrl = (url: string) => {
    let prefix = 'http'
    if (url.substring(0, prefix.length) !== prefix) {
      url = prefix + '://' + url
    }
    return url
  }
  const profileName = profileInfo?.username ? profileInfo?.username : ''
  const instagramUrl = profileInfo?.ig_url ? getPrefixUrl(profileInfo?.ig_url) : ''
  const siteUrl = profileInfo?.site_url ? getPrefixUrl(profileInfo?.site_url) : ''
  const twitterUrl = profileInfo?.twitter_url ? getPrefixUrl(profileInfo?.twitter_url) : ''
  const threelandUrl = profileInfo?.three_land_url ? getPrefixUrl(profileInfo?.three_land_url) : ''
  const solrPlexUrl = profileInfo?.solarplex_url ? getPrefixUrl(profileInfo?.solarplex_url) : ''

  useEffect(() => {
    let list = [{ id: 0, label: getShortAddress(publicKey), type: 'address' }]
    if (twitterUrl.length > 0) list.push({ id: list.length, label: 'Twitter', type: 'twitter' })
    if (instagramUrl.length > 0) list.push({ id: list.length, label: 'Instagram', type: 'instagram' })
    if (siteUrl.length > 0) list.push({ id: list.length, label: 'Website', type: 'website' })
    if (threelandUrl.length > 0) list.push({ id: list.length, label: '3.Land', type: 'land' })
    if (solrPlexUrl.length > 0) list.push({ id: list.length, label: 'Solarplex', type: 'solar' })
    setWalletList(list)
    setSelectedWallet(list[0])
  }, [publicKey, profileInfo])

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
      <div className={styles.bannerImage}>
        <img
          src={croppedBanner !== '' ? croppedBanner : banner !== undefined ? banner : BannerImage.src}
          alt=""
          className="w-full h-full object-cover opacity-100"
        />
      </div>
      <div className="w-full z-10">
        <div className="w-full flex justify-between">
          <div className={styles.avatarArea} onClick={() => router.push(`/${profileName}`)}>
            <div className="w-[90px] lg:w-[152px] rounded-full">
              <img
                src={croppedAvatar !== '' ? croppedAvatar : avatar !== undefined ? avatar : AvatarImage.src}
                alt=""
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <div className="flex gap-[10px] mt-[24px]">
            <div className="flex gap-[9px] lg:gap-[15px] items-center">
              <IconButtonWithSVG
                icon={
                  viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                    <SettingsMobileIcon />
                  ) : (
                    <SettingsIcon />
                  )
                }
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 40 : 40}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 40 : 40}
                onClick={() => router.push('/settings')}
                backgroundColor="var(--background-main-color)"
                borderColor="rgba(var(--main-bg-color-rgb), 0.1)"
                borderRadius={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 20 : 20}
              />
              <WalletFilterMenu
                label={'Wallet & Socials'}
                data={walletList}
                selectedItem={selectedWallet}
                setSelectedItem={item => {
                  if (item.type === 'address') {
                    copyToClipboard(publicKey?.toBase58() || '')
                  } else if (item.type === 'twitter') {
                    window.open(twitterUrl)
                  } else if (item.type === 'instagram') {
                    window.open(instagramUrl)
                  } else if (item.type === 'website') {
                    window.open(siteUrl)
                  } else if (item.type === 'land') {
                    window.open(threelandUrl)
                  } else if (item.type === 'solar') {
                    window.open(solrPlexUrl)
                  }
                }}
              />
            </div>
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

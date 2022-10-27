import React, { useEffect, useMemo, useRef, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { useWallet } from '@solana/wallet-adapter-react'
import { getShortAddress } from 'utils/wallet.util'
import { useSelector, useDispatch } from 'react-redux'

// custom components
import OutlineButton from 'components/Button/OutlineButton'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import IconButton from 'components/Button/IconButton'
import CopyWalletInput from 'components/Input/CopyWalletInput'
import GradientButton from 'components/Button/GradientButton'
import Alert from 'components/Alert'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'

// custom functions
import { useViewport, namePublicFile } from 'utils'

// images and icons
import DefaultAvatar from 'assets/images/dashboard-avatar.png'
import EditorGreenIcon from 'assets/icons/editor-green.svg'
import InstagramWhiteIcon from 'assets/icons/instagram-white.svg'
import DiscordWhiteIcon from 'assets/icons/discord-white.svg'
import TwitterWhiteIcon from 'assets/icons/twitter-white.svg'
import TelegramWhiteIcon from 'assets/icons/telegram-white.svg'
import ViewGreenIcon from 'assets/icons/view-green.svg'

// styles
import styles from './index.module.scss'
import { PublicKey } from '@solana/web3.js'

// call apis
import userAPI from 'apis/user'
import uploadFileToS3API from 'apis/aws'

const ProfileSection = prop => {
  const { success } = prop
  const viewport = useViewport()
  const dispatch = useDispatch()

  const { publicKey } = useWallet()
  const shortAddress = useMemo(() => getShortAddress(publicKey || ('' as unknown as PublicKey)), [publicKey])

  const inputFile = useRef<any>(null)
  const [avatar, setAvatar] = useState<any>()
  const [croppedAvatar, setCroppedAvatar] = useState('')
  const [userName, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  const [igUrl, setIgUrl] = useState('')
  const [discordUrl, setDiscordUrl] = useState('')
  const [twitterUrl, setTwitterUrl] = useState('')
  const [telegramUrl, setTelegramUrl] = useState('')
  const [orgUserInfo, setOrgUserInfo] = useState<any>(null)
  const [enableSave, setEnableSave] = useState(false)

  const [updateImage, setUpdateImage] = useState(false)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [openNftImageEditorModal, setOpenNftImageEditorModal] = useState(false)

  const [uploadingToS3, setUploadingToS3] = useState<boolean>(false)

  const copyToClipboard = value => {
    navigator.clipboard.writeText(value)
    setShowAlert(true)
  }

  const handleChangeAvatar = event => {
    const file = event.target.files
    setAvatar(file)
    setOpenNftImageEditorModal(true)
  }

  useEffect(() => {
    if (croppedAvatar !== '' && updateImage) {
      const fetchData = async url => {
        let response = await fetch(url)
        let blob = await response.blob()
        const file = new File([blob], 'avatar.jpg', {
          type: 'image/jpeg',
        })
        const filename = namePublicFile('avatar.jpg')
        uploadFile(file, filename)
      }
      fetchData(croppedAvatar)
      setUpdateImage(false)
    }
  }, [updateImage])

  const uploadFile = async (file: any, filename: string) => {
    setUploadingToS3(true)
    const { data, url } = await uploadFileToS3API(file, filename)
    setProfilePictureUrl(url + filename)
    setUploadingToS3(false)
  }

  const checkEnableSave = () => {
    if (orgUserInfo === null) {
      return
    }

    if (userName && userName !== orgUserInfo.username) {
      setEnableSave(true)
      return
    }
    if (bio && bio !== orgUserInfo.bio) {
      setEnableSave(true)
      return
    }
    if (userEmail && userEmail !== orgUserInfo.email) {
      setEnableSave(true)
      return
    }
    if (igUrl && igUrl !== orgUserInfo.ig_url) {
      setEnableSave(true)
      return
    }
    if (twitterUrl && twitterUrl !== orgUserInfo.twitter_url) {
      setEnableSave(true)
      return
    }
    if (discordUrl && discordUrl !== orgUserInfo.discord_url) {
      setEnableSave(true)
      return
    }
    if (telegramUrl && telegramUrl !== orgUserInfo.telegram_url) {
      setEnableSave(true)
      return
    }
    if (profilePictureUrl && profilePictureUrl !== orgUserInfo.profile_picture && profilePictureUrl !== '') {
      setEnableSave(true)
      return
    }
    setEnableSave(false)
    return
  }

  const handleSaveUserInfo = () => {
    userAPI
      .update({
        wallet_id: publicKey?.toBase58() || '',
        username: userName,
        bio: bio,
        email: userEmail,
        ig_url: igUrl,
        twitter_url: twitterUrl,
        discord_url: discordUrl,
        telegram_url: telegramUrl,
        profile_picture: profilePictureUrl,
      })
      .then(
        response => {
          if (response !== null) {
            dispatch({ type: 'set', profileInfo: response })
            setOrgUserInfo(response)
            setEnableSave(false)
            success()
          }
        },
        error => {
          console.log(error)
        }
      )
  }

  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    setData([
      {
        id: 0,
        title: 'Copied successfully!',
        description: 'Wallet address is copied successfully!',
        type: 'success',
      },
    ])
  }, [])

  useEffect(() => {
    if (publicKey === null) return
    userAPI.get(publicKey?.toBase58() || '').then(
      response => {
        if (response !== null) {
          const userInfo = response
          if (userInfo.profile_picture) {
            setCroppedAvatar(userInfo.profile_picture)
            setProfilePictureUrl(userInfo.profile_picture)
          }
          setUsername(userInfo.username)
          setBio(userInfo.bio)
          setUserEmail(userInfo.email)
          setIgUrl(userInfo.ig_url)
          setTwitterUrl(userInfo.twitter_url)
          setDiscordUrl(userInfo.discord_url)
          setTelegramUrl(userInfo.telegram_url)
          setOrgUserInfo(userInfo)
        }
      },
      error => {
        console.log(error)
      }
    )
  }, [publicKey])

  useEffect(() => {
    checkEnableSave()
  }, [userName, bio, userEmail, igUrl, discordUrl, twitterUrl, telegramUrl, profilePictureUrl])

  return (
    <div className={styles.container}>
      <div className="w-full hidden lg:flex justify-start">
        <div className={styles.title}>Profile</div>
      </div>
      <div className="w-full flex justify-center">
        <div className={styles.content}>
          <div className={styles.innercontent}>
            <div className="w-full flex justify-center lg:justify-start lg:mt-12 mb-[20px] lg:mb-[22px]">
              <div className={styles.avatarArea}>
                <img
                  src={croppedAvatar !== '' ? croppedAvatar : avatar !== undefined ? avatar : DefaultAvatar}
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 90 : 251}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 90 : 251}
                  alt=""
                  className="rounded-full object-cover"
                />
              </div>
            </div>
            <div className="flex justify-center lg:justify-start">
              <div className="w-[250px]">
                <OutlineButton
                  label="Change Profile Picture"
                  icon={EditorGreenIcon}
                  onClick={() => {
                    inputFile.current.click()
                  }}
                  direction="rtl"
                  fullWidth
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '41px' : '64px'}
                  fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                  borderColor="#EFF0F6"
                />
                <input
                  type="file"
                  id="file"
                  ref={inputFile}
                  style={{ display: 'none' }}
                  onChange={event => handleChangeAvatar(event)}
                />
              </div>
            </div>
            <div className="mt-[50px] lg:mt-[101px]">
              <div className={styles.subTitle}>Personal Info</div>
            </div>
            <div className="mt-4 lg:mt-8">
              <Input value={userName} placeholder="User name" onChange={value => setUsername(value)} />
            </div>
            <div className="mt-[10px] lg:mt-[30px] h-fit">
              <Textarea value={bio} placeholder="Bio" width="100%" height="100%" onChange={value => setBio(value)} />
            </div>
            <div className="mt-[10px] lg:mt-[30px]">
              <Input value={userEmail} placeholder="Email Address" onChange={value => setUserEmail(value)} />
            </div>
            <div className="mt-[45px] lg:mt-[60px]">
              <div className={styles.subTitle}>Social Connections & Links</div>
            </div>
            <div className="mt-4 lg:mt-8 flex items-center gap-6">
              <IconButton
                icon={InstagramWhiteIcon}
                backgroundColor="transparent"
                borderColor="#EFF0F6"
                width="46px"
                height="46px"
                borderRadius="12px"
                borderWidth="2px"
                onClick={() => {}}
              />
              <Input
                value={igUrl}
                placeholder="Add Your Account"
                onChange={value => {
                  setIgUrl(value)
                }}
              />
            </div>
            <div className="mt-[10px] lg:mt-[30px] flex items-center gap-6">
              <IconButton
                icon={DiscordWhiteIcon}
                backgroundColor="transparent"
                borderColor="#EFF0F6"
                width="46px"
                height="46px"
                borderRadius="12px"
                borderWidth="2px"
                onClick={() => {}}
              />
              <Input value={discordUrl} placeholder="Add Your Account" onChange={value => setDiscordUrl(value)} />
            </div>
            <div className="mt-[10px] lg:mt-[30px] flex items-center gap-6">
              <IconButton
                icon={TwitterWhiteIcon}
                backgroundColor="transparent"
                borderColor="#EFF0F6"
                width="46px"
                height="46px"
                borderRadius="12px"
                borderWidth="2px"
                onClick={() => {}}
              />
              <Input value={twitterUrl} placeholder="Add Your Account" onChange={value => setTwitterUrl(value)} />
            </div>
            <div className="mt-[10px] lg:mt-[30px] flex items-center gap-6">
              <IconButton
                icon={TelegramWhiteIcon}
                backgroundColor="transparent"
                borderColor="#EFF0F6"
                width="46px"
                height="46px"
                borderRadius="12px"
                borderWidth="2px"
                onClick={() => {}}
              />
              <Input value={telegramUrl} placeholder="Add Your Account" onChange={value => setTelegramUrl(value)} />
            </div>
            <div className="mt-[45px] lg:mt-[60px]">
              <div className={styles.subTitle}>Wallet</div>
            </div>
            <div className="mt-4 lg:mt-8">
              <CopyWalletInput
                value={shortAddress}
                placeholder="Add Your Account"
                disabled
                onClick={() => copyToClipboard(publicKey?.toString() || '')}
              />
            </div>
            <div className="mt-[49px] lg:mt-[78px] mb-[188px] lg:mb-[158px] w-full flex justify-end items-center gap-6">
              {enableSave ? (
                <GradientButton
                  label="Save"
                  onClick={() => {
                    handleSaveUserInfo()
                  }}
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50%' : ''}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '64px'}
                  fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '16px' : '18px'}
                  paddingLeft={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
                  paddingRight={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
                  opacity={1}
                />
              ) : (
                <GradientButton
                  label="Save"
                  onClick={() => {}}
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50%' : ''}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '64px'}
                  fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '16px' : '18px'}
                  paddingLeft={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
                  paddingRight={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
                  opacity={0.7}
                  disabled={uploadingToS3}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={data}
      />
      <NftImageEditorModal
        open={openNftImageEditorModal}
        close={() => setOpenNftImageEditorModal(false)}
        nftImage={avatar}
        getCroppedImage={croppedImage => {
          setUpdateImage(true)
          setCroppedAvatar(croppedImage)
          setOpenNftImageEditorModal(false)
        }}
        dimension={{ value: [1080, 1080] }}
      />
    </div>
  )
}

export default ProfileSection

import React, { useEffect, useMemo, useState } from 'react'

// next components
import Image from 'next/image'
import Link from 'next/link'

// third party components
import { useWallet } from '@solana/wallet-adapter-react'
import { getShortAddress } from 'utils/wallet.util'
import { useDispatch } from 'react-redux'

// custom components
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import IconButton from 'components/Button/IconButton'
import CopyWalletInput from 'components/Input/CopyWalletInput'
import GradientButton from 'components/Button/GradientButton'
import Alert from 'components/Alert'

// custom functions
import { useViewport } from 'utils'

// images and icons
import InstagramWhiteIcon from 'assets/icons/instagram-white.svg'
import DiscordWhiteIcon from 'assets/icons/discord-white.svg'
import TwitterWhiteIcon from 'assets/icons/twitter-white.svg'
import TelegramWhiteIcon from 'assets/icons/telegram-white.svg'
import UnverifiedLightBrownIcon from 'assets/icons/unverified-light-brown-21x25.svg'
import ReviewLightGreenIcon from 'assets/icons/review-light-green-19x20.svg'
import VerifiedGreenIcon from 'assets/icons/checked-green.svg'

// styles
import styles from './index.module.scss'
import { PublicKey } from '@solana/web3.js'

// call apis
import userAPI from 'apis/user'

const ProfileSection = prop => {
  const { success } = prop
  const viewport = useViewport()
  const dispatch = useDispatch()

  const { publicKey } = useWallet()
  const shortAddress = useMemo(() => getShortAddress(publicKey || ('' as unknown as PublicKey)), [publicKey])

  const [userName, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  const [igUrl, setIgUrl] = useState('')
  const [discordUrl, setDiscordUrl] = useState('')
  const [twitterUrl, setTwitterUrl] = useState('')
  const [telegramUrl, setTelegramUrl] = useState('')
  const [orgUserInfo, setOrgUserInfo] = useState<any>(null)
  const [verificationStatus, setVerificationStatus] = useState('unverified') // unverified, review, verified
  const [enableSave, setEnableSave] = useState(false)

  const [showAlert, setShowAlert] = useState<boolean>(false)

  const copyToClipboard = value => {
    navigator.clipboard.writeText(value)
    setShowAlert(true)
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
            <div className="mt-[0px] lg:mt-[101px]">
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
                backgroundColor="#202427"
                borderColor="#202427"
                width="46px"
                height="46px"
                borderRadius="12px"
                borderWidth="0px"
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
                backgroundColor="#202427"
                borderColor="#202427"
                width="46px"
                height="46px"
                borderRadius="12px"
                borderWidth="0px"
                onClick={() => {}}
              />
              <Input value={discordUrl} placeholder="Add Your Account" onChange={value => setDiscordUrl(value)} />
            </div>
            <div className="mt-[10px] lg:mt-[30px] flex items-center gap-6">
              <IconButton
                icon={TwitterWhiteIcon}
                backgroundColor="#202427"
                borderColor="#202427"
                width="46px"
                height="46px"
                borderRadius="12px"
                borderWidth="0px"
                onClick={() => {}}
              />
              <Input value={twitterUrl} placeholder="Add Your Account" onChange={value => setTwitterUrl(value)} />
            </div>
            <div className="mt-[10px] lg:mt-[30px] flex items-center gap-6">
              <IconButton
                icon={TelegramWhiteIcon}
                backgroundColor="#202427"
                borderColor="#202427"
                width="46px"
                height="46px"
                borderRadius="12px"
                borderWidth="0px"
                onClick={() => {}}
              />
              <Input value={telegramUrl} placeholder="Add Your Account" onChange={value => setTelegramUrl(value)} />
            </div>
            <div className="mt-[45px] lg:mt-[60px]">
              <div className={styles.subTitle}>Verification Status</div>
            </div>
            <div className="mt-4 lg:mt-8 flex justify-between">
              {verificationStatus === 'unverified' && (
                <div className={`flex gap-[10px] items-center ${styles.verifyText}`}>
                  <div className={styles.unverifiedTextColor}>Unverified</div>
                  <Image src={UnverifiedLightBrownIcon} alt="" />
                </div>
              )}
              {verificationStatus === 'review' && (
                <div className={`flex gap-[10px] items-center ${styles.verifyText}`}>
                  <div className={styles.reviewTextColor}>Under Review</div>
                  <Image src={ReviewLightGreenIcon} alt="" />
                </div>
              )}
              {verificationStatus === 'verified' && (
                <div className={`flex gap-[10px] items-center ${styles.verifyText}`}>
                  <div className={styles.verifiedTextColor}>Verified</div>
                  <Image src={VerifiedGreenIcon} alt="" />
                </div>
              )}
              {verificationStatus === 'unverified' && (
                <Link href="/settings/user-verification">
                  <a className={styles.linkText}>Request Verification</a>
                </Link>
              )}
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
            <div className="mt-[49px] lg:mt-[78px] mb-[188px] lg:mb-[158px] w-full flex justify-center lg:justify-end items-center gap-6">
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
    </div>
  )
}

export default ProfileSection

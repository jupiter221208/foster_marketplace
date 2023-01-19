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
import InstagramWhiteIcon from 'assets/icons/instagram-green.svg'
import InstagramWhiteSmallIcon from 'assets/icons/instagram-green-small.svg'
import DiscordWhiteIcon from 'assets/icons/discord-white.svg'
import DiscordWhiteSmallIcon from 'assets/icons/discord-green-small.svg'
import TwitterWhiteIcon from 'assets/icons/twitter-white.svg'
import TwitterWhiteSmallIcon from 'assets/icons/twitter-green-small.svg'
import TelegramWhiteIcon from 'assets/icons/telegram-white.svg'
import TelegramWhiteSmallIcon from 'assets/icons/telegram-green-small.svg'
import UnverifiedLightBrownIcon from 'assets/icons/unverified-light-brown-21x25.svg'
import ReviewLightGreenIcon from 'assets/icons/review-light-green-19x20.svg'
import VerifiedGreenIcon from 'assets/icons/checked-green.svg'
import InfoGreenIcon from 'assets/icons/info-green.svg'
import CloseWhiteIcon from 'assets/icons/close-white.svg'
import CirclePlugGreenIcon from 'assets/icons/circle-plus-green.svg'

// styles
import styles from './index.module.scss'
import { PublicKey } from '@solana/web3.js'

// call apis
import userAPI from 'apis/user'
import SwitchButton from 'components/SwitchButton'

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
  const [artistEnable, setArtistEnable] = useState(true)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [showProfileTooltip, setShowProfileTooltip] = useState(false)
  const [showLinkWalletAlert, setShowLinkWalletAlert] = useState(false)

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
      <div className="w-full flex justify-center">
        <div className={styles.content}>
          <div className={styles.innercontent}>
            <div>
              <div className={styles.subTitle}>Profile Information</div>
            </div>
            <div className="mt-[15px] lg:mt-8">
              <Input
                value={userName}
                fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                backgroundColor="#202427"
                placeholder="Username"
                onChange={value => setUsername(value)}
              />
            </div>
            <div className="mt-[10px] lg:mt-[30px] h-fit">
              <Textarea
                value={bio}
                fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                backgroundColor="#202427"
                placeholder="Bio"
                width="100%"
                height="100%"
                onChange={value => setBio(value)}
              />
            </div>
            <div className="mt-[5px] lg:mt-[30px]">
              <Input
                value={userEmail}
                fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                backgroundColor="#202427"
                placeholder="Email Address"
                onChange={value => setUserEmail(value)}
              />
            </div>
            <div className="mt-[45px] lg:mt-[60px]">
              <div className={styles.subTitle}>Social Connections & Links</div>
            </div>
            <div className="mt-4 lg:mt-8 flex items-center">
              <IconButton
                icon={
                  viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                    ? InstagramWhiteSmallIcon
                    : InstagramWhiteIcon
                }
                backgroundColor="#202427"
                borderColor="#202427"
                width="46px"
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50px' : '46px'}
                borderRadius="12px"
                borderWidth="0px"
                onClick={() => {}}
              />
              <div className="w-full ml-[-16px] lg:ml-[24px]">
                <Input
                  value={igUrl}
                  placeholder="https://www.instagram.com"
                  fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                  backgroundColor="#202427"
                  onChange={value => {
                    setIgUrl(value)
                  }}
                />
              </div>
            </div>
            <div className="mt-[10px] lg:mt-[30px] flex items-center">
              <IconButton
                icon={
                  viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? DiscordWhiteSmallIcon : DiscordWhiteIcon
                }
                backgroundColor="#202427"
                borderColor="#202427"
                width="46px"
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50px' : '46px'}
                borderRadius="12px"
                borderWidth="0px"
                onClick={() => {}}
              />
              <div className="w-full ml-[-16px] lg:ml-[24px]">
                <Input
                  value={discordUrl}
                  placeholder="https://discord.gg/"
                  fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                  backgroundColor="#202427"
                  onChange={value => setDiscordUrl(value)}
                />
              </div>
            </div>
            <div className="mt-[10px] lg:mt-[30px] flex items-center">
              <IconButton
                icon={
                  viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? TwitterWhiteSmallIcon : TwitterWhiteIcon
                }
                backgroundColor="#202427"
                borderColor="#202427"
                width="46px"
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50px' : '46px'}
                borderRadius="12px"
                borderWidth="0px"
                onClick={() => {}}
              />
              <div className="w-full ml-[-16px] lg:ml-[24px]">
                <Input
                  value={twitterUrl}
                  placeholder="https://twitter.com"
                  fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                  backgroundColor="#202427"
                  onChange={value => setTwitterUrl(value)}
                />
              </div>
            </div>
            <div className="mt-[10px] lg:mt-[30px] flex items-center">
              <IconButton
                icon={
                  viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                    ? TelegramWhiteSmallIcon
                    : TelegramWhiteIcon
                }
                backgroundColor="#202427"
                borderColor="#202427"
                width={'46px'}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50px' : '46px'}
                borderRadius="12px"
                borderWidth="0px"
                onClick={() => {}}
              />

              <div className="w-full ml-[-16px] lg:ml-[24px]">
                <Input
                  value={telegramUrl}
                  placeholder="Add Telegram Account"
                  fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                  backgroundColor="#202427"
                  onChange={value => setTelegramUrl(value)}
                />
              </div>
            </div>
            <div className="mt-[45px] lg:mt-[60px]">
              <div className={styles.subTitle}>Verification Status</div>
            </div>
            <div className="mt-4 lg:mt-[18px] flex justify-between">
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

            {/* {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="relative flex mt-[45px] ">
                <div className="w-full flex justify-center">
                  <div className={styles.subTitle}>Default Profile View</div>
                  <div
                    className="pl-[10px] pr-[10px] flex justify-center"
                    onClick={() => setShowProfileTooltip(!showProfileTooltip)}
                  >
                    <Image src={InfoGreenIcon} alt="" />
                  </div>
                </div>
                {showProfileTooltip ? (
                  <div className={styles.tooltip}>
                    <div className="absolute top-[8px] right-[8px]">
                      <IconButton
                        icon={CloseWhiteIcon}
                        onClick={() => setShowProfileTooltip(!showProfileTooltip)}
                        backgroundColor="#4B4B4B"
                        width="20px"
                        height="20px"
                        borderRadius="10px"
                        iconWidth={10}
                        iconHeight={10}
                      />
                    </div>

                    <div className="mt-[12px]">
                      This setting allows you to choose the type of artwork and statistics displayed on your profile
                      page.
                    </div>
                    <div className="mt-[20px]">
                      <span className={styles.tooltipTitle}>Artist View</span> displays your profile as a creator,
                      showcasing the artwork and collections created by you.
                    </div>
                    <div className="mt-[20px]">
                      <span className={styles.tooltipTitle}>Collector View</span> displays your profile as a collector,
                      showcasing the artwork and collections you&apos;ve collected.
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <div className="flex mt-[60px]">
                <div className={styles.subTitle}>Default Profile View</div>
                <div className="flex items-center justify-center cursor-pointer">
                  <div
                    className="relative flex justify-between items-center"
                    onMouseEnter={() => setShowProfileTooltip(true)}
                    onMouseLeave={() => setShowProfileTooltip(false)}
                  >
                    <div className="p-[9px]">
                      <Image src={InfoGreenIcon} alt="" />
                    </div>
                    {showProfileTooltip ? (
                      <div className={styles.tooltip}>
                        <div>
                          This setting allows you to choose the type of artwork and statistics displayed on your profile
                          page.
                        </div>
                        <div className="mt-[20px]">
                          <span className={styles.tooltipTitle}>Artist View</span> displays your profile as a creator,
                          showcasing the artwork and collections created by you.
                        </div>
                        <div className="mt-[20px]">
                          <span className={styles.tooltipTitle}>Collector View</span> displays your profile as a
                          collector, showcasing the artwork and collections you&apos;ve collected.
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            )} */}

            {/* {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="flex justify-between mt-[30px]">
                <div className={styles.artistProfile}>{artistEnable ? 'Artist Profile' : 'Collector Profile'}</div>
                <SwitchButton
                  enabled={artistEnable}
                  onChange={() => {
                    setArtistEnable(!artistEnable)
                  }}
                />
              </div>
            ) : (
              <div className="flex mt-[30px]">
                <SwitchButton
                  enabled={artistEnable}
                  onChange={() => {
                    setArtistEnable(!artistEnable)
                  }}
                />
                <div className={styles.artistProfile}>{artistEnable ? 'Artist Profile' : 'Collector Profile'}</div>
              </div>
            )} */}

            <div className="mt-[35px] lg:mt-[50px]">
              <div className={styles.subTitle}>Associated Wallets</div>
            </div>
            <div className="mt-4 lg:mt-8">
              <CopyWalletInput
                value={shortAddress}
                placeholder="Add Your Account"
                disabled
                onClick={() => copyToClipboard(publicKey?.toString() || '')}
              />
            </div>
            <div className="w-[200%] mt-[31px] flex cursor-pointer">
              <div
                className={styles.anotherWalletArea}
                onMouseEnter={() => setShowLinkWalletAlert(true)}
                onMouseLeave={() => setShowLinkWalletAlert(false)}
                onClick={() => {
                  if (viewport === 'xs' || viewport === 'sm' || viewport === 'md') {
                    setShowLinkWalletAlert(true)
                    setTimeout(() => {
                      setShowLinkWalletAlert(false)
                    }, 3000)
                  }
                }}
              >
                <div className="flex items-center">
                  <Image src={CirclePlugGreenIcon} alt="" />
                </div>
                <div className="ml-[11px] pb-[3px]">Link another wallet</div>
              </div>
              {showLinkWalletAlert && (
                <div className="relative">
                  <div className={styles.anotherWalletAlert}>This feature is not available but is coming soon.</div>
                </div>
              )}
            </div>
            {showLinkWalletAlert && (
              <div className="relative flex lg:hidden">
                <div className={styles.anotherWalletAlertMobile}>This feature is not available but is coming soon.</div>
              </div>
            )}

            <div className="mt-[134px] lg:mt-[61px] mb-[188px] lg:mb-[158px] w-full flex justify-end items-center gap-6">
              {enableSave ? (
                <GradientButton
                  label="Save"
                  onClick={() => {
                    handleSaveUserInfo()
                  }}
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50%' : ''}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '52px'}
                  fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '16px' : '18px'}
                  paddingLeft={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
                  paddingRight={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
                />
              ) : (
                <GradientButton
                  label="Save"
                  onClick={() => {}}
                  color="#888A8E"
                  backgroundColor01="#202427"
                  backgroundColor02="#202427"
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50%' : ''}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '52px'}
                  fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '16px' : '18px'}
                  paddingLeft={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
                  paddingRight={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
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

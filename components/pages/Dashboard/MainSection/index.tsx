import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { useWallet } from '@solana/wallet-adapter-react'
import { getShortAddress } from 'utils/wallet.util'
import { Url } from 'url'
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
import BannerImage from 'assets/images/alexander-ant.png'
import AvatarImage from 'assets/images/dashboard-avatar.png'
import EditorGreenIcon from 'assets/icons/editor-green.svg'
import CameraWhiteIcon from 'assets/icons/camera-white.svg'
import TelegramWhiteIcon from 'assets/icons/telegram-white.svg'
import DiscordWhiteIcon from 'assets/icons/discord-white.svg'
import TwitterWhiteIcon from 'assets/icons/twitter-white.svg'
import IGWhiteIcon from 'assets/icons/instagram-white.svg'
import SettingWhiteIcon from 'assets/icons/setting-white.svg'
import IGHoverIcon from 'assets/icons/instagram-hover.svg'
import TwitterHoverIcon from 'assets/icons/twitter-hover.svg'
import DiscordHoverIcon from 'assets/icons/discord-hover.svg'
import TelegramHoverIcon from 'assets/icons/telegram-hover.svg'
import SettingGreenIcon from 'assets/icons/setting-green-01.svg'

// styles
import styles from './index.module.scss'

// call api
import userAPI from 'apis/user'
import uploadFileToS3 from 'apis/aws'

const MainSection = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const profileInfo = useSelector(state => (state as any).profileInfo)

  const { publicKey } = useWallet()
  const shortAddress = useMemo(() => getShortAddress(publicKey || ('' as unknown as PublicKey)), [publicKey])
  const [openNftImageEditorModal, setOpenNftImageEditorModal] = useState(false)
  const [updateImage, setUpdateImage] = useState(false)
  const [uploadingToS3, setUploadingToS3] = useState<boolean>(false)

  const inputFile = useRef<any>(null)
  const [banner, setBanner] = useState<any>()
  const [croppedBanner, setCroppedBanner] = useState(profileInfo?.banner_picture ? profileInfo?.banner_picture : '')

  const profileImage = profileInfo?.profile_picture ? profileInfo?.profile_picture : ''
  const profileName = profileInfo?.username ? profileInfo?.username : ''
  const instagramUrl = profileInfo?.ig_url ? getPrefixUrl(profileInfo?.ig_url) : ''
  const discordUrl = profileInfo?.discord_url ? getPrefixUrl(profileInfo?.discord_url) : ''
  const twitterUrl = profileInfo?.twitter_url ? getPrefixUrl(profileInfo?.twitter_url) : ''
  const telegramUrl = profileInfo?.telegram_url ? getPrefixUrl(profileInfo?.telegram_url) : ''
  const [bannerPictureUrl, setBannerPictureUrl] = useState('')

  function getPrefixUrl(url: string) {
    var prefix = 'http'
    if (url.substring(0, prefix.length) !== prefix) {
      url = prefix + '://' + url
    }
    return url
  }

  const handleChangeBannerImage = event => {
    const file = event.target.files
    setBanner(file)
    setOpenNftImageEditorModal(true)
  }

  const copyToClipboard = value => {
    navigator.clipboard.writeText(value)
  }

  useEffect(() => {
    if (croppedBanner !== '' && updateImage) {
      const fetchData = async url => {
        let response = await fetch(url)
        let blob = await response.blob()
        const file = new File([blob], 'banner.jpg', {
          type: 'image/jpeg',
        })
        const filename = namePublicFile('banner.jpg')
        uploadFile(file, filename)
      }
      fetchData(croppedBanner)
      setUpdateImage(false)
    }
  }, [updateImage])

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

  useEffect(() => {}, [])

  const uploadFile = async (file: any, filename: string) => {
    setUploadingToS3(true)
    const { data, url } = await uploadFileToS3(file, filename)
    setBannerPictureUrl(url + filename)
    setUploadingToS3(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.topLeftEllipse}>
        <Image src={EllipseGreen} alt="" objectFit="cover" />
      </div>
      <div className={styles.bannerImage}>
        <Image
          src={croppedBanner !== '' ? croppedBanner : banner !== undefined ? banner : BannerImage}
          alt=""
          width={1620}
          height={460}
          objectFit="cover"
          className="rounded-[15px] lg:rounded-[30px]"
        />
        <div className="absolute top-2 lg:top-auto bottom-auto lg:bottom-7 right-2 lg:right-7 cursor-pointer z-20">
          <IconButton
            icon={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? EditorGreenIcon : CameraWhiteIcon}
            onClick={() => inputFile.current.click()}
            backgroundColor={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '#378287' : 'transparent'}
            borderRadius="100%"
            width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '32px' : '46px'}
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '32px' : '46px'}
            iconWidth={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '20px' : '46px'}
            iconHeight={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '20px' : '46px'}
          />
          <input
            type="file"
            id="file"
            ref={inputFile}
            style={{ display: 'none' }}
            onChange={event => handleChangeBannerImage(event)}
          />
        </div>
      </div>
      <div className="w-full z-10">
        <div className="grid grid-cols-12 items-center -mt-[60px] lg:mt-[-95px]">
          <div className="col-span-3" />
          <div className="col-span-6">
            <DashboardArtistCard
              image={profileImage.length > 0 ? profileImage : AvatarImage}
              artistName={profileName.length > 0 ? profileName : 'Username'}
            />
            <div className="flex lg:hidden w-full justify-center mt-[5px] gap-[10px]">
              <AddressButton
                label={shortAddress}
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '89px' : '146px'}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '29px' : '51px'}
                onClick={() => copyToClipboard(publicKey?.toBase58() || '')}
              />
            </div>
            <div className="hidden lg:flex justify-center mt-[16px]">
              <AddressButton
                label={shortAddress}
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '89px' : '192px'}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '29px' : '51px'}
                onClick={() => copyToClipboard(publicKey?.toBase58() || '')}
              />
            </div>
            <div className="flex lg:hidden w-full justify-center mt-[5px] gap-[10px]">
              <div>
                <SocialButton icon={IGWhiteIcon} iconHover={IGHoverIcon} onClick={() => window.open(instagramUrl)} />
              </div>
              <div>
                <SocialButton
                  icon={DiscordWhiteIcon}
                  iconHover={DiscordHoverIcon}
                  onClick={() => window.open(discordUrl)}
                />
              </div>
              <div>
                <SocialButton
                  icon={TwitterWhiteIcon}
                  iconHover={TwitterHoverIcon}
                  onClick={() => window.open(twitterUrl)}
                />
              </div>
              <div>
                <SocialButton
                  icon={TelegramWhiteIcon}
                  iconHover={TelegramHoverIcon}
                  onClick={() => window.open(telegramUrl)}
                />
              </div>
            </div>
          </div>
          <div className="col-span-3 flex justify-end">
            <div className="flex lg:hidden justify-center lg:mt-[16px]">
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

              <div>
                <SocialButton
                  icon={DiscordWhiteIcon}
                  iconHover={DiscordHoverIcon}
                  onClick={() => {
                    window.open(discordUrl)
                  }}
                />
              </div>
              <div>
                <SocialButton
                  icon={TwitterWhiteIcon}
                  iconHover={TwitterHoverIcon}
                  onClick={() => window.open(twitterUrl)}
                />
              </div>
              <div>
                <SocialButton
                  icon={TelegramWhiteIcon}
                  iconHover={TelegramHoverIcon}
                  onClick={() => window.open(telegramUrl)}
                />
              </div>
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
        open={openNftImageEditorModal}
        close={() => setOpenNftImageEditorModal(false)}
        nftImage={banner}
        getCroppedImage={croppedImage => {
          setUpdateImage(true)
          setCroppedBanner(croppedImage)
          setOpenNftImageEditorModal(false)
        }}
        dimension={{ value: [1080, 320] }}
      />
    </div>
  )
}

export default MainSection

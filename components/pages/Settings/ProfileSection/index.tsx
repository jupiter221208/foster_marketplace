import React, { useMemo, useRef, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { useWallet } from '@solana/wallet-adapter-react'
import { getShortAddress } from 'utils/wallet.util'

// custom components
import OutlineButton from 'components/Button/OutlineButton'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import IconButton from 'components/Button/IconButton'
import CopyWalletInput from 'components/Input/CopyWalletInput'
import GradientButton from 'components/Button/GradientButton'
import Alert from 'components/Alert'

// images and icons
import Avatar from 'assets/images/dashboard-avatar.png'
import EditorGreenIcon from 'assets/icons/editor-green.svg'
import InstagramWhiteIcon from 'assets/icons/instagram-white.svg'
import DiscordWhiteIcon from 'assets/icons/discord-white.svg'
import TwitterWhiteIcon from 'assets/icons/twitter-white.svg'
import TelegramWhiteIcon from 'assets/icons/telegram-white.svg'
import ViewGreenIcon from 'assets/icons/view-green.svg'

// styles
import styles from './index.module.scss'
import { PublicKey } from '@solana/web3.js'

const ProfileSection = props => {
  const { viewport } = props

  const inputFile = useRef<any>(null)
  const [avatar, setAvatar] = useState<any>(Avatar)

  const { publicKey } = useWallet()
  const shortAddress = useMemo(() => getShortAddress(publicKey || '' as unknown as PublicKey), [publicKey])

  const [showAlert, setShowAlert] = useState<boolean>(false)

  const copyToClipboard = value => {
    navigator.clipboard.writeText(value)
    setShowAlert(true)
  }

  const handleChangeAvatar = event => {
    setAvatar(URL.createObjectURL(event.target.files[0]))
  }

  return (
    <div className={styles.container}>
      <div className="w-full hidden lg:flex justify-start">
        <div className={styles.title}>Profile</div>
      </div>
      <div className="w-full flex justify-center">
        <div className={styles.content}>
          <div className="w-full flex justify-center lg:justify-start lg:mt-12 mb-[20px] lg:mb-[22px]">
            <div className={styles.avatarArea}>
              <Image
                src={avatar}
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 90 : 251}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 90 : 251}
                alt=""
                className="rounded-full"
              />
            </div>
          </div>
          <div className="flex justify-center lg:justify-start">
            <div className="w-[250px]">
              <OutlineButton
                label="Change Profile Picture"
                icon={EditorGreenIcon}
                onClick={() => inputFile?.current?.click()}
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
            <Input placeholder="User name" />
          </div>
          <div className="mt-[10px] lg:mt-[30px] h-fit">
            <Textarea placeholder="Bio" width="100%" height="100%" />
          </div>
          <div className="mt-[10px] lg:mt-[30px]">
            <Input placeholder="Email Address" />
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
            <Input placeholder="Add Your Account" />
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
            <Input placeholder="Add Your Account" />
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
            <Input placeholder="Add Your Account" />
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
            <Input placeholder="Add Your Account" />
          </div>
          <div className="mt-[45px] lg:mt-[60px]">
            <div className={styles.subTitle}>Wallet</div>
          </div>
          <div className="mt-4 lg:mt-8">
            <CopyWalletInput
              value={shortAddress}
              placeholder="Add Your Account"
              disabled
              onClick={() => copyToClipboard(publicKey!.toString())}
            />
          </div>
          <div className="mt-[49px] lg:mt-[78px] mb-[188px] lg:mb-[158px] w-full flex justify-evenly items-center gap-6">
            <OutlineButton
              label="Preview"
              icon={ViewGreenIcon}
              onClick={() => {}}
              direction="rtl"
              fullWidth={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? true : false}
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '64px'}
              fontSize="16px"
              borderColor="#EFF0F6"
              paddingLeft={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '18px'}
              paddingRight={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '18px'}
            />
            <GradientButton
              label="Save"
              onClick={() => {}}
              fullWidth={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? true : false}
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '64px'}
              fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '16px' : '18px'}
              paddingLeft={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
              paddingRight={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
            />
          </div>
        </div>
      </div>
      {showAlert && (
        <Alert
          viewport={viewport}
          open={showAlert}
          close={() => {
            setShowAlert(false)
          }}
          title="Copied successfuly!"
          description="Wallet address is copied successfully!"
          type="success"
        />
      )}
    </div>
  )
}

export default ProfileSection

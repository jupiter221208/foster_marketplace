import React, { useMemo, useState } from 'react'

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

const ProfileSection = props => {
  const { viewport } = props

  const { publicKey } = useWallet()
  const shortAddress = useMemo(() => getShortAddress(publicKey), [publicKey])

  const copyToClipboard = value => {
    navigator.clipboard.writeText(value)
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>Profile</div>
      <div className="w-full flex justify-center">
        <div className={styles.content}>
          <div className="w-full flex justify-start mt-12 mb-[22px]">
            <div className={styles.avatarArea}>
              <Image src={Avatar} width={251} height={251} alt="" className="rounded-full" />
            </div>
          </div>
          <div className="w-[250px]">
            <OutlineButton
              label="Change Profile Picture"
              icon={EditorGreenIcon}
              onClick={() => {}}
              direction="rtl"
              fullWidth
              height="64px"
              fontSize="16px"
              borderColor="#EFF0F6"
            />
          </div>
          <div className="mt-[101px]">
            <div className={styles.subTitle}>Personal Info</div>
          </div>
          <div className="mt-8">
            <Input placeholder="User name" />
          </div>
          <div className="mt-[30px]">
            <Textarea placeholder="Bio" />
          </div>
          <div className="mt-[30px]">
            <Input placeholder="Email Address" />
          </div>
          <div className="mt-[60px]">
            <div className={styles.subTitle}>Social Connections & Links</div>
          </div>
          <div className="mt-8 flex items-center gap-6">
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
          <div className="mt-[30px] flex items-center gap-6">
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
          <div className="mt-[30px] flex items-center gap-6">
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
          <div className="mt-[30px] flex items-center gap-6">
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
          <div className="mt-[60px]">
            <div className={styles.subTitle}>Wallet</div>
          </div>
          <div className="mt-8">
            <CopyWalletInput
              value={shortAddress}
              placeholder="Add Your Account"
              disabled
              onClick={() => copyToClipboard(publicKey.toBase58())}
            />
          </div>
          <div className="mt-[78px] mb-[158px] w-full flex justify-evenly items-center">
            <OutlineButton
              label="Preview"
              icon={ViewGreenIcon}
              onClick={() => {}}
              direction="rtl"
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '64px'}
              fontSize="16px"
              borderColor="#EFF0F6"
              paddingLeft="18px"
              paddingRight="18px"
            />
            <GradientButton
              label="Save"
              onClick={() => {}}
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '64px'}
              fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '16px' : '18px'}
              paddingLeft="40px"
              paddingRight="40px"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSection

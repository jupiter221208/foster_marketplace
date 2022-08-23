import React, { Fragment, useMemo, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Menu, Transition } from '@headlessui/react'

// components
import Avatar from 'components/Avatar'
import IconButton from 'components/Button/IconButton'
import PriceInput from 'components/Input/PriceInput'
import GradientButton from 'components/Button/GradientButton'

// images and icons
import WalletGrayIcon from 'assets/icons/wallet-gray.svg'
import FosterLightGreenIcon from 'assets/icons/foster-light-green.svg'
import avatar from 'assets/images/avatar.jpg'
import ChangeWalletIcon from 'assets/icons/change-wallet.svg'
import DisconnectWalletIcon from 'assets/icons/disconnect-wallet.svg'
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'
import CopyAltLightGreenIcon from 'assets/icons/copy-alt-light-green.svg'
import EllipseGroupWhiteIcon from 'assets/icons/ellipse-group-white.svg'
import NounAddGrayIcon from 'assets/icons/noun-add-gray.svg'
import NounAddLightGreenIcon from 'assets/icons/noun-add-light-green.svg'
import NounSubtractGrayIcon from 'assets/icons/noun-subtract-gray.svg'
import NounSubtractLightGreenIcon from 'assets/icons/noun-subtract-light-green.svg'

// styles
import styles from './index.module.scss'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'

const WalletButton = props => {
  const { onClick, fullWidth = false } = props
  const { connected, publicKey } = useWallet()
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey])
  const address = useMemo(() => base58 && base58.slice(0, 4) + '..' + base58.slice(-4), [base58])

  const copyToClipboard = value => {
    navigator.clipboard.writeText(value)
  }

  const [showDeposit, setShowDeposit] = useState(false)
  const [status, setStatus] = useState('') // '': default; 'deposit': deposit; 'withdraw': withdraw
  const [price, setPrice] = useState(13.2)

  return connected ? (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className={styles.connectedContainer} style={{ width: fullWidth ? '100%' : '' }}>
            cGtKb.frm
            <Image src={WalletGrayIcon} alt="" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className={styles.menuItems}>
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <div className="w-full flex gap-3">
                    <Avatar avatar={avatar} width={36} height={36} />
                    <div className="block whitespace-nowrap">
                      <div className={styles.title}>Foster Username</div>
                      <div className={styles.grayText}>6A8rF .. Rf8p</div>
                    </div>
                  </div>
                )}
              </Menu.Item>
              <div className={styles.divider}></div>
              <Menu.Item>
                {({ active }) => (
                  <div className="w-full flex items-center cursor-pointer hover:opacity-80">
                    <Image src={ChangeWalletIcon} alt="" />
                    <div className={styles.whiteText}>Change wallet</div>
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div className="w-full flex items-center cursor-pointer hover:opacity-80">
                    <Image src={DisconnectWalletIcon} alt="" />
                    <div className={styles.whiteText}>Disconnect wallet</div>
                  </div>
                )}
              </Menu.Item>
              <div className={styles.divider}></div>
              <Menu.Item>
                {({ active }) => (
                  <div
                    className="w-full flex justify-between items-center cursor-pointer hover:opacity-80"
                    onClick={() => copyToClipboard('6A8rF .. Rf8p')}
                  >
                    <div className="block">
                      <div className={styles.whiteText}>Main wallet</div>
                      <div className="flex items-center gap-1">
                        <Image src={SolanaLogoIcon} alt="" />
                        <div className={styles.grayText}>12.00</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Image src={CopyAltLightGreenIcon} alt="" />
                      <div className={styles.grayCard}>
                        <div className={styles.lightGreenText}>6A8rF .. Rf8p</div>
                      </div>
                    </div>
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    className="w-full flex justify-between items-center cursor-pointer hover:opacity-80 mt-3"
                    onClick={() => copyToClipboard('G2t2K..ff4m')}
                  >
                    <div className="block">
                      <div className={styles.whiteText}>Bidding wallet</div>
                      <div className="flex items-center gap-1">
                        <Image src={SolanaLogoIcon} alt="" />
                        <div className={styles.grayText}>12.00</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Image src={CopyAltLightGreenIcon} alt="" />
                      <div className={styles.grayCard}>
                        <div className={styles.lightGreenText}>G2t2K..ff4m</div>
                      </div>
                    </div>
                  </div>
                )}
              </Menu.Item>
              <div className="w-full flex justify-end items-center cursor-pointer mt-3">
                <IconButton
                  icon={EllipseGroupWhiteIcon}
                  backgroundColor="transparent"
                  onClick={() => setShowDeposit(!showDeposit)}
                />
              </div>
              {showDeposit && (
                <div className={styles.walletCard}>
                  <div
                    className="w-full flex justify-start items-center gap-2 cursor-pointer"
                    onClick={() => setStatus('deposit')}
                  >
                    <Image src={status === 'deposit' ? NounAddLightGreenIcon : NounAddGrayIcon} alt="" />
                    <div className={status === 'deposit' ? styles.cardWhiteText : styles.cardGrayText}>
                      Deposit from Main Wallet
                    </div>
                  </div>
                  <div
                    className="w-full flex justify-start items-center gap-2 cursor-pointer"
                    onClick={() => setStatus('withdraw')}
                  >
                    <Image src={status === 'withdraw' ? NounSubtractLightGreenIcon : NounSubtractGrayIcon} alt="" />
                    <div className={status === 'withdraw' ? styles.cardWhiteText : styles.cardGrayText}>
                      Withdraw to Main Wallet
                    </div>
                  </div>
                </div>
              )}
              {showDeposit && (status === 'deposit' || status === 'withdraw') && (
                <div className="w-full flex flex-wrap mt-[14px] gap-1">
                  <div className="w-full text-end">
                    <div className={styles.lightGreenText}>New main wallet balance</div>
                  </div>
                  <div className="w-full flex justify-end gap-1">
                    <Image src={SolanaLogoIcon} alt="" />
                    <div className={styles.cardWhiteText}>110.00</div>
                  </div>
                  <div className="w-full text-end">
                    <div className={styles.lightGreenText}>New bidding wallet balance</div>
                  </div>
                  <div className="w-full flex justify-end gap-1">
                    <Image src={SolanaLogoIcon} alt="" />
                    <div className={styles.cardWhiteText}>25.00</div>
                  </div>
                  <div className="w-full flex justify-between gap-2">
                    <PriceInput value={price} onChange={value => setPrice(value)} height="30px" fontSize="12px" />
                    <GradientButton
                      label={status === 'deposit' ? 'Deposit' : 'Withdraw'}
                      height="30px"
                      fontSize="12px"
                      onClick={() => {}}
                    />
                  </div>
                </div>
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  ) : (
    <WalletMultiButton
      className={connected ? styles.connectedContainer : styles.container}
      style={{ width: fullWidth ? '100%' : '' }}
    >
      <div>{connected ? address : 'Connect Wallet'}</div>
      <Image src={connected ? WalletGrayIcon : FosterLightGreenIcon} alt="" />
    </WalletMultiButton>
  )
}

export default WalletButton

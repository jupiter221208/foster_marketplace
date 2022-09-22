import React, { useMemo, useState } from 'react'
// next components
import Image from 'next/image'

// third party components
import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { useWallet } from '@solana/wallet-adapter-react'
import { getShortAddress } from 'utils/wallet.util'

// components
import IconButton from 'components/Button/IconButton'
import PriceInput from 'components/Input/PriceInput'
import GradientButton from 'components/Button/GradientButton'

// images
import EllipseGreenKingsizeIcon from 'assets/icons/ellipse-green-kingsize.svg'
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
import { PublicKey } from '@solana/web3.js'

const MyWalletSubMenu = props => {
  const { icon, label, type = '', data, path = '' } = props

  const { publicKey, disconnect } = useWallet()
  const shortAddress = useMemo(() => getShortAddress(publicKey || '' as unknown as PublicKey), [publicKey])

  const copyToClipboard = value => {
    navigator.clipboard.writeText(value)
  }

  const [showDeposit, setShowDeposit] = useState(false)
  const [status, setStatus] = useState('') // '': default; 'deposit': deposit; 'withdraw': withdraw
  const [price, setPrice] = useState(13.2)

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className={styles.container}>
            <div className="flex items-center">
              {type === 'avatar' ? (
                <Image src={icon} width={40} height={40} className="rounded-full" objectFit="cover" alt="" />
              ) : (
                <Image src={icon} alt="" />
              )}
              <div className={styles.label}>{label}</div>
            </div>
            {data.length !== 0 && (
              <ChevronRightIcon
                className={`${open ? 'rotate-90 transform' : ''} h-6 w-6`}
                style={{ color: '#5AC3BA' }}
              />
            )}
          </Disclosure.Button>

          <Disclosure.Panel className="relative px-4 pt-4 pb-2 text-sm text-gray-500">
            <div className={styles.bgImage}>
              <Image src={EllipseGreenKingsizeIcon} width={549} height={1005} alt="" />
            </div>
            <div className={styles.menuItem}>
              <div className="w-full flex justify-start items-center cursor-pointer hover:opacity-80">
                <Image src={ChangeWalletIcon} alt="" width={50} height={50} />
                <div>Change Wallet</div>
              </div>
            </div>
            <div className={styles.menuItem}>
              <div
                className="w-full flex justify-start items-center cursor-pointer hover:opacity-80"
                onClick={disconnect}
              >
                <Image src={DisconnectWalletIcon} alt="" width={50} height={50} />
                <div>Disconnect Wallet</div>
              </div>
            </div>
            <div className={styles.menuItem}>
              <div
                className="w-full flex justify-between items-center cursor-pointer hover:opacity-80"
                onClick={() => copyToClipboard(publicKey.toString() || '')}
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
                    <div className={styles.lightGreenText}>{shortAddress}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.menuItem}>
              <div
                className="w-full flex justify-between items-center cursor-pointer hover:opacity-80 mt-3"
                onClick={() => copyToClipboard(publicKey.toString() || '')}
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
                    <div className={styles.lightGreenText}>{shortAddress}</div>
                  </div>
                </div>
              </div>
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
                    <PriceInput value={price} onChange={value => setPrice(value)} height="35px" fontSize="15px" />
                    <GradientButton
                      label={status === 'deposit' ? 'Deposit' : 'Withdraw'}
                      height="35px"
                      fontSize="15px"
                      onClick={() => {}}
                    />
                  </div>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default MyWalletSubMenu

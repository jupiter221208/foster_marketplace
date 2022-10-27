import React, { useMemo, useState, useEffect } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Menu, Transition } from '@headlessui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { getShortAddress } from 'utils/wallet.util'
import { PublicKey } from '@solana/web3.js'

// components
import Alert from 'components/Alert'
import Avatar from 'components/Avatar'
import IconButton from 'components/Button/IconButton'
import PriceInput from 'components/Input/PriceInput'
import GradientButton from 'components/Button/GradientButton'

// images and icons
import WalletGrayIcon from 'assets/icons/wallet-gray.svg'
import FosterLightGreenIcon from 'assets/icons/foster-light-green.svg'
import avatar from 'assets/icons/profile-thumb.svg'
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

// call apis
import authAPI from 'apis/auth'

const WalletButton = props => {
  const { fullWidth = false } = props

  const dispatch = useDispatch()

  const { connected, publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const shortAddress = useMemo(() => getShortAddress(publicKey || ('' as unknown as PublicKey)), [publicKey])

  const copyToClipboard = value => {
    navigator.clipboard.writeText(value)
  }

  const [showDeposit, setShowDeposit] = useState(false)
  const [status, setStatus] = useState('') // '': default; 'deposit': deposit; 'withdraw': withdraw
  const [price, setPrice] = useState(0)
  const [mainBalance, setMainBalance] = useState(120)
  const [biddingBalance, setBiddingBalance] = useState(12)
  const [newMainWallet, setNewMainWallet] = useState(120)
  const [newBiddingWallet, setNewBiddingWallet] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  const onChangePrice = value => {
    setErrorMessage('')
    setPrice(value)
    if (value.length === 0) {
      setNewMainWallet(0)
      setNewBiddingWallet(0)
      return
    }

    let price = parseFloat(value)
    if (price > mainBalance) {
      setErrorMessage('Not enough balance in the wallet')
      setNewMainWallet(0)
    } else {
      setNewMainWallet(mainBalance - price)
    }
    if (price + biddingBalance > mainBalance) {
      setErrorMessage('Not enough balance in the wallet')
      setNewBiddingWallet(0)
    } else {
      setNewBiddingWallet(price + biddingBalance)
    }
  }

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [buttonClicked, setButtonClicked] = useState(false)

  const profileInfo = useSelector(state => (state as any).profileInfo)
  const [profileName, setProfileName] = useState('')
  const [profileImage, setProfileImage] = useState('')

  useEffect(() => {
    if (!buttonClicked) {
      return
    }

    setButtonClicked(true)

    if (connected) {
      setAlertData([
        {
          id: 0,
          title: 'Wallet Connected!',
          description: `You've successfully connected your wallet!`,
          type: 'success',
        },
      ])
      setShowAlert(true)
    } else {
      setAlertData([
        {
          id: 0,
          title: 'Wallet Disconnected!',
          description: `You've successfully disconnected your wallet!`,
          type: 'success',
        },
      ])
      setShowAlert(true)
    }
  }, [connected])

  useEffect(() => {
    if (profileInfo) {
      if (profileInfo.username) {
        setProfileName(profileInfo.username)
      }
      if (profileInfo.profile_picture) {
        setProfileImage(profileInfo.profile_picture)
      }
    }
  }, [profileInfo])

  // handle login
  const handleLogin = () => {
    authAPI.login({ wallet_id: publicKey?.toBase58() || '' }).then(
      response => {
        if (response.new_user === true) {
          dispatch({ type: 'set', profileSetup: true })
        }
        dispatch({ type: 'set', profileInfo: response.user })
        setProfileImage(response.user.profile_picture)
        setProfileName(response.user.username)
      },
      error => {
        console.log(error)
      }
    )
  }

  return connected ? (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className={styles.connectedContainer} style={{ width: fullWidth ? '100%' : '' }}>
          {shortAddress}
          <Image src={WalletGrayIcon} alt="" />
        </Menu.Button>
      </div>
      <Transition
        as="div"
        className="relative"
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className={styles.menuBlur}>
          <div className={styles.menuArea}>
            <Menu.Item>
              {({ active }) => (
                <div className="w-full flex gap-3">
                  <Avatar avatar={profileImage.length > 0 ? profileImage : avatar} width={36} height={36} />
                  <div className="block whitespace-nowrap">
                    <div className={styles.title}>{profileName.length > 0 ? profileName : 'Username'}</div>
                    <div className={styles.grayText}>{shortAddress}</div>
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
                <div
                  className="w-full flex items-center cursor-pointer hover:opacity-80"
                  onClick={() => {
                    setButtonClicked(true)
                    disconnect()
                  }}
                >
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
                  onClick={() => copyToClipboard(publicKey?.toString() || '')}
                >
                  <div className="block">
                    <div className={styles.whiteText}>Main wallet</div>
                    <div className="flex items-center gap-1">
                      <Image src={SolanaLogoIcon} alt="" />
                      <div className={styles.grayText}>{mainBalance.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Image src={CopyAltLightGreenIcon} alt="" />
                    <div className={styles.grayCard}>
                      <div className={styles.lightGreenText}>{shortAddress}</div>
                    </div>
                  </div>
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                  className="w-full flex justify-between items-center cursor-pointer hover:opacity-80 mt-3"
                  onClick={() => copyToClipboard(publicKey?.toString() || '')}
                >
                  <div className="block">
                    <div className={styles.whiteText}>Bidding wallet</div>
                    <div className="flex items-center gap-1">
                      <Image src={SolanaLogoIcon} alt="" />
                      <div className={styles.grayText}>{biddingBalance.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Image src={CopyAltLightGreenIcon} alt="" />
                    <div className={styles.grayCard}>
                      <div className={styles.lightGreenText}>{shortAddress}</div>
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
                  <div className={styles.cardWhiteText}>{newMainWallet.toFixed(2)}</div>
                </div>
                <div className="w-full text-end">
                  <div className={styles.lightGreenText}>New bidding wallet balance</div>
                </div>
                <div className="w-full flex justify-end gap-1">
                  <Image src={SolanaLogoIcon} alt="" />
                  <div className={styles.cardWhiteText}>{newBiddingWallet.toFixed(2)}</div>
                </div>
                <div className="w-full flex justify-between gap-2 mt-1">
                  <PriceInput value={price} onChange={value => onChangePrice(value)} height="30px" fontSize="12px" />
                  <GradientButton
                    label={status === 'deposit' ? 'Deposit' : 'Withdraw'}
                    height="30px"
                    fontSize="12px"
                    onClick={() => {}}
                  />
                </div>
                {errorMessage.length > 0 && <div className={styles.errorMessage}>{errorMessage}</div>}
              </div>
            )}
          </div>
        </Menu.Items>
      </Transition>
      {/* connect wallet alert */}
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
          handleLogin()
        }}
        data={alertData}
      />
    </Menu>
  ) : (
    <div className="w-full">
      <button
        className={styles.container}
        onClick={() => {
          setButtonClicked(true)
          setVisible(true)
        }}
        style={{ width: fullWidth ? '100%' : '' }}
      >
        <div>Connect Wallet</div>
        <Image src={FosterLightGreenIcon} alt="" />
      </button>
      {/* disconnect wallet alert */}
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

export default WalletButton

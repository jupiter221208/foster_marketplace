import React, { useMemo, useState, useEffect } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

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

// solana
import { useMetaplex } from 'hooks/useMetaplex'
import {
  depositFunds as depositOfferFunds,
  withdrawFunds as withdrawOfferFunds,
  getEscrowPaymentAccount as getOfferEscrowAddress,
} from 'utils/auction.util'
import {
  depositFunds as depositBiddingFunds,
  withdrawFunds as withdrawBiddingFunds,
  getEscrowPaymentAccount as getBiddingEscrowAddress,
} from 'utils/auctioneer.util'
import { getPriceValue } from 'utils/strings'
import { useWallets } from 'hooks/useWallets'

const WalletButton = props => {
  const { fullWidth = false } = props
  const router = useRouter()
  const dispatch = useDispatch()

  const { connected, publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()

  const { mainBalance, offerBalance, biddingBalance, offerWalletAddress, biddingWalletAddress, updateSolBalance } =
    useWallets()

  const shortMainAddress = useMemo(() => getShortAddress(publicKey || ('' as unknown as PublicKey)), [publicKey])

  const copyToClipboard = value => {
    navigator.clipboard.writeText(value)
  }

  const [showOfferWallet, setShowOfferWallet] = useState(false)
  const [showBiddingWallet, setShowBiddingWallet] = useState(false)
  const [offerStatus, setOfferStatus] = useState('') // '': default; 'deposit': deposit; 'withdraw': withdraw
  const [biddingStatus, setBiddingStatus] = useState('') // '': default; 'deposit': deposit; 'withdraw': withdraw
  const [offerPrice, setOfferPrice] = useState(0)
  const [biddingPrice, setBiddingPrice] = useState(0)
  const [newMainWallet, setNewMainWallet] = useState(0)
  const [newOfferWallet, setNewOfferWallet] = useState(0)
  const [newBiddingWallet, setNewBiddingWallet] = useState(0)
  const [offerErrorMessage, setOfferErrorMessage] = useState('')
  const [biddingErrorMessage, setBiddingErrorMessage] = useState('')

  const shortOfferAddress = useMemo(
    () => getShortAddress(offerWalletAddress || ('' as unknown as PublicKey)),
    [offerWalletAddress]
  )
  const shortBiddingAddress = useMemo(
    () => getShortAddress(biddingWalletAddress || ('' as unknown as PublicKey)),
    [biddingWalletAddress]
  )

  const onChangeOfferPrice = value => {
    setOfferErrorMessage('')
    if (value.length === 0) {
      setOfferPrice(0)
      return
    }
    let price = parseFloat(value)
    setOfferPrice(price)
  }

  useEffect(() => {
    setOfferErrorMessage('')
    if (offerStatus === 'deposit') {
      if (offerPrice > mainBalance) {
        setOfferErrorMessage('Not enough balance in the wallet')
        setNewMainWallet(0)
        setNewOfferWallet(mainBalance + offerBalance)
      } else {
        setNewMainWallet(mainBalance - offerPrice)
        setNewOfferWallet(offerBalance + offerPrice)
      }
    }

    if (offerStatus === 'withdraw') {
      if (offerPrice > offerBalance) {
        setOfferErrorMessage('Not enough balance in the wallet')
        setNewMainWallet(mainBalance + offerBalance)
        setNewOfferWallet(0)
      } else {
        setNewMainWallet(mainBalance + offerPrice)
        setNewOfferWallet(offerBalance - offerPrice)
      }
    }
  }, [mainBalance, offerBalance, offerStatus, offerPrice])

  const onChangeBiddingPrice = value => {
    setBiddingErrorMessage('')
    if (value.length === 0) {
      setBiddingPrice(0)
      return
    }
    let price = parseFloat(value)
    setBiddingPrice(price)
  }

  useEffect(() => {
    setBiddingErrorMessage('')
    if (biddingStatus === 'deposit') {
      if (biddingPrice > mainBalance) {
        setOfferErrorMessage('Not enough balance in the wallet')
        setNewMainWallet(0)
        setNewBiddingWallet(mainBalance + biddingBalance)
      } else {
        setNewMainWallet(mainBalance - biddingPrice)
        setNewBiddingWallet(biddingBalance + biddingPrice)
      }
    }

    if (biddingStatus === 'withdraw') {
      if (biddingPrice > biddingBalance) {
        setOfferErrorMessage('Not enough balance in the wallet')
        setNewMainWallet(mainBalance + biddingBalance)
        setNewBiddingWallet(0)
      } else {
        setNewMainWallet(mainBalance + biddingPrice)
        setNewBiddingWallet(biddingBalance - biddingPrice)
      }
    }
  }, [mainBalance, biddingBalance, biddingStatus, biddingPrice])

  const { metaplex: mx } = useMetaplex()

  const onClickOfferButton = async () => {
    if (offerStatus === 'deposit') {
      await depositOfferFunds(mx, offerPrice)
    } else {
      await withdrawOfferFunds(mx, offerPrice)
    }
    setOfferPrice(0)
    await updateSolBalance()
  }

  const onClickBiddingButton = async () => {
    if (biddingStatus === 'deposit') {
      await depositBiddingFunds(mx, biddingPrice)
    } else {
      await withdrawBiddingFunds(mx, biddingPrice)
    }
    setBiddingPrice(0)
    await updateSolBalance()
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
        dispatch({ type: 'set', profileInfo: response.user })
        setProfileImage(response.user.profile_picture)
        setProfileName(response.user.username)
      },
      error => {
        console.log(error)
      }
    )
  }

  const handleDisconnect = () => {
    disconnect()
    localStorage.removeItem('token')
  }

  return connected ? (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className={styles.connectedContainer} style={{ width: fullWidth ? '100%' : '' }}>
          {shortMainAddress}
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
                  <Avatar avatar={profileImage !== null ? profileImage : avatar} width={36} height={36} />
                  <div className="block whitespace-nowrap">
                    <div className={styles.title}>{profileName.length > 0 ? profileName : 'Username'}</div>
                    <div className={styles.grayText}>{shortMainAddress}</div>
                  </div>
                </div>
              )}
            </Menu.Item>
            <div className={styles.divider}></div>
            <Menu.Item>
              {({ active }) => (
                <div className="w-full flex justify-between items-center">
                  <div className="block">
                    <div className={styles.whiteText}>Main wallet</div>
                    <div className="flex items-center gap-1">
                      <Image src={SolanaLogoIcon} alt="" />
                      <div className={styles.grayText}>{mainBalance.toFixed(2)}</div>
                    </div>
                  </div>
                  <div
                    className="flex gap-2 cursor-pointer hover:opacity-80"
                    onClick={() => copyToClipboard(publicKey?.toString() || '')}
                  >
                    <Image src={CopyAltLightGreenIcon} alt="" />
                    <div className={styles.grayCard}>
                      <div className={styles.greenText}>{shortMainAddress}</div>
                    </div>
                  </div>
                </div>
              )}
            </Menu.Item>
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
                    handleDisconnect()
                  }}
                >
                  <Image src={DisconnectWalletIcon} alt="" />
                  <div className={styles.whiteText}>Disconnect wallet</div>
                </div>
              )}
            </Menu.Item>
            <div className={styles.divider}></div>
            {/* offer wallet part */}
            <div className="w-full flex justify-between items-center mt-3">
              <div className="block">
                <div className={styles.whiteText}>Offer wallet</div>
                <div className="flex items-center gap-1">
                  <Image src={SolanaLogoIcon} alt="" />
                  <div className={styles.grayText}>{offerBalance.toFixed(2)}</div>
                </div>
              </div>
              <div
                className="flex gap-2 cursor-pointer hover:opacity-80"
                onClick={() => copyToClipboard(biddingWalletAddress?.toString() || '')}
              >
                <Image src={CopyAltLightGreenIcon} alt="" />
                <div className={styles.grayCard}>
                  <div className={styles.greenText}>{shortOfferAddress}</div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end items-center cursor-pointer mt-3">
              <IconButton
                icon={EllipseGroupWhiteIcon}
                backgroundColor="transparent"
                onClick={() => setShowOfferWallet(!showOfferWallet)}
              />
            </div>
            {showOfferWallet && (
              <div className={styles.walletCard}>
                <div
                  className="w-full flex justify-start items-center gap-2 cursor-pointer"
                  onClick={() => setOfferStatus('deposit')}
                >
                  <Image src={offerStatus === 'deposit' ? NounAddLightGreenIcon : NounAddGrayIcon} alt="" />
                  <div className={offerStatus === 'deposit' ? styles.cardWhiteText : styles.cardGrayText}>
                    Deposit from Main Wallet
                  </div>
                </div>
                <div
                  className="w-full flex justify-start items-center gap-2 cursor-pointer"
                  onClick={() => setOfferStatus('withdraw')}
                >
                  <Image src={offerStatus === 'withdraw' ? NounSubtractLightGreenIcon : NounSubtractGrayIcon} alt="" />
                  <div className={offerStatus === 'withdraw' ? styles.cardWhiteText : styles.cardGrayText}>
                    Withdraw to Main Wallet
                  </div>
                </div>
              </div>
            )}
            {showOfferWallet && (offerStatus === 'deposit' || offerStatus === 'withdraw') && (
              <div className="w-full flex flex-wrap mt-[14px] gap-1">
                <div className="w-full text-end">
                  <div className={styles.greenText}>New main wallet balance</div>
                </div>
                <div className="w-full flex justify-end gap-1">
                  <Image src={SolanaLogoIcon} alt="" />
                  <div className={styles.cardWhiteText}>{newMainWallet.toFixed(2)}</div>
                </div>
                <div className="w-full text-end">
                  <div className={styles.greenText}>New offer wallet balance</div>
                </div>
                <div className="w-full flex justify-end gap-1">
                  <Image src={SolanaLogoIcon} alt="" />
                  <div className={styles.cardWhiteText}>{newOfferWallet.toFixed(2)}</div>
                </div>
                <div className="w-full flex justify-between gap-2 mt-1">
                  <PriceInput onChange={value => onChangeOfferPrice(value)} height="30px" fontSize="12px" />
                  <GradientButton
                    label={offerStatus === 'deposit' ? 'Deposit' : 'Withdraw'}
                    height="30px"
                    fontSize="12px"
                    onClick={() => onClickOfferButton()}
                  />
                </div>
                {offerErrorMessage.length > 0 && <div className={styles.errorMessage}>{offerErrorMessage}</div>}
              </div>
            )}
            {/* bidding wallet part */}
            <div className="w-full flex justify-between items-center mt-3">
              <div className="block">
                <div className={styles.whiteText}>Bidding wallet</div>
                <div className="flex items-center gap-1">
                  <Image src={SolanaLogoIcon} alt="" />
                  <div className={styles.grayText}>{biddingBalance.toFixed(2)}</div>
                </div>
              </div>
              <div
                className="flex gap-2 cursor-pointer hover:opacity-80"
                onClick={() => copyToClipboard(biddingWalletAddress?.toString() || '')}
              >
                <Image src={CopyAltLightGreenIcon} alt="" />
                <div className={styles.grayCard}>
                  <div className={styles.greenText}>{shortBiddingAddress}</div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end items-center cursor-pointer mt-3">
              <IconButton
                icon={EllipseGroupWhiteIcon}
                backgroundColor="transparent"
                onClick={() => setShowBiddingWallet(!showBiddingWallet)}
              />
            </div>
            {showBiddingWallet && (
              <div className={styles.walletCard}>
                <div
                  className="w-full flex justify-start items-center gap-2 cursor-pointer"
                  onClick={() => setBiddingStatus('deposit')}
                >
                  <Image src={biddingStatus === 'deposit' ? NounAddLightGreenIcon : NounAddGrayIcon} alt="" />
                  <div className={biddingStatus === 'deposit' ? styles.cardWhiteText : styles.cardGrayText}>
                    Deposit from Main Wallet
                  </div>
                </div>
                <div
                  className="w-full flex justify-start items-center gap-2 cursor-pointer"
                  onClick={() => setBiddingStatus('withdraw')}
                >
                  <Image
                    src={biddingStatus === 'withdraw' ? NounSubtractLightGreenIcon : NounSubtractGrayIcon}
                    alt=""
                  />
                  <div className={biddingStatus === 'withdraw' ? styles.cardWhiteText : styles.cardGrayText}>
                    Withdraw to Main Wallet
                  </div>
                </div>
              </div>
            )}
            {showBiddingWallet && (biddingStatus === 'deposit' || biddingStatus === 'withdraw') && (
              <div className="w-full flex flex-wrap mt-[14px] gap-1">
                <div className="w-full text-end">
                  <div className={styles.greenText}>New main wallet balance</div>
                </div>
                <div className="w-full flex justify-end gap-1">
                  <Image src={SolanaLogoIcon} alt="" />
                  <div className={styles.cardWhiteText}>{newMainWallet.toFixed(2)}</div>
                </div>
                <div className="w-full text-end">
                  <div className={styles.greenText}>New bidding wallet balance</div>
                </div>
                <div className="w-full flex justify-end gap-1">
                  <Image src={SolanaLogoIcon} alt="" />
                  <div className={styles.cardWhiteText}>{newBiddingWallet.toFixed(2)}</div>
                </div>
                <div className="w-full flex justify-between gap-2 mt-1">
                  <PriceInput onChange={value => onChangeBiddingPrice(value)} height="30px" fontSize="12px" />
                  <GradientButton
                    label={biddingStatus === 'deposit' ? 'Deposit' : 'Withdraw'}
                    height="30px"
                    fontSize="12px"
                    onClick={() => onClickBiddingButton()}
                  />
                </div>
                {biddingErrorMessage.length > 0 && <div className={styles.errorMessage}>{biddingErrorMessage}</div>}
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
          router.push('/')
          setShowAlert(false)
        }}
        data={alertData}
      />
    </div>
  )
}

export default WalletButton

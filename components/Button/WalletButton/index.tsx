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
import PriceInput from 'components/Input/PriceInput'
import GradientButton from 'components/Button/GradientButton'

// images and icons
import WalletGrayIcon from 'assets/icons/wallet-gray.svg?component'

import avatar from 'assets/images/dashboard-avatar.png'
import SolanaLogoGreenIcon from 'assets/icons/solana-logo-green-mobile.svg?component'
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import CopyAltLightGreenIcon from 'assets/icons/copy-alt-dark.svg?component'
import EllipseGroupWhiteIcon from 'assets/icons/ellipse-group-white.svg'

// styles
import styles from './index.module.scss'

// call apis

// solana
import { useMetaplex } from 'hooks/useMetaplex'
import { depositFunds as depositOfferFunds, withdrawFunds as withdrawOfferFunds } from 'utils/auction.util'
import { depositFunds as depositBiddingFunds, withdrawFunds as withdrawBiddingFunds } from 'utils/auctioneer.util'
import { useWallets } from 'hooks/useWallets'
import { copyClipboardAlert, copyToClipboard } from 'utils/helpers'
import CopyClipboardChip from 'components/Chip/CopyClipboardChip'

const WalletButton = props => {
  const { fullWidth = false } = props
  const router = useRouter()
  const dispatch = useDispatch()

  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()

  const { mainBalance, offerBalance, biddingBalance, offerWalletAddress, biddingWalletAddress, updateSolBalance } =
    useWallets()

  const shortMainAddress = useMemo(() => getShortAddress(publicKey || ('' as unknown as PublicKey)), [publicKey])

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
  const [isOfferLocked, setIsOfferLocked] = useState(false)
  const [isBidLocked, setIsBidLocked] = useState(false)
  const [walletAmount, setWalletAmount] = useState<any>()

  const errorMsg = 'Insufficient Funds in Wallet'

  const shortOfferAddress = useMemo(
    () => getShortAddress(offerWalletAddress || ('' as unknown as PublicKey)),
    [offerWalletAddress]
  )
  const shortBiddingAddress = useMemo(
    () => getShortAddress(biddingWalletAddress || ('' as unknown as PublicKey)),
    [biddingWalletAddress]
  )

  const onChangeOfferPrice = value => {
    if (value < 0) {
      setOfferPrice(0)
      setWalletAmount(0)
      return
    }
    if (value.length === 0) {
      setOfferPrice(0)
      setWalletAmount('')
      return
    }
    let price = parseFloat(value)
    setOfferPrice(price)
    setWalletAmount(price)
  }

  useEffect(() => {
    setOfferErrorMessage('')
    if (offerStatus === 'deposit') {
      if (offerPrice > mainBalance) {
        setOfferErrorMessage(errorMsg)
        setNewMainWallet(0)
        setNewOfferWallet(mainBalance + offerBalance)
        setIsOfferLocked(true)
      } else {
        setNewMainWallet(mainBalance - offerPrice)
        setNewOfferWallet(offerBalance + offerPrice)
        setIsOfferLocked(false)
      }
    }

    if (offerStatus === 'withdraw') {
      if (offerPrice > offerBalance - offerWalletLock) {
        setOfferErrorMessage(errorMsg)
        setNewMainWallet(mainBalance + offerBalance)
        setNewOfferWallet(0)
        setIsOfferLocked(true)
      } else {
        setNewMainWallet(mainBalance + offerPrice)
        setNewOfferWallet(offerBalance - offerPrice)
        setIsOfferLocked(false)
      }
    }
  }, [mainBalance, offerBalance, offerStatus, offerPrice])

  const onChangeBiddingPrice = value => {
    if (value < 0) {
      setBiddingPrice(0)
      setWalletAmount(0)
      return
    }
    if (value.length === 0) {
      setBiddingPrice(0)
      setWalletAmount('')
      return
    }
    let price = parseFloat(value)
    setBiddingPrice(price)
    setWalletAmount(price)
  }

  useEffect(() => {
    setBiddingErrorMessage('')
    if (biddingStatus === 'deposit') {
      if (biddingPrice > mainBalance) {
        setBiddingErrorMessage(errorMsg)
        setNewMainWallet(0)
        setNewBiddingWallet(mainBalance + biddingBalance)
        setIsBidLocked(true)
      } else {
        setNewMainWallet(mainBalance - biddingPrice)
        setNewBiddingWallet(biddingBalance + biddingPrice)
        setIsBidLocked(false)
      }
    }

    if (biddingStatus === 'withdraw') {
      if (biddingPrice > biddingBalance - bidWalletLock) {
        setBiddingErrorMessage(errorMsg)
        setNewMainWallet(mainBalance + biddingBalance)
        setNewBiddingWallet(0)
        setIsBidLocked(true)
      } else {
        setNewMainWallet(mainBalance + biddingPrice)
        setNewBiddingWallet(biddingBalance - biddingPrice)
        setIsBidLocked(false)
      }
    }
  }, [mainBalance, biddingBalance, biddingStatus, biddingPrice])

  const { metaplex: mx } = useMetaplex()

  const onClickOfferButton = async () => {
    if (offerPrice === 0) return
    if (offerStatus === 'deposit') {
      await depositOfferFunds(mx, offerPrice)
    } else {
      await withdrawOfferFunds(mx, offerPrice)
    }
    setOfferPrice(0)
    setWalletAmount('')
    await updateSolBalance()
  }

  const onClickBiddingButton = async () => {
    if (biddingPrice === 0) return
    if (biddingStatus === 'deposit') {
      await depositBiddingFunds(mx, biddingPrice)
    } else {
      await withdrawBiddingFunds(mx, biddingPrice)
    }
    setBiddingPrice(0)
    setWalletAmount('')
    await updateSolBalance()
  }

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [buttonClicked, setButtonClicked] = useState(false)

  const profileInfo = useSelector(state => (state as any).profileInfo)
  const bidWalletLock = useSelector(state => (state as any).bidWalletLock)
  const offerWalletLock = useSelector(state => (state as any).offerWalletLock)

  const [profileName, setProfileName] = useState('')
  const [profileImage, setProfileImage] = useState('')

  useEffect(() => {
    if (!buttonClicked) {
      return
    }

    setButtonClicked(false)

    if (connected) {
      setAlertData([
        {
          id: 0,
          title: 'Wallet Connected!',
          description: `You've successfully connected your wallet!`,
          type: 'success',
        },
      ])
      setTimeout(() => {
        setShowAlert(true)
      }, 1000)
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

  return connected ? (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className={styles.connectedContainer} style={{ width: fullWidth ? '100%' : '' }}>
          {shortMainAddress}
          {/* <Image src={WalletGrayIcon} alt="" /> */}
          <WalletGrayIcon width="20" height="18" alt="" />
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
                  <Avatar avatar={profileImage !== '' ? profileImage : avatar} width={36} height={36} />
                  <div className="block whitespace-nowrap">
                    <div className={styles.title}>{profileName.length > 0 ? profileName : 'Username'}</div>
                    <div className={styles.grayText}>{shortMainAddress}</div>
                  </div>
                </div>
              )}
            </Menu.Item>
            <div className={styles.divider}></div>
            {/* main wallet part */}
            <div className="w-full">
              <div className="w-full flex justify-between">
                <div className={styles.whiteText}>Main wallet</div>
                <div className="flex items-center gap-[4px]">
                  <SolanaLogoIcon />
                  <div className={styles.priceText}>{mainBalance.toFixed(2)}</div>
                </div>
              </div>

              <div className="w-full flex justify-between items-center mt-[8px]">
                <div
                  className="relative flex gap-2 items-center cursor-pointer hover:opacity-80"
                  onClick={() => {
                    copyToClipboard(publicKey?.toString() || '')
                    copyClipboardAlert('main-wallet')
                  }}
                >
                  <CopyAltLightGreenIcon />
                  <div className={styles.grayCard}>
                    <div className={styles.greenText}>{shortMainAddress}</div>
                  </div>
                  <CopyClipboardChip identifier="main-wallet" height={24} fontSize={14} />
                </div>
                {/* <div
                  className="flex justify-end pt-[6px] py-2 cursor-pointer"
                  onClick={() => setShowMainWallet(!showMainWallet)}
                >
                  <Image src={EllipseGroupWhiteIcon} />
                </div> */}
              </div>
            </div>
            {/* {showMainWallet && (
              <div className="w-full flex flex-wrap">
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
              </div>
            )} */}
            {/* offer wallet part */}
            <div className="w-full my-3">
              <div className="w-full flex justify-between">
                <div className={styles.whiteText}>Offer wallet</div>
                <div className="flex items-center gap-1">
                  <SolanaLogoIcon />
                  <div className={styles.priceText}>{offerBalance.toFixed(2)}</div>
                </div>
              </div>
              <div className="w-full flex justify-between items-center mt-[8px]">
                <div
                  className="relative flex gap-2 items-center cursor-pointer hover:opacity-80"
                  onClick={() => {
                    copyToClipboard(offerWalletAddress?.toString() || '')
                    copyClipboardAlert('offer-wallet')
                  }}
                >
                  <div className="w-[16px] h-[18px]">
                    <CopyAltLightGreenIcon />
                  </div>
                  <div className={styles.grayCard}>
                    <div className={styles.greenText}>{shortOfferAddress}</div>
                  </div>
                  <CopyClipboardChip identifier="offer-wallet" height={24} fontSize={14} />
                </div>
                <div
                  className="w-full flex justify-end cursor-pointer py-2"
                  onClick={() => {
                    setShowOfferWallet(!showOfferWallet)
                    setShowBiddingWallet(false)
                  }}
                >
                  <Image src={EllipseGroupWhiteIcon} />
                </div>
              </div>
            </div>
            <div className={styles.depositWithdraw}>
              {showOfferWallet && (
                <div className={styles.walletCard}>
                  <div
                    className="w-full flex justify-start items-center gap-2 cursor-pointer"
                    onClick={() => {
                      if (offerStatus === 'deposit') setOfferStatus('')
                      else setOfferStatus('deposit')

                      setWalletAmount('')
                      setOfferPrice(0)
                      setOfferErrorMessage('')
                    }}
                  >
                    {offerStatus === 'deposit' ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16.167"
                        height="16.167"
                        viewBox="0 0 16.167 16.167"
                      >
                        <path
                          id="noun-add-1241915-EFF0F6"
                          d="M0,8.083,8.083,0l8.083,8.083L8.083,16.167ZM2.653,6.628H6.628V2.653H9.539V6.628h3.975V9.539H9.539v3.975H6.628V9.539H2.653Z"
                          fill="var(--deposit-icon-bg)"
                          fillRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16.167"
                        height="16.167"
                        viewBox="0 0 16.167 16.167"
                      >
                        <path
                          id="noun-add-1241915-EFF0F6"
                          d="M0,8.083,8.083,0l8.083,8.083L8.083,16.167ZM2.653,6.628H6.628V2.653H9.539V6.628h3.975V9.539H9.539v3.975H6.628V9.539H2.653Z"
                          fill="#eff0f6"
                          opacity="0.8"
                          fillRule="evenodd"
                        />
                      </svg>
                    )}
                    <div className={offerStatus === 'deposit' ? styles.cardWhiteText : styles.cardGrayText}>
                      Deposit from Main Wallet
                    </div>
                  </div>
                  <div
                    className="w-full flex justify-start items-center gap-2 cursor-pointer mt-[8px]"
                    onClick={() => {
                      if (offerStatus === 'withdraw') setOfferStatus('')
                      else setOfferStatus('withdraw')
                      setWalletAmount('')
                      setOfferPrice(0)
                      setOfferErrorMessage('')
                    }}
                  >
                    {offerStatus === 'withdraw' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                        <path
                          id="noun-subtract-497509-EFF0F6"
                          d="M13.5,6.8a7,7,0,1,0,7,7,7,7,0,0,0-7-7Zm-6.011,7H7.327A6.183,6.183,0,0,1,13.5,7.627v.162A6.01,6.01,0,0,0,7.489,13.8Zm1.491-1.118H18v2.252H8.979ZM13.5,19.975v-.162A6.01,6.01,0,0,0,19.512,13.8h.162A6.183,6.183,0,0,1,13.5,19.975Z"
                          transform="translate(-6.5 -6.801)"
                          fill="var(--deposit-icon-bg)"
                        />
                        <path
                          id="noun-subtract-497509-EFF0F6"
                          d="M13.5,6.8a7,7,0,1,0,7,7,7,7,0,0,0-7-7Zm-6.011,7H7.327A6.183,6.183,0,0,1,13.5,7.627v.162A6.01,6.01,0,0,0,7.489,13.8Zm1.491-1.118H18v2.252H8.979ZM13.5,19.975v-.162A6.01,6.01,0,0,0,19.512,13.8h.162A6.183,6.183,0,0,1,13.5,19.975Z"
                          transform="translate(-6.5 -6.801)"
                          fill="var(--deposit-icon-bg)"
                        />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                        <path
                          id="noun-subtract-497509-EFF0F6"
                          d="M13.5,6.8a7,7,0,1,0,7,7,7,7,0,0,0-7-7Zm-6.011,7H7.327A6.183,6.183,0,0,1,13.5,7.627v.162A6.01,6.01,0,0,0,7.489,13.8Zm1.491-1.118H18v2.252H8.979ZM13.5,19.975v-.162A6.01,6.01,0,0,0,19.512,13.8h.162A6.183,6.183,0,0,1,13.5,19.975Z"
                          transform="translate(-6.5 -6.801)"
                          fill="#eff0f6"
                          opacity="0.8"
                        />
                      </svg>
                    )}
                    <div className={offerStatus === 'withdraw' ? styles.cardWhiteText : styles.cardGrayText}>
                      Withdraw to Main Wallet
                    </div>
                  </div>
                </div>
              )}
              {showOfferWallet && (offerStatus === 'deposit' || offerStatus === 'withdraw') && (
                <div className="w-full flex flex-wrap mt-[14px] gap-1 px-4">
                  <div className="w-full flex justify-between itmes-center">
                    <div className="">
                      <div className={styles.subText}>
                        {offerStatus === 'deposit' ? 'New Main Wallet Balance' : 'Offer Wallet Balance Lockup'}
                      </div>
                    </div>
                    <div className="flex gap-1 items-center">
                      <SolanaLogoGreenIcon />
                      <div className={styles.cardWhiteText}>
                        {offerStatus === 'deposit' ? newMainWallet.toFixed(2) : offerWalletLock?.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex justify-between itmes-center mt-1">
                    <div className="">
                      <div className={styles.subText}>
                        {offerStatus === 'deposit' ? 'New Offer Wallet Balance' : 'Available Offer Wallet Balance'}
                      </div>
                    </div>
                    <div className="flex gap-1 items-center">
                      <SolanaLogoGreenIcon />
                      <div className={styles.cardWhiteText}>
                        {offerStatus === 'deposit'
                          ? newOfferWallet.toFixed(2)
                          : (offerBalance - offerWalletLock - offerPrice >= 0
                              ? offerBalance - offerWalletLock - offerPrice
                              : 0
                            ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full mt-[20px]">
                    <PriceInput
                      value={walletAmount}
                      onChange={value => {
                        onChangeOfferPrice(value)
                      }}
                      onMax={() => {
                        if (offerStatus === 'deposit') {
                          setWalletAmount(mainBalance)
                          onChangeOfferPrice(mainBalance)
                        } else {
                          setWalletAmount((offerBalance - offerWalletLock).toFixed(2))
                          onChangeOfferPrice((offerBalance - offerWalletLock).toFixed(2))
                        }
                      }}
                      placeholder={offerStatus === 'deposit' ? 'Enter deposit amount' : 'Enter withdrawal amount'}
                      height="50px"
                      fontSize="16px"
                      backgroundColor="#2B2F32"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      borderRadius="6px"
                      paddingLeft="10px"
                      paddingRight="10px"
                      showMax={true}
                    />
                  </div>
                  {offerErrorMessage.length > 0 && <div className={styles.errorMessage}>{offerErrorMessage}</div>}
                  <div className="w-full mt-1">
                    {isOfferLocked ? (
                      <GradientButton
                        label={offerStatus === 'deposit' ? 'Deposit' : 'Withdraw'}
                        fullWidth
                        height="53px"
                        fontSize="18px"
                        color="#CBCCD2"
                        backgroundColor01="#121212"
                        backgroundColor02="#121212"
                        gradientDirection="bottom"
                        borderRadius="15px"
                        borderColor="rgba(255, 255, 255, 0.1)"
                        onClick={() => {}}
                      />
                    ) : (
                      <GradientButton
                        label={offerStatus === 'deposit' ? 'Deposit' : 'Withdraw'}
                        fullWidth
                        height="53px"
                        fontSize="18px"
                        borderRadius="15px"
                        borderColor="rgba(255, 255, 255, 0.1)"
                        onClick={() => onClickOfferButton()}
                      />
                    )}
                  </div>
                  <div
                    className={styles.viewActiveOffer}
                    onClick={() => {
                      router.push(`/dashboard?tab=6`)
                      dispatch({ type: 'set', isLoading: true })
                    }}
                  >
                    View active offers
                  </div>
                </div>
              )}
            </div>

            {/* bidding wallet part */}
            <div className="w-full my-3">
              <div className="w-full flex justify-between">
                <div className={styles.whiteText}>Bidding wallet</div>
                <div className="flex items-center gap-1">
                  <SolanaLogoIcon />
                  <div className={styles.priceText}>{biddingBalance.toFixed(2)}</div>
                </div>
              </div>
              <div className="w-full flex justify-between items-center mt-[8px]">
                <div
                  className="relative flex gap-2 items-center cursor-pointer hover:opacity-80"
                  onClick={() => {
                    copyToClipboard(biddingWalletAddress?.toString() || '')
                    copyClipboardAlert('bidding-wallet')
                  }}
                >
                  <div className="w-[16px] h-[18px]">
                    <CopyAltLightGreenIcon />
                  </div>
                  <div className={styles.grayCard}>
                    <div className={styles.greenText}>{shortBiddingAddress}</div>
                  </div>
                  <CopyClipboardChip identifier="bidding-wallet" height={24} fontSize={14} />
                </div>
                <div
                  className="w-full flex justify-end py-2 cursor-pointer"
                  onClick={() => {
                    setShowBiddingWallet(!showBiddingWallet)
                    setShowOfferWallet(false)
                  }}
                >
                  <Image src={EllipseGroupWhiteIcon} />
                </div>
              </div>
            </div>
            <div className={styles.depositWithdraw}>
              {showBiddingWallet && (
                <div className={styles.walletCard}>
                  <div
                    className="w-full flex justify-start items-center gap-2 cursor-pointer"
                    onClick={() => {
                      if (biddingStatus === 'deposit') setBiddingStatus('')
                      else setBiddingStatus('deposit')
                      setWalletAmount('')
                      setBiddingPrice(0)
                      setBiddingErrorMessage('')
                    }}
                  >
                    {biddingStatus === 'deposit' ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16.167"
                        height="16.167"
                        viewBox="0 0 16.167 16.167"
                      >
                        <path
                          id="noun-add-1241915-EFF0F6"
                          d="M0,8.083,8.083,0l8.083,8.083L8.083,16.167ZM2.653,6.628H6.628V2.653H9.539V6.628h3.975V9.539H9.539v3.975H6.628V9.539H2.653Z"
                          fill="var(--deposit-icon-bg)" // 5AC3BA
                          fillRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16.167"
                        height="16.167"
                        viewBox="0 0 16.167 16.167"
                      >
                        <path
                          id="noun-add-1241915-EFF0F6"
                          d="M0,8.083,8.083,0l8.083,8.083L8.083,16.167ZM2.653,6.628H6.628V2.653H9.539V6.628h3.975V9.539H9.539v3.975H6.628V9.539H2.653Z"
                          fill="#eff0f6"
                          opacity="0.8"
                          fillRule="evenodd"
                        />
                      </svg>
                    )}
                    <div className={biddingStatus === 'deposit' ? styles.cardWhiteText : styles.cardGrayText}>
                      Deposit to Bidding Wallet
                    </div>
                  </div>
                  <div
                    className="w-full flex justify-start items-center gap-2 cursor-pointer mt-[16px]"
                    onClick={() => {
                      if (biddingStatus === 'withdraw') setBiddingStatus('')
                      else setBiddingStatus('withdraw')
                      setWalletAmount('')
                      setBiddingPrice(0)
                      setBiddingErrorMessage('')
                    }}
                  >
                    {biddingStatus === 'withdraw' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                        <path
                          id="noun-subtract-497509-EFF0F6"
                          d="M13.5,6.8a7,7,0,1,0,7,7,7,7,0,0,0-7-7Zm-6.011,7H7.327A6.183,6.183,0,0,1,13.5,7.627v.162A6.01,6.01,0,0,0,7.489,13.8Zm1.491-1.118H18v2.252H8.979ZM13.5,19.975v-.162A6.01,6.01,0,0,0,19.512,13.8h.162A6.183,6.183,0,0,1,13.5,19.975Z"
                          transform="translate(-6.5 -6.801)"
                          fill="var(--deposit-icon-bg)"
                        />
                        <path
                          id="noun-subtract-497509-EFF0F6"
                          d="M13.5,6.8a7,7,0,1,0,7,7,7,7,0,0,0-7-7Zm-6.011,7H7.327A6.183,6.183,0,0,1,13.5,7.627v.162A6.01,6.01,0,0,0,7.489,13.8Zm1.491-1.118H18v2.252H8.979ZM13.5,19.975v-.162A6.01,6.01,0,0,0,19.512,13.8h.162A6.183,6.183,0,0,1,13.5,19.975Z"
                          transform="translate(-6.5 -6.801)"
                          fill="var(--deposit-icon-bg)"
                        />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                        <path
                          id="noun-subtract-497509-EFF0F6"
                          d="M13.5,6.8a7,7,0,1,0,7,7,7,7,0,0,0-7-7Zm-6.011,7H7.327A6.183,6.183,0,0,1,13.5,7.627v.162A6.01,6.01,0,0,0,7.489,13.8Zm1.491-1.118H18v2.252H8.979ZM13.5,19.975v-.162A6.01,6.01,0,0,0,19.512,13.8h.162A6.183,6.183,0,0,1,13.5,19.975Z"
                          transform="translate(-6.5 -6.801)"
                          fill="#eff0f6"
                          opacity="0.8"
                        />
                      </svg>
                    )}
                    <div className={biddingStatus === 'withdraw' ? styles.cardWhiteText : styles.cardGrayText}>
                      Withdraw to Main Wallet
                    </div>
                  </div>
                </div>
              )}
              {showBiddingWallet && (biddingStatus === 'deposit' || biddingStatus === 'withdraw') && (
                <div className="w-full flex flex-wrap mt-[14px] gap-1 px-4">
                  <div className="w-full flex justify-between items-center">
                    <div className="">
                      <div className={styles.subText}>
                        {biddingStatus === 'deposit' ? 'New Main Wallet Balance' : 'Bidding Wallet Balance Lockup'}
                      </div>
                    </div>
                    <div className="flex gap-1 items-center">
                      <SolanaLogoGreenIcon />
                      <div className={styles.cardWhiteText}>
                        {biddingStatus === 'deposit' ? newMainWallet.toFixed(2) : bidWalletLock.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-center mt-1">
                    <div className="">
                      <div className={styles.subText}>
                        {biddingStatus === 'deposit'
                          ? 'New Bidding Wallet Balance'
                          : 'Available Bidding Wallet Balance'}
                      </div>
                    </div>
                    <div className="flex gap-1 items-center">
                      <SolanaLogoGreenIcon />
                      <div className={styles.cardWhiteText}>
                        {biddingStatus === 'deposit'
                          ? newBiddingWallet.toFixed(2)
                          : (biddingBalance - bidWalletLock - biddingPrice >= 0
                              ? biddingBalance - bidWalletLock - biddingPrice
                              : 0
                            ).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full mt-[20px]">
                    <PriceInput
                      value={walletAmount}
                      onChange={value => onChangeBiddingPrice(value)}
                      onMax={() => {
                        if (biddingStatus === 'deposit') {
                          setWalletAmount(mainBalance)
                          onChangeBiddingPrice(mainBalance)
                        } else {
                          setWalletAmount((biddingBalance - bidWalletLock).toFixed(2))
                          onChangeBiddingPrice((biddingBalance - bidWalletLock).toFixed(2))
                        }
                      }}
                      placeholder={biddingStatus === 'deposit' ? 'Enter deposit amount' : 'Enter withdrawal amount'}
                      height="50px"
                      fontSize="16px"
                      backgroundColor="#2B2F32"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      borderRadius="6px"
                      paddingLeft="10px"
                      paddingRight="10px"
                      showMax={true}
                    />
                  </div>
                  {biddingErrorMessage.length > 0 && <div className={styles.errorMessage}>{biddingErrorMessage}</div>}

                  <div className="w-full mt-1">
                    {isBidLocked ? (
                      <GradientButton
                        label={biddingStatus === 'deposit' ? 'Deposit' : 'Withdraw'}
                        fullWidth
                        height="53px"
                        fontSize="18px"
                        color="#CBCCD2"
                        backgroundColor01="#121212"
                        backgroundColor02="#121212"
                        gradientDirection="bottom"
                        borderRadius="15px"
                        borderColor="rgba(255, 255, 255, 0.1)"
                        onClick={() => {}}
                      />
                    ) : (
                      <GradientButton
                        label={biddingStatus === 'deposit' ? 'Deposit' : 'Withdraw'}
                        fullWidth
                        height="53px"
                        fontSize="18px"
                        borderRadius="15px"
                        borderColor="rgba(255, 255, 255, 0.1)"
                        onClick={() => onClickBiddingButton()}
                      />
                    )}
                  </div>
                  <div
                    className={styles.viewActiveOffer}
                    onClick={() => {
                      router.push(`/dashboard?tab=2`)
                      dispatch({ type: 'set', isLoading: true })
                    }}
                  >
                    View active bids
                  </div>
                </div>
              )}
            </div>
          </div>
        </Menu.Items>
      </Transition>
      {/* connect wallet alert */}
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
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
        <svg xmlns="http://www.w3.org/2000/svg" width="17.216" height="15" viewBox="0 0 17.216 15">
          <path
            id="solanaLogoMark"
            d="M17.127,11.826,14.285,14.8a.66.66,0,0,1-.22.151A.675.675,0,0,1,13.8,15H.33a.336.336,0,0,1-.181-.053.324.324,0,0,1-.122-.141A.314.314,0,0,1,0,14.624a.318.318,0,0,1,.084-.165L2.933,11.49a.66.66,0,0,1,.219-.151.675.675,0,0,1,.262-.054H16.886a.337.337,0,0,1,.181.053.325.325,0,0,1,.122.141.314.314,0,0,1,.022.183A.319.319,0,0,1,17.127,11.826ZM14.285,5.847a.66.66,0,0,0-.22-.151.675.675,0,0,0-.263-.053H.33A.336.336,0,0,0,.149,5.7a.324.324,0,0,0-.122.141A.314.314,0,0,0,0,6.019a.318.318,0,0,0,.084.165L2.933,9.153a.66.66,0,0,0,.219.151.675.675,0,0,0,.262.053H16.886a.336.336,0,0,0,.181-.053.325.325,0,0,0,.122-.141.314.314,0,0,0,.022-.183.319.319,0,0,0-.084-.165ZM.33,3.714H13.8a.675.675,0,0,0,.263-.053.66.66,0,0,0,.22-.151L17.127.541a.319.319,0,0,0,.084-.165.314.314,0,0,0-.022-.183.325.325,0,0,0-.122-.141A.336.336,0,0,0,16.886,0H3.414a.675.675,0,0,0-.262.053A.66.66,0,0,0,2.933.2L.089,3.174a.318.318,0,0,0-.084.165.314.314,0,0,0,.022.182.324.324,0,0,0,.121.141A.336.336,0,0,0,.33,3.714Z"
            transform="translate(0)"
            fill="#95dbd5"
          />
        </svg>

        <div className="mb-1">Connect Wallet</div>
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

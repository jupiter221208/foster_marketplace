import React, { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// next components
import Image from 'next/image'

// third party components
import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { useDispatch, useSelector } from 'react-redux'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { getShortAddress } from 'utils/wallet.util'
import { PublicKey } from '@solana/web3.js'

// components
import Alert from 'components/Alert'
import PriceInput from 'components/Input/PriceInput'
import GradientButton from 'components/Button/GradientButton'

// images and icons
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
import { useWallets } from 'hooks/useWallets'

const MyWalletSubMenu = props => {
  const { icon, label, type = '', data } = props
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

  const [showMainWallet, setShowMainWallet] = useState(false)
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
  const bidWalletLock = useSelector(state => (state as any).bidWalletLock)
  const offerWalletLock = useSelector(state => (state as any).offerWalletLock)

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
        setOfferErrorMessage('Not enough balance in the wallet')
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
        setOfferErrorMessage('Not enough balance in the wallet')
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
    setBiddingErrorMessage('')
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
        setBiddingErrorMessage('Not enough balance in the wallet')
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
        setBiddingErrorMessage('Not enough balance in the wallet')
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

  useEffect(() => {
    if (!connected) {
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

  const handleDisconnect = () => {
    setShowAlert(true)
    disconnect()
    localStorage.removeItem('token')
    dispatch({ type: 'set', profileInfo: null })
  }

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className={open ? styles.openContainer : styles.container}>
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

          <Disclosure.Panel className="w-full relative px-4 pt-4 pb-2 text-sm text-gray-500">
            <div className="w-full">
              {/* main wallet part */}
              <div className="w-full flex justify-between">
                <div className="block">
                  <div className={styles.whiteText}>Main Wallet</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Image src={SolanaLogoIcon} alt="" width={15} height={15} />
                    <div className={styles.priceText}>{mainBalance.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex flex-wrap">
                  <div
                    className="w-full flex gap-2 justify-end items-center cursor-pointer hover:opacity-80"
                    onClick={() => copyToClipboard(publicKey?.toString() || '')}
                  >
                    <Image src={CopyAltLightGreenIcon} alt="" />
                    <div className={styles.grayCard}>
                      <div className={styles.greenText}>{shortMainAddress}</div>
                    </div>
                  </div>
                  <div
                    className="w-full flex justify-end py-4 cursor-pointer"
                    onClick={() => setShowMainWallet(!showMainWallet)}
                  >
                    <Image src={EllipseGroupWhiteIcon} />
                  </div>
                </div>
              </div>
              {showMainWallet && (
                <div className="w-full flex flex-wrap">
                  <div className="w-full flex items-center cursor-pointer hover:opacity-80">
                    <Image src={ChangeWalletIcon} alt="" />
                    <div className={styles.whiteText}>Change wallet</div>
                  </div>
                  <div
                    className="w-full flex items-center cursor-pointer hover:opacity-80"
                    onClick={() => {
                      handleDisconnect()
                    }}
                  >
                    <Image src={DisconnectWalletIcon} alt="" />
                    <div className={styles.whiteText}>Disconnect wallet</div>
                  </div>
                </div>
              )}
              {/* offer wallet part */}
              <div className="flex justify-between my-3">
                <div className="block">
                  <div className={styles.whiteText}>Offer Wallet</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Image src={SolanaLogoIcon} alt="" width={15} height={15} />
                    <div className={styles.priceText}>{offerBalance.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex flex-wrap">
                  <div
                    className="w-full flex gap-2 justify-end items-center cursor-pointer hover:opacity-80"
                    onClick={() => copyToClipboard(biddingWalletAddress?.toString() || '')}
                  >
                    <Image src={CopyAltLightGreenIcon} alt="" />
                    <div className={styles.grayCard}>
                      <div className={styles.greenText}>{shortOfferAddress}</div>
                    </div>
                  </div>
                  <div
                    className="w-full flex justify-end pt-4 cursor-pointer"
                    onClick={() => {
                      setShowOfferWallet(!showOfferWallet)
                      setShowBiddingWallet(false)
                    }}
                  >
                    <Image src={EllipseGroupWhiteIcon} />
                  </div>
                </div>
              </div>
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
                    <Image src={offerStatus === 'deposit' ? NounAddLightGreenIcon : NounAddGrayIcon} alt="" />
                    <div className={offerStatus === 'deposit' ? styles.cardWhiteText : styles.cardGrayText}>
                      Deposit from Main Wallet
                    </div>
                  </div>
                  <div
                    className="w-full flex justify-start items-center gap-2 cursor-pointer"
                    onClick={() => {
                      if (offerStatus === 'withdraw') setOfferStatus('')
                      else setOfferStatus('withdraw')
                      setWalletAmount('')
                      setOfferPrice(0)
                      setOfferErrorMessage('')
                    }}
                  >
                    <Image
                      src={offerStatus === 'withdraw' ? NounSubtractLightGreenIcon : NounSubtractGrayIcon}
                      alt=""
                    />
                    <div className={offerStatus === 'withdraw' ? styles.cardWhiteText : styles.cardGrayText}>
                      Withdraw to Main Wallet
                    </div>
                  </div>
                </div>
              )}
              {showOfferWallet && (offerStatus === 'deposit' || offerStatus === 'withdraw') && (
                <div className="w-full mt-[14px] gap-1">
                  <div className="w-full flex justify-between">
                    <div>
                      <div className={styles.subText}>
                        {offerStatus === 'deposit' ? 'New Main Wallet Balance' : 'Offer Wallet Balance Lockup'}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Image src={SolanaLogoIcon} alt="" width={15} height={15} />
                      <div className={styles.cardWhiteText}>
                        {offerStatus === 'deposit' ? newMainWallet.toFixed(2) : offerWalletLock?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex justify-between">
                    <div>
                      <div className={styles.subText}>
                        {offerStatus === 'deposit' ? 'New Offer Wallet Balance' : 'Available Offer Wallet Balance'}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Image src={SolanaLogoIcon} alt="" width={15} height={15} />
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
                  <div className="relative w-full mt-1">
                    <PriceInput
                      value={walletAmount}
                      onChange={value => onChangeOfferPrice(value)}
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
                      height="42px"
                      fontSize="12px"
                      backgroundColor="#242627"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      borderRadius="8px"
                      paddingLeft="10px"
                      paddingRight="10px"
                      showMax={true}
                    />
                  </div>
                  {offerErrorMessage.length > 0 && <div className={styles.errorMessage}>{offerErrorMessage}</div>}
                  <div className="w-full mt-2">
                    {isOfferLocked ? (
                      <GradientButton
                        label={offerStatus === 'deposit' ? 'Deposit' : 'Withdraw'}
                        fullWidth
                        height="42px"
                        fontSize="14px"
                        color="#CBCCD2"
                        backgroundColor01="#202427"
                        backgroundColor02="#202427"
                        gradientDirection="bottom"
                        borderRadius="6px"
                        borderColor="rgba(255, 255, 255, 0.1)"
                        onClick={() => {}}
                      />
                    ) : (
                      <GradientButton
                        label={offerStatus === 'deposit' ? 'Deposit' : 'Withdraw'}
                        fullWidth
                        height="42px"
                        fontSize="14px"
                        backgroundColor01="#2B4142"
                        backgroundColor02="#59BFB7"
                        gradientDirection="right"
                        borderRadius="6px"
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
              {/* bidding wallet part */}
              <div className="flex justify-between mt-6 mb-3">
                <div className="block">
                  <div className={styles.whiteText}>Bidding Wallet</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Image src={SolanaLogoIcon} alt="" width={15} height={15} />
                    <div className={styles.priceText}>{biddingBalance.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex flex-wrap">
                  <div
                    className="w-full flex gap-2 justify-end items-center cursor-pointer hover:opacity-80"
                    onClick={() => copyToClipboard(biddingWalletAddress?.toString() || '')}
                  >
                    <Image src={CopyAltLightGreenIcon} alt="" />
                    <div className={styles.grayCard}>
                      <div className={styles.greenText}>{shortBiddingAddress}</div>
                    </div>
                  </div>
                  <div
                    className="w-full flex justify-end pt-4 cursor-pointer"
                    onClick={() => {
                      setShowBiddingWallet(!showBiddingWallet)
                      setShowOfferWallet(false)
                    }}
                  >
                    <Image src={EllipseGroupWhiteIcon} />
                  </div>
                </div>
              </div>
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
                    <Image src={biddingStatus === 'deposit' ? NounAddLightGreenIcon : NounAddGrayIcon} alt="" />
                    <div className={biddingStatus === 'deposit' ? styles.cardWhiteText : styles.cardGrayText}>
                      Deposit from Main Wallet
                    </div>
                  </div>
                  <div
                    className="w-full flex justify-start items-center gap-2 cursor-pointer"
                    onClick={() => {
                      if (biddingStatus === 'withdraw') setBiddingStatus('')
                      else setBiddingStatus('withdraw')
                      setWalletAmount('')
                      setBiddingPrice(0)
                      setBiddingErrorMessage('')
                    }}
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
                <div className="w-full mt-[14px]">
                  <div className="w-full flex justify-between">
                    <div>
                      <div className={styles.subText}>
                        {biddingStatus === 'deposit' ? 'New Main Wallet Balance' : 'Bidding Wallet Balance Lockup'}
                      </div>
                    </div>
                    <div className="flex gap-1 mt-1">
                      <Image src={SolanaLogoIcon} alt="" width={15} height={15} />
                      <div className={styles.cardWhiteText}>
                        {biddingStatus === 'deposit' ? newMainWallet.toFixed(2) : bidWalletLock.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex justify-between">
                    <div className="">
                      <div className={styles.subText}>
                        {biddingStatus === 'deposit'
                          ? 'new Bidding Wallet Balance'
                          : 'Available Bidding Wallet Balance'}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Image src={SolanaLogoIcon} alt="" width={15} height={15} />
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
                      fullWidth
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
                      height="42px"
                      fontSize="12px"
                      backgroundColor="#242627"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      borderRadius="8px"
                      paddingLeft="10px"
                      paddingRight="10px"
                      showMax={true}
                    />
                  </div>
                  {biddingErrorMessage.length > 0 && <div className={styles.errorMessage}>{biddingErrorMessage}</div>}

                  <div className="w-full mt-2">
                    {isBidLocked ? (
                      <GradientButton
                        label={biddingStatus === 'deposit' ? 'Deposit' : 'Withdraw'}
                        fullWidth
                        height="42px"
                        fontSize="14px"
                        color="#CBCCD2"
                        backgroundColor01="#202427"
                        backgroundColor02="#202427"
                        gradientDirection="bottom"
                        borderRadius="6px"
                        borderColor="rgba(255, 255, 255, 0.1)"
                        onClick={() => {}}
                      />
                    ) : (
                      <GradientButton
                        label={biddingStatus === 'deposit' ? 'Deposit' : 'Withdraw'}
                        fullWidth
                        height="42px"
                        fontSize="14px"
                        backgroundColor01="#2B4142"
                        backgroundColor02="#59BFB7"
                        gradientDirection="right"
                        borderRadius="6px"
                        borderColor="rgba(255, 255, 255, 0.1)"
                        onClick={() => onClickBiddingButton()}
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
                    View active bids
                  </div>

                  {/* <div className="w-full flex flex-wrap mt-[14px] gap-1">
                    <p className={styles.cardGrayText}>
                      Insufficient balance. <a className="underline text-[#DEEFD0]">Learn more</a>
                    </p>
                  </div> */}
                </div>
              )}
            </div>
          </Disclosure.Panel>
          {/* disconnect wallet alert */}
          <Alert
            open={showAlert}
            close={() => {
              setShowAlert(false)
            }}
            data={alertData}
          />
        </>
      )}
    </Disclosure>
  )
}

export default MyWalletSubMenu

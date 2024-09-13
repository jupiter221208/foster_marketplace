import React, { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// next components

// third party components
import { Disclosure } from '@headlessui/react'
import { useSelector } from 'react-redux'
import { useWallet } from '@solana/wallet-adapter-react'
import { getShortAddress } from 'utils/wallet.util'
import { PublicKey } from '@solana/web3.js'

// components
import Alert from 'components/Alert'
import PriceInput from 'components/Input/PriceInput'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import SolanaLogoGreenIcon from 'assets/icons/solana-logo-green-mobile.svg?component'

import CopyAltLightGreenIcon from 'assets/icons/copy-alt-dark.svg?component'

// styles
import styles from './index.module.scss'

// solana
import { useMetaplex } from 'hooks/useMetaplex'
import { depositFunds as depositOfferFunds, withdrawFunds as withdrawOfferFunds } from 'utils/auction.util'
import { depositFunds as depositBiddingFunds, withdrawFunds as withdrawBiddingFunds } from 'utils/auctioneer.util'
import { useWallets } from 'hooks/useWallets'
import { copyClipboardAlert, copyToClipboard } from 'utils/helpers'
import CopyClipboardChip from 'components/Chip/CopyClipboardChip'
import ArrowRightWhiteIcon from 'assets/icons/arrow-right-white-medium.svg?component'
import ArrowDownWhiteIcon from 'assets/icons/arrow-down-white.svg?component'
import PrimaryButton from 'components/Button/PrimaryButton'
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'

const MyWalletSubMenu = props => {
  const { label, type = '', username } = props
  const router = useRouter()

  const { connected, publicKey, disconnect } = useWallet()

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
  const [isProcessing, setIsProcessing] = useState(false)

  const bidWalletLock = useSelector(state => (state as any).bidWalletLock)
  const offerWalletLock = useSelector(state => (state as any).offerWalletLock)

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
    let price = parseFloat(value)
    if (price < 0) {
      setOfferPrice(0)
      setWalletAmount(0)
      return
    }
    if (value.length === 0) {
      setOfferPrice(0)
      setWalletAmount('')
      return
    }
    setOfferPrice(price)
    setWalletAmount(value)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainBalance, offerBalance, offerStatus, offerPrice])

  const onChangeBiddingPrice = value => {
    let price = parseFloat(value)
    if (price < 0) {
      setBiddingPrice(0)
      setWalletAmount(0)
      return
    }
    if (value.length === 0) {
      setBiddingPrice(0)
      setWalletAmount('')
      return
    }
    setBiddingPrice(price)
    setWalletAmount(value)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainBalance, biddingBalance, biddingStatus, biddingPrice])

  const { metaplex: mx } = useMetaplex()

  const onClickOfferButton = async () => {
    if (offerPrice === 0) return
    try {
      setIsProcessing(true)
      let title = '',
        message = ''
      if (offerStatus === 'deposit') {
        await depositOfferFunds(mx, offerPrice)
        title = 'Deposit Success'
        message = `${offerPrice} SOL has been deposited to your offer wallet`
      } else {
        await withdrawOfferFunds(mx, offerPrice)
        title = 'Withdrawal Success'
        message = `${offerPrice} SOL has been withdrawn to your main wallet`
      }
      setWalletAmount('')
      await updateSolBalance()

      setAlertData([
        {
          id: 0,
          title: title,
          description: message,
          type: 'success',
        },
      ])
      setShowAlert(true)

      setOfferPrice(0)
      setIsProcessing(false)
    } catch {
      setIsProcessing(false)
    }
  }

  const onClickBiddingButton = async () => {
    if (biddingPrice === 0) return
    setIsProcessing(true)

    try {
      let title = '',
        message = ''

      if (biddingStatus === 'deposit') {
        await depositBiddingFunds(mx, biddingPrice)
        title = 'Deposit Success'
        message = `${biddingPrice} SOL has been deposited to your bidding wallet`
      } else {
        await withdrawBiddingFunds(mx, biddingPrice)
        title = 'Withdrawal Success'
        message = `${biddingPrice} SOL has been withdrawn to your main wallet`
      }
      await updateSolBalance()

      setBiddingPrice(0)
      setWalletAmount('')

      setAlertData([
        {
          id: 0,
          title: title,
          description: message,
          type: 'success',
        },
      ])
      setShowAlert(true)

      setIsProcessing(false)
    } catch {
      setIsProcessing(false)
    }
  }

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])

  useEffect(() => {
    if (!connected) {
      setAlertData([
        {
          id: 0,
          title: 'Wallet Disconnected4!',
          description: `You've successfully disconnected your wallet!`,
          type: 'success',
        },
      ])
      setShowAlert(true)
    }
  }, [connected])

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className={`${styles.container} ${open ? '' : styles.bottomBorder}`}>
            <div className="flex items-center">
              {/* <WalletIcon /> */}

              <div className={styles.label}>{label}</div>
            </div>
            {open ? <ArrowDownWhiteIcon /> : <ArrowRightWhiteIcon />}
          </Disclosure.Button>

          <Disclosure.Panel className={`w-full relative mt-[-4px] pb-2 text-sm text-gray-500 ${styles.bottomBorder}`}>
            <div className="w-full">
              {/* main wallet part */}
              <div className="w-full justify-between">
                <div className="w-full flex justify-between">
                  <div className={styles.whiteText}>Main Wallet</div>
                  <div className="flex items-center gap-1 mt-1">
                    <SolanaLogoIcon width={15} height={13} />
                    <div className={styles.priceText}>{mainBalance.toFixed(2)}</div>
                  </div>
                </div>
                <div className="w-full flex justify-between mt-[12px]">
                  <div
                    className="relative flex gap-2 items-center cursor-pointer hover:opacity-80"
                    onClick={() => {
                      copyToClipboard(publicKey?.toString() || '')
                      copyClipboardAlert('main-wallet')
                    }}
                  >
                    <div className="w-[16px] h-[18px]">
                      {/* <Image src={CopyAltLightGreenIcon} alt="" /> */}
                      <CopyAltLightGreenIcon />
                    </div>
                    <div className={styles.grayCard}>
                      <div className={styles.greenText}>{shortMainAddress}</div>
                    </div>
                    <CopyClipboardChip identifier="main-wallet" />
                  </div>
                </div>
              </div>

              {/* offer wallet part */}
              <div className="my-4">
                <div className="w-full flex justify-between">
                  <div className={styles.whiteText}>Offer Wallet</div>
                  <div className="flex items-center gap-1 mt-1">
                    <SolanaLogoIcon width={15} height={13} />
                    <div className={styles.priceText}>{offerBalance.toFixed(2)}</div>
                  </div>
                </div>
                <div className="w-full flex justify-between mt-[12px]">
                  <div
                    className="relative flex gap-2 justify-end items-center cursor-pointer hover:opacity-80"
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
                    <CopyClipboardChip identifier="offer-wallet" />
                  </div>
                  <div className="flex gap-[9px] items-center">
                    <div
                      className={offerStatus === 'deposit' ? styles.cardGrayText : styles.cardWhiteText}
                      onClick={() => {
                        if (offerStatus === 'deposit') {
                          setShowOfferWallet(false)
                          setOfferStatus('')
                        } else {
                          setShowOfferWallet(true)
                          setOfferStatus('deposit')
                        }
                        setShowBiddingWallet(false)
                        setBiddingStatus('')
                      }}
                    >
                      Deposit
                    </div>
                    <div className={styles.divider} />
                    <div
                      className={offerStatus === 'withdraw' ? styles.cardGrayText : styles.cardWhiteText}
                      onClick={() => {
                        if (offerStatus === 'withdraw') {
                          setShowOfferWallet(false)
                          setOfferStatus('')
                        } else {
                          setShowOfferWallet(true)
                          setOfferStatus('withdraw')
                        }
                        setShowBiddingWallet(false)
                        setBiddingStatus('')
                      }}
                    >
                      Withdraw
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.depositWithdraw}>
                {showOfferWallet && (
                  <div className={styles.walletCard}>
                    <div className={styles.cardTypeText}>
                      {offerStatus === 'withdraw' ? 'Withdraw to Main Wallet' : 'Deposit from Main Wallet'}
                    </div>
                  </div>
                )}
                {showOfferWallet && (offerStatus === 'deposit' || offerStatus === 'withdraw') && (
                  <div className="w-full gap-1 py-2">
                    <div className="w-full flex justify-between">
                      <div className={styles.subText}>
                        {offerStatus === 'deposit' ? 'New Main Wallet Balance' : 'Offer Balance Lockup'}
                      </div>

                      <div className="flex items-center gap-1">
                        <SolanaLogoGreenIcon width={15} height={13} />
                        <div className={styles.cardWhiteText}>
                          {offerStatus === 'deposit' ? newMainWallet.toFixed(2) : offerWalletLock?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-between mt-[15px]">
                      <div>
                        <div className={styles.subText}>
                          {offerStatus === 'deposit' ? 'New Offer Wallet Balance' : 'Available to Withdraw'}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <SolanaLogoGreenIcon width={15} height={13} />
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
                    <div className="relative w-full mt-[15px]">
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
                        borderColor="rgba(var(--main-bg-color-rgb), 0.1)"
                        borderRadius="8px"
                        paddingLeft="10px"
                        paddingRight="10px"
                        showMax={true}
                      />
                    </div>
                    {offerErrorMessage.length > 0 && <div className={styles.errorMessage}>{offerErrorMessage}</div>}
                    <div className="w-full mt-[10px]">
                      {isProcessing ? (
                        <LoadingPrimaryButton fullWidth />
                      ) : (
                        <PrimaryButton
                          label={offerStatus === 'deposit' ? 'Deposit' : 'Withdraw'}
                          type={offerStatus}
                          fullWidth
                          disabled={isOfferLocked || offerPrice === 0}
                          onClick={() => onClickOfferButton()}
                        />
                      )}
                    </div>
                    <div
                      className={styles.viewActiveOffer}
                      onClick={() => {
                        router.push(`/${username}?tab=3&filter=9`)
                      }}
                    >
                      View active offers
                    </div>
                  </div>
                )}
              </div>
              {/* bidding wallet part */}
              <div className="mt-4 mb-3">
                <div className="w-full flex justify-between">
                  <div className={styles.whiteText}>Bidding Wallet</div>
                  <div className="flex items-center gap-1 mt-1">
                    <SolanaLogoIcon width={15} height={13} />
                    <div className={styles.priceText}>{biddingBalance.toFixed(2)}</div>
                  </div>
                </div>
                <div className="w-full flex justify-between mt-[12px]">
                  <div
                    className="relative flex gap-2 justify-end items-center cursor-pointer hover:opacity-80"
                    onClick={() => {
                      copyToClipboard(biddingWalletAddress?.toString() || '')
                      copyClipboardAlert('bidding-wallet')
                    }}
                  >
                    <CopyAltLightGreenIcon />
                    <div className={styles.grayCard}>
                      <div className={styles.greenText}>{shortBiddingAddress}</div>
                    </div>
                    <CopyClipboardChip identifier="bidding-wallet" />
                  </div>
                  <div className="flex gap-[9px] items-center">
                    <div
                      className={biddingStatus === 'deposit' ? styles.cardGrayText : styles.cardWhiteText}
                      onClick={() => {
                        if (biddingStatus === 'deposit') {
                          setShowBiddingWallet(false)
                          setBiddingStatus('')
                        } else {
                          setShowBiddingWallet(true)
                          setBiddingStatus('deposit')
                        }
                        setShowOfferWallet(false)
                        setOfferStatus('')
                      }}
                    >
                      Deposit
                    </div>
                    <div className={styles.divider} />
                    <div
                      className={biddingStatus === 'withdraw' ? styles.cardGrayText : styles.cardWhiteText}
                      onClick={() => {
                        if (biddingStatus === 'withdraw') {
                          setShowBiddingWallet(false)
                          setBiddingStatus('')
                        } else {
                          setShowBiddingWallet(true)
                          setBiddingStatus('withdraw')
                        }

                        setShowOfferWallet(false)
                        setOfferStatus('')
                      }}
                    >
                      Withdraw
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.depositWithdraw}>
                {showBiddingWallet && (
                  <div className={styles.walletCard}>
                    <div className={styles.cardTypeText}>
                      {biddingStatus === 'withdraw' ? 'Withdraw to Main Wallet' : 'Deposit from Main Wallet'}
                    </div>
                  </div>
                )}
                {showBiddingWallet && (biddingStatus === 'deposit' || biddingStatus === 'withdraw') && (
                  <div className="w-full py-2">
                    <div className="w-full flex justify-between">
                      <div>
                        <div className={styles.subText}>
                          {biddingStatus === 'deposit' ? 'New Main Wallet Balance' : 'Bidding Balance Lockup'}
                        </div>
                      </div>
                      <div className="flex gap-1 mt-1 items-center">
                        <SolanaLogoGreenIcon width={15} height={13} />
                        <div className={styles.cardWhiteText}>
                          {biddingStatus === 'deposit' ? newMainWallet.toFixed(2) : bidWalletLock.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-between mt-[15px]">
                      <div className="">
                        <div className={styles.subText}>
                          {biddingStatus === 'deposit' ? 'New Bidding Wallet Balance' : 'Available to Withdraw'}
                        </div>
                      </div>
                      <div className="flex gap-1 items-center">
                        <SolanaLogoGreenIcon width={15} height={13} />
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
                        borderColor="rgba(var(--main-bg-color-rgb), 0.1)"
                        borderRadius="8px"
                        paddingLeft="10px"
                        paddingRight="10px"
                        showMax={true}
                      />
                    </div>
                    {biddingErrorMessage.length > 0 && <div className={styles.errorMessage}>{biddingErrorMessage}</div>}

                    <div className="w-full mt-[10px]">
                      {isProcessing ? (
                        <LoadingPrimaryButton fullWidth />
                      ) : (
                        <PrimaryButton
                          label={biddingStatus === 'deposit' ? 'Deposit' : 'Withdraw'}
                          type={biddingStatus}
                          fullWidth
                          disabled={isBidLocked || biddingPrice === 0}
                          onClick={() => onClickBiddingButton()}
                        />
                      )}
                    </div>
                    <div
                      className={styles.viewActiveOffer}
                      onClick={() => {
                        router.push(`/${username}?tab=2`)
                      }}
                    >
                      View active bids
                    </div>
                  </div>
                )}
              </div>
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

import React, { Fragment, useEffect, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// custom components
import PriceInput from 'components/Input/PriceInput'
import IconButton from 'components/Button/IconButton'
import GradientButton from 'components/Button/GradientButton'

// images and icons
import CloseWhiteIcon from 'assets/icons/close-white.svg'

// styles
import styles from './index.module.scss'
import { useViewport } from 'utils'
import { useSelector } from 'react-redux'

const MakeAnOfferModal = props => {
  const { open, close, onClick, listingPrice, nftName, collectionName, offerBalance, mainWalletBalance } = props
  const viewport = useViewport()

  const [minimumOffer, setMinimumOffer] = useState<any>(0)
  const [newMainBalance, setNewMainBalance] = useState<any>(0)
  const [newBiddingBalance, setNewBiddingBalance] = useState<any>(0)
  const [minimumOffer50, setMinimumOffer50] = useState<any>(94.5)
  const [biddingWalletBalance, setBiddingWalletBalance] = useState<any>(0)
  const [errorMessage, setErrorMessage] = useState<any>('')
  const [offerBtnDisabled, setOfferBtnDisabled] = useState<any>(true)
  const offerWalletLock = useSelector(state => (state as any).offerWalletLock)

  useEffect(() => {
    const newValue = listingPrice / 2
    setMinimumOffer50(newValue)
    setMinimumOffer(newValue.toFixed(2))
    let newMainWalletBalance = mainWalletBalance - newValue
    setNewMainBalance(newMainWalletBalance)
    setBiddingWalletBalance(offerBalance)
    let newBiddingValue = offerBalance + newValue
    setNewBiddingBalance(newBiddingValue)
  }, [listingPrice, mainWalletBalance, offerBalance])

  const onChangeOfferValue = value => {
    let newValue = value
    setMinimumOffer(newValue)

    if (value.length === 0) newValue = 0

    let newMainWalletBalance = mainWalletBalance - newValue
    setNewMainBalance(newMainWalletBalance)
    let newBiddingValue = parseFloat(biddingWalletBalance) + parseFloat(newValue)
    setNewBiddingBalance(newBiddingValue)
    setErrorMessage('')

    if (value === '') {
      setErrorMessage("Price can't be empty.")
      return
    }

    if (newBiddingValue < minimumOffer50) {
      setErrorMessage('<div>Offer must be at least 50% of the listing price.</div>')
      setOfferBtnDisabled(true)
      return
    }

    if (value <= 0) {
      setErrorMessage('Offer must be bigger than 0 SOL.')
      setOfferBtnDisabled(true)
      return
    }

    if (listingPrice > 0 && value > listingPrice) {
      if (newMainWalletBalance <= 0 && value > offerBalance - offerWalletLock)
        setErrorMessage('<div>Not enough balance in wallet. Offer must be lower than the listing price.</div>')
      else setErrorMessage('<div>Offer must be lower than the listing price.</div>')
      setOfferBtnDisabled(true)
      return
    }

    setOfferBtnDisabled(false)
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={() => close()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={styles.bgView} />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={styles.modalView}>
                <div className="absolute top-5 right-5">
                  <IconButton
                    icon={CloseWhiteIcon}
                    onClick={() => close()}
                    backgroundColor="#585B5D"
                    width="30px"
                    height="30px"
                    borderRadius="15px"
                    iconWidth={12}
                    iconHeight={!2}
                  />
                </div>
                <div className={styles.title}>Make Offer</div>

                <div className="w-full mt-3 lg:mt-5">
                  <div className={styles.text}>
                    When you make an offer, the funds are transferred from your main wallet to your offer wallet.
                  </div>
                </div>

                <div className="w-full mt-4 lg:mt-5">
                  <div className={styles.inputArea}>
                    <PriceInput
                      value={minimumOffer}
                      placeholder="Enter offer amount"
                      fullWidth
                      fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 14 : 16}
                      // backgroundColor="#202427"
                      // borderColor="#202427"
                      onChange={value => onChangeOfferValue(value)}
                    />
                  </div>
                </div>

                <div className="w-full mt-[8px] lg:mt-[14px]">
                  <div style={{ opacity: offerBtnDisabled ? 0.7 : 1 }}>
                    <GradientButton
                      label="Make Offer"
                      fullWidth
                      // gradientDirection="right"
                      // backgroundColor01="#2A4142"
                      // backgroundColor02="#58BDB5"
                      disabled={offerBtnDisabled}
                      onClick={() => onClick(minimumOffer)}
                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 42 : 53}
                      fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 14 : 16}
                      borderRadius={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 6 : 12}
                    />
                  </div>
                </div>

                <div className="w-full flex mt-[20px]">
                  <div
                    className={styles.termText}
                    dangerouslySetInnerHTML={{
                      __html: errorMessage,
                    }}
                  ></div>
                </div>
                <div className="w-full mt-[33px]">
                  <div className={styles.subTitle}>{nftName}</div>
                </div>
                <div className="w-full mt-2">
                  <div className={styles.greenText}>{collectionName}</div>
                </div>
                <div className="w-full mt-5 mb-[22px]">
                  <div className={styles.greenLine} />
                </div>
                <div className="w-full flex flex-wrap gap-3">
                  <div className="w-full flex justify-between">
                    <div className={styles.grayText}>Buy now price</div>
                    <div className={styles.grayText}>{listingPrice.toFixed(2)} SOL</div>
                  </div>
                  <div className="w-full flex justify-between">
                    <div className={styles.whiteText}>Minimum offer (50%)</div>
                    <div className={styles.whiteText}>{minimumOffer50.toFixed(2)} SOL</div>
                  </div>
                  <div className="w-full flex justify-between">
                    <div className={styles.whiteText}>Main Wallet Balance</div>
                    <div className={styles.whiteText}>{mainWalletBalance.toFixed(2)} SOL</div>
                  </div>
                  <div className="w-full flex justify-between">
                    <div className={styles.whiteText}>Offer Wallet Balance</div>
                    <div className={styles.whiteText}>{biddingWalletBalance.toFixed(2)} SOL</div>
                  </div>
                </div>
                <div className="w-full mt-5 mb-[22px]">
                  <div className={styles.greenLine} />
                </div>
                <div className="w-full flex flex-wrap gap-3">
                  <div className="w-full flex justify-between">
                    <div className={styles.whiteText}>New Main Wallet Balance</div>
                    <div className={styles.whiteText}>{newMainBalance.toFixed(2)} SOL</div>
                  </div>
                  <div className="w-full flex justify-between">
                    <div className={styles.whiteText}>New Offer Wallet Balance</div>
                    <div className={styles.whiteText}>{newBiddingBalance.toFixed(2)} SOL</div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default MakeAnOfferModal

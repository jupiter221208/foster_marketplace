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

const MakeAnOfferModal = props => {
  const { open, close, onClick, listingPrice, nftName, offerBalance, mainWalletBalance } = props

  const [minimumOffer, setMinimumOffer] = useState<any>(0)
  const [newMainBalance, setNewMainBalance] = useState<any>(0)
  const [newBiddingBalance, setNewBiddingBalance] = useState<any>(0)
  const [minimumOffer50, setMinimumOffer50] = useState<any>(94.5)
  const [biddingWalletBalance, setBiddingWalletBalance] = useState<any>(0)
  const [errorMessage, setErrorMessage] = useState<any>('')
  const [offerBtnDisabled, setOfferBtnDisabled] = useState<any>(true)

  useEffect(() => {
    setMinimumOffer50(listingPrice / 2)
    setNewMainBalance(mainWalletBalance)
    setBiddingWalletBalance(offerBalance)
  }, [listingPrice, mainWalletBalance, offerBalance])

  const onChangeOfferValue = value => {
    setMinimumOffer(value)
    setNewMainBalance(mainWalletBalance - value)
    let newBiddingValue = parseFloat(biddingWalletBalance) + parseFloat(value)
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

    if (value < 0) {
      setErrorMessage('Offer must be bigger than 0 SOL.')
      setOfferBtnDisabled(true)
      return
    }

    if (value > listingPrice) {
      setErrorMessage('<div>No enough balance in the wallet.<br/>Offer must be lower than the listing price.</div>')
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
                <div className="w-full mt-5">
                  <div className={styles.text}>
                    When you make an offer, the funds are withdrawn from your main wallet and deposited into your
                    &quot;offer wallet.&quot; If you already have available funds in your &quot;offer wallet,&quot; the
                    offer will be funded using your available balance.
                    <br />
                    <br />
                    To view the balance, deposit or withdraw from your offer wallet, you can do so from the wallet
                    adapter in the top navbar.
                  </div>
                </div>
                <div className="w-full mt-[30px]">
                  <div className={styles.card}>
                    <div className={styles.cardTitle}>Cancel Offer</div>
                    <div className={styles.cardText}>
                      If you would like to cancel an offer before the seller accepts, you can do so from the
                      &quot;offers&quot; tab on your dashboard.
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-between gap-4 mt-10">
                  <div className={styles.inputArea}>
                    <PriceInput value={minimumOffer} fullWidth onChange={value => onChangeOfferValue(value)} />
                  </div>
                  <div className="w-full max-w-[126px] min-w-[126px]">
                    <div style={{ opacity: offerBtnDisabled ? 0.7 : 1 }}>
                      <GradientButton
                        label="Make Offer"
                        fullWidth
                        gradientDirection="bottom"
                        disabled={offerBtnDisabled}
                        onClick={() => onClick(minimumOffer)}
                        height="50px"
                        fontSize="16px"
                      />
                    </div>
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
                  <div className={styles.greenText}>Collection Name (if applicable)</div>
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
                <div className="w-full flex justify-center text-center mt-[31px]">
                  <div className={styles.termText}>By selecting “Make offer” you agree to Terms of Services</div>
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

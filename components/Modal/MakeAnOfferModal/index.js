import React, { Fragment, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'
import RingLoader from 'react-spinners/RingLoader'

import styles from './index.module.scss'
import PriceInput from 'components/Input/PriceInput'
import GradientButton from 'components/Button/GradientButton'

// json

const MakeAnOfferModal = props => {
  const { viewport, open } = props

  const [minimumOffer, setMinimumOffer] = useState(0)

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={() => {}}>
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
                <div className={styles.title}>Make Offer</div>
                <div className="w-full mt-5">
                  <div className={styles.text}>
                    When you make an offer, the funds are kept in your bidding wallet to allow you to make multiple
                    offers using the same funds. To view, deposit or withdraw from your bidding wallet, please visit
                    "offers" on your dashboard.
                  </div>
                </div>
                <div className="w-full mt-[30px]">
                  <div className={styles.card}>
                    <div className={styles.cardTitle}>Fund the offer</div>
                    <div className={styles.cardText}>
                      Transfer money from your main wallet to the bidding wallet account.
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-between gap-4 mt-10">
                  <div className={styles.inputArea}>
                    <PriceInput value={minimumOffer} fullWidth onChange={value => setMinimumOffer(value)} />
                  </div>
                  <div className="w-full max-w-[126px] min-w-[126px]">
                    <GradientButton label="Make Offer" fullWidth onClick={() => {}} height="50px" fontSize="16px" />
                  </div>
                </div>
                <div className="w-full mt-[103px]">
                  <div className={styles.cardTitle}>NFT Name</div>
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
                    <div className={styles.grayText}>189.00 SOL</div>
                  </div>
                  <div className="w-full flex justify-between">
                    <div className={styles.whiteText}>Minimum offer (50%)</div>
                    <div className={styles.whiteText}>94.50 SOL</div>
                  </div>
                  <div className="w-full flex justify-between">
                    <div className={styles.whiteText}>Main Wallet Balance</div>
                    <div className={styles.whiteText}>100.00 SOL</div>
                  </div>
                  <div className="w-full flex justify-between">
                    <div className={styles.whiteText}>Bidding Wallet Balance</div>
                    <div className={styles.whiteText}>0.00 SOL</div>
                  </div>
                </div>
                <div className="w-full mt-5 mb-[22px]">
                  <div className={styles.greenLine} />
                </div>
                <div className="w-full flex flex-wrap gap-3">
                  <div className="w-full flex justify-between">
                    <div className={styles.whiteText}>New Main Wallet Balance</div>
                    <div className={styles.whiteText}>5.50 SOL</div>
                  </div>
                  <div className="w-full flex justify-between">
                    <div className={styles.whiteText}>New Bidding Wallet Balance</div>
                    <div className={styles.whiteText}>94.50 SOL</div>
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

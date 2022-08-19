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
                  <div className="flex flex-1">
                    <PriceInput value={minimumOffer} fullWidth onChange={value => setMinimumOffer(value)} />
                  </div>
                  <div className="w-full max-w-[126px]">
                    <GradientButton label="Make Offer" fullWidth onClick={() => {}} />
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

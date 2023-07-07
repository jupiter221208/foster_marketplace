import React, { Fragment, useEffect, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// custom components
import IconButton from 'components/Button/IconButton'

// images and icons
import CloseWhiteIcon from 'assets/icons/close-white.svg'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'
import { useViewport } from 'utils'

import { LAMPORTS_PER_SOL } from '@solana/web3.js'

const EscrowDeficientModal = props => {
  const { open, close, highestBid, deficiency, nftName, collectionName, onFinalize } = props
  const viewport = useViewport()

  const displaySolValue = value => Math.floor(value * LAMPORTS_PER_SOL) / LAMPORTS_PER_SOL

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
                <div className="absolute top-2 right-2 lg:top-5 lg:right-5">
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
                <div className="w-full mt-4 lg:mt-1">
                  <div className={styles.title}>Buyers Escrow Balance is Deficient</div>
                </div>

                <div className="w-full mt-3 lg:mt-5">
                  <div className={styles.text}>
                    The buyers escrow account does not have enough funds to cover this sale.
                    <br />
                    <br />
                    You can still finalize the sale but the effective sale price will be:{' '}
                    {displaySolValue(highestBid - deficiency)} SOL.
                    <br />
                    <br />
                    The highest bid for this NFT was {displaySolValue(highestBid)} SOL
                    <br />
                    Difference in price: {deficiency} SOL ({((deficiency / highestBid) * 100).toFixed(2)} %)
                    <br />
                    Do you want to proceed?
                    <br />
                  </div>
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
                    <div className={styles.grayText}>Hightest Bid</div>
                    <div className={styles.grayText}>{displaySolValue(highestBid)} SOL</div>
                  </div>
                  <div className="w-full flex justify-between">
                    <div className={styles.whiteText}>
                      Escrow Deficiency ({((deficiency / highestBid) * 100).toFixed(2)} %)
                    </div>
                    <div className={styles.whiteText}>{deficiency} SOL</div>
                  </div>
                  <div className="w-full flex justify-between">
                    <div className={styles.whiteText}>Buyers Escrow Balance</div>
                    <div className={styles.whiteText}>{displaySolValue(highestBid - deficiency)} SOL</div>
                  </div>
                  <div className="w-full flex justify-between">
                    <div className={styles.whiteBoldText}>Effective Sale Price</div>
                    <div className={styles.whiteBoldText}>{displaySolValue(highestBid - deficiency)} SOL</div>
                  </div>
                </div>
                <div className="w-full mt-5 mb-[22px]">
                  <div className={styles.greenLine} />
                </div>
                <div className="w-full flex justify-between gap-[48px]">
                  <OutlineButton
                    label={'Cancel Auction'}
                    onClick={close}
                    height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '53px'}
                    fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                    fullWidth
                    borderWidth={2}
                  />
                  <GradientButton
                    label={'Finalize Sale'}
                    onClick={onFinalize}
                    height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '53px'}
                    fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                    fullWidth
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default EscrowDeficientModal

import { Fragment, useEffect, useMemo, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// custom functions
import { useViewport } from 'utils'

// images
import AudioPlayerBackground from 'assets/images/audio-player.png'

// backend
import AuctionsAPI from 'apis/auctions'

// solana

import { useDispatch } from 'react-redux'

// styles
import styles from './index.module.scss'
import AuctionDetail from 'components/pages/BrowseNFT/AuctionDetail'

const StartAuctionModal = props => {
  const { data, open, onSuccess, onClose, onStartProgress } = props
  const viewport = useViewport()
  const dispatch = useDispatch()

  const closeModal = () => {
    onClose()
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={closeModal}>
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

        <div className="fixed inset-0 w-full h-full">
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
              <div className="w-[50%]">
                <div className="w-full flex justify-center">
                  <div className={styles.nftName}>{data?.json?.name}</div>
                </div>
                <div className="w-full h-full flex justify-center mt-[50px] px-[100px]">
                  <div className={styles.nftArea}>
                    <div className="w-full max-w-[480px] flex justify-center  overflow-hidden">
                      {data?.json?.category === 'video' || data?.json?.properties?.category === 'video' ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full aspect-[321/321] object-cover">
                  <source src=${data?.json.animation_url} type="video/mp4" /></video>`,
                          }}
                        />
                      ) : (
                        <img
                          src={data?.json?.image || AudioPlayerBackground.src}
                          alt={data?.json?.name || data?.name}
                          className="w-full aspect-[321/321] object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.rightPanel}>
                <AuctionDetail data={data} onSuccess={onSuccess} onStartProgress={onStartProgress} onClose={onClose} />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default StartAuctionModal

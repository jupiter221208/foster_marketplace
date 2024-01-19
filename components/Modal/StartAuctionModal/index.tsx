import { Fragment, useEffect, useMemo, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// custom functions
import { useViewport } from 'utils'
import { useResizeDetector } from 'react-resize-detector'

// images
import AudioPlayerBackground from 'assets/images/audio-player.png'

// solana

import { useDispatch } from 'react-redux'

// styles
import styles from './index.module.scss'
import AuctionDetail from 'components/pages/BrowseNFT/AuctionDetail'
import ModelViewer from 'components/ModelViewer'

const StartAuctionModal = props => {
  const { data, open, onSuccess, onClose, onStartProgress } = props
  const viewport = useViewport()
  const dispatch = useDispatch()

  const closeModal = () => {
    onClose()
  }

  const { width, height, ref } = useResizeDetector()

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
                    <div className={styles.imageArea}>
                      {data?.json?.category === 'vr' || data?.json?.properties?.category === 'vr' ? (
                        <div ref={ref} className={`${styles.imageArea} w-full h-full`}>
                          {data?.json.animation_url ? (
                            <>
                              <ModelViewer path={data?.json.animation_url} width={width} height={height} orbitLimited />
                            </>
                          ) : data?.json?.image ? (
                            <img
                              src={data?.json?.image}
                              alt=""
                              className="w-auto h-auto max-w-full max-h-full object-contain shadow-[0_0_30px_rgba(0,0,0,0.4)]"
                            />
                          ) : (
                            <h1>Could not load NFT.</h1>
                          )}
                        </div>
                      ) : data?.json?.category === 'video' || data?.json?.properties?.category === 'video' ? (
                        <div className={styles.videoArea}>
                          <video controls autoPlay loop className="max-w-full max-h-full">
                            <source type="video/mp4" src={data?.json.animation_url} />
                          </video>
                        </div>
                      ) : (
                        <img
                          src={data?.json?.image || AudioPlayerBackground.src}
                          alt={data?.json?.name || data?.name}
                          className="w-auto h-auto max-w-full max-h-full object-contain shadow-[0_0_30px_rgba(0,0,0,0.4)]"
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

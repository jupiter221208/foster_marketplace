import React, { Fragment, useEffect, useRef, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'

// next components
import Image from 'next/image'

// components

// custom functions
import { useViewport } from 'utils'

// images
import LogoBigIcon from 'assets/logo-big.svg'
import CloseIcon from 'assets/icons/close-wallet.svg'
import StatsPreviewBG from 'assets/icons/stats-preview-bg.svg'
import TcDAOLogo from 'assets/images/TC_DAO_Logo.png'
import TurkeyHead from 'assets/images/turkey-head.png'

// styles
import styles from './index.module.scss'

const StatsPreviewModal = props => {
  const { open, close } = props
  const viewport = useViewport()
  const router = useRouter()

  return (
    <div>
      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
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
              <div className="flex min-h-full items-center justify-center p-4 text-center">
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
                    <div className={styles.close} onClick={() => close()}>
                      <Image src={CloseIcon} alt="" width={30} height={30} />
                    </div>
                    <div className="w-full h-[507px] mt-[10px] p-[21px]">
                      <div className={styles.comingSoon}>COMING SOON</div>
                      <div className={styles.title}>House Stats</div>
                      <div className={`${styles.text}`}>
                        House Stats is an all-in-one hub that provides real-time data for artists and collectors. Find
                        out how your artwork and collectibles are performing, understand purchase habits, and much more.
                      </div>
                      <div className={styles.subTitle}>Creators</div>
                      <div className={`${styles.text}`}>
                        Get insights into the marketplace trends, so you invest less time analyzing and more time
                        strategizing.
                      </div>
                      <div className={styles.subTitle}>Collectors</div>
                      <div className={`${styles.text}`}>
                        Easily discover new and emerging artists, artwork, collections, and how they rank in their
                        genre.
                      </div>
                      <div className={styles.subTitle}>Get Early Access</div>
                      <div className={`${styles.text}`}>
                        Join the{' '}
                        <span
                          className={styles.link}
                          onClick={() => {
                            window.open('https://www.turkeycircus.io')
                          }}
                        >
                          Turkey Circus DAO
                        </span>{' '}
                        to get early access..
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      ) : (
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
              <div className="flex min-h-full items-center justify-center p-4 text-center">
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
                    <div className={styles.modalBody}>
                      <div className={styles.close} onClick={() => close()}>
                        <Image src={CloseIcon} alt="" width={30} height={30} />
                      </div>
                      <div className={styles.rightBack}>
                        <Image src={LogoBigIcon} alt="" width={566} height={657} />
                      </div>

                      <div className={styles.previewBG}>
                        <Image src={StatsPreviewBG} alt="" width={960} height={277} />
                      </div>
                      <div className="w-full h-full grid grid-cols-12 z-10">
                        <div className={styles.leftPanel}>
                          <div className={styles.comingSoon}>COMING SOON</div>
                          <div className={styles.title}>House Stats</div>
                          <div className={`${styles.text} mt-[15px]`}>
                            House Stats is an all-in-one hub that provides real-time data for artists and collectors.
                            Find out how your artwork and collectibles are performing, understand purchase habits, and
                            much more.
                          </div>
                          <div className={styles.subTitle}>Creators</div>
                          <div className={`${styles.text} mt-[10px]`}>
                            Get insights into the marketplace trends, so you invest less time analyzing and more time
                            strategizing.
                          </div>
                          <div className={styles.subTitle}>Collectors</div>
                          <div className={`${styles.text} mt-[10px]`}>
                            Easily discover new and emerging artists, artwork, collections, and how they rank in their
                            genre.
                          </div>
                          <div className={styles.subTitle}>Get Early Access</div>
                          <div className={`${styles.text} mt-[10px]`}>
                            Join the{' '}
                            <span className={styles.link} onClick={() => window.open('https://www.turkeycircus.io')}>
                              Turkey Circus DAO
                            </span>{' '}
                            to get early access..
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.turkeyHead}>
                      <Image src={TurkeyHead} alt="" width={719} height={719} />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  )
}

export default StatsPreviewModal

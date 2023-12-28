import React, { Fragment, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Dialog, Transition } from '@headlessui/react'
import Lottie from 'lottie-react'

// custom components
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'

// custom functions
import { useViewport } from 'utils'

// json
import CheckLottery from 'assets/lottery/check.json'

// styles
import styles from './index.module.scss'
import { FadeLoader } from 'react-spinners'

const CollectionMintProgressingModal = props => {
  const { open, collectionFiles, uploadedCount } = props

  const viewport = useViewport()

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
                <div className="flex justify-center">
                  <FadeLoader color="#95dbd5" height="10" />
                </div>
                <div className="w-full flex justify-center mt-[28px]">
                  <div className={styles.greenText}>Do not close this window</div>
                </div>
                <div className="w-full flex justify-center mt-[30px]">
                  <div className={styles.whiteText}>After all wallet approvals, your collection will be minted.</div>
                </div>

                {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
                  <div className="w-full flex flex-wrap justify-center mt-[30px]">
                    {collectionFiles.length !== 0 &&
                      collectionFiles.map((item, index) => (
                        <div
                          className="relative w-full flex justify-between items-center gap-4 mt-10 cursor-pointer"
                          key={index}
                        >
                          <div className={styles.text}>{index + 1}</div>
                          <div className={styles.nonSelectedImage}>
                            {item.type === 'video' ? (
                              <video loop autoPlay className="w-[68px] h-[68px]" id="video">
                                <source src={URL.createObjectURL(item.file)} type={item.file.type} />
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <Image
                                src={item.type === 'vr' && item.nftCoverImage ? item.nftCoverImage : item.croppedImage}
                                alt=""
                                width={68}
                                height={68}
                                objectFit="cover"
                                className="rounded-lg"
                              />
                            )}
                          </div>
                          <div className="flex-1 block h-[120px]">
                            <div className={styles.grayText}>NFT Name *</div>
                            <div>
                              <Input
                                value={item.name}
                                placeholder="Give your art name"
                                label=""
                                fullWidth
                                onChange={() => {}}
                                height="46px"
                              />
                            </div>
                          </div>
                          <div className="flex-1 block h-[120px]">
                            <div className={styles.grayText}>Description</div>
                            <div>
                              <Textarea
                                value={item.description}
                                placeholder="Add a short description..."
                                fullWidth
                                onChange={() => {}}
                                height="90px"
                              />
                            </div>
                          </div>
                          <div className="flex h-full items-center">
                            <div className="w-[50px] h-[50px]">
                              {index < uploadedCount ? (
                                <Lottie animationData={CheckLottery} loop={true} />
                              ) : (
                                <FadeLoader margin="0" height={10} speedMultiplier={2} color="#63D6CD" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="w-full flex flex-wrap justify-center mt-[30px]">
                    {collectionFiles.length !== 0 &&
                      collectionFiles.map((item, index) => (
                        <div
                          className="w-full flex flex-wrap justify-between items-center gap-4 mt-10 cursor-pointer"
                          key={index}
                        >
                          <div className="w-full flex justify-between items-center">
                            <div className={styles.nonSelectedImage}>
                              {item.type === 'video' ? (
                                <video loop autoPlay className="w-[64px] h-[64px]" id="video">
                                  <source src={URL.createObjectURL(item.file)} type={item.file.type} />
                                  Your browser does not support the video tag.
                                </video>
                              ) : (
                                <Image
                                  src={
                                    item.type === 'vr' && item.nftCoverImage ? item.nftCoverImage : item.croppedImage
                                  }
                                  alt=""
                                  width={64}
                                  height={64}
                                  objectFit="cover"
                                  className="rounded-lg"
                                />
                              )}
                            </div>
                            <div className="w-10 h-10">
                              {index < uploadedCount ? (
                                <Lottie animationData={CheckLottery} loop={true} />
                              ) : (
                                <FadeLoader margin="0" height={10} speedMultiplier={1} color="#63D6CD" />
                              )}
                            </div>
                          </div>
                          <div className="w-full">
                            <div className={styles.grayText}>NFT Name *</div>
                            <div>
                              <Input
                                value={item.name}
                                placeholder="Give your art name"
                                label=""
                                fullWidth
                                onChange={() => {}}
                                height="46px"
                              />
                            </div>
                          </div>
                          <div className="w-full">
                            <div className={styles.grayText}>Description</div>
                            <div>
                              <Textarea
                                value={item.description}
                                placeholder="Add a short description..."
                                fullWidth
                                onChange={() => {}}
                                height="90px"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default CollectionMintProgressingModal

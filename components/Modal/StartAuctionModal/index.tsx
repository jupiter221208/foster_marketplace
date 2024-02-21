import { Fragment, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// componenets
import AuctionDetail from 'components/pages/BrowseNFT/AuctionDetail'
import ModelViewer from 'components/ModelViewer'
import AudioPlayer from 'components/MediaPlayer/AudioPlayer'

// custom functions
import { useResizeDetector } from 'react-resize-detector'

// styles
import styles from './index.module.scss'
import PlayVideoIcon from 'assets/icons/play-video.svg'
import AudioPlayerBackground from 'assets/images/audio-player.png'

import { useViewport } from 'utils'

interface StartAuctionModalProps {
  data: {
    mintAddress: string
    name?: string
    image?: string
    animation_url?: string
    category?: string
  }
  open: boolean
  onSuccess: (name: string) => void
  onClose: () => void
  onStartProgress: () => void
}

const StartAuctionModal = ({ data, open, onSuccess, onClose, onStartProgress }: StartAuctionModalProps) => {
  const [play, setPlay] = useState(true)
  const viewport = useViewport()

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
              {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
                <div className="w-[50%] lg:block hidden">
                  <div className="w-full flex justify-center">
                    <div className={styles.nftName}>{data?.name}</div>
                  </div>
                  <div className="w-full h-full flex justify-center mt-[50px] px-[100px]">
                    <div className={styles.nftArea}>
                      <div className={styles.imageArea}>
                        {data?.category === 'vr' ? (
                          <div ref={ref} className={`${styles.imageArea} w-full h-full`}>
                            {data?.animation_url ? (
                              <ModelViewer width={width} height={height} path={data.animation_url} orbitLimited />
                            ) : data?.image ? (
                              <img src={data?.image} alt="" className="w-full" />
                            ) : (
                              <h1>Could not load NFT.</h1>
                            )}
                          </div>
                        ) : data?.category === 'video' ? (
                          <div className={styles.videoArea}>
                            <video controls autoPlay loop className="max-w-full max-h-full">
                              <source type="video/mp4" src={data?.animation_url} />
                            </video>
                          </div>
                        ) : data?.category === 'audio' ? (
                          <div className="w-full h-full">
                            <AudioPlayer src={data?.animation_url} cover={data?.image} />
                          </div>
                        ) : (
                          <img
                            src={data?.image}
                            alt={data?.name}
                            className="w-auto h-auto max-w-full max-h-full object-contain shadow-[0_0_30px_rgba(0,0,0,0.4)]"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full lg:hidden block">
                  {data?.category === 'vr' ? (
                    data?.animation_url ? (
                      <div ref={ref} className={`${styles.mobileImageArea} aspect-square w-full h-full`}>
                        <ModelViewer path={data?.animation_url} width={width} height={height} orbitLimited />
                      </div>
                    ) : data?.image ? (
                      <div className={styles.mobileImageArea}>
                        <img src={data?.image} alt="" className="w-full" />
                      </div>
                    ) : (
                      <h1>Could not load NFT.</h1>
                    )
                  ) : data?.category === 'image' ? (
                    <div className={styles.mobileImageArea}>
                      <img src={data?.image} alt="" className="w-full" />
                    </div>
                  ) : data?.category === 'audio' ? (
                    <div>
                      <AudioPlayer src={data?.animation_url} cover={data?.image} />
                    </div>
                  ) : data?.category === 'video' ? (
                    <div className={styles.videoArea}>
                      <div className={styles.mobileVideoThumb}>
                        <div
                          className="w-full h-full flex items-center"
                          onClick={() => {
                            if (play) setPlay(false)
                          }}
                          dangerouslySetInnerHTML={{
                            __html: `<video controls autoplay loop webkit-playsinline playsinline class="w-full h-full object-cover overflow-hidden">
                                    <source src=${data.animation_url} type="video/mp4" />
                                    </video>`,
                          }}
                        />
                      </div>

                      {!play && (
                        <div className={styles.playButton}>
                          <div className="w-[22px] h-[18px] flex justify-end">
                            <Image src={PlayVideoIcon} width={18} height={18} alt="" onClick={() => setPlay(!play)} />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              )}

              <div className={styles.rightPanel}>
                <AuctionDetail
                  data={data}
                  onSuccess={onSuccess}
                  onStartProgress={onStartProgress}
                  onClose={onClose}
                  onRefreshPage={() => {}}
                />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default StartAuctionModal

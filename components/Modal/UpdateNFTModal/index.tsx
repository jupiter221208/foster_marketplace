import { Fragment, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// solana
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

// custom components
import PriceInput from 'components/Input/PriceInput'
import GradientButton from 'components/Button/GradientButton'

import AudioPlayerBackground from 'assets/images/audio-player.png'

// styles
import styles from './index.module.scss'
import OutlineButton from 'components/Button/OutlineButton'

export interface UpdateNFTModalProps<T> {
  data: {
    category: string
    name: string
    animation_url?: string
    image?: string
  } & T
  open: boolean
  onClose: () => void
  onCancelList: (data: T) => void
  onUpdatePrice: (data: T, price: number) => void
}

const UpdateNFTModal = <T,>({ data, open, onClose, onCancelList, onUpdatePrice }: UpdateNFTModalProps<T>) => {
  const closeModal = () => {
    setPrice(null)
    onClose()
  }

  const [price, setPrice] = useState()

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
                <div className={styles.close} onClick={closeModal}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                    <g id="Group_51239" data-name="Group 51239" transform="translate(-1164 -333)">
                      <rect
                        id="Rectangle_20877"
                        data-name="Rectangle 20877"
                        width="30"
                        height="30"
                        rx="15"
                        transform="translate(1164 333)"
                        fill="var(--modal-close-btn-bg)"
                      />
                      <path
                        id="times-7"
                        d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,1,0,1.42,1.42L12,13.41l4.29,4.3a1,1,0,1,0,1.42-1.42Z"
                        transform="translate(1167 335.999)"
                        fill="var(--text-gray-200-color)"
                      />
                    </g>
                  </svg>
                </div>
                <div className={styles.title}>Update NFT</div>
                {['video'].includes(data?.category) ? (
                  <div
                    className="mt-[10px]"
                    dangerouslySetInnerHTML={{
                      __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full aspect-[321/321] object-cover">
                  <source src=${data?.animation_url} type="video/mp4" /></video>`,
                    }}
                  />
                ) : (
                  <img
                    src={data?.image ?? AudioPlayerBackground.src}
                    alt={data?.name}
                    className="w-full aspect-[321/321] mx-[30px] object-cover mt-[10px] lg:mt-[20px] rounded-[20px]"
                  />
                )}
                <div className={`${styles.nftName} mt-4 w-full`}>{data?.name}</div>
                <div className={styles.priceArea}>
                  <PriceInput
                    value={price}
                    placeholder="Enter price value"
                    fullWidth
                    onChange={value => setPrice(value)}
                  />
                </div>
                <div className="w-full mt-[15px] lg:mt-[30px]">
                  <GradientButton
                    label="Enter new listing price"
                    fullWidth
                    // gradientDirection="right"
                    // backgroundColor01="#34706B"
                    // backgroundColor02="#63D6CD"
                    onClick={() => onUpdatePrice(data, parseFloat(price) * LAMPORTS_PER_SOL)}
                  />
                </div>
                <div className="w-full mt-[15px] lg:mt-[30px]">
                  <OutlineButton
                    label="Cancel Listing"
                    fullWidth
                    onClick={() => onCancelList(data)}
                    backgroundColor="transparent"
                    // color="#5AC3BA"
                    // borderColor="#5AC3BA"
                    borderWidth={1}
                  />
                </div>
                <div className={styles.text}>
                  <p>
                    By clicking &quot;Cancel Listing&quot;, you agree to the&nbsp;
                    <span className={styles.greenText}>
                      <a target="_blank" href={process.env.NEXT_PUBLIC_TERMS_OF_USE} rel="noopener noreferrer">
                        Foster Marketplace Terms of Service
                      </a>
                    </span>
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default UpdateNFTModal

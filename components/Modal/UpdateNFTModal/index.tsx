import { Fragment, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// next components
import Image from 'next/image'

// custom components
import PriceInput from 'components/Input/PriceInput'
import GradientButton from 'components/Button/GradientButton'
import Button from 'components/Button'

// images
import CloseIcon from 'assets/icons/close-wallet.svg'
import AudioPlayerBackground from 'assets/images/audio-player.png'

// styles
import styles from './index.module.scss'
import OutlineButton from 'components/Button/OutlineButton'

const UpdateNFTModal = props => {
  const { data, open, onClose, onCancelList, onUpdatePrice } = props

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
                  <Image src={CloseIcon} alt="" width={30} height={30} />
                </div>
                <div className={styles.title}>Update NFT</div>
                {data?.json?.animation_url ? (
                  <div
                    className="mt-[10px]"
                    dangerouslySetInnerHTML={{
                      __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full aspect-[321/321] object-cover">
                  <source src=${data.json.animation_url} type="video/mp4" /></video>`,
                    }}
                  />
                ) : (
                  <img
                    src={data?.json?.image ?? AudioPlayerBackground.src}
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
                    label="Update Price"
                    fullWidth
                    gradientDirection="right"
                    backgroundColor01="#34706B"
                    backgroundColor02="#63D6CD"
                    onClick={() => onUpdatePrice(data)}
                  />
                </div>
                <div className="w-full mt-[15px] lg:mt-[30px]">
                  <OutlineButton
                    label="Cancel Listing"
                    fullWidth
                    onClick={() => onCancelList(data)}
                    backgroundColor="transparent"
                    color="#5AC3BA"
                    borderColor="#5AC3BA"
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

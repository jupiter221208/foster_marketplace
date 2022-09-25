import { Fragment, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// next components
import Image from 'next/image'

// custom components
import PriceInput from 'components/Input/PriceInput'

// images
import CloseIcon from 'assets/icons/close-wallet.svg'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'

const ListNFTModal = props => {
  const { data, open, onClose } = props

  const closeModal = () => {
    onClose()
  }

  const [price, setPrice] = useState(0)
  const [listStatus, setListStatus] = useState(false)

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
              {!listStatus ? (
                <Dialog.Panel className={styles.modalView}>
                  <div className={styles.close} onClick={closeModal}>
                    <Image src={CloseIcon} alt="" width={30} height={30} />
                  </div>
                  <div className={styles.title}>List NFT</div>
                  <div className="w-full max-w-[321px] mt-10 flex justify-center">
                    <div className={styles.image}>
                      <img src={data?.image} alt={data?.name} />
                    </div>
                  </div>
                  <div className={`${styles.nftName} mt-5`}>{data?.name}</div>
                  <div className="w-full mt-12">
                    <PriceInput
                      value={price}
                      placeholder="Enter price value"
                      fullWidth
                      onChange={value => setPrice(value)}
                    />
                  </div>
                  <div className="w-full mt-[30px]">
                    <GradientButton label="List" fullWidth onClick={() => setListStatus(true)} />
                  </div>
                  <div className="w-full mt-[30px]">
                    <div className={styles.text}>
                      By listing an NFT you are giving authority to transfer ownership to the platform
                    </div>
                  </div>
                </Dialog.Panel>
              ) : (
                <Dialog.Panel className={styles.modalView}>
                  <div className={styles.close} onClick={closeModal}>
                    <Image src={CloseIcon} alt="" width={30} height={30} />
                  </div>
                  <div className="w-full">
                    <div className={styles.image}>
                      <img src={data?.image} alt={data?.name} />
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className={styles.title}>NFT has been listed!</div>
                  </div>
                  <div className="w-full mt-[30px]">
                    <GradientButton
                      label="Go to Listed NFTs"
                      fullWidth
                      onClick={() => {
                        closeModal()
                        setListStatus(false)
                      }}
                    />
                  </div>
                </Dialog.Panel>
              )}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ListNFTModal

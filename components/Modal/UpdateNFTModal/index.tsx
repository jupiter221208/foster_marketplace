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

// styles
import styles from './index.module.scss'

const UpdateNFTModal = props => {
  const { data, open, onClose } = props

  const closeModal = () => {
    onClose()
  }

  const [price, setPrice] = useState(0)

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
                <div className="w-full mt-10">
                  <Image
                    src={data?.image}
                    alt=""
                    width={321}
                    height={378}
                    objectFit="cover"
                    className="rounded-[20px]"
                  />
                </div>
                <div className={`${styles.nftName} mt-5`}>{data?.nftName}</div>
                <div className="w-full mt-12">
                  <PriceInput
                    value={price}
                    placeholder="Enter price value"
                    fullWidth
                    onChange={value => setPrice(value)}
                  />
                </div>
                <div className="w-full mt-[30px]">
                  <GradientButton label="Change Price" fullWidth onClick={() => closeModal()} />
                </div>
                <div className="w-full mt-[30px]">
                  <Button
                    label="Unlist"
                    fullWidth
                    onClick={() => closeModal()}
                    backgroundColor="#202427"
                    color="#EFF0F6"
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

export default UpdateNFTModal

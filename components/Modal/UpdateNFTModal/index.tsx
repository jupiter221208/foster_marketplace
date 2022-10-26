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
  const { data, open, onClose, onCancelList, onUpdatePrice } = props

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
                <div className="w-full max-w-[321px] mt-10">
                  <div className={styles.image}>
                    <img src={data?.asset.json.image} alt={data?.asset.json.name} />
                  </div>
                </div>
                <div className={`${styles.nftName} mt-5 w-full`}>{data?.asset.json.name}</div>
                <div className="w-full mt-12">
                  <PriceInput
                    value={price}
                    placeholder="Enter price value"
                    fullWidth
                    onChange={value => setPrice(value)}
                  />
                </div>
                <div className="w-full mt-[30px]">
                  <GradientButton
                    label="Update Price"
                    fullWidth
                    onClick={() => onUpdatePrice(data?.asset.mint.address, data?.tradeStateAddress, price)}
                  />
                </div>
                <div className="w-full mt-[30px]">
                  <Button
                    label="Cancel Listing"
                    fullWidth
                    onClick={() => onCancelList(data?.tradeStateAddress)}
                    backgroundColor="#202427"
                    color="#EFF0F6"
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

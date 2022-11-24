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

// solana
import { listNFT } from 'utils/auction.util'
import { useMetaplex } from 'hooks/useMetaplex'

// call apis
import listingsAPI from 'apis/listings'

const ListNFTModal = props => {
  const { data, open, onClose } = props

  const [price, setPrice] = useState<number>()
  const [listStatus, setListStatus] = useState(false)

  const { metaplex: mx } = useMetaplex()

  const handleListNFTClick = async () => {
    const result: any = await listNFT(mx, data.mintAddress, price)
    if (result) {
      listingsAPI.listNft(data.mintAddress.toString(), { amount: price }).then(response => {
        console.log(response)
      }),
        error => {
          console.log(error)
        }
      setListStatus(true)
    }
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={() => onClose('unlisted')}>
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
                  <div className={styles.close} onClick={() => onClose('unlisted')}>
                    <Image src={CloseIcon} alt="" width={30} height={30} />
                  </div>
                  <div className={styles.title}>List NFT</div>
                  <div className="w-full max-w-[321px] mt-10 flex justify-center">
                    <div className={styles.image}>
                      <img src={data?.offchainMetadata.image} alt={data?.offchainMetadata.name || data?.name} />
                    </div>
                  </div>
                  <div className={`${styles.nftName} mt-5 w-full`}>{data?.offchainMetadata.name || data?.name}</div>
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
                      disabled={price !== undefined && price > 0 ? false : true}
                      label="List"
                      fullWidth
                      onClick={() => handleListNFTClick()}
                    />
                  </div>
                  <div className="w-full mt-[30px]">
                    <p className={styles.bottomText}>
                      By clicking "List", you agree to the&nbsp;
                      <span
                        className={styles.text}
                        onClick={() => {
                          window.open('https://foster-marketplace.gitbook.io/docs/v/legal-documentation/')
                        }}
                      >
                        Foster Marketplace Terms of Service
                      </span>
                    </p>
                  </div>
                </Dialog.Panel>
              ) : (
                <Dialog.Panel className={styles.modalView}>
                  <div className={styles.close} onClick={() => onClose('unlisted')}>
                    <Image src={CloseIcon} alt="" width={30} height={30} />
                  </div>
                  <div className="w-full mt-[20px]">
                    <div className={styles.image}>
                      <img src={data?.offchainMetadata.image} alt={data?.offchainMetadata.name || data?.name} />
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className={styles.title}>NFT has been listed!</div>
                  </div>
                  <div className="w-full mt-[30px]">
                    <GradientButton
                      label="View Listing"
                      fullWidth
                      onClick={() => {
                        setListStatus(false)
                        onClose('listed')
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

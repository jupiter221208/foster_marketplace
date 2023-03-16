import { Fragment } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// custom components
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// custom functions
import { useViewport } from 'utils'

// images
import CloseIcon from 'assets/icons/close-black.svg'
import CloseWhiteIcon from 'assets/icons/close-white.svg'
import AddGrayIcon from 'assets/icons/add-green.svg'
import AddWhiteIcon from 'assets/icons/add-collection-green.svg'

// styles
import styles from './index.module.scss'

const SellNFTModal = props => {
  const { open, close, onList, onAuction } = props
  const viewport = useViewport()
  const router = useRouter()
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  const closeModal = () => {
    close()
  }

  const handleClickButton = (path: string) => {
    closeModal()
    if (path === 'list') {
      onList()
    } else {
      onAuction()
    }
  }

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
          <div className="flex min-h-full items-end lg:items-center justify-center text-center">
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
                  <div>
                    <div className={styles.close} onClick={() => closeModal()}>
                      <Image src={CloseIcon} alt="" width={30} height={30} />
                    </div>
                    <div className={styles.title}>Sell NFT</div>
                    <div className={styles.text}>Would you like to sell your artwork?</div>
                    <div className="flex justify-center">
                      <div className="hidden lg:flex w-2/3">
                        <video autoPlay loop muted>
                          <source type="video/mp4" src="/images/Page-Animation.webm" />
                        </video>
                      </div>
                    </div>
                    <div className="flex justify-around">
                      <GradientButton
                        label="List for Sale"
                        width={180}
                        height={49}
                        backgroundColor01="#4B6E6B"
                        backgroundColor02="#95DBD5"
                        onClick={() => handleClickButton('list')}
                        gradientDirection="right"
                        fontSize="18px"
                        color="#202427"
                      />

                      <OutlineButton
                        label="Start Auction"
                        width={180}
                        height={49}
                        onClick={() => handleClickButton('auction')}
                        backgroundColor="#202427"
                        color="#95DBD5"
                        fontSize="18px"
                        borderColor="#95DBD5"
                        borderWidth="1px"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.close} onClick={() => closeModal()}>
                      <Image src={CloseWhiteIcon} alt="" width={17} height={17} />
                    </div>
                    <div className="flex justify-center mt-[30px]">
                      <div className={styles.title}>Sell NFT</div>
                    </div>
                    <div className={styles.text}>Would you like to sell your artwork?</div>
                    <div className="hidden lg:flex w-full">
                      <video autoPlay loop muted>
                        <source type="video/mp4" src="/images/Page-Animation.webm" />
                      </video>
                    </div>
                    <div className="w-full max-w-[221px] mt-[30px]">
                      <GradientButton
                        label="List for Sale"
                        width={221}
                        height={45}
                        onClick={() => handleClickButton('list')}
                        backgroundColor01="#4B6E6B"
                        backgroundColor02="#95DBD5"
                        gradientDirection="right"
                        fontSize="16px"
                        color="#202427"
                      />
                    </div>
                    <div className="w-full max-w-[221px] mt-[30px]">
                      <OutlineButton
                        label="Start Auction"
                        width={221}
                        height={45}
                        onClick={() => handleClickButton('auction')}
                        backgroundColor="#202427"
                        color="#95DBD5"
                        fontSize="16px"
                        borderColor="#95DBD5"
                        borderWidth="1px"
                      />
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default SellNFTModal

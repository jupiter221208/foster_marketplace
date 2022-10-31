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
import AddGrayIcon from 'assets/icons/add-gray.svg'
import AddWhiteIcon from 'assets/icons/add-white.svg'

// styles
import styles from './index.module.scss'

const CreateNFTModal = props => {
  const { open, close } = props
  const viewport = useViewport()
  const router = useRouter()
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  const closeModal = () => {
    close()
  }

  const handleClickButton = (path: string) => {
    closeModal()
    if (connected) {
      router.push(path)
    } else {
      setVisible(true)
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
                  <div className={styles.content}>
                    <div className={styles.close} onClick={() => closeModal()}>
                      <Image src={CloseIcon} alt="" width={30} height={30} />
                    </div>
                    <div className={styles.title}>Create</div>
                    <div
                      className={styles.text}
                      dangerouslySetInnerHTML={{
                        __html: 'Trying to mint an NFT single or collection, eh?',
                      }}
                    ></div>
                    <div className="hidden lg:flex w-full">
                      <video autoPlay loop muted>
                        <source type="video/mp4" src="/images/Page-Animation.webm" />
                      </video>
                    </div>
                    <div className="w-full mt-[30px]">
                      <GradientButton
                        label="Single NFT"
                        fullWidth
                        icon={AddGrayIcon}
                        onClick={() => handleClickButton('/create/single-nft')}
                        gradientDirection="bottom"
                        fontSize="22px"
                        height="63px"
                      />
                    </div>
                    <div className="w-full mt-[30px]">
                      <OutlineButton
                        label="NFT Collection"
                        fullWidth
                        icon={AddWhiteIcon}
                        onClick={() => handleClickButton('/create/collection')}
                        backgroundColor="#202427"
                        color="#EFF0F6"
                        fontSize="22px"
                        height="63px"
                        borderColor="#ffffff"
                        borderWidth="2px"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.close} onClick={() => closeModal()}>
                      <Image src={CloseIcon} alt="" width={30} height={30} />
                    </div>
                    <div className={styles.title}>Create</div>
                    <div
                      className={styles.text}
                      dangerouslySetInnerHTML={{
                        __html: `Let's create an NFT or an NFT collection!`,
                      }}
                    ></div>
                    <div className="hidden lg:flex w-full">
                      <video autoPlay loop muted>
                        <source type="video/mp4" src="/images/Page-Animation.webm" />
                      </video>
                    </div>
                    <div className="w-full max-w-[221px] mt-[30px]">
                      <GradientButton
                        label="Single NFT"
                        fullWidth
                        onClick={() => {
                          closeModal()
                          router.push('/create/single-nft')
                        }}
                        gradientDirection="bottom"
                        fontSize="16px"
                        height="45px"
                      />
                    </div>
                    <div className="w-full max-w-[221px] mt-[30px]">
                      <OutlineButton
                        label="NFT Collection"
                        fullWidth
                        onClick={() => {
                          closeModal()
                          router.push('/create/collection')
                        }}
                        backgroundColor="#202427"
                        color="#EFF0F6"
                        fontSize="16px"
                        height="45px"
                        borderColor="#ffffff"
                        borderWidth="2px"
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

export default CreateNFTModal

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
import AddWhiteIcon from 'assets/icons/add-collection-green.svg'

// styles
import styles from './index.module.scss'
import GradientButtonWithSVG from 'components/Button/GradientButtonWithSVG'

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
                  <div>
                    <div className={styles.close} onClick={() => closeModal()}>
                      <Image src={CloseIcon} alt="" width={30} height={30} />
                    </div>
                    <div className={styles.title}>Create</div>
                    <div className={styles.text}>Would you like to mint a single NFT or collection?</div>
                    <div className="flex justify-center">
                      <div className="hidden lg:flex w-2/3">
                        <video autoPlay loop muted>
                          <source type="video/mp4" src="/images/Page-Animation.webm" />
                        </video>
                      </div>
                    </div>
                    <div className="flex justify-around">
                      <GradientButtonWithSVG
                        label="Single"
                        width={180}
                        height={49}
                        backgroundColor01={'var(--main-icon-color)'}
                        backgroundColor02={'var(--main-icon-color)'}
                        icon={
                          <svg
                            id="Component_2333_2"
                            data-name="Component 2333 – 2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                          >
                            <g
                              id="Rectangle_1732"
                              data-name="Rectangle 1732"
                              fill="none"
                              stroke="var(--single-title-color)"
                              strokeWidth="2"
                            >
                              <rect width="20" height="20" rx="3" stroke="none" />
                              <rect x="1" y="1" width="18" height="18" rx="2" fill="none" />
                            </g>
                            <line
                              id="Line_298"
                              data-name="Line 298"
                              y2="8"
                              transform="translate(10 6)"
                              fill="none"
                              stroke="var(--single-title-color)"
                              strokeLinecap="round"
                              strokeWidth="2"
                            />
                            <line
                              id="Line_299"
                              data-name="Line 299"
                              y2="8.121"
                              transform="translate(13.883 9.596) rotate(90)"
                              fill="none"
                              stroke="var(--single-title-color)"
                              strokeLinecap="round"
                              strokeWidth="2"
                            />
                          </svg>
                        }
                        onClick={() => handleClickButton('/create/single-nft')}
                        gradientDirection="right"
                        fontSize="18px"
                        color={'var(--single-title-color)'}
                      />
                      <GradientButtonWithSVG
                        label="Collection"
                        width={180}
                        height={49}
                        backgroundColor01={'transparent'}
                        backgroundColor02={'transparent'}
                        borderColor="var(--follow-btn-border-mobile)"
                        borderWidth="2px"
                        icon={
                          <svg
                            id="Component_2334_2"
                            data-name="Component 2334 – 2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="25.224"
                            height="24.632"
                            viewBox="0 0 25.224 24.632"
                          >
                            <g id="Component_2333_1" data-name="Component 2333 – 1">
                              <g
                                id="Rectangle_1732"
                                data-name="Rectangle 1732"
                                fill="none"
                                stroke="var(--text-gray-200-color)"
                                stroke-width="2"
                              >
                                <rect width="20" height="20" rx="3" stroke="none" />
                                <rect x="1" y="1" width="18" height="18" rx="2" fill="none" />
                              </g>
                              <line
                                id="Line_298"
                                data-name="Line 298"
                                y2="8"
                                transform="translate(10 6)"
                                fill="none"
                                stroke="var(--text-gray-200-color)"
                                stroke-linecap="round"
                                stroke-width="2"
                              />
                              <line
                                id="Line_299"
                                data-name="Line 299"
                                y2="8.121"
                                transform="translate(13.883 9.596) rotate(90)"
                                fill="none"
                                stroke="var(--text-gray-200-color)"
                                stroke-linecap="round"
                                stroke-width="2"
                              />
                            </g>
                            <path
                              id="primary"
                              d="M12.889,21.827h7.739a3.1,3.1,0,0,0,3.1-3.1V9.444"
                              transform="translate(0.5 1.805)"
                              fill="none"
                              stroke="var(--text-gray-200-color)"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                            />
                          </svg>
                        }
                        onClick={() => handleClickButton('/create/collection')}
                        gradientDirection="right"
                        fontSize="18px"
                        color="var(--text-gray-200-color)"
                      />
                      {/* 
                      <OutlineButton
                        label="Collection"
                        width={180}
                        height={49}
                        icon={AddWhiteIcon}
                        onClick={() => handleClickButton('/create/collection')}
                        color="var(--text-gray-200-color)"
                        fontSize="18px"
                        borderWidth="1px"
                      /> */}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center mt-[30px]">
                      <div className={styles.title}>Create</div>
                    </div>
                    <div className={styles.text}>Would you like to mint a single NFT or collection?</div>
                    <div className="hidden lg:flex w-full">
                      <video autoPlay loop muted>
                        <source type="video/mp4" src="/images/Page-Animation.webm" />
                      </video>
                    </div>
                    <div className="w-full max-w-[221px] mt-[30px]">
                      <GradientButton
                        label="Single"
                        width={221}
                        height={45}
                        onClick={() => handleClickButton('/create/single-nft')}
                        backgroundColor01={'var(--main-icon-color)'}
                        backgroundColor02={'var(--main-icon-color)'}
                        // gradientDirection="right"
                        fontSize="16px"
                        color={'var(--single-title-color'}
                      />
                    </div>
                    <div className="w-full max-w-[221px] mt-[30px]">
                      <OutlineButton
                        label="Collection"
                        width={221}
                        height={45}
                        onClick={() => handleClickButton('/create/collection')}
                        color="var(--text-gray-200-color)"
                        fontSize="16px"
                        borderWidth="1px"
                      />
                    </div>
                    <div className={styles.divider}></div>
                    <div className={styles.closeButton} onClick={() => close()}>
                      Close
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

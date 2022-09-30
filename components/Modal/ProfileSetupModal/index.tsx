import React from 'react'

// third party components
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

// next components
import Image from 'next/image'

// components
import WalletItem from 'components/Card/WalletItem'

// images
import LogoBigIcon from 'assets/logo-big.svg'
import LogoIcon from 'assets/icons/logo.svg'
import CloseIcon from 'assets/icons/close-wallet.svg'
import ConnectLogo from 'assets/images/connect_wallet_logo.png'

// styles
import styles from './index.module.scss'

// json
import WalletItemList from 'assets/json/wallet-item.json'

const ProfileSetupModal = () => {
  const profileSetup: boolean = useSelector((state: any) => state.profileSetup)
  const dispatch = useDispatch()

  const closeModal = () => {
    dispatch({ type: 'set', profileSetup: !profileSetup })
  }

  const handleConnectWallet = item => {
    dispatch({ type: 'set', connectWalletStatus: true })
    dispatch({ type: 'set', profileSetup: !profileSetup })
  }

  return (
    <Transition appear show={profileSetup} as={Fragment}>
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
                <div className="w-full h-full grid grid-cols-12">
                  <div className="col-span-7">
                    <div className={styles.leftPanel}>
                      <div className={styles.title}>Connect your wallet</div>
                      <p className={styles.content}>
                        By connecting your wallet, you agree to our&nbsp;
                        <span className={styles.contentBold}>Terms of Services</span> and our&nbsp;
                        <span className={styles.contentBold}>Privacy Policy</span>.
                      </p>
                      <div className="mt-[30px]">aaa</div>
                    </div>
                  </div>
                  <div className="col-span-5 relative overflow-hidden rounded-[24px]">
                    <div className={styles.rightBack}>
                      <Image src={LogoBigIcon} alt="" width={566} height={657} />
                    </div>
                    <div className={styles.close} onClick={closeModal}>
                      <Image src={CloseIcon} alt="" width={30} height={30} />
                    </div>
                    <div className={styles.rightPanel}>
                      <div className="flex justify-center">
                        <div className={styles.rightTitle}>Foster the Flavor</div>
                      </div>
                      <div className="mt-[78px]">
                        <Image src={ConnectLogo} alt="" width={320} height={320} />
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ProfileSetupModal

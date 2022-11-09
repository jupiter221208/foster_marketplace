import React, { Fragment } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// custom components
import IconButton from 'components/Button/IconButton'

// custom functions
import { useViewport } from 'utils'

// images
import DaoModalBackground from 'assets/icons/dao-modal-background.svg'
import DaoModalMobileBackground from 'assets/icons/dao-modal-mobile-background.svg'
import CloseWhiteIcon from 'assets/icons/close-white.svg'
import LogoGray from 'assets/icons/logo-gray.svg'
import DaoModalCard from 'assets/icons/dao-modal-card.svg'
import DaoBg01 from 'assets/images/dao-bg-01.png'
import Logo01 from 'assets/images/logo-01.png'

// styles
import styles from './index.module.scss'

const DaoOfCircusModal = props => {
  const { open, close } = props

  const viewport = useViewport()

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={() => close()}>
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
          <div className="flex min-h-full items-center justify-center text-center p-4">
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
                <div className="absolute top-5 right-4 z-20">
                  <IconButton
                    icon={CloseWhiteIcon}
                    onClick={() => close()}
                    backgroundColor="#378287"
                    width="30px"
                    height="30px"
                    borderRadius="15px"
                    iconWidth={12}
                    iconHeight={12}
                  />
                </div>
                <div className="absolute inset-0 z-0">
                  <Image src={DaoModalBackground} alt="" />
                </div>
                <div className="absolute -bottom-[175px] -right-[120px] z-0 opacity-20">
                  <Image src={LogoGray} width={566} height={658} alt="" />
                </div>
                <div className="absolute top-[35px] left-[25px]">
                  <Image src={DaoModalCard} alt="" />
                </div>
                <div className="absolute top-[120px] -right-[70px] z-0">
                  <Image src={DaoBg01} alt="" />
                </div>
                <div className="w-full flex justify-start pl-[76px] z-10">
                  <p className={styles.title}>
                    Join the Dao <span className={styles.redTitle}>of circus</span>
                  </p>
                </div>
                <div className="w-full max-w-[328px] ml-5 z-10">
                  <div className={styles.text}>
                    Holders of Turkey Circus DAO NFT inherit a 5% revenue share of Foster House Collections and an
                    autonomous vote in the DAO governing Foster Protocol provisions.
                  </div>
                </div>
                <div className="w-full flex items-center ml-5 mb-5 z-10">
                  <div className={styles.logoCard}>
                    <Image src={Logo01} alt="" width={90} height={90} />
                  </div>
                  <div className={styles.linkText}>Visit Turkey Circus</div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  ) : (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={() => close()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={styles.mobileBgView} />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-start justify-center text-center pt-[140px]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={styles.mobileModalView}>
                <div className="absolute top-3 right-3 z-20">
                  <IconButton
                    icon={CloseWhiteIcon}
                    onClick={() => close()}
                    backgroundColor="#495255"
                    width="30px"
                    height="30px"
                    borderRadius="15px"
                    iconWidth={12}
                    iconHeight={12}
                  />
                </div>
                <div className="absolute inset-0 z-0">
                  <Image src={DaoModalMobileBackground} alt="" />
                </div>

                <div className="w-full flex justify-start z-10">
                  <p className={styles.mobileTitle}>
                    Join the Dao <span className={styles.mobileRedTitle}>of circus</span>
                  </p>
                </div>
                <div className="w-full mt-3 z-10">
                  <div className={styles.mobileText}>
                    Holders of Turkey Circus DAO NFT inherit a 5% revenue share of Foster House Collections and an
                    autonomous vote in the DAO governing Foster Protocol provisions.
                  </div>
                </div>
                <div className="-mt-8 z-10">
                  <Image src={DaoBg01} alt="" />
                </div>
                <div className="w-full flex items-center -mt-12 -ml-4 z-10">
                  <div className={styles.logoCard}>
                    <Image src={Logo01} alt="" width={52} height={52} />
                  </div>
                  <div className={styles.linkText}>Visit Turkey Circus</div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default DaoOfCircusModal

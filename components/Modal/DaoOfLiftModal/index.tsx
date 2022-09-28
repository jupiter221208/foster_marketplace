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
import Logo02 from 'assets/images/logo-02.png'

// styles
import styles from './index.module.scss'

const DaoOfLiftModal = props => {
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
                    iconWidth="12px"
                    iconHeight="12px"
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
                <div className="absolute top-[175px] left-[420px] z-0">
                  <Image src={Logo02} alt="" />
                </div>
                <div className="absolute top-[420px] right-[170px] z-0">
                  <Image src={Logo02} alt="" width={170} height={170} />
                </div>
                <div className="w-full flex justify-start pl-[144px] z-10">
                  <p className={styles.title}>
                    no ceilings <span className={styles.redTitle}>just lift</span>
                  </p>
                </div>
                <div className="w-full max-w-[328px] ml-5 z-10">
                  <div className={styles.text}>
                    LIFT token custodians can vote on protocol provisions and the allocation of funds and resources.
                    Stakeholders automatically receive governance weight on a 1 token, 1 vote basis.
                  </div>
                </div>
                <div className="w-full flex items-center ml-5 mb-5 z-10">
                  <div className={styles.logoCard}>
                    <Image src={Logo02} alt="" width={90} height={90} />
                  </div>
                  <div className={styles.linkText}>Visit Foster Home</div>
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
                    iconWidth="12px"
                    iconHeight="12px"
                  />
                </div>
                <div className="absolute inset-0 z-0">
                  <Image src={DaoModalMobileBackground} alt="" />
                </div>

                <div className="w-full flex justify-start z-10">
                  <p className={styles.mobileTitle}>
                    No Ceilings <span className={styles.mobileRedTitle}>Just Lift</span>
                  </p>
                </div>
                <div className="w-full mt-3 z-10">
                  <div className={styles.mobileText}>
                    LIFT token custodians can vote on protocol provisions and the allocation of funds and resources.
                    Stakeholders automatically receive governance weight on a 1 token, 1 vote basis.
                  </div>
                </div>
                <div className="w-full h-[150px] relative z-10">
                  <div className="absolute top-0 left-[100px]">
                    <Image src={Logo02} alt="" width={90} height={90} />
                  </div>
                  <div className="absolute top-[60px] left-[180px]">
                    <Image src={Logo02} alt="" width={60} height={60} />
                  </div>
                </div>
                <div className="w-full flex items-center -mt-12 -ml-4 z-10">
                  <div className={styles.logoCard}>
                    <Image src={Logo02} alt="" width={52} height={52} />
                  </div>
                  <div className={styles.linkText}>Visit Foster Home</div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default DaoOfLiftModal

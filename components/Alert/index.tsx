import React, { Fragment } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// custom functions
import { useViewport } from 'utils'

// components
import IconButton from 'components/Button/IconButton'

// images
import AlertSuccessGreenIcon from 'assets/icons/alert-success-green.svg'
import CloseBlackRedIcon from 'assets/icons/close-black-red.svg'
import CloseWhiteIcon from 'assets/icons/close-white.svg'

import AlertMobileBackground from 'assets/icons/alert-mobile-background.svg'
import LogoText from 'assets/icons/logo-text-01.svg'

// styles
import styles from './index.module.scss'

const Alert = props => {
  const { open, close, data } = props

  const viewport = useViewport()

  return viewport === 'md' || viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
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
          <div className="grid grid-cols-12 items-start justify-center p-12 pt-[130px] gap-x-10 gap-y-[18px]">
            {data.map((item, index) => (
              <div className="col-span-12" key={index}>
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
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center gap-[15px]">
                        <Image src={item.type === 'success' ? AlertSuccessGreenIcon : AlertSuccessGreenIcon} alt="" />
                        <div className={styles.title}>{item.title}</div>
                      </div>
                      <IconButton
                        icon={item.type === 'success' ? CloseWhiteIcon : CloseBlackRedIcon}
                        backgroundColor="#505457"
                        borderColor="transparent"
                        onClick={() => close()}
                        width="30px"
                        height="30px"
                        iconWidth={12}
                        iconHeight={12}
                        borderRadius="30px"
                      />
                    </div>
                    <div className={styles.divider} />
                    <div className={styles.description}>{item.description}</div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            ))}
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
          <div className={styles.bgView} />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-12 gap-x-10 gap-y-[18px]">
            {data.map((item, index) => (
              <div key={index}>
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
                    <div className="relative w-full h-full flex flex-wrap flex-col justify-between">
                      <div className="absolute top-0 right-0">
                        <IconButton
                          icon={item.type === 'success' ? CloseWhiteIcon : CloseBlackRedIcon}
                          backgroundColor="#505457"
                          borderColor="transparent"
                          onClick={() => close()}
                          width="30px"
                          height="30px"
                          iconWidth={12}
                          iconHeight={12}
                          borderRadius="30px"
                        />
                      </div>
                      <div className="w-full flex flex-wrap justify-center items-center text-center">
                        <Image
                          src={item.type === 'success' ? AlertSuccessGreenIcon : AlertSuccessGreenIcon}
                          alt=""
                          width={72}
                          height={72}
                        />
                        <div className={styles.mobileTitle}>
                          {item.type[0].toUpperCase()}
                          {item.type.slice(1)}
                        </div>
                        <div className={styles.mobileDescription}>{item.description}</div>
                      </div>
                      <div className="w-full h-[66px] flex flex-wrap justify-center">
                        <div className={styles.mobileDivier} />
                        <Image src={LogoText} alt="" />
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            ))}
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Alert

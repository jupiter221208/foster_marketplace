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
import AlertErrorBlackRedIcon from 'assets/icons/alert-error-black-red.svg'
import CloseWhiteIcon from 'assets/icons/close-white.svg'
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'
import LogoText from 'assets/icons/logo-text-01-light.svg'

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
                  <Dialog.Panel className={item.type === 'success' ? styles.modalView : styles.errorModalView}>
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center gap-[15px]">
                        <Image src={item.type === 'success' ? AlertSuccessGreenIcon : AlertErrorBlackRedIcon} alt="" />
                        <div className={styles.title}>{item.title}</div>
                      </div>
                      <IconButton
                        icon={CloseWhiteIcon}
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
                    <div className={item.type === 'success' ? styles.description : styles.errorDescription}>
                      {item.description}
                    </div>
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
                  <Dialog.Panel
                    className={item.type === 'success' ? styles.mobileModalView : styles.mobileErrorModalView}
                  >
                    <div className="relative w-full h-full flex flex-wrap flex-col justify-between">
                      <div className="absolute top-0 right-0">
                        <IconButton
                          icon={CloseWhiteIcon}
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
                        <div className={item.type === 'success' ? 'mt-0' : 'mt-5'}>
                          <Image
                            src={item.type === 'success' ? AlertSuccessGreenIcon : AlertErrorBlackRedIcon}
                            alt=""
                            width={item.type === 'success' ? 72 : 49}
                            height={item.type === 'success' ? 72 : 42}
                          />
                        </div>
                        <div className={item.type === 'success' ? styles.mobileTitle : styles.mobileErrorTitle}>
                          {item.title}
                        </div>
                        <div className={styles.mobileDescription}>{item.description}</div>
                        {item.item && (
                          <div className="w-full flex justify-between">
                            <div className={styles.mobileGreenText}>Item:</div>
                            <div className={`${styles.mobileDescription} opacity-80`}>{item.item}</div>
                          </div>
                        )}
                        {item.amount && (
                          <div className="w-full flex justify-between">
                            <div className={styles.mobileGreenText}>Amount:</div>
                            <div className={`${styles.mobileDescription} flex gap-[10px] items-center opacity-80`}>
                              <Image src={SolanaLogoIcon} alt="" />
                              {item.amount}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="w-full h-[66px] flex flex-wrap justify-center">
                        <div className={styles.mobileDivier} />
                        <div className="w-full flex justify-center items-center">
                          <div className="mt-[25px]">
                            <Image src={LogoText} alt="" />
                          </div>
                        </div>
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

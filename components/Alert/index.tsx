import React, { Fragment, useEffect } from 'react'

// next components

// third party components
import { Dialog, Transition } from '@headlessui/react'
import Lottie from 'lottie-react'

// custom functions
import { useViewport } from 'utils'

// images
import SuccessIcon from 'assets/lottery/success.json'
import SuccessLightIcon from 'assets/lottery/success-light.json'
import FailureIcon from 'assets/lottery/failure.json'
import CloseIcon from 'assets/icons/close-black-icon.svg?component'

// styles
import styles from './index.module.scss'
import { useSelector } from 'react-redux'

const Alert = props => {
  const { open, close, data } = props
  const lightDarkMode = useSelector(state => (state as any).lightMode)

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        close()
      }, 3000)
    }
  }, [open])

  const viewport = useViewport()

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={() => close()}>
        {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
          <>
            <div className={styles.mobilebgView}>
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
                    <Dialog.Panel className="w-full">
                      <div className="w-full">
                        <div className="w-full flex justify-center mt-[40px]">
                          <div className="w-[100px]">
                            {item.type === 'success' ? (
                              <Lottie animationData={lightDarkMode ? SuccessLightIcon : SuccessIcon} loop={true} />
                            ) : (
                              <Lottie
                                animationData={FailureIcon}
                                loop={true}
                                style={{
                                  width: 100,
                                  height: 100,
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <div className="w-full flex justify-center mt-1 lg:mt-[15px]">
                          <div className={styles.title}>{item.title}</div>
                        </div>
                        <div className="w-full flex justify-center mt-1 lg:mt-[15px]">
                          <div className={styles.description}>{item.description}</div>
                        </div>
                        {item.description2 && (
                          <div className="w-full flex justify-center mt-1 lg:mt-[15px]">
                            <div className="max-w-[600px]">
                              <div className={styles.description}>{item.description2}</div>
                            </div>
                          </div>
                        )}
                        {item.description3 && (
                          <div className="w-full flex justify-center mt-1 lg:mt-[15px]">
                            <div className={styles.description}>{item.description3}</div>
                          </div>
                        )}
                        <div className={styles.divider}></div>
                        <div className={styles.mobileClose} onClick={() => close()}>
                          Close
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.bgView}>
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
                  <Dialog.Panel className="w-full">
                    <div className="w-full">
                      <div className="w-full flex flex-row mt-[25px] ml-[32px]">
                        <div className="flex">
                          <div className="w-[60px]">
                            {item.type === 'success' ? (
                              <Lottie animationData={lightDarkMode ? SuccessLightIcon : SuccessIcon} loop={true} />
                            ) : (
                              <Lottie
                                animationData={FailureIcon}
                                loop={true}
                                style={{
                                  width: 100,
                                  height: 100,
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center ml-[14px]">
                          <div className={styles.title}>{item.title}</div>
                        </div>
                      </div>
                      <div className="w-full flex mt-1 lg:mt-[15px] mb-[50px]">
                        <div className={styles.description}>{item.description}</div>
                      </div>
                      {item.description2 && (
                        <div className="w-full flex mt-1 lg:mt-[15px] mb-[50px]">
                          <div className="max-w-[600px]">
                            <div className={styles.description}>{item.description2}</div>
                          </div>
                        </div>
                      )}
                      {item.description3 && (
                        <div className="w-full flex mt-1 lg:mt-[15px] mb-[50px]">
                          <div className={styles.description}>{item.description3}</div>
                        </div>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            ))}
          </div>
        )}
      </Dialog>
    </Transition>
  )
}

export default Alert

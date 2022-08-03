import React from 'react'

// third party components
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

// styles
import styles from './index.module.scss'

const ConnectWallet = () => {
  const openConnectWallet = useSelector(state => state.openConnectWallet)
  const dispatch = useDispatch()

  const closeModal = () => {
    dispatch({ type: 'set', openConnectWallet: !openConnectWallet })
  }

  return (
    <Transition appear show={openConnectWallet} as={Fragment}>
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
          {/* <div className="fixed inset-0 bg-black bg-opacity-25" /> */}
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
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Connect a Wallet
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    By connecting your wallet, you agree to our Terms of Services and our Privacy Policy..
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Done
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ConnectWallet

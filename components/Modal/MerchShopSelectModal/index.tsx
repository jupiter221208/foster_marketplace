import React, { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuthentication } from 'hooks/useAuthentication'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// resources
import CloseIcon from 'assets/icons/close-wallet.svg?component'
import PlusIcon from 'assets/icons/cross-plus-icon.svg?component'

// styles
import styles from './index.module.scss'
import MerchEditionCard from 'components/Card/MerchEditionCard'

const MerchShopSelectModal = props => {
  const { open, close, selectCard } = props
  const router = useRouter()
  const { profileInfo } = useAuthentication()

  const [merchList, setMerchList] = useState([])

  useEffect(() => {
    setMerchList([
      {
        title: 'Merch Craftsman',
        image:
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
      },
      {
        title: 'Solana Visionary',
        image:
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
      },
      {
        title: 'Studio God',
        image:
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
      },
      {
        title: 'Studio God',
        image:
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
      },
      {
        title: 'Studio God',
        image:
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
      },
      {
        title: 'Studio God',
        image:
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
      },
    ])
  }, [])

  const closeModal = () => {
    close('cancel')
  }

  return (
    <div>
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className={styles.container} onClose={() => closeModal()}>
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
            <div className="flex min-h-full items-center justify-center text-center">
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
                  <div className="w-full flex justify-between">
                    <div>
                      <div className={styles.title}>My merch items</div>
                      <div className={styles.border} />
                      <div className={`${styles.description} mt-[23px] sm:mt-[15px]`}>
                        Select a merch item from your brand & design library or create a new one
                      </div>
                    </div>

                    <div className={styles.close} onClick={closeModal}>
                      <CloseIcon alt="" />
                    </div>
                  </div>

                  <div
                    className="w-full flex gap-[15px] justify-end items-center h-[35px] mt-[20px] lg:mt-[0px]"
                    onClick={() => {
                      if (profileInfo?.username) router.push(`/${profileInfo?.username}/merch/new`)
                    }}
                  >
                    <div className={styles.plus} onClick={() => {}}>
                      <div className={styles.plusBG}>
                        <PlusIcon />
                      </div>
                    </div>
                    <div className={styles.createNew}>Create New</div>
                  </div>
                  <div className="sm:block hidden w-full h-[524px] mt-[23px] pr-[20px] overflow-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap gap-[20px] sm:gap-[20px] lg:gap-[30px] 2xl:gap-[20px]">
                      {merchList.map((item, index) => (
                        <div className="col-span-1 sm:col-span-6 lg:col-span-4 2xl:col-span-3" key={index}>
                          <MerchEditionCard
                            data={item}
                            onApplyCard={item => {
                              selectCard(item)
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sm:hidden block w-full mt-[20px]">
                    {merchList.map((item, index) => (
                      <div className="w-full mb-[10px]" key={index}>
                        <MerchEditionCard
                          data={item}
                          onApplyCard={item => {
                            selectCard(item)
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default MerchShopSelectModal

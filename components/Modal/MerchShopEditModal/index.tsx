import { Fragment, useEffect, useState } from 'react'

// components

// third party components
import { Dialog, Transition } from '@headlessui/react'

// resources
import CloseIcon from 'assets/icons/close-wallet.svg?component'

// styles
import styles from './index.module.scss'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

import StoreAPI from 'apis/store'
import LoadingButton from 'components/Button/LoadingButton'
import { useRouter } from 'next/router'

const MerchShopEditModal = ({ userId, data, type, open, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const closeModal = () => {
    onClose()
  }

  const auctionMerch = () => {
    setIsLoading(true)

    if (type === 'unassign') router.push('/dashboard?tab=0&filter=1')

    if (type === 'delist' || type === 'cancel') {
      if (data?.master_edition_address?.length > 0) {
        router.push(`/nft/${data?.master_edition_address}`)
        return
      }
      let current_date = new Date()
      current_date.setHours(current_date.getHours() - 1)

      StoreAPI.updateStoreById(userId, data.id, {
        sale_start_at: current_date.toISOString().split('.')[0],
        sale_end_at: current_date.toISOString().split('.')[0],
      }).then(response => {
        setIsLoading(false)
        onSuccess()
      }),
        error => {
          setIsLoading(false)
          console.log(error)
        }
    } else if (type === 'remove') {
      setIsLoading(false)
      onSuccess()
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

        <div className="fixed inset-0 w-full h-full">
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
              <div className={styles.mainView}>
                <div className={styles.topSection}>
                  <div className={styles.title}>
                    {type === 'delist'
                      ? data?.master_edition_address?.length > 0
                        ? 'Delist Merch Edition'
                        : 'Do you want to delist this item?'
                      : type === 'cancel'
                      ? data?.master_edition_address?.length > 0
                        ? 'Do you want to cancel the listing?'
                        : 'Do you want to cancel this item?'
                      : type === 'unassign'
                      ? 'Unassigned Merch Edition'
                      : type === 'remove'
                      ? 'Do you want to remove this item?'
                      : ''}
                  </div>
                  <div className="lg:block hidden" onClick={closeModal}>
                    <CloseIcon />
                  </div>
                </div>
                <div className="relative w-full px-[16px] lg:px-[33px] pt-[24px]">
                  <div className={styles.content}>
                    {type === 'delist' ? (
                      data?.master_edition_address?.length > 0 ? (
                        <div className={styles.delistContent}>
                          To delist this merch item, you must delist its associated edition. Go to the edition page and
                          click <span>cancel listing.</span>
                        </div>
                      ) : (
                        'If you choose to delist, it will remove the item from your merch store. You can republish it at a later time if you wish.'
                      )
                    ) : type === 'cancel' ? (
                      data?.master_edition_address?.length > 0 ? (
                        <div className={styles.cancelContent}>
                          To cancel an upcoming merch edition listing, delist its associated edition. Go to the edition
                          page and click <span>cancel listing.</span>
                        </div>
                      ) : (
                        'If you choose to cancel, it will remove the item from your merch store. You can republish it at a later time if you wish.'
                      )
                    ) : type === 'unassign' ? (
                      'To assign this merch item to an edition, go to your dashboard, select the edition, and attach the merch item. To delete this merch item, click remove.'
                    ) : type === 'remove' ? (
                      'This action is irreversible. If you choose to remove, it will remove the item from your merch store and dashboard.'
                    ) : (
                      ''
                    )}
                  </div>
                  <div className="w-full flex justify-end mt-[30px] lg:mt-[15px]">
                    <div className="flex gap-[20px]">
                      <OutlineButton
                        label="Cancel"
                        width={100}
                        height={40}
                        fontSize={16}
                        onClick={() => closeModal()}
                      />
                      {isLoading ? (
                        <LoadingButton width={130} height={40} />
                      ) : (
                        <GradientButton
                          label={type === 'unassign' ? 'Select Edition' : 'Yes, continue'}
                          width={130}
                          height={40}
                          fontSize={16}
                          onClick={() => auctionMerch()}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default MerchShopEditModal

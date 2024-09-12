import { Fragment, useEffect, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// components
import MerchReviewCard from 'components/Card/MerchReviewCard'

// resources
import CloseIcon from 'assets/icons/close-wallet.svg?component'

// styles
import styles from './index.module.scss'

const MerchReviewModal = props => {
  const { open, close, merchList, username } = props
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setShow(true)
      }, 100)
    }
  }, [open])

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={close}>
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

        <div className="fixed inset-0 lg:flex lg:justify-center lg:items-center">
          <div className={`${styles.modalView} ${show ? styles.show : styles.hide}`}>
            <div className={styles.headerSection}>
              <div>Reviews</div>
              <div onClick={() => close()}>
                <CloseIcon />
              </div>
            </div>
            {merchList.length === 0 ? (
              <div className="w-full h-[240px] flex justify-center items-center">
                <div className={styles.username}>{username + ' has no reviews yet'}</div>
              </div>
            ) : (
              <div className="w-full h-full max-h-[626px] px-[16px] sm:px-[34px] overflow-auto">
                <div className="pb-[120px] sm:pb-[60px]">
                  {merchList?.map((item, index) => (
                    <div className="w-full mt-[0px] sm:mt-[20px] mb-[20px]" key={index}>
                      <MerchReviewCard data={item} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default MerchReviewModal

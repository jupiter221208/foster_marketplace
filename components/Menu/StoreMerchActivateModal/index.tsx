import { Fragment } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// resources

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import CloseIcon from 'assets/icons/close-wallet.svg?component'
import CloseIconMobile from 'assets/icons/close-wallet-mobile.svg?component'

import OutlineButton from 'components/Button/OutlineButton'

const StoreMerchActivateModal = props => {
  const { open, close, username } = props
  const dispatch = useDispatch()
  const router = useRouter()

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

        <div className="fixed inset-0 flex justify-center items-center">
          <div className={styles.modalView}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full h-full py-[16px] sm:py-[24px]">
                <div className="w-full flex justify-between px-[21px] sm:px-[32px]">
                  <div className={styles.title}>Activate Merch Edition</div>
                  <div onClick={() => close()}>
                    <div className="sm:block hidden">
                      <CloseIcon alt="" />
                    </div>
                    <div className="sm:hidden block">
                      <CloseIconMobile alt="" />
                    </div>
                  </div>
                </div>
                <div className={styles.separator} />
                <div className="w-full px-[21px] sm:px-[32px] mt-[12px] sm:mt-[25px]">
                  <div className={styles.text}>
                    {`To attach a merch item to an edition, go to your profile, select the edition, and toggle "include merch for each print" when listing it. If you haven’t minted the edition yet, you can do so now or later.`}
                  </div>
                </div>
                <div className="w-full flex justify-center sm:justify-end px-[21px] sm:px-[32px] mt-[20px] sm:mt-[50px]">
                  <div className="flex gap-[25px]">
                    <OutlineButton
                      fontSize={16}
                      label="Create Edition"
                      width={133}
                      height={40}
                      onClick={() => {
                        dispatch({ type: 'set', createTab: 1 })
                        router.push('/create/single-nft')
                        close()
                      }}
                    />
                    <GradientButton
                      fontSize={16}
                      label="Select Edition"
                      width={133}
                      height={40}
                      onClick={() => {
                        dispatch({ type: 'set', profileTab: 'created' })
                        router.push(`/${username}`)
                        close()
                      }}
                    />
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

export default StoreMerchActivateModal

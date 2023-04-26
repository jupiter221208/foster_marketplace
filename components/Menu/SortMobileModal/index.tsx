import { Fragment, useMemo } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// resources
import SolanaSolLogoGrayIcon from 'assets/icons/solana-sol-logo-white.svg'
import NounProhibitIcon from 'assets/icons/noun-prohibit-dark-white.svg'

// styles
import styles from './index.module.scss'

// solana
import { getExplorerUrl } from 'utils/explorer'
import { useConnection } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'

const SortMobileModal = props => {
  const { open, close, address, onClick } = props
  const { connection } = useConnection()
  const router = useRouter()
  const explorerURL = useMemo(() => getExplorerUrl(connection.rpcEndpoint, address), [address, connection])

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

        <div className="fixed inset-0">
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
              <Dialog.Panel className="w-full h-full">
                <div className={styles.title}>Sort by</div>
                <div className={styles.menuItem}>
                  <div
                    onClick={() => {
                      window.open(explorerURL)
                      close()
                    }}
                  >
                    View on Solana Explorer
                  </div>
                </div>

                <div className={styles.menuItem} onClick={() => onClick()}>
                  <Image src={NounProhibitIcon} alt="" />
                  Report an Issue
                </div>

                <div className="w-full flex justify-center">
                  <div className={styles.cancel} onClick={close}>
                    Cancel
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

export default SortMobileModal

import { Fragment } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

const CastVoteModal = props => {
  const { data, open, onSubmit, onClose } = props
  const viewport = useViewport()

  const closeModal = () => {
    onClose()
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
                <div className={styles.title}>Cast your vote</div>
                <div className="mt-[12px] lg:mt-[30px]">
                  <div className={styles.subTitle}>Yay</div>
                  <div className={styles.subContent}>
                    By voting &quot;yay&quot; you are casting a vote in favor of the said proposal.
                  </div>
                </div>
                <div className="mt-[12px] mt-[26px]">
                  <div className={styles.subTitle}>Nay</div>
                  <div className={styles.subContent}>
                    By voting &quot;nay&quot; you are casting a vote against the said proposal.
                  </div>
                </div>
                <div className={styles.divider} />
                <div className="mt-[29px] flex gap-[24px] justify-center lg:justify-end">
                  <OutlineButton
                    width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 125 : 138}
                    height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 57}
                    fontSize={35}
                    fontFamily="KCDurhamboxcar"
                    label="Nay"
                    onClick={() => onSubmit(false)}
                  />
                  <GradientButton
                    width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 125 : 138}
                    height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 57}
                    fontSize={35}
                    gradientDirection="top"
                    fontFamily="KCDurhamboxcar"
                    label="Yay"
                    onClick={() => onSubmit(true)}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default CastVoteModal

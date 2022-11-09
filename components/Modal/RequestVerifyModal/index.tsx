import { Fragment, useEffect, useMemo, useState } from 'react'

// next components
import Image from 'next/image'
import Link from 'next/link'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// custom components
import Radio from 'components/Radio'
import Input from 'components/Input'
import PriceInput from 'components/Input/PriceInput'
import GradientButton from 'components/Button/GradientButton'
import Button from 'components/Button'

// custom functions
import { useViewport } from 'utils'

// images
import CloseIcon from 'assets/icons/close-wallet.svg'
import HelpGrayIcon from 'assets/icons/help-gray.svg'

// styles
import styles from './index.module.scss'

// json
import CategoryList from 'assets/json/dashboard/category-list.json'

// backend
import AuctionsAPI from 'apis/auctions'

// solana
import { startAuction } from 'utils/auctioneer.util'
import { useMetaplex } from 'hooks/useMetaplex'

const RequestVerifyModal = props => {
  const { open, onClick, onClose } = props
  const viewport = useViewport()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<any>({})

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
                <div className={styles.close} onClick={closeModal}>
                  <Image src={CloseIcon} alt="" width={30} height={30} />
                </div>
                {currentStep === 1 && (
                  <div className="w-full flex flex-wrap justify-start text-start">
                    <div className={styles.title}>Select a category</div>
                    <div className="w-full mt-5">
                      <p className={styles.text}>
                        You'll need to meet specific requirement depending on the type of account you have.{' '}
                        <Link href="/">
                          <a className={styles.linkText}>Learn more</a>
                        </Link>
                      </p>
                    </div>
                    <div className="w-full mt-12">
                      <Radio
                        data={CategoryList}
                        selected={selectedCategory}
                        onChange={item => setSelectedCategory(item)}
                        backgroundColor="#202427"
                        borderRadius="12px"
                        padding="15px 20px"
                      />
                    </div>
                    <div className="w-full mt-[120px]">
                      <Button
                        label="Continue"
                        onClick={() => setCurrentStep(2)}
                        fullWidth
                        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '53px'}
                        backgroundColor={Object.keys(selectedCategory).length === 0 ? '#383838' : ''}
                        color={Object.keys(selectedCategory).length === 0 ? '#EFF0F6' : ''}
                        disabled={Object.keys(selectedCategory).length === 0 ? true : false}
                      />
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default RequestVerifyModal

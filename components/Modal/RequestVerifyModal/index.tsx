import { Fragment, useState } from 'react'

// next components
import Image from 'next/image'
import Link from 'next/link'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// custom components
import Button from 'components/Button'

// custom functions
import { useViewport } from 'utils'

// images
import CloseIcon from 'assets/icons/close-wallet.svg?component'
import ArrowleftCircleGrayIcon from 'assets/icons/arrow-left-small.svg'
import CheckedGreenIcon from 'assets/icons/checked-green.svg'
import TwitterWhiteIcon from 'assets/icons/twitter-background-white.svg'
import TwitterGreenIcon from 'assets/icons/twitter-background-green.svg'
import SubmitGreenIcon from 'assets/icons/submit-green.svg'

import InstagramWhiteIcon from 'assets/icons/instagram-white.svg'
import InstagramGreenIcon from 'assets/icons/instagram-green.svg'

// styles
import styles from './index.module.scss'

// json
import CategoryList from 'assets/json/dashboard/category-list.json'
import VerificationRadio from 'components/VerificationRadio'
import VerifyButton from 'components/Button/VerifyButton'

const RequestVerifyModal = props => {
  const { open, onClose } = props
  const viewport = useViewport()

  const [currentStep, setCurrentStep] = useState(1)

  // step 1
  const [selectedCategory, setSelectedCategory] = useState<any>({})
  const [verifiedTwitter, setVerifiedTwitter] = useState(false)
  const [verifiedIG, setVerifiedIG] = useState(false)

  // step 2
  // const [email, setEmail] = useState('')
  // const [comment, setComment] = useState('')

  const closeModal = () => {
    setCurrentStep(1)
    setSelectedCategory({})
    setVerifiedTwitter(false)
    setVerifiedIG(false)
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
                  <CloseIcon alt="" />
                </div>
                {currentStep === 1 && (
                  <div className="w-full flex flex-wrap justify-start text-start mt-[30px]">
                    <div className={styles.title}>Select a category</div>
                    <div className="w-full mt-5">
                      <p className={styles.text}>
                        You&apos;ll need to meet specific requirement depending on the type of account you have.{' '}
                        <Link href="/">
                          <a className={styles.linkText}>Learn more</a>
                        </Link>
                      </p>
                    </div>
                    <div className="w-full mt-[30px] lg:mt-[50px]">
                      <VerificationRadio
                        data={CategoryList}
                        selected={selectedCategory}
                        onChange={item => setSelectedCategory(item)}
                      />
                    </div>
                    <div className="w-full mt-[60px] lg:mt-[120px] flex justify-center">
                      <Button
                        label="Continue"
                        onClick={() => setCurrentStep(2)}
                        width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '282px' : '100%'}
                        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '53px'}
                        backgroundColor={Object.keys(selectedCategory).length === 0 ? '#202427' : ''}
                        color={Object.keys(selectedCategory).length === 0 ? '#EFF0F6' : '#202427'}
                        disabled={Object.keys(selectedCategory).length === 0 ? true : false}
                        fontSize={20}
                        fontFamily={
                          viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'Muli-Bold' : 'Muli-SemiBold'
                        }
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="w-full flex flex-wrap justify-start text-start">
                    <div className={styles.backButton} onClick={() => setCurrentStep(1)}>
                      <Image src={ArrowleftCircleGrayIcon} alt="" width={8} height={15} />
                    </div>
                    <div className="w-full mt-[32px] flex justify-center items-center gap-3">
                      <div className={styles.title02}>{selectedCategory['label']}</div>
                      <Image src={CheckedGreenIcon} width={32} height={32} alt="" />
                    </div>
                    <div className="w-full mt-[21px]">
                      <div className={styles.text}>{selectedCategory['description']}</div>
                    </div>

                    <div className="w-full mt-[33px]">
                      <VerifyButton
                        icon={TwitterWhiteIcon}
                        icon_verified={TwitterGreenIcon}
                        label="Verify Twitter"
                        verified={verifiedTwitter}
                        onClick={() => setVerifiedTwitter(!verifiedTwitter)}
                      />
                    </div>
                    <div className="w-full mt-[18px]">
                      <VerifyButton
                        icon={InstagramWhiteIcon}
                        icon_verified={InstagramGreenIcon}
                        label="Verify Instagram"
                        verified={verifiedIG}
                        onClick={() => setVerifiedIG(!verifiedIG)}
                      />
                    </div>
                    <div className="w-full mt-[56px] lg:mt-[107px]">
                      <Button
                        label="Save"
                        onClick={() => setCurrentStep(3)}
                        width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '282px' : '100%'}
                        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '53px'}
                        backgroundColor={verifiedTwitter === true || verifiedIG === true ? '' : '#202427'}
                        color={verifiedTwitter === true || verifiedIG === true ? '#202427' : '#EFF0F6'}
                        disabled={verifiedTwitter === true || verifiedIG === true ? false : true}
                        fontSize={20}
                        fontFamily={
                          viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'Muli-Bold' : 'Muli-SemiBold'
                        }
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="w-full flex flex-wrap justify-start text-start">
                    <div className="w-full mt-[20px] flex justify-center items-center">
                      <Image src={SubmitGreenIcon} width={36} height={45} alt="" />
                    </div>
                    <div className="w-full mt-[10px] flex justify-center items-center">
                      <div className={styles.title03}>Verification Request Submitted!</div>
                    </div>
                    <div className="w-full mt-[5px] lg:mt-[15px] mb-[5px] lg:mb-[25px] flex justify-center items-center">
                      <div className={styles.text}>Please allow 3-5 business days for DAO review</div>
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

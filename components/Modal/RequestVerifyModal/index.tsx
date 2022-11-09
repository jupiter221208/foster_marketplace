import { Fragment, useState } from 'react'

// next components
import Image from 'next/image'
import Link from 'next/link'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// custom components
import Radio from 'components/Radio'
import GradientButton from 'components/Button/GradientButton'
import Button from 'components/Button'
import IconButton from 'components/Button/IconButton'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'

// custom functions
import { useViewport } from 'utils'

// images
import CloseIcon from 'assets/icons/close-wallet.svg'
import ArrowleftCircleGrayIcon from 'assets/icons/arrow-left-circle-gray.svg'
import CheckedGreenIcon from 'assets/icons/checked-green.svg'
import TwitterBackgroundBlackIcon from 'assets/icons/twitter-background-black.svg'
import InstagramBlackIcon from 'assets/icons/instagram-black.svg'
import InfoCircleGreenIcon from 'assets/icons/info-circle-green-16x16.svg'

// styles
import styles from './index.module.scss'

// json
import CategoryList from 'assets/json/dashboard/category-list.json'

const RequestVerifyModal = props => {
  const { open, onClick, onClose } = props
  const viewport = useViewport()

  const [currentStep, setCurrentStep] = useState(1)

  // step 1
  const [selectedCategory, setSelectedCategory] = useState<any>({})

  // step 2
  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')

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
                    <div className="w-full mt-[60px] lg:mt-[120px]">
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

                {currentStep === 2 && (
                  <div className="w-full flex flex-wrap justify-start text-start">
                    <div className="w-full flex justify-start">
                      <IconButton
                        icon={ArrowleftCircleGrayIcon}
                        onClick={() => setCurrentStep(1)}
                        backgroundColor="transparent"
                        width="36px"
                        height="36px"
                        iconWidth={36}
                        iconHeight={36}
                        color="red"
                        opacity="0.7"
                      />
                    </div>
                    <div className="w-full mt-[42px] flex items-center gap-3">
                      <div className={styles.title02}>Visual Artist</div>
                      <Image src={CheckedGreenIcon} width={32} height={32} alt="" />
                    </div>
                    <div className="w-full mt-[21px] opacity-80">
                      <div className={styles.text}>
                        Verify your profile via at least one social media account to prove the authenticity of your
                        profile on Foster Marketplace
                      </div>
                    </div>
                    <div className="w-full mt-8">
                      <div className={styles.subTitle}>Verify your identity *</div>
                    </div>
                    <div className="w-full mt-[21px]">
                      <div className={styles.text}>
                        Verify your profile via at least one social media account to prove the authenticity of your
                        profile on Foster
                      </div>
                    </div>
                    <div className="w-full flex gap-[9px] mt-[15px]">
                      <div className="w-full">
                        <GradientButton
                          icon={TwitterBackgroundBlackIcon}
                          label="Verify Twitter"
                          onClick={() => {}}
                          fullWidth
                          direction="rtl"
                          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '53px'}
                        />
                      </div>
                      <div className="w-full">
                        <GradientButton
                          icon={InstagramBlackIcon}
                          label="Verify Instagram"
                          onClick={() => {}}
                          fullWidth
                          direction="rtl"
                          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '53px'}
                        />
                      </div>
                    </div>
                    <div className="w-full mt-[50px]">
                      <Input
                        value={email}
                        placeholder="Email Address"
                        onChange={(value: string) => setEmail(value)}
                        label="Contact details *"
                        labelColor="#5AC3BA"
                        labelIcon={InfoCircleGreenIcon}
                      />
                    </div>
                    <div className="w-full mt-[45px]">
                      <Textarea
                        value={comment}
                        placeholder="Any additional comments"
                        onChange={(value: string) => setComment(value)}
                        label="Additional comments (optional)"
                        labelColor="#5AC3BA"
                      />
                    </div>
                    <div className="w-full mt-[50px]">
                      <GradientButton label="Submit Request" onClick={() => {}} fullWidth />
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

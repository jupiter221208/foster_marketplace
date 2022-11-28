import React, { Fragment, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// custom components
import IconButton from 'components/Button/IconButton'
import Radio from 'components/Radio'
import Button from 'components/Button'
import GradientButton from 'components/Button/GradientButton'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'

// custom functions
import { useViewport } from 'utils'

// images and icons
import CloseWhiteIcon from 'assets/icons/close-white.svg'
import ArrowLeftIcon from 'assets/icons/arrow-left-circle-gray.svg'
import InfoCircleLightGreenIcon from 'assets/icons/info-circle-light-green-20x20.svg'

// styles
import styles from './index.module.scss'

// json
import ReportIssueList from 'assets/json/browse-nft/report-issue-list.json'

interface selectedReportProps {
  id: number
  label: string
  value: string
}

const ReportAnIssueModal = props => {
  const { open, close } = props

  const viewport = useViewport()

  const [step, setStep] = useState(1)
  const [selectedReport, setSelectedReport] = useState<selectedReportProps>({ id: -1, label: '', value: '' })
  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={() => close()}>
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
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {step === 1 ? (
                <Dialog.Panel className={styles.modalView}>
                  <div className="text-center lg:text-left">
                    <div className={styles.title}>Report an Issue</div>
                  </div>
                  <div className="absolute top-3 right-3 z-20">
                    <IconButton
                      icon={CloseWhiteIcon}
                      onClick={() => close()}
                      backgroundColor="#495255"
                      width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '25px' : '30px'}
                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '25px' : '30px'}
                      borderRadius="15px"
                      iconWidth={12}
                      iconHeight={12}
                    />
                  </div>
                  <div className="w-full mt-5 text-center lg:text-left">
                    <p className={styles.text}>
                      If you believe there's been a violation of&nbsp;
                      <a className={styles.linkText}>Foster Marketplace&apos;s Terms</a>&nbsp;of Service or&nbsp;
                      <a className={styles.linkText}>Community Guidelines</a>, please select the reason and provide
                      details.
                    </p>
                  </div>
                  <div className="w-full mt-5">
                    <Radio
                      data={ReportIssueList}
                      selected={selectedReport}
                      onChange={item => setSelectedReport(item)}
                      backgroundColor="#202427"
                      padding="14px 20px 16px 20px"
                      borderRadius={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '8px' : '12px'}
                    />
                  </div>
                  <div className="w-full mt-[130px] lg:mt-48 text-center lg:text-left">
                    {step === 1 && selectedReport.id === -1 && (
                      <Button
                        label="Continue"
                        disabled={true}
                        fullWidth
                        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '45px' : '57px'}
                        fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '20px'}
                        borderRadius={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '8px' : '12px'}
                        backgroundColor="#4D5256"
                        color="rgb(239, 240, 246, 0.8)"
                        onClick={() => {}}
                      />
                    )}
                    {step === 1 && selectedReport.id !== -1 && (
                      <GradientButton
                        label="Continue"
                        disabled={false}
                        fullWidth
                        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '45px' : '57px'}
                        fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '20px'}
                        borderRadius={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '8px' : '12px'}
                        gradientDirection="bottom"
                        onClick={() => setStep(2)}
                      />
                    )}
                  </div>
                </Dialog.Panel>
              ) : (
                <Dialog.Panel className={styles.modalView}>
                  <div className="absolute top-3 left-3 z-20">
                    <IconButton icon={ArrowLeftIcon} backgroundColor="transparent" onClick={() => setStep(1)} />
                  </div>
                  <div className="absolute top-3 right-3 z-20">
                    <IconButton
                      icon={CloseWhiteIcon}
                      onClick={() => close()}
                      backgroundColor="#495255"
                      width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '25px' : '30px'}
                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '25px' : '30px'}
                      borderRadius="15px"
                      iconWidth={12}
                      iconHeight={12}
                    />
                  </div>
                  <div className="w-full mt-4 lg:mt-16 text-center lg:text-left">
                    <div className={styles.title}>{selectedReport.value}</div>
                  </div>
                  <div className="w-full mt-5 text-center lg:text-left">
                    <p className={styles.text}>
                      Foster Marketplace does not tolerate any form of violent or graphic content. Please provide the
                      following information so that our DAO can investigate.
                    </p>
                  </div>
                  <div className="w-full mt-6 lg:mt-8">
                    <Input
                      value={email}
                      placeholder="Email Address"
                      borderColor="transparent"
                      onChange={(value: string) => setEmail(value)}
                      label="Contact details *"
                      labelColor="#DEEFD0"
                      labelIconWidth="14px"
                      labelIconHeight="14px"
                      labelIcon={InfoCircleLightGreenIcon}
                    />
                  </div>
                  <div className="w-full mt-12 lg:mt-14">
                    <Textarea
                      value={comment}
                      placeholder="Any additional comments regarding the issue"
                      onChange={(value: string) => setComment(value)}
                      label="Additional comments"
                      labelColor="#DEEFD0"
                    />
                  </div>
                  <div className="w-full mt-[130px] lg:mt-48 text-center lg:text-left">
                    {step === 2 && email === '' && (
                      <Button
                        label="Submit Report"
                        disabled={true}
                        fullWidth
                        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '45px' : '57px'}
                        fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '20px'}
                        borderRadius={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '8px' : '12px'}
                        backgroundColor="#4D5256"
                        color="rgb(239, 240, 246, 0.8)"
                        onClick={() => {}}
                      />
                    )}
                    {step === 2 && email !== '' && (
                      <GradientButton
                        label="Submit Report"
                        disabled={false}
                        fullWidth
                        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '45px' : '57px'}
                        fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '20px'}
                        borderRadius={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '8px' : '12px'}
                        gradientDirection="bottom"
                        onClick={() => setStep(2)}
                      />
                    )}
                  </div>
                </Dialog.Panel>
              )}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ReportAnIssueModal

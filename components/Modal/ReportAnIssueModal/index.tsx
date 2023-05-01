import React, { Fragment, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// custom components
import IconButton from 'components/Button/IconButton'
import Button from 'components/Button'

// custom functions
import { useViewport } from 'utils'

// images and icons
import CloseWhiteIcon from 'assets/icons/close-white.svg'
import ArrowleftCircleGrayIcon from 'assets/icons/arrow-left-small.svg'
import SubmitGreenIcon from 'assets/icons/submit-green.svg'

// styles
import styles from './index.module.scss'

// json
import ReportIssueList from 'assets/json/browse-nft/report-issue-list.json'
import VerificationRadio from 'components/VerificationRadio'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'

interface selectedReportProps {
  id: number
  label: string
  value: string
  description: string
}

const ReportAnIssueModal = props => {
  const { open, close, siteUrl, wallet } = props

  const viewport = useViewport()

  const fullSiteUrl = globalThis.window?.origin + siteUrl

  const [step, setStep] = useState(1)
  const [selectedReport, setSelectedReport] = useState<selectedReportProps>({
    id: -1,
    label: '',
    value: '',
    description: '',
  })
  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')
  const [url, setUrl] = useState('')

  function encode(data) {
    return Object.keys(data)
      .map(key => {
        encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
      })
      .join('&')
  }

  function makeBodyPart() {
    let body = {
      'form-name': 'report',
      url: fullSiteUrl,
      wallet_id: wallet,
    }
    switch (selectedReport.id) {
      case 0:
        body['event-type'] = 'Violent'
        break
      case 1:
        body['event-type'] = 'Hateful'
        break
      case 2:
        body['event-type'] = 'Graphic Sexual Content'
        break
      case 3:
        body['event-type'] = 'Counterfeit Artwork'
        body['email'] = email
        body['original-url'] = url
        break
      case 4:
        body['event-type'] = 'User Misrepresentation'
        body['email'] = email
        body['artist-url'] = url
        break
      case 5:
        body['event-type'] = 'Other Suspicious Activity'
        body['email'] = email
        body['artist-url'] = comment
        break
      default:
        body['event-type'] = 'Violent'
    }
    return body
  }

  const handleSubmit = event => {
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode(makeBodyPart()),
    })
      .then(() => setStep(3))
      .catch(error => alert(error))
  }

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
                  <div className="text-center">
                    <div className={styles.title}>Report an Issue</div>
                  </div>
                  <div className="absolute top-[17px] right-[19px] z-20">
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
                  <div className="w-full mt-[20px] text-center lg:text-left">
                    <p className={styles.text}>
                      If you believe there&apos;s been a violation of the&nbsp;
                      <span className={styles.boldText}>Foster Marketplace&apos;s Terms of Service</span>, please select
                      the reason and provide details.
                    </p>
                  </div>
                  <div className="w-full mt-[56px]">
                    <VerificationRadio
                      data={ReportIssueList}
                      selected={selectedReport}
                      onChange={item => setSelectedReport(item)}
                    />
                  </div>
                  <div className="w-full mt-[60px] lg:mt-[120px] flex justify-center">
                    <Button
                      label="Continue"
                      onClick={() => setStep(2)}
                      width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '282px' : '100%'}
                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '53px'}
                      backgroundColor={
                        selectedReport.id === -1 ? '#202427' : 'linear-gradient(to right, #4b6e6b, #95dbd5)'
                      }
                      color={selectedReport.id === -1 ? '#EFF0F6' : '#202427'}
                      disabled={selectedReport.id === -1 ? true : false}
                      fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 14 : 18}
                      fontFamily={'Muli-Bold'}
                    />
                  </div>
                </Dialog.Panel>
              ) : step === 2 ? (
                <Dialog.Panel className={styles.modalView}>
                  <form name="report" data-netlify="true" method="post" onSubmit={handleSubmit}>
                    <input type="hidden" name="form-name" value="report" />

                    <div className={styles.backButton} onClick={() => setStep(1)}>
                      <Image src={ArrowleftCircleGrayIcon} alt="" width={8} height={15} />
                    </div>
                    <div className="absolute top-[17px] right-[19px] z-20">
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
                    <div className="w-full mt-[50px] text-center lg:text-left">
                      <div className={styles.title}>{selectedReport.value}</div>
                    </div>
                    <div className="w-full mt-5">
                      <span className={styles.text}>{selectedReport.description}</span>
                    </div>
                    {selectedReport.id === 3 ? (
                      <div>
                        <div className="w-full mt-[30px]">
                          <Input
                            value={email}
                            placeholder="Email Address"
                            borderColor="transparent"
                            onChange={(value: string) => setEmail(value)}
                            label="Contact details *"
                            labelColor="#eff0f6"
                          />
                        </div>
                        <div className="w-full mt-[30px]">
                          <Input
                            value={url}
                            placeholder="https://"
                            borderColor="transparent"
                            onChange={(value: string) => setUrl(value)}
                            label="URL of Original Artwork *"
                            labelColor="#eff0f6"
                          />
                        </div>
                      </div>
                    ) : selectedReport.id === 4 ? (
                      <div>
                        <div className="w-full mt-[30px]">
                          <Input
                            value={email}
                            placeholder="Email Address"
                            borderColor="transparent"
                            onChange={(value: string) => setEmail(value)}
                            label="Contact details *"
                            labelColor="#eff0f6"
                          />
                        </div>
                        <div className="w-full mt-[30px]">
                          <Input
                            value={url}
                            placeholder="https://"
                            borderColor="transparent"
                            onChange={(value: string) => setUrl(value)}
                            label="URL of Impersonated Artist/Person*"
                            labelColor="#eff0f6"
                          />
                        </div>
                      </div>
                    ) : selectedReport.id === 5 ? (
                      <div>
                        <div className="w-full mt-[30px]">
                          <Input
                            value={email}
                            placeholder="Email Address"
                            borderColor="transparent"
                            onChange={(value: string) => setEmail(value)}
                            label="Contact details *"
                            labelColor="#eff0f6"
                          />
                        </div>
                        <div className="w-full mt-[30px]">
                          <Textarea
                            value={comment}
                            placeholder="Any additional comments regarding the issue"
                            onChange={(value: string) => setComment(value)}
                            label="Additional comments"
                            labelColor="#eff0f6"
                          />
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}

                    <div className="w-full mt-[60px] lg:mt-[100px] mb-[20px] flex justify-center">
                      <button type="submit" className={styles.submit}>
                        Submit Report
                      </button>
                    </div>
                  </form>
                  {/* <div className="w-full mt-[60px] lg:mt-[100px] mb-[20px] flex justify-center">
                    <Button
                      label="Submit Report"
                      onClick={() => setStep(3)}
                      width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '282px' : '100%'}
                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '53px'}
                      color={'#202427'}
                      fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 14 : 20}
                      fontFamily={'Muli-Bold'}
                    />
                  </div> */}
                </Dialog.Panel>
              ) : (
                <Dialog.Panel className={styles.modalView}>
                  <div className="absolute top-[17px] right-[19px] z-20">
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
                  <div className="w-full flex flex-wrap justify-start text-start">
                    <div className="w-full flex justify-center items-center">
                      <Image src={SubmitGreenIcon} width={36} height={45} alt="" />
                    </div>
                    <div className="w-full mt-[10px] flex justify-center items-center">
                      <div className={styles.title03}>Report Submitted!</div>
                    </div>
                    <div className="w-full mt-[5px] lg:mt-[15px] mb-[5px] lg:mb-[25px] flex justify-center items-center">
                      <div className={styles.text}>Your report has been sent to the DAO to investigate.</div>
                    </div>
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

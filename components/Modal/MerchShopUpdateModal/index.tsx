import { Fragment, useEffect, useState } from 'react'
import { useViewport } from 'utils'
import { useRouter } from 'next/router'

// components
import Input from 'components/Input'
import ProductionListMenu from 'components/Menu/ProductionListMenu'

// third party components
import { Dialog, Transition } from '@headlessui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

// resources
import ArrowLeftIcon from 'assets/icons/arrow-left-24x24.svg?component'
import ArrowDownIcon from 'assets/icons/arrow-down-small.svg?component'

// styles
import styles from './index.module.scss'

// json
import ReleaseDurationList from 'assets/json/creator-merch/release-duration-list.json'

import ImageWithFoster from 'components/ImageWithFoster'
import { validDigits } from 'utils/helpers'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// api
import StoreAPI from 'apis/store'
import LoadingButton from 'components/Button/LoadingButton'

const MerchShopUpdateModal = ({ userId, data, open, onClose, onRemove, onSuccess }) => {
  const viewport = useViewport()
  const router = useRouter()
  const [merchImage, setMerchImage] = useState('')
  const [startType, setStartType] = useState('soon')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [days, setDays] = useState('')
  const [hours, setHours] = useState('24')
  const [day, setDay] = useState('')
  const [releaseDurationItem, setReleaseDurationItem] = useState(ReleaseDurationList[0])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (data) {
      if (data.fulfillment_type === 'foster') {
        setMerchImage(data.options.addons[0].mockup_url)
      } else {
        setMerchImage(data.options.product_images[0])
      }
    }
  }, [data])

  useEffect(() => {
    if (open) {
      setReleaseDurationItem(ReleaseDurationList[0])
      setStartType('soon')
      setStartDate(new Date())
      setEndDate(new Date())
      setDays('')
      setHours('24')
      setDay('')
    }
  }, [open])

  useEffect(() => {
    let plusDays = Number(days)
    let plusHours = Number(hours)

    if (days === '') plusDays = 0
    if (hours === '') plusHours = 0

    const endTime = new Date(startDate)
    endTime.setTime(startDate.getTime() + plusDays * 24 * 60 * 60 * 1000 + plusHours * 60 * 60 * 1000)

    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayOfWeek = day[endTime.getDay()]
    setDay(dayOfWeek)
    setEndDate(endTime)
  }, [startDate, days, hours])

  const closeModal = () => {
    onClose()
  }

  const CustomTimeInput = ({ date, value, onChange }) => {
    return (
      <input
        type="time"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ border: 'solid 1px rgba(#EFF0F6, 0.1)', cursor: 'pointer' }}
        className="!w-full h-full rounded-[9px] px-[10px] bg-transparent text-white flex-row-reverse"
      />
    )
  }

  const republishMerch = () => {
    setIsLoading(true)
    StoreAPI.updateStoreById(userId, data.id, {
      sale_start_at: startDate.toISOString().split('.')[0],
      sale_end_at: releaseDurationItem.id === 0 ? null : endDate.toISOString().split('.')[0],
    }).then(response => {
      setIsLoading(false)
      onSuccess()
    }),
      error => {
        setIsLoading(false)
        console.log(error)
      }
  }

  const selectEdition = () => {
    setIsLoading(true)
    router.push('/dashboard?tab=0&filter=1')
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
                {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
                  <div className="">
                    <div className={styles.backUpdate} onClick={closeModal}>
                      <ArrowLeftIcon />
                      Update
                    </div>
                    <div className="w-[390px] h-[390px] mt-[34px]">
                      <ImageWithFoster src={merchImage} width={390} className="max-w-full max-h-full object-contain" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full mt-[30px] g-container">
                    <div className={styles.backUpdate} onClick={closeModal}>
                      <ArrowLeftIcon />
                      Update
                    </div>
                    <div className="w-full flex justify-center">
                      <div className="w-[343px] h-[343px] mt-[25px]">
                        <ImageWithFoster
                          src={merchImage}
                          width={390}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {data?.master_edition_address === null ? (
                  <div className="w-full g-container lg:px-0 lg:flex-1 relative">
                    <div className="w-full mt-[25px] lg:mt-[0px]">
                      <div className={styles.title}>
                        Republish Date <span>*</span>
                      </div>
                    </div>

                    <div className="w-full flex gap-[35px] mt-[15px]">
                      <div
                        className={`flex items-center ${
                          viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-2' : 'gap-4'
                        }`}
                      >
                        <input
                          className={styles.radio}
                          type="radio"
                          id="reserve"
                          checked={startType === 'soon'}
                          onChange={() => {
                            setStartDate(new Date())
                            setStartType('soon')
                          }}
                        />
                        <div
                          className={styles.radioText}
                          onClick={() => {
                            setStartDate(new Date())
                            setStartType('soon')
                          }}
                        >
                          Immediately
                        </div>
                      </div>
                      <div
                        className={`flex items-center z-10001 ${
                          viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-2' : 'gap-4'
                        }`}
                      >
                        <input
                          className={styles.radio}
                          type="radio"
                          id="reserve"
                          checked={startType === 'later'}
                          onChange={() => {
                            setStartType('later')
                          }}
                        />
                        <div>
                          <div className="w-full startAuctionDatePicker">
                            <div className="relative">
                              <DatePicker
                                selected={startDate}
                                onChange={date => {
                                  setStartDate(date)
                                }}
                                dateFormat={
                                  viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                                    ? 'MM/dd/yyyy'
                                    : 'MM/dd/yyyy h:mm aa'
                                }
                                formatWeekDay={nameOfDay => nameOfDay.substr(0, 3)}
                                minDate={moment().toDate()}
                                showTimeInput
                                timeInputLabel=""
                                className={styles.datePicker}
                                disabled={startType === 'soon'}
                                customTimeInput={<CustomTimeInput date={null} value={null} onChange={null} />}
                              />
                              <div className="absolute top-[20px] right-4">
                                <ArrowDownIcon alt="" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full mt-[20px]">
                      <div className={styles.title}>
                        Duration <span>*</span>
                      </div>
                      <div className="mt-[15px]">
                        <ProductionListMenu
                          width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 343 : 390}
                          label={releaseDurationItem.id === -1 ? 'Limited Supply' : releaseDurationItem.label}
                          data={ReleaseDurationList}
                          selectedItem={releaseDurationItem}
                          setSelectedItem={item => {
                            setReleaseDurationItem(item)
                          }}
                        />
                      </div>
                    </div>
                    {releaseDurationItem.id === 1 && (
                      <div className="w-full mt-[20px]">
                        <div className={styles.title}>
                          Limited Duration <span>*</span>
                        </div>
                        <div className="mt-[15px] w-full flex gap-5">
                          <div className="w-[170px] flex justify-start items-end gap-[10px]">
                            <Input
                              value={days}
                              placeholder="0"
                              backgroundColor={'rgba(var(--main-bg-color-rgb), 0.05)'}
                              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                              width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '75px' : '122px'}
                              fullWidth
                              borderColor="transparent"
                              borderRadius="9px"
                              min={0}
                              onChange={value => {
                                let days = validDigits(value)
                                if (days < 0) {
                                  setDays('')
                                } else {
                                  setDays(days)
                                }
                              }}
                            />
                            <div className={styles.dateFont}>Days</div>
                          </div>
                          <div className="w-[170px] flex justify-start items-end gap-[10px]">
                            <Input
                              value={hours}
                              placeholder="0"
                              backgroundColor={'rgba(var(--main-bg-color-rgb), 0.05)'}
                              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                              width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '75px' : '122px'}
                              fullWidth
                              borderColor="transparent"
                              borderRadius="9px"
                              min={0}
                              onChange={value => {
                                let hours = validDigits(value)
                                if (hours < 0) {
                                  setHours('')
                                } else {
                                  setHours(hours)
                                }
                              }}
                            />
                            <div className={styles.dateFont}>Hours</div>
                          </div>
                        </div>
                        <div className="mt-2 w-full text-start">
                          <div className={styles.label}>
                            The release is due to end&nbsp;
                            <span className={styles.dateLabel}>
                              {day}
                              {', '}
                              {endDate.toLocaleDateString()}&nbsp;
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute w-full bottom-0 right-0 lg:block hidden">
                      <div className="w-full mt-[20px]">
                        {isLoading ? (
                          <LoadingButton fullWidth height={50} />
                        ) : (
                          <GradientButton fullWidth label="Republish" height={50} onClick={() => republishMerch()} />
                        )}
                      </div>
                      <div className="w-full mt-[15px] mb-[50px] lg:mb-[0px]">
                        <OutlineButton fullWidth label="Remove" height={50} onClick={onRemove} />
                      </div>
                    </div>
                    <div className="lg:hidden block">
                      <div className="w-full mt-[20px]">
                        {isLoading ? (
                          <LoadingButton fullWidth height={50} />
                        ) : (
                          <GradientButton fullWidth label="Republish" height={50} onClick={() => republishMerch()} />
                        )}
                      </div>
                      <div className="w-full mt-[15px] mb-[50px] lg:mb-[0px]">
                        <OutlineButton fullWidth label="Remove" height={50} onClick={onRemove} />
                      </div>
                    </div>
                    <div className="w-full h-[50px] block lg:hidden" />
                  </div>
                ) : (
                  <div className="w-full g-container lg:px-0 lg:flex-1 relative">
                    <div className={styles.modalTitle}>Unassigned Merch Edition</div>
                    <div className={styles.modalContent}>
                      To assign this merch item to an edition, go to your dashboard, select the edition, and attach the
                      merch item. To delete this merch item, click remove.
                    </div>
                    <div className="absolute w-full bottom-0 right-0 lg:block hidden mt-[30px]">
                      <div className="w-full mt-[15px] mb-[50px] lg:mb-[0px]">
                        <OutlineButton fullWidth label="Remove" height={50} onClick={onRemove} />
                      </div>
                      <div className="w-full mt-[20px]">
                        {isLoading ? (
                          <LoadingButton fullWidth height={50} />
                        ) : (
                          <GradientButton
                            fullWidth
                            label="Select Edition"
                            height={50}
                            onClick={() => selectEdition()}
                          />
                        )}
                      </div>
                    </div>
                    <div className="lg:hidden block mt-[50px]">
                      <div className="w-full mt-[15px] mb-[50px] lg:mb-[0px]">
                        <OutlineButton fullWidth label="Remove" height={50} onClick={onRemove} />
                      </div>
                      <div className="w-full mt-[20px]">
                        {isLoading ? (
                          <LoadingButton fullWidth height={50} />
                        ) : (
                          <GradientButton
                            fullWidth
                            label="Select Edition"
                            height={50}
                            onClick={() => selectEdition()}
                          />
                        )}
                      </div>
                    </div>
                    <div className="w-full h-[50px] block lg:hidden" />
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default MerchShopUpdateModal

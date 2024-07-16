import { Fragment, useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Dialog, Transition } from '@headlessui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

// componenets

// resources
import CloseIcon from 'assets/icons/close-wallet.svg?component'
import ArrowDownIcon from 'assets/icons/arrow-down-small.svg?component'

// styles
import styles from './index.module.scss'
import Input from 'components/Input'
import { useViewport } from 'utils'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

const MakeShippedModal = ({ open, onClose, orderId }) => {
  const viewport = useViewport()
  const [name, setName] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shipDate, setShipDate] = useState(new Date())

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

  return (
    <Transition appear show={open} as={Fragment}>
      <div className={styles.container}>
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
            <div className={styles.modalView}>
              <div className={styles.mainView}>
                <div className={styles.topView}>
                  <div>
                    <div className={styles.title}>Mark as Shipped</div>
                    <div className={styles.orderId}>Order# {orderId}</div>
                  </div>
                  <div className="w-[30px] h-[30px]" onClick={onClose}>
                    <CloseIcon />
                  </div>
                </div>
                <div className={styles.contentView}>
                  <div>
                    <div className={styles.name}>
                      Carrier Name <span>*</span>
                    </div>
                    <div className="mt-[15px]">
                      <Input value={name} placeholder="Insert carrier name" onChange={value => setName(value)} />
                    </div>
                  </div>
                  <div className="mt-[15px]">
                    <div className={styles.name}>
                      Tracking Number <span>*</span>
                    </div>
                    <div className="mt-[15px]">
                      <Input
                        value={trackingNumber}
                        placeholder="Insert the tracking number"
                        onChange={value => setTrackingNumber(value)}
                      />
                    </div>
                  </div>
                  <div className="mt-[15px]">
                    <div className={styles.name}>
                      Ship Date <span>*</span>
                    </div>
                    <div className="mt-[15px] lg:fixed ">
                      <div className="w-full startAuctionDatePicker">
                        <div className="relative w-[200px]">
                          <DatePicker
                            selected={shipDate}
                            onChange={date => {
                              setShipDate(date)
                            }}
                            dateFormat={'MM/dd/yyyy h:mm aa'}
                            formatWeekDay={nameOfDay => nameOfDay.substr(0, 3)}
                            maxDate={moment().toDate()}
                            showTimeInput
                            timeInputLabel=""
                            className={styles.datePicker}
                            customTimeInput={<CustomTimeInput date={null} value={null} onChange={null} />}
                          />
                          <div className="absolute top-[20px] right-4">
                            <ArrowDownIcon alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-[30px] lg:mt-[80px] flex justify-end">
                    <div className="flex gap-[20px]">
                      <OutlineButton width={100} height={40} fontSize={16} label="Cancel" onClick={onClose} />
                      <GradientButton width={160} height={40} fontSize={16} label="Mark as Shipped" onClick={onClose} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition>
  )
}

export default MakeShippedModal

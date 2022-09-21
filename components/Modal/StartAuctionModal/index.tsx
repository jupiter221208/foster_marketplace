import { Fragment, useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Dialog, Transition } from '@headlessui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// custom components
import Input from 'components/Input'
import PriceInput from 'components/Input/PriceInput'
import GradientButton from 'components/Button/GradientButton'
import Button from 'components/Button'

// images
import CloseIcon from 'assets/icons/close-wallet.svg'
import HelpGrayIcon from 'assets/icons/help-gray.svg'

// styles
import styles from './index.module.scss'

const StartAuctionModal = props => {
  const { viewport, data, open, onClick, onClose } = props

  const closeModal = () => {
    onClose()
  }

  const [startDate, setStartDate] = useState(new Date())
  const [price, setPrice] = useState(0)

  // useEffect(() => {
  //   const position = async () => {
  //     await navigator.geolocation.getCurrentPosition(
  //       position => {
  //         displayLocation(position.coords.latitude, position.coords.longitude)
  //       },
  //       err => console.log('error', err)
  //     )
  //   }
  //   position()
  // }, [startDate])

  // function displayLocation(latitude, longitude) {
  //   var geocoder
  //   geocoder = new window.google.maps.Geocoder()
  //   var latlng = new google.maps.LatLng(latitude, longitude)

  //   geocoder.geocode({ latLng: latlng }, function (results, status) {
  //     if (status == google.maps.GeocoderStatus.OK) {
  //       if (results[0]) {
  //         var add = results[0].formatted_address
  //         var value = add.split(',')
  //         let count = value.length
  //         let country = value[count - 1]
  //         let state = value[count - 2]
  //         let city = value[count - 3]
  //       }
  //     }
  //   })
  // }

  const CustomTimeInput = ({ date, value, onChange }) => {
    return (
      <input
        type="time"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ border: 'solid 1px rgba(#EFF0F6, 0.1)' }}
        className="!w-full h-full rounded-[9px] px-[10px] bg-transparent text-white flex-row-reverse"
      />
    )
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
                <div className={styles.title}>Start Auction</div>
                <div className="w-full mt-[30px] lg:mt-10">
                  <img
                    src={data?.image}
                    alt={data?.name}
                    className="w-full aspect-[321/378] object-cover rounded-[20px]"
                  />
                </div>
                <div className={`${styles.nftName} mt-5`}>{data?.name}</div>
                <input className="w-0 h-9" />
                <div className="mt-10 lg:mt-5 w-full startAuctionDatePicker">
                  <DatePicker
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    dateFormat="MM/dd/yyyy h:mm aa"
                    formatWeekDay={nameOfDay => nameOfDay.substr(0, 3)}
                    showTimeInput
                    timeInputLabel=""
                    className={styles.datePicker}
                    customTimeInput={<CustomTimeInput date={null} value={null} onChange={null} />}
                  />
                  <div className="mt-2 w-full text-start">
                    <div className={styles.label}>Schedule auction start date and time</div>
                  </div>
                </div>
                <div className="mt-[38px] w-full grid grid-cols-2 gap-5 lg:gap-[57px]">
                  <div className="col-span-1 flex justify-start items-end gap-[10px]">
                    <Input
                      placeholder="Days"
                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                      width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '75px' : '122px'}
                      fullWidth
                      borderRadius="9px"
                    />
                    <div className="text-sm">Day(s)</div>
                  </div>
                  <div className="col-span-1 flex justify-start items-end gap-[10px]">
                    <Input
                      placeholder="Hours"
                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                      width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '75px' : '122px'}
                      fullWidth
                      borderRadius="9px"
                    />
                    <div className="text-sm">Hour(s)</div>
                  </div>
                </div>
                <div className="mt-2 w-full text-start">
                  <div className={styles.label}>
                    The auction is due to end <span className="font-bold text-white">Tuesday, 08/22/24</span>
                    {viewport !== 'xs' && viewport !== 'sm' && viewport !== 'md' && '(in your local time)'}
                  </div>
                </div>
                <div className="mt-[49px] w-full">
                  <PriceInput
                    value={price}
                    placeholder="Enter starting bid"
                    fullWidth
                    height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                    onChange={value => setPrice(value)}
                  />
                </div>
                <div className="mt-2 w-full flex gap-2 items-center">
                  <div className={styles.label}>Minimum bid increment: 0.05 SOL</div>
                  <Image src={HelpGrayIcon} alt="" />
                </div>
                <div className="w-full mt-12">
                  <GradientButton
                    label="Publish Auction"
                    fullWidth
                    onClick={() => onClick()}
                    gradientDirection="bottom"
                  />
                </div>
                <div className="mt-[10px] w-full">
                  <p className={`${styles.label} !text-sm !text-center`}>
                    By clicking &quot;List&quot;, you agree to the&nbsp;
                    <span className={styles.linkText}>
                      <a target="_blank" href={process.env.NEXT_PUBLIC_TERMS_OF_USE} rel="noopener noreferrer">
                        Foster Marketplace Terms of Service
                      </a>
                    </span>
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default StartAuctionModal

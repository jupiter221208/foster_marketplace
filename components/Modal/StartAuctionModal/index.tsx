import { Fragment, useEffect, useMemo, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Dialog, Transition } from '@headlessui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

// custom components
import Input from 'components/Input'
import PriceInput from 'components/Input/PriceInput'
import GradientButton from 'components/Button/GradientButton'

// custom functions
import { useViewport } from 'utils'
import { useAuthentication } from 'hooks/useAuthentication'

// images
import AudioPlayerBackground from 'assets/images/audio-player.png'
import ArrowDownIcon from 'assets/icons/arrow-down-small.svg?component'

// styles
import styles from './index.module.scss'

// backend
import AuctionsAPI from 'apis/auctions'

// solana
import { startAuction } from 'utils/auctioneer.util'
import { useMetaplex } from 'hooks/useMetaplex'
import { useDispatch } from 'react-redux'

const StartAuctionModal = props => {
  const { data, open, onSuccess, onClose, onStartProgress } = props
  const viewport = useViewport()
  const dispatch = useDispatch()
  const { refreshToken } = useAuthentication()

  const closeModal = () => {
    setMinBidIncrement(null)
    onClose()
  }

  const [startDate, setStartDate] = useState(new Date())
  const [days, setDays] = useState('')
  const [hours, setHours] = useState('')
  const [minBidIncrement, setMinBidIncrement] = useState('')
  const [reservePrice, setReservePrice] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [startType, setStartType] = useState('')
  const [durationType, setDurationType] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [day, setDay] = useState('')

  const endDate = useMemo(() => {
    var plusDays = Number(days)
    var plusHours = Number(hours)

    if (days === '') plusDays = 0
    if (hours === '') plusHours = 0

    const endDate = new Date(startDate)
    endDate.setTime(startDate.getTime() + plusDays * 24 * 60 * 60 * 1000 + plusHours * 60 * 60 * 1000)

    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayOfWeek = day[endDate.getDay()]
    setDay(dayOfWeek)

    return endDate
  }, [startDate, days, hours])

  const { metaplex: mx } = useMetaplex()

  const handleStartAuction = async () => {
    await refreshToken()

    onStartProgress()
    const { auction } = await startAuction(
      mx,
      data.mintAddress,
      startDate,
      endDate,
      Number(reservePrice),
      Number(minBidIncrement)
    )
    AuctionsAPI.create(auction.mintAddress.toBase58(), {
      mint_address: auction.mintAddress.toBase58(),
      associated_address: auction.associatedAddress.toBase58(),
      free_trade_state: auction.freeTradeState.toBase58(),
      metadata: auction.metadata.toBase58(),
      signer: auction.signer.toBase58(),
      seller_address: auction.sellerAddress.toBase58(),
      start_time: startDate.toISOString().split('.')[0], //auction.startTime.toString(),
      end_time: endDate.toISOString().split('.')[0], //auction.endTime.toString(),
      reserve_price: auction.reservePrice.toString(),
      canceled_at: null,
      sold_at: null,
    }).then(res => {
      if (res) {
        onSuccess(data?.json?.name)
        dispatch({ type: 'set', isGetListedNFTs: false })
      }
    })
  }

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

  useEffect(() => {
    let disabled = false

    if (parseFloat(days) > 30) disabled = true
    else if (durationType === 'custom' && parseFloat(hours) > 23) disabled = true
    else if (!minBidIncrement) disabled = true
    else if (reservePrice === undefined || reservePrice === '' || reservePrice === null) disabled = true
    setButtonDisabled(disabled)
  }, [days, hours, reservePrice, minBidIncrement])

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
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                    <g id="Group_51239" data-name="Group 51239" transform="translate(-1164 -333)">
                      <rect
                        id="Rectangle_20877"
                        data-name="Rectangle 20877"
                        width="30"
                        height="30"
                        rx="15"
                        transform="translate(1164 333)"
                        fill="rgba(var(--background-light-color-rgb), 0.05)"
                      />
                      <path
                        id="times-7"
                        d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,1,0,1.42,1.42L12,13.41l4.29,4.3a1,1,0,1,0,1.42-1.42Z"
                        transform="translate(1167 335.999)"
                        fill="var(--text-gray-200-color)"
                      />
                    </g>
                  </svg>
                </div>
                <div className={styles.title}>Start Auction</div>
                <div className="w-full max-w-[321px] mt-10 flex justify-center rounded-[10px] lg:rounded-[24px] overflow-hidden">
                  {data?.json?.category === 'video' || data?.json?.properties?.category === 'video' ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full aspect-[321/321] object-cover">
                  <source src=${data?.json.animation_url} type="video/mp4" /></video>`,
                      }}
                    />
                  ) : (
                    <img
                      src={data?.json?.image || AudioPlayerBackground.src}
                      alt={data?.json?.name || data?.name}
                      className="w-full aspect-[321/321] object-cover"
                    />
                  )}
                </div>
                <div className="w-full flex justify-center">
                  <div className={`${styles.nftName} mt-4 lg:mt-5`}>{data?.json?.name}</div>
                </div>

                <div className="w-full">
                  <div className="w-full mt-[25px]">
                    <div className={styles.auctionStart}>
                      Auction Start <span className={styles.auctionAsterisk}>*</span>
                    </div>
                  </div>
                  <div
                    className={`w-full flex mt-[5px] justify-between ${
                      viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-2' : 'gap-8'
                    }`}
                  >
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
                      className={`flex items-center ${
                        viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-2' : 'gap-4'
                      }`}
                    >
                      <input
                        className={styles.radio}
                        type="radio"
                        id="reserve"
                        checked={startType === 'later'}
                        onChange={() => setStartType('later')}
                      />
                      <div>
                        <div className="w-full startAuctionDatePicker">
                          <div className="relative">
                            <DatePicker
                              selected={startDate}
                              onChange={date => setStartDate(date)}
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
                </div>

                <div className="w-full mt-[25px]">
                  <div className={styles.auctionStart}>
                    Reserve Bid <span className={styles.auctionAsterisk}>*</span>
                  </div>
                </div>
                <div className="mt-[15px] w-full">
                  <PriceInput
                    value={reservePrice}
                    placeholder="Set the reserve starting bid"
                    backgroundColor={'rgba(var(--main-bg-color-rgb), 0.05)'}
                    fullWidth
                    type="number"
                    min={0}
                    height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                    onChange={value => {
                      if (value < 0) {
                        setReservePrice('')
                      } else {
                        setReservePrice(value)
                      }
                    }}
                  />
                </div>

                <div className="w-full mt-[25px]">
                  <div className={styles.auctionStart}>
                    Auction Duration <span className={styles.auctionAsterisk}>*</span>
                  </div>
                </div>
                <div
                  className={`w-full flex mt-[15px] justify-between ${
                    viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-2' : 'gap-8'
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-[5px]' : 'gap-4'
                    }`}
                  >
                    <input
                      className={styles.radio}
                      type="radio"
                      id="24 hours"
                      checked={durationType === '24'}
                      onChange={() => {
                        setDays('')
                        setHours('24')
                        setDurationType('24')
                      }}
                    />
                    <div
                      className={styles.radioText}
                      onClick={() => {
                        setDays('')
                        setHours('24')
                        setDurationType('24')
                      }}
                    >
                      24 hours
                    </div>
                  </div>
                  <div
                    className={`flex items-center ${
                      viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-[5px]' : 'gap-4'
                    }`}
                  >
                    <input
                      className={styles.radio}
                      type="radio"
                      id="48 hours"
                      checked={durationType === '48'}
                      onChange={() => {
                        setDays('')
                        setHours('48')
                        setDurationType('48')
                      }}
                    />
                    <div
                      className={styles.radioText}
                      onClick={() => {
                        setDays('')
                        setHours('48')
                        setDurationType('48')
                      }}
                    >
                      48 hours
                    </div>
                  </div>
                  <div
                    className={`flex items-center ${
                      viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-[5px]' : 'gap-4'
                    }`}
                  >
                    <input
                      className={styles.radio}
                      type="radio"
                      id="custom"
                      checked={durationType === 'custom'}
                      onChange={() => {
                        setDays('')
                        setHours('')
                        setDurationType('custom')
                      }}
                    />
                    <div
                      className={styles.radioText}
                      onClick={() => {
                        setDays('')
                        setHours('')
                        setDurationType('custom')
                      }}
                    >
                      Custom
                    </div>
                  </div>
                </div>

                {durationType === 'custom' && (
                  <div>
                    <div className="w-full mt-[25px]">
                      <div className={styles.auctionStart}>
                        Custom Duration <span className={styles.auctionAsterisk}>*</span>
                      </div>
                    </div>
                    <div className="mt-[15px] w-full grid grid-cols-2 gap-5">
                      <div className="col-span-1 flex justify-start items-end gap-[10px]">
                        <Input
                          value={days}
                          placeholder="0"
                          backgroundColor={'rgba(var(--main-bg-color-rgb), 0.05)'}
                          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                          width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '75px' : '122px'}
                          fullWidth
                          borderRadius="9px"
                          min={0}
                          type="number"
                          onChange={value => {
                            if (value < 0) {
                              setDays('')
                            } else {
                              setDays(value)
                            }
                          }}
                        />
                        <div className={styles.dateFont}>Days</div>
                      </div>
                      <div className="col-span-1 flex justify-start items-end gap-[10px]">
                        <Input
                          value={hours}
                          placeholder="0"
                          backgroundColor={'rgba(var(--main-bg-color-rgb), 0.05)'}
                          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                          width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '75px' : '122px'}
                          fullWidth
                          borderRadius="9px"
                          type="number"
                          min={0}
                          onChange={value => {
                            if (value < 0) {
                              setHours('')
                            } else {
                              setHours(value)
                            }
                          }}
                        />
                        <div className={styles.dateFont}>Hours</div>
                      </div>
                    </div>
                    <div className="mt-2 w-full text-start">
                      <div className={styles.label}>
                        The auction is due to end{' '}
                        <span className={styles.dateLabel}>
                          {day}
                          {', '}
                          {endDate.toLocaleDateString()}
                        </span>
                        {viewport !== 'xs' && viewport !== 'sm' && viewport !== 'md' && '(in your local time)'}
                      </div>
                    </div>
                  </div>
                )}

                <div className="w-full mt-[25px]">
                  <div className={styles.auctionStart}>
                    Minimum Bid Increment <span className={styles.auctionAsterisk}>*</span>
                  </div>
                </div>
                <div className="mt-[15px] w-full">
                  <PriceInput
                    value={minBidIncrement}
                    placeholder="Set the minimum bid increment"
                    backgroundColor={'rgba(var(--main-bg-color-rgb), 0.05)'}
                    fullWidth
                    type="number"
                    min={0}
                    height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                    onChange={value => {
                      if (value < 0) {
                        setMinBidIncrement('')
                      } else {
                        setMinBidIncrement(value)
                      }
                    }}
                  />
                </div>
                <div className="w-full mt-7">
                  <GradientButton
                    label="Publish Auction"
                    fullWidth
                    onClick={() => handleStartAuction()}
                    disabled={buttonDisabled}
                    opacity={buttonDisabled ? 0.5 : 1}
                  />
                </div>
                <div className="mt-[10px] w-full">
                  <p className={styles.termLabel}>
                    By clicking &quot;Publish Auction&quot;, you agree to the&nbsp;
                    <span className={styles.termService}>
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

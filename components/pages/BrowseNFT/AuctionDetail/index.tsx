import React, { useState, useEffect, useMemo } from 'react'

// next components
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// third party components
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

// custom functions
import { useViewport } from 'utils'
import { useAuthentication } from 'hooks/useAuthentication'

// custom component
import Input from 'components/Input'
import PriceInput from 'components/Input/PriceInput'

// resource
import BackIcon from 'assets/icons/back-small.svg?component'
import ArrowDownIcon from 'assets/icons/arrow-down-small.svg?component'

// styles
import styles from './index.module.scss'

// backend
import AuctionsAPI from 'apis/auctions'

// solana
import { startAuction } from 'utils/auctioneer.util'
import { useMetaplex } from 'hooks/useMetaplex'

const AuctionDetail = props => {
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
  const [startType, setStartType] = useState('soon')
  const [durationType, setDurationType] = useState('24')
  const [endPhaseType, setEndPhaseType] = useState('clock')
  const [endPhaseDurationType, setEndPhaseDurationType] = useState('none')
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
    <div className="w-full">
      <div className={styles.container}>
        <div className="w-full flex justify-between">
          <div className={styles.auctionDetail}>Auction Details</div>
          <div className={styles.backBtn}>
            <div className="w-full flex gap-[13px] justify-center items-center">
              <BackIcon />
              Back
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="w-full mt-[40px]">
            <div className={styles.auctionStart}>
              Auction Start <span className={styles.auctionAsterisk}>*</span>
            </div>
          </div>
          <div
            className={`w-full flex mt-[5px] ${
              viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-2' : 'gap-[70px]'
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

        <div className="w-full mt-[30px]">
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
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50px' : '50px'}
            onChange={value => {
              if (value < 0) {
                setReservePrice('')
              } else {
                setReservePrice(value)
              }
            }}
          />
        </div>

        <div className="w-full mt-[30px]">
          <div className={styles.auctionStart}>
            Auction Duration <span className={styles.auctionAsterisk}>*</span>
          </div>
        </div>
        <div
          className={`w-full flex flex-wrap mt-[15px] justify-between ${
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-2' : 'gap-8'
          }`}
        >
          <div
            className={durationType === '24' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setDays('')
              setHours('24')
              setDurationType('24')
            }}
          >
            24 hours
          </div>

          <div
            className={durationType === '48' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setDays('')
              setHours('48')
              setDurationType('48')
            }}
          >
            48 hours
          </div>

          <div
            className={durationType === '72' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setDays('')
              setHours('72')
              setDurationType('72')
            }}
          >
            72 hours
          </div>

          <div
            className={durationType === 'custom' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setDays('')
              setHours('')
              setDurationType('custom')
            }}
          >
            Custom
          </div>
        </div>

        {durationType === 'custom' && (
          <div>
            <div className="w-full mt-[30px]">
              <div className={styles.auctionStart}>
                Custom Duration <span className={styles.auctionAsterisk}>*</span>
              </div>
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
              <div className="w-[170px] flex justify-start items-end gap-[10px]">
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
                The auction is due to end&nbsp;
                <span className={styles.dateLabel}>
                  {day}
                  {', '}
                  {endDate.toLocaleDateString()}&nbsp;
                </span>
                {viewport !== 'xs' && viewport !== 'sm' && viewport !== 'md' && '(in your local time)'}
              </div>
            </div>
          </div>
        )}

        <div className="w-full mt-[30px]">
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
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50px' : '50px'}
            onChange={value => {
              if (value < 0) {
                setMinBidIncrement('')
              } else {
                setMinBidIncrement(value)
              }
            }}
          />
        </div>

        {/* End Phase */}
        <div className="w-full mt-[30px]">
          <div className={styles.auctionStart}>
            End Phase <span className={styles.auctionAsterisk}>*</span>
          </div>
          <div className={styles.description}>
            Setting the end phase to <span className={styles.descriptionSpan}>clock reset</span> will apply a 5-minute
            clock reset if a bid is placed in the last five minutes of the auction. If you select{' '}
            <span className={styles.descriptionSpan}>knife fight</span>, the auction duration will not be extended by
            final bids.
          </div>
        </div>

        <div
          className={`w-full flex flex-wrap mt-[15px] ${
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-2' : 'gap-8'
          }`}
        >
          <div
            className={endPhaseType === 'clock' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setEndPhaseType('clock')
            }}
          >
            Clock Reset
          </div>

          <div
            className={durationType === 'knife' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setEndPhaseType('knife')
            }}
          >
            Knife Fight
          </div>
        </div>

        {/* End Phase Duration */}
        <div className="w-full mt-[30px]">
          <div className={styles.auctionStart}>
            End Phase Duration&nbsp;<span className={styles.auctionAsterisk}>*</span>
          </div>
          <div className={styles.description}>
            Applying an end phase duration allows you to set a higher bid increment during the remaining given time
            frame.
          </div>
        </div>

        <div
          className={`w-full flex flex-wrap mt-[15px] ${
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-2' : 'gap-10'
          }`}
        >
          <div
            className={endPhaseDurationType === 'none' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setEndPhaseDurationType('None')
            }}
          >
            None
          </div>
          <div
            className={endPhaseDurationType === '15' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setEndPhaseDurationType('15')
            }}
          >
            15 mins
          </div>
          <div
            className={endPhaseDurationType === '30' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setEndPhaseDurationType('30')
            }}
          >
            30 mins
          </div>
          <div
            className={endPhaseDurationType === '60' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setEndPhaseDurationType('60')
            }}
          >
            60 mins
          </div>
        </div>
      </div>

      <div className={styles.startAuction}>Start Auction</div>
    </div>
  )
}

export default AuctionDetail

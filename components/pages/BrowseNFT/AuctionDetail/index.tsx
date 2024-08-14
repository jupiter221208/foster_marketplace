import React, { useState, useEffect, useMemo } from 'react'

// next components
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
import BackIcon from 'assets/icons/back-arrow.svg?component'
import ArrowDownIcon from 'assets/icons/arrow-down-white.svg?component'
import CalendarIcon from 'assets/icons/calendar-icon.svg?component'

// styles
import styles from './index.module.scss'

// backend
import AuctionsAPI from 'apis/auctions'

// solana
import { PublicKey } from '@solana/web3.js'
import { startAuction } from 'utils/auctioneer.util'
import { useMetaplex } from 'hooks/useMetaplex'
import { validDigits } from 'utils/helpers'
import LoadingButton from 'components/Button/LoadingButton'
import GradientButton from 'components/Button/GradientButton'

export interface AuctionDetailProps {
  data: {
    mintAddress: string
    name?: string
  }
  onSuccess: (name: string) => void
  onClose: () => void
  onRefreshPage?: () => void
  fromNFT: boolean
}

const AuctionDetail = ({ data, onSuccess, onClose, onRefreshPage, fromNFT }: AuctionDetailProps) => {
  const viewport = useViewport()
  const dispatch = useDispatch()

  const { refreshToken } = useAuthentication()

  const closeModal = () => {
    setMinBidIncrement(null)
    setEndBidIncrement(null)
    onClose()
  }

  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [days, setDays] = useState('')
  const [hours, setHours] = useState('24')
  const [minBidIncrement, setMinBidIncrement] = useState('')
  const [endBidIncrement, setEndBidIncrement] = useState('')
  const [reservePrice, setReservePrice] = useState('')
  const [startType, setStartType] = useState('soon')
  const [durationType, setDurationType] = useState('24')
  const [endPhaseType, setEndPhaseType] = useState('clock')
  const [endPhaseDurationType, setEndPhaseDurationType] = useState('none')
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [day, setDay] = useState('')
  const [dateDisabled, setDateDisabled] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setDateDisabled(false)
    }, 1000)
  }, [])

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
    try {
      await refreshToken()

      setIsLoading(true)
      const { auction } = await startAuction(
        mx,
        new PublicKey(data.mintAddress),
        startDate,
        endDate,
        Number(reservePrice),
        Number(minBidIncrement),
        endPhaseType == 'clock' ? 300 : null,
        endPhaseType == 'clock' ? 300 : null
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
        end_phase_extension_delta: endPhaseType === 'clock' ? 300 : null,
        end_phase_duration: endPhaseDurationType === 'none' ? null : parseInt(endPhaseDurationType) * 60,
        end_phase_bid_increment: parseFloat(endBidIncrement),
      }).then(res => {
        if (res) {
          onSuccess(data?.name)
          dispatch({ type: 'set', isGetListedNFTs: false })
          // setIsLoading(false)
          onRefreshPage?.()
        }
      })
    } catch (e: any) {
      setIsLoading(false)
    }
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
    else if (
      durationType === 'custom' &&
      (parseFloat(hours) > 23 || parseFloat(hours) < 0 || (days === '' && hours === ''))
    )
      disabled = true
    else if (!minBidIncrement) disabled = true
    else if (reservePrice === undefined || reservePrice === '' || reservePrice === null) disabled = true
    else if (
      endPhaseDurationType !== 'none' &&
      (endBidIncrement === undefined || endBidIncrement === '' || endBidIncrement === null)
    )
      disabled = true

    setButtonDisabled(disabled)
  }, [days, hours, reservePrice, minBidIncrement, endPhaseDurationType, endBidIncrement, durationType])

  return (
    <div className="w-full">
      <div
        className={`${styles.container} ${fromNFT ? styles.nftBG : ''} ${
          fromNFT ? 'mt-[0px]' : 'mt-[24px] lg:mt-[40px]'
        }`}
      >
        <div className={`w-full flex justify-between mt-[0px] lg:mt-[30px]`}>
          <div className={styles.auctionDetailText} onClick={() => closeModal()}>
            <BackIcon />
            Start Auction
          </div>
        </div>

        <div className="w-full">
          <div className="w-full mt-[30px]">
            <div className={styles.auctionStart}>Auction Start</div>
          </div>
          <div
            className={`w-full flex sm:flex-row flex-col mt-[15px] ${viewport === 'xs' ? 'gap-[15px]' : 'gap-[22px]'}`}
          >
            <div className={`w-full flex items-center`}>
              <div
                className={`${styles.radioText} ${
                  startType === 'soon' ? styles.selectedTimeBtn : styles.deselectedTimeBtn
                }`}
                onClick={() => {
                  setStartDate(new Date())
                  setStartType('soon')
                }}
              >
                Immediately
              </div>
            </div>

            <div className="w-full" onClick={() => setStartType('later')}>
              <div className="w-full startAuctionDatePicker">
                <div
                  className={`flex justify-between items-center px-[20px] overflow-hidden ${
                    startType === 'soon' ? styles.deselectedTimeBtn : styles.selectedTimeBtn
                  }`}
                >
                  <div className={`${startType === 'soon' ? styles.deselectedTimeIcon : styles.selectedTimeIcon}`}>
                    <CalendarIcon alt="" />
                  </div>
                  <DatePicker
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    dateFormat={'MM/dd/yyyy h:mm aa'}
                    formatWeekDay={nameOfDay => nameOfDay.substr(0, 3)}
                    minDate={moment().toDate()}
                    showTimeInput
                    timeInputLabel=""
                    className={`${styles.datePicker} ${
                      startType === 'soon' ? styles.deselectedPickerText : styles.selectedPickerText
                    }`}
                    disabled={dateDisabled}
                    customTimeInput={<CustomTimeInput date={null} value={null} onChange={null} />}
                  />
                  <div className={`${startType === 'soon' ? styles.deselectedTimeIcon : styles.selectedTimeIcon}`}>
                    <ArrowDownIcon alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-[30px] lg:mt-[30px]">
          <div className={styles.auctionStart}>Reserve Bid</div>
        </div>
        <div className="mt-[15px] w-full">
          <PriceInput
            value={reservePrice}
            placeholder="Set the reserve starting bid"
            fullWidth
            backgroundColor="var(--bg-151515-EEEDEB)"
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

        {/* Auction Duration */}
        <div className="w-full mt-[30px] lg:mt-[30px]">
          <div className={styles.auctionStart}>
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md'
              ? 'Auction Duration (hours)'
              : 'Auction Duration'}{' '}
          </div>
        </div>
        <div
          className={`w-full flex flex-wrap mt-[15px] ${
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-[15px]' : 'gap-[15px]'
          }`}
        >
          <div
            className={durationType === '24' ? styles.timeSelected : styles.timeDeselected}
            onClick={() => {
              setDays('')
              setHours('24')
              setDurationType('24')
            }}
          >
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '24' : '24 hours'}
          </div>

          <div
            className={durationType === '48' ? styles.timeSelected : styles.timeDeselected}
            onClick={() => {
              setDays('')
              setHours('48')
              setDurationType('48')
            }}
          >
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '48' : '48 hours'}
          </div>

          <div
            className={durationType === '72' ? styles.timeSelected : styles.timeDeselected}
            onClick={() => {
              setDays('')
              setHours('72')
              setDurationType('72')
            }}
          >
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '72' : '72 hours'}
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
            <div className="w-full mt-[30px] lg:mt-[30px]">
              <div className={styles.auctionStart}>Custom Duration</div>
            </div>
            <div className="mt-[15px] w-full flex gap-5">
              <div className="w-[170px] flex justify-start items-end gap-[10px]">
                <Input
                  value={days}
                  placeholder="Days"
                  backgroundColor="var(--bg-151515-EEEDEB)"
                  borderColor="rgba(var(--main-bg-color-rgb), 0.1)"
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50px' : '45px'}
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '160px' : '160px'}
                  fullWidth
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
              </div>
              <div className="w-[170px] flex justify-start items-end gap-[10px]">
                <Input
                  value={hours}
                  placeholder="Hours"
                  backgroundColor="var(--bg-151515-EEEDEB)"
                  borderColor="rgba(var(--main-bg-color-rgb), 0.1)"
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50px' : '45px'}
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '160px' : '160px'}
                  fullWidth
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

        <div className="w-full mt-[30px] lg:mt-[30px]">
          <div className={styles.auctionStart}>Minimum Bid Increment</div>
        </div>
        <div className="mt-[15px] w-full">
          <PriceInput
            value={minBidIncrement}
            placeholder="Set the minimum bid increment"
            backgroundColor="var(--bg-151515-EEEDEB)"
            fullWidth
            type="number"
            min={0}
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50px' : '45px'}
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
        <div className="w-full mt-[30px] lg:mt-[30px]">
          <div className={styles.auctionStart}>End Phase</div>
          <div className={styles.description}>
            Setting the end phase to clock reset will add 5 minutes to the auction if a bid is placed in the final 5
            minutes.
          </div>
        </div>

        <div
          className={`w-full flex flex-wrap mt-[15px] ${
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-6' : 'gap-8'
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
            className={endPhaseType === 'knife' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setEndPhaseType('knife')
            }}
          >
            Knife Fight
          </div>
        </div>

        {/* End Phase Duration */}
        <div className="w-full mt-[30px] lg:mt-[30px]">
          <div className={styles.auctionStart}>
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md'
              ? 'End Phase Duration (mins)'
              : 'End Phase Duration'}
          </div>
          <div className={styles.description}>
            Applying an end phase duration lets you set a higher bid increment for the remaining time set.
          </div>
        </div>

        <div
          className={`w-full flex flex-wrap mt-[15px] ${
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-[15px]' : 'gap-[15px]'
          }`}
        >
          <div
            className={endPhaseDurationType === 'none' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setEndPhaseDurationType('none')
            }}
          >
            None
          </div>
          <div
            className={endPhaseDurationType === '15' ? styles.timeSelected : styles.timeDeselected}
            onClick={() => {
              setEndPhaseDurationType('15')
            }}
          >
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '15' : '15 mins'}
          </div>
          <div
            className={endPhaseDurationType === '30' ? styles.timeSelected : styles.timeDeselected}
            onClick={() => {
              setEndPhaseDurationType('30')
            }}
          >
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '30' : '30 mins'}
          </div>
          <div
            className={endPhaseDurationType === '60' ? styles.timeSelected : styles.timeDeselected}
            onClick={() => {
              setEndPhaseDurationType('60')
            }}
          >
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '60' : '60 mins'}
          </div>
        </div>

        {/* End Phase Bid Increasement */}
        {endPhaseDurationType !== 'none' && (
          <div className="w-full">
            <div className="w-full mt-[30px] lg:mt-[30px]">
              <div className={styles.auctionStart}>End Phase Bid Increasement</div>
              <div className={styles.description}>
                {"The end phase bid increment is the amount by which bids increase during the auction's end phase."}
              </div>
            </div>
            <div className="mt-[15px] w-full">
              <PriceInput
                value={endBidIncrement}
                placeholder="Set the end phase bid increment"
                backgroundColor="var(--bg-151515-EEEDEB)"
                fullWidth
                type="number"
                min={0}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50px' : '45px'}
                onChange={value => {
                  if (value < 0) {
                    setEndBidIncrement('')
                  } else {
                    setEndBidIncrement(value)
                  }
                }}
              />
            </div>
          </div>
        )}
        <div className="mt-[30px] mb-[45px] lg:mb-[80px] w-full">
          {isLoading ? (
            <LoadingButton fullWidth height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 56} />
          ) : (
            <GradientButton
              label="Start Auction"
              fullWidth
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 50}
              borderColor="transparent"
              backgroundColor01="var(--main-icon-color)"
              backgroundColor02="var(--main-icon-color)"
              disabled={buttonDisabled}
              color="var(--background-main-color)"
              onClick={() => handleStartAuction()}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AuctionDetail

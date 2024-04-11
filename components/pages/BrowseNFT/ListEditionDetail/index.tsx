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
import BackIcon from 'assets/icons/back-small.svg?component'
import ArrowDownIcon from 'assets/icons/arrow-down-small.svg?component'

// styles
import styles from './index.module.scss'

// backend
import { listMasterEdition } from 'apis/editions'

// solana
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useMetaplex } from 'hooks/useMetaplex'
import { validDigits } from 'utils/helpers'
import LoadingButton from 'components/Button/LoadingButton'
import GradientButton from 'components/Button/GradientButton'
import { delegateEdition, findPrintDelegate } from 'utils/editions'

export interface ListEditionDetailProps {
  data: {
    mintAddress: string
    name?: string
  }
  onSuccess: (name: string) => void
  onClose: () => void
  onRefreshPage?: () => void
}

const ListEditionDetail = ({ data, onSuccess, onClose, onRefreshPage }: ListEditionDetailProps) => {
  const viewport = useViewport()

  const { metaplex } = useMetaplex()

  const closeModal = () => {
    setBuyLimit('')
    onClose()
  }

  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [days, setDays] = useState('')
  const [hours, setHours] = useState('24')
  const [buyLimit, setBuyLimit] = useState('')
  const [mintPrice, setMintPrice] = useState('')
  const [startType, setStartType] = useState('soon')
  const [durationType, setDurationType] = useState('24')
  const [buyLimitType, setBuyLimitType] = useState('no')
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

  const handleListEdition = async () => {
    try {
      setIsLoading(true)

      let listing = await listMasterEdition({
        mintAddress: data.mintAddress,
        price: (parseFloat(mintPrice) * LAMPORTS_PER_SOL).toFixed(0),
        startTime: startDate.toISOString().split('.')[0],
        endTime: endDate.toISOString().split('.')[0],
        buyLimit: buyLimit.length === 0 ? 0 : parseInt(buyLimit),
      })

      let mint = new PublicKey(data.mintAddress)
      let owner = metaplex.identity().publicKey
      let delegate = new PublicKey(listing.authorityPublicKey)
      let printDelegateAddress = findPrintDelegate({
        mint,
        owner,
        delegate,
      })

      let printDelegateAccount
      for (let i = 0; i < 5; i++)
        try {
          console.log(`delegating master edition: attempt ${i + 1}`)
          await delegateEdition({
            metaplex,
            mint,
            delegate,
          })
          await new Promise(resolve => setTimeout(resolve, 1000))

          printDelegateAccount = await metaplex.rpc().getAccount(printDelegateAddress, 'single')
          if (printDelegateAccount.exists) break
        } catch (e: any) {
          console.error(`delegating failed: ${e?.message ?? e}`)
          console.error(e)
        }

      if (!printDelegateAccount.exists) {
        // show error to user
        setIsLoading(false)
        return
      }

      onSuccess(data?.name)
      setIsLoading(false)
      onClose()

      // TODO: send listing to backend with listing details
    } catch (e: any) {
      console.error(e)
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
    else if (durationType === 'custom' && (parseFloat(hours) > 23 || parseFloat(hours) === 0)) disabled = true
    else if (durationType === 'custom' && days === '' && hours === '') disabled = true
    else if (mintPrice === undefined || mintPrice === '' || mintPrice === null) disabled = true
    else if (buyLimitType !== 'no' && buyLimit === '') disabled = true
    setButtonDisabled(disabled)
  }, [days, hours, mintPrice, buyLimitType, buyLimit])

  return (
    <div className="w-full">
      <div className={styles.container}>
        <div className="w-full flex justify-between">
          <div className={styles.title}>List Edition</div>
          <div className={styles.backBtn} onClick={() => closeModal()}>
            <div className="w-full flex gap-[13px] justify-center items-center">
              <BackIcon />
              Back
            </div>
          </div>
        </div>

        <div className="w-full mt-[30px]">
          <div className={styles.auctionStart}>
            Mint Price <span className={styles.auctionAsterisk}>*</span>
          </div>
        </div>
        <div className="mt-[15px] w-full">
          <PriceInput
            value={mintPrice}
            placeholder="Set the price of your editions"
            fullWidth
            type="number"
            min={0}
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50px' : '50px'}
            onChange={value => {
              if (value < 0) {
                setMintPrice('')
              } else {
                setMintPrice(value)
              }
            }}
          />
        </div>

        <div className="w-full">
          <div className="w-full mt-[20px] lg:mt-[40px]">
            <div className={styles.auctionStart}>
              Start Time <span className={styles.auctionAsterisk}>*</span>
            </div>
          </div>
          <div
            className={`w-full flex mt-[5px] ${
              viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'justify-between' : 'gap-[70px]'
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

        {/* Mint Duration */}
        <div className="w-full mt-[20px] lg:mt-[30px]">
          <div className={styles.auctionStart}>
            Mint Duration <span className={styles.auctionAsterisk}>*</span>
          </div>
        </div>
        <div
          className={`w-full flex flex-wrap mt-[15px] ${
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-[15px]' : 'gap-[30px]'
          }`}
        >
          <div
            className={durationType === 'noTime' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setDays('')
              setHours('')
              setDurationType('noTime')
            }}
          >
            No End Time
          </div>

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
            <div className="w-full mt-[20px] lg:mt-[30px]">
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
                The edition listing is due to end&nbsp;
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

        {/* Buy Limit */}
        <div className="w-full mt-[20px] lg:mt-[30px]">
          <div className={styles.auctionStart}>Buy Limit Per Wallet (optional)</div>
          <div className={styles.description}>The max number of prints that can be minted per wallet.</div>
        </div>

        <div
          className={`w-full flex flex-wrap mt-[15px] ${
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-[15px]' : 'gap-[30px]'
          }`}
        >
          <div
            className={buyLimitType === 'no' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setBuyLimitType('no')
            }}
          >
            No Limit
          </div>
          <div
            className={buyLimitType === '1' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setBuyLimitType('1')
              setBuyLimit('1')
            }}
          >
            1
          </div>
          <div
            className={buyLimitType === '5' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setBuyLimitType('5')
              setBuyLimit('5')
            }}
          >
            5
          </div>
          <div
            className={buyLimitType === 'custom' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setBuyLimitType('custom')
              setBuyLimit('10')
            }}
          >
            Custom
          </div>
        </div>

        {/* Custom Buy Limit */}
        {buyLimitType === 'custom' && (
          <div>
            <div className="mt-[20px] lg:mt-[30px]">
              <div className={styles.auctionStart}>
                Custom Buy Limit&nbsp;<span className={styles.auctionAsterisk}>*</span>
              </div>
            </div>
            <div className="w-auto mt-[15px] flex gap-[10px]">
              <div>
                <Input
                  value={buyLimit}
                  placeholder="10"
                  backgroundColor={'rgba(var(--main-bg-color-rgb), 0.05)'}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '75px' : '122px'}
                  borderRadius="9px"
                  borderColor="transparent"
                  fontFamily="Muli-Bold"
                  min={0}
                  onChange={value => {
                    let limit = validDigits(value)
                    if (limit < 0) {
                      setBuyLimit('')
                    } else {
                      setBuyLimit(limit)
                    }
                  }}
                />
              </div>
              <div className={styles.mintsWallet}>Mints/Wallet</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-[45px] w-full">
        {isLoading ? (
          <LoadingButton fullWidth height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 56} />
        ) : (
          <GradientButton
            fullWidth
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 45 : 56}
            label="List Edition"
            borderWidth={1}
            backgroundColor01="var(--main-icon-color)"
            backgroundColor02="var(--main-icon-color)"
            color="var(--background-main-color)"
            disabled={buttonDisabled}
            opacity={buttonDisabled ? 0.5 : 1}
            onClick={() => handleListEdition()}
          />
        )}
      </div>
    </div>
  )
}

export default ListEditionDetail

import React, { useState, useEffect, useMemo } from 'react'

// next components
import { Switch as HSwitch } from '@headlessui/react'

// third party components
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

// custom functions
import { useViewport } from 'utils'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'

// custom component
import Input from 'components/Input'
import PriceInput from 'components/Input/PriceInput'

// resource
import BackIcon from 'assets/icons/back-arrow.svg?component'
import ArrowDownIcon from 'assets/icons/arrow-down-white.svg?component'
import CloseIcon from 'assets/icons/close-white-9x9.svg?component'
import CalendarIcon from 'assets/icons/calendar-icon.svg?component'

import SolanaIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import ArrowDownWhiteIcon from 'assets/icons/arrow-down-white.svg?component'
import ArrowTopWhiteIcon from 'assets/icons/arrow-up-white.svg?component'

// styles
import styles from './index.module.scss'

// backend
import { listMasterEdition, updateEditionListing, cancelListingEdition } from 'apis/editions'
import StoreAPI from 'apis/store'

// solana
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useAuthentication } from 'hooks/useAuthentication'
import { useMetaplex } from 'hooks/useMetaplex'
import { convertMerchDescription, convertMerchType, validDigits } from 'utils/helpers'
import { delegateEdition, findPrintDelegate } from 'utils/editions'
import LoadingSecondaryButton from 'components/Button/LoadingSecondaryButton'
import MerchShopSelectModal from 'components/Modal/MerchShopSelectModal'
import ImageWithFoster from 'components/ImageWithFoster'
import GradientButton from 'components/Button/GradientButton'

export interface ListEditionDetailProps {
  data: {
    mintAddress: string
    name?: string
    supply?: any
  }
  listingType: string
  onSuccess: (name: string) => void
  onClose: () => void
  fromNFT: boolean
  merchItem?: any
}

const ListEditionDetail = ({
  data,
  listingType,
  onSuccess,
  onClose,
  fromNFT,
  merchItem = null,
}: ListEditionDetailProps) => {
  const viewport = useViewport()
  const { solToUsdRate } = useSolToUsdRate()
  const { metaplex } = useMetaplex()
  const { profileInfo } = useAuthentication()

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
  const [durationType, setDurationType] = useState<'noTime' | '24' | '72' | 'custom'>('noTime')
  const [buyLimitType, setBuyLimitType] = useState('no')
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [enableMerch, setEnableMerch] = useState(false)
  const [showMerchModal, setShowMerchModal] = useState(false)
  const [day, setDay] = useState('')
  const [merchCard, setMerchCard] = useState(null)
  const [totalCostExpand, setTotalCostExpand] = useState(false)
  const [merchProdCost, setMerchProdCost] = useState(0)
  const [dateDisabled, setDateDisabled] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setDateDisabled(false)
    }, 1000)
  }, [])

  useEffect(() => {
    if (merchCard) setMerchProdCost(merchCard.selling_price / 100 / solToUsdRate)
    else setMerchProdCost(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchCard])

  useEffect(() => {
    if (merchItem) {
      setMerchCard(merchItem)
      setEnableMerch(true)
    }
  }, [merchItem])

  const endDate = useMemo(() => {
    if (durationType == 'noTime') return null

    let plusDays = Number(days)
    let plusHours = Number(hours)

    if (days === '') plusDays = 0
    if (hours === '') plusHours = 0

    const endDate = new Date(startDate)
    endDate.setTime(startDate.getTime() + plusDays * 24 * 60 * 60 * 1000 + plusHours * 60 * 60 * 1000)

    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayOfWeek = day[endDate.getDay()]
    setDay(dayOfWeek)
    return endDate
  }, [startDate, days, hours, durationType])

  const handleListEdition = async () => {
    try {
      setIsLoading(true)

      let listing = await listMasterEdition({
        mintAddress: data.mintAddress,
        price: (parseFloat(mintPrice) * LAMPORTS_PER_SOL).toFixed(0),
        startTime: startDate.toISOString().split('.')[0],
        endTime: endDate?.toISOString().split('.')[0],
        buyLimit: buyLimit.length === 0 ? 0 : parseInt(buyLimit),
        linkedMerchProduct: merchCard ? merchCard.id : null,
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
      for (let i = 0; i < 5; i++) {
        console.log(`delegating master edition: attempt ${i + 1}`)
        printDelegateAccount = await metaplex.rpc().getAccount(printDelegateAddress, 'single')
        if (printDelegateAccount.exists) break

        let signature = await delegateEdition({
          metaplex,
          mint,
          delegate,
        })
        if (!signature) console.error(`could not delegate ${mint} to ${delegate}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      if (!printDelegateAccount.exists) {
        // show error to user
        await cancelListingEdition(data.mintAddress)
        if (merchCard)
          await StoreAPI.updateStoreById(profileInfo.id, merchCard.id, {
            master_edition_address: '',
            supply: null,
          })
        setIsLoading(false)
        return
      }

      if (profileInfo && merchCard)
        await StoreAPI.updateStoreById(profileInfo.id, merchCard.id, {
          master_edition_address: data.mintAddress,
          supply: data.supply?.max,
        })

      onSuccess(data?.name)

      // TODO: send listing to backend with listing details
    } catch (e: any) {
      console.error(e)
      await cancelListingEdition(data.mintAddress)
      if (merchCard)
        await StoreAPI.updateStoreById(profileInfo.id, merchCard.id, {
          master_edition_address: '',
          supply: null,
        })
      setIsLoading(false)
    }
  }

  const handleUpdateEdition = async () => {
    try {
      setIsLoading(true)

      if (merchItem) {
        if (merchCard === null || merchItem.id != merchCard.id) {
          await StoreAPI.updateStoreById(profileInfo.id, merchItem.id, {
            master_edition_address: '',
            supply: null,
          })
        }
      }

      if (profileInfo && merchCard)
        await StoreAPI.updateStoreById(profileInfo.id, merchCard.id, {
          master_edition_address: data.mintAddress,
          supply: data.supply?.max,
        })

      updateEditionListing({
        mintAddress: data.mintAddress,
        price: (parseFloat(mintPrice) * LAMPORTS_PER_SOL).toFixed(0),
        startTime: startDate.toISOString().split('.')[0],
        endTime: endDate.toISOString().split('.')[0],
        buyLimit: buyLimit.length === 0 ? 0 : parseInt(buyLimit),
      }).then(response => {
        onSuccess(data?.name)
        closeModal()
      }),
        error => {
          console.log(error)
        }
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
        // style={{ border: 'solid 1px rgba(#EFF0F6, 0.1)' }}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, hours, mintPrice, buyLimitType, buyLimit])

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className={`${styles.container} ${fromNFT ? styles.nftBG : 'px-[16px] lg:px-[0px]'}`}>
        <div className="w-full flex justify-between">
          <div className={styles.title} onClick={() => closeModal()}>
            <BackIcon />
            List Edition
          </div>
        </div>

        <div className="w-full">
          <div className="w-full mt-[20px] lg:mt-[30px]">
            <div className={styles.auctionStart}>Start Time</div>
          </div>
          <div className={`w-full sm:flex-row flex-col mt-[15px] ${viewport === 'xs' ? 'gap-[15px]' : 'gap-[22px]'}`}>
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
            <div className="w-full" onClick={() => setStartType('later')}>
              <div className={`w-full startAuctionDatePicker`}>
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
                    dateFormat={
                      viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'MM/dd/yyyy' : 'MM/dd/yyyy h:mm aa'
                    }
                    formatWeekDay={nameOfDay => nameOfDay.substr(0, 3)}
                    minDate={moment().toDate()}
                    showTimeInput
                    timeInputLabel=""
                    disabled={dateDisabled}
                    className={`${styles.datePicker} ${
                      startType === 'soon' ? styles.deselectedPickerText : styles.selectedPickerText
                    }`}
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

        <div className="w-full mt-[30px]">
          <div className={styles.auctionStart}>Edition Price</div>
        </div>
        <div className="mt-[15px] w-full">
          <PriceInput
            value={mintPrice}
            placeholder="Set the price of your editions"
            fullWidth
            backgroundColor="var(--bg-151515-EEEDEB)"
            type="number"
            min={0}
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50px' : '45px'}
            onChange={value => {
              if (value < 0) {
                setMintPrice('')
              } else {
                setMintPrice(value)
              }
            }}
          />
        </div>

        <div className="w-full mt-[30px]">
          <div className="flex justify-between lg:gap-[13px]">
            <div className={styles.merchEdition}>Merch Edition</div>
            <HSwitch
              checked={enableMerch}
              onChange={() => {
                setEnableMerch(!enableMerch)
                setShowMerchModal(!enableMerch)
                if (enableMerch === true) {
                  setMerchProdCost(0)
                  setMerchCard(null)
                }
              }}
              className={`${
                enableMerch ? styles.active : styles.inactive
              } relative inline-flex h-6 w-[42px] items-center rounded-full`}
            >
              <span
                className={`transform transition ease-in-out duration-200 ${
                  enableMerch ? 'translate-x-5' : 'translate-x-1'
                } ${
                  enableMerch ? styles.activeSwitch : styles.inactiveSwitch
                } inline-block h-[18px] w-[18px] transform rounded-full bg-white`}
              />
            </HSwitch>
          </div>
          <div className={`${styles.merchText} mt-[12px]`}>Include merch with each edition purchased</div>
        </div>

        {enableMerch && merchCard && (
          <div className={styles.merchArea}>
            <div className="w-full flex gap-[10px] lg:gap-[15px] mt-[11px] ml-[12px] sm:ml-[16px]">
              <div className={styles.assetArea}>
                <ImageWithFoster width={65} src={merchCard.options.addons[0].mockup_url} />
              </div>
              <div className={styles.contentArea}>
                <div className={styles.merchTitle}>Merch item included</div>
                <div className={styles.merchContent}>{merchCard.name}</div>
              </div>
            </div>

            <div
              className={styles.merchButton}
              onClick={() => {
                setMerchCard(null)
                setEnableMerch(false)
              }}
            >
              <CloseIcon />
            </div>
          </div>
        )}

        {/* Listing Duration */}
        <div className="w-full mt-[30px] lg:mt-[30px]">
          <div className={styles.auctionStart}>
            {viewport === 'xs' || viewport === 'xs' || viewport === 'xs'
              ? 'Listing Expiration (hours)'
              : 'Listing Expiration'}
          </div>
        </div>
        <div className={`w-full flex flex-wrap mt-[15px] ${viewport === 'xs' ? 'gap-[11px]' : 'gap-[25px]'}`}>
          <div
            className={durationType === 'noTime' ? styles.noneSelected : styles.noneDeselected}
            onClick={() => {
              setDays('')
              setHours('')
              setDurationType('noTime')
            }}
          >
            None
          </div>

          <div
            className={durationType === '24' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setDays('')
              setHours('24')
              setDurationType('24')
            }}
          >
            {viewport === 'xs' ? '24' : '24 hours'}
          </div>

          <div
            className={durationType === '72' ? styles.durationSelected : styles.durationDeselected}
            onClick={() => {
              setDays('')
              setHours('72')
              setDurationType('72')
            }}
          >
            {viewport === 'xs' ? '72' : '72 hours'}
          </div>

          <div
            className={durationType === 'custom' ? styles.customSelected : styles.customDeselected}
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
              <div className={styles.auctionStart}>Custom Duration</div>
            </div>
            <div className="mt-[15px] w-full flex gap-5">
              <div className="w-[170px] flex justify-start items-end gap-[10px]">
                <Input
                  value={days}
                  placeholder="Days"
                  backgroundColor="var(--bg-151515-EEEDEB)"
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50px' : '45px'}
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '160px' : '160px'}
                  fullWidth
                  borderColor="rgba(var(--main-bg-color-rgb), 0.1)"
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
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50px' : '45px'}
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '160px' : '160px'}
                  fullWidth
                  borderColor="rgba(var(--main-bg-color-rgb), 0.1)"
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
        <div className="w-full mt-[30px] lg:mt-[30px]">
          <div className={styles.auctionStart}>Buy Limit Per Wallet</div>
        </div>

        <div
          className={`w-full flex flex-wrap mt-[15px] ${
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-[11px]' : 'gap-[25px]'
          }`}
        >
          <div
            className={buyLimitType === 'no' ? styles.noneSelected : styles.noneDeselected}
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
            className={buyLimitType === 'custom' ? styles.customSelected : styles.customDeselected}
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
            <div className="mt-[30px] lg:mt-[30px]">
              <div className={styles.auctionStart}>Custom Buy Limit</div>
            </div>
            <div className="w-auto mt-[15px] flex gap-[10px]">
              <div>
                <Input
                  value={buyLimit}
                  placeholder="Mints per wallet"
                  backgroundColor="var(--bg-151515-EEEDEB)"
                  borderColor="rgba(var(--main-bg-color-rgb), 0.1)"
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50px' : '45px'}
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '220px' : '242px'}
                  borderRadius="9px"
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
            </div>
          </div>
        )}
        {totalCostExpand ? (
          <div className={styles.totalCostExpand} onClick={() => setTotalCostExpand(false)}>
            <div className="w-full flex justify-between">
              <div className={styles.totalCost}>Total Cost Per Mint</div>
              <div className="flex items-center">
                <SolanaIcon className="mt-[2px]" />
                <div className={styles.price}>
                  {mintPrice === '' ? '---' : (parseFloat(mintPrice) * 1.05 + merchProdCost).toFixed(2)}
                </div>
                <div className="ml-[11px]">
                  <ArrowTopWhiteIcon />
                </div>
              </div>
            </div>
            <div className={styles.costBorder} />
            <div className="w-full mt-[15px] flex justify-between">
              <div className={styles.mintPrice}>Artwork Mint Price</div>
              <div className={styles.mintSol}>{mintPrice} SOL</div>
            </div>
            <div className="w-full mt-[15px] flex justify-between">
              <div className={styles.mintPrice}>Merch Production Cost</div>
              <div className={styles.mintSol}>{merchProdCost.toFixed(2)} SOL</div>
            </div>
            <div className="w-full mt-[15px] mb-[22px] flex justify-between">
              <div className={styles.mintPrice}>Foster Fee (5%)</div>
              <div className={styles.mintSol}>{(parseFloat(mintPrice) * 0.05).toFixed(2)} SOL</div>
            </div>
          </div>
        ) : (
          <div className={styles.totalCostCollapse} onClick={() => setTotalCostExpand(true)}>
            <div className={styles.totalCost}>Total Cost Per Mint</div>
            <div className="flex h-[20px] items-center">
              <SolanaIcon className="mt-[2px]" />
              <div className={styles.price}>
                {mintPrice === '' ? '---' : (parseFloat(mintPrice) * 1.05 + merchProdCost).toFixed(2)}
              </div>
              <div className="ml-[11px]">
                <ArrowDownWhiteIcon />
              </div>
            </div>
          </div>
        )}
        <div className={`mt-[15px]  ${fromNFT ? 'mb-[20px]' : 'mb-[40px] lg:mb-[0px]'} w-full`}>
          {isLoading ? (
            <LoadingSecondaryButton fullWidth />
          ) : (
            <GradientButton
              fullWidth
              label="List Edition"
              disabled={
                mintPrice === '' ||
                parseFloat(mintPrice) === 0 ||
                (durationType === 'custom' &&
                  (hours === '' || parseFloat(hours) === 0) &&
                  (parseFloat(days) === 0 || days === '')) ||
                (buyLimitType === 'custom' && (buyLimit === '' || parseFloat(buyLimit) === 0))
              }
              onClick={() => {
                if (listingType === 'list') handleListEdition()
                else handleUpdateEdition()
              }}
            />
          )}
        </div>
      </div>
      <MerchShopSelectModal
        oldCard={merchItem}
        open={showMerchModal}
        close={status => {
          setShowMerchModal(false)
          setEnableMerch(false)
        }}
        selectCard={item => {
          setShowMerchModal(false)
          setEnableMerch(true)
          setMerchCard(item)
        }}
      />
    </div>
  )
}

export default ListEditionDetail

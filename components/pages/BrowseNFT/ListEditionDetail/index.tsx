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
import ArrowDownIcon from 'assets/icons/arrow-down-small.svg?component'
import SolanaIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import ArrowDownWhiteIcon from 'assets/icons/arrow-down-white.svg?component'
import ArrowTopWhiteIcon from 'assets/icons/arrow-up-white.svg?component'
import TrashMobileIcon from 'assets/icons/trash-white.svg?component'

// styles
import styles from './index.module.scss'

// backend
import { listMasterEdition, updateEditionListing, cancelListingEdition } from 'apis/editions'
import StoreAPI from 'apis/store'

// solana
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useAuthentication } from 'hooks/useAuthentication'
import { useMetaplex } from 'hooks/useMetaplex'
import { convertMerchDescription, validDigits } from 'utils/helpers'
import { delegateEdition, findPrintDelegate } from 'utils/editions'
import SecondaryButton from 'components/Button/SecondaryButton'
import LoadingSecondaryButton from 'components/Button/LoadingSecondaryButton'
import MerchShopSelectModal from 'components/Modal/MerchShopSelectModal'
import ImageWithFoster from 'components/ImageWithFoster'

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
}

const ListEditionDetail = ({ data, listingType, onSuccess, onClose, fromNFT }: ListEditionDetailProps) => {
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
  const [durationType, setDurationType] = useState<'noTime' | '24' | '72' | 'custom'>('24')
  const [buyLimitType, setBuyLimitType] = useState('no')
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [enableMerch, setEnableMerch] = useState(false)
  const [showMerchModal, setShowMerchModal] = useState(false)
  const [day, setDay] = useState('')
  const [merchCard, setMerchCard] = useState(null)
  const [totalCostExpand, setTotalCostExpand] = useState(false)
  const [merchProdCost, setMerchProdCost] = useState(0)

  useEffect(() => {
    if (merchCard) setMerchProdCost(merchCard.selling_price / 100 / solToUsdRate)
    else setMerchProdCost(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchCard])

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
      setIsLoading(false)
    }
  }

  const handleUpdateEdition = async () => {
    try {
      setIsLoading(true)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, hours, mintPrice, buyLimitType, buyLimit])

  const convertMerchType = type => {
    if (type === 'Direct-to-Garment') return 'DTG'
    return type
  }

  const getMerchContent = data => {
    return (
      convertMerchDescription(data.split(' | ')[0]) +
      ' | ' +
      convertMerchType(data.split(' | ')[2]) +
      ' | ' +
      data.split(' | ')[3]
    )
  }

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className={`${styles.container} ${fromNFT ? styles.nftBG : ''}`}>
        <div className="w-full flex justify-between">
          <div className={styles.title} onClick={() => closeModal()}>
            <BackIcon />
            List Edition
          </div>
        </div>

        <div className="w-full mt-[20px]">
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

        <div className="w-full mt-[20px]">
          <div className="flex gap-[13px]">
            <HSwitch
              checked={enableMerch}
              onChange={() => {
                setEnableMerch(!enableMerch)
                setShowMerchModal(!enableMerch)
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
            <div className={styles.merchText}>Include merch for each print</div>
          </div>
        </div>

        {enableMerch && merchCard && (
          <div className={styles.merchArea}>
            <div className="w-full flex gap-[10px] lg:gap-[15px] mt-[11px] ml-[12px] sm:ml-[16px]">
              <div className={styles.assetArea}>
                <ImageWithFoster width={65} src={merchCard.options.product_images[0]} />
              </div>
              <div className={styles.contentArea}>
                <div className={styles.merchTitle}>Merch included for each sale</div>
                <div className={styles.merchContent}>{getMerchContent(merchCard.description)}</div>
              </div>
            </div>
            <div className="sm:block hidden">
              <div
                className={styles.merchButton}
                onClick={() => {
                  setMerchCard(null)
                  setEnableMerch(false)
                }}
              >
                Remove
              </div>
            </div>
            <div
              className="sm:hidden absolute flex top-[0px] right-[15px] h-full items-center justify-center"
              onClick={() => {
                setMerchCard(null)
                setEnableMerch(false)
              }}
            >
              <TrashMobileIcon alt="" />
            </div>
          </div>
        )}
        <div className="w-full">
          <div className="w-full mt-[20px] lg:mt-[20px]">
            <div className={styles.auctionStart}>
              Start Time <span className={styles.auctionAsterisk}>*</span>
            </div>
          </div>
          <div
            className={`w-full flex mt-[5px] ${
              viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-[30px]' : 'gap-[70px]'
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

        {/* Listing Duration */}
        <div className="w-full mt-[20px] lg:mt-[30px]">
          <div className={styles.auctionStart}>
            {viewport === 'xs' || viewport === 'xs' || viewport === 'xs'
              ? 'Listing Expiration (hrs)'
              : 'Listing Expiration'}
            <span className={styles.auctionAsterisk}>*</span>
          </div>
        </div>
        <div className={`w-full flex flex-wrap mt-[12px] ${viewport === 'xs' ? 'gap-[11px]' : 'gap-[25px]'}`}>
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
        <div className={`mt-[35px]  ${fromNFT ? 'lg:mt-[30px]' : 'lg:mt-[30px] mb-[40px]'} w-full`}>
          {isLoading ? (
            <LoadingSecondaryButton fullWidth />
          ) : (
            <SecondaryButton
              fullWidth
              type="list-artwork"
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

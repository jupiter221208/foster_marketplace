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

// images
import AudioPlayerBackground from 'assets/images/audio-player.png'
import ArrowDownIcon from 'assets/icons/arrow-down-small.svg'

// styles
import styles from './index.module.scss'

// backend
import AuctionsAPI from 'apis/auctions'

// solana
import { startAuction } from 'utils/auctioneer.util'
import { useMetaplex } from 'hooks/useMetaplex'
import { useDispatch } from 'react-redux'
import { checkExpiryDate, getSignMessageVerbiage, loginWithSigned } from 'utils/auth'
import { useWallet } from '@solana/wallet-adapter-react'

const StartAuctionModal = props => {
  const { data, open, onSuccess, onClose, onStartProgress } = props
  const viewport = useViewport()
  const dispatch = useDispatch()
  const { publicKey, signMessage } = useWallet()

  const closeModal = () => {
    setPrice(null)
    onClose()
  }

  const [startDate, setStartDate] = useState(new Date())
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [price, setPrice] = useState()
  const [buttonDisabled, setButtonDisabled] = useState(true)

  const endDate = useMemo(() => {
    var plusDays = days
    var plusHours = hours

    if (!days) plusDays = 0
    if (!hours) plusHours = 0

    const endDate = new Date(startDate)
    endDate.setTime(startDate.getTime() + plusDays * 24 * 60 * 60 * 1000 + plusHours * 60 * 60 * 1000)

    return endDate
  }, [startDate, days, hours])

  const { metaplex: mx } = useMetaplex()

  const handleStartAuction = async () => {
    if (!checkExpiryDate()) {
      let signature = await signMessage(Buffer.from(getSignMessageVerbiage(publicKey)))
      await loginWithSigned(publicKey, signature, dispatch)
    }

    onStartProgress()
    console.log('================', mx, data.mintAddress, startDate, endDate, price)
    const { auction } = await startAuction(mx, data.mintAddress, startDate, endDate, price)
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
    if (days < 0 || days > 30) disabled = true
    else if (days === 0 && hours === 0) disabled = true
    else if (hours > 23) disabled = true
    else if (price === undefined || price === '' || parseFloat(price) === 0) disabled = true

    setButtonDisabled(disabled)
  }, [days, hours, price])

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
                        fill="var(--modal-close-btn-bg)"
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
                      src={
                        data?.json === null || data?.json.image === undefined || data?.json.image === null
                          ? AudioPlayerBackground.src
                          : data?.json.image
                      }
                      alt={data?.json?.name || data?.name}
                      className="w-full aspect-[321/321] object-cover"
                    />
                  )}
                </div>
                <div className="w-full flex justify-center">
                  <div className={`${styles.nftName} mt-4 lg:mt-5`}>{data?.json?.name}</div>
                </div>
                <input className="w-0 h-9" />
                <div className="mt-10 lg:mt-5 w-full startAuctionDatePicker">
                  <div className="relative">
                    <DatePicker
                      selected={startDate}
                      onChange={date => setStartDate(date)}
                      dateFormat="MM/dd/yyyy h:mm aa"
                      formatWeekDay={nameOfDay => nameOfDay.substr(0, 3)}
                      minDate={moment().toDate()}
                      showTimeInput
                      timeInputLabel=""
                      className={styles.datePicker}
                      customTimeInput={<CustomTimeInput date={null} value={null} onChange={null} />}
                    />
                    <div className="absolute top-[8px] right-4">
                      <Image src={ArrowDownIcon} alt="" />
                    </div>
                  </div>

                  <div className="mt-2 w-full text-start">
                    <div className={styles.label}>Schedule auction start date and time</div>
                  </div>
                </div>
                <div className="mt-[38px] w-full grid grid-cols-2 gap-5 lg:gap-[57px]">
                  <div className="col-span-1 flex justify-start items-end gap-[10px]">
                    <Input
                      placeholder="0"
                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                      width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '75px' : '122px'}
                      fullWidth
                      borderRadius="9px"
                      type="number"
                      onChange={value => {
                        setButtonDisabled(value < 0 || value > 30 || price === undefined)
                        setDays(value)
                      }}
                    />
                    <div className={styles.dateFont}>DAYS</div>
                  </div>
                  <div className="col-span-1 flex justify-start items-end gap-[10px]">
                    <Input
                      placeholder="0"
                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                      width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '75px' : '122px'}
                      fullWidth
                      borderRadius="9px"
                      type="number"
                      onChange={value => setHours(value)}
                    />
                    <div className={styles.dateFont}>HOURS</div>
                  </div>
                </div>
                <div className="mt-2 w-full text-start">
                  <div className={styles.label}>
                    The auction is due to end <span className={styles.dateLabel}>{endDate.toLocaleDateString()}</span>
                    {viewport !== 'xs' && viewport !== 'sm' && viewport !== 'md' && '(in your local time)'}
                  </div>
                </div>
                <div className="mt-[49px] w-full">
                  <PriceInput
                    value={price}
                    placeholder="Enter starting bid"
                    backgroundColor={'rgba(var(--main-bg-color-rgb), 0.05)'}
                    fullWidth
                    height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                    onChange={value => {
                      setPrice(value)
                    }}
                  />
                </div>
                <div className="mt-2 w-full flex gap-2 items-center">
                  <div className={styles.label}>Minimum bid increment: 0.1 SOL</div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 9 9">
                    <path
                      id="noun-help-2123682"
                      d="M13.332,8.855a4.477,4.477,0,1,0,4.477,4.477A4.482,4.482,0,0,0,13.332,8.855Zm-.6,1.806a.113.113,0,0,1,.113-.113h.964a.113.113,0,0,1,.113.113v3.571a.113.113,0,0,1-.113.113H12.85a.113.113,0,0,1-.113-.113Zm.6,5.455a.737.737,0,1,1,.737-.737A.737.737,0,0,1,13.332,16.116Z"
                      transform="translate(-8.855 -8.855)"
                      fill="var(--text-gray-200-color)"
                    />
                  </svg>
                </div>
                <div className="w-full mt-12">
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

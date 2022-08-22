import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

// next components
import Image from 'next/image'

// third party components
import Blur from 'react-blur'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import faker from 'faker'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

// components
import IconButton from 'components/Button/IconButton'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'
import ProgressingModal from 'components/Modal/ProgressingModal'
import Alert from 'components/Alert'
import MakeAnOfferModal from 'components/Modal/MakeAnOfferModal'

// images and icons
import Avatar from 'assets/images/NFT-Display-Group.png'
import HeartUnfilledWhiteIcon from 'assets/icons/heart-unfilled-white.svg'
import SendWhiteIcon from 'assets/icons/send-white.svg'
import CandyWhiteIcon from 'assets/icons/candy-white.svg'
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'
import QuickBuyBlackIcon from 'assets/icons/quick-buy-black.svg'
import TagWhiteIcon from 'assets/icons/tag-white.svg'
import DescriptionWhiteIcon from 'assets/icons/description-white.svg'
import PriceHistoryWhiteIcon from 'assets/icons/price-history-white.svg'
import NotificationWhiteIcon from 'assets/icons/notification-white.svg'
import SaleWhiteIcon from 'assets/icons/sale-white.svg'
import BloodDropIcon from 'assets/icons/blood-drop.svg'
import HandsIcon from 'assets/icons/hands.svg'
import AirBallonIcon from 'assets/icons/air-ballon.svg'
import BloodDropToggleIcon from 'assets/icons/blood-drop-toggle.svg'
import HandsToggleIcon from 'assets/icons/hands-toggle.svg'
import AirBallonToggleIcon from 'assets/icons/air-ballon-toggle.svg'

// json
import TimeList from 'assets/json/browse-nft/time-list.json'
import ActivityList from 'assets/json/browse-nft/activity-list.json'

// styles
import styles from './index.module.scss'
import Select from 'components/Select'

const MainSection = props => {
  const { viewport } = props
  const router = useRouter()

  const buttonRefs = useRef([])
  const openedRef = useRef(null)
  const [like, setLike] = useState(false)
  const [share, setShare] = useState(false)
  const [favorite, setFavorite] = useState(false)

  const clickRecent = index => {
    const clickedButton = buttonRefs.current[index]
    if (clickedButton === openedRef.current) {
      openedRef.current = null
      return
    }
    if (Boolean(openedRef.current?.getAttribute('data-value'))) {
      openedRef.current?.click()
    }
    openedRef.current = clickedButton
  }

  const [selectedTime, setSelectedTime] = useState(TimeList[0])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart',
      },
    },
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.5, // disables bezier curves
      },
      point: {
        radius: 0,
      },
    },
  }
  const labels =
    viewport === 'xs' || viewport === 'sm' || viewport === 'md'
      ? ['12/21', '1/22', '2/22', '3/22']
      : ['', '12/21', '1/22', '2/22', '3/22', '4/22', '5/22']
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        data: labels.map(() => faker.datatype.number({ min: 0, max: 10 })),
        borderColor: 'rgba(90, 195,186, 0.16)',
        backgroundColor: 'rgba(90, 195,186, 0.16)',
        height: '100px',
        width: '150px',
      },
    ],
  }

  const [openProgressingModal, setOpenProgressingModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    if (openProgressingModal) {
      setTimeout(() => {
        setOpenProgressingModal(false)
        setShowAlert(true)
      }, 5000)
    }
  }, [openProgressingModal])

  const [openOfferModal, setOpenOfferModal] = useState(false)

  return (
    <div className={styles.container}>
      <div className="w-full grid grid-cols-2 gap-10">
        <div className="col-span-2 lg:col-span-1">
          <div className={styles.blurBackground}>
            {typeof Avatar.src !== Object && (
              <Blur
                img={Avatar.src}
                blurRadius={50}
                enableStyles
                shouldResize
                className="w-full flex justify-center items-center"
              >
                <div className={styles.blurBackground}>
                  <div className={styles.imageArea}>
                    <Image src={Avatar} alt="" objectFit="cover" />
                  </div>
                </div>
              </Blur>
            )}
          </div>
        </div>
        <div className="col-span-2 lg:col-span-1 z-10">
          <div className={styles.nftDetailCard}>
            <div className="w-full flex flex-wrap">
              <div className="w-full flex justify-between items-center">
                <div className={styles.greenTitle}>The GB Series</div>
                <div className="flex gap-4 sm:gap-1 xs:gap-1 md:gap-3">
                  <div className="flex flex-wrap items-center">
                    <IconButton
                      icon={like ? BloodDropToggleIcon : BloodDropIcon}
                      backgroundColor="transparent"
                      onClick={() => setLike(!like)}
                      width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '30px' : '36px'}
                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '24px' : '24px'}
                    />
                    <div className={styles.likeTitle}>{like ? 255 : 254}</div>
                  </div>
                  <div className="flex flex-wrap items-center">
                    <IconButton
                      icon={share ? HandsToggleIcon : HandsIcon}
                      backgroundColor="transparent"
                      onClick={() => setShare(!share)}
                      width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '30px' : '36px'}
                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '24px' : '24px'}
                    />
                    <div className={styles.likeTitle}>{share ? 255 : 254}</div>
                  </div>
                  <div className="flex flex-wrap items-center">
                    <IconButton
                      icon={favorite ? AirBallonToggleIcon : AirBallonIcon}
                      backgroundColor="transparent"
                      onClick={() => setFavorite(!favorite)}
                      width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '30px' : '36px'}
                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '24px' : '24px'}
                    />
                    <div className={styles.likeTitle}>{favorite ? 255 : 254}</div>
                  </div>
                </div>
              </div>
              <div className="w-full flex mt-[5px] md:mt-[8px] lg:mt-[16px] xl:mt-[24px] 2xl:mt-[30px]">
                <div className={styles.title}>The Glass Banana</div>
              </div>
              <div className="w-full flex flex-wrap mt-4 lg:mt-5 xl:mt-6 2xl:mt-7">
                <div className={`${styles.grayText} mr-1 lg:mr-3`}>Fostered by</div>
                <div
                  className={`${styles.greenText} mr-[14px] lg:mr-[34px]`}
                  onClick={() => router.push('/artist-profile')}
                >
                  BillBudz
                </div>
                <div className={`${styles.grayText} mr-1 lg:mr-3`}>Created by</div>
                <div className={styles.greenText} onClick={() => router.push('/artist-profile')}>
                  Plumpadoodle
                </div>
              </div>
            </div>

            <div className="w-full flex flex-wrap">
              <div className="w-full flex items-center mt-[77px] lg:mt-4">
                <div className={`${styles.greenTitle} mr-[10px] lg:mr-4`}>Price</div>
                <Image src={SolanaLogoIcon} alt="" width={24} height={24} />
                <div className={`${styles.whiteTitle} ml-[6px]`}>1.1</div>
              </div>
              <div className="w-full flex mt-[7px] lg:mt-[14px] gap-6 lg:gap-10">
                <GradientButton
                  label="Quick Buy"
                  onClick={() => setOpenProgressingModal(true)}
                  icon={QuickBuyBlackIcon}
                  direction="rtl"
                />
                <OutlineButton
                  label="Make Offer"
                  onClick={() => setOpenOfferModal(true)}
                  icon={TagWhiteIcon}
                  direction="rtl"
                  borderColor="#ffffff"
                  borderWidth={2}
                />
              </div>
              <div className="w-full flex content-none mt-[14px]">
                <p className={styles.whiteDiscription}>
                  By selecting &quot;Quick Buy&quot; or &quot;Make an offer&quot;, you agree to the&nbsp;
                  <span className={styles.greenDiscription}>Terms of Service</span>
                </p>
              </div>
              <div className="mx-auto w-full mt-4">
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className={open ? styles.accordionOpenButton : styles.accordionButton}
                        style={{
                          backgroundColor: open ? '#1f2020' : '#121212',
                          borderColor: open ? '#DEEFD0' : '#707070',
                          borderBottomLeftRadius: open ? '0px' : '12px',
                          borderBottomRightRadius: open ? '0px' : '12px',
                        }}
                        data-value={open}
                        width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '36px' : '46px'}
                        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '36px' : '46px'}
                        ref={ref => {
                          buttonRefs.current[0] = ref
                        }}
                        onClick={() => clickRecent(0)}
                      >
                        <div className="flex items-center gap-3">
                          <Image src={DescriptionWhiteIcon} alt="" />
                          <div className={styles.subTitle}>Description</div>
                        </div>
                        <ChevronUpIcon
                          className={`${open ? '' : 'rotate-180 transform'} h-5 w-5`}
                          style={{ color: '#DEEFD0' }}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel
                        className={styles.accordionArea}
                        style={{
                          borderTopLeftRadius: open ? '0px' : '12px',
                          borderTopRightRadius: open ? '0px' : '12px',
                        }}
                      >
                        <div className="w-full flex flex-wrap flex-column space-between">
                          <div className={styles.whiteDiscription}>
                            Proin ac quam et lectus vestibulum blandit. Nunc maximus nibh at placerat tincidunt. Nam sem
                            lacus, ornare non ante sed.
                          </div>
                          <div className="w-full flex flex-wrap mt-2 gap-2 lg:gap-3 xl:gap-5">
                            <OutlineButton
                              label="Abstract"
                              onClick={() => {}}
                              color="#EFF0F6"
                              borderColor="#EFF0F6"
                              borderRadius="16px"
                              height={
                                viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                                  ? '25px'
                                  : viewport === 'lg' || viewport === 'xl'
                                  ? '28px'
                                  : '32px'
                              }
                              fontSize={
                                viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                                  ? '12px'
                                  : viewport === 'lg' || viewport === 'xl'
                                  ? '14px'
                                  : '16px'
                              }
                            />
                            <OutlineButton
                              label="Degen Art"
                              onClick={() => {}}
                              color="#EFF0F6"
                              borderColor="#EFF0F6"
                              borderRadius="16px"
                              height={
                                viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                                  ? '25px'
                                  : viewport === 'lg' || viewport === 'xl'
                                  ? '28px'
                                  : '32px'
                              }
                              fontSize={
                                viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                                  ? '12px'
                                  : viewport === 'lg' || viewport === 'xl'
                                  ? '14px'
                                  : '16px'
                              }
                            />
                            <OutlineButton
                              label="Environment"
                              onClick={() => {}}
                              color="#EFF0F6"
                              borderColor="#EFF0F6"
                              borderRadius="16px"
                              height={
                                viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                                  ? '25px'
                                  : viewport === 'lg' || viewport === 'xl'
                                  ? '28px'
                                  : '32px'
                              }
                              fontSize={
                                viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                                  ? '12px'
                                  : viewport === 'lg' || viewport === 'xl'
                                  ? '14px'
                                  : '16px'
                              }
                            />
                          </div>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Disclosure as="div" className="mt-2">
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className={open ? styles.accordionOpenButton : styles.accordionButton}
                        style={{
                          backgroundColor: open ? '#1f2020' : '#121212',
                          borderColor: open ? '#DEEFD0' : '#707070',
                          borderBottomLeftRadius: open ? '0px' : '12px',
                          borderBottomRightRadius: open ? '0px' : '12px',
                        }}
                        data-value={open}
                        ref={ref => {
                          buttonRefs.current[1] = ref
                        }}
                        onClick={() => clickRecent(1)}
                      >
                        <div className="flex items-center gap-3">
                          <Image src={PriceHistoryWhiteIcon} alt="" />
                          <div className={styles.subTitle}>Price History</div>
                        </div>
                        <ChevronUpIcon
                          className={`${open ? '' : 'rotate-180 transform'} h-5 w-5`}
                          style={{ color: '#DEEFD0' }}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel
                        className={styles.accordionArea}
                        style={{
                          borderTopLeftRadius: open ? '0px' : '12px',
                          borderTopRightRadius: open ? '0px' : '12px',
                        }}
                      >
                        <div className="w-full flex justify-between gap-4 lg:gap-[30px]">
                          <div className="w-[100px] lg:w-[150px]">
                            <Select data={TimeList} selected={selectedTime} onChange={item => setSelectedTime(item)} />
                          </div>
                          <div className="flex flex-1">
                            <Line options={options} data={data} height="100px" width="150px" />
                          </div>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Disclosure as="div" className="mt-2">
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className={open ? styles.accordionOpenButton : styles.accordionButton}
                        style={{
                          backgroundColor: open ? '#1f2020' : '#121212',
                          borderColor: open ? '#DEEFD0' : '#707070',
                          borderBottomLeftRadius: open ? '0px' : '12px',
                          borderBottomRightRadius: open ? '0px' : '12px',
                        }}
                        data-value={open}
                        ref={ref => {
                          buttonRefs.current[2] = ref
                        }}
                        onClick={() => clickRecent(2)}
                      >
                        <div className="flex items-center gap-3">
                          <Image src={NotificationWhiteIcon} alt="" />
                          <div className={styles.subTitle}>Activity</div>
                        </div>
                        <ChevronUpIcon
                          className={`${open ? '' : 'rotate-180 transform'} h-5 w-5`}
                          style={{ color: '#DEEFD0' }}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel
                        className={styles.accordionArea}
                        style={{
                          borderTopLeftRadius: open ? '0px' : '12px',
                          borderTopRightRadius: open ? '0px' : '12px',
                          padding: '0px',
                          overflow: 'auto',
                        }}
                      >
                        <table className="w-full table-auto">
                          <thead>
                            <tr className={styles.tableTitle} style={{ backgroundColor: '#378287' }}>
                              <th>Event</th>
                              <th>Price</th>
                              <th>From</th>
                              <th>To</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ActivityList.map((item, index) => (
                              <tr key={index} className={`${styles.tableText} gap-2`}>
                                <td className="mx-2">
                                  <div className="flex items-center lg:ml-2">
                                    <Image
                                      src={item.event === 'Sale' ? SaleWhiteIcon : TagWhiteIcon}
                                      alt=""
                                      width={viewport === 'xs' ? 12 : viewport === 'sm' || viewport === 'md' ? 18 : 32}
                                      height={viewport === 'xs' ? 12 : viewport === 'sm' || viewport === 'md' ? 18 : 32}
                                    />
                                    <div className="ml-2">{item.event}</div>
                                  </div>
                                </td>
                                <td>
                                  <div className="flex items-center mx-2 gap-2">
                                    <Image
                                      src={SolanaLogoIcon}
                                      alt=""
                                      width={viewport === 'xs' ? 15 : viewport === 'sm' || viewport === 'md' ? 18 : 23}
                                      height={viewport === 'xs' ? 15 : viewport === 'sm' || viewport === 'md' ? 18 : 23}
                                    />
                                    <div className="ml-2">{item.price}</div>
                                  </div>
                                </td>
                                <td>
                                  <div className="flex items-center mx-2 gap-2">
                                    {item.from !== undefined && item.from.slice(0, 4)}
                                    {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? '...' : '.'}
                                    {item.from !== undefined &&
                                      item.from.slice(
                                        viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? -4 : -2
                                      )}
                                  </div>
                                </td>
                                <td>
                                  <div className="flex items-center mx-2 gap-2">
                                    {item.to !== undefined && item.to.slice(0, 4)}
                                    {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? '...' : '.'}
                                    {item.to !== undefined &&
                                      item.to.slice(
                                        viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? -4 : -2
                                      )}
                                  </div>
                                </td>
                                <td>
                                  <div className="flex items-center mx-2 gap-2">
                                    {item.date}
                                    {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? ' ago' : ''}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProgressingModal viewport={viewport} open={openProgressingModal} />
      <Alert
        viewport={viewport}
        open={showAlert}
        close={() => setShowAlert(false)}
        title="Successful Purchase!"
        description="Navigate to My Dashboard to view your purchased NFT."
        type="success"
      />
      <MakeAnOfferModal
        viewport={viewport}
        open={openOfferModal}
        close={() => setOpenOfferModal(false)}
        onClick={() => {
          setOpenOfferModal(false)
          setOpenProgressingModal(true)
        }}
      />
    </div>
  )
}

export default MainSection

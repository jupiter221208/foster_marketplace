import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

// next components
import Image from 'next/image'

// third party components
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
import AudioPlayer from 'components/MediaPlayer/AudioPlayer'
import MenuSocialShare from 'components/Menu/MenuSocialShare'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'
import ProgressingModal from 'components/Modal/ProgressingModal'
import Alert from 'components/Alert'
import MakeAnOfferModal from 'components/Modal/MakeAnOfferModal'
import SmallCategoryChip from 'components/Chip/SmallCategoryChip'
import Select from 'components/Select'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'
import QuickBuyBlackIcon from 'assets/icons/quick-buy-black.svg'
import TagWhiteIcon from 'assets/icons/tag-white.svg'
import DescriptionGreenIcon from 'assets/icons/description-green.svg'
import PriceHistoryGreenIcon from 'assets/icons/price-history-green.svg'
import NotificationGreenIcon from 'assets/icons/notification-green.svg'
import SaleGreenIcon from 'assets/icons/sale-green.svg'
import TagGreenIcon from 'assets/icons/tag-green.svg'
import HeartFilledWhiteIcon from 'assets/icons/heart-filled-white-46x46.svg'
import HeartFilledRedIcon from 'assets/icons/heart-filled-red-46x46.svg'
import EmailWhiteIcon from 'assets/icons/email-white-46x46.svg'
import EmailGreenIcon from 'assets/icons/email-green-46x46.svg'
import TicketWhiteIcon from 'assets/icons/ticket-white-46x46.svg'
import TicketGreenIcon from 'assets/icons/ticket-green-46x46.svg'

// json
import TimeList from 'assets/json/browse-nft/time-list.json'
import ActivityList from 'assets/json/browse-nft/activity-list.json'

// styles
import styles from './index.module.scss'
import { Url } from 'url'

// solana
import { buyNFT, offerNFT } from 'utils/auction.util'
import { getNFTDetailsByAddress, getGeneralNFTDetails } from 'utils/nfts.utils'
import { useMetaplex } from 'hooks/useMetaplex'
import { getPriceValue, getShortAddress } from 'utils/strings'
import { useWallet } from '@solana/wallet-adapter-react'

// call apis
import nftsAPI from 'apis/nfts'
import listingsAPI from 'apis/listings'

const MainSection = () => {
  const viewport = useViewport()
  const router = useRouter()

  const buttonRefs = useRef<any[]>([])
  const openedRef = useRef<any>(null)
  const [like, setLike] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState(0)
  const [share, setShare] = useState<boolean>(false)
  const [shareCount, setShareCount] = useState(0)
  const [save, setSave] = useState<boolean>(false)
  const [saveCount, setSaveCount] = useState(0)

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

  const [openOfferModal, setOpenOfferModal] = useState(false)

  const [alertData, setAlertData] = useState<any[]>([])

  useEffect(() => {
    setAlertData([
      {
        id: 0,
        title: 'Successful Purchase!',
        description: 'Navigate to My Dashboard to view your purchased NFT.',
        type: 'success',
      },
    ])
  }, [])

  const [nftType, setNftType] = useState('')
  const [nftUrl, setNftUrl] = useState('')
  const [nftCoverUrl, setNftCoverUrl] = useState('')
  const [nftName, setNftName] = useState('')
  const [nftDescription, setNftDescription] = useState('')
  const [nftRoyalties, setNftRoyalties] = useState(0)
  const [nftPrice, setNftPrice] = useState(0)
  const [nftCreator, setNftCreator] = useState('')
  const [nftOwner, setNftOwner] = useState('')
  const [mintAddress, setMintAddress] = useState('')
  const [tradeStateAddress, setTradeStateAddress] = useState('')
  const [nftCategories, setNftCategories] = useState([])
  const [mainWalletBalance, setMainWalletBalance] = useState(0)

  const [isRunning, setIsRunning] = useState(false)
  const { id, type } = router.query

  const { metaplex: mx } = useMetaplex()

  const { connected } = useWallet()

  useEffect(() => {
    const getSolBalance = async () => {
      const solBalance = await mx.connection.getBalance(mx.identity().publicKey)
      setMainWalletBalance(Number(getPriceValue(solBalance)))
    }
    if (mx && connected) getSolBalance()
  }, [mx, connected])

  const setListedNFT = async (mx, id) => {
    let nft: any
    if (type && type === 'general') nft = await getGeneralNFTDetails(mx, id.toString())
    else nft = await getNFTDetailsByAddress(mx, id.toString())

    if (nft.asset.json.category === 'image') {
      setNftType('image')
      setNftUrl(nft.asset.json.image)
    } else if (nft.asset.json.category === 'audio') {
      setNftType(nft.asset.json.category)
      setNftUrl(
        nft.asset.json.properties?.files
          .filter(file => file.type.split('/')[0] === 'audio')
          .map(file => file.url)[0]
          .toString()
      )
      setNftCoverUrl(nft.asset.json.image ? nft.asset.json.image : '')
    } else if (nft.asset.json.category === 'video') {
      setNftType(nft.asset.json.category)
      setNftUrl(
        nft.asset.json.properties?.files
          .filter(file => file.type.split('/')[0] === 'video')
          .map(file => file.url)[0]
          .toString()
      )
      setNftCoverUrl(nft.asset.json.image ? nft.asset.json.image : '')
    } else {
      setNftType('image')
      setNftUrl(nft.asset.json.image)
    }
    setNftName(nft.asset.json.name)
    setNftOwner(getShortAddress(nft.asset.owner))
    setNftDescription(nft.asset.json.description)
    setNftRoyalties(nft.asset.sellerFeeBasisPoints)
    let array = []
    if (nft.asset.json.attributes !== undefined) {
      nft.asset.json.attributes.map(item => {
        if (item.trait_type === 'category') {
          array.push(item)
        }
      })
    }

    setNftCategories(array)
    if (nft.price) {
      setNftPrice(nft.price?.basisPoints.toNumber() * 0.000000001)
    }
    setNftCreator(getShortAddress(nft.asset.creators[0].address.toBase58()))
    setMintAddress(nft.asset.address.toBase58())
    if (nft.tradeStateAddress) {
      setTradeStateAddress(nft.tradeStateAddress?.toBase58())
    }
  }

  useEffect(() => {
    if (mx && id) setListedNFT(mx, id)
  }, [mx, id])

  const quickBuy = async () => {
    setOpenProgressingModal(true)
    const result = await buyNFT(mx, mintAddress, tradeStateAddress, nftPrice)
    if (result) {
      setOpenProgressingModal(false)
      setShowAlert(true)
    }
  }

  const makeOffer = async price => {
    setOpenProgressingModal(true)
    const result = await offerNFT(mx, mintAddress, price)
    if (result) {
      listingsAPI.makeOffer(mintAddress, { amount: price }).then(response => {
        setAlertData([
          {
            id: 0,
            title: 'Successful offered!',
            description: 'NFT is offered successfully.',
            type: 'success',
          },
        ])
        setShowAlert(true)
      }),
        error => {
          console.log(error)
        }
      setOpenProgressingModal(false)
      setOpenOfferModal(false)
    }
  }

  useEffect(() => {
    if (id !== '') {
      nftsAPI.get(id).then(
        response => {
          if (response !== null) {
            setLikeCount(response.likes >= 0 ? response.likes : 0)
            setShareCount(response.shares >= 0 ? response.shares : 0)
            setSaveCount(response.saves >= 0 ? response.saves : 0)
            setLike(response.liked)
            setSave(response.saved)
            let shared = response.shared
            if (shared?.facebook || shared?.twitter || shared?.telegram) setShare(true)
            else setShare(false)
          }
        },
        error => {
          console.log(error)
        }
      )
    }
  }, [id])

  const changeLikeStatus = () => {
    if (isRunning) return

    let newStatus = !like
    setIsRunning(true)

    if (newStatus) {
      nftsAPI.likeNft(id).then(
        response => {
          if (response !== null) {
            setLikeCount(likeCount + 1)
            setLike(newStatus)
          }
          setIsRunning(false)
        },
        error => {
          setIsRunning(false)
        }
      )
    } else {
      nftsAPI.unlikeNft(id).then(
        response => {
          console.log(response)
          if (response !== null) {
            setLikeCount(likeCount - 1)
            setLike(newStatus)
          }
          setIsRunning(false)
        },
        error => {
          setIsRunning(false)
        }
      )
    }
  }

  const changeSaveStatus = () => {
    if (isRunning) return

    let newStatus = !save
    setIsRunning(true)

    if (newStatus) {
      nftsAPI.saveNft(id).then(
        response => {
          if (response !== null) {
            setSaveCount(saveCount + 1)
            setSave(newStatus)
          }
          setIsRunning(false)
        },
        error => {
          setIsRunning(true)
        }
      )
    } else {
      nftsAPI.unsaveNft(id).then(
        response => {
          console.log(response)
          if (response !== null) {
            setSaveCount(saveCount - 1)
            setSave(newStatus)
          }
          setIsRunning(false)
        },
        error => {
          setIsRunning(true)
        }
      )
    }
  }

  return (
    <div className={styles.container}>
      <div className="w-full grid grid-cols-2 gap-10">
        <div className="col-span-2 lg:col-span-1">
          {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
            nftType === 'image' ? (
              <div className={styles.mobileImageArea}>
                <img src={nftUrl} alt="" />
                <div className={styles.mobileImageBackground} />
              </div>
            ) : nftType === 'audio' ? (
              <div className={styles.audioArea}>
                <AudioPlayer src={nftUrl !== '' ? nftUrl : '/audios/audio-01.mp3'} cover={nftCoverUrl} />
              </div>
            ) : nftType === 'video' ? (
              <div className={styles.audioArea}>
                <video controls muted>
                  <source type="video/mp4" src={nftUrl !== '' ? nftUrl : '/images/Page-Animation.webm'} />
                </video>
              </div>
            ) : (
              <></>
            )
          ) : nftType === 'image' ? (
            <div className={styles.blurBackground}>
              <div className="absolute inset-0">
                <img src={nftUrl} alt="" className="min-w-full min-h-full object-cover" />
              </div>
              <div className={styles.blurImage} />
              <div className={styles.imageArea}>
                <img src={nftUrl} alt="" className="h-full" />
              </div>
            </div>
          ) : nftType === 'audio' ? (
            <div className={styles.audioArea}>
              <AudioPlayer src={nftUrl !== '' ? nftUrl : '/audios/audio-01.mp3'} cover={nftCoverUrl} />
            </div>
          ) : nftType === 'video' ? (
            <div className={styles.audioArea}>
              <video controls muted>
                <div>{nftUrl}</div>
                <source type="video/mp4" src={nftUrl !== '' ? nftUrl : '/images/Page-Animation.webm'} />
              </video>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="col-span-2 lg:col-span-1 z-10">
          <div className={styles.nftDetailCard}>
            <div className="w-full flex flex-wrap">
              <div className="w-full flex flex-wrap justify-end lg:justify-between items-center">
                <div className={`${styles.greenTitle} hidden lg:flex`}>{nftName}</div>
                <div className="flex gap-4 sm:gap-1 xs:gap-1 md:gap-3">
                  <div className="flex items-center cursor-pointer" onClick={() => changeLikeStatus()}>
                    <Image src={like ? HeartFilledRedIcon : HeartFilledWhiteIcon} alt="" className="" />
                    <div className={styles.text}>{likeCount}</div>
                  </div>
                  <MenuSocialShare
                    address={id}
                    icon01={EmailWhiteIcon}
                    icon02={EmailGreenIcon}
                    vote={share}
                    setVote={setShare}
                    voteCount={shareCount}
                    setVoteCount={setShareCount}
                    onClick={() => {}}
                  />
                  <div className="flex items-center cursor-pointer" onClick={() => changeSaveStatus()}>
                    <Image src={save ? TicketGreenIcon : TicketWhiteIcon} alt="" className="" />
                    <div className={styles.text}>{saveCount}</div>
                  </div>
                </div>
                <div className={`${styles.greenTitle} w-full flex lg:hidden`}>The GB Series</div>
              </div>
              <div className="w-full flex mt-[5px] md:mt-[8px] lg:mt-[16px] xl:mt-[24px] 2xl:mt-[30px]">
                <div className={styles.title}>{nftName}</div>
              </div>
              <div className="w-full flex flex-wrap mt-4 lg:mt-5 xl:mt-6 2xl:mt-7">
                <div className={`${styles.grayText} mr-1 lg:mr-3`}>Fostered by</div>
                <div
                  className={`${styles.greenText} mr-[14px] lg:mr-[34px]`}
                  onClick={() => router.push('/artist-profile')}
                >
                  {nftOwner}
                </div>
                <div className={`${styles.grayText} mr-1 lg:mr-3`}>Created by</div>
                <div className={styles.greenText} onClick={() => router.push('/artist-profile')}>
                  {nftCreator}
                </div>
              </div>
            </div>

            <div className="w-full flex flex-wrap">
              {nftPrice > 0 && (
                <>
                  <div className="w-full flex items-center mt-[77px] lg:mt-4">
                    <div className={`${styles.greenTitle} mr-[10px] lg:mr-4`}>Price</div>
                    <div className="w-[24px] h-[24px]">
                      <Image src={SolanaLogoIcon} alt="" width={24} height={24} />
                    </div>
                    <div className={`${styles.whiteTitle} ml-[6px]`}>{nftPrice.toFixed(2)}</div>
                  </div>
                  <div className="w-full flex mt-[7px] lg:mt-[14px] gap-6 lg:gap-10">
                    <GradientButton
                      label="Quick Buy"
                      onClick={() => quickBuy()}
                      icon={QuickBuyBlackIcon}
                      direction="rtl"
                    />
                    <OutlineButton
                      label="Make Offer"
                      onClick={() => setOpenOfferModal(true)}
                      icon={TagWhiteIcon}
                      direction="rtl"
                      borderWidth={2}
                      paddingLeft="13px"
                      paddingRight="13px"
                      gap="4px"
                    />
                  </div>
                  <div className="w-full flex content-none mt-[14px]">
                    <p className={styles.whiteDescription}>
                      By selecting &quot;Quick Buy&quot; or &quot;Make an offer&quot;, you agree to the&nbsp;
                      <span
                        className={styles.greenDiscription}
                        onClick={() => router.push(process.env.NEXT_PUBLIC_TERMS_OF_USE as unknown as Url)}
                      >
                        Terms of Service
                      </span>
                    </p>
                  </div>
                </>
              )}
              <div className="mx-auto w-full mt-4">
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className={open ? styles.accordionOpenButton : styles.accordionButton}
                        data-value={open}
                        ref={ref => {
                          buttonRefs.current[0] = ref
                        }}
                        onClick={() => clickRecent(0)}
                      >
                        <div className="flex items-center gap-3">
                          <Image src={DescriptionGreenIcon} alt="" />
                          <div>Description</div>
                        </div>
                        <ChevronUpIcon
                          className={`${open ? '' : 'rotate-180 transform'} h-8 w-8`}
                          style={{ color: '#5AC3BA' }}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className={styles.accordionArea}>
                        <div className="w-full flex flex-wrap flex-column space-between">
                          <div className={styles.whiteDescription}>{nftDescription}</div>
                          <div className="w-full flex justify-between mt-2 gap-2 lg:gap-3 xl:gap-4">
                            <div className="flex flex-wrap items-end mt-2 gap-2 lg:gap-3 xl:gap-4">
                              {nftCategories.map((item, index) => (
                                <SmallCategoryChip data={item} key={index} />
                              ))}
                            </div>
                            <div className="flex items-end">
                              <div className="block text-center">
                                <div className={styles.greenRoyalties}>{nftRoyalties}%</div>
                                <div className={styles.whiteRoyalties}>Royalties</div>
                              </div>
                            </div>
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
                        data-value={open}
                        ref={ref => {
                          buttonRefs.current[1] = ref
                        }}
                        onClick={() => clickRecent(1)}
                      >
                        <div className="flex items-center gap-3">
                          <Image src={PriceHistoryGreenIcon} alt="" />
                          <div>Price History</div>
                        </div>
                        <ChevronUpIcon
                          className={`${open ? '' : 'rotate-180 transform'} h-8 w-8`}
                          style={{ color: '#5AC3BA' }}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className={styles.accordionArea}>
                        <div className="w-full flex justify-between gap-4 lg:gap-[30px]">
                          <div className="w-[100px] lg:w-[150px]">
                            <Select data={TimeList} selected={selectedTime} onChange={item => setSelectedTime(item)} />
                          </div>
                          <div className="flex flex-1">
                            <Line options={options as any} data={data} height="100px" width="150px" />
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
                        data-value={open}
                        ref={ref => {
                          buttonRefs.current[2] = ref
                        }}
                        onClick={() => clickRecent(2)}
                      >
                        <div className="flex items-center gap-3">
                          <Image src={NotificationGreenIcon} alt="" />
                          <div>Activity</div>
                        </div>
                        <ChevronUpIcon
                          className={`${open ? '' : 'rotate-180 transform'} h-8 w-8`}
                          style={{ color: '#5AC3BA' }}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel
                        className={styles.accordionArea}
                        style={{
                          padding: '0px',
                          overflow: 'auto',
                        }}
                      >
                        <table className="w-full table-auto">
                          {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                            <thead>
                              <tr className={styles.tableTitle} style={{ backgroundColor: 'rgba(55, 130, 135, 0.35)' }}>
                                <th>Event</th>
                                <th>Price</th>
                                <th>Date</th>
                              </tr>
                            </thead>
                          ) : (
                            <thead>
                              <tr className={styles.tableTitle} style={{ backgroundColor: 'rgba(55, 130, 135, 0.35)' }}>
                                <th>Event</th>
                                <th>Price</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Date</th>
                              </tr>
                            </thead>
                          )}
                          <tbody>
                            {ActivityList.map((item, index) => (
                              <tr
                                key={index}
                                className={`${styles.tableText} gap-2`}
                                style={{
                                  background:
                                    index % 2 === 1
                                      ? `linear-gradient(to bottom, rgba(55, 130, 135, 0.35), rgba(28, 65, 68, 0.35))`
                                      : 'transparent',
                                }}
                              >
                                <td className="mx-2">
                                  <div className="flex items-center ml-2">
                                    <div className="w-3 h-3 lg:w-8 lg:h-8 flex items-center">
                                      <Image
                                        src={item.event === 'Sale' ? SaleGreenIcon : TagGreenIcon}
                                        alt=""
                                        width={
                                          viewport === 'xs' ? 12 : viewport === 'sm' || viewport === 'md' ? 18 : 32
                                        }
                                        height={
                                          viewport === 'xs' ? 12 : viewport === 'sm' || viewport === 'md' ? 18 : 32
                                        }
                                      />
                                    </div>
                                    <div className="ml-2">{item.event}</div>
                                  </div>
                                </td>
                                <td>
                                  <div className="flex items-center justify-center mx-2 gap-1 ">
                                    <Image
                                      src={SolanaLogoIcon}
                                      alt=""
                                      width={viewport === 'xs' ? 15 : viewport === 'sm' || viewport === 'md' ? 18 : 23}
                                      height={viewport === 'xs' ? 15 : viewport === 'sm' || viewport === 'md' ? 18 : 23}
                                    />
                                    <div>{item.price.toFixed(2)}</div>
                                  </div>
                                </td>
                                {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                                  <></>
                                ) : (
                                  <td>
                                    <div className="flex items-center justify-center mx-2 gap-2">
                                      {item.from !== undefined && item.from.slice(0, 4)}
                                      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? '...' : '.'}
                                      {item.from !== undefined &&
                                        item.from.slice(
                                          viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? -4 : -2
                                        )}
                                    </div>
                                  </td>
                                )}
                                {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                                  <></>
                                ) : (
                                  <td>
                                    <div className="flex items-center justify-center mx-2 gap-2">
                                      {item.to !== undefined && item.to.slice(0, 4)}
                                      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? '...' : '.'}
                                      {item.to !== undefined &&
                                        item.to.slice(
                                          viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? -4 : -2
                                        )}
                                    </div>
                                  </td>
                                )}
                                <td>
                                  <div className="w-full flex justify-end items-center ml-2 pr-4">{item.date}</div>
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
      {openProgressingModal && <ProgressingModal open={openProgressingModal} />}
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
      {openOfferModal && (
        <MakeAnOfferModal
          open={openOfferModal}
          close={() => setOpenOfferModal(false)}
          onClick={price => makeOffer(price)}
          listingPrice={nftPrice}
          mainWalletBalance={mainWalletBalance}
        />
      )}
    </div>
  )
}

export default MainSection

import React, { useEffect, useRef, useState } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'

// apis
import AuctionAPI from 'apis/auctions'

// solana
import { getNFTOwner } from 'utils/nfts.utils'

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
import Alert from 'components/Alert'
import MenuSocialShare from 'components/Menu/MenuSocialShare'
import GradientButton from 'components/Button/GradientButton'
import SmallCategoryChip from 'components/Chip/SmallCategoryChip'
import AuctionCard from 'components/Card/AuctionCard'
import ModalPlaceBid from 'components/Modal/ModalPlaceBid'
import ReportMenu from 'components/Menu/ReportMenu'
import ReportAnIssueModal from 'components/Modal/ReportAnIssueModal'
import LoadingModal from 'components/Modal/LoadingModal'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaAuctionIcon from 'assets/icons/solana-place-bid.svg'
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'
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
import Select from 'components/Select'

// solana
import { useMetaplex } from 'hooks/useMetaplex'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { placeBid } from 'utils/auctioneer.util'
import { useWallets } from 'hooks/useWallets'

// call apis
import nftsAPI, { NFT } from 'apis/nfts'
import usersAPI from 'apis/user'

const MainSection = () => {
  const viewport = useViewport()
  const router = useRouter()

  const buttonRefs = useRef<any>([])
  const openedRef = useRef<any>(null)
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [auctionLoading, setAuctionLoading] = useState<boolean>(false)
  const [openReportModal, setOpenReportModal] = useState(false)

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

  const [selectedTime, setSelectedTime] = useState<any>(TimeList[0])

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

  const [alertData, setAlertData] = useState<any[]>([
    {
      id: 0,
      title: 'Successful bid!',
      description: `You've successfully placed a bid on The Glass Banana #6921`,
      type: 'success',
    },
  ])

  const [showModalPlaceBid, setShowModalPlaceBid] = useState(false)

  const { id } = router.query

  const [nftUrl, setNftUrl] = useState('')
  const [nftCoverUrl, setNftCoverUrl] = useState('')
  const [nftName, setNftName] = useState('')
  const [nftType, setNftType] = useState('')
  const [nftDescription, setNftDescription] = useState('')
  const [nftRoyalties, setNftRoyalties] = useState(1)
  const [nftReservePrice, setNftReservePrice] = useState(0)
  const [nftCurrentPrice, setNftCurrentPrice] = useState(0)
  const [highBidder, setHighBidder] = useState('')
  const [nftCreatorAddress, setNftCreatorAddress] = useState('')
  const [nftOwnerAddress, setNftOwnerAddress] = useState('')
  const [mintAddress, setMintAddress] = useState('')
  const [sellerAddress, setSellerAddress] = useState<PublicKey>()
  const [nftCategories, setNftCategories] = useState([])
  const [endTime, setEndTime] = useState<Date>(new Date())
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [isEnded, setIsEnded] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [showPlaceBidButton, setShowPlaceBIdButton] = useState(false)
  const [nftCollectionAddress, setNftCollectionAddress] = useState('')
  const [nftCollectionName, setNftCollectionName] = useState('')
  const [nftOwnerUsername, setNftOwnerUsername] = useState('')
  const [nftCreatorUsername, setNftCreatorUsername] = useState('')

  const [like, setLike] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState(0)
  const [share, setShare] = useState<boolean>(false)
  const [shareCount, setShareCount] = useState(0)
  const [save, setSave] = useState<boolean>(false)
  const [saveCount, setSaveCount] = useState(0)

  useEffect(() => {
    if (isStarted && !isEnded) {
      setShowPlaceBIdButton(true)
    } else {
      setShowPlaceBIdButton(false)
    }
  }, [isEnded, isStarted])

  const { metaplex: mx } = useMetaplex()
  const { publicKey } = useWallet()
  const { updateSolBalance } = useWallets()
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (id !== '') {
      getNftDetailInfo()
    }
  }, [id])

  function getNftDetailInfo() {
    setLoading(true)
    nftsAPI.getDetail(id).then(
      (response: NFT) => {
        if (response !== null) {
          let type = 'image'
          if (response.asset_type === 'image') type = 'image'
          else if (response.asset_type.includes('video')) type = 'video'
          else if (response.asset_type.includes('audio')) type = 'audio'

          setNftType(type)
          setNftUrl(response.asset_url)
          setNftCoverUrl(response.cover_image_url)
          setNftName(response.name)
          setNftCollectionAddress(response.collection_address)
          setNftCollectionName(response.collection_name)
          setNftOwnerAddress(response.owner_address)
          setNftOwnerUsername(response.owner_username)
          setNftCreatorAddress(response.creator_address)
          setNftCreatorUsername(response.creator_username)
          setNftDescription(response.description)
          setNftCategories(response.categories?.split(','))

          setMintAddress(response.address)
          setLikeCount(response.likes >= 0 ? response.likes : 0)
          setShareCount(response.shares >= 0 ? response.shares : 0)
          setSaveCount(response.saves >= 0 ? response.saves : 0)
          setLike(response.liked)
          setSave(response.saved)
          let shared = response.shared
          if (shared?.facebook || shared?.twitter || shared?.telegram) setShare(true)
          else setShare(false)

          if (response.listing_status === 'auctioned') {
            const auction = response.auction.auction
            const highest_bid = response.auction.highest_bid
            setNftReservePrice(Number(auction.reserve_price))
            setNftCurrentPrice(Number(highest_bid ? highest_bid.amount : 0))
            setHighBidder(highest_bid ? highest_bid.buyer_address : '')
            setSellerAddress(new PublicKey(auction.seller_address))
            setEndTime(new Date(Number(auction.end_time) * 1000))
            setStartTime(new Date(Number(auction.start_time) * 1000))
          }

          if (response.owner_address === '') {
            getNFTOwner(mx, id as string).then(owner => {
              setNftOwnerAddress(owner.address)
              usersAPI.get(owner).then(user => {
                setNftOwnerUsername(user.username)
              })
            })
          }
          setLoading(false)
        }
      },
      error => {
        setLoading(false)
        console.log(error)
      }
    )
  }
  // const setListedNFT = async () => {
  //   const { auction, highest_bid } = await AuctionAPI.getListing(id)
  //   const nft = await getNFTByAddress(mx, new PublicKey(auction.mint_address))
  //   setNftRoyalties(nft.sellerFeeBasisPoints / 100)
  // }

  // useEffect(() => {
  //   if (mx && id && connected) setListedNFT()
  // }, [mx, id, connected])

  const placeBidAndSave = async price => {
    if (price[0] === '.') {
      price = '0' + price
    }

    setAuctionLoading(true)
    try {
      const { bid } = await placeBid(mx, new PublicKey(mintAddress), sellerAddress, price)
      updateSolBalance()
      AuctionAPI.placeBid(mintAddress, {
        mint_address: bid.mintAddress.toBase58(),
        buyer_address: bid.buyerAddress.toBase58(),
        amount: bid.amount.toString(),
      })
        .then(res => {
          if (res) {
            setShowModalPlaceBid(false)
            setNftCurrentPrice(Number(bid.amount.toString()))
            setTimeout(() => {
              setAlertData([
                {
                  id: 0,
                  title: 'Successful bid!',
                  description: `You've successfully placed a bid on ${nftName}`,
                  type: 'success',
                },
              ])
              setShowAlert(true)
            }, 500)
            setAuctionLoading(false)
          }
        })
        .catch(rejected => {
          setAuctionLoading(false)
          setShowModalPlaceBid(false)
        })
    } catch (error) {
      setAuctionLoading(false)
    }
  }

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
        {loading ? (
          <div className="col-span-2 lg:col-span-1 flex items-center">
            <LoadingModal open={loading} />
          </div>
        ) : (
          <div className="col-span-2 lg:col-span-1">
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              nftType === 'image' ? (
                <div className={styles.mobileImageArea}>
                  <img src={nftUrl} alt="" />
                  <div className={styles.mobileImageBackground} />
                </div>
              ) : nftType.includes('audio') ? (
                <div className={styles.audioArea}>
                  <AudioPlayer src={nftUrl !== '' ? nftUrl : '/audios/audio-01.mp3'} cover={nftCoverUrl} />
                </div>
              ) : nftType.includes('video') ? (
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
        )}

        <div className="col-span-2 lg:col-span-1 z-10">
          <div className={styles.nftDetailCard}>
            <div className="w-full flex flex-wrap">
              <div className="w-full flex justify-between items-center">
                <div className="flex lg:hidden">
                  <ReportMenu address={id} onClick={() => setOpenReportModal(true)} />
                </div>
                <div className="hidden lg:flex">
                  <div
                    className={styles.collectionName}
                    onClick={() => router.push(`/browse-collection/${nftCollectionAddress}`)}
                  >
                    {nftCollectionName}
                  </div>
                </div>
                <div className="inline">
                  <div className="hidden lg:flex justify-end">
                    <ReportMenu address={id} onClick={() => setOpenReportModal(true)} />
                  </div>
                  <div className="flex gap-4 sm:gap-1 xs:gap-1 md:gap-3">
                    <div className="flex items-center cursor-pointer" onClick={() => changeLikeStatus()}>
                      <Image src={like ? HeartFilledRedIcon : HeartFilledWhiteIcon} alt="" className="" />
                      <div className={styles.text}>{likeCount}</div>
                    </div>
                    <div className="flex items-center cursor-pointer" onClick={() => changeSaveStatus()}>
                      <Image src={save ? TicketGreenIcon : TicketWhiteIcon} alt="" className="" />
                      <div className={styles.text}>{saveCount}</div>
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
                  </div>
                </div>
              </div>
              <div className="w-full flex lg:hidden justify-between items-center">
                <div
                  className={styles.collectionName}
                  onClick={() => router.push(`/browse-collection/${nftCollectionAddress}`)}
                >
                  {nftCollectionName}
                </div>
              </div>
              <div className="w-full flex mt-[5px] md:mt-[8px] lg:mt-[16px] xl:mt-[24px] 2xl:mt-[30px]">
                <div className={styles.title}>{nftName}</div>
              </div>
              <div className="w-full flex flex-wrap mt-4 lg:mt-5 xl:mt-6 2xl:mt-7">
                <div className={`${styles.grayText} mr-1 lg:mr-3`}>Created by</div>
                <div
                  className={`${styles.greenText} mr-[14px] lg:mr-[34px]`}
                  onClick={() => router.push(`/artist-profile/${nftCreatorUsername}`)}
                >
                  {nftCreatorUsername}
                </div>
                <div className={`${styles.grayText} mr-1 lg:mr-3`}>Fostered by</div>
                <div className={styles.greenText} onClick={() => router.push(`/artist-profile/${nftOwnerAddress}`)}>
                  {nftOwnerUsername}
                </div>
              </div>
            </div>

            <div className="w-full flex flex-wrap mt-10">
              <div className="w-full flex mt-[7px] lg:mt-[14px] gap-6 lg:gap-10">
                {showPlaceBidButton && (
                  <div>
                    <GradientButton
                      label="Place Bid"
                      disabled={isEnded}
                      onClick={() => setShowModalPlaceBid(true)}
                      icon={SolanaAuctionIcon}
                      direction="rtl"
                      backgroundColor01={publicKey?.toBase58() === highBidder ? '#83888A' : '#5ac3ba'}
                      backgroundColor02={publicKey?.toBase58() === highBidder ? '#83888A' : '#378287'}
                    />
                    {publicKey?.toBase58() === highBidder ? (
                      <div className={styles.highBidText}>You are currently the highest bidder!</div>
                    ) : null}
                  </div>
                )}
              </div>
              <div className="w-full flex content-none mt-6 lg:mt-7">
                <AuctionCard
                  currentPrice={nftCurrentPrice}
                  reservePrice={nftReservePrice}
                  endTime={endTime}
                  startTime={startTime}
                  setIsEnded={setIsEnded}
                  setIsStarted={setIsStarted}
                />
              </div>
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
                              {nftCategories.map((category, id) => (
                                <SmallCategoryChip data={category} key={id} />
                              ))}
                            </div>
                            <div className="flex items-end">
                              <div className="block text-center">
                                <div className={styles.greenRoyalties}>{nftRoyalties}</div>
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
                                  <div className="flex items-center mx-2 gap-1">
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
                                    <div className="flex items-center mx-2 gap-2">
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
                                    <div className="flex items-center mx-2 gap-2">
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
                                  <div className="w-full flex justify-end items-center ml-2 pr-4">{item.date} ago</div>
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
      <ModalPlaceBid
        nftName={nftName}
        nftUrl={nftUrl}
        currentPrice={nftCurrentPrice}
        reservePrice={nftReservePrice}
        placeBid={placeBidAndSave}
        open={showModalPlaceBid}
        loading={auctionLoading}
        onClose={() => {
          setShowModalPlaceBid(false)
        }}
      />
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
      {openReportModal && (
        <ReportAnIssueModal
          open={openReportModal}
          close={() => {
            setOpenReportModal(false)
          }}
        />
      )}
    </div>
  )
}

export default MainSection

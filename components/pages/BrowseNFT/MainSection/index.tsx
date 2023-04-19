import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// next components
import Image from 'next/image'

// third party components
import { Disclosure } from '@headlessui/react'

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
import faker from 'faker'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

// components
import AudioPlayer from 'components/MediaPlayer/AudioPlayer'
import ReportMenu from 'components/Menu/ReportMenu'
import MenuSocialShare from 'components/Menu/MenuSocialShare'
import GradientButton from 'components/Button/GradientButton'
import ProgressingModal from 'components/Modal/ProgressingModal'
import Alert from 'components/Alert'
import MakeAnOfferModal from 'components/Modal/MakeAnOfferModal'
import ReportAnIssueModal from 'components/Modal/ReportAnIssueModal'
import SmallCategoryChip from 'components/Chip/SmallCategoryChip'
import LoadingModal from 'components/Modal/LoadingModal'
import LoadingButton from 'components/Button/LoadingButton'

// custom functions
import { useViewport } from 'utils'
import { getNFTCategories, getNFTTokenAccount, getNFTSocialInfo } from 'utils/nfts.utils'
import { loadAuctionHouse } from 'utils/auction.util'
import { placeBid } from 'utils/auctioneer.util'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-small.svg?component'
import QuickBuyBlackIcon from 'assets/icons/quick-buy-black.svg'
import TagWhiteIcon from 'assets/icons/tag-white.svg?component'
import DescriptionGreenIcon from 'assets/icons/description-green.svg?component'
import NotificationGreenIcon from 'assets/icons/notification-icon.svg?component'
import SaleLightIcon from 'assets/icons/sale-light.svg?component'
import TagLightIcon from 'assets/icons/tag-light.svg?component'
import HeartFilledWhiteIcon from 'assets/icons/heart-filled-white-46x46.svg'

import HeartFilledRedIcon from 'assets/icons/heart-filled-red-46x46.svg'

import TicketWhiteIcon from 'assets/icons/ticket-white-46x46.svg'

import TicketGreenIcon from 'assets/icons/ticket-green-46x46.svg'
import PlayVideoIcon from 'assets/icons/play-video.svg'
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import PlaceBidDisableIcon from 'assets/icons/place-bid-icon-disabled.svg'
import PlaceBidBlackIcon from 'assets/icons/place-bid-icon-black.svg'
import ActivityDownIcon from 'assets/icons/activity-down-icon.svg?component'

// json
import TimeList from 'assets/json/browse-nft/time-list.json'

// styles
import styles from './index.module.scss'
import { Url } from 'url'

// solana
import { buyNFT, offerNFT } from 'utils/auction.util'
import { NFTArtistInfo } from 'utils/nfts.utils'
import { useMetaplex } from 'hooks/useMetaplex'
import { getDateString } from 'utils/strings'
import { PublicKey } from '@solana/web3.js'
import {
  LazyListing,
  toLazyListing,
  toListingReceiptAccount,
  toMetadataAccount,
  GpaBuilder,
} from '@metaplex-foundation/js'
import type { Sft, Nft } from '@metaplex-foundation/js'

// call apis
import nftsAPI, { NFT } from 'apis/nfts'
import usersAPI from 'apis/user'
import authAPI from 'apis/auth'
import listingsAPI from 'apis/listings'
import activityAPI from 'apis/activity'
import AuctionAPI from 'apis/auctions'

import { useWallets } from 'hooks/useWallets'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { isBuyerExisting, isAmountExisting } from 'utils/activity.util'
import { compareDate, getBuyerName, getOwnerName } from 'utils/helpers'
import ModalPlaceBid from 'components/Modal/ModalPlaceBid'
import AuctionCard from 'components/Card/AuctionCard'
import DateSelect from 'components/DateSelect'
import SecondaryButton from 'components/Button/SecondaryButton'

export interface MainSectionProps {
  nftDetail: Sft | Nft
  nftInfo: any
  artistInfo: NFTArtistInfo | null
}

const MainSection = ({ nftDetail, artistInfo, nftInfo }: MainSectionProps) => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const profileInfo = useSelector(state => (state as any).profileInfo)
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const [loading, setLoading] = useState<boolean>(false)

  const buttonRefs = useRef<any[]>([])
  const openedRef = useRef<any>(null)
  const [nftReservePrice, setNftReservePrice] = useState(0)
  const [nftCurrentPrice, setNftCurrentPrice] = useState(0)
  const [sellerAddress, setSellerAddress] = useState<PublicKey>()
  const [highBidder, setHighBidder] = useState('')
  const [endTime, setEndTime] = useState<String>(null)
  const [startTime, setStartTime] = useState<String>(null)
  const [isEnded, setIsEnded] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [showPlaceBidButton, setShowPlaceBIdButton] = useState(false)
  const [liveAuction, setLiveAuction] = useState(false)

  const [auctionLoading, setAuctionLoading] = useState<boolean>(false)
  const [openReportModal, setOpenReportModal] = useState(false)
  const [showModalPlaceBid, setShowModalPlaceBid] = useState(false)
  const [like, setLike] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState(0)
  const [share, setShare] = useState<boolean>(false)
  const [shareCount, setShareCount] = useState(0)
  const [save, setSave] = useState<boolean>(false)
  const [saveCount, setSaveCount] = useState(0)
  const [isOwnNft, setIsOwnNft] = useState(false)
  const [play, setPlay] = useState(false)

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

  useEffect(() => {
    if (isStarted && !isEnded) {
      setShowPlaceBIdButton(true)
    } else {
      setShowPlaceBIdButton(false)
    }
  }, [isEnded, isStarted])

  const nftType: string =
    (nftDetail.json?.properties?.category as string) ?? (nftDetail.json?.category as string) ?? 'image'

  const nftCoverUrl = nftDetail.json?.image ?? DefaultNftBG.src
  const nftAssetUrl: string = nftDetail.json?.animation_url as string

  const nftName = (nftDetail.name || nftDetail.json?.name) ?? 'No name found'
  const nftDescription = nftDetail.json?.description ?? ''
  const nftRoyalties = (nftDetail.sellerFeeBasisPoints / 100).toString()
  const nftCategories = getNFTCategories(nftDetail)

  const mintAddress = nftDetail.address.toString()
  const nftCollectionAddress = nftDetail.collection?.address.toString()

  const [nftCollectionName, setNftCollectionName] = useState('')
  const [nftPrice, setNftPrice] = useState(0)
  const [nftOwnerAddress, setNftOwnerAddress] = useState('')
  const [nftOwnerUsername, setNftOwnerUsername] = useState('')
  const [tradeStateAddress, setTradeStateAddress] = useState('')
  const [listing, setListing] = useState<LazyListing | null>(null)
  const [activityList, setActivityList] = useState([])

  const [isRunning, setIsRunning] = useState(false)
  const { id } = router.query

  const { metaplex: mx } = useMetaplex()
  const { mainBalance: mainWalletBalance, biddingBalance, offerBalance, updateSolBalance } = useWallets()
  const bidWalletLock = useSelector(state => (state as any).bidWalletLock)
  const quickBuy = async () => {
    if (!connected) {
      setVisible(true)
      return
    }
    setOpenProgressingModal(true)
    const result = await buyNFT(mx, mintAddress, tradeStateAddress, nftPrice)
    await updateSolBalance()
    if (result) {
      listingsAPI.quickBuy(mintAddress, { buyer_wallet_id: publicKey?.toString(), amount: nftPrice.toString() }).then(
        response => {
          console.log(response)
          setNftPrice(0)
          setIsOwnNft(true)
        },
        error => console.log(error)
      )
      setShowAlert(true)
    }
    setOpenProgressingModal(false)
  }

  const makeOffer = async price => {
    setOpenProgressingModal(true)
    const result = await offerNFT(mx, mintAddress, price)
    await updateSolBalance()
    if (result) {
      listingsAPI.makeOffer(mintAddress, { amount: price.toString() }).then(response => {
        setAlertData([
          {
            id: 0,
            title: 'Successful offer!',
            description: `You've successfully placed an offer on ${nftName}`,
            type: 'success',
          },
        ])
        setShowAlert(true)

        authAPI.login({ wallet_id: publicKey?.toBase58() || '' }).then(
          response => {
            dispatch({ type: 'set', bidWalletLock: response.bid_wallet_lock })
            dispatch({ type: 'set', offerWalletLock: response.offer_wallet_lock })
          },
          error => {
            console.log(error)
          }
        )
      }),
        error => {
          console.log(error)
        }
    }
    setOpenOfferModal(false)
    setOpenProgressingModal(false)
  }

  useEffect(() => {
    ;(async () => {
      if (profileInfo) {
        let { likes, shares, saves, liked, saved, sharedSocial } = await getNFTSocialInfo(
          new PublicKey(nftDetail.address)
        )
        setLikeCount(likes)
        setShareCount(shares)
        setSaveCount(saves)
        setLike(liked)
        setSave(saved)
        setShare(sharedSocial)
      }
    })()
  }, [profileInfo])

  useEffect(() => {
    if (nftInfo) {
      let { auction, likes, shares, saves, liked, saved, shared } = nftInfo
      let sharedSocial = shared.facebook || shared.twitter || shared.telegram

      setLiveAuction(false)
      if (auction?.auction) {
        setLiveAuction(true)
        let {
          highest_bid,
          auction: { reserve_price, start_time, end_time },
        } = auction

        setNftReservePrice(Number(reserve_price))
        setNftCurrentPrice(Number(highest_bid ? highest_bid.amount : 0))
        setHighBidder(highest_bid ? highest_bid.buyer_address : '')
        setEndTime(end_time)
        setStartTime(start_time)
      }

      setLikeCount(likes)
      setShareCount(shares)
      setSaveCount(saves)
      setLike(liked)
      setSave(saved)
      setShare(sharedSocial)
    }
  }, [nftInfo])

  useEffect(() => {
    ;(async () => {
      if (!nftDetail) return

      if (nftInfo && nftInfo.auction?.auction) return

      setLoading(true)

      let tokenAccount = await getNFTTokenAccount(mx, new PublicKey(nftDetail.address))
      setIsOwnNft(publicKey?.equals(tokenAccount.owner))
      setSellerAddress(tokenAccount.owner)

      let { username: ownerUsername } = await usersAPI.get(tokenAccount.owner.toBase58())
      setNftOwnerUsername(ownerUsername)
      setNftOwnerAddress(tokenAccount.owner.toBase58())

      if (tokenAccount.delegate?.equals(mx.auctionHouse().pdas().programAsSigner())) {
        const listingConfigDiscriminator = [240, 71, 225, 94, 200, 75, 84, 231]
        let openListings = await new GpaBuilder(mx, mx.programs().getAuctionHouse().address)
          .where(0, Buffer.from(listingConfigDiscriminator))
          .where(8 + 32 * 4, new PublicKey(nftDetail.metadataAddress))
          .where(169, Buffer.from([0])) // purchaseReceipt == null
          .where(195, Buffer.from([0])) // canceledAt == null
          .getAndMap(account => toListingReceiptAccount(account))

        if (openListings.length != 1) {
          console.warn(`irregular number of listing recipts for ${nftDetail.address}`)
          console.warn(JSON.parse(JSON.stringify(openListings)))
        }

        let listingReceipt = openListings[0]
        if (listingReceipt) {
          let auctionHouse = await loadAuctionHouse(mx, listingReceipt.data.auctionHouse)
          let listing = toLazyListing(listingReceipt, auctionHouse)
          let {
            tradeStateAddress,
            price: {
              basisPoints,
              currency: { decimals },
            },
          } = listing
          setNftPrice(parseFloat(basisPoints.toString()) / 10 ** decimals)
          setListing(listing)
          setTradeStateAddress(tradeStateAddress.toBase58())
        }
      }

      if (nftDetail.collection?.verified) {
        let collectionMint = new PublicKey(nftDetail.collection.address)
        let collectionMetadata = toMetadataAccount(
          await mx.rpc().getAccount(mx.nfts().pdas().metadata({ mint: collectionMint }))
        )
        setNftCollectionName(collectionMetadata.data.data.name.replace(/\0/g, ''))
      }

      activityAPI.getNFTActivity(mintAddress).then(
        response => {
          let dateSorted = response.sort(compareDate)
          setActivityList(dateSorted)
        },
        error => {}
      )

      setLoading(false)
    })()
  }, [nftDetail])

  const placeBidAndSave = async (price: string) => {
    if (price[0] === '.') {
      price = '0' + price
    }

    setAuctionLoading(true)
    try {
      const { bid } = await placeBid(mx, new PublicKey(mintAddress), sellerAddress, parseFloat(price))
      if (bid) {
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
                setHighBidder(publicKey?.toBase58())
              }, 500)
              setAuctionLoading(false)

              authAPI.login({ wallet_id: publicKey?.toBase58() || '' }).then(
                response => {
                  dispatch({ type: 'set', bidWalletLock: response.bid_wallet_lock })
                  dispatch({ type: 'set', offerWalletLock: response.offer_wallet_lock })
                },
                error => {
                  console.log(error)
                }
              )
            }
          })
          .catch(rejected => {
            setAuctionLoading(false)
            setShowModalPlaceBid(false)
          })
      }
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

  const gotoUserDetail = link => {
    dispatch({ type: 'set', isLoading: true })
    router.push(`/artist-profile?id=${link}`)
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
                  <img src={nftCoverUrl} alt="" />
                  <div className={styles.mobileImageBackground} />
                </div>
              ) : nftType.includes('audio') ? (
                <div className={styles.audioArea}>
                  <AudioPlayer src={nftAssetUrl || '/audios/audio-01.mp3'} cover={nftCoverUrl} />
                </div>
              ) : nftType.includes('video') ? (
                <div className={styles.videoArea}>
                  <div className={styles.mobileImageArea}>
                    <img src={nftCoverUrl} alt="" />
                    {play && (
                      <div
                        className="w-full h-full absolute"
                        onClick={() => {
                          if (play) setPlay(false)
                        }}
                        dangerouslySetInnerHTML={{
                          __html: `<video autoplay loop webkit-playsinline playsinline class="w-full h-full object-cover rounded-[10px] lg:rounded-[24px] overflow-hidden">
                      <source src=${nftAssetUrl} type="video/mp4" /></video>`,
                        }}
                      />
                    )}
                  </div>

                  {!play && (
                    <div className={styles.playButton}>
                      <div className="w-[22px] h-[18px] flex justify-end">
                        <Image src={PlayVideoIcon} width={18} height={18} alt="" onClick={() => setPlay(!play)} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <></>
              )
            ) : nftType === 'image' ? (
              <div className={styles.blurBackground}>
                <div className="absolute inset-0">
                  <img src={nftCoverUrl} alt="" className="min-w-full min-h-full object-cover" />
                </div>
                <div className={styles.blurImage} />
                <div className={styles.imageArea}>
                  <img src={nftCoverUrl} alt="" className="h-full" />
                </div>
              </div>
            ) : nftType === 'audio' ? (
              <div className={styles.blurBackground}>
                <div className="absolute inset-0">
                  <img src={nftCoverUrl} alt="" className="min-w-full min-h-full object-cover" />
                </div>
                <div className={styles.blurImage} />
                <div className={styles.audioArea}>
                  <AudioPlayer src={nftAssetUrl || '/audios/audio-01.mp3'} cover={nftCoverUrl} />
                </div>
              </div>
            ) : nftType === 'video' ? (
              <div className={styles.blurBackground}>
                <div className="absolute inset-0">
                  <img src={nftCoverUrl} alt="" className="min-w-full min-h-full object-cover" />
                </div>
                <div className={styles.blurImage} />
                <div className={styles.videoArea}>
                  <video controls className="max-w-full max-h-full">
                    <source type="video/mp4" src={nftAssetUrl || '/images/Page-Animation.webm'} />
                  </video>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}

        <div className="col-span-2 lg:col-span-1 z-10">
          <div className={styles.nftDetailCard}>
            <div className="w-full flex flex-wrap">
              <div className="w-full flex flex-wrap justify-between items-center">
                <div>
                  <ReportMenu address={id} onClick={() => setOpenReportModal(true)} />
                </div>
                <div className="inline">
                  <div className="flex gap-4 sm:gap-1 xs:gap-1 md:gap-3">
                    <div
                      className="flex items-center cursor-pointer mr-[20px] lg:mr-[16px]"
                      onClick={() => changeLikeStatus()}
                    >
                      <Image src={like ? HeartFilledRedIcon : HeartFilledWhiteIcon} alt="" className="" />

                      <div className={styles.text}>{likeCount}</div>
                    </div>
                    <div className="flex items-center cursor-pointer mr-[20px]" onClick={() => changeSaveStatus()}>
                      <Image src={save ? TicketGreenIcon : TicketWhiteIcon} alt="" className="" />
                      <div className={styles.text}>{saveCount}</div>
                    </div>
                    <MenuSocialShare
                      type="nft"
                      vote={share}
                      setVote={setShare}
                      voteCount={shareCount}
                      setVoteCount={setShareCount}
                      message={'Check out this fresh art on @foster_protocol #fostermarketplace'}
                      url={`/browse-nft?id=${id}`}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-between items-center">
                <div
                  className={styles.collectionName}
                  onClick={() => router.push(`/browse-collection/${nftCollectionAddress}`)}
                >
                  {nftCollectionName}
                </div>
              </div>
              <div className="w-full flex mt-[0px] md:mt-[8px] lg:mt-[10px]">
                <div className={styles.title}>{nftName}</div>
              </div>
              <div className="w-full flex flex-wrap mt-[4px] lg:mt-[10px] gap-x-[14px] lg:gap-x-[34px]">
                {artistInfo && (
                  <div className="flex gap-1 lg:gap-3">
                    <div className={styles.grayText}>Created by</div>
                    <div className={styles.greenText} onClick={() => gotoUserDetail(artistInfo.address)}>
                      {artistInfo.name}
                    </div>
                  </div>
                )}
                <div className="flex gap-1 lg:gap-3">
                  <div className={styles.grayText}>Fostered by</div>
                  <div className={styles.greenText} onClick={() => gotoUserDetail(nftOwnerAddress)}>
                    {nftOwnerUsername}
                  </div>
                </div>
              </div>
              {/* <div className="w-full mt-[30px]">
                <div className={styles.descriptionTitle}>Description</div>
                <div className={styles.descriptionContent}>{nftDescription}</div>
              </div>
              <div className="w-full mt-[25px]">
                <div className={styles.descriptionTitle}>Royalties</div>
                <div className={styles.royaltyContent}>{nftRoyalties}%</div>
              </div>
              <div className="w-full mt-[25px]">
                <div className={styles.descriptionTitle}>Categories</div>
                <div className="flex mt-[14px] gap-[7px]">
                  {nftCategories?.map((item, index) => (
                    <SmallCategoryChip data={item} key={index} />
                  ))}
                </div>
              </div> */}
            </div>
            <div className="w-full flex flex-wrap">
              {nftPrice > 0 && !liveAuction ? (
                <>
                  <div className="w-full flex items-center mt-[77px] lg:mt-4">
                    <div className={`${styles.greenTitle} mr-[10px] lg:mr-4`}>Price</div>
                    <div className="flex items-center mt-[3px]">
                      {/* <Image src={SolanaLogoIcon} alt="" width={24} height={24} /> */}
                      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                        <SolanaLogoMobileIcon alt="" />
                      ) : (
                        <SolanaLogoIcon alt="" />
                      )}
                    </div>
                    <div className={`${styles.whiteTitle} ml-[6px]`}>{nftPrice.toFixed(2)}</div>
                  </div>

                  {!isOwnNft && (
                    <div className="w-full flex mt-[7px] lg:mt-[14px] gap-6 lg:gap-10">
                      {tradeStateAddress ? (
                        <GradientButton
                          label={'Quick Buy'}
                          onClick={() => quickBuy()}
                          icon={QuickBuyBlackIcon}
                          direction="rtl"
                          disabled={!tradeStateAddress}
                        />
                      ) : (
                        <LoadingButton />
                      )}
                      <SecondaryButton
                        label="Make Offer"
                        onClick={() => {
                          if (!connected) {
                            setVisible(true)
                            return
                          }
                          setOpenOfferModal(true)
                        }}
                        icon={<TagWhiteIcon alt="" />}
                        direction="rtl"
                        borderWidth={2}
                        paddingLeft="13px"
                        paddingRight="13px"
                        gap="4px"
                      />
                    </div>
                  )}

                  <div className="w-full flex content-none mt-[14px]">
                    {isOwnNft ? (
                      <p className={styles.whiteDescription}>You are the owner of this NFT.</p>
                    ) : (
                      <p className={styles.whiteDescription}>
                        By selecting &quot;Quick Buy&quot; or &quot;Make an offer&quot;, you agree to the&nbsp;
                        <span
                          className={styles.greenDiscription}
                          onClick={() => router.push(process.env.NEXT_PUBLIC_TERMS_OF_USE as unknown as Url)}
                        >
                          Terms of Service
                        </span>
                      </p>
                    )}
                  </div>
                </>
              ) : liveAuction === true ? (
                <>
                  <div
                    className={`mt-10 w-full ${
                      showPlaceBidButton && !isOwnNft ? 'h-[140px] lg:h-[193px]' : 'h-[70px] lg:h-[93px]'
                    } relative`}
                  >
                    <div className={styles.auctionBG}>
                      {/* <Image src={AuctionBGIcon} alt="" className={styles.auctionBGIcon} /> */}
                    </div>
                    <div className={styles.auctionContainer}>
                      <AuctionCard
                        currentPrice={nftCurrentPrice}
                        reservePrice={nftReservePrice}
                        endTime={endTime}
                        startTime={startTime}
                        setIsEnded={setIsEnded}
                        setIsStarted={setIsStarted}
                      />
                      {showPlaceBidButton && !isOwnNft && (
                        <div>
                          <div
                            className={`${styles.placeBidBG} ${
                              publicKey?.toBase58() === highBidder || isEnded
                                ? styles.placeBidDisabledBG
                                : styles.placeBidEnabledLightBG
                            }`}
                            onClick={() =>
                              publicKey?.toBase58() === highBidder || isEnded ? {} : setShowModalPlaceBid(true)
                            }
                          >
                            <div className="flex">
                              <div
                                className={`${styles.placeBidBtn} ${
                                  publicKey?.toBase58() === highBidder || isEnded
                                    ? styles.placeBidDisabledColor
                                    : styles.placeBidEnabledColor
                                }`}
                              >
                                Place Bid
                              </div>
                              <Image
                                src={
                                  publicKey?.toBase58() === highBidder || isEnded
                                    ? PlaceBidDisableIcon
                                    : PlaceBidBlackIcon
                                }
                                alt=""
                              />
                            </div>
                          </div>
                          {publicKey?.toBase58() === highBidder ? (
                            <div className={styles.highBidText}>You are currently the highest bidder!</div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div />
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
                          <DescriptionGreenIcon alt="" />
                          <div>Description</div>
                        </div>
                        <ActivityDownIcon className={`${open ? 'rotate-180 transform' : ''} mr-2`} />
                      </Disclosure.Button>
                      <Disclosure.Panel className={styles.accordionArea}>
                        <div className="w-full flex flex-wrap flex-column space-between">
                          <div className={styles.whiteDescription}>{nftDescription}</div>
                          <div className="w-full flex justify-between mt-2 gap-2 lg:gap-3 xl:gap-4">
                            <div className="flex flex-wrap items-end mt-2 gap-2 lg:gap-3 xl:gap-4">
                              {nftCategories?.map((item, index) => (
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
                {/*<Disclosure as="div" className="mt-2">
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
                          {open ? (
                            <svg
                              id="Price_History_Icon"
                              data-name="Price History Icon"
                              xmlns="http://www.w3.org/2000/svg"
                              width="46"
                              height="46"
                              viewBox="0 0 46 46"
                            >
                              <rect
                                id="Rectangle_20893"
                                data-name="Rectangle 20893"
                                width="46"
                                height="46"
                                fill="none"
                              />
                              <g id="noun-chart-1186582-EFF0F6" transform="translate(9.979 10.02)">
                                <path
                                  id="Path_105746"
                                  data-name="Path 105746"
                                  d="M10.148,20.356a9.882,9.882,0,0,1-7.145-3A10,10,0,0,1,3,3.063a10.161,10.161,0,0,1,14.37,14.37A10.476,10.476,0,0,1,10.148,20.356Zm0-18.673A8.226,8.226,0,0,0,4.141,4.2a8.429,8.429,0,0,0,0,12.016,8.429,8.429,0,0,0,12.016,0,8.477,8.477,0,0,0,0-12.016A8.226,8.226,0,0,0,10.148,1.682Z"
                                  transform="translate(0 -0.079)"
                                  fill="var(--menu-item-activity-icon)"
                                />
                                <path
                                  id="Path_105747"
                                  data-name="Path 105747"
                                  d="M63.006,65.766a2.639,2.639,0,0,1-1.949-.812L53.75,57.647l.812-.568a9.281,9.281,0,0,0,2.517-2.517l.568-.812,7.388,7.388a2.794,2.794,0,0,1,0,3.9,3.118,3.118,0,0,1-2.03.731Zm-6.739-7.957,6.008,6.008a1.091,1.091,0,0,0,1.543-1.543l-6.008-6.008a7.32,7.32,0,0,1-.731.812A2.3,2.3,0,0,1,56.267,57.809Z"
                                  transform="translate(-39.785 -39.806)"
                                  fill="var(--menu-item-activity-icon)"
                                />
                                <path
                                  id="Path_105748"
                                  data-name="Path 105748"
                                  d="M14.688,37.5h1.624v7.957H14.688Z"
                                  transform="translate(-10.872 -27.778)"
                                  fill="var(--menu-item-activity-icon)"
                                />
                                <path
                                  id="Path_105749"
                                  data-name="Path 105749"
                                  d="M28.75,45.312h1.624v7.469H28.75Z"
                                  transform="translate(-21.281 -33.56)"
                                  fill="var(--menu-item-activity-icon)"
                                />
                                <path
                                  id="Path_105750"
                                  data-name="Path 105750"
                                  d="M43.125,20h1.624V34.046H43.125Z"
                                  transform="translate(-31.921 -14.824)"
                                  fill="var(--menu-item-activity-icon)"
                                />
                                <path
                                  id="Path_105751"
                                  data-name="Path 105751"
                                  d="M57.188,33.75h1.624v8.931H57.188Z"
                                  transform="translate(-42.33 -25.002)"
                                  fill="var(--menu-item-activity-icon)"
                                />
                              </g>
                            </svg>
                          ) : (
                            <Image src={PriceHistoryGreenIcon} alt="" />
                          )}
                          <div>Price History</div>
                        </div>
                        <ActivityDownIcon className={`${open ? 'rotate-180 transform' : ''} mr-2`} />
                      </Disclosure.Button>
                      <Disclosure.Panel className={styles.accordionArea}>
                        <div className="w-full flex justify-between gap-4 lg:gap-[30px]">
                          <div className="w-[100px] lg:w-[150px] z-10">
                            <DateSelect
                              data={TimeList}
                              selected={selectedTime}
                              onChange={item => setSelectedTime(item)}
                            />
                          </div>
                          <div className="flex flex-1">
                            <Line options={options as any} data={data} height="100px" width="150px" />
                          </div>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure> */}
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
                          {open ? (
                            <svg
                              id="Icon_Circus_Tent_Filled"
                              xmlns="http://www.w3.org/2000/svg"
                              width="46"
                              height="46"
                              viewBox="0 0 46 46"
                            >
                              <rect
                                id="Rectangle_20893"
                                data-name="Rectangle 20893"
                                width="46"
                                height="46"
                                fill="none"
                              />
                              <g
                                id="Circus_Tent_Icon_Filled"
                                data-name="Circus Tent Icon Filled"
                                transform="translate(12 12)"
                              >
                                <path
                                  id="Path_105701"
                                  data-name="Path 105701"
                                  d="M15.112,54.671l-.754.265a.112.112,0,0,0-.071.14l.065.208a.113.113,0,0,0,.147.071l.075-.028a.113.113,0,0,1,.09,0,.112.112,0,0,1,.058.069l.4,1.343a.113.113,0,0,0,.055.068.12.12,0,0,0,.087.008l.3-.1a.113.113,0,0,0,.067-.06.11.11,0,0,0,0-.089l-.513-1.334a.111.111,0,0,1,.06-.143l.079-.035a.114.114,0,0,0,.062-.14l-.061-.182h0a.11.11,0,0,0-.057-.065.107.107,0,0,0-.087,0Z"
                                  transform="translate(-14.282 -43.66)"
                                  fill="var(--menu-item-activity-icon)"
                                />
                                <path
                                  id="Path_105702"
                                  data-name="Path 105702"
                                  d="M49.573,20.777h-.536a.075.075,0,0,0-.075.072l-.006.145a.07.07,0,0,0,.022.057.072.072,0,0,0,.057.022h.054a.078.078,0,0,1,.055.024.073.073,0,0,1,.021.055l-.05,5.163a.075.075,0,0,0,.021.055.069.069,0,0,0,.053.024l.209.006a.076.076,0,0,0,.079-.079l-.026-5.182a.077.077,0,0,1,.071-.079l.057,0a.074.074,0,0,0,.071-.073v-.129a.076.076,0,0,0-.022-.054.079.079,0,0,0-.054-.022Z"
                                  transform="translate(-38.315 -20.777)"
                                  fill="var(--menu-item-activity-icon)"
                                />
                                <path
                                  id="Path_105703"
                                  data-name="Path 105703"
                                  d="M82.371,54.671l.754.265a.112.112,0,0,1,.069.14l-.065.208a.1.1,0,0,1-.057.067.113.113,0,0,1-.09,0l-.075-.028a.113.113,0,0,0-.09,0,.116.116,0,0,0-.058.069l-.4,1.343a.108.108,0,0,1-.055.068.119.119,0,0,1-.087.008l-.3-.1a.117.117,0,0,1-.067-.06.11.11,0,0,1,0-.089l.513-1.334h0a.111.111,0,0,0-.06-.143l-.079-.035a.112.112,0,0,1-.061-.14l.061-.182a.108.108,0,0,1,.058-.065.106.106,0,0,1,.087,0Z"
                                  transform="translate(-61.199 -43.66)"
                                  fill="var(--menu-item-activity-icon)"
                                />
                                <path
                                  id="Path_105704"
                                  data-name="Path 105704"
                                  d="M52.248,22c-.865-.673-2.361,0-2.361,0v2.993a2.133,2.133,0,0,1,2.1,0c.865.673,2.361,0,2.361,0V22A2.129,2.129,0,0,1,52.248,22Z"
                                  transform="translate(-39.268 -21.372)"
                                  fill="var(--menu-item-activity-icon)"
                                />
                                <path
                                  id="Path_105705"
                                  data-name="Path 105705"
                                  d="M36.419,39.158s-10.758-4.352-10.758-9.017c0,.1-.01.2-.022.3-.012-.1-.019-.2-.022-.3,0,4.666-10.758,9.018-10.758,9.018s1.323,7.9,0,9.287a57.654,57.654,0,0,1,7.7.373s3.081-3.021,3.081-6.925c0,3.9,3.081,6.925,3.081,6.925a57.653,57.653,0,0,1,7.7-.373c-1.323-1.392,0-9.288,0-9.288Z"
                                  transform="translate(-14.655 -26.819)"
                                  fill="var(--menu-item-activity-icon)"
                                />
                              </g>
                            </svg>
                          ) : (
                            // <Image src={NotificationGreenIcon} alt="" />
                            <NotificationGreenIcon alt="" />
                          )}
                          <div>Activity</div>
                        </div>
                        {/***************** Dropdown *******************/}
                        <ActivityDownIcon className={`${open ? 'rotate-180 transform' : ''} mr-2`} />
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
                              <tr className={styles.tableTitle} style={{ backgroundColor: 'rgba(32, 36, 39, 1)' }}>
                                <th>Event</th>
                                <th>Price</th>
                                <th>Buyer</th>
                                <th>Seller</th>
                                <th>Date</th>
                              </tr>
                            </thead>
                          ) : (
                            <thead>
                              <tr className={styles.tableTitle} style={{ backgroundColor: 'rgba(32, 36, 39, 1)' }}>
                                <th>Event</th>
                                <th>Price</th>
                                <th>Buyer</th>
                                <th>Seller</th>
                                <th>Date</th>
                              </tr>
                            </thead>
                          )}
                          <tbody>
                            {activityList.map((item, index) => (
                              <tr
                                key={index}
                                className={`${styles.tableText} gap-2`}
                                style={{
                                  background: index % 2 === 1 ? 'var(--activity-tr-bg)' : 'transparent',
                                }}
                              >
                                <td className="mx-2">
                                  <div className="flex items-center ml-2">
                                    {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                                      <></>
                                    ) : (
                                      <div className="w-3 h-3 lg:w-8 lg:h-8 flex items-center">
                                        {/* <Image
                                          src={item.action_type === 'AuctionStarted' ? SaleLightIcon : TagLightIcon}
                                          alt=""
                                          width={
                                            viewport === 'xs' ? 12 : viewport === 'sm' || viewport === 'md' ? 18 : 32
                                          }
                                          height={
                                            viewport === 'xs' ? 12 : viewport === 'sm' || viewport === 'md' ? 18 : 32
                                          }
                                        /> */}
                                        {item.action_type === 'AuctionStarted' ? (
                                          <SaleLightIcon alt="" />
                                        ) : (
                                          <TagLightIcon alt="" />
                                        )}
                                      </div>
                                    )}
                                    <div className={`ml-2 ${styles.activityInline}`}>
                                      {item.action_type.replace(/([A-Z])/g, ' $1').trim()}
                                    </div>
                                  </div>
                                </td>
                                <td className="w-[60px]">
                                  <div className="flex items-center mx-2 gap-1 ">
                                    <div className="min-w-[18px] flex items-center">
                                      {/* <Image src={SolanaLogoIcon} alt="" width={18} height={18} /> */}
                                      <SolanaLogoIcon alt="" />
                                    </div>
                                    <div className="">
                                      {isAmountExisting(item.action_type) ? Number(item.amount).toFixed(2) : 'N/A'}
                                    </div>
                                  </div>
                                </td>

                                <td>
                                  <div
                                    className={`${styles.activityUser} ${styles.activityInline}`}
                                    onClick={() => gotoUserDetail(item.reference_address)}
                                  >
                                    {isBuyerExisting(item.action_type) ? getBuyerName(item) : 'N/A'}
                                  </div>
                                </td>

                                <td>
                                  <div
                                    className={`${styles.activityUser} ${styles.activityInline}`}
                                    onClick={() => gotoUserDetail(item.owner_address)}
                                  >
                                    {getOwnerName(item)}
                                  </div>
                                </td>

                                <td>
                                  <div
                                    className={`w-full flex justify-end items-center ml-2 pr-4  ${styles.activityInline}`}
                                  >
                                    {getDateString(item.created_at)}ago
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
      {openProgressingModal && <ProgressingModal open={openProgressingModal} />}

      <ModalPlaceBid
        balance={mainWalletBalance}
        biddingWalletBalance={biddingBalance}
        biddingLockBalance={bidWalletLock}
        nftName={nftName}
        nftUrl={nftCoverUrl}
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
          siteUrl={`/browse-nft?id=${id}`}
          wallet={connected ? publicKey?.toString() : null}
          open={openReportModal}
          close={() => {
            setOpenReportModal(false)
          }}
        />
      )}
      {openOfferModal && (
        <MakeAnOfferModal
          open={openOfferModal}
          close={() => setOpenOfferModal(false)}
          onClick={price => makeOffer(price)}
          nftName={nftName}
          collectionName={nftCollectionName}
          listingPrice={nftPrice}
          offerBalance={offerBalance}
          mainWalletBalance={mainWalletBalance}
        />
      )}
    </div>
  )
}

export default MainSection

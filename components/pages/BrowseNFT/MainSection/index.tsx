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
import ReportMenu from 'components/Menu/ReportMenu'
import MenuSocialShare from 'components/Menu/MenuSocialShare'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'
import ProgressingModal from 'components/Modal/ProgressingModal'
import Alert from 'components/Alert'
import MakeAnOfferModal from 'components/Modal/MakeAnOfferModal'
import ReportAnIssueModal from 'components/Modal/ReportAnIssueModal'
import SmallCategoryChip from 'components/Chip/SmallCategoryChip'
import Select from 'components/Select'
import LoadingModal from 'components/Modal/LoadingModal'
import LoadingButton from 'components/Button/LoadingButton'

// custom functions
import { useViewport } from 'utils'
import {
  getNFTCategories,
  getNFTArtistInfo,
  getNFTTokenAccount,
  getNFTSocialInfo
} from 'utils/nfts.utils'
import { loadAuctionHouse } from 'utils/auction.util'

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
import ShareBlankIcon from 'assets/icons/share-blank.svg'
import ShareWhiteIcon from 'assets/icons/share-white.svg'
import TicketWhiteIcon from 'assets/icons/ticket-white-46x46.svg'
import TicketGreenIcon from 'assets/icons/ticket-green-46x46.svg'
import FosterLightGreenIcon from 'assets/icons/foster-light-green.svg'

// json
import TimeList from 'assets/json/browse-nft/time-list.json'

// styles
import styles from './index.module.scss'
import { Url } from 'url'

// solana
import { buyNFT, offerNFT } from 'utils/auction.util'
import { getNFTOwner, NFTArtistInfo } from 'utils/nfts.utils'
import { useMetaplex } from 'hooks/useMetaplex'
import { getDateString } from 'utils/strings'
import { PublicKey } from '@solana/web3.js'
import {
  type LazyListing,

  toLazyListing,
  toListingReceiptAccount,
  toMetadataAccount,
  GpaBuilder
} from '@metaplex-foundation/js'
import type { Sft, Nft } from '@metaplex-foundation/js'

// call apis
import nftsAPI, { NFT } from 'apis/nfts'
import usersAPI from 'apis/user'
import listingsAPI from 'apis/listings'
import activityAPI from 'apis/activity'

import { useWallets } from 'hooks/useWallets'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { isBuyerExisting, isAmountExisting } from 'utils/activity.util'

export interface MainSectionProps{
  nftDetail: Sft | Nft;
  artistInfo: NFTArtistInfo | null;
}

const MainSection = ({ nftDetail, artistInfo }: MainSectionProps) => {
  const viewport = useViewport()
  const router = useRouter()
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()

  const [loading, setLoading] = useState<boolean>(false)

  const buttonRefs = useRef<any[]>([])
  const openedRef = useRef<any>(null)
  const [openReportModal, setOpenReportModal] = useState(false)
  const [like, setLike] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState(0)
  const [share, setShare] = useState<boolean>(false)
  const [shareCount, setShareCount] = useState(0)
  const [save, setSave] = useState<boolean>(false)
  const [saveCount, setSaveCount] = useState(0)
  const [isOwnNft, setIsOwnNft] = useState(false)

  useEffect(() => {
    setIsOwnNft(artistInfo?.address?.toBase58() === publicKey?.toBase58())
  }, [artistInfo, publicKey])

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

  const nftType: string = nftDetail.json?.properties?.category as string ??
    nftDetail.json?.category as string ??
    'image'
  // TODO: set default links for broken images and assets
  const nftCoverUrl = nftDetail.json?.image ?? ''
  const nftAssetUrl: string = nftDetail.json?.animation_url as string

  const nftName = nftDetail.name
  const nftDescription = nftDetail.json?.description ?? ''
  const nftRoyalties = (nftDetail.sellerFeeBasisPoints/100).toString()
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
  const { mainBalance: mainWalletBalance, offerBalance, updateSolBalance } = useWallets()

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
        response => console.log(response),
        error => console.log(error)
      )
      setOpenProgressingModal(false)
      setShowAlert(true)
    }
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
            title: 'Offer Placed!',
            description: `You've successfully placed an offer on ${nftName}`,
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
    (async () => {
      if (!nftDetail) return

      setLoading(true)

      let tokenAccount = await getNFTTokenAccount(mx, new PublicKey(nftDetail.address))
      let { username: ownerUsername } = await usersAPI.get(tokenAccount.owner.toBase58())
      setNftOwnerUsername(ownerUsername)

      if(tokenAccount.delegate?.equals(mx.auctionHouse().pdas().programAsSigner())){
        const listingConfigDiscriminator = [240, 71, 225, 94, 200, 75, 84, 231,]
        let openListings = await new GpaBuilder(mx, mx.programs().getAuctionHouse().address)
          .where(0, Buffer.from(listingConfigDiscriminator))
          .where(8 + 32 * 4, new PublicKey(nftDetail.metadataAddress))
          .where(169, Buffer.from([0])) // purchaseReceipt == null
          .where(196, Buffer.from([0])) // canceledAt == null
          .getAndMap((account) => toListingReceiptAccount(account))

        if(openListings.length != 1){
          console.warn(`irregular number of listing recipts for ${nftDetail.address}`)
          console.warn(JSON.parse(JSON.stringify(openListings)))
        }

        let listingReceipt = openListings[0]
        if(listingReceipt){
          let auctionHouse = await loadAuctionHouse(mx, listingReceipt.data.auctionHouse)
          let listing = toLazyListing(listingReceipt, auctionHouse)
          let {
            tradeStateAddress,
            price: {
              basisPoints,
              currency: { decimals }
            }
          } = listing
          setNftPrice(parseFloat(basisPoints.toString())/(10 ** decimals))
          setListing(listing)
          setTradeStateAddress(tradeStateAddress.toBase58())
        }
      }

      if(nftDetail.collection?.verified){
        let collectionMint = new PublicKey(nftDetail.collection.address)
        let collectionMetadata = toMetadataAccount(
          await mx
            .rpc()
            .getAccount(
              mx
                .nfts()
                .pdas()
                .metadata({ mint: collectionMint })
            )
        )
        setNftCollectionName(collectionMetadata.data.data.name.replace(/\0/g, ''))
      }

      let { likes, shares, saves } = await getNFTSocialInfo(new PublicKey(nftDetail.address))
      setLikeCount(likes)
      setShareCount(shares)
      setSaveCount(saves)
      setLike(likes > 0)
      setSave(saves > 0)
      setShare(shares > 0)

      activityAPI.getNFTActivity(mintAddress).then(
        response => {
          setActivityList(response.reverse())
        },
        error => {}
      )

      setLoading(false)
    })()
  }, [nftDetail])

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
                  <img src={nftCoverUrl} alt="" />
                  <div className={styles.mobileImageBackground} />
                </div>
              ) : nftType.includes('audio') ? (
                <div className={styles.audioArea}>
                  <AudioPlayer src={nftAssetUrl || '/audios/audio-01.mp3'} cover={nftCoverUrl} />
                </div>
              ) : nftType.includes('video') ? (
                <div className={styles.videoArea}>
                  <video controls muted>
                  </video>
                    <source type="video/mp4" src={nftAssetUrl || '/images/Page-Animation.webm'} />
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
                  <video controls muted className="max-w-full max-h-full">
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
                    <div className="flex items-center cursor-pointer mr-[16px]" onClick={() => changeLikeStatus()}>
                      <Image src={like ? HeartFilledRedIcon : HeartFilledWhiteIcon} alt="" className="" />
                      <div className={styles.text}>{likeCount}</div>
                    </div>
                    <div className="flex items-center cursor-pointer mr-[12px]" onClick={() => changeSaveStatus()}>
                      <Image src={save ? TicketGreenIcon : TicketWhiteIcon} alt="" className="" />
                      <div className={styles.text}>{saveCount}</div>
                    </div>
                    <MenuSocialShare
                      address={id}
                      icon01={ShareBlankIcon}
                      icon02={ShareWhiteIcon}
                      vote={share}
                      setVote={setShare}
                      voteCount={shareCount}
                      setVoteCount={setShareCount}
                      onClick={() => {}}
                    />
                    {/* <div className="hidden lg:flex justify-end ml-[10px]">
                      <ReportMenu address={id} onClick={() => setOpenReportModal(true)} />
                    </div> */}
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
              <div className="w-full flex mt-[5px] md:mt-[8px] lg:mt-[10px]">
                <div className={styles.title}>{nftName}</div>
              </div>
              <div className="w-full flex flex-wrap mt-4 lg:mt-[10px] gap-x-[14px] lg:gap-x-[34px]">
                {
                  artistInfo &&
                  <div className="flex gap-1 lg:gap-3">
                    <div className={styles.grayText}>Created by</div>
                    <div
                      className={styles.greenText}
                      onClick={() => router.push(`/artist-profile?id=${artistInfo.address}`)}
                    >
                      {artistInfo.name}
                    </div>
                  </div>
                }
                <div className="flex gap-1 lg:gap-3">
                  <div className={styles.grayText}>Fostered by</div>
                  <div
                    className={styles.greenText}
                    onClick={() => router.push(`/artist-profile?id=${nftOwnerAddress}`)}
                  >
                    {nftOwnerUsername}
                  </div>
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

                  {!isOwnNft &&
                  <div className="w-full flex mt-[7px] lg:mt-[14px] gap-6 lg:gap-10">
                    {connected ? (
                      tradeStateAddress ? (
                        <GradientButton
                          label={'Quick Buy'}
                          onClick={() => quickBuy()}
                          icon={QuickBuyBlackIcon}
                          direction="rtl"
                          disabled={!tradeStateAddress}
                        />
                      ) : (
                        <LoadingButton />
                      )
                    ) : (
                      <button
                        className={styles.connectWallet}
                        onClick={() => {
                          setVisible(true)
                        }}
                      >
                        <div>Connect Wallet</div>
                        <Image src={FosterLightGreenIcon} alt="" />
                      </button>
                    )}
                    {connected && (
                      <OutlineButton
                        label="Make Offer"
                        onClick={() => {
                          setOpenOfferModal(true)
                        }}
                        icon={TagWhiteIcon}
                        direction="rtl"
                        borderWidth={2}
                        paddingLeft="13px"
                        paddingRight="13px"
                        gap="4px"
                      />
                    )}
                  </div>}

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
                          <div className="w-[100px] lg:w-[150px] z-10">
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
                                <th>Buyer</th>
                                <th>Seller</th>
                                <th>Date</th>
                              </tr>
                            </thead>
                          ) : (
                            <thead>
                              <tr className={styles.tableTitle} style={{ backgroundColor: 'rgba(55, 130, 135, 0.35)' }}>
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
                                  background:
                                    index % 2 === 1
                                      ? `linear-gradient(to bottom, rgba(55, 130, 135, 0.35), rgba(28, 65, 68, 0.35))`
                                      : 'transparent',
                                }}
                              >
                                <td className="mx-2">
                                  <div className="flex items-center ml-2">
                                    {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                                      <></>
                                    ) : (
                                      <div className="w-3 h-3 lg:w-8 lg:h-8 flex items-center">
                                        <Image
                                          src={item.action_type === 'AuctionStarted' ? SaleGreenIcon : TagGreenIcon}
                                          alt=""
                                          width={
                                            viewport === 'xs' ? 12 : viewport === 'sm' || viewport === 'md' ? 18 : 32
                                          }
                                          height={
                                            viewport === 'xs' ? 12 : viewport === 'sm' || viewport === 'md' ? 18 : 32
                                          }
                                        />
                                      </div>
                                    )}
                                    <div className="ml-2">{item.action_type.replace(/([A-Z])/g, ' $1').trim()}</div>
                                  </div>
                                </td>
                                <td className="w-[60px]">
                                  <div className="flex items-center justify-center mx-2 gap-1 ">
                                    <Image
                                      src={SolanaLogoIcon}
                                      alt=""
                                      width={viewport === 'xs' ? 15 : viewport === 'sm' || viewport === 'md' ? 18 : 23}
                                      height={viewport === 'xs' ? 15 : viewport === 'sm' || viewport === 'md' ? 18 : 23}
                                    />
                                    <div>{isAmountExisting(item.action_type) ? item.amount : 'N/A'}</div>
                                  </div>
                                </td>

                                <td>
                                  <div className="flex items-center justify-center mx-2 gap-2">
                                    {isBuyerExisting(item.action_type)
                                      ? item.reference_address !== undefined &&
                                        item.reference_address.slice(0, 4) + '...' + item.reference_address.slice(-4)
                                      : 'N/A'}
                                  </div>
                                </td>

                                <td>
                                  <div className="flex items-center justify-center mx-2 gap-2">
                                    {item.owner_address !== undefined &&
                                      item.owner_address.slice(0, 4) + '...' + item.owner_address.slice(-4)}
                                  </div>
                                </td>

                                <td>
                                  <div className="w-full flex justify-end items-center ml-2 pr-4">
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

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { cancelList, populateLazyListingsWithAssets, updateList } from 'utils/auction.util'

// next components
import Image from 'next/image'

// third party components

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
import MenuSocialShare from 'components/Menu/MenuSocialShare'
import GradientButton from 'components/Button/GradientButton'
import ProgressingModal from 'components/Modal/ProgressingModal'
import Alert from 'components/Alert'
import MakeAnOfferModal from 'components/Modal/MakeAnOfferModal'
import ReportAnIssueModal from 'components/Modal/ReportAnIssueModal'
import SmallCategoryChip from 'components/Chip/SmallCategoryChip'
import LoadingButton from 'components/Button/LoadingButton'

// custom functions
import { useViewport } from 'utils'
import { useAuthentication } from 'hooks/useAuthentication'
import { getNFTCategories, getNFTTokenAccount, getNFTSocialInfo, getNFTArtistPublicKey } from 'utils/nfts.utils'
import { loadAuctionHouse } from 'utils/auction.util'
import { fetchAuctionListing, getBuyerEscrowBalanceDeficit, placeBid } from 'utils/auctioneer.util'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-small.svg?component'
import QuickBuyBlackIcon from 'assets/icons/quick-buy-black.svg?component'
import TagWhiteIcon from 'assets/icons/tag-white.svg?component'
import HeartFilledWhiteIcon from 'assets/icons/heart-filled-white-46x46.svg'
import ShareSmallIcon from 'assets/icons/share-black-desktop-small.svg?component'
import ThreeEllipseIcon from 'assets/icons/three-ellipse-white.svg?component'
import ThreeEllipseMobileIcon from 'assets/icons/three-ellipse-white-mobile.svg?component'
import MerchToggleDisabledIcon from 'assets/icons/merch-toggle-disabled.svg?component'
import MerchToggleEnabledIcon from 'assets/icons/merch-toggle-enabled.svg?component'
import HeartFilledRedIcon from 'assets/icons/heart-filled-red-46x46.svg'
import TicketWhiteIcon from 'assets/icons/ticket-white-46x46.svg'
import TicketGreenIcon from 'assets/icons/ticket-green-46x46.svg'
import PlayVideoIcon from 'assets/icons/play-video.svg'
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import FullScreenModeIcon from 'assets/icons/fullscreen-mode.svg'
import InfoGrayIcon from 'assets/icons/info-gray-small.svg?component'
import InfoGreenIcon from 'assets/icons/info-green-small.svg?component'
import ErrorMessageIcon from 'assets/icons/error-message-icon.svg?component'

// styles
import styles from './index.module.scss'

// solana
import { buyNFT, offerNFT } from 'utils/auction.util'
import { useMetaplex } from 'hooks/useMetaplex'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { toLazyListing, toListingReceiptAccount, toMetadataAccount, GpaBuilder } from '@metaplex-foundation/js'
import type { Nft, Sft, Metadata } from '@metaplex-foundation/js'

// call apis
import axios from 'axios'
import nftsAPI from 'apis/nfts'
import usersAPI from 'apis/user'
import listingsAPI from 'apis/listings'
import activityAPI from 'apis/activity'
import AuctionAPI from 'apis/auctions'

import { useWallets } from 'hooks/useWallets'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { compareDate, getTimeDifference } from 'utils/helpers'
import ModalPlaceBid from 'components/Modal/ModalPlaceBid'
import AuctionCard from 'components/Card/AuctionCard'
import SecondaryButton from 'components/Button/SecondaryButton'
import SocialShareModal from 'components/Menu/SocialShareModal'
import ReportMobileModal from 'components/Menu/ReportMobileModal'
import 'react-placeholder/lib/reactPlaceholder.css'
import LikeModal from 'components/Modal/LikeModal'
import OutlineButton from 'components/Button/OutlineButton'
import StartAuctionModal from 'components/Modal/StartAuctionModal'
import ListNFTModal from 'components/Modal/ListNFTModal'
import { getShortAddress } from 'utils/wallet.util'
import { executeSale } from 'utils/auctioneer.util'
import EscrowDeficientModal from 'components/Modal/EscrowDeficientModal'
import CreateMerchSudioModal from 'components/Modal/CreateMerchSudioModal'
import RemoveMerchSudioModal from 'components/Modal/RemoveMerchSudioModal'
import { getExplorerUrl } from 'utils/explorer'
import ModelViewer from 'components/ModelViewer'
import PriceInput from 'components/Input/PriceInput'
import TabList from 'assets/json/browse-nft/auction-list.json'
import SelectedTab from 'components/Tab/SelectedTab'
import { useResizeDetector } from 'react-resize-detector'
import UpdateNFTModal from 'components/Modal/UpdateNFTModal'
import { getDisplayUserName } from 'utils/strings'
import Link from 'next/link'
import { NftData } from 'types/nft'

export interface MainSectionProps {
  nftDetail: NftData
  editionDetail: any
  nftInfo: any
  setFullScreenView: any
  reloadNftData: any
  enableMerch: any
  setCollectionName: any
  fullScreen: boolean
  hasLoading: any
}

const MainSection = ({
  nftDetail,
  editionDetail,
  nftInfo,
  setFullScreenView,
  reloadNftData,
  enableMerch,
  setCollectionName,
  fullScreen,
  hasLoading,
}: MainSectionProps) => {
  const viewport = useViewport()
  const router = useRouter()
  const { id } = router.query
  const dispatch = useDispatch()
  const { refreshToken } = useAuthentication()
  const { profileInfo } = useAuthentication()
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const [loading, setLoading] = useState<boolean>(true)
  const { solToUsdRate } = useSolToUsdRate()
  const { connection } = useConnection()
  const explorerURL = useMemo(() => getExplorerUrl(connection.rpcEndpoint, id as string), [id, connection])

  const [openShareModal, setOpenShareModal] = useState(false)
  const [nftReservePrice, setNftReservePrice] = useState(0)
  const [nftCurrentPrice, setNftCurrentPrice] = useState(0)
  const [minBidAmount, setMinBidAmount] = useState(0)
  const [sellerAddress, setSellerAddress] = useState<PublicKey>()
  const [highBidder, setHighBidder] = useState('')
  const [endTime, setEndTime] = useState<String>(null)
  const [startTime, setStartTime] = useState<String>(null)
  const [isEnded, setIsEnded] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [showPlaceBidButton, setShowPlaceBIdButton] = useState(false)
  const [liveAuction, setLiveAuction] = useState(false)

  const [showStartAuctionModal, setShowStartAuctionModal] = useState(false)
  const [showListNFTModal, setShowListNFTModal] = useState(false)
  const [showUpdateListNFTModal, setShowUpdateListNFTModal] = useState(false)

  const [auctionLoading, setAuctionLoading] = useState<boolean>(false)
  const [openReportModal, setOpenReportModal] = useState(false)

  const [openReportMenuModal, setOpenReportMenuModal] = useState(false)
  const [showModalPlaceBid, setShowModalPlaceBid] = useState(false)
  const [like, setLike] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState(0)
  const [showLikeModal, setShowLikeModal] = useState(false)
  const [share, setShare] = useState<boolean>(false)
  const [shareCount, setShareCount] = useState(0)
  const [save, setSave] = useState<boolean>(false)
  const [saveCount, setSaveCount] = useState(0)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [isOwnNft, setIsOwnNft] = useState(null)
  const [isCreatedNft, setIsCreatedNft] = useState(null)
  const [play, setPlay] = useState(true)
  const [infoFocus, setInfoFocus] = useState(false)
  const [merchHover, setMerchHover] = useState(false)
  const [price, setPrice] = useState('')
  const [activeTab, setActiveTab] = useState<any>(0)
  const [tabList, setTabList] = useState<any[]>(TabList)

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       display: false,
  //       position: 'bottom',
  //     },
  //     title: {
  //       display: false,
  //       text: 'Chart.js Line Chart',
  //     },
  //   },
  //   maintainAspectRatio: false,
  //   elements: {
  //     line: {
  //       tension: 0.5, // disables bezier curves
  //     },
  //     point: {
  //       radius: 0,
  //     },
  //   },
  // }
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
  const [deficencyModal, setDeficencyModal] = useState(false)
  const [deficiency, setDeficiency] = useState(0)
  const [finalizeData, setFinalizeData] = useState(null)
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
  const [nftCollectionUrl, setNftCollectionUrl] = useState('')
  const [nftCollectionImage, setNftCollectionImage] = useState('')

  const [nftPrice, setNftPrice] = useState(0)
  const [nftOwnerUsername, setNftOwnerUsername] = useState('')
  const [nftCreatorname, setNftCreatorname] = useState('')
  const [nftListingData, setNftListingData] = useState(null)
  const [tradeStateAddress, setTradeStateAddress] = useState('')
  const [activityList, setActivityList] = useState([])
  const [merchToggle, setMerchToggle] = useState(false)
  const [createMerchModal, setCreateMerchModal] = useState(false)
  const [removeMerchModal, setRemoveMerchModal] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [loadListing, setLoadListing] = useState(false)

  const { metaplex: mx } = useMetaplex()
  const { mainBalance: mainWalletBalance, biddingBalance, offerBalance, updateSolBalance } = useWallets()
  const bidWalletLock = useSelector(state => (state as any).bidWalletLock)

  function getMintAddress(asset: Nft | Sft | Metadata): PublicKey {
    if ('mintAddress' in asset) return asset.mintAddress
    else return asset.mint.address
  }

  const quickBuy = async () => {
    if (!connected) {
      setVisible(true)
      return
    }
    setOpenProgressingModal(true)

    await refreshToken()

    const result = await buyNFT(mx, mintAddress, tradeStateAddress, nftPrice)
    await updateSolBalance()
    if (result) {
      listingsAPI.quickBuy(mintAddress, { buyer_wallet_id: publicKey?.toString(), amount: nftPrice.toString() }).then(
        response => {
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

    await refreshToken()

    const result = await offerNFT(mx, mintAddress, parseFloat(price))
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

        usersAPI.getLockupValues().then(
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
      let { auction, merch_hub_enabled, likes, shares, saves, liked, saved, shared } = nftInfo
      let sharedSocial = shared?.facebook || shared?.twitter || shared?.telegram
      setMerchToggle(merch_hub_enabled)
      enableMerch(merch_hub_enabled)

      setLiveAuction(false)
      if (auction?.auction) {
        setLiveAuction(true)
        if (!connected) {
          setIsOwnNft(false)
        }
        let {
          highest_bid,
          auction: { reserve_price, start_time, end_time },
        } = auction
        setNftReservePrice(Number(reserve_price))
        setNftCurrentPrice(Number(highest_bid ? highest_bid.amount : 0))
        setHighBidder(highest_bid ? highest_bid.buyer_address : '')
        setEndTime(end_time)
        setStartTime(start_time)
      } else {
        setNftCurrentPrice(0)
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
    if (publicKey !== null && sellerAddress !== null) {
      setIsOwnNft(publicKey?.toBase58() === sellerAddress?.toBase58())
    }
    if (publicKey !== null && nftInfo?.creators[0].address !== null && nftInfo?.ownership.owner !== null) {
      setIsCreatedNft(
        publicKey?.toBase58() === nftInfo?.creators[0].address && publicKey?.toBase58() === nftInfo?.ownership.owner
      )
    }
  }, [publicKey, sellerAddress, nftInfo])

  useEffect(() => {
    ;(async () => {
      if (!nftDetail) return

      setLoading(true)

      let tokenAccount = await getNFTTokenAccount(mx, new PublicKey(nftDetail.address))
      setSellerAddress(tokenAccount.owner)

      let createAddress = getNFTArtistPublicKey({ creators: nftDetail.creators })
      let { username: creatorName } = await usersAPI.get(createAddress)
      setNftCreatorname(creatorName !== null && creatorName.length > 0 ? creatorName : getShortAddress(createAddress))

      let { username: ownerUsername } = await usersAPI.get(tokenAccount.owner.toBase58())
      setNftOwnerUsername(ownerUsername ?? getShortAddress(tokenAccount.owner))

      if (tokenAccount.delegate?.equals(mx.auctionHouse().pdas().programAsSigner())) {
        const listingConfigDiscriminator = [240, 71, 225, 94, 200, 75, 84, 231]
        let openListings = await new GpaBuilder(mx, mx.programs().getAuctionHouse().address)
          .where(0, Buffer.from(listingConfigDiscriminator))
          .where(8 + 32 * 4, new PublicKey(nftDetail.metadataAddress))
          .where(168, Buffer.from([0])) // purchaseReceipt == null
          .where(195, Buffer.from([0])) // canceledAt == null
          .getAndMap(account => toListingReceiptAccount(account))

        if (openListings.length != 1) {
          console.warn(`irregular number of listing recipts for ${nftDetail.address}`)
          console.warn(JSON.parse(JSON.stringify(openListings)))
        }

        let listingReceipt = openListings[0]
        if (listingReceipt) {
          // if (!connected) setIsOwnNft(false)
          setLoadListing(true)
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
          setTradeStateAddress(tradeStateAddress.toBase58())
          setLoadListing(false)

          let listingAssets = await populateLazyListingsWithAssets(mx, [listing])
          let listingAsset = listingAssets[0]
          let { asset, sellerAddress, price } = listingAsset
          let listingData = {
            address: getMintAddress(asset),
            name: asset?.name,
            uri: asset?.uri,
            sellerAddress,
            tradeStateAddress,
            price: Number(price.basisPoints.toString()),
            creatorAddress: getNFTArtistPublicKey(asset)?.toString(),
            json: nftDetail.json,
          }
          setNftListingData(listingData)
        } else {
          let auctionListing = await fetchAuctionListing(
            mx,
            tokenAccount.owner,
            tokenAccount.address,
            tokenAccount.mint
          )
          // use to set auction info
          let {
            minBidIncrement,
            reservePrice,
            highestBid: { amount },
          } = auctionListing
          let strMinBid = minBidIncrement.toString()
          let minBidInc = strMinBid === '1' ? 0.1 : parseFloat(strMinBid) / LAMPORTS_PER_SOL
          let reservedPrice = parseFloat(reservePrice.toString()) / LAMPORTS_PER_SOL
          let highestBidAmount = parseFloat(amount.toString()) / LAMPORTS_PER_SOL
          setMinBidAmount(highestBidAmount > 0 ? highestBidAmount + minBidInc : reservedPrice)
        }
      }

      if (nftDetail.collection?.verified)
        try {
          let collectionMint = new PublicKey(nftDetail.collection.address)
          let collectionMetadata = toMetadataAccount(
            await mx.rpc().getAccount(mx.nfts().pdas().metadata({ mint: collectionMint }))
          )
          setNftCollectionName(collectionMetadata.data.data.name.replace(/\0/g, ''))
          setCollectionName(collectionMetadata.data.data.name.replace(/\0/g, ''))
          setNftCollectionUrl(collectionMetadata.data.data.uri.replace(/\0/g, ''))
        } catch (e: any) {
          console.error(`could not load collection name from chain: ${e.message}`)
          console.error(e)
        }

      activityAPI.getNFTActivity(mintAddress).then(
        response => {
          let dateSorted = response.sort(compareDate)
          setActivityList(dateSorted)
        },
        error => {}
      )

      setLoading(false)

      dispatch({ type: 'set', isLoading: false })
    })()
  }, [nftDetail])

  useEffect(() => {
    axios
      .get(nftCollectionUrl)
      .then(({ data }) => setNftCollectionImage(data?.image))
      .catch(e => console.error(`unable to fetch collection nft image: ${e}`))
  }, [nftCollectionUrl])

  const processFinalizeSale = async () => {
    let data = {
      address: new PublicKey(nftDetail.address),
      sellerAddress,
      price: nftCurrentPrice * LAMPORTS_PER_SOL,
      highestBid: { buyer_address: highBidder },
    }

    setFinalizeData(data)

    if (isOwnNft === true) {
      let deficit = await getBuyerEscrowBalanceDeficit(mx, new PublicKey(highBidder), data.price)
      if (deficit > 0) {
        // show confirm dialog
        setDeficiency(deficit / LAMPORTS_PER_SOL)
        setDeficencyModal(true)
      } else {
        finalizeSale(data)
      }
    } else {
      finalizeSale(data)
    }
  }

  const reloadCreatorOwnerName = async () => {
    let tokenAccount = await getNFTTokenAccount(mx, new PublicKey(nftDetail.address))

    setSellerAddress(tokenAccount.owner)

    let createAddress = getNFTArtistPublicKey({ creators: nftDetail.creators })
    let { username: creatorName } = await usersAPI.get(createAddress)
    setNftCreatorname(creatorName !== null && creatorName.length > 0 ? creatorName : getShortAddress(createAddress))

    let { username: ownerUsername } = await usersAPI.get(tokenAccount.owner.toBase58())
    setNftOwnerUsername(ownerUsername)
  }

  const finalizeSale = async ({ address, sellerAddress, price, highestBid }) => {
    setTimeout(() => {
      setOpenProgressingModal(true)
    }, 500)

    try {
      await refreshToken()
      const { sale } = await executeSale(mx, address, sellerAddress, new PublicKey(highestBid?.buyer_address), price)
      await updateSolBalance()
      AuctionAPI.executeSale(sale.mintAddress.toBase58(), {
        token_address: sale.mintAddress.toBase58(),
        buyer_wallet_id: sale.buyerAddress.toBase58(),
        sale_price: sale.price.toString(),
      }).then(res => {
        setAlertData([
          {
            id: 0,
            title: 'Auction Finalized!',
            description: `You've successfully finalized your auction!`,
            type: 'success',
          },
        ])

        reloadCreatorOwnerName()
        setNftCurrentPrice(0)

        setTimeout(() => {
          setOpenProgressingModal(false)
          reloadNftData()
          setTimeout(() => {
            setShowAlert(true)
          }, 500)
        }, 5000)
      })
    } catch (e) {
      console.error(e)
      setOpenProgressingModal(false)
    }
  }

  const onCancelList = async ({ address, tradeStateAddress }: NftData) => {
    setOpenProgressingModal(true)
    try {
      await refreshToken()

      const result = await cancelList(mx, tradeStateAddress)
      if (result) {
        setNftPrice(0)
        listingsAPI.unlistNft(address.toBase58()).then(response => {
          if (response) {
            setAlertData([
              {
                id: 0,
                title: 'Listing Removed!',
                description: `You've successfully removed your fixed-price listing!`,
                type: 'success',
              },
            ])
            setOpenProgressingModal(false)
            setTimeout(() => {
              setShowUpdateListNFTModal(false)
              setTimeout(() => {
                setShowAlert(true)
                setTimeout(() => {
                  dispatch({ type: 'set', isGetMyNFTs: false })
                }, 800)
              }, 800)
            }, 800)
          }
        }),
          error => {
            console.log(error)
            setOpenProgressingModal(false)
          }
      }
    } catch (e) {
      setOpenProgressingModal(false)
    }
  }

  const onUpdatePrice = async ({ address, tradeStateAddress }: NftData, price: number) => {
    setOpenProgressingModal(true)
    try {
      await refreshToken()

      const result = await updateList(mx, address, tradeStateAddress, price)
      if (result) {
        setNftPrice(price / 1000000000)
        listingsAPI.updateNft(address.toBase58(), { amount: (price / 1000000000).toString() }).then(
          response => {
            if (response) {
              setAlertData([
                {
                  id: 0,
                  title: 'Listing Updated!',
                  description: `You've successfully updated your fixed-price listing!`,
                  type: 'success',
                },
              ])
              setOpenProgressingModal(false)
              setTimeout(() => {
                setShowUpdateListNFTModal(false)
                setTimeout(() => {
                  setShowAlert(true)
                }, 500)
              }, 500)
            }
          },
          error => {
            console.log(error)
            setOpenProgressingModal(false)
          }
        )
      }
    } catch (e) {
      setOpenProgressingModal(false)
    }
  }

  const placeBidAndSave = async (price: string) => {
    if (price[0] === '.') {
      price = '0' + price
    }

    setAuctionLoading(true)

    try {
      await refreshToken()

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

              usersAPI.getLockupValues().then(
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
  }

  const handleSuccessAuction = nftName => {
    reloadNftData()

    setOpenProgressingModal(false)

    setAlertData([
      {
        id: 0,
        title: 'Auction Published!',
        description: `You've successfully published an auction for ${nftName}`,
        type: 'success',
      },
    ])

    setTimeout(() => {
      setShowStartAuctionModal(false)
      setTimeout(() => {
        setShowAlert(true)
      }, 1000)
    }, 1000)
  }

  const handleStartProgress = () => {
    setOpenProgressingModal(true)
  }

  const enableMerchToggle = toggle => {
    if (toggle === true) {
      nftsAPI.enableMerchHub(id, { value: true }).then(
        response => {
          if (response !== null) {
            setMerchToggle(true)
            enableMerch(true)
            setCreateMerchModal(false)
          }
        },
        err => {}
      )
    } else {
      nftsAPI.enableMerchHub(id, { value: false }).then(
        response => {
          if (response !== null) {
            setMerchToggle(false)
            enableMerch(false)
            setRemoveMerchModal(false)
          }
        },
        err => {}
      )
    }
  }

  useEffect(() => {
    let array: any[] = []
    TabList.map(item => {
      let object: any = item
      if (item.id === activeTab) {
        object.selected = true
      } else {
        object.selected = false
      }
      array.push(object)
    })
    setTabList(array)
  }, [activeTab])

  const handleSelectedTab = item => {
    setActiveTab(item.id)
  }

  const { width, height, ref } = useResizeDetector()

  return (
    <div className={styles.container}>
      <div className="w-full grid grid-cols-2 gap-4 lg:gap-10">
        <div className="lg:max-w-[816px] lg:max-h-[816px] col-span-2 lg:col-span-1">
          {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
            hasLoading ? (
              <div
                className={`${styles.skeletonLoader} ${styles.mobileImageArea} aspect-square w-full max-h-[250px]`}
              ></div>
            ) : nftType.includes('vr') ? (
              nftAssetUrl ? (
                <div ref={ref} className={`${styles.mobileImageArea} aspect-square w-full h-full`}>
                  <ModelViewer path={nftAssetUrl} width={width} height={height} orbitLimited />
                </div>
              ) : nftCoverUrl ? (
                <div className={styles.mobileImageArea}>
                  <img src={nftCoverUrl} alt="" className="w-full" />
                </div>
              ) : (
                <h1>Could not load NFT.</h1>
              )
            ) : nftType.includes('image') ? (
              <div className={styles.mobileImageArea}>
                <img src={nftCoverUrl} alt="" className="w-full" />
                {/* <div className={styles.mobileImageBackground} /> */}
              </div>
            ) : nftType.includes('audio') ? (
              <div className={styles.audioArea}>
                <AudioPlayer src={nftAssetUrl} cover={nftCoverUrl} />
              </div>
            ) : nftType.includes('video') ? (
              <div className={styles.videoArea}>
                <div className={styles.mobileVideoThumb}>
                  <img src={nftCoverUrl} alt="" />
                  {play && (
                    <div
                      className="w-full h-full absolute flex items-center"
                      onClick={() => {
                        if (play) setPlay(false)
                      }}
                      dangerouslySetInnerHTML={{
                        __html: `<video autoplay loop webkit-playsinline playsinline class="w-full h-full object-cover overflow-hidden">
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
          ) : hasLoading ? (
            <div
              className={`${styles.skeletonLoader} ${styles.blurBackground} lg:max-w-[816px] lg:max-h-[816px] col-span-2 lg:col-span-1 rounded-[24px]`}
            ></div>
          ) : nftType.includes('vr') && !fullScreen ? (
            <div className={styles.blurBackground}>
              <div className={styles.blurImage} />
              <div ref={ref} className={`${styles.imageArea} w-full h-full`}>
                {nftAssetUrl ? (
                  <>
                    <ModelViewer path={nftAssetUrl} width={width} height={height} orbitLimited />
                    <div className={styles.fullScreenMode} onClick={() => setFullScreenView(nftAssetUrl)}>
                      <Image src={FullScreenModeIcon} alt="" />
                    </div>
                  </>
                ) : nftCoverUrl ? (
                  <img
                    src={nftCoverUrl}
                    alt=""
                    className="w-auto h-auto max-w-full max-h-full object-contain shadow-[0_0_30px_rgba(0,0,0,0.4)]"
                  />
                ) : (
                  <h1>Could not load NFT.</h1>
                )}
              </div>
            </div>
          ) : nftType.includes('image') ? (
            <div className={styles.blurBackground}>
              <div className={styles.blurImage} />
              <div className={styles.imageArea}>
                <img
                  src={nftCoverUrl}
                  alt=""
                  className="w-auto h-auto max-w-full max-h-full object-contain shadow-[0_0_30px_rgba(0,0,0,0.4)]"
                />
                <div className={styles.fullScreenMode} onClick={() => setFullScreenView(nftCoverUrl)}>
                  <Image src={FullScreenModeIcon} alt="" />
                </div>
              </div>
            </div>
          ) : nftType.includes('audio') ? (
            <div className={styles.blurBackground}>
              {nftAssetUrl && (
                <>
                  <div className="absolute inset-0">
                    <img src={nftCoverUrl} alt="" className="min-w-full min-h-full object-cover" />
                    <div
                      className={styles.fullScreenMode}
                      onClick={() => setFullScreenView({ type: 'image', url: nftCoverUrl })}
                    >
                      <Image src={FullScreenModeIcon} alt="" />
                    </div>
                  </div>
                </>
              )}
              <div className={styles.blurImage} />
              <div className={styles.audioArea}>
                <AudioPlayer src={nftAssetUrl} cover={nftCoverUrl} />
              </div>
            </div>
          ) : nftType.includes('video') ? (
            <div className={styles.blurBackground}>
              {nftAssetUrl ? (
                <>
                  <div className="absolute inset-0">
                    <img src={nftCoverUrl} alt="" className="min-w-full min-h-full object-cover" />
                  </div>
                  <div className={styles.videoArea}>
                    <video controls autoPlay loop className="max-w-full max-h-full">
                      <source type="video/mp4" src={nftAssetUrl} />
                    </video>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.videoArea}>
                    <video controls autoPlay loop className="max-w-full max-h-full">
                      <source type="video/mp4" src={nftAssetUrl} />
                    </video>
                  </div>
                  {!nftAssetUrl && (
                    <div className={styles.errorMessage}>
                      <ErrorMessageIcon />
                      <div>Video File Missing</div>
                    </div>
                  )}
                </>
              )}
              <div className={styles.blurImage} />
            </div>
          ) : (
            <></>
          )}
        </div>
        {/* )} */}

        <div className="col-span-2 lg:col-span-1 z-10">
          <div className={styles.nftDetailCard}>
            <div className="w-full flex flex-wrap">
              <div className="w-full flex flex-wrap justify-between items-center">
                <div className="flex items-center gap-[10px] lg:gap-[20px]">
                  {hasLoading ? (
                    <div className={`${styles.skeletonLoader} ${styles.ellipseArea}`}></div>
                  ) : (
                    <div className="cursor-pointer" onClick={() => window.open(explorerURL)}>
                      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                        <div className={styles.ellipseArea}>
                          <ThreeEllipseMobileIcon alt="" />
                        </div>
                      ) : (
                        <div className={styles.ellipseArea}>
                          <ThreeEllipseIcon alt="" />
                        </div>
                      )}
                    </div>
                  )}

                  {hasLoading ? (
                    <div className={`${styles.skeletonLoader} w-[35px] h-[35px] rounded-3xl`}></div>
                  ) : (
                    <div className="cursor-pointer flex gap-[10px] items-center">
                      {merchToggle ? (
                        <MerchToggleEnabledIcon
                          alt=""
                          onClick={() => {
                            if (isCreatedNft) setRemoveMerchModal(true)
                          }}
                          onMouseEnter={() => setMerchHover(true)}
                          onMouseLeave={() => setMerchHover(false)}
                        />
                      ) : (
                        <MerchToggleDisabledIcon
                          alt=""
                          onClick={() => {
                            if (isCreatedNft) setCreateMerchModal(true)
                          }}
                          onMouseEnter={() => setMerchHover(true)}
                          onMouseLeave={() => setMerchHover(false)}
                        />
                      )}

                      {merchHover && <div className={styles.infoText}>Foster Studio</div>}
                    </div>
                  )}
                </div>

                <div className="inline">
                  {hasLoading ? (
                    <div className={`${styles.skeletonLoader} w-[150px] lg:w-[300px] h-[22px] rounded-full`}></div>
                  ) : (
                    <div className="flex gap-4 sm:gap-1 xs:gap-1 md:gap-3">
                      <div className="flex items-center cursor-pointer mr-[20px] lg:mr-[16px]">
                        <Image
                          src={like ? HeartFilledRedIcon : HeartFilledWhiteIcon}
                          alt=""
                          className=""
                          onClick={() => changeLikeStatus()}
                        />

                        <div className={styles.text} onClick={() => setShowLikeModal(true)}>
                          {likeCount}
                        </div>
                      </div>
                      <div className="flex items-center cursor-pointer mr-[20px]">
                        <Image
                          src={save ? TicketGreenIcon : TicketWhiteIcon}
                          alt=""
                          className=""
                          onClick={() => changeSaveStatus()}
                        />
                        <div className={styles.text} onClick={() => setShowSaveModal(true)}>
                          {saveCount}
                        </div>
                      </div>
                      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                        <div onClick={() => setOpenShareModal(true)}>
                          <ShareSmallIcon alt="" />
                        </div>
                      ) : (
                        <MenuSocialShare
                          type="nft"
                          vote={share}
                          setVote={setShare}
                          voteCount={shareCount}
                          setVoteCount={setShareCount}
                          message={'Check out this fresh art on @foster_protocol #fostermarketplace'}
                          url={`/nft/${id}`}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              {hasLoading ? (
                <div
                  className={`${styles.skeletonLoader} ${styles.title} w-[200px] lg:w-[300px] h-[22px] mt-[15px] lg:mt-[28px] rounded-full`}
                ></div>
              ) : (
                <>
                  <div className="w-full flex mt-[15px] lg:mt-[28px]">
                    <div className={styles.title}>{nftName}</div>
                  </div>

                  <div className="w-full flex flex-wrap mt-[9px] lg:mt-[6px] gap-x-[14px] lg:gap-x-[34px]">
                    <div className="flex gap-1 lg:gap-2">
                      <div className={styles.grayText}>Created by</div>
                      <Link href={`/${nftCreatorname}`} passHref>
                        <a>
                          <div className={styles.greenText} onClick={() => gotoUserDetail(nftCreatorname)}>
                            {getDisplayUserName(nftCreatorname)}
                          </div>
                        </a>
                      </Link>
                    </div>

                    {nftOwnerUsername.length > 0 && nftOwnerUsername !== nftCreatorname && (
                      <div className="flex gap-1 lg:gap-2">
                        <div className={styles.grayText}>Fostered by</div>
                        <Link href={`/${nftOwnerUsername}`} passHref>
                          <a>
                            <div className={styles.greenText} onClick={() => gotoUserDetail(nftOwnerUsername)}>
                              {getDisplayUserName(nftOwnerUsername)}
                            </div>
                          </a>
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
              {hasLoading ? (
                <div
                  className={`${styles.skeletonLoader} ${styles.collectionContainer} w-[200px] h-[40px] mt-[15px] rounded-full`}
                ></div>
              ) : (
                <div className={styles.collectionContainer}>
                  {nftCollectionUrl.length > 0 && (
                    <div className="justify-between items-center mt-[15px] lg:mt-[28px]">
                      <div className={styles.collectionText}>Collection</div>
                      <Link href={`/collection/${nftCollectionAddress}`} passHref>
                        <a>
                          <div className={styles.collectionName}>
                            {nftCollectionImage !== undefined && nftCollectionImage.length > 0 && (
                              <Image
                                src={nftCollectionImage}
                                alt=""
                                width={25}
                                height={25}
                                className="object-cover rounded-[4px]"
                              />
                            )}
                            {nftCollectionName}
                          </div>
                        </a>
                      </Link>
                    </div>
                  )}
                  {editionDetail && (
                    <div className={styles.editionContainer}>
                      <div className="w-full flex justify-between">
                        <div className={styles.editionTitle}>Token Type</div>
                        <div className={styles.editionValue}>
                          {editionDetail['maxSupply'] ? 'Limited Edition' : 'Open Edition'}
                        </div>
                      </div>
                      <div className="w-full flex justify-between mt-[15px]">
                        <div className={styles.editionTitle}>Editon Number</div>
                        <div className={styles.editionValue}>{editionDetail['number']}</div>
                      </div>
                      <div className="w-full flex justify-between mt-[15px]">
                        <div className={styles.editionTitle}>Edition Supply</div>
                        <div className={styles.editionValue}>{editionDetail['supply']}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-full flex flex-wrap">
              {loadListing && (
                <div
                  className={`${styles.skeletonLoader}  ${styles.collectionContainer} w-[200px] mt-[20px] lg:mt-[0px] h-[120px] lg:h-[100px] rounded-[12px]`}
                ></div>
              )}
              {nftPrice > 0 && !liveAuction ? (
                <>
                  <div className="w-full flex gap-2 mt-[70px] lg:mt-[0px]">
                    <div className={styles.fixedPrice}>Fixed Price</div>
                    <div>
                      <div className="mt-1 lg:mt-[6px] h-[14px] flex items-center">
                        <div
                          className="h-[14px] flex justify-center items-center cursor-pointer"
                          onMouseEnter={() => setInfoFocus(true)}
                          onMouseLeave={() => setInfoFocus(false)}
                          onClick={() => {
                            setInfoFocus(true)
                            setTimeout(() => {
                              setInfoFocus(false)
                            }, 2000)
                          }}
                        >
                          {infoFocus ? <InfoGreenIcon /> : <InfoGrayIcon />}
                        </div>
                        {infoFocus && (
                          <div className={styles.infoText}>
                            The USD value of this artwork is ${(solToUsdRate * nftPrice).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex items-center mt-[9px]">
                    <div className="flex items-center mt-[3px]">
                      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                        <SolanaLogoMobileIcon alt="" />
                      ) : (
                        <SolanaLogoIcon alt="" />
                      )}
                    </div>
                    <div className={`${styles.whiteTitle} ml-[6px]`}>{nftPrice.toFixed(2)}</div>
                  </div>

                  {(isOwnNft === false || isOwnNft === null) && (
                    <div className="w-full flex mt-[7px] lg:mt-[20px] gap-6 lg:gap-10">
                      {tradeStateAddress ? (
                        <GradientButton
                          fullWidth
                          label={'Quick Buy'}
                          onClick={() => quickBuy()}
                          icon1={<QuickBuyBlackIcon alt="" />}
                          direction="rtl"
                          fontFamily="Muli-SemiBold"
                          fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '16px' : '18px'}
                          height={50}
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
                        fontFamily="Muli-SemiBold"
                        gap="4px"
                        fullWidth
                        height={50}
                        fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '16px' : '18px'}
                        borderColor="rgba(var(--main-bg-color-rgb), 0.25)"
                      />
                    </div>
                  )}

                  {isOwnNft === true ? (
                    <div className="w-full flex content-none mt-[20px]">
                      <div className="w-full mb-1 mt-0 lg:mt-0 lg:mb-5">
                        <OutlineButton
                          label="Delist or Update"
                          onClick={() => setShowUpdateListNFTModal(true)}
                          color="var(--main-bg-color)"
                          borderColor="#707070"
                          borderWidth="2"
                          fullWidth
                        />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ) : endTime !== null &&
                getTimeDifference(endTime) < 0 &&
                nftCurrentPrice > 0 &&
                (isOwnNft === true || publicKey?.toBase58() === highBidder) &&
                connected ? (
                <div className="w-full mb-1 mt-5 lg:mt-0 lg:mb-5">
                  <OutlineButton
                    label="Finalize Sale"
                    onClick={() => processFinalizeSale()}
                    color="var(--main-bg-color)"
                    borderColor="#707070"
                    borderWidth="2"
                    fullWidth
                  />
                </div>
              ) : liveAuction === true ? (
                <>
                  <div
                    className={`mt-6 w-full ${
                      showPlaceBidButton && isOwnNft === false ? 'h-[180px] lg:h-[200px]' : 'h-[52px] lg:h-[60px]'
                    } relative`}
                  >
                    <div className={styles.auctionContainer}>
                      <AuctionCard
                        currentPrice={nftCurrentPrice}
                        reservePrice={nftReservePrice}
                        endTime={endTime}
                        startTime={startTime}
                        setIsEnded={setIsEnded}
                        setIsStarted={setIsStarted}
                      />

                      {showPlaceBidButton &&
                        !isOwnNft &&
                        (loading ? (
                          <div className="w-full pl-[20px] pr-[20px]">
                            <div className="w-full flex justify-center">
                              <div
                                className={`${styles.skeletonLoader} w-[100%] h-[110px] lg:h-[130px] rounded-[12px]`}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {publicKey?.toBase58() === highBidder ? (
                              <>
                                <div className="w-full flex justify-center">
                                  <PriceInput
                                    value={price}
                                    placeholder="Enter Bid amount"
                                    backgroundColor={'rgba(var(--main-bg-color-rgb), 0.05)'}
                                    fullWidth
                                    type="number"
                                    min={0}
                                    margin
                                    height={
                                      viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '40px' : '50px'
                                    }
                                    onMinimum={() => {}}
                                    onChange={value => {
                                      if (value < 0) {
                                        setPrice('')
                                      } else {
                                        setPrice(value)
                                      }
                                    }}
                                  />
                                </div>
                                <div className={styles.highBidText}>You are currently the highest bidder!</div>
                              </>
                            ) : (
                              <>
                                <div className="w-full flex justify-center">
                                  <PriceInput
                                    value={price}
                                    placeholder="Enter Bid amount"
                                    backgroundColor={'rgba(var(--main-bg-color-rgb), 0.05)'}
                                    fullWidth
                                    type="number"
                                    min={0}
                                    margin
                                    height={
                                      viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '40px' : '50px'
                                    }
                                    onMinimum={() => setPrice(minBidAmount.toFixed(2))}
                                    onChange={value => {
                                      if (value < 0) {
                                        setPrice('')
                                      } else {
                                        setPrice(value)
                                      }
                                    }}
                                  />
                                </div>
                                <div
                                  className={`${styles.placeBidBG} ${
                                    isEnded ? styles.placeBidDisabledBG : styles.placeBidEnabledLightBG
                                  }`}
                                  onClick={async () => {
                                    if (price === '' || parseFloat(price) < minBidAmount) return

                                    if (isEnded) return

                                    if (!connected) {
                                      setVisible(true)
                                      return
                                    }
                                    placeBidAndSave(price)
                                  }}
                                >
                                  {auctionLoading ? (
                                    <LoadingButton fullWidth height={51} />
                                  ) : (
                                    <div className="flex">
                                      <div
                                        className={`${styles.placeBidBtn} ${
                                          isEnded || price === '' || parseFloat(price) < minBidAmount
                                            ? styles.placeBidDisabledColor
                                            : styles.placeBidEnabledColor
                                        }`}
                                      >
                                        Place Bid
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className={styles.minText}>Min:&nbsp;{minBidAmount.toFixed(2)}&nbsp;SOL</div>
                              </>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              ) : !loading && nftInfo && connected ? (
                isOwnNft === true ? (
                  <div className="w-full flex gap-[20px] mt-[20px]">
                    <OutlineButton
                      label="Start Auction"
                      onClick={() => setShowStartAuctionModal(true)}
                      color="var(--main-bg-color)"
                      borderColor="#707070"
                      borderWidth="2"
                      fullWidth
                      fontFamily="Muli-SemiBold"
                      fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '16px' : '18px'}
                    />
                    <GradientButton
                      label={'List NFT'}
                      fullWidth
                      onClick={() => setShowListNFTModal(true)}
                      direction="rtl"
                      fontFamily="Muli-SemiBold"
                      fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '16px' : '18px'}
                    />
                  </div>
                ) : isOwnNft === false ? (
                  <div className="w-full flex gap-[20px] mt-[20px]">
                    <OutlineButton
                      label="Make Offer"
                      onClick={() => setOpenOfferModal(true)}
                      color="var(--main-bg-color)"
                      borderColor="#707070"
                      borderWidth="2"
                      fullWidth
                    />
                  </div>
                ) : (
                  <></>
                )
              ) : (
                <div></div>
              )}

              <div className={'mt-6 w-full h-[180px] lg:h-[200px] relative'}>
                {hasLoading ? (
                  <div className={`${styles.skeletonLoader} ${styles.activityContainer}`}></div>
                ) : (
                  <div className={styles.activityContainer}>
                    <div className={styles.selectedTab}>
                      <SelectedTab tabList={tabList} onChange={item => handleSelectedTab(item)} />
                    </div>
                    <div className={styles.mainContainer}>
                      {activeTab === 0 && (
                        <div className="w-full flex flex-wrap flex-column space-between px-[35px] gap-6">
                          {nftDescription ? (
                            <div className={styles.whiteDescription}>{nftDescription}</div>
                          ) : (
                            <div className={styles.whiteDescription}>
                              No description was detected for this artwork.{' '}
                            </div>
                          )}

                          <div className="w-full flex justify-between gap-2 lg:gap-3 xl:gap-4">
                            <div className="flex flex-wrap flex-col gap-2">
                              <div className={styles.categories}>Categories</div>
                              {nftCategories && nftCategories.length > 0 ? (
                                <div className="flex flex-row">
                                  {nftCategories.map((item, index) => (
                                    <SmallCategoryChip data={item} key={index} />
                                  ))}
                                </div>
                              ) : (
                                <div className="flex flex-row">
                                  <SmallCategoryChip data={['N/A']} />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 text-center">
                              <div className={styles.whiteRoyalties}>Royalties</div>
                              <div className={styles.greenRoyalties}>{nftRoyalties}%</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {activeTab === 1 &&
                        activityList.map((item, index) => {
                          let date = new Date(item.created_at)

                          let dateString = date.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })

                          let timeString = date
                            .toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            })
                            .replace(/:\d{2}\s/, ' ')

                          let formattedDate = `${dateString} • ${timeString}`

                          return (
                            <div className={styles.subContainer} key={index}>
                              <div className="w-full flex flex-col">
                                {item.action_type === 'AuctionWon' ? (
                                  <div className={styles.actionType}>
                                    <span
                                      className={styles.userName}
                                      onClick={() => {
                                        router.push(`/${item.reference_username}`)
                                      }}
                                    >
                                      {getDisplayUserName(item.reference_username)}
                                    </span>
                                    <span>&nbsp;has won the auction</span>
                                  </div>
                                ) : item.action_type === 'AuctionStarted' ? (
                                  <div className={styles.actionType}>
                                    <span
                                      className={styles.userName}
                                      onClick={() => {
                                        router.push(`/${item.owner_username}`)
                                      }}
                                    >
                                      {getDisplayUserName(item.owner_username)}
                                    </span>
                                    <span>&nbsp;published an auction</span>
                                  </div>
                                ) : item.action_type === 'AuctionCancelled' ? (
                                  <div className={styles.actionType}>
                                    <span
                                      className={styles.userName}
                                      onClick={() => {
                                        router.push(`/${item.owner_username}`)
                                      }}
                                    >
                                      {getDisplayUserName(item.owner_username)}
                                    </span>
                                    <span>&nbsp;cancelled auction</span>
                                  </div>
                                ) : item.action_type === 'ListingAdded' ? (
                                  <div className={styles.actionType}>
                                    <span
                                      className={styles.userName}
                                      onClick={() => {
                                        router.push(`/${item.owner_username}`)
                                      }}
                                    >
                                      {getDisplayUserName(item.owner_username)}
                                    </span>
                                    <span>&nbsp;listed artwork for sale</span>
                                  </div>
                                ) : item.action_type === 'ListingUpdated' ? (
                                  <div className={styles.actionType}>
                                    <span
                                      className={styles.userName}
                                      onClick={() => {
                                        router.push(`/${item.owner_username}`)
                                      }}
                                    >
                                      {getDisplayUserName(item.owner_username)}
                                    </span>
                                    <span>&nbsp;updated listing</span>
                                  </div>
                                ) : item.action_type === 'ListingCancelled' ? (
                                  <div className={styles.actionType}>
                                    <span
                                      className={styles.userName}
                                      onClick={() => {
                                        router.push(`/${item.owner_username}`)
                                      }}
                                    >
                                      {getDisplayUserName(item.owner_username)}
                                    </span>
                                    <span>&nbsp;removed listing</span>
                                  </div>
                                ) : item.action_type === 'OfferCancelled' ? (
                                  <div className={styles.actionType}>
                                    <span
                                      className={styles.userName}
                                      onClick={() => {
                                        router.push(`/${item.reference_username}`)
                                      }}
                                    >
                                      {getDisplayUserName(item.reference_username)}
                                    </span>
                                    <span>&nbsp;cancelled their offer</span>
                                  </div>
                                ) : item.action_type === 'OfferMade' ? (
                                  <div className={styles.actionType}>
                                    <span
                                      className={styles.userName}
                                      onClick={() => {
                                        router.push(`/${item.reference_username}`)
                                      }}
                                    >
                                      {getDisplayUserName(item.reference_username)}
                                    </span>
                                    <span>&nbsp;made an offer</span>
                                  </div>
                                ) : item.action_type === 'BidPlaced' ? (
                                  <div className={styles.actionType}>
                                    <span
                                      className={styles.userName}
                                      onClick={() => {
                                        router.push(`/${item.reference_username}`)
                                      }}
                                    >
                                      {getDisplayUserName(item.reference_username)}
                                    </span>
                                    <span>&nbsp;placed a bid</span>
                                  </div>
                                ) : item.action_type === 'QuickBuy' ? (
                                  <div className={styles.actionType}>
                                    <span
                                      className={styles.userName}
                                      onClick={() => {
                                        router.push(`/${item.reference_username}`)
                                      }}
                                    >
                                      {getDisplayUserName(item.reference_username)}
                                    </span>
                                    <span>&nbsp;purchased artwork</span>
                                  </div>
                                ) : (
                                  ''
                                )}
                                <div className={styles.dateValue}>{formattedDate}</div>
                              </div>
                              <div className="w-fit-content flex flex-col">
                                {item.action_type === 'ListingCancelled' ||
                                item.action_type === 'OfferCancelled' ||
                                item.action_type === 'AuctionCancelled' ? (
                                  <></>
                                ) : (
                                  <>
                                    <div className="w-fit-content h-4 lg:h-[25px] flex flex-row justify-end items-center">
                                      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                                        <SolanaLogoMobileIcon alt="" />
                                      ) : (
                                        <SolanaLogoIcon className="mt-[2px]" alt="" />
                                      )}
                                      <div className={styles.userName}>&nbsp;{item.amount}</div>
                                    </div>
                                    <div className={styles.usdValue}>
                                      ${item.amount === 0 ? '---' : (item.amount * solToUsdRate).toFixed(2)}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {openProgressingModal && <ProgressingModal open={openProgressingModal} />}

      <StartAuctionModal
        data={{
          mintAddress: new PublicKey(nftDetail.address),
          name: nftName,
          json: nftDetail.json,
        }}
        open={showStartAuctionModal}
        onSuccess={nft => handleSuccessAuction(nft)}
        onStartProgress={() => handleStartProgress()}
        onClose={() => setShowStartAuctionModal(false)}
      />

      <ListNFTModal
        data={{
          mintAddress: new PublicKey(nftDetail.address),
          name: nftName,
          json: nftDetail.json,
        }}
        open={showListNFTModal}
        onClose={(status: string, price) => {
          setShowListNFTModal(false)
          setIsOwnNft(true)
          setNftPrice(parseFloat(price))
          reloadNftData()
          if (status === 'listed') router.reload()
        }}
      />

      <UpdateNFTModal
        data={nftListingData}
        open={showUpdateListNFTModal}
        onClose={() => setShowUpdateListNFTModal(false)}
        onCancelList={onCancelList}
        onUpdatePrice={onUpdatePrice}
      />

      {showLikeModal && publicKey && (
        <LikeModal
          open={showLikeModal}
          ownWallet={publicKey?.toBase58()}
          close={() => setShowLikeModal(false)}
          type="liked"
          wallet={mintAddress}
        />
      )}

      {showSaveModal && publicKey && (
        <LikeModal
          open={showSaveModal}
          ownWallet={publicKey?.toBase58()}
          close={() => setShowSaveModal(false)}
          type="saved"
          wallet={mintAddress}
        />
      )}

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
          siteUrl={`/nft/${id}`}
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
      {deficencyModal && (
        <EscrowDeficientModal
          onFinalize={() => finalizeSale(finalizeData)}
          open={deficencyModal}
          close={() => setDeficencyModal(false)}
          highestBid={nftCurrentPrice}
          deficiency={deficiency}
          nftName={nftName}
          collectionName={nftCollectionName}
        />
      )}
      {createMerchModal && (
        <CreateMerchSudioModal
          onContinue={() => enableMerchToggle(true)}
          open={createMerchModal}
          close={() => setCreateMerchModal(false)}
        />
      )}
      {removeMerchModal && (
        <RemoveMerchSudioModal
          onContinue={() => enableMerchToggle(false)}
          open={removeMerchModal}
          close={() => setRemoveMerchModal(false)}
        />
      )}
      {openShareModal && (
        <SocialShareModal
          open={openShareModal}
          close={() => setOpenShareModal(false)}
          vote={share}
          setVote={setShare}
          voteCount={shareCount}
          setVoteCount={setShareCount}
          message={'Check out this fresh art on @foster_protocol #fostermarketplace'}
          url={`/nft/${id}`}
        />
      )}
      {openReportMenuModal && (
        <ReportMobileModal
          open={openReportMenuModal}
          close={() => setOpenReportMenuModal(false)}
          address={id}
          onClick={() => {
            setOpenReportMenuModal(false)
            setOpenReportModal(true)
          }}
          nftType={nftType}
        />
      )}
    </div>
  )
}

export default MainSection

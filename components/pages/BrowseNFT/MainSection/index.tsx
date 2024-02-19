import React, { useCallback, useEffect, useState, useMemo } from 'react'
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

// components
import MenuSocialShare from 'components/Menu/MenuSocialShare'
import GradientButton from 'components/Button/GradientButton'
import ProgressingModal from 'components/Modal/ProgressingModal'
import Alert from 'components/Alert'
import MakeAnOfferModal from 'components/Modal/MakeAnOfferModal'
import ReportAnIssueModal from 'components/Modal/ReportAnIssueModal'
import LoadingButton from 'components/Button/LoadingButton'

// custom functions
import { useViewport } from 'utils'
import { useAuthentication } from 'hooks/useAuthentication'
import {
  getNFTCategories,
  getNFTTokenAccount,
  getNFTSocialInfo,
  getNFTArtistPublicKey,
  getNftFromDAS,
} from 'utils/nfts.utils'
import { loadAuctionHouse } from 'utils/auction.util'
import {
  cancelListing,
  fetchAuctionListing,
  getBuyerEscrowBalanceDeficit,
  getListingConfig,
  parseAuctionListing,
  placeBid,
} from 'utils/auctioneer.util'

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
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import InfoGrayIcon from 'assets/icons/info-gray-small.svg?component'
import InfoGreenIcon from 'assets/icons/info-green-small.svg?component'
import EditNftMetaIcon from 'assets/icons/edit-edition.svg?component'

// styles
import styles from './index.module.scss'

// solana
import { buyNFT, offerNFT } from 'utils/auction.util'
import { useMetaplex } from 'hooks/useMetaplex'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { toLazyListing, toListingReceiptAccount, GpaBuilder } from '@metaplex-foundation/js'
import type { Sft, Metadata, Nft } from '@metaplex-foundation/js'
import type { ListingConfig as AuctionListing } from '@metaplex-foundation/mpl-auctioneer'

// call apis
import nftsAPI from 'apis/nfts'
import usersAPI from 'apis/user'
import listingsAPI from 'apis/listings'
import activityAPI from 'apis/activity'
import AuctionAPI from 'apis/auctions'

import { useWallets } from 'hooks/useWallets'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { CDN_PREFIX, compareDate, getTimeDifferenceWithAuction } from 'utils/helpers'
import ModalPlaceBid from 'components/Modal/ModalPlaceBid'
import AuctionCard from 'components/Card/AuctionCard'
import SecondaryButton from 'components/Button/SecondaryButton'
import SocialShareModal from 'components/Menu/SocialShareModal'
import ReportMobileModal from 'components/Menu/ReportMobileModal'
import 'react-placeholder/lib/reactPlaceholder.css'
import LikeModal from 'components/Modal/LikeModal'
import OutlineButton from 'components/Button/OutlineButton'
import ListNFTModal from 'components/Modal/ListNFTModal'
import { getShortAddress } from 'utils/wallet.util'
import { executeSale } from 'utils/auctioneer.util'
import EscrowDeficientModal from 'components/Modal/EscrowDeficientModal'
import CreateMerchSudioModal from 'components/Modal/CreateMerchSudioModal'
import RemoveMerchSudioModal from 'components/Modal/RemoveMerchSudioModal'
import { getExplorerUrl } from 'utils/explorer'
import PriceInput from 'components/Input/PriceInput'
import UpdateNFTModal from 'components/Modal/UpdateNFTModal'
import Link from 'next/link'
import { NftApiData } from 'types/nft'
import AuctionDetail from '../AuctionDetail'
import NFTActivityInfoSection from './NFTActivityInfoSection'
import NFTCreatorDataSection from './NFTCreatorDataSection'
import NFTAssetSection from './NFTAssetSection'
import EditMetaModal from 'components/Modal/EditMetaModal'

export interface MainSectionProps {
  nftDetail: NftApiData
  editionDetail: any
  nftInfo: any
  setFullScreenView: any
  reloadNftData: any
  enableMerch: any
  setCollectionName: any
  fullScreen: boolean
  setShowAuctionSection: any
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
  setShowAuctionSection,
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
  const [loadedNftInfo, setLoadedNftInfo] = useState(false)
  const [reservedPrice, setReservedPrice] = useState(0)
  const [highestBidAmount, setHighestBidAmount] = useState(0)
  const [minBidIncrement, setMinBidIncrement] = useState<number>(0)
  const [sellerAddress, setSellerAddress] = useState<PublicKey>()
  const [tokenAccountInfo, setTokenAccountInfo] = useState(null)
  const [highBidder, setHighBidder] = useState('')
  const [endTime, setEndTime] = useState<string>(null)
  const [startTime, setStartTime] = useState<string>(null)
  const [endPhaseDuration, setEndPhaseDuration] = useState<number>(0)
  const [isEnded, setIsEnded] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [showPlaceBidButton, setShowPlaceBIdButton] = useState(false)
  const [liveAuction, setLiveAuction] = useState(false)
  const [showAuctionDetail, setShowAuctionDetail] = useState(false)
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
  const [showNftMeta, setShowNftMeta] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [isOwnNft, setIsOwnNft] = useState(null)
  const [isCreatedNft, setIsCreatedNft] = useState(null)
  const [infoFocus, setInfoFocus] = useState(false)
  const [auctionInfoFocus, setAuctionInfoFocus] = useState(false)
  const [merchHover, setMerchHover] = useState(false)
  const [price, setPrice] = useState<string>('')

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

  const nftType: string = (nftDetail.json?.category as string) ?? 'image'
  const coverUrl = nftDetail.json?.image ?? DefaultNftBG.src
  const nftCoverUrl = coverUrl.includes('=gif') ? coverUrl.replace(CDN_PREFIX, '') : coverUrl
  const nftAssetUrl: string = nftDetail.json?.animation_url as string
  const nftName = nftDetail.json?.name ?? 'No name found'
  const nftDescription = nftDetail.json?.description ?? ''
  const nftRoyalties = (nftDetail.sellerFeeBasisPoints / 100).toString()
  const nftCategories = getNFTCategories(nftDetail)
  const mintAddress = nftDetail.address.toString()
  const nftCollectionAddress = nftDetail.collection?.address && nftDetail.collection?.address.toString()

  const [nftCollectionName, setNftCollectionName] = useState('')
  const [nftCollectionImage, setNftCollectionImage] = useState('')

  const [nftPrice, setNftPrice] = useState(0)
  const [nftOwnerUsername, setNftOwnerUsername] = useState('')
  const [nftCreatorname, setNftCreatorname] = useState('')
  const [nftListingData, setNftListingData] = useState(null)
  const [tradeStateAddress, setTradeStateAddress] = useState('')
  const [activityList, setActivityList] = useState([])
  const [loadedActivity, setLoadedActivity] = useState(false)
  const [merchToggle, setMerchToggle] = useState(false)
  const [createMerchModal, setCreateMerchModal] = useState(false)
  const [removeMerchModal, setRemoveMerchModal] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [loadListing, setLoadListing] = useState(false)
  const [nameLoading, setNameLoading] = useState(true)

  const minBidAmount = highestBidAmount > 0 ? highestBidAmount + minBidIncrement : reservedPrice

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
      let { merch_hub_enabled, likes, shares, saves, liked, saved, shared, auction } = nftInfo
      let sharedSocial = shared?.facebook || shared?.twitter || shared?.telegram
      setHighBidder(nftInfo?.auction?.highest_bid?.buyer_address ?? '')
      setMerchToggle(merch_hub_enabled)
      enableMerch(merch_hub_enabled)
      setLikeCount(likes)
      setShareCount(shares)
      setSaveCount(saves)
      setLike(liked)
      setSave(saved)
      setShare(sharedSocial)
      setEndPhaseDuration(auction?.auction?.end_phase_duration ?? 0)
      setLoadedNftInfo(true)
    }
  }, [nftInfo])

  // set timeout to switch to end phase
  useEffect(() => {
    if (!nftInfo) return

    let setEndPhaseTimeoutHandle: number | null = null

    let endPhaseMinBidIncrement = nftInfo.auction?.auction?.end_phase_bid_increment ?? 0
    function endPhaseStarted() {
      setMinBidIncrement(endPhaseMinBidIncrement)
      setPrice((highestBidAmount + endPhaseMinBidIncrement).toFixed(2))
    }

    if (endPhaseDuration > 0 && endPhaseMinBidIncrement > 0 && liveAuction && !isEnded) {
      let endTimestampMs = new Date(endTime).getTime()
      let endPhaseStartsIn = endTimestampMs - Date.now() - endPhaseDuration * 1000
      if (endPhaseStartsIn <= 0) endPhaseStarted()
      else setTimeout(endPhaseStarted, endPhaseStartsIn)
    }

    if (setEndPhaseTimeoutHandle != null) return () => clearTimeout(setEndPhaseTimeoutHandle)
  }, [endPhaseDuration, liveAuction, isEnded, endTime, highestBidAmount, nftInfo])

  useEffect(() => {
    if (publicKey !== null && sellerAddress !== null) {
      setIsOwnNft(publicKey?.toBase58() === sellerAddress?.toBase58())
    }
    if (publicKey !== null && nftInfo?.creator_address !== null && nftInfo?.owner_address !== null) {
      setIsCreatedNft(
        publicKey?.toBase58() === nftInfo?.creator_address && publicKey?.toBase58() === nftInfo?.owner_address
      )
    }
  }, [publicKey, sellerAddress, nftInfo])

  const handleAuctionData = useCallback(
    async (auctionListing: AuctionListing) => {
      if (!auctionListing) return
      setLiveAuction(true)

      // use to set auction info
      let {
        startTime,
        endTime,
        minBidIncrement: minBidIncrementBN,
        reservePrice,
        highestBid: { amount },
      } = auctionListing
      let minBidInc = parseFloat(minBidIncrementBN.toString()) / LAMPORTS_PER_SOL
      let reservedPrice = parseFloat(reservePrice.toString()) / LAMPORTS_PER_SOL
      let highestBidAmount = parseFloat(amount.toString()) / LAMPORTS_PER_SOL
      let minBidAmount = highestBidAmount > 0 ? highestBidAmount + minBidInc : reservedPrice

      setReservedPrice(reservedPrice)
      setNftReservePrice(reservedPrice)

      setHighestBidAmount(highestBidAmount)
      setNftCurrentPrice(highestBidAmount)

      setStartTime(new Date(parseInt(startTime.toString()) * 1000).toISOString())
      let endTimestamp = parseInt(endTime.toString())
      setEndTime(new Date(endTimestamp * 1000).toISOString())
      if (!minBidIncrement) {
        setMinBidIncrement(minBidInc)
        setPrice(minBidAmount.toFixed(2))
      }

      if (endTimestamp < Math.floor(Date.now() / 1000)) setIsEnded(true)
    },
    [minBidIncrement]
  )

  useEffect(() => {
    ;(async () => {
      if (!nftDetail) return

      let tokenAccount = await getNFTTokenAccount(mx, new PublicKey(nftDetail.address))
      setSellerAddress(tokenAccount.owner)

      const creators = nftDetail.creators.map(c => ({
        ...c,
        address: new PublicKey(c.address),
      }))

      let createAddress = getNFTArtistPublicKey({ creators })
      let { username: creatorName } = await usersAPI.get(createAddress)
      setNftCreatorname(creatorName !== null && creatorName.length > 0 ? creatorName : getShortAddress(createAddress))

      let { username: ownerUsername } = await usersAPI.get(tokenAccount.owner.toBase58())
      setNftOwnerUsername(ownerUsername ?? getShortAddress(tokenAccount.owner))

      setNameLoading(false)
      setTokenAccountInfo(tokenAccount)
    })()
  }, [nftDetail])

  useEffect(() => {
    if (!tokenAccountInfo) return

    let auctionListenerHandle: number | null = null
    ;(async () => {
      if (!nftDetail) return
      setLoading(true)

      if (tokenAccountInfo.delegate?.equals(mx.auctionHouse().pdas().programAsSigner())) {
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
          if (!connected) {
            setIsOwnNft(false)
          }

          let auctionListing = await fetchAuctionListing(
            mx,
            tokenAccountInfo.owner,
            tokenAccountInfo.address,
            tokenAccountInfo.mint
          )

          let [listingConfig] = await getListingConfig(
            tokenAccountInfo.owner,
            tokenAccountInfo.address,
            tokenAccountInfo.mint
          )

          await handleAuctionData(auctionListing)
          auctionListenerHandle = await mx.connection.onAccountChange(
            listingConfig,
            accountInfo => handleAuctionData(parseAuctionListing(accountInfo)),
            'single'
          )
        }
      }
      setLoading(false)

      dispatch({ type: 'set', isLoading: false })

      return () => {
        if (auctionListenerHandle) mx.connection.removeAccountChangeListener(auctionListenerHandle)
      }
    })()
  }, [tokenAccountInfo])

  useEffect(() => {
    ;(async () => {
      if (nftDetail.collection) {
        const collectionMetadata = await getNftFromDAS(nftDetail.collection.address)
        if (collectionMetadata) {
          setCollectionName(collectionMetadata.content.metadata.name)
          setNftCollectionImage(collectionMetadata.content.links.image)
          setNftCollectionName(collectionMetadata.content.metadata.name)
        }
      }

      activityAPI.getNFTActivity(mintAddress).then(
        response => {
          let dateSorted = response.sort(compareDate)
          setActivityList(dateSorted)
          setLoadedActivity(true)
        },
        error => {
          setLoadedActivity(true)
        }
      )
    })()
  }, [nftDetail])

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

    const creators = nftDetail.creators.map(c => ({
      ...c,
      address: new PublicKey(c.address),
    }))

    let createAddress = getNFTArtistPublicKey({ creators })
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
        setLiveAuction(false)
        setEndTime(null)

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

  const cancelAuction = async () => {
    setOpenProgressingModal(true)
    try {
      const { auction } = await cancelListing(mx, new PublicKey(mintAddress), sellerAddress)
      AuctionAPI.cancelAuction(auction.mintAddress.toBase58()).then(res => {
        if (res) {
          setAlertData([
            {
              id: 0,
              title: 'Auction Canceled!',
              description: `You've successfully canceled the auction`,
              type: 'success',
            },
          ])
          setLiveAuction(false)
          setEndTime(null)
          setOpenProgressingModal(false)
          setTimeout(() => {
            setShowAlert(true)
          }, 500)
        }
      })
    } catch (e) {
      setOpenProgressingModal(false)
    }
  }

  const onCancelList = async ({ address, tradeStateAddress }: { address: string; tradeStateAddress: string }) => {
    setOpenProgressingModal(true)
    try {
      await refreshToken()

      const tradeStateAddressKey =
        typeof tradeStateAddress === 'string' ? new PublicKey(tradeStateAddress) : tradeStateAddress

      const result = await cancelList(mx, tradeStateAddressKey)
      if (result) {
        setNftPrice(0)
        listingsAPI.unlistNft(address.toString()).then(response => {
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

  const onUpdatePrice = async ({ address, tradeStateAddress }, price: number) => {
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
                setAuctionLoading(false)
              }, 500)
              setHighBidder(publicKey?.toBase58())
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

  const handleSuccessAuction = nftName => {
    setAlertData([
      {
        id: 0,
        title: 'Auction Published!',
        description: `You've successfully published an auction for ${nftName}`,
        type: 'success',
      },
    ])

    setTimeout(() => {
      setShowAlert(true)
    }, 1000)
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

  return (
    <div className={styles.container}>
      {nftType.includes('audio') && (
        <div className={`${styles.nftAudioBG} lg:block hidden`}>
          <img src={nftCoverUrl} alt="" className="w-full h-full object-cover" />
          <div className={styles.overlay} />
        </div>
      )}
      <div className="w-full grid grid-cols-2 gap-4 lg:gap-10">
        <div className="lg:max-w-[816px] lg:max-h-[816px] col-span-2 lg:col-span-1">
          <NFTAssetSection
            nftType={nftType}
            nftAssetUrl={nftAssetUrl}
            nftCoverUrl={nftCoverUrl}
            fullScreen={fullScreen}
            setFullScreenView={setFullScreenView}
          />
        </div>

        <div className="col-span-2 lg:col-span-1 z-10">
          {showAuctionDetail ? (
            <div className="ml-[0px] lg:ml-[50px]">
              <AuctionDetail
                data={{
                  mintAddress: new PublicKey(nftDetail.address),
                  name: nftName,
                  json: nftDetail.json,
                }}
                onSuccess={nft => handleSuccessAuction(nft)}
                onRefreshPage={() => {
                  router.reload()
                }}
                onClose={() => {
                  setShowAuctionDetail(false)
                  setShowAuctionSection(false)
                }}
              />
            </div>
          ) : (
            <div className={styles.nftDetailCard}>
              <div className="w-full flex flex-wrap">
                <div className="w-full flex flex-wrap justify-between items-center">
                  <div className="flex items-center gap-[15px] lg:gap-[20px]">
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

                    {nftType.includes('image') && !nftCoverUrl.includes('ext=gif') && (merchToggle || isCreatedNft) ? (
                      <div className="cursor-pointer flex gap-[10px] items-center mr-[20px]">
                        {merchToggle ? (
                          <MerchToggleEnabledIcon
                            alt=""
                            onClick={() => {
                              if (isCreatedNft) setRemoveMerchModal(true)
                            }}
                            onMouseEnter={() => setMerchHover(true)}
                            onMouseLeave={() => setMerchHover(false)}
                          />
                        ) : isCreatedNft ? (
                          <MerchToggleDisabledIcon
                            alt=""
                            onClick={() => {
                              if (isCreatedNft) setCreateMerchModal(true)
                            }}
                            onMouseEnter={() => setMerchHover(true)}
                            onMouseLeave={() => setMerchHover(false)}
                          />
                        ) : (
                          <></>
                        )}

                        {!nftType.includes('audio') && merchHover && (
                          <div className={styles.infoText}>Foster Studio</div>
                        )}
                      </div>
                    ) : (
                      <></>
                    )}
                    {isCreatedNft && (
                      <div onClick={() => setShowNftMeta(true)}>
                        <EditNftMetaIcon alt="" />
                      </div>
                    )}
                  </div>

                  <div className="inline">
                    {!loadedNftInfo ? (
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
                <NFTCreatorDataSection
                  nftName={nftName}
                  nftCreatorname={nftCreatorname}
                  nftOwnerUsername={nftOwnerUsername}
                  nameLoading={nameLoading}
                />

                <div className={styles.collectionContainer}>
                  {nftCollectionAddress && (
                    <div className="justify-between items-center mt-[15px] lg:mt-[28px]">
                      <div className={styles.collectionText}>Collection</div>
                      <Link href={`/collection/${nftCollectionAddress}`} passHref>
                        <a>
                          {!(nftCollectionImage && nftCollectionName) ? (
                            <div className={`${styles.skeletonLoader} w-28 mt-[6px] h-11 rounded-3xl`} />
                          ) : (
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
                          )}
                        </a>
                      </Link>
                    </div>
                  )}
                  {editionDetail && (
                    <div className={styles.editionContainer}>
                      <div className="w-full flex justify-between">
                        <div className={styles.editionTitle}>Token Type</div>
                        <div className={styles.editionValue}>
                          {editionDetail.maxSupply ? 'Limited Edition' : 'Open Edition'}
                        </div>
                      </div>
                      <div className="w-full flex justify-between mt-[15px]">
                        <div className={styles.editionTitle}>Editon Number</div>
                        <div className={styles.editionValue}>{Number(editionDetail?.number)}</div>
                      </div>
                      <div className="w-full flex justify-between mt-[15px]">
                        <div className={styles.editionTitle}>Edition Supply</div>
                        <div className={styles.editionValue}>{Number(editionDetail?.supply)}</div>
                      </div>
                    </div>
                  )}
                </div>
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
                  getTimeDifferenceWithAuction(endTime) < 0 &&
                  (isOwnNft === true || publicKey?.toBase58() === highBidder) &&
                  connected ? (
                  <div className="w-full mb-1 mt-5 lg:mt-0 lg:mb-5">
                    {nftCurrentPrice > 0 ? (
                      <OutlineButton
                        label="Finalize Sale"
                        onClick={() => processFinalizeSale()}
                        color="var(--main-bg-color)"
                        borderColor="#707070"
                        borderWidth="2"
                        fullWidth
                      />
                    ) : (
                      <OutlineButton
                        label="Cancel Auction"
                        onClick={() => cancelAuction()}
                        color="var(--main-bg-color)"
                        borderColor="#707070"
                        borderWidth="2"
                        fullWidth
                      />
                    )}
                  </div>
                ) : liveAuction === true ? (
                  <>
                    {!isEnded && (
                      <div className={`mt-6 w-full`}>
                        <div
                          className={`${styles.auctionContainer} ${
                            nftType.includes('audio') &&
                            (viewport === 'lg' || viewport === 'xl' || viewport === '2xl') &&
                            styles.audioNftBG
                          }`}
                        >
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
                              <div className="w-full pl-[20px] pr-[20px] mb-[16px]">
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
                                    <div className={styles.highBidText}>You are currently the highest bidder!</div>
                                  </>
                                ) : (
                                  <div className="relative">
                                    <div className="w-full flex justify-center">
                                      <PriceInput
                                        value={price}
                                        placeholder="Enter Bid amount"
                                        backgroundColor={'rgba(var(--main-bg-color-rgb), 0.05)'}
                                        fullWidth
                                        min={0}
                                        margin
                                        height={
                                          viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '40px' : '50px'
                                        }
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
                                        if (price === '' || parseFloat(price) < parseFloat(minBidAmount.toFixed(2)))
                                          return

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
                                              isEnded ||
                                              price === '' ||
                                              price === '.' ||
                                              parseFloat(price) < parseFloat(minBidAmount.toFixed(2))
                                                ? styles.placeBidDisabledColor
                                                : styles.placeBidEnabledColor
                                            }`}
                                          >
                                            Place Bid
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="w-full flex items-center justify-between px-[18px] mb-[10px] mt-[4px]">
                                      <div className={styles.minText}>Min:&nbsp;{minBidAmount.toFixed(2)}&nbsp;SOL</div>
                                      {endPhaseDuration > 0 && (
                                        <div
                                          className="flex gap-[10px] items-center"
                                          onMouseEnter={() => {
                                            if (viewport === 'lg' || viewport === 'xl' || viewport === '2xl')
                                              setAuctionInfoFocus(true)
                                          }}
                                          onMouseLeave={() => {
                                            if (viewport === 'lg' || viewport === 'xl' || viewport === '2xl')
                                              setAuctionInfoFocus(false)
                                          }}
                                          onClick={() => {
                                            setAuctionInfoFocus(true)
                                            setTimeout(() => {
                                              setAuctionInfoFocus(false)
                                            }, 2000)
                                          }}
                                        >
                                          <div className={styles.endPhaseText}>End Phase</div>
                                          <div>
                                            <InfoGreenIcon />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    {auctionInfoFocus && (
                                      <div className="absolute w-full flex justify-end">
                                        <div className={styles.auctionInfoText}>
                                          <div className={styles.auctionInfoTitle}>End Phase</div>
                                          Auction uses
                                          <span>
                                            &nbsp;{nftInfo?.auction?.auction?.end_phase_bid_increment} SOL&nbsp;
                                          </span>
                                          bid increments in the last
                                          <span>&nbsp;{Math.floor(endPhaseDuration / 60)} mins.&nbsp;</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : !loading && nftInfo && connected ? (
                  isOwnNft === true ? (
                    <div className="w-full flex gap-[20px] mt-[20px]">
                      <OutlineButton
                        label="Start Auction"
                        onClick={() => {
                          setShowAuctionDetail(true)
                          setShowAuctionSection(true)
                        }}
                        color="var(--main-bg-color)"
                        borderColor="rgba(var(--main-bg-color-rgb), 0.25)"
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
                  <div className={styles.activityContainer}>
                    <NFTActivityInfoSection
                      nftType={nftType}
                      nftDescription={nftDescription}
                      nftCategories={nftCategories}
                      nftRoyalties={nftRoyalties}
                      activityList={activityList}
                      loadedActivity={loadedActivity}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {openProgressingModal && <ProgressingModal open={openProgressingModal} />}

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

      {showNftMeta && nftInfo && (
        <EditMetaModal
          open={showNftMeta}
          close={() => setShowNftMeta(false)}
          nftCover={nftCoverUrl}
          data={editionDetail}
          nftInfo={nftInfo}
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

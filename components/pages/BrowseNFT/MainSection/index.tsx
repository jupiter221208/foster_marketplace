import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { cancelList, populateLazyListingsWithAssets, updateList } from 'utils/auction.util'
import { sendTransactionWithRetry } from 'utils/transactions'

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
import ProgressingModal from 'components/Modal/ProgressingModal'
import Alert from 'components/Alert'
import MakeAnOfferModal from 'components/Modal/MakeAnOfferModal'
import ReportAnIssueModal from 'components/Modal/ReportAnIssueModal'
// custom functions
import { useViewport } from 'utils'
import { useAuthentication } from 'hooks/useAuthentication'
import { getNFTCategories, getNFTTokenAccount, getNFTArtistPublicKey, getNftFromDAS } from 'utils/nfts.utils'
import { loadAuctionHouse } from 'utils/auction.util'
import Lottie from 'lottie-react'
import {
  cancelListing,
  fetchAuctionListing,
  getBuyerEscrowBalanceDeficit,
  getListingConfig,
  parseAuctionListing,
  placeBid,
} from 'utils/auctioneer.util'

// images and icons
import HeartFilledWhiteIcon from 'assets/icons/heart-filled-white-46x46.svg'
import HeartFilledRedIcon from 'assets/icons/heart-filled-red-46x46.svg'
import TicketWhiteIcon from 'assets/icons/ticket-white-46x46.svg'
import TicketGreenIcon from 'assets/icons/ticket-green-46x46.svg'
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import MoreDetalsLightIcon from 'assets/lottery/more-details-light.json'
import MoreDetalsIcon from 'assets/lottery/more-details.json'

// json
import FullScreenModeIcon from 'assets/icons/fullscreen-mode.svg?component'
import ShopApparelList from 'assets/json/browse-nft/shop-apparel-list.json'

// styles
import styles from './index.module.scss'

// solana
import { buyNFT, offerNFT } from 'utils/auction.util'
import { useMetaplex } from 'hooks/useMetaplex'
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js'
import { toLazyListing, toListingReceiptAccount, GpaBuilder } from '@metaplex-foundation/js'
import type { Sft, Metadata, Nft } from '@metaplex-foundation/js'
import type { ListingConfig as AuctionListing } from '@metaplex-foundation/mpl-auctioneer'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'
import { cancelListingEdition, createPrint } from 'apis/editions'

import { useWallets } from 'hooks/useWallets'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { CDN_PREFIX, getTimeDifferenceWithAuction } from 'utils/helpers'
import ModalPlaceBid from 'components/Modal/ModalPlaceBid'
import AuctionCard from 'components/Card/AuctionCard'
import SocialShareModal from 'components/Menu/SocialShareModal'
import ReportMobileModal from 'components/Menu/ReportMobileModal'

import 'react-placeholder/lib/reactPlaceholder.css'
import LikeModal from 'components/Modal/LikeModal'
import ListNFTModal from 'components/Modal/ListNFTModal'
import { getShortAddress } from 'utils/wallet.util'
import { executeSale } from 'utils/auctioneer.util'
import EscrowDeficientModal from 'components/Modal/EscrowDeficientModal'
import CreateMerchSudioModal from 'components/Modal/CreateMerchSudioModal'
import RemoveMerchSudioModal from 'components/Modal/RemoveMerchSudioModal'
import { getExplorerUrl } from 'utils/explorer'
import UpdateNFTModal from 'components/Modal/UpdateNFTModal'
import { NftData } from 'types/nft'
import AuctionDetail from '../AuctionDetail'
import NFTCreatorDataSection from './NFTCreatorDataSection'
import NFTAssetSection from './NFTAssetSection'
import EditMetaModal from 'components/Modal/EditMetaModal'
import ListEditionDetail from '../ListEditionDetail'

// call apis
import nftsAPI from 'apis/nfts'
import usersAPI from 'apis/user'
import listingsAPI from 'apis/listings'
import AuctionAPI from 'apis/auctions'
import { getListedMasterEditionInfo } from 'apis/editions'
import { getPriceValue } from 'utils/strings'
import MintEditionCard from 'components/Card/MintEditionCard'
import { revokeDelegateEdition } from 'utils/editions'
import MenuEditNft from 'components/Menu/MenuEditNft'
import LoadingSecondaryButton from 'components/Button/LoadingSecondaryButton'
import NFTDetailSection from './NFTDetailSection'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'
import NFTHistorySection from './NFTHistorySection'
import NFTCategorySection from './NFTCategorySection'
import ShopApparelSection from '../ShopApparelSection'
import NFTDescriptionSection from './NFTDescriptionSection'
import NFTEditionMerchCard from './NFTEditionMerchCard'
import NFTMakeOfferSection from './NFTMakeOfferSection'
import NFTPlaceBidSection from './NFTPlaceBidSection'

export interface MainSectionProps {
  nftDetail: NftData
  editionDetail: any
  nftInfo: any
  setFullScreenView: any
  reloadNftData: any
  setOpenMerchPage: any
  setMerchData: any
  fullScreen: boolean
  setFullScreenMerch: any
  setMerchImages: any
}

const MainSection = ({
  nftDetail,
  editionDetail,
  nftInfo,
  setFullScreenView,
  reloadNftData,
  setOpenMerchPage,
  setMerchData,
  fullScreen,
  setFullScreenMerch,
  setMerchImages,
}: MainSectionProps) => {
  const viewport = useViewport()
  const router = useRouter()
  const { id } = router.query
  const dispatch = useDispatch()
  const { refreshToken } = useAuthentication()
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const { solToUsdRate } = useSolToUsdRate()
  const [nftLoading, setNftLoading] = useState<boolean>(true)
  const lightDarkMode = useSelector(state => (state as any).lightMode)
  const { connection } = useConnection()
  const explorerURL = useMemo(() => getExplorerUrl(connection.rpcEndpoint, id as string), [id, connection])
  const detailViewRef = useRef(null)
  const [openShareModal, setOpenShareModal] = useState(false)
  const [nftReservePrice, setNftReservePrice] = useState(0)
  const [nftCurrentPrice, setNftCurrentPrice] = useState(0)
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
  const [showListEditionDetail, setShowListEditionDetail] = useState(false)
  const [listEditionType, setListEditionType] = useState('list')
  const [showListNFTModal, setShowListNFTModal] = useState(false)
  const [showUpdateListNFTModal, setShowUpdateListNFTModal] = useState(false)
  const [currentSupply, setCurrentSupply] = useState(editionDetail ? editionDetail.supply : 0)
  const [auctionLoading, setAuctionLoading] = useState<boolean>(false)
  const [buyLoading, setBuyLoading] = useState<boolean>(false)
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
  const [auctionInfoFocus, setAuctionInfoFocus] = useState(false)
  const [price, setPrice] = useState<string>('')
  const [mintQty, setMintQty] = useState(1)
  const [mintEditionLoading, setMintEditionLoading] = useState<boolean>(false)
  const [merchCard, setMerchCard] = useState(null)
  const [openProgressingModal, setOpenProgressingModal] = useState(false)
  const [isCancelProcessing, setIsCancelProcessing] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const [openOfferModal, setOpenOfferModal] = useState(false)
  const [deficencyModal, setDeficencyModal] = useState(false)
  const [deficiency, setDeficiency] = useState(0)
  const [finalizeData, setFinalizeData] = useState(null)
  const [alertData, setAlertData] = useState<any[]>([])
  const [descCount, setDescCount] = useState(280)

  useEffect(() => {
    ;(async () => {
      if (!nftDetail) return
      let tokenAccount = await getNFTTokenAccount(mx, new PublicKey(nftDetail.mintAddress))
      setSellerAddress(tokenAccount.owner)

      const creators = nftDetail.creators.map(c => ({
        ...c,
        address: new PublicKey(c.address),
      }))

      let createAddress = getNFTArtistPublicKey({ creators })
      let { username: creatorName, profile_picture } = await usersAPI.get(createAddress)
      setNftCreatorname(creatorName !== null && creatorName.length > 0 ? creatorName : getShortAddress(createAddress))
      setNftCreatorUrl(profile_picture)
      if (createAddress.toBase58() != tokenAccount.owner.toBase58()) {
        let { username: ownerUsername } = await usersAPI.get(tokenAccount.owner.toBase58())
        setNftOwnerUsername(ownerUsername ?? getShortAddress(tokenAccount.owner))
      } else {
        setNftOwnerUsername(creatorName)
      }

      setNameLoading(false)
      setTokenAccountInfo(tokenAccount)

      if (nftDetail.collection) {
        const collectionMetadata = await getNftFromDAS(mx, nftDetail.collection.address)
        if (collectionMetadata) {
          setNftCollectionImage(collectionMetadata.content.links.image)
          setNftCollectionName(collectionMetadata.content.metadata.name)
        }
      }
    })()

    setAlertData([
      {
        id: 0,
        title: 'Successful Purchase!',
        description: 'Navigate to My Dashboard to view your purchased NFT.',
        type: 'success',
      },
    ])

    function handleResize() {
      let screenWidth = window.innerWidth
      let count =
        screenWidth >= 1900
          ? 440
          : screenWidth >= 1768
          ? 400
          : screenWidth >= 1400
          ? 300
          : screenWidth >= 1280
          ? 250
          : screenWidth >= 1024
          ? 200
          : 300
      setDescCount(count)
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isStarted && !isEnded) {
      setShowPlaceBIdButton(true)
    } else {
      setShowPlaceBIdButton(false)
    }
  }, [isEnded, isStarted])

  const nftType: string = (nftDetail.category as string) ?? 'image'
  const coverUrl = nftDetail?.image ?? DefaultNftBG.src
  const nftCoverUrl = coverUrl.includes('=gif') ? coverUrl.replace(CDN_PREFIX, '') : coverUrl
  const originalCoverUrl = nftDetail.original.image
  const nftAssetUrl: string = nftDetail?.animation_url as string
  const nftName = nftDetail?.name ?? 'No name found'
  const nftDescription = nftDetail?.description ?? ''
  const nftRoyalties = (nftDetail.sellerFeeBasisPoints / 100).toString()
  const nftCategories = getNFTCategories(nftDetail)
  const mintAddress = nftDetail.mintAddress.toString()
  const nftCollectionAddress = nftDetail.collection?.address?.toString()
  const supply = nftDetail.supply
  const [nftCollectionName, setNftCollectionName] = useState('')
  const [nftCollectionImage, setNftCollectionImage] = useState('')

  const [nftPrice, setNftPrice] = useState(0)
  const [nftOwnerUsername, setNftOwnerUsername] = useState('')
  const [nftCreatorname, setNftCreatorname] = useState('')
  const [nftCreatorUrl, setNftCreatorUrl] = useState(null)
  const [nftListingData, setNftListingData] = useState(null)
  const [tradeStateAddress, setTradeStateAddress] = useState('')
  const [merchToggle, setMerchToggle] = useState(false)
  const [createMerchModal, setCreateMerchModal] = useState(false)
  const [removeMerchModal, setRemoveMerchModal] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [editionLoading, setEditionLoading] = useState(false)
  const [nameLoading, setNameLoading] = useState(true)
  const [editionType, setEditionType] =
    useState<'normal' | 'master_le' | 'master_oe' | 'print_le' | 'print_oe'>('normal')
  const [isEditionListing, setIsEditionListing] = useState(false)
  const [cancelListLoading, setCancelListLoading] = useState(false)

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

    if (nftPrice > mainWalletBalance - bidWalletLock) {
      setAlertData([
        {
          id: 0,
          title: 'Insufficient Funds',
          description: 'Not enough funds in wallet for purchase',
          type: 'error',
        },
      ])
      setShowAlert(true)
      return
    }

    try {
      setBuyLoading(true)
      await refreshToken()

      const result = await buyNFT(mx, mintAddress, tradeStateAddress, nftPrice)
      if (result) {
        await updateSolBalance()
        listingsAPI.quickBuy(mintAddress, { buyer_wallet_id: publicKey?.toString(), amount: nftPrice.toString() }).then(
          response => {
            setNftPrice(0)
            setIsOwnNft(true)
          },
          error => console.log(error)
        )
        setShowAlert(true)
        router.reload()
      } else {
        setBuyLoading(false)
      }
    } catch {
      setBuyLoading(false)
    }
  }

  const mintEdition = async () => {
    if (!connected) {
      setVisible(true)
      return
    }

    setMintEditionLoading(true)

    let editionsToPrint = undefined
    let editionStatuses: Record<string, any> = {}
    for (let i = 0; i < 5 && Object.keys(editionStatuses).length < mintQty; i++)
      try {
        let printResponse = await createPrint({
          mintAddress,
          buyer: mx.identity().publicKey.toBase58(),
          count: mintQty,
          editions: editionsToPrint,
        })

        if (printResponse.length == 0) break

        editionsToPrint = printResponse.map(({ editionNumber }) => editionNumber)
        let txs = printResponse.map(({ transaction }) => Transaction.from(Buffer.from(transaction, 'base64')))
        let signedTransactions = await mx.identity().signAllTransactions(txs)

        let results = await Promise.allSettled(
          signedTransactions.map(async (tx, index) => {
            let { editionNumber, editionMint, lastValidBlockHeight } = printResponse[index]
            let signature = await sendTransactionWithRetry({
              connection: mx.connection,
              transaction: tx,
              maxHeight: lastValidBlockHeight,
            })
            if (!signature) {
              console.error('could not confirm signature for', printResponse[index])
              throw new Error(`could not confirm signature for ${editionNumber} ${editionMint}`)
            }

            await nftsAPI
              .create({
                token_id: editionMint,
                nft_name: `${nftName} #${editionNumber}`,
                categories: nftCategories.toString(),
                asset_type: nftType === 'image/gif' ? 'image' : nftType,
                cover_image_url: nftCoverUrl,
                asset_url: nftAssetUrl ?? originalCoverUrl,
                collection_id: nftCollectionAddress ?? '',
                edition: editionNumber,
                parent_nft: mintAddress,
                max_supply: editionType == 'master_le' ? supply.max : null,
              })
              .then(
                response => {
                  console.log(response)
                },
                error => {
                  console.log(error)
                }
              )

            editionStatuses[editionNumber.toString()] = {
              status: 'success',
              signature,
              editionMint,
            }
          })
        )
        console.log('print transaction results', results)

        break
      } catch (e: any) {
        console.error(`attempt ${i + 1} failed: ${e?.message ?? e}`)
        console.error(e)
        setMintEditionLoading(false)

        setAlertData([
          {
            id: 0,
            title: 'Purchase Canceled',
            description: `Wallet signature request rejected`,
            type: 'success',
          },
        ])
        setShowAlert(true)

        if (e?.message == 'User rejected the request.') break
        await new Promise(resolve => setTimeout(resolve, 1000))
        return
      }

    setMintEditionLoading(false)

    if (Object.keys(editionStatuses).length === 0) {
      setAlertData([
        {
          id: 0,
          title: 'Purchase Canceled',
          description: `Wallet signature request rejected`,
          type: 'success',
        },
      ])
      setShowAlert(true)
    } else if (Object.keys(editionStatuses).length === mintQty) {
      console.log('minted editions successfully', editionStatuses)

      setAlertData([
        {
          id: 0,
          title: 'Edition Purchased!',
          description: `You've successfully purchased ${nftName} #${editionsToPrint[0]}`,
          type: 'success',
        },
      ])
      setShowAlert(true)
      currentSupply(currentSupply + 1)
      // setTimeout(() => {
      //   router.reload()
      // }, 1000)
    } else {
      setAlertData([
        {
          id: 0,
          title: 'Mint Partially Succeeded!',
          description: `You've failed minting some editions`,
          type: 'success',
        },
      ])
      setShowAlert(true)
    }
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
    if (nftInfo) {
      let { merch_hub_enabled, likes, shares, saves, liked, saved, shared, auction } = nftInfo
      let sharedSocial = shared?.facebook || shared?.twitter || shared?.telegram
      setHighBidder(nftInfo?.auction?.highest_bid?.buyer_address ?? '')
      setMerchToggle(merch_hub_enabled)
      setLikeCount(likes)
      setShareCount(shares)
      setSaveCount(saves)
      setLike(liked)
      setSave(saved)
      setShare(sharedSocial)
      setEndPhaseDuration(auction?.auction?.end_phase_duration ?? 0)
      if (nftInfo.master_edition?.merchProduct) {
        setMerchCard(nftInfo.master_edition?.merchProduct)
        setMerchImages(nftInfo.master_edition?.merchProduct.options.addons)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [publicKey, sellerAddress])

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
      setNftLoading(false)
    },
    [minBidIncrement]
  )

  const getEditionListingStatus = () => {
    setEditionLoading(true)
    getListedMasterEditionInfo(nftDetail.mintAddress).then(
      response => {
        setEditionLoading(false)
        if (response && response.price.length > 0) {
          setIsEditionListing(true)
          setPrice(getPriceValue(Number(response.price)))
          setNftPrice(parseFloat(getPriceValue(Number(response.price))))
        }
      },
      error => {
        setEditionLoading(false)
      }
    )
  }

  useEffect(() => {
    if (!supply) {
      return
    }
    if (supply.max === 0) {
      setEditionType('normal')
    } else if (supply.max === null) {
      if (supply.parent === null) {
        setEditionType('master_oe')
        getEditionListingStatus()
      } else {
        setEditionType('print_oe')
        fetch(`/nft/${supply.parent}`)
      }
    } else if (supply.max > 0) {
      if (supply.parent === null) {
        setEditionType('master_le')
        getEditionListingStatus()
      } else {
        setEditionType('print_le')
        fetch(`/nft/${supply.parent}`)
      }
    } else {
      setEditionType('normal')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supply])

  const isNftPrintEdition = () => {
    if (editionType === 'print_oe' || editionType === 'print_le') return true
    return false
  }

  const isNftMasterEdition = () => {
    if (editionType === 'master_oe' || editionType === 'master_le') return true
    return false
  }

  useEffect(() => {
    if (!tokenAccountInfo) return

    let auctionListenerHandle: number | null = null
    ;(async () => {
      if (!nftDetail) return

      if (tokenAccountInfo.delegate?.equals(mx.auctionHouse().pdas().programAsSigner())) {
        const listingConfigDiscriminator = [240, 71, 225, 94, 200, 75, 84, 231]
        let openListings = await new GpaBuilder(mx, mx.programs().getAuctionHouse().address)
          .where(0, Buffer.from(listingConfigDiscriminator))
          .where(8 + 32 * 4, new PublicKey(nftDetail.metadataAddress))
          .where(168, Buffer.from([0])) // purchaseReceipt == null
          .where(195, Buffer.from([0])) // canceledAt == null
          .getAndMap(account => toListingReceiptAccount(account))
        if (openListings.length != 1) {
          console.warn(`irregular number of listing recipts for ${nftDetail.mintAddress}`)
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
          setTradeStateAddress(tradeStateAddress.toBase58())
          setNftLoading(false)
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
            category: nftType,
            animation_url: nftAssetUrl,
            image: nftCoverUrl,
            original: {
              image: originalCoverUrl,
            },
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
      setNftLoading(false)

      dispatch({ type: 'set', isLoading: false })

      return () => {
        if (auctionListenerHandle) mx.connection.removeAccountChangeListener(auctionListenerHandle)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAccountInfo])

  const processFinalizeSale = async () => {
    let data = {
      address: new PublicKey(nftDetail.mintAddress),
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

  // Short description feature
  const [isTruncated, setIsTruncated] = useState(true)
  const [tempNftDescription, setTempNftDescription] = useState('')

  const processedNftDescription = isTruncated ? tempNftDescription.slice(0, descCount) : tempNftDescription
  const shouldShowReadMore = tempNftDescription.length > descCount

  useEffect(() => {
    setTempNftDescription(nftDescription)
  }, [nftDescription])

  function toggleIsTruncated() {
    setIsTruncated(!isTruncated)
  }

  const reloadCreatorOwnerName = async () => {
    let tokenAccount = await getNFTTokenAccount(mx, new PublicKey(nftDetail.mintAddress))

    setSellerAddress(tokenAccount.owner)

    const creators = nftDetail.creators.map(c => ({
      ...c,
      address: new PublicKey(c.address),
    }))

    let createAddress = getNFTArtistPublicKey({ creators })
    let { username: creatorName, profile_picture } = await usersAPI.get(createAddress)
    setNftCreatorname(creatorName !== null && creatorName.length > 0 ? creatorName : getShortAddress(createAddress))
    setNftCreatorUrl(profile_picture)
    if (createAddress.toBase58() != tokenAccount.owner.toBase58()) {
      let { username: ownerUsername } = await usersAPI.get(tokenAccount.owner.toBase58())
      setNftOwnerUsername(ownerUsername ?? getShortAddress(tokenAccount.owner))
    } else {
      setNftOwnerUsername(creatorName)
    }
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
    setIsCancelProcessing(true)
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
          setIsCancelProcessing(false)
          setTimeout(() => {
            setShowAlert(true)
          }, 500)
        }
      })
    } catch (e) {
      setIsCancelProcessing(false)
    }
  }

  const cancelListEdition = async () => {
    setCancelListLoading(true)
    try {
      let mint = new PublicKey(nftInfo.master_edition?.mintAddress)
      let delegate = new PublicKey(nftInfo.master_edition?.authorityPublicKey)
      let signature = await revokeDelegateEdition({
        metaplex: mx,
        mint,
        delegate,
      })
      if (!signature) {
        console.error(`could not revoke delegate for ${mint} to ${delegate}`)
        throw new Error(`could not revoke delegate for ${mint} to ${delegate}`)
      }

      cancelListingEdition(nftInfo.master_edition?.mintAddress).then(res => {
        if (res) {
          setAlertData([
            {
              id: 0,
              title: 'Edition Listing Canceled!',
              description: `${nftName} is no longer available for purchase`,
              type: 'success',
            },
          ])
          setShowAlert(true)
          setTimeout(() => {
            router.reload()
          }, 1000)
        }
      })
    } catch (e) {
      setCancelListLoading(false)
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
    } catch (error) {
      console.error(error)
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

  const handleSuccessListEdition = nftName => {
    if (listEditionType === 'list') {
      setAlertData([
        {
          id: 0,
          title: 'Edition Listed!',
          description: `You've successfully published a listing for ${nftName}`,
          type: 'success',
        },
      ])
    } else {
      setAlertData([
        {
          id: 0,
          title: 'Listing Updated!',
          description: `Your listing for ${nftName} has been updated`,
          type: 'success',
        },
      ])
    }

    setShowAlert(true)

    setTimeout(() => {
      router.reload()
    }, 1000)
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
            setCreateMerchModal(false)
            setTimeout(() => {
              detailViewRef.current?.scrollIntoView({ behavior: 'smooth' })
            }, 500)
          }
        },
        err => {}
      )
    } else {
      nftsAPI.enableMerchHub(id, { value: false }).then(
        response => {
          if (response !== null) {
            setMerchToggle(false)
            setRemoveMerchModal(false)
          }
        },
        err => {}
      )
    }
  }

  return (
    <div className={styles.container}>
      <div className="w-full h-full flex flex-wrap justify-between gap-[0px] lg:gap-0">
        <div
          className={`lg:w-[58%] w-full lg:mt-[80px] ${
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : 'g-left-container'
          } lg:mb-[20px] lg:pr-[55px]`}
        >
          <NFTAssetSection
            nftType={nftType}
            nftAssetUrl={nftAssetUrl}
            nftCoverUrl={nftCoverUrl}
            originalCoverUrl={originalCoverUrl}
            fullScreen={fullScreen}
          />

          <div className="w-full lg:flex hidden mt-[32px] justify-between">
            <div className="flex gap-[15px] items-center">
              <div className="inline">
                <div className={styles.likeContainer}>
                  <div className="flex items-center gap-[6px]">
                    <Image
                      src={like ? HeartFilledRedIcon : HeartFilledWhiteIcon}
                      alt=""
                      className=""
                      onClick={() => changeLikeStatus()}
                    />

                    <div className={`${styles.text} mt-[-2px]`} onClick={() => setShowLikeModal(true)}>
                      {likeCount}
                    </div>
                  </div>
                  <div className={styles.likeBorder} />
                  <div className="flex items-center">
                    <Image
                      src={save ? TicketGreenIcon : TicketWhiteIcon}
                      alt=""
                      className=""
                      onClick={() => changeSaveStatus()}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-[15px] items-center">
              {nftType.includes('vr') || nftType.includes('image') ? (
                <div className={styles.expandIconContainer}>
                  <div onClick={() => setFullScreenView(nftType.includes('vr') ? nftAssetUrl : nftCoverUrl)}>
                    <FullScreenModeIcon />
                  </div>
                </div>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>

        <div
          className={`w-full lg:w-[42%] z-10 pt-[15px] lg:pt-[0px] g-container lg:g-right-container 2xl:pl-[100px] lg:pl-[55px] xl:pl-[80px] ${styles.rightBG}`}
        >
          {showListEditionDetail ? (
            <div className="">
              <ListEditionDetail
                data={nftDetail}
                listingType={listEditionType}
                onSuccess={nft => handleSuccessListEdition(nft)}
                fromNFT={true}
                onClose={() => {
                  setShowListEditionDetail(false)
                }}
                merchItem={merchCard}
              />
            </div>
          ) : showAuctionDetail ? (
            <div>
              <AuctionDetail
                data={nftDetail}
                onSuccess={nft => handleSuccessAuction(nft)}
                onRefreshPage={() => {
                  router.reload()
                }}
                onClose={() => {
                  setShowAuctionDetail(false)
                }}
                fromNFT={true}
              />
            </div>
          ) : (
            <div className={styles.nftDetailCard}>
              <div className="w-full flex flex-wrap justify-between items-center lg:hidden">
                <div className="w-full flex justify-between items-center">
                  {nameLoading ? (
                    <div className="w-full w-[127px] h-[40px] rounded-[20px] overflow-hidden">
                      <div className="skeletonLoader" />
                    </div>
                  ) : (
                    <div className={styles.likeContainer}>
                      <div className="flex items-center gap-[6px]">
                        <Image
                          src={like ? HeartFilledRedIcon : HeartFilledWhiteIcon}
                          alt=""
                          className=""
                          onClick={() => changeLikeStatus()}
                        />

                        <div className={`${styles.text} mt-[-2px]`} onClick={() => setShowLikeModal(true)}>
                          {likeCount}
                        </div>
                      </div>
                      <div className={styles.likeBorder} />
                      <div className="flex items-center">
                        <Image
                          src={save ? TicketGreenIcon : TicketWhiteIcon}
                          alt=""
                          className=""
                          onClick={() => changeSaveStatus()}
                        />
                      </div>
                    </div>
                  )}

                  {nameLoading ? (
                    <div className="w-full min-w-[32px] w-[32px] h-[32px] rounded-[16px] overflow-hidden">
                      <div className="skeletonLoader" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-[15px] lg:gap-[20px]">
                      <MenuEditNft
                        studio={true}
                        metadata={
                          nftType.includes('image') && nftType !== 'image/gif' && !nftCoverUrl.includes('ext=gif')
                        }
                        explorerURL={explorerURL}
                        setShowNftMeta={setShowNftMeta}
                        setRemoveMerchModal={setRemoveMerchModal}
                        setCreateMerchModal={setCreateMerchModal}
                        merchToggle={merchToggle}
                        isCreatedNft={
                          publicKey?.toBase58() === nftInfo?.creator_address &&
                          publicKey?.toBase58() === nftInfo?.owner_address
                        }
                        setOpenShareModal={setOpenShareModal}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.rightContainer}>
                <div className={styles.rightTopSection}>
                  <div className="w-full">
                    <div className={`w-full ${styles.nftDetailCardPadding}`}>
                      {(editionType === 'print_oe' || editionType === 'print_le') && (
                        <div className={styles.editionName}>{`Edition Print #${editionDetail?.print?.number}`}</div>
                      )}
                      <div className="w-full flex justify-between items-center">
                        {nameLoading ? (
                          <div
                            className={`${styles.skeletonLoader} ${styles.nftTitle} w-[240px] h-[42px] mt-[15px] lg:mt-[0px] rounded-full`}
                          ></div>
                        ) : (
                          <div className="flex items-center justify-between mt-[10px] lg:mt-[0px]">
                            <div className={styles.nftTitle}>{nftName}</div>
                          </div>
                        )}
                        {nameLoading ? (
                          <div className="w-full lg:block hidden min-w-[32px] w-[32px] h-[32px] rounded-[16px] overflow-hidden">
                            <div className="skeletonLoader" />
                          </div>
                        ) : (
                          <div className="lg:block hidden">
                            <MenuEditNft
                              studio={true}
                              metadata={
                                nftType.includes('image') && nftType !== 'image/gif' && !nftCoverUrl.includes('ext=gif')
                              }
                              explorerURL={explorerURL}
                              setShowNftMeta={setShowNftMeta}
                              setRemoveMerchModal={setRemoveMerchModal}
                              setCreateMerchModal={setCreateMerchModal}
                              setOpenShareModal={setOpenShareModal}
                              merchToggle={merchToggle}
                              isCreatedNft={
                                publicKey?.toBase58() === nftInfo?.creator_address &&
                                publicKey?.toBase58() === nftInfo?.owner_address
                              }
                            />
                          </div>
                        )}
                      </div>
                      <div className="w-full flex justify-between items-start gap-[30px]">
                        {nameLoading ? (
                          <div className="w-full">
                            <div className="w-full flex gap-[15px] mt-[30px]">
                              <div className="w-full h-[41px] rounded-[20px] overflow-hidden">
                                <div className="skeletonLoader" />
                              </div>
                              <div className="w-full h-[41px] rounded-[20px] overflow-hidden">
                                <div className="skeletonLoader" />
                              </div>
                              <div className="w-full h-[41px] rounded-[20px] overflow-hidden">
                                <div className="skeletonLoader" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <NFTCreatorDataSection
                            nftCreatorname={nftCreatorname}
                            nftCollectionAddress={nftCollectionAddress}
                            nftCollectionName={nftCollectionName}
                            nftCollectionImage={nftCollectionImage}
                            profileImage={nftCreatorUrl}
                          />
                        )}
                      </div>

                      {(supply?.max === null || supply?.max > 0) && (nftLoading || editionLoading) && merchCard ? (
                        <div className="w-full h-[80px] rounded-[5px] overflow-hidden mt-[30px]">
                          <div className="skeletonLoader" />
                        </div>
                      ) : (
                        merchCard && (
                          <NFTEditionMerchCard
                            url={merchCard.options.addons[0].mockup_url}
                            name={merchCard.name}
                            setFullScreenMerch={setFullScreenMerch}
                          />
                        )
                      )}
                    </div>

                    <div className={`w-full ${styles.nftDetailCardPadding}`}>
                      {nftLoading || editionLoading ? (
                        <div className="mt-[30px]">
                          {supply?.max === null || supply?.max > 0 ? (
                            isEditionListing ? (
                              isOwnNft === true ? (
                                <div className="w-full h-[80px] rounded-[5px] overflow-hidden">
                                  <div className="skeletonLoader" />
                                </div>
                              ) : (
                                <div className="w-full h-[80px] rounded-[5px] overflow-hidden">
                                  <div className="skeletonLoader" />
                                </div>
                              )
                            ) : (
                              <div className="w-full h-[80px] rounded-[5px] overflow-hidden">
                                <div className="skeletonLoader" />
                              </div>
                            )
                          ) : (
                            <div className="w-full h-[80px] rounded-[5px] overflow-hidden">
                              <div className="skeletonLoader" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          {isEditionListing && isOwnNft === true ? (
                            <div className="w-full mt-[30px]">
                              <GradientButton
                                fullWidth
                                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 45}
                                fontSize={16}
                                borderRadius={23}
                                label={'Update/Relist'}
                                onClick={() => {
                                  setListEditionType('update')
                                  setShowListEditionDetail(true)
                                }}
                              />
                              <div className="mt-[15px]">
                                {cancelListLoading ? (
                                  <LoadingSecondaryButton fullWidth height={45} borderRadius={23} />
                                ) : (
                                  <OutlineButton
                                    fullWidth
                                    backgroundColor="var(--bg-151515-EEEDEB)"
                                    height={45}
                                    fontSize={16}
                                    borderRadius={23}
                                    label="Cancel Listing"
                                    onClick={() => cancelListEdition()}
                                  />
                                )}
                              </div>
                            </div>
                          ) : isNftMasterEdition() ? (
                            <div className="w-full flex flex-col sm:mx-auto sm:w-full sm:flex sm:flex-row sm:gap-4 lg:mt-[0px]">
                              <MintEditionCard
                                editionType={editionType}
                                maxSupply={editionDetail.maxSupply}
                                currentSupply={currentSupply}
                                buyLimit={nftInfo?.master_edition?.buyLimit}
                                isEnded={isEnded}
                                isStarted={isStarted}
                                nftPrice={nftPrice}
                                merchCost={
                                  nftInfo?.master_edition?.merchProduct?.selling_price
                                    ? nftInfo?.master_edition?.merchProduct?.selling_price / 100 / solToUsdRate
                                    : null
                                }
                                setPrice={setPrice}
                                mintQty={mintQty}
                                setMintQty={setMintQty}
                                mintEditionLoading={mintEditionLoading}
                                mintEdition={mintEdition}
                                endEditionTime={nftInfo?.master_edition?.endTime}
                                startEditionTime={nftInfo?.master_edition?.startTime}
                                setIsEnded={setIsEnded}
                                setIsStarted={setIsStarted}
                                liveAuction={liveAuction}
                                isEditionListing={isEditionListing}
                              />
                            </div>
                          ) : (
                            <></>
                          )}

                          {nftPrice > 0 && !liveAuction && !isNftMasterEdition() ? ( // NFT Listing
                            <NFTMakeOfferSection
                              nftPrice={nftPrice}
                              solToUsdRate={solToUsdRate}
                              isOwnNft={isOwnNft}
                              viewport={viewport}
                              connected={connected}
                              setVisible={setVisible}
                              setOpenOfferModal={setOpenOfferModal}
                              tradeStateAddress={tradeStateAddress}
                              buyLoading={buyLoading}
                              quickBuy={quickBuy}
                              setShowUpdateListNFTModal={setShowUpdateListNFTModal}
                            />
                          ) : endTime !== null && // NFT Auction Ended
                            getTimeDifferenceWithAuction(endTime) < 0 &&
                            (isOwnNft === true || publicKey?.toBase58() === highBidder) &&
                            connected ? (
                            <div className="w-full mb-1 mt-[30px] lg:mt-[30px] lg:mb-5">
                              {nftCurrentPrice > 0 ? (
                                <OutlineButton
                                  label="Finalize Sale"
                                  fullWidth
                                  backgroundColor="var(--bg-151515-EEEDEB)"
                                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 45}
                                  fontSize={16}
                                  borderRadius={23}
                                  onClick={() => processFinalizeSale()}
                                />
                              ) : isCancelProcessing ? (
                                <LoadingSecondaryButton
                                  label={'Cancel Auction'}
                                  type="cancel"
                                  height={45}
                                  borderRadius={23}
                                  onClick={() => {}}
                                  fullWidth
                                />
                              ) : (
                                <OutlineButton
                                  label="Cancel Auction"
                                  fullWidth
                                  backgroundColor="var(--bg-151515-EEEDEB)"
                                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 45}
                                  fontSize={16}
                                  borderRadius={23}
                                  onClick={() => cancelAuction()}
                                />
                              )}
                            </div>
                          ) : liveAuction === true ? ( // NFT Live Auction
                            <div className="w-full mt-[30px]">
                              {!isEnded && (
                                <div className={`w-full ${styles.border_top}`}>
                                  <div className={styles.auctionContainer}>
                                    <AuctionCard
                                      currentPrice={nftCurrentPrice}
                                      reservePrice={nftReservePrice}
                                      endTime={endTime}
                                      startTime={startTime}
                                      setIsEnded={setIsEnded}
                                      setIsStarted={setIsStarted}
                                      liveAuction={liveAuction}
                                      isEditionListing={isEditionListing}
                                    />
                                    {isOwnNft === true ? (
                                      <div className="mt-[15px]">
                                        <OutlineButton
                                          label="Cancel Auction"
                                          fullWidth
                                          backgroundColor="var(--bg-151515-EEEDEB)"
                                          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 45}
                                          fontSize={16}
                                          borderRadius={23}
                                          onClick={() => nftCurrentPrice === 0 && cancelAuction()}
                                          disabled={nftCurrentPrice > 0}
                                        />
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                    {showPlaceBidButton &&
                                      !isOwnNft &&
                                      (nftLoading ? (
                                        <div className="w-[100%] h-[45px] lg:h-[80px] rounded-[12px] overflow-hidden">
                                          <div className="skeletonLoader" />
                                        </div>
                                      ) : (
                                        <NFTPlaceBidSection
                                          publicKey={publicKey}
                                          highBidder={highBidder}
                                          connected={connected}
                                          setVisible={setVisible}
                                          viewport={viewport}
                                          price={price}
                                          setPrice={setPrice}
                                          isEnded={isEnded}
                                          mainWalletBalance={mainWalletBalance}
                                          minBidAmount={minBidAmount}
                                          biddingBalance={biddingBalance}
                                          bidWalletLock={bidWalletLock}
                                          endPhaseBidIncrement={nftInfo?.auction?.auction?.end_phase_bid_increment}
                                          showAlert={() => {
                                            setAlertData([
                                              {
                                                id: 0,
                                                title: 'Insufficient Funds',
                                                description: 'Not enough funds in wallet for bid amount',
                                                type: 'error',
                                              },
                                            ])
                                            setShowAlert(true)
                                          }}
                                          placeBidAndSave={placeBidAndSave}
                                          auctionLoading={auctionLoading}
                                          endPhaseDuration={endPhaseDuration}
                                          auctionInfoFocus={auctionInfoFocus}
                                          setAuctionInfoFocus={setAuctionInfoFocus}
                                        />
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : !nftLoading && nftInfo ? ( // NFT Normal
                            isOwnNft === true ? (
                              <div className="w-full">
                                {isNftMasterEdition() && !isEditionListing ? (
                                  <div className="w-full mt-[30px]">
                                    <OutlineButton
                                      fullWidth
                                      label="List Edition"
                                      backgroundColor="var(--bg-151515-EEEDEB)"
                                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 45}
                                      fontSize={16}
                                      borderRadius={23}
                                      onClick={() => {
                                        setListEditionType('list')
                                        setShowListEditionDetail(true)
                                      }}
                                    />
                                  </div>
                                ) : !isNftMasterEdition() ? (
                                  <div className="w-full flex lg:flex-row flex-col gap-[15px] mt-[30px]">
                                    <OutlineButton
                                      fullWidth
                                      backgroundColor="var(--bg-151515-EEEDEB)"
                                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 45}
                                      fontSize={16}
                                      borderRadius={23}
                                      label="List Artwork"
                                      onClick={() => setShowListNFTModal(true)}
                                    />
                                    <GradientButton
                                      fullWidth
                                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 45}
                                      fontSize={16}
                                      borderRadius={23}
                                      label="Start Auction"
                                      onClick={() => {
                                        setShowAuctionDetail(true)
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </div>
                            ) : (isOwnNft === false || isOwnNft === null) && !isNftMasterEdition() ? (
                              <div className="w-full flex gap-[20px] mt-[30px]">
                                <OutlineButton
                                  fullWidth
                                  backgroundColor="var(--bg-151515-EEEDEB)"
                                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 45}
                                  fontSize={16}
                                  borderRadius={23}
                                  label="Make Offer"
                                  type="make-offer"
                                  onClick={() => {
                                    if (!connected) {
                                      setVisible(true)
                                      return
                                    }
                                    setOpenOfferModal(true)
                                  }}
                                />
                              </div>
                            ) : (
                              <></>
                            )
                          ) : (
                            <></>
                          )}
                        </div>
                      )}
                    </div>

                    {nameLoading ? (
                      <div className="w-full mt-[30px] lg:mt-[20px]" ref={detailViewRef}>
                        <div className="w-full h-[32px] rounded-[16px] overflow-hidden">
                          <div className="skeletonLoader" />
                        </div>
                        <div className="w-full h-[32px] rounded-[16px] overflow-hidden mt-[15px]">
                          <div className="skeletonLoader" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full mt-[20px]" ref={detailViewRef}>
                        <NFTDescriptionSection
                          isTruncated={isTruncated}
                          processedNftDescription={processedNftDescription}
                          tempNftDescription={tempNftDescription}
                          shouldShowReadMore={shouldShowReadMore}
                          toggleIsTruncated={toggleIsTruncated}
                        />
                        <NFTHistorySection mintAddress={nftDetail.mintAddress} />
                      </div>
                    )}
                  </div>

                  <div
                    className="w-full lg:flex hidden justify-center mb-[70px]"
                    onClick={() => {
                      detailViewRef.current?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <div className={styles.moreDetails}>
                      More details
                      <div className="w-[30px] h-[30px] mt-[-5px]">
                        <Lottie animationData={lightDarkMode ? MoreDetalsLightIcon : MoreDetalsIcon} />
                      </div>
                    </div>
                  </div>
                </div>
                {nameLoading ? (
                  <div className="w-full mt-[30px] lg:mt-[20px]" ref={detailViewRef}>
                    <div className="w-full h-[32px] rounded-[16px] overflow-hidden">
                      <div className="skeletonLoader" />
                    </div>
                    <div className="w-full h-[32px] rounded-[16px] overflow-hidden mt-[15px]">
                      <div className="skeletonLoader" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full mt-[20px]" ref={detailViewRef}>
                    <NFTDetailSection
                      nftOwnerUsername={nftOwnerUsername}
                      nftType={nftType}
                      nftCoverUrl={nftCoverUrl}
                      editionDetail={editionDetail}
                      editionType={editionType}
                      supply={supply}
                      isNftMasterEdition={isNftMasterEdition()}
                      isNftPrintEdition={isNftPrintEdition()}
                      royalties={nftRoyalties}
                    />
                    {nftCategories.length > 0 && <NFTCategorySection nftCategories={nftCategories} />}
                  </div>
                )}
                {merchToggle && (
                  <div className="w-full">
                    <ShopApparelSection
                      title="Shop Apparel"
                      type="apparel"
                      nftDetail={nftDetail}
                      nftCreator={nftCreatorname}
                      shopApparelList={ShopApparelList}
                      openMerchPage={data => {
                        setMerchToggle(false)
                        setMerchData(data)
                        setOpenMerchPage(true)
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {openProgressingModal && <ProgressingModal open={openProgressingModal} />}

      <ListNFTModal
        data={nftDetail}
        open={showListNFTModal}
        onClose={(status: string, price) => {
          if (status === 'listed') {
            setIsOwnNft(true)
            setNftPrice(parseFloat(price))
            // reloadNftData()
            setTimeout(() => {
              router.reload()
            }, 2000)
          } else {
            setShowListNFTModal(false)
          }
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
          close={status => {
            if (status === 'update') router.reload()
            setShowNftMeta(false)
          }}
          nftCover={nftCoverUrl}
          originalCoverUrl={originalCoverUrl}
          nftAsset={nftAssetUrl}
          nftType={nftType}
          nftInfo={nftInfo}
          creatorRoyalty={nftRoyalties}
          nftRoyalties={nftDetail.creators}
          nftAttributes={nftDetail?.attributes}
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

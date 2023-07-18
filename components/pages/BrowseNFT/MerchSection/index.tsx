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
import LoadingButton from 'components/Button/LoadingButton'

// custom functions
import { fetchSolToUsdRate, useViewport } from 'utils'
import { getNFTCategories, getNFTTokenAccount, getNFTSocialInfo, getNFTArtistPublicKey } from 'utils/nfts.utils'
import { loadAuctionHouse } from 'utils/auction.util'
import { getBuyerEscrowBalanceDeficit, placeBid } from 'utils/auctioneer.util'

// images and icons
import PrintApparelSection from 'assets/images/apparel.png'
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-small.svg?component'
import QuickBuyBlackIcon from 'assets/icons/quick-buy-black.svg'
import TagWhiteIcon from 'assets/icons/tag-white.svg?component'
import DescriptionGreenIcon from 'assets/icons/description-green.svg?component'
import NotificationGreenIcon from 'assets/icons/notification-icon.svg?component'
import SaleLightIcon from 'assets/icons/sale-light.svg?component'
import TagLightIcon from 'assets/icons/tag-light.svg?component'
import HeartFilledWhiteIcon from 'assets/icons/heart-filled-white-46x46.svg'
import ShareSmallIcon from 'assets/icons/share-black-desktop-small.svg?component'
import ThreeEllipseMobileIcon from 'assets/icons/three-ellipse-white-mobile.svg?component'
import HeartFilledRedIcon from 'assets/icons/heart-filled-red-46x46.svg'
import TicketWhiteIcon from 'assets/icons/ticket-white-46x46.svg'
import TicketGreenIcon from 'assets/icons/ticket-green-46x46.svg'
import PlayVideoIcon from 'assets/icons/play-video.svg'
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import ActivityDownIcon from 'assets/icons/activity-down-icon.svg?component'
import FullScreenModeIcon from 'assets/icons/fullscreen-mode.svg'

// json
// import TimeList from 'assets/json/browse-nft/time-list.json'

// styles
import styles from './index.module.scss'
import { Url } from 'url'

// solana
import { buyNFT, offerNFT } from 'utils/auction.util'
import { NFTArtistInfo } from 'utils/nfts.utils'
import { useMetaplex } from 'hooks/useMetaplex'
import { getDateString } from 'utils/strings'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import {
  LazyListing,
  toLazyListing,
  toListingReceiptAccount,
  toMetadataAccount,
  GpaBuilder,
} from '@metaplex-foundation/js'
import type { Sft, Nft } from '@metaplex-foundation/js'

// call apis
import nftsAPI from 'apis/nfts'
import usersAPI from 'apis/user'
import listingsAPI from 'apis/listings'
import activityAPI from 'apis/activity'
import AuctionAPI from 'apis/auctions'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'

import MerchApparelSection from './MerchApparelSection'
import MerchWallArtSection from './MerchWallArtSection'
import ApparelSection from './MerchApparelSection/ApparelSection'
import WallSection from './MerchWallArtSection/WallSection'
import { dataBeet } from '@metaplex-foundation/mpl-token-metadata'

const MerchSection = props => {
  const { data, openNftPage } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const { connected, publicKey, signMessage } = useWallet()
  const { setVisible } = useWalletModal()
  const [loading, setLoading] = useState<boolean>(true)
  const [openApparelDetail, setOpenApparelDetail] = useState(data?.category === 'apparel')
  const [openWallArtDetail, setOpenWallArtDetail] = useState(data?.category === 'print')

  const [finishEditing, setFinishEditing] = useState(false)
  const [showApparelMode, setShowApparelMode] = useState(false)
  const [showWallArtMode, setShowWallArtMode] = useState(false)

  const [openProgressingModal, setOpenProgressingModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const [alertData, setAlertData] = useState<any[]>([])

  const gotoUserDetail = link => {
    dispatch({ type: 'set', isLoading: true })
    router.push(`/${link}`)
  }

  const [apparel, setApparel] = useState(null)
  const [wallArt, setWallArt] = useState(null)
  const [printImageUrl, setPrintImageUrl] = useState(null)

  return (
    <div className={styles.container}>
      <div className="w-full grid grid-cols-2 gap-10">
        {showApparelMode ? (
          <div className="col-span-2 lg:col-span-1">
            <div className={styles.blurBackground}>
              <div className="absolute inset-0">
                <img src={data?.nftCoverUrl} alt="" className="min-w-full min-h-full object-cover" />
              </div>
              <div className={styles.blurImage} />

              <ApparelSection
                nftName={data?.nftName}
                apparel={apparel}
                nftCoverUrl={data?.nftCoverUrl}
                finishEditing={finishEditing}
                setPrintImageUrl={setPrintImageUrl}
              />
            </div>
          </div>
        ) : showWallArtMode ? (
          <div className="col-span-2 lg:col-span-1">
            <div className={styles.blurBackground}>
              {!wallArt && (
                <div className="absolute inset-0">
                  <img src={data?.nftCoverUrl} alt="" className="min-w-full min-h-full object-cover" />
                </div>
              )}

              <WallSection wallArt={wallArt} finishEditing={finishEditing} />
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="col-span-2 lg:col-span-1 z-10">
          {openApparelDetail ? (
            <MerchApparelSection
              nftName={data?.nftName}
              open={openApparelDetail}
              subCategory={data?.subCategory}
              onBack={() => {
                setOpenApparelDetail(false)
              }}
              setFinishEditing={editing => setFinishEditing(editing)}
              setApparel={apparel => setApparel(apparel)}
              setShowApparelMode={mode => setShowApparelMode(mode)}
            />
          ) : openWallArtDetail ? (
            <MerchWallArtSection
              nftName={data?.nftName}
              nftImage={data?.nftCoverUrl}
              open={openWallArtDetail}
              subCategory={data?.subCategory}
              onBack={() => {
                setOpenWallArtDetail(false)
              }}
              setFinishEditing={editing => setFinishEditing(editing)}
              setWallArt={image => setWallArt(image)}
              setShowWallArtMode={mode => setShowWallArtMode(mode)}
            />
          ) : (
            <></>
          )}
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
    </div>
  )
}

export default MerchSection

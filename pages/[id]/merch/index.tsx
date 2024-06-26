import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useWallet } from '@solana/wallet-adapter-react'

// next component

//components
import SocialShareModal from 'components/Menu/SocialShareModal'
import CreatorMerchShop from './shop'
import ArtistLayout from 'components/Layout/ArtistLayout'

// images
import ShareSmallIcon from 'assets/icons/share-black-menu.svg?component'
import ShareDesktopIcon from 'assets/icons/share-icon-707070.svg?component'
import LeftArrowMobile from 'assets/icons/arrow-left-24x24.svg?component'
import PlusIcon from 'assets/icons/cross-plus-icon.svg?component'
import LeftArrowIcon from 'assets/icons/arrow-left-white-big.svg?component'
// json

// styles
import styles from './index.module.scss'
import CreatorMerchBadges from 'components/pages/ArtistProfile/CreatorMerchBadges'
import CreatorMerchReviews from 'components/pages/ArtistProfile/CreatorMerchReviews'
import ImageWithFoster from 'components/ImageWithFoster'

interface CreatorMerchProps {
  artistPublicKey?: string
  publicArtistData?: any
  error?: string
}

const CreatorMerch = ({ publicArtistData }: CreatorMerchProps) => {
  const [artistInfo, setArtistInfo] = useState<any>(publicArtistData?.artist)
  const router = useRouter()
  const { connected, publicKey } = useWallet()

  const [activeTab, setActiveTab] = useState<any>(0)
  const [openShareModal, setOpenShareModal] = useState(false)

  return (
    <div className="w-full pb-[60px]">
      <div className="w-full h-[150px] sm:h-[350px] relative">
        <img src={artistInfo?.banner_picture} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0">
          <div className={styles.overlayBG}>
            <div>
              <div className="flex justify-center mb-[15px]">
                <div className="w-[100px] rounded-full overflow-hidden">
                  <img src={artistInfo.profile_picture} alt="" className="w-[100px] h-[100px] object-cover" />
                </div>
              </div>
              <div className={styles.merchBy}>Merch by</div>
              <div className={styles.userName}>{artistInfo.username}</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0">
          <div className={styles.tabBorder} />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="g-container">
          <div className="w-full lg:mt-[30px] mt-[20px] flex gap-[9px] justify-between">
            <div className="flex gap-[24px]">
              <div
                className={styles.profile}
                onClick={() => {
                  let path = window.location.href
                  router.push(path.substring(0, path.lastIndexOf('/')))
                }}
              >
                <LeftArrowIcon className="mt-[2px]" />
                Profile
              </div>
              <div className="flex gap-[8px] sm:gap-[15px]">
                <div className={activeTab === 0 ? styles.selected : styles.unselected} onClick={() => setActiveTab(0)}>
                  <div className="mt-[-2px]">Shop</div>
                </div>
                <div className={activeTab === 1 ? styles.selected : styles.unselected} onClick={() => setActiveTab(1)}>
                  <div className="mt-[-2px]">Reviews</div>
                </div>
                <div className={activeTab === 2 ? styles.selected : styles.unselected} onClick={() => setActiveTab(2)}>
                  <div className="mt-[-2px]">Badges</div>
                </div>
              </div>
            </div>
            <div className="flex gap-[25px]">
              {publicKey?.toBase58() === artistInfo?.wallet_id && (
                <div className={styles.add}>
                  <div
                    className={styles.plus}
                    onClick={() => {
                      let path = window.location.href
                      router.push(`${path}/new`)
                    }}
                  >
                    <PlusIcon />
                  </div>
                  Add
                </div>
              )}
              <div
                className={`flex w-[20px] sm:w-[70px] gap-[9px] items-center`}
                onClick={() => setOpenShareModal(true)}
              >
                <div className="sm:block hidden">
                  <ShareDesktopIcon alt="" />
                </div>
                <div className="sm:hidden block">
                  <ShareSmallIcon alt="" />
                </div>
                <div className={`${styles.shareText} mt-[-2px] sm:block hidden`}>Share</div>
              </div>
            </div>
          </div>
          <div className="w-full mt-[20px] sm:mt-[30px] ">
            {activeTab === 0 && <CreatorMerchShop username={artistInfo?.username} userId={artistInfo?.id} />}
            {activeTab === 1 && <CreatorMerchReviews />}
            {activeTab === 2 && <CreatorMerchBadges />}
          </div>
        </div>
      </div>
      {openShareModal && (
        <SocialShareModal
          open={openShareModal}
          close={() => setOpenShareModal(false)}
          vote={true}
          message={'Check out this artist on Foster Marketplace @foster_protocol #fostermarketplace'}
          url={`/${artistInfo?.username}/merch`}
        />
      )}
    </div>
  )
}

export default CreatorMerch

CreatorMerch.getLayout = function getLayout(page) {
  return <ArtistLayout>{page}</ArtistLayout>
}

CreatorMerch.getInitialProps = async function ({ res, query }): Promise<CreatorMerchProps> {
  let artistUsername = encodeURIComponent(query.id)

  try {
    let publicArtistData = await fetch(`${process.env.BACKEND_URL}v1/artists/${artistUsername}/username`).then(r =>
      r.json()
    )
    let artistPublicKey = publicArtistData.artist.wallet_id
    return {
      artistPublicKey,
      publicArtistData,
    }
  } catch (e: any) {
    console.error(e)
    return {
      error: `could not load artist details: ${artistUsername}: ${e.message}`,
    }
  }
}

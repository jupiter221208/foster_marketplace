import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// next components
import Link from 'next/link'

// custom components
import GradientButton from 'components/Button/GradientButton'

// images and icons
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import EllipseGroupWhiteIcon from 'assets/icons/three-dot-icon.svg?component'
import CloseIcon from 'assets/icons/close-white-13x13.svg?component'

// styles
import styles from './index.module.scss'
import { NftData } from 'types/nft'
import ImageWithFoster from 'components/ImageWithFoster'
import OutlineButton from 'components/Button/OutlineButton'
import PrimaryButton from 'components/Button/PrimaryButton'
import SecondaryButton from 'components/Button/SecondaryButton'
import PrimaryDashboardButton from 'components/Button/PrimaryDashboardButton'
import SecondaryDashboardButton from 'components/Button/SecondaryDashboardButton'

type MyNFTCardTypes = {
  data: NftData
  onClick?: any
  onClickStartAuction: (item: NftData) => void
  onClickListEdition: (item: NftData) => void
  onClickListNFT: (item: NftData) => void
  active: any
}

const MyNFTCard = ({ data, onClickStartAuction, onClickListEdition, onClickListNFT, active }: MyNFTCardTypes) => {
  const [blurMode, setBlurMode] = useState(false)
  const dispatch = useDispatch()
  const [nftImage, setNftImage] = useState(data.image)
  const [showEditBtn, setShowEditBtn] = useState(false)

  useEffect(() => {
    setNftImage(data.image)
  }, [data])

  return (
    <div className={styles.container}>
      <div className="relative w-full overflow-hidden">
        <div className={styles.topSection}>
          <div className={styles.nftName}>{data.name}</div>
        </div>
        <Link href={`/nft/${data.mintAddress.toString()}`} passHref>
          <a>
            <div className={styles.imageArea} onClick={() => dispatch({ type: 'set', isLoading: true })}>
              <div className={styles.imageContent}>
                {data.category.toString().includes('video') ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full object-contain">
                  <source src=${data.animation_url} type="video/mp4" /></video>`,
                    }}
                  />
                ) : (
                  <div className="w-full h-full">
                    <ImageWithFoster src={nftImage} width={800} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </a>
        </Link>
        <div className={styles.bottomSection}>
          {active === 0 ? (
            <div className="w-full flex">
              <PrimaryDashboardButton
                label="Start Auction"
                type="start-auction"
                onClick={() => onClickStartAuction(data)}
                fullWidth
              />
              <SecondaryDashboardButton
                fullWidth
                label="List Artwork"
                type="list-artwork"
                onClick={() => onClickListNFT(data)}
              />
            </div>
          ) : (
            <div className="w-full flex justify-between items-center">
              <SecondaryDashboardButton
                label="List Edition"
                type="list-artwork"
                onClick={() => onClickListEdition(data)}
                fullWidth
              />
            </div>
          )}
        </div>
      </div>

      {blurMode && (
        <div className={styles.noAuction} onMouseLeave={() => setBlurMode(false)}>
          Auctions can only be
          <br />
          started by the creator.
        </div>
      )}
    </div>
  )
}

export default MyNFTCard

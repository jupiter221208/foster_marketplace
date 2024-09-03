import React, { useRef, useState } from 'react'
import 'react-placeholder/lib/reactPlaceholder.css'
import Link from 'next/link'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-tiny.svg?component'
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import PlayVideoIcon from 'assets/icons/play-video.svg'
import PauseVideoIcon from 'assets/icons/pause-video.svg'
import EllipseGroupWhiteIcon from 'assets/icons/three-dot-icon.svg?component'
import CloseIcon from 'assets/icons/close-white-13x13.svg?component'
import HideSmallIcon from 'assets/icons/hide-small-icon.svg'
import UnhideSmallIcon from 'assets/icons/unhide-small-icon.svg'
import HideSmallMobileIcon from 'assets/icons/hide-small-icon-mobile.svg'
import UnhideSmallMobileIcon from 'assets/icons/unhide-small-icon-mobile.svg'

// styles
import styles from './index.module.scss'
import { formattedAmount } from 'utils/helpers'
import GradientButton from 'components/Button/GradientButton'

import nftAPI from 'apis/nfts'
import { useDispatch } from 'react-redux'
import LoadingModal from 'components/Modal/LoadingModal'
import { getDisplayUserName } from 'utils/strings'
import ImageWithFoster from 'components/ImageWithFoster'
import SecondaryButton from 'components/Button/SecondaryButton'
import SecondaryDashboardButton from 'components/Button/SecondaryDashboardButton'
import OutlineButton from 'components/Button/OutlineButton'

const NewNftCard = props => {
  const {
    token_id,
    image,
    nftName,
    coverImage = '',
    fallBack = '',
    artistName,
    artistImage,
    collectionName,
    assetType,
    price,
    onClick,
    unSave = null,
    showHideButton = false,
    showUnhideButton = false,
  } = props
  const viewport = useViewport()
  const dispatch = useDispatch()
  const [play, setPlay] = useState(false)
  const [displayHideConfirm, setDisplayHideConfirm] = useState(false)
  const [displayUnhideConfirm, setDisplayUnhideConfirm] = useState(false)
  const [displayUnsaveConfirm, setDisplayUnsaveConfirm] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const performHideNft = () => {
    setIsLoading(true)

    nftAPI.hideNft(token_id).then(
      response => {
        setIsLoading(false)
        setDisplayHideConfirm(false)
        dispatch({ type: 'set', hideNftToken: token_id })
      },
      error => {}
    )
  }

  const performUnhideNft = () => {
    setIsLoading(true)

    nftAPI.unhideNft(token_id).then(
      response => {
        setIsLoading(false)
        setDisplayUnhideConfirm(false)
        dispatch({ type: 'set', unhideNftToken: token_id })
      },
      error => {}
    )
  }

  const performUnsave = () => {
    setIsLoading(true)
    unSave()
  }

  const videoRef = useRef<HTMLVideoElement>()

  return (
    <div className="w-full h-full relative flex justify-center">
      <div className={styles.container}>
        <div className="relative w-full overflow-hidden">
          <div className={styles.topSection}>
            <div>
              <div className={styles.nftName}>{nftName}</div>
              <div className={styles.artistName}>{artistName}</div>
            </div>
            <div className="w-[45px] h-[45px] rounded-[23px] overflow-hidden">
              <ImageWithFoster width={100} src={artistImage} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className={styles.imageArea}>
            {assetType?.includes('video') ? (
              <div className={styles.imageContent}>
                {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                  <div className="w-full relative flex justify-center items-center overflow-hidden">
                    <Link href={`${window.origin}/nft/${token_id}`} passHref>
                      <a className="w-full h-full">
                        {play ? (
                          <div
                            className="w-full h-full absolute"
                            dangerouslySetInnerHTML={{
                              __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-contain overflow-hidden">
                <source src=${image} type="video/mp4" /></video>`,
                            }}
                          />
                        ) : coverImage != null && coverImage !== '' && !coverImage?.includes('mp4') ? (
                          <ImageWithFoster width={800} src={coverImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div
                            className="w-full h-full absolute"
                            dangerouslySetInnerHTML={{
                              __html: `<video id="hidden_video" muted webkit-playsinline playsinline class="w-full h-full object-contain overflow-hidden">
                <source src=${image} type="video/mp4" /></video>`,
                            }}
                          />
                        )}
                      </a>
                    </Link>
                    <div className={styles.playButton}>
                      <div className={`${play ? 'w-[18px]' : 'w-[22px]'} h-[18px] flex justify-end`}>
                        <Image
                          src={play ? PauseVideoIcon : PlayVideoIcon}
                          width={18}
                          height={18}
                          alt=""
                          onClick={() => setPlay(!play)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href={`${window.origin}/nft/${token_id}`} passHref>
                    <a>
                      <div className="w-full h-full" onClick={() => onClick()}>
                        <video src={image} loop muted autoPlay className="w-full h-full object-cover overflow-hidden" />
                      </div>
                    </a>
                  </Link>
                )}
              </div>
            ) : (
              <Link href={`${window.origin}/nft/${token_id}`} passHref>
                <a>
                  <div className={styles.imageContent}>
                    {assetType?.includes('vr') ? (
                      coverImage !== null && coverImage !== '' ? (
                        <ImageWithFoster src={coverImage} width={800} className="max-w-full max-h-full object-cover" />
                      ) : (
                        <Image src={DefaultNftBG} alt="" className={styles.imageNft} onClick={() => onClick()} />
                      )
                    ) : assetType?.includes('audio') ? (
                      coverImage !== null && coverImage !== '' ? (
                        <ImageWithFoster
                          src={coverImage}
                          width={800}
                          onClick={onClick}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={DefaultNftBG}
                          alt=""
                          className="w-full h-full object-cover"
                          onClick={() => onClick()}
                        />
                      )
                    ) : coverImage !== null && coverImage !== '' ? (
                      <ImageWithFoster
                        src={coverImage}
                        width={800}
                        originalSrc={fallBack}
                        onClick={onClick}
                        className="w-full h-full object-cover"
                      />
                    ) : image !== null && image !== '' ? (
                      <ImageWithFoster
                        src={image}
                        width={800}
                        originalSrc={fallBack}
                        onClick={onClick}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image src={DefaultNftBG} alt="" className={styles.imageNft} onClick={() => onClick()} />
                    )}
                  </div>
                </a>
              </Link>
            )}
          </div>
          <div className={styles.bottomSection}>
            {unSave !== null && (
              <div className="w-full">
                <OutlineButton
                  fullWidth
                  fontSize={16}
                  height={45}
                  label="Remove"
                  onClick={() => {
                    setDisplayUnsaveConfirm(true)
                  }}
                />
              </div>
            )}
            {showUnhideButton && (
              <div className="w-full">
                <OutlineButton
                  fullWidth
                  fontSize={16}
                  height={45}
                  label="Unhide"
                  onClick={() => setDisplayUnhideConfirm(true)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {displayUnsaveConfirm && (
        <div className={styles.hideConfirm}>
          {isLoading ? (
            <div className={styles.loading}>
              <LoadingModal open={isLoading} />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div>
                <div className={styles.hideText}>
                  This artwork is currently bookmarked.
                  <br />
                  <br />
                  Would you like to remove it from your favorites?
                </div>
                <div className="flex gap-[15px] lg:gap-[19px] mt-[50px] justify-center">
                  <div className={styles.hideCancelButton} onClick={() => setDisplayUnsaveConfirm(false)}>
                    Cancel
                  </div>
                  <div className={styles.hideButton} onClick={() => performUnsave()}>
                    <div className="flex">
                      <div className={styles.hideButtonText}>Remove</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {displayHideConfirm && (
        <div className={styles.hideConfirm}>
          {isLoading ? (
            <div className={styles.loading}>
              <LoadingModal open={isLoading} />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div>
                <div className={styles.hideText}>
                  This action will hide the artwork from your profile page.
                  <br />
                  <br />
                  Would you like to proceed?
                </div>
                <div className="flex gap-[15px] lg:gap-[19px] mt-[50px] justify-center">
                  <div className={styles.hideCancelButton} onClick={() => setDisplayHideConfirm(false)}>
                    Cancel
                  </div>
                  <div className={styles.hideButton} onClick={() => performHideNft()}>
                    <div className="flex gap-[6px]">
                      <Image
                        src={
                          viewport === 'xs' || viewport === 'md' || viewport === 'sm'
                            ? HideSmallMobileIcon
                            : HideSmallIcon
                        }
                        alt=""
                      />
                      <div className={styles.hideButtonText}>Hide</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {displayUnhideConfirm && (
        <div className={styles.hideConfirm}>
          {isLoading ? (
            <div className={styles.loading}>
              <LoadingModal open={isLoading} />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div>
                <div className={styles.hideText}>
                  This artwork is currently hidden from your profile page.
                  <br />
                  <br />
                  Would you like to unhide it?
                </div>
                <div className="flex gap-[6px] lg:gap-[19px] mt-[50px] justify-center">
                  <div className={styles.hideCancelButton} onClick={() => setDisplayUnhideConfirm(false)}>
                    Cancel
                  </div>
                  <div className={styles.hideButton} onClick={() => performUnhideNft()}>
                    <div className="flex">
                      <div className={styles.hideButtonText}>Unhide</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NewNftCard

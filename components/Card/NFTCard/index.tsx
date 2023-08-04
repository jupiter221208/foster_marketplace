import React, { useState } from 'react'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'
// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-tiny.svg?component'
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import PlayVideoIcon from 'assets/icons/play-video.svg'
import PauseVideoIcon from 'assets/icons/pause-video.svg'
import HideIcon from 'assets/icons/hide-icon.svg?component'
import UnhideIcon from 'assets/icons/unhide-icon.svg?component'
import HideMobileIcon from 'assets/icons/hide-icon-mobile.svg?component'
import UnhideMobileIcon from 'assets/icons/unhide-icon-mobile.svg?component'
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
import ImageWithFallback from 'components/ImageWithFallback'

const DashboardNFTCard = props => {
  const {
    token_id,
    image,
    nftName,
    coverImage = '',
    artistName,
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
  const [loaded, setLoaded] = useState(false)
  const [displayHideConfirm, setDisplayHideConfirm] = useState(false)
  const [displayUnhideConfirm, setDisplayUnhideConfirm] = useState(false)

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

  return (
    <div className="w-full h-full relative p-[2px] lg:p-[3px]">
      <a href={`${window.origin}/nft/${token_id}`}>
        <div className={styles.container}>
          <div className={styles.imageArea}>
            <div className={styles.imageContent}>
              {assetType?.includes('video') ? (
                viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                  <div className="w-full relative flex justify-center items-center rounded-[10px] lg:rounded-[24px] overflow-hidden">
                    {play ? (
                      <div
                        className="w-full h-full absolute"
                        dangerouslySetInnerHTML={{
                          __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover rounded-[10px] lg:rounded-[24px] overflow-hidden">
                    <source src=${image} type="video/mp4" /></video>`,
                        }}
                        onClick={() => onClick()}
                      />
                    ) : coverImage != null && coverImage !== '' ? (
                      <Image
                        src={coverImage}
                        alt=""
                        layout="fill"
                        className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover"
                        onClick={() => onClick()}
                      />
                    ) : (
                      <Image
                        src={DefaultNftBG}
                        alt=""
                        className="w-full h-full object-cover"
                        onClick={() => onClick()}
                      />
                    )}
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
                  <div
                    className="w-full"
                    dangerouslySetInnerHTML={{
                      __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover rounded-[10px] lg:rounded-[24px] overflow-hidden">
                  <source src=${image} type="video/mp4" /></video>`,
                    }}
                    onClick={() => onClick()}
                  />
                )
              ) : assetType?.includes('audio') ? (
                coverImage !== null && coverImage !== '' ? (
                  <ImageWithFallback
                    src={coverImage}
                    onClick={onClick}
                    layout="fill"
                    alt=""
                    className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover"
                  />
                ) : (
                  <Image src={DefaultNftBG} alt="" className="w-full h-full object-cover" onClick={() => onClick()} />
                )
              ) : image !== null && image !== '' ? (
                <ImageWithFallback src={image} onClick={onClick} layout="fill" alt="" className={styles.imageNft} />
              ) : coverImage !== null && coverImage !== '' ? (
                <ImageWithFallback
                  src={coverImage}
                  onClick={onClick}
                  layout="fill"
                  alt=""
                  className={styles.imageNft}
                />
              ) : (
                <Image src={DefaultNftBG} alt="" className={styles.imageNft} onClick={() => onClick()} />
              )}
            </div>
            {showHideButton === true && (
              <div className={styles.hideBtnArea} onClick={() => setDisplayHideConfirm(true)}>
                {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? <HideMobileIcon /> : <HideIcon />}
              </div>
            )}
            {showUnhideButton === true && (
              <div className={styles.hideBtnArea} onClick={() => setDisplayUnhideConfirm(true)}>
                {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? <UnhideMobileIcon /> : <UnhideIcon />}
              </div>
            )}
          </div>
          <div className="relative w-full mt-[3px] lg:mt-[9px] flex flex-wrap justify-between items-center px-[5px] lg:px-[9px]">
            <div className="w-full">
              <div className="flex items-center">
                <div className={styles.nftName}>{nftName}</div>
              </div>
              <div className="w-full flex justify-between items-center mt-[2px]">
                <div className={styles.artistName}>{artistName || collectionName || 'Ecosystem Artist'}</div>
                {price && (
                  <div className="flex justify-center items-center">
                    {viewport === 'sm' || viewport === 'xs' || viewport === 'md' ? (
                      <SolanaLogoMobileIcon />
                    ) : (
                      <SolanaLogoIcon />
                    )}
                    <div className={styles.price}>{formattedAmount(price)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {unSave !== null && (
            <div className="mt-[10px]">
              <GradientButton
                fullWidth
                label="Unsave"
                onClick={() => {
                  dispatch({ type: 'set', isLoading: true })
                  unSave()
                }}
              />
            </div>
          )}
        </div>
      </a>
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
                <div className="flex gap-[6px] lg:gap-[19px] mt-[50px] justify-center">
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
                    <div className="flex gap-[6px]">
                      <Image
                        src={
                          viewport === 'xs' || viewport === 'md' || viewport === 'sm'
                            ? UnhideSmallMobileIcon
                            : UnhideSmallIcon
                        }
                        alt=""
                      />
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

export default DashboardNFTCard

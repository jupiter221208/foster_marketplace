import React, { useEffect, useState } from 'react'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'
import Link from 'next/link'

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

const TrendingCard = props => {
  const {
    token_id,
    imagedata,
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
    innerimage,
  } = props
  const viewport = useViewport()
  const dispatch = useDispatch()
  const [play, setPlay] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [displayHideConfirm, setDisplayHideConfirm] = useState(false)
  const [displayUnhideConfirm, setDisplayUnhideConfirm] = useState(false)
  const [image, setImage] = useState('')
  const [name, setName] = useState('')
  const imageLabelList = ['navy', 'black', 'gray', 'white']

  const [isLoading, setIsLoading] = useState(false)
  const [assetUrl, setAssetUrl] = useState('')

  useEffect(() => {
    if (innerimage) {
      for (var i = 0; i < innerimage.length; i++) {
        if (innerimage[i].name == 'assetUrl') {
          setAssetUrl(innerimage[i].value)
        }
      }
    }
    if (imagedata) {
      const randomNumber = Math.floor(Math.random() * 4)
      let label = imageLabelList[randomNumber]
      setImage(imagedata[label].image.front)
    }
  }, [innerimage, imagedata])

  useEffect(() => {
    if (nftName) {
      for (var i = 0; i < innerimage.length; i++) {
        if (nftName[i].name == 'nftName') {
          setName(nftName[i].value)
        }
      }
    }
  }, [nftName])

  return (
    <div className="w-full h-full relative p-[2px] lg:p-[3px]">
      <div className={styles.container}>
        <div className={styles.imageArea}>
          <Link href={`${window.origin}/merch-logs/${token_id}`} passHref>
            <a>
              <div className={styles.imageContent}>
                {image !== null && image !== '' ? (
                  <>
                    <ImageWithFallback src={image} onClick={onClick} layout="fill" alt="" className={styles.imageNft} />
                    <div className={styles.nftImage}>
                      <div className="w-[30%] h-[30%] lg:w-[34%] h-[34%] lg:-mt-[8%] -mt-[8%] flex justify-center items-start">
                        <img
                          src={assetUrl}
                          onClick={onClick}
                          alt=""
                          className="w-auto h-auto max-w-full max-h-full object-contain"
                        ></img>
                      </div>
                    </div>
                  </>
                ) : (
                  <Image src={DefaultNftBG} alt="" className={styles.imageNft} onClick={() => onClick()} />
                )}
              </div>
            </a>
          </Link>
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
              <div className={styles.nftName}>{name}</div>
            </div>
            <div className="w-full flex items-center"> </div>
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
                  <div className={styles.hideButton}>
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
                  <div className={styles.hideButton}>
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

export default TrendingCard

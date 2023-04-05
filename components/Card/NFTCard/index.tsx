import React, { useState, useEffect } from 'react'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'
// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import PlayVideoIcon from 'assets/icons/play-video.svg'
import PauseVideoIcon from 'assets/icons/pause-video.svg'

// styles
import styles from './index.module.scss'
import { formattedAmount } from 'utils/helpers'
import GradientButton from 'components/Button/GradientButton'

const DashboardNFTCard = props => {
  const {
    image,
    nftName,
    coverImage = '',
    artistName,
    collectionName,
    assetType,
    price,
    onClick,
    unSave = null,
  } = props
  const viewport = useViewport()
  const [play, setPlay] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {}, [])

  return (
    <div className="w-full h-full p-[2px] lg:p-[3px]">
      <div className={styles.container}>
        <div className={styles.imageArea}>
          <div className={styles.imageContent}>
            {assetType.includes('video') ? (
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
                    <img
                      src={coverImage}
                      alt=""
                      className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover"
                      onClick={() => onClick()}
                    />
                  ) : (
                    <Image src={DefaultNftBG} alt="" className="w-full h-full object-cover" onClick={() => onClick()} />
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
            ) : assetType.includes('audio') ? (
              coverImage !== null && coverImage !== '' ? (
                <div className="w-full" onClick={() => onClick()}>
                  <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                    <img
                      src={coverImage}
                      alt=""
                      className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover"
                    />
                  </ReactPlaceholder>
                  {!loaded && (
                    <img
                      src={coverImage}
                      alt=""
                      className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover"
                      onLoad={() => {
                        setLoaded(true)
                      }}
                    />
                  )}
                </div>
              ) : (
                <Image src={DefaultNftBG} alt="" className="w-full h-full object-cover" onClick={() => onClick()} />
              )
            ) : image !== null && image !== '' ? (
              <div className="w-full" onClick={() => onClick()}>
                <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                  <img src={image} alt="" className={styles.imageNft} />
                </ReactPlaceholder>
                {!loaded && (
                  <img
                    src={image}
                    alt=""
                    className={styles.imageNft}
                    onLoad={() => {
                      setLoaded(true)
                    }}
                  />
                )}
              </div>
            ) : coverImage !== null && coverImage !== '' ? (
              <div className="w-full" onClick={() => onClick()}>
                <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                  <img src={coverImage} alt="" className={styles.imageNft} />
                </ReactPlaceholder>
                {!loaded && (
                  <img
                    src={coverImage}
                    alt=""
                    className={styles.imageNft}
                    onLoad={() => {
                      setLoaded(true)
                    }}
                  />
                )}
              </div>
            ) : (
              <Image src={DefaultNftBG} alt="" className={styles.imageNft} onClick={() => onClick()} />
            )}
          </div>
        </div>
        <div className="w-full mt-[3px] lg:mt-[9px] flex flex-wrap justify-center items-center px-[5px] lg:px-[9px]">
          <div className="w-full flex items-center">
            <div className={styles.nftName}>{nftName || 'Ecosystem Artist'}</div>
          </div>
          <div className="w-full flex justify-between items-center mt-[2px]">
            <div className={styles.artistName}>{artistName || collectionName || 'Ecosystem Artist'}</div>
            {price && (
              <div className="flex justify-center items-center">
                <Image
                  src={SolanaLogoIcon}
                  alt=""
                  width={viewport === 'xs' ? 10 : viewport === 'sm' || viewport === 'md' ? 15 : 17}
                  height={viewport === 'xs' ? 8 : viewport === 'sm' || viewport === 'md' ? 13 : 15}
                />
                <div className={styles.price}>{formattedAmount(price)}</div>
              </div>
            )}
          </div>
        </div>
        {unSave !== null && (
          <div className="mt-[10px]">
            <GradientButton fullWidth label="Unsave" onClick={() => unSave()} />
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardNFTCard

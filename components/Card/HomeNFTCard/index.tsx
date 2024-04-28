import React, { useRef, useState } from 'react'
import 'react-placeholder/lib/reactPlaceholder.css'
import Link from 'next/link'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import PlayVideoIcon from 'assets/icons/play-video.svg'
import PauseVideoIcon from 'assets/icons/pause-video.svg'
import SolanaLogoIcon from 'assets/icons/solana-logo-14x12.svg?component'

// styles
import styles from './index.module.scss'
import { formattedAmount } from 'utils/helpers'

import ImageWithFoster from 'components/ImageWithFoster'
import { getDisplayUserName } from 'utils/strings'

const HomeNftCard = props => {
  const {
    token_id,
    image,
    nftName,
    coverImage = '',
    fallBack = '',
    artistName,
    artistImage = null,
    collectionName,
    assetType,
    price,
    onClick,
  } = props
  const viewport = useViewport()
  const [play, setPlay] = useState(false)

  const videoRef = useRef<HTMLVideoElement>()
  const [hover, setHover] = useState(false)

  return (
    <div className={styles.layout} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className={styles.container}>
        <div className={styles.containerCard}>
          <div className={styles.imageInfoHome}>
            <div>
              <div className="flex items-center">
                <div className={styles.nftNameForHome}>{nftName}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className={styles.artistNameHome}>
                  <Link href={`/${artistName || collectionName}`} passHref>
                    <a>{getDisplayUserName(artistName) || collectionName || 'Ecosystem Artist'}</a>
                  </Link>
                </div>
              </div>
            </div>
            {artistImage && (
              <Link href={`${window.origin}/${artistName}`} passHref>
                <a>
                  <div className="w-[44px] h-[44px] rounded-full overflow-hidden">
                    <ImageWithFoster src={artistImage} width={100} className="w-[44px] h-[44px] rounded-full" />
                  </div>
                </a>
              </Link>
            )}
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
                          <ImageWithFoster
                            width={360}
                            src={coverImage}
                            alt=""
                            className="max-w-full max-h-full object-cover"
                          />
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
                    <div className="w-full h-full">
                      {assetType?.includes('vr') ? (
                        coverImage !== null && coverImage !== '' ? (
                          <ImageWithFoster src={coverImage} width={360} className={styles.imageNft} />
                        ) : (
                          <Image src={DefaultNftBG} alt="" className={styles.imageNft} onClick={() => onClick()} />
                        )
                      ) : assetType?.includes('audio') ? (
                        coverImage !== null && coverImage !== '' ? (
                          <ImageWithFoster src={coverImage} width={360} onClick={onClick} className={styles.imageNft} />
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
                          width={360}
                          originalSrc={fallBack}
                          onClick={onClick}
                          className="max-w-full max-h-full w-full h-full object-contain"
                        />
                      ) : image !== null && image !== '' ? (
                        <ImageWithFoster
                          src={image}
                          width={360}
                          originalSrc={fallBack}
                          onClick={onClick}
                          className="max-w-full max-h-full w-full h-full object-contain"
                        />
                      ) : (
                        <Image src={DefaultNftBG} alt="" className={styles.imageNft} onClick={() => onClick()} />
                      )}
                    </div>
                  </div>
                </a>
              </Link>
            )}
          </div>

          <div className={`${styles.bottomSection} ${hover ? styles.bottomHover : ''}`}>
            <div className="w-full">
              <div className="w-full flex justify-between items-center">
                {price && (
                  <div>
                    <div className={styles.priceLabel}>Price</div>
                    <div className="flex justify-center items-center mt-[4px]">
                      {viewport === 'sm' || viewport === 'xs' || viewport === 'md' ? (
                        <SolanaLogoIcon className={`mt-[2px] ${styles.sol_icon_color}`} />
                      ) : (
                        <SolanaLogoIcon className={`mt-[2px] ${styles.sol_icon_color}`} />
                      )}
                      <div className={styles.priceHome}>{formattedAmount(price)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeNftCard

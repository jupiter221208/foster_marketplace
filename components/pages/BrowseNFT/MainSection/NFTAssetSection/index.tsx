import React, { useEffect, useState } from 'react'

// next component
import Image from 'next/image'

import { useViewport } from 'utils'
import { useResizeDetector } from 'react-resize-detector'

// component
import ModelViewer from 'components/ModelViewer'
import AudioPlayer from 'components/MediaPlayer/AudioPlayer'

// resources
import FullScreenModeIcon from 'assets/icons/fullscreen-mode.svg'
import ErrorMessageIcon from 'assets/icons/error-message-icon.svg?component'

// styles
import styles from './index.module.scss'

const NFTAssetSection = props => {
  const { nftType, nftAssetUrl, nftCoverUrl, fullScreen, setFullScreenView } = props
  const viewport = useViewport()

  const { width, height, ref } = useResizeDetector()

  return (
    <div>
      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        nftType.includes('vr') ? (
          nftAssetUrl ? (
            <div ref={ref} className={`${styles.mobileImageArea} aspect-square w-full h-full`}>
              <ModelViewer path={nftAssetUrl} width={width} height={height} orbitLimited />
            </div>
          ) : nftCoverUrl ? (
            <div className={styles.mobileImageArea}>
              <img src={nftCoverUrl} alt="" className="w-full" />
            </div>
          ) : (
            <h1>Could not load NFT.</h1>
          )
        ) : nftType.includes('image') ? (
          <div className={styles.mobileImageArea}>
            <img src={nftCoverUrl} alt="" className="w-full" />
          </div>
        ) : nftType.includes('audio') ? (
          <div className={styles.mobileImageArea}>
            <img src={nftCoverUrl} alt="" className="w-full" />
            <div className={styles.audioMobileArea}>
              <AudioPlayer src={nftAssetUrl} />
            </div>
          </div>
        ) : nftType.includes('video') ? (
          <div className={styles.videoArea}>
            <div className={styles.mobileVideoThumb}>
              <video
                autoPlay
                src={nftAssetUrl}
                loop
                playsInline
                controls
                controlsList="nodownload"
                className="w-full h-full object-cover overflow-hidden"
              />
            </div>
          </div>
        ) : (
          <></>
        )
      ) : nftType.includes('vr') && !fullScreen ? (
        <div className={styles.blurBackground}>
          <div className={styles.blurImage} />
          <div ref={ref} className={`${styles.imageArea} w-full h-full`}>
            {nftAssetUrl ? (
              <>
                <ModelViewer path={nftAssetUrl} width={width} height={height} orbitLimited />
                <div className={styles.fullScreenMode} onClick={() => setFullScreenView(nftAssetUrl)}>
                  <Image src={FullScreenModeIcon} alt="" />
                </div>
              </>
            ) : nftCoverUrl ? (
              <img
                src={nftCoverUrl}
                alt=""
                className="w-auto h-auto max-w-full max-h-full object-contain shadow-[0_0_30px_rgba(0,0,0,0.4)]"
              />
            ) : (
              <h1>Could not load NFT.</h1>
            )}
          </div>
        </div>
      ) : nftType.includes('image') ? (
        <div className={styles.blurBackground}>
          <div className={styles.blurImage} />
          <div className={styles.imageArea}>
            <img
              src={nftCoverUrl}
              alt=""
              className="w-auto h-auto max-w-full max-h-full object-contain shadow-[0_0_30px_rgba(0,0,0,0.4)]"
            />
            <div className={styles.fullScreenMode} onClick={() => setFullScreenView(nftCoverUrl)}>
              <Image src={FullScreenModeIcon} alt="" />
            </div>
          </div>
        </div>
      ) : nftType.includes('audio') ? (
        <div className="w-full h-full flex justify-start items-center">
          <div className={styles.audioBackground}>
            {nftAssetUrl && (
              <div className="w-full max-w-[600px] h-[600px] rounded-[35px] overflow-hidden">
                <img src={nftCoverUrl} alt="" className="min-w-full min-h-full object-cover" />
              </div>
            )}
            <div className="w-full flex justify-center mb-[30px]">
              <div className={styles.audioArea}>
                <AudioPlayer src={nftAssetUrl} cover={nftCoverUrl} />
              </div>
            </div>
          </div>
        </div>
      ) : nftType.includes('video') ? (
        <div className={styles.blurBackground}>
          {nftAssetUrl ? (
            <>
              <div className="absolute inset-0">
                <img src={nftCoverUrl} alt="" className="min-w-full min-h-full object-cover" />
              </div>
              <div className={styles.videoArea}>
                <video controls controlsList="nodownload" autoPlay loop className="max-w-full max-h-full">
                  <source type="video/mp4" src={nftAssetUrl} />
                </video>
              </div>
            </>
          ) : (
            <>
              <div className={styles.videoArea}>
                <video controls controlsList="nodownload" autoPlay loop className="max-w-full max-h-full">
                  <source type="video/mp4" src={nftAssetUrl} />
                </video>
              </div>
              {!nftAssetUrl && (
                <div className={styles.errorMessage}>
                  <ErrorMessageIcon />
                  <div>Video File Missing</div>
                </div>
              )}
            </>
          )}
          <div className={styles.blurImage} />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default NFTAssetSection

import React, { useEffect, useState } from 'react'

// next component

import { useViewport } from 'utils'

// component
import ModelViewer from 'components/ModelViewer'
import AudioPlayer from 'components/MediaPlayer/AudioPlayer'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'

const NFTAssetSection = props => {
  const { nftType, nftAssetUrl, nftCoverUrl, originalCoverUrl, fullScreen } = props
  const viewport = useViewport()
  const [currentImageUrl, setCurrentImageUrl] = useState(nftCoverUrl)

  useEffect(() => {
    if (nftType.includes('image')) {
      const img = new window.Image()
      img.src = nftCoverUrl
      img.onload = () => {
        setCurrentImageUrl(nftCoverUrl)
      }
      img.onerror = () => {
        setCurrentImageUrl(originalCoverUrl)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftCoverUrl, originalCoverUrl])

  return (
    <div>
      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        nftType.includes('vr') ? (
          nftAssetUrl ? (
            <div className={`${styles.mobileImageArea} aspect-square w-full h-full`}>
              <ModelViewer path={nftAssetUrl} preserveDrawingBuffer />
            </div>
          ) : nftCoverUrl ? (
            <div className={styles.mobileImageArea}>
              <ImageWithFoster src={nftCoverUrl} width={900} showPlaceHolder={false} className="w-full" />
            </div>
          ) : (
            <h1>Could not load NFT.</h1>
          )
        ) : nftType.includes('image') ? (
          <div className={styles.mobileImageArea}>
            <ImageWithFoster src={currentImageUrl} width={900} showPlaceHolder={false} className="w-full" />
          </div>
        ) : nftType.includes('audio') ? (
          <div className={styles.audioContainer}>
            <div className="absolute inset-0">
              <div className="w-full h-full ">
                <ImageWithFoster
                  src={nftCoverUrl}
                  width={900}
                  showPlaceHolder={false}
                  className="min-w-full min-h-full object-contain"
                />
              </div>
              <div className={styles.audioBlurView} />
            </div>
            <div className="w-full h-full">
              <div className="w-full flex justify-center mt-[30px] sm:mt-[70px] lg:mt-[30px]">
                <div className="w-[243px] sm:w-[430px] lg:w-[65%] flex items-center">
                  <ImageWithFoster
                    src={nftCoverUrl}
                    width={900}
                    showPlaceHolder={false}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className={styles.audioMobileArea}>
                <AudioPlayer src={nftAssetUrl} />
              </div>
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
          <div className={`${styles.imageArea} w-full h-full`}>
            {nftAssetUrl ? (
              <>
                <ModelViewer path={nftAssetUrl} preserveDrawingBuffer />
              </>
            ) : nftCoverUrl ? (
              <ImageWithFoster
                showPlaceHolder={false}
                width={900}
                src={nftCoverUrl}
                className="w-auto h-auto max-w-full max-h-full object-contain"
              />
            ) : (
              <h1>Could not load NFT.</h1>
            )}
          </div>
          <div className={styles.borderView} />
        </div>
      ) : nftType.includes('image') ? (
        <div className={styles.blurBackground}>
          <div className={styles.blurImage} />
          <div className={styles.imageArea}>
            <ImageWithFoster
              src={currentImageUrl}
              width={900}
              showPlaceHolder={false}
              className="w-auto h-auto max-w-full max-h-full object-contain"
            />
          </div>
          <div className={styles.borderView} />
        </div>
      ) : nftType.includes('audio') ? (
        <div className={styles.audioContainer}>
          <div className="absolute inset-0">
            <div className="w-full h-full ">
              <ImageWithFoster
                src={nftCoverUrl}
                width={900}
                showPlaceHolder={false}
                className="min-w-full min-h-full object-contain"
              />
            </div>
            <div className={styles.audioBlurView} />
          </div>
          <div className={styles.audioBackground}>
            {nftAssetUrl && (
              <div className="w-full h-full flex justify-center overflow-hidden">
                <div className="w-[394px] h-[394px] mt-[20px]">
                  <ImageWithFoster
                    src={nftCoverUrl}
                    width={900}
                    showPlaceHolder={false}
                    className="min-w-full min-h-full object-cover overflow-hidden"
                  />
                </div>
              </div>
            )}
            <div className="w-full flex justify-center">
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
              <div className={styles.videoArea}>
                <video controls controlsList="nodownload" autoPlay loop className="max-w-full max-h-full">
                  <source type="video/mp4" src={nftAssetUrl} />
                </video>
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-0">
                <ImageWithFoster
                  src={nftCoverUrl}
                  width={900}
                  showPlaceHolder={false}
                  className="min-w-full min-h-full object-cover"
                />
              </div>
              {/* <div className={styles.videoArea}>
                <video controls controlsList="nodownload" autoPlay loop className="max-w-full max-h-full">
                  <source type="video/mp4" src={nftAssetUrl} />
                </video>
              </div>
              {!nftAssetUrl && (
                <div className={styles.errorMessage}>
                  <ErrorMessageIcon />
                  <div>Video File Missing</div>
                </div>
              )} */}
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

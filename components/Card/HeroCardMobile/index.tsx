import React, { useState, useEffect } from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// styles
import styles from './index.module.scss'

// resources
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'
import ImageWithFoster from 'components/ImageWithFoster'

const HeroCardMobile = ({ data, gotoNftDetailPage, gotoAristPage }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [profileLoaded, setProfileLoaded] = useState(false)
  const onClick = () => {}
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true)
      setProfileLoaded(true)
    }, 2000)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.imageBG}>
        {(data.asset_url === null || data.asset_url === '') &&
        (data.cover_image_url === null || data.cover_image_url === '') ? (
          <div></div>
        ) : data.asset_type.includes('video') ? (
          <ImageWithFoster
            src={
              data.cover_image_url !== '' && data.cover_image_url !== null && data.cover_image_url !== undefined
                ? data.cover_image_url
                : '/images/banner.png'
            }
            className="w-full h-full object-cover"
          />
        ) : data.asset_type.includes('vr') ? (
          <div className={`aspect-square w-full h-full`}>
            <ImageWithFoster src={data.cover_image_url} className="w-full h-full object-cover" />
          </div>
        ) : (
          <ImageWithFoster
            src={
              data.asset_url !== '' && data.asset_url !== null && data.asset_url !== undefined
                ? data.asset_url
                : data.cover_image_url !== '' && data.cover_image_url !== null && data.cover_image_url !== undefined
                ? data.cover_image_url
                : '/images/banner.png'
            }
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="absolute top-[0px] left-[0px] right-[0px] bottom-[0px] z-10">
        <div className="px-[15px] mt-[110px] z-10">
          <div className={styles.imageArea}>
            <div className={styles.imageContent}>
              {(data.asset_url === null || data.asset_url === '') &&
              (data.cover_image_url === null || data.cover_image_url === '') ? (
                <div></div>
              ) : data.asset_type.includes('image') ? (
                <div className="w-full h-full flex justify-center">
                  <ImageWithFoster
                    src={
                      data.asset_url !== '' && data.asset_url !== null && data.asset_url !== undefined
                        ? data.asset_url
                        : data.cover_image_url !== '' &&
                          data.cover_image_url !== null &&
                          data.cover_image_url !== undefined
                        ? data.cover_image_url
                        : '/images/banner.png'
                    }
                    alt=""
                    width={550}
                    height={772}
                    className="w-auto h-auto max-w-full max-h-full object-contain"
                    onClick={() => gotoNftDetailPage()}
                  />
                </div>
              ) : data.asset_type.includes('vr') ? (
                <div className="relative aspect-square w-full h-full">
                  <ImageWithFoster
                    src={data.cover_image_url}
                    width={550}
                    height={772}
                    className="w-full h-full object-cover"
                    onClick={() => gotoNftDetailPage()}
                  />
                </div>
              ) : data.asset_type.includes('video') ? (
                <div className="w-full h-full relative flex justify-center items-center overflow-hidden">
                  {data.cover_image_url != null && data.cover_image_url !== '' ? (
                    <ImageWithFoster
                      src={data.cover_image_url}
                      className="w-auto h-auto max-w-full max-h-full object-contain"
                      onClick={() => gotoNftDetailPage()}
                    />
                  ) : (
                    <Image
                      src={DefaultNftBG}
                      alt=""
                      layout="fill"
                      className="w-full h-full object-cover"
                      onClick={() => onClick()}
                      onLoadingComplete={() => {
                        setLoaded(true)
                      }}
                    />
                  )}
                </div>
              ) : data.asset_type.includes('audio') ? (
                data.cover_image_url !== null && data.cover_image_url !== '' ? (
                  <img
                    src={data.cover_image_url}
                    alt=""
                    className="w-full h-full object-cover"
                    onClick={() => gotoNftDetailPage()}
                  />
                ) : (
                  <Image
                    src={DefaultNftBG}
                    alt=""
                    layout="fill"
                    className="w-full h-full object-cover"
                    onClick={() => onClick()}
                    onLoadingComplete={() => {
                      setLoaded(true)
                    }}
                  />
                )
              ) : (
                <Image
                  src={DefaultNftBG}
                  alt=""
                  layout="fill"
                  className={styles.imageNft}
                  onClick={() => onClick()}
                  onLoadingComplete={() => {
                    setLoaded(true)
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="w-full h-[170px]">
          <div className={styles.nftNameContainer}>
            <div className={styles.nftName}>{data.nft_name}</div>
          </div>
          <div className="w-full flex justify-center">
            <div className="flex gap-[7px] mt-[8px]" onClick={() => gotoAristPage()}>
              {data.artist_profile_picture !== null && data.artist_profile_picture !== undefined && (
                <div className={styles.avatarArea}>
                  <ImageWithFoster
                    src={
                      data.artist_profile_picture.length > 0
                        ? data.artist_profile_picture
                        : 'images/dashboard-avatar.png'
                    }
                    width={44}
                    height={44}
                    className="rounded-full"
                  />
                </div>
              )}
              <div className={styles.creatorName}>{data.artist_username}</div>
            </div>
          </div>
        </div>
        <div className={styles.bottomSection} />
      </div>
    </div>
  )
}

export default HeroCardMobile

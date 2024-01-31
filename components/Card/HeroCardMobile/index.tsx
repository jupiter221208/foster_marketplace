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

const HeroCardMobile = ({ data }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [profileLoaded, setProfileLoaded] = useState(false)
  const onClick = () => {}
  const [loaded, setLoaded] = useState(false)

  const gotoAristPage = () => {
    dispatch({ type: 'set', isLoading: true })
    router.push(`/${data.artist_username}`)
  }

  const gotoNftDetailPage = () => {
    dispatch({ type: 'set', isLoading: true })
    router.push(`/nft/${data.token_id}`)
  }

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
          <img
            src={
              data.cover_image_url !== '' && data.cover_image_url !== null && data.cover_image_url !== undefined
                ? data.cover_image_url
                : '/images/banner.png'
            }
            alt=""
            height={375}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <img
            src={
              data.asset_url !== '' && data.asset_url !== null && data.asset_url !== undefined
                ? data.asset_url
                : data.cover_image_url !== '' && data.cover_image_url !== null && data.cover_image_url !== undefined
                ? data.cover_image_url
                : '/images/banner.png'
            }
            alt=""
            // width={375}
            // layout="fill"
            height={375}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        <div className={styles.overlayMask} />
      </div>
      <div className="relative mt-[-175px] px-[15px] z-10">
        <div className={styles.imageArea}>
          <div className={styles.imageContent}>
            {!loaded && (
              <div className="w-full h-full">
                <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                  <div></div>
                </ReactPlaceholder>
              </div>
            )}
            {(data.asset_url === null || data.asset_url === '') &&
            (data.cover_image_url === null || data.cover_image_url === '') ? (
              <div></div>
            ) : data.asset_type.includes('image') || data.asset_type.includes('vr') ? (
              <img
                src={
                  data.asset_url !== '' && data.asset_url !== null && data.asset_url !== undefined
                    ? data.asset_url
                    : data.cover_image_url !== '' && data.cover_image_url !== null && data.cover_image_url !== undefined
                    ? data.cover_image_url
                    : '/images/banner.png'
                }
                alt=""
                width={550}
                height={772}
                className="w-full h-full object-cover rounded-[24px]"
                onClick={() => gotoNftDetailPage()}
                // loading="lazy"
                // onLoad={() => {
                //   setLoaded(true)
                // }}
              />
            ) : data.asset_type.includes('video') ? (
              <div className="w-full h-full relative flex justify-center items-center rounded-[10px] lg:rounded-[24px] overflow-hidden">
                {data.cover_image_url != null && data.cover_image_url !== '' ? (
                  <img
                    src={data.cover_image_url}
                    alt=""
                    className="w-full h-full object-cover"
                    onClick={() => gotoNftDetailPage()}
                    // loading="lazy"
                    // onLoad={() => {
                    //   setLoaded(true)
                    // }}
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
                  className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover"
                  onClick={() => gotoNftDetailPage()}
                  // loading="lazy"
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
      {data.artist_profile_picture && data.artist_profile_picture !== '' && data.artist_profile_picture !== undefined && (
        <div className={styles.avatarArea}>
          <div className={styles.avatar} onClick={() => gotoAristPage()}>
            {!profileLoaded && (
              <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
                <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={profileLoaded} color="#202427">
                  <div></div>
                </ReactPlaceholder>
              </div>
            )}
            <img
              src={
                data.artist_profile_picture &&
                data.artist_profile_picture !== '' &&
                data.artist_profile_picture !== undefined
                  ? data.artist_profile_picture
                  : '/images/avatar.png'
              }
              alt=""
              width={60}
              height={60}
              className="rounded-full"
              // loading="lazy"
              // onLoad={() => setProfileLoaded(true)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default HeroCardMobile

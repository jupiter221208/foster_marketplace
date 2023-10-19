import React, { useState } from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// styles
import styles from './index.module.scss'

// resources
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'

const StudioHeroCardMobile = props => {
  const { data } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const [profileLoaded, setProfileLoaded] = useState(false)
  const onClick = () => {}
  const [loaded, setLoaded] = useState(false)

  // const gotoAristPage = () => {
  //   dispatch({ type: 'set', isLoading: true })
  //   router.push(`/${data.artist_username}`)
  // }

  // const gotoNftDetailPage = () => {
  //   dispatch({ type: 'set', isLoading: true })
  //   router.push(`/nft/${data.token_id}`)
  // }

  return (
    <div className={styles.container}>
      <div className={styles.imageBG}>
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
              loading="lazy"
              onLoad={() => {
                setLoaded(true)
              }}
            />
          </div>
        </div>
      </div>
      {data.artist_profile_picture && data.artist_profile_picture !== '' && data.artist_profile_picture !== undefined && (
        <div className={styles.avatarArea}>
          <div className={styles.avatar}>
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
              loading="lazy"
              onLoad={() => setProfileLoaded(true)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default StudioHeroCardMobile

import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// styles
import styles from './index.module.scss'

// resources
import DefaultNftBG from 'assets/images/default-nft-bg.png'

const HeroCardMobile = props => {
  const { data } = props
  const router = useRouter()
  const dispatch = useDispatch()

  const onClick = () => {}

  const gotoAristPage = () => {
    dispatch({ type: 'set', isLoading: true })
    router.push(`/artist-profile?id=${data.artist_id}`)
  }

  const gotoNftDetailPage = () => {
    dispatch({ type: 'set', isLoading: true })
    router.push(`/browse-nft?id=${data.token_id}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageBG}>
        <Image
          src={
            data.asset_url !== '' && data.asset_url !== null && data.asset_url !== undefined
              ? data.asset_url
              : data.cover_image_url !== '' && data.cover_image_url !== null && data.cover_image_url !== undefined
              ? data.cover_image_url
              : '/images/banner.png'
          }
          alt=""
          width={375}
          height={375}
          className="w-full h-full object-cover"
        />
        <div className={styles.overlayMask} />
      </div>
      <div className="relative mt-[-175px] px-[15px] z-10">
        <div className={styles.imageArea}>
          <div className={styles.imageContent}>
            {data.asset_type.includes('image') ? (
              <Image
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
              />
            ) : data.asset_type.includes('video') ? (
              <div className="w-full h-full relative flex justify-center items-center rounded-[10px] lg:rounded-[24px] overflow-hidden">
                {data.cover_image_url != null && data.cover_image_url !== '' ? (
                  <Image
                    src={data.cover_image_url}
                    alt=""
                    layout="fill"
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
                  />
                )}
              </div>
            ) : data.asset_type.includes('audio') ? (
              data.cover_image_url !== null && data.cover_image_url !== '' ? (
                <Image
                  src={data.cover_image_url}
                  alt=""
                  layout="fill"
                  className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover"
                  onClick={() => gotoNftDetailPage()}
                />
              ) : (
                <Image
                  src={DefaultNftBG}
                  alt=""
                  layout="fill"
                  className="w-full h-full object-cover"
                  onClick={() => onClick()}
                />
              )
            ) : (
              <Image src={DefaultNftBG} alt="" layout="fill" className={styles.imageNft} onClick={() => onClick()} />
            )}
          </div>
        </div>
      </div>
      <div className={styles.avatarArea}>
        <div className={styles.avatar} onClick={() => gotoAristPage()}>
          <Image
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
          />
        </div>
      </div>
    </div>
  )
}

export default HeroCardMobile

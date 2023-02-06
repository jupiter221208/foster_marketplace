import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// resources
import DefaultNftBG from 'assets/images/default-nft-bg.png'

const HeroCard = props => {
  const { data } = props
  const viewport = useViewport()

  const onClick = () => {}

  return (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <div className={styles.imageContent}>
          {data.asset_type.includes('image') ? (
            <img
              src={
                data.asset_type.includes('image')
                  ? data.asset_url !== '' && data.asset_url !== null && data.asset_url !== undefined
                    ? data.asset_url
                    : '/images/banner.png'
                  : data.cover_image_url !== '' && data.cover_image_url !== null && data.cover_image_url !== undefined
                  ? data.cover_image_url
                  : '/images/banner.png'
              }
              alt=""
              width={550}
              height={772}
              className="w-full h-full object-cover rounded-[30px]"
            />
          ) : data.asset_type.includes('video') ? (
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full relative flex justify-center items-center rounded-[10px] lg:rounded-[24px] overflow-hidden">
                {data.cover_image_url != null && data.cover_image_url !== '' ? (
                  <img
                    src={data.cover_image_url}
                    alt=""
                    className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover"
                    onClick={() => onClick()}
                  />
                ) : (
                  <Image src={DefaultNftBG} alt="" className="w-full h-full object-cover" onClick={() => onClick()} />
                )}
              </div>
            ) : (
              <div
                className="w-full h-full object-cover"
                dangerouslySetInnerHTML={{
                  __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover rounded-[10px] lg:rounded-[24px] overflow-hidden">
              <source src=${data.asset_url} type="video/mp4" /></video>`,
                }}
                onClick={() => onClick()}
              />
            )
          ) : data.asset_type.includes('audio') ? (
            data.cover_image_url !== null && data.cover_image_url !== '' ? (
              <img
                src={data.cover_image_url}
                alt=""
                className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover"
                onClick={() => onClick()}
              />
            ) : (
              <Image src={DefaultNftBG} alt="" className="w-full h-full object-cover" onClick={() => onClick()} />
            )
          ) : (
            <Image src={DefaultNftBG} alt="" className={styles.imageNft} onClick={() => onClick()} />
          )}
        </div>
      </div>
      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        <div className={styles.avatarArea}>
          <div className={styles.avatar}>
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
            />
          </div>
        </div>
      ) : (
        <div className={styles.cardArea}>
          <div className="flex justify-between gap-[6px]">
            <div className="flex lg:hidden justify-start items-center lg:mt-[10px]">
              <div className={styles.avatar}>
                <img
                  src={
                    data.artist_profile_picture &&
                    data.artist_profile_picture !== '' &&
                    data.artist_profile_picture !== undefined
                      ? data.artist_profile_picture
                      : '/images/avatar.png'
                  }
                  alt=""
                  width={viewport === 'lg' ? 40 : 60}
                  height={viewport === 'lg' ? 40 : 60}
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="w-full block">
              <div className={styles.nftName}>{data.nft_name}</div>
              <div className={`flex ${styles.artistName}`}>{data.artist_username || 'Uknown Artist'}</div>
            </div>
            <div className="hidden lg:flex justify-start items-center lg:mt-[10px]">
              <div className={styles.avatar}>
                <img
                  src={
                    data.artist_profile_picture &&
                    data.artist_profile_picture !== '' &&
                    data.artist_profile_picture !== undefined
                      ? data.artist_profile_picture
                      : '/images/avatar.png'
                  }
                  alt=""
                  width={viewport === 'lg' ? 40 : 60}
                  height={viewport === 'lg' ? 40 : 60}
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HeroCard

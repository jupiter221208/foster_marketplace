import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// styles
import styles from './index.module.scss'

// resources
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import ReactPlaceholder from 'react-placeholder/lib'

const HeroCard = props => {
  const { data } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [loaded, setLoaded] = useState(false)

  const onClick = () => {}

  const gotoAristPage = () => {
    dispatch({ type: 'set', isLoading: true })
    router.push(`/${data.artist_username}`)
  }

  const gotoNftDetailPage = () => {
    dispatch({ type: 'set', isLoading: true })
    router.push(`/browse-nft?id=${data.token_id}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <div className={styles.imageContent}>
          {data.asset_type.includes('image') ? (
            <div className="w-full h-full" onClick={() => gotoNftDetailPage()}>
              {!loaded && (
                <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                  <div></div>
                </ReactPlaceholder>
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
                className="w-full h-full object-cover rounded-[24px]"
                onLoad={() => {
                  setLoaded(true)
                }}
                loading="lazy"
              />
            </div>
          ) : data.asset_type.includes('video') ? (
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full h-full relative flex justify-center items-center rounded-[10px] lg:rounded-[24px] overflow-hidden">
                {data.cover_image_url != null && data.cover_image_url !== '' ? (
                  <div className="w-full h-full" onClick={() => gotoNftDetailPage()}>
                    {!loaded && (
                      <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                        <div></div>
                      </ReactPlaceholder>
                    )}
                    <img
                      src={data.cover_image_url}
                      alt=""
                      className="w-full h-full object-cover"
                      onLoad={() => {
                        setLoaded(true)
                      }}
                      loading="lazy"
                    />
                  </div>
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
            ) : (
              <div
                className="w-full h-full object-cover"
                dangerouslySetInnerHTML={{
                  __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover rounded-[10px] lg:rounded-[24px] overflow-hidden">
              <source src=${data.asset_url} type="video/mp4" /></video>`,
                }}
                onClick={() => gotoNftDetailPage()}
              />
            )
          ) : data.asset_type.includes('audio') ? (
            data.cover_image_url !== null && data.cover_image_url !== '' ? (
              <div className="w-full h-full" onClick={() => gotoNftDetailPage()}>
                {!loaded && (
                  <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                    <div></div>
                  </ReactPlaceholder>
                )}
                <Image
                  src={data.cover_image_url}
                  alt=""
                  className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover"
                  onLoad={() => {
                    setLoaded(true)
                  }}
                  loading="lazy"
                />
              </div>
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
      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        <div className={styles.avatarArea}>
          <div className={styles.avatar} onClick={() => gotoAristPage()}>
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
              loading="lazy"
              className="rounded-full"
            />
          </div>
        </div>
      ) : (
        <div className={styles.cardArea}>
          <div className="flex justify-between gap-[6px]">
            <div className="w-full block">
              <div className={styles.nftName} onClick={() => gotoNftDetailPage()}>
                {data.nft_name}
              </div>
              <div className={`flex ${styles.artistName}`} onClick={() => gotoAristPage()}>
                {data.artist_username || 'Ecosystem Artist'}
              </div>
            </div>
            <div className="justify-start items-center lg:mt-[10px]">
              <div className={styles.avatar} onClick={() => gotoAristPage()}>
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
                  loading="lazy"
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

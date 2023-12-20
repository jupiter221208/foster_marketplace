import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'
import Link from 'next/link'

// custom functions
import { useViewport } from 'utils'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// styles
import styles from './index.module.scss'

// resources
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'
import Button from 'components/Button'

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
    router.push(`/nft/${data.token_id}`)
  }

  console.log(data)
  return (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <div className={styles.imageContent}>
          {data.asset_type.includes('image') ? (
            <div onClick={() => gotoNftDetailPage()}>
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
                className={`${styles.noSelect} w-full h-[418px] shadow-2xl object-contain`}
                onLoad={() => {
                  setLoaded(true)
                }}
                loading="lazy"
              />
            </div>
          ) : data.asset_type.includes('video') ? (
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full h-[418px] shadow-2xl overflow-hidden">
                {data.cover_image_url != null && data.cover_image_url !== '' ? (
                  <div className="w-full h-[418px] shadow-2xl" onClick={() => gotoNftDetailPage()}>
                    {!loaded && (
                      <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                        <div></div>
                      </ReactPlaceholder>
                    )}
                    <img
                      src={data.cover_image_url}
                      alt=""
                      className={`${styles.noSelect} w-full h-[418px] shadow-2xl object-contain`}
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
                    className={`${styles.noSelect} w-full h-[418px] shadow-2xl object-contain`}
                    onClick={() => onClick()}
                  />
                )}
              </div>
            ) : (
              <div
                className="w-full h-[418px] shadow-2xl object-contain"
                dangerouslySetInnerHTML={{
                  __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-[418px] shadow-2xl object-contain overflow-hidden">
              <source src=${data.asset_url} type="video/mp4" /></video>`,
                }}
                onClick={() => gotoNftDetailPage()}
              />
            )
          ) : data.asset_type.includes('audio') ? (
            data.cover_image_url !== null && data.cover_image_url !== '' ? (
              <div className="w-full h-[418px] shadow-2xl" onClick={() => gotoNftDetailPage()}>
                {!loaded && (
                  <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                    <div></div>
                  </ReactPlaceholder>
                )}
                <img
                  src={data.cover_image_url}
                  alt=""
                  className={`${styles.noSelect} w-full h-[418px] shadow-2xl object-contain`}
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
                className={`${styles.noSelect} w-full h-[418px] shadow-2xl object-contain`}
                onClick={() => onClick()}
              />
            )
          ) : (
            <Image
              src={DefaultNftBG}
              alt=""
              layout="fill"
              className={`${styles.imageNft} ${styles.noSelect}`}
              onClick={() => onClick()}
            />
          )}
        </div>
      </div>

      <div className={styles.infoBox}>
        <div className={styles.nftNames}>
          <p>{data.nft_name}</p>
          <p>
            Created by <span>artist_username</span>
          </p>
        </div>

        <div className="flex justify-between items-end">
          {data.artist_profile_picture &&
            data.artist_profile_picture !== '' &&
            data.artist_profile_picture !== undefined && (
              <div className={styles.avatar} onClick={() => gotoAristPage()}>
                <img
                  src={data.artist_profile_picture}
                  alt=""
                  className={`${styles.noSelect} rounded-full`}
                  loading="lazy"
                />
              </div>
            )}

          <div className={styles.btnBox}>
            <button>Visit Artist Profile</button>
            <button>View</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroCard

// link: <Link href={`${window.origin}/nft/${data.token_id}`} passHref></Link>

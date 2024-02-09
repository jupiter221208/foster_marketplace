import React, { useState } from 'react'

// next components
import Image from 'next/image'
import 'react-placeholder/lib/reactPlaceholder.css'
import Link from 'next/link'
import { getDisplayUserName } from 'utils/strings'

// custom functions
import { useViewport } from 'utils'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { useResizeDetector } from 'react-resize-detector'

// styles
import styles from './index.module.scss'

// resources
import SolanaIcon from 'assets/icons/solana-logo-dark.svg?component'
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import ReactPlaceholder from 'react-placeholder/lib'
import ModelViewer from 'components/ModelViewer'

const HeroCard = props => {
  const { data } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [loaded, setLoaded] = useState(false)
  const [profieLoaded, setProfieLoaded] = useState(false)
  const onClick = () => {}

  const gotoAristPage = () => {
    dispatch({ type: 'set', isLoading: true })
  }

  const gotoNftDetailPage = () => {
    dispatch({ type: 'set', isLoading: true })
  }

  const { width, height } = useResizeDetector()

  return (
    <div className={styles.container}>
      <div className="absolute w-full h-full flex items-center z-10 opacity-[25%]">
        <img
          src={
            data.asset_url !== '' && data.asset_url !== null && data.asset_url !== undefined
              ? data.asset_url
              : data.cover_image_url !== '' && data.cover_image_url !== null && data.cover_image_url !== undefined
              ? data.cover_image_url
              : ''
          }
          alt=""
          className="w-full object-cover"
          onLoad={() => {
            setLoaded(true)
          }}
          loading="lazy"
        />
      </div>

      <div className={styles.imageArea}>
        <div className={styles.imageContent}>
          {data.asset_type.includes('image') ? (
            <Link href={`/nft/${data.token_id}`} passHref>
              <a>
                <div className={styles.nftShadow} onClick={() => gotoNftDetailPage()}>
                  {data.asset_url! !== '' || data.cover_image_url! !== '' ? (
                    <img
                      src={
                        data.asset_url !== '' && data.asset_url !== null && data.asset_url !== undefined
                          ? data.asset_url
                          : data.cover_image_url !== '' &&
                            data.cover_image_url !== null &&
                            data.cover_image_url !== undefined
                          ? data.cover_image_url
                          : ''
                      }
                      alt=""
                      className={`${styles.noSelect} w-full xl:h-[418px] h-[300px] object-contain`}
                      onLoad={() => {
                        setLoaded(true)
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <div></div>
                  )}
                </div>
              </a>
            </Link>
          ) : data.asset_type.includes('vr') ? (
            <Link href={`/nft/${data.token_id}`} passHref>
              <a>
                <div className={styles.nftShadow} onClick={() => gotoNftDetailPage()}>
                  {data.asset_url! !== '' || data.cover_image_url! !== '' ? (
                    <div className="w-full h-full relative">
                      {/* <ModelViewer
                        path={data.asset_url ?? data.cover_image_url}
                        width={width}
                        height={height}
                        orbitLimited
                      /> */}
                      <img
                        src={data.cover_image_url}
                        alt=""
                        className={`${styles.noSelect} w-full xl:h-[418px] h-[300px] object-contain`}
                        onLoad={() => {
                          setLoaded(true)
                        }}
                        loading="lazy"
                      />
                      <div className="w-full h-full absolute inset-0" />
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </a>
            </Link>
          ) : data.asset_type.includes('video') ? (
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full xl:h-[418px] h-[300px] overflow-hidden">
                {data.cover_image_url != null && data.cover_image_url !== '' ? (
                  <Link href={`/nft/${data.token_id}`} passHref>
                    <a>
                      <div className="w-full xl:h-[418px] h-[300px] " onClick={() => gotoNftDetailPage()}>
                        {!loaded && (
                          <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                            <div></div>
                          </ReactPlaceholder>
                        )}
                        <img
                          src={data.cover_image_url}
                          alt=""
                          className={`${styles.noSelect} w-full xl:h-[418px] h-[300px] object-contain`}
                          onLoad={() => {
                            setLoaded(true)
                          }}
                          loading="lazy"
                        />
                      </div>
                    </a>
                  </Link>
                ) : (
                  <Image
                    src={DefaultNftBG}
                    alt=""
                    layout="fill"
                    className={`${styles.noSelect} w-full xl:h-[418px] h-[300px] object-contain`}
                    onClick={() => onClick()}
                  />
                )}
              </div>
            ) : (
              <Link href={`/nft/${data.token_id}`} passHref>
                <a>
                  <div
                    className="w-full xl:h-[418px] h-[300px] object-contain"
                    dangerouslySetInnerHTML={{
                      __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full xl:h-[418px] h-[300px] object-contain overflow-hidden">
              <source src=${data.asset_url} type="video/mp4" /></video>`,
                    }}
                    onClick={() => gotoNftDetailPage()}
                  />
                </a>
              </Link>
            )
          ) : data.asset_type.includes('audio') ? (
            data.cover_image_url !== null && data.cover_image_url !== '' ? (
              <Link href={`/nft/${data.token_id}`} passHref>
                <a>
                  <div className="w-full xl:h-[418px] h-[300px]" onClick={() => gotoNftDetailPage()}>
                    {!loaded && (
                      <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                        <div></div>
                      </ReactPlaceholder>
                    )}
                    <img
                      src={data.cover_image_url}
                      alt=""
                      className={`${styles.noSelect} w-full xl:h-[418px] h-[300px] object-contain`}
                      onLoad={() => {
                        setLoaded(true)
                      }}
                      loading="lazy"
                    />
                  </div>
                </a>
              </Link>
            ) : (
              <Image
                src={DefaultNftBG}
                alt=""
                layout="fill"
                className={`${styles.noSelect} w-full xl:h-[418px] h-[300px] object-contain`}
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
        <div className={styles.avatarArea}>
          {data.artist_profile_picture === null && (
            <div className={`${styles.skeletonLoader} w-[66px] h-[66px] rounded-full`}></div>
          )}
          {data.artist_profile_picture !== null && data.artist_profile_picture !== undefined && (
            <div className={styles.avatar} onClick={() => gotoAristPage()}>
              <Link href={`/${data.artist_username}`} passHref>
                <a>
                  <img
                    src={
                      data.artist_profile_picture.length > 0
                        ? data.artist_profile_picture
                        : 'images/dashboard-avatar.png'
                    }
                    alt=""
                    className={`${styles.noSelect} rounded-full`}
                    loading="lazy"
                    onLoad={() => {
                      setProfieLoaded(true)
                    }}
                  />
                </a>
              </Link>
            </div>
          )}
          <div className={styles.nftNames}>
            {data.nft_name === '' ? (
              <div className={`${styles.skeletonLoader} w-[600px] h-[60px] rounded-full`}></div>
            ) : (
              <Link href={`/nft/${data.token_id}`} passHref>
                <a>
                  <p>{data.nft_name}</p>
                </a>
              </Link>
            )}
            {data.nft_name === '' ? (
              <div className={`${styles.skeletonLoader} w-[300px] h-[26px] rounded-full mt-4`}></div>
            ) : (
              <p>
                <Link href={`/${data.artist_username}`} passHref>
                  <a>
                    <span>{getDisplayUserName(data.artist_username)}</span>
                  </a>
                </Link>
              </p>
            )}
          </div>
        </div>

        <div className="w-full flex justify-end">
          <div className="flex items-end">
            {data.artist_username === '' ? (
              <div className={`${styles.skeletonLoader} w-[270px] h-[40px] rounded-full`}></div>
            ) : (
              <div>
                <div className={styles.btnBox}>
                  <div className={styles.priceBox}>
                    <div className="mt-1">
                      <SolanaIcon alt="" />
                    </div>
                    <div className={styles.price}>{data.list_price}</div>
                  </div>

                  <Link href={`/${data.artist_username}`} passHref>
                    <a>
                      <div className={styles.firstBtn}>Artist Profile</div>
                    </a>
                  </Link>

                  <Link href={`/nft/${data.token_id}`} passHref>
                    <a>
                      <div className={styles.secondBtn}>View</div>
                    </a>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroCard

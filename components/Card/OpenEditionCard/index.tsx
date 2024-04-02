import React, { useState } from 'react'

// next components
import Image from 'next/image'
import 'react-placeholder/lib/reactPlaceholder.css'
import Link from 'next/link'
import { getDisplayUserName, getPriceValue } from 'utils/strings'

// custom functions
import { useViewport } from 'utils'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// styles
import styles from './index.module.scss'

// resources
import SolanaIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import ReactPlaceholder from 'react-placeholder/lib'

const OpenEditionCard = ({ data }) => {
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

  return (
    <div className={styles.container}>
      {/* <div className="absolute w-full h-full flex items-center z-10 opacity-[25%]">
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
      </div> */}

      <div className={styles.imageArea}>
        <div className={styles.imageContent}>
          {data.assetType.includes('image') ? (
            <Link href={`/nft/${data.tokenId}`} passHref>
              <a>
                <div className={styles.nftShadow} onClick={() => gotoNftDetailPage()}>
                  {data.assetUrl! !== '' || data.coverImageUrl! !== '' ? (
                    <img
                      src={
                        data.assetUrl !== '' && data.assetUrl !== null && data.assetUrl !== undefined
                          ? data.assetUrl
                          : data.coverImageUrl !== '' && data.coverImageUrl !== null && data.coverImageUrl !== undefined
                          ? data.coverImageUrl
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
          ) : data.assetType.includes('vr') ? (
            <Link href={`/nft/${data.tokenId}`} passHref>
              <a>
                <div className={styles.nftShadow} onClick={() => gotoNftDetailPage()}>
                  {data.assetUrl! !== '' || data.coverImageUrl! !== '' ? (
                    <div className="w-full h-full relative">
                      <img
                        src={data.coverImageUrl}
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
          ) : data.assetType.includes('video') ? (
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full xl:h-[418px] h-[300px] overflow-hidden">
                {data.coverImageUrl != null && data.coverImageUrl !== '' ? (
                  <Link href={`/nft/${data.tokenId}`} passHref>
                    <a>
                      <div className="w-full xl:h-[418px] h-[300px] " onClick={() => gotoNftDetailPage()}>
                        {!loaded && (
                          <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                            <div></div>
                          </ReactPlaceholder>
                        )}
                        <img
                          src={data.coverImageUrl}
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
              <Link href={`/nft/${data.tokenId}`} passHref>
                <a>
                  <div
                    className="w-full xl:h-[418px] h-[300px] object-contain"
                    dangerouslySetInnerHTML={{
                      __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full xl:h-[418px] h-[300px] object-contain overflow-hidden">
              <source src=${data.assetUrl} type="video/mp4" /></video>`,
                    }}
                    onClick={() => gotoNftDetailPage()}
                  />
                </a>
              </Link>
            )
          ) : data.assetType.includes('audio') ? (
            data.coverImageUrl !== null && data.coverImageUrl !== '' ? (
              <Link href={`/nft/${data.tokenId}`} passHref>
                <a>
                  <div className="w-full xl:h-[418px] h-[300px]" onClick={() => gotoNftDetailPage()}>
                    {!loaded && (
                      <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                        <div></div>
                      </ReactPlaceholder>
                    )}
                    <img
                      src={data.coverImageUrl}
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
          {data.artistProfilePicture === null && (
            <div className={`${styles.skeletonLoader} w-[66px] h-[66px] rounded-full`}></div>
          )}
          {data.artistProfilePicture !== null && data.artistProfilePicture !== undefined && (
            <div className={styles.avatar} onClick={() => gotoAristPage()}>
              <Link href={`/${data.artistUsername}`} passHref>
                <a>
                  <img
                    src={
                      data.artistProfilePicture.length > 0 ? data.artistProfilePicture : 'images/dashboard-avatar.png'
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
            {data.nftName === '' ? (
              <div className={`${styles.skeletonLoader} w-[600px] h-[60px] rounded-full`}></div>
            ) : (
              <Link href={`/nft/${data.tokenId}`} passHref>
                <a>
                  <p>{data.nftName}</p>
                </a>
              </Link>
            )}
            {data.nftName === '' ? (
              <div className={`${styles.skeletonLoader} w-[300px] h-[26px] rounded-full mt-4`}></div>
            ) : (
              <p>
                <Link href={`/${data.artistUsername}`} passHref>
                  <a>
                    <span>{getDisplayUserName(data.artistUsername)}</span>
                  </a>
                </Link>
              </p>
            )}
          </div>
        </div>

        <div className="w-full flex justify-between">
          <div>
            <div className={styles.priceLabel}>Open Edition</div>
            <div className="mt-[12px] mb-[24px]">
              <div className={styles.sold}>{data.currentSupply + ' sold'}</div>
            </div>

            <div className={styles.priceLabel}>Price</div>
            <div className="flex gap-[6px] mt-[12px] mb-[4px] items-center">
              <div className="">
                <SolanaIcon alt="" />
              </div>
              <div className={styles.price}>{getPriceValue(Number(data.price))}</div>
            </div>
          </div>

          <div className="flex items-end">
            <div>
              <div className={styles.btnBox}>
                <Link href={`/${data.artistUsername}`} passHref>
                  <a>
                    <div className={styles.firstBtn}>Artist Profile</div>
                  </a>
                </Link>

                <Link href={`/nft/${data.tokenId}`} passHref>
                  <a>
                    <div className={styles.secondBtn}>View</div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpenEditionCard

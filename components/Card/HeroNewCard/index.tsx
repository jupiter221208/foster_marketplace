import React, { useState } from 'react'

// next components
import Image from 'next/image'
import 'react-placeholder/lib/reactPlaceholder.css'
import Link from 'next/link'
import { getDisplayUserName } from 'utils/strings'

// custom functions
import { useDispatch } from 'react-redux'

// styles
import styles from './index.module.scss'

// resources
import SolanaIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import ImageWithFoster from 'components/ImageWithFoster'

const HeroNewCard = ({ data }) => {
  const dispatch = useDispatch()
  const onClick = () => {}

  const gotoAristPage = () => {
    dispatch({ type: 'set', isLoading: true })
  }

  const gotoNftDetailPage = () => {
    dispatch({ type: 'set', isLoading: true })
  }

  return (
    <div className={styles.container}>
      <ImageWithFoster
        src={data.asset_url}
        originalSrc={data.cover_image_url}
        showPlaceHolder={false}
        width={1280}
        className="w-full h-full inset-0"
      />
      <div className={styles.overlay} />
      <div className="g-container absolute inset-0 flex justify-center items-center">
        <div className={styles.cardArea}>
          <div className={styles.imageArea}>
            {data.asset_type.includes('image') ? (
              <Link href={`/nft/${data.token_id}`} passHref>
                <a>
                  <div className="w-full h-full flex justify-center" onClick={() => gotoNftDetailPage()}>
                    {data.asset_url! !== '' || data.cover_image_url! !== '' ? (
                      <ImageWithFoster
                        src={
                          data.asset_url !== '' && data.asset_url !== null && data.asset_url !== undefined
                            ? data.asset_url
                            : data.cover_image_url !== '' &&
                              data.cover_image_url !== null &&
                              data.cover_image_url !== undefined
                            ? data.cover_image_url
                            : ''
                        }
                        width={400}
                        height={400}
                        className="w-auto h-auto max-w-full max-h-full object-contain"
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
                        <ImageWithFoster
                          src={data.cover_image_url}
                          className="w-full h-full object-cover"
                          width={400}
                          height={400}
                        />
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </a>
              </Link>
            ) : data.asset_type.includes('video') ? (
              <Link href={`/nft/${data.token_id}`} passHref>
                <a>
                  <div
                    className="w-full h-full object-cover"
                    dangerouslySetInnerHTML={{
                      __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover overflow-hidden">
              <source src=${data.asset_url} type="video/mp4" /></video>`,
                    }}
                    onClick={() => gotoNftDetailPage()}
                  />
                </a>
              </Link>
            ) : data.asset_type.includes('audio') ? (
              data.cover_image_url !== null && data.cover_image_url !== '' ? (
                <Link href={`/nft/${data.token_id}`} passHref>
                  <a>
                    <div className="w-full h-full object-contain" onClick={() => gotoNftDetailPage()}>
                      <ImageWithFoster
                        src={data.cover_image_url}
                        className="w-full h-full object-contain"
                        width={400}
                        height={400}
                      />
                    </div>
                  </a>
                </Link>
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
      </div>
      <div className="g-container absolute w-full h-[100px] left-[0px] bottom-[18px] flex justify-between">
        <div className="flex items-center">
          <div className="ml-[10px] 2xl:ml-[18px]">
            {data.artist_profile_picture === null && (
              <div className={`${styles.skeletonLoader} w-[66px] h-[66px] rounded-full`}></div>
            )}
            {data.artist_profile_picture !== null && data.artist_profile_picture !== undefined && (
              <div className={styles.avatar} onClick={() => gotoAristPage()}>
                <Link href={`/${data.artist_username}`} passHref>
                  <a>
                    <ImageWithFoster
                      src={
                        data.artist_profile_picture.length > 0
                          ? data.artist_profile_picture
                          : 'images/dashboard-avatar.png'
                      }
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  </a>
                </Link>
              </div>
            )}
          </div>
          <div className={`${styles.nftNames} ml-[10px] 2xl:ml-[20px]`}>
            {data.nft_name === '' ? (
              <div className={`${styles.skeletonLoader} w-[200px] h-[24px] rounded-full`}></div>
            ) : (
              <Link href={`/nft/${data.token_id}`} passHref>
                <a>
                  <p className="min-w-max">{data.nft_name}</p>
                </a>
              </Link>
            )}
            {data.nft_name === '' ? (
              <div className={`${styles.skeletonLoader} w-[100px] h-[20px] rounded-full mt-4`}></div>
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
        <div className="h-full flex items-center">
          <div className={styles.listedFor}>Listed for</div>
          <div className="mt-1 ml-[9px]">
            <SolanaIcon alt="" />
          </div>
          <div className={`${styles.price} ml-[5px]`}>{data.list_price}</div>
        </div>
      </div>
    </div>
  )
}

export default HeroNewCard

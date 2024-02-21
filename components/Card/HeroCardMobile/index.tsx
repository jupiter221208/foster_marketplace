import React, { useState, useEffect } from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// styles
import styles from './index.module.scss'

// resources
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
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
        ) : data.asset_type.includes('video') || data.asset_type.includes('vr') ? (
          <Image
            src={
              data.cover_image_url !== '' && data.cover_image_url !== null && data.cover_image_url !== undefined
                ? data.cover_image_url
                : '/images/banner.png'
            }
            alt=""
            layout="fill"
          />
        ) : (
          <Image
            src={
              data.asset_url !== '' && data.asset_url !== null && data.asset_url !== undefined
                ? data.asset_url
                : data.cover_image_url !== '' && data.cover_image_url !== null && data.cover_image_url !== undefined
                ? data.cover_image_url
                : '/images/banner.png'
            }
            alt=""
            layout="fill"
            // style={{
            //   filter: 'blur(20px) opacity(0.2) brightness(110%)',
            //   WebkitFilter: 'blur(20px) opacity(0.2) brightness(110%)',
            // }}
          />
        )}
      </div>
      <div className="absolute top-[0px] left-[0px] right-[0px] bottom-[0px] z-10">
        <div className="px-[15px] mt-[120px] z-10">
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
              ) : data.asset_type.includes('image') ? (
                <Image
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
                  layout="fill"
                  objectFit="cover"
                  width={550}
                  height={772}
                  onClick={() => gotoNftDetailPage()}
                />
              ) : data.asset_type.includes('vr') ? (
                <div className={`relative aspect-square w-full h-full`}>
                  <Image
                    src={data.cover_image_url}
                    alt=""
                    layout="fill"
                    objectFit="cover"
                    width={550}
                    height={772}
                    onClick={() => gotoNftDetailPage()}
                  />
                </div>
              ) : data.asset_type.includes('video') ? (
                <div className="w-full h-full relative flex justify-center items-center overflow-hidden">
                  {data.cover_image_url != null && data.cover_image_url !== '' ? (
                    <Image
                      src={data.cover_image_url}
                      layout="fill"
                      objectFit="cover"
                      onClick={() => gotoNftDetailPage()}
                    />
                  ) : (
                    <Image
                      src={DefaultNftBG}
                      alt=""
                      layout="fill"
                      objectFit="cover"
                      onClick={() => onClick()}
                      onLoadingComplete={() => {
                        setLoaded(true)
                      }}
                    />
                  )}
                </div>
              ) : data.asset_type.includes('audio') ? (
                data.cover_image_url !== null && data.cover_image_url !== '' ? (
                  <Image
                    src={data.cover_image_url}
                    alt=""
                    layout="fill"
                    objectFit="cover"
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
        <div className="w-full flex justify-between h-[46px] mt-[11px] px-[38px]">
          <div className="mt-[2px]">
            <div className={styles.nftName}>{data.nft_name}</div>
            <div className={styles.creatorName}>{data.artist_username}</div>
          </div>
          {data.artist_profile_picture !== null && data.artist_profile_picture !== undefined && (
            <div className={styles.avatarArea} onClick={() => gotoAristPage()}>
              {!profileLoaded && (
                <div className="w-[44px] h-[44px] rounded-full overflow-hidden">
                  <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={profileLoaded} color="#202427">
                    <div></div>
                  </ReactPlaceholder>
                </div>
              )}
              <img
                src={
                  data.artist_profile_picture.length > 0 ? data.artist_profile_picture : 'images/dashboard-avatar.png'
                }
                alt=""
                width={44}
                height={44}
                className="rounded-full"
              />
            </div>
          )}
        </div>
        <div className={styles.listingArea}>
          <div className="ml-[24px]">
            <div className={styles.priceName}>Price</div>
            <div className="w-full flex gap-[7px] items-center mt-[">
              <SolanaLogoIcon alt="" />
              <div className={styles.priceValue}>{data.list_price}</div>
            </div>
          </div>
        </div>
        <div className={styles.bottomSection} />
      </div>
    </div>
  )
}

export default HeroCardMobile

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
import StudioHeroCard from 'assets/json/browse-nft/shop-apparel-list.json'

const StudioCard = props => {
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

  return (
    <div className={styles.container}>
      <Link href={`${window.origin}/nft/${data.token_id}`} passHref>
        <a>
          <div className={styles.imageArea}>
            <div className={styles.imageContent}>
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
                      : data.cover_image_url !== '' &&
                        data.cover_image_url !== null &&
                        data.cover_image_url !== undefined
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
            </div>
          </div>
        </a>
      </Link>
      {/* {data.artist_profile_picture && data.artist_profile_picture !== '' && data.artist_profile_picture !== undefined && (
        <div className={styles.cardArea}>
          <div className="flex justify-between gap-[6px]">
            <div className="w-full block">
              <div className={styles.nftName} onClick={() => gotoNftDetailPage()}>
                {data.nft_name}
              </div>
              <div className={`flex ${styles.artistName}`} onClick={() => gotoAristPage()}>
                {data.artist_username}
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
      )} */}
      <div className="absolute z-10 right-8 bottom-8 cursor-pointer">
        <div className="justify-start items-center lg:mt-[10px]">
          {data.artist_profile_picture &&
            data.artist_profile_picture !== '' &&
            data.artist_profile_picture !== undefined && (
              <div className={styles.avatar} onClick={() => gotoAristPage()}>
                <img
                  src={data.artist_profile_picture}
                  alt=""
                  width={viewport === 'lg' ? 40 : 60}
                  height={viewport === 'lg' ? 40 : 60}
                  className="rounded-full"
                  loading="lazy"
                />
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default StudioCard

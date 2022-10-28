import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'
import Avatar from 'components/Avatar'

const HeroCard = props => {
  const { data } = props
  const viewport = useViewport()

  return (
    <div className={styles.container}>
      {(viewport === 'xs' || viewport === 'sm' || viewport === 'md') && <div className={styles.topMask} />}
      <img
        src={
          data.asset_url !== '' && data.asset_url !== null && data.asset_url !== undefined
            ? data.asset_url
            : '/images/banner.png'
        }
        alt=""
        width={550}
        height={772}
        className="md:rounded-[10px] lg:rounded-[30px]"
      />
      <div className={styles.cardArea}>
        <div className="flex justify-between gap-[6px]">
          <div className="flex lg:hidden justify-start items-center lg:mt-[10px]">
            <div className={styles.avatar}>
              <img
                src={
                  data.artist_profile_picture !== null &&
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
            <div className={`flex ${styles.artistName}`}>{data.artist_username}</div>
          </div>
          <div className="hidden lg:flex justify-start items-center lg:mt-[10px]">
            <div className={styles.avatar}>
              <img
                src={
                  data.artist_profile_picture !== null &&
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
    </div>
  )
}

export default HeroCard

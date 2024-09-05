import React, { useState, useEffect } from 'react'

// next components
import Image from 'next/image'
import 'react-placeholder/lib/reactPlaceholder.css'
import Link from 'next/link'
import { getDisplayUserName, getPriceValue } from 'utils/strings'

// custom functions
import { useViewport } from 'utils'
import { useRouter } from 'next/router'

// styles
import styles from './index.module.scss'

// resources
import SolanaIcon from 'assets/icons/solana-logo-14x12.svg?component'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'
import ImageWithFoster from 'components/ImageWithFoster'

const StudioSeasonCard = ({ data }) => {
  const viewport = useViewport()
  const router = useRouter()
  const onClick = () => {}

  return (
    <div className={styles.container}>
      <div className={styles.imageArea}></div>

      <div className={styles.infoBox}>
        <div className={styles.avatarArea}>
          <div className={styles.avatar}>
            <Link href={`/${data.artistUsername}`} passHref>
              <a>
                <ImageWithFoster
                  src={data.artistProfilePicture ?? DefaultAvatar}
                  alt=""
                  className="w-full h-full rounded-full overflow-hidden"
                />
              </a>
            </Link>
          </div>

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
              <div className={styles.sol_icon_color}>
                <SolanaIcon alt="" />
              </div>
              <div className={styles.price}>{getPriceValue(Number(data.price))}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudioSeasonCard

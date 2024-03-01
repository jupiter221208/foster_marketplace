import React, { Suspense, useEffect, useState } from 'react'

import { useViewport } from 'utils'
import { useRouter } from 'next/router'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'

// components
import TabList from 'assets/json/browse-nft/auction-list.json'
import SelectedTab from 'components/Tab/SelectedTab'
import SmallCategoryChip from 'components/Chip/SmallCategoryChip'

// utilies
import { getDisplayUserName } from 'utils/strings'

// resources
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-small.svg?component'

// styles
import styles from './index.module.scss'
import Link from 'next/link'

const NFTActivityInfoSection = props => {
  const { activityList } = props
  const viewport = useViewport()
  const router = useRouter()
  const { solToUsdRate } = useSolToUsdRate()

  return (
    <div className={styles.activityContainer}>
      {activityList.map((item, index) => {
        let date = new Date(item.created_at)

        let dateString = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })

        let timeString = date
          .toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
          .replace(/:\d{2}\s/, ' ')

        let formattedDate = `${dateString} • ${timeString}`

        return (
          <div className={styles.subContainer} key={index}>
            <div className="w-full flex flex-col">
              {item.action_type === 'AuctionWon' ? (
                <div className={styles.actionType}>
                  <Link href={`/${item.reference_username}`} passHref>
                    <a>
                      <span className={styles.userName}>{getDisplayUserName(item.reference_username)}</span>
                    </a>
                  </Link>
                  <span>&nbsp;has won the auction</span>
                </div>
              ) : item.action_type === 'AuctionStarted' ? (
                <div className={styles.actionType}>
                  <Link href={`/${item.owner_username}`} passHref>
                    <a>
                      <span className={styles.userName}>{getDisplayUserName(item.owner_username)}</span>
                    </a>
                  </Link>
                  <span>&nbsp;published an auction</span>
                </div>
              ) : item.action_type === 'AuctionCancelled' ? (
                <div className={styles.actionType}>
                  <Link href={`/${item.owner_username}`} passHref>
                    <a>
                      <span className={styles.userName}>{getDisplayUserName(item.owner_username)}</span>
                    </a>
                  </Link>
                  <span>&nbsp;cancelled auction</span>
                </div>
              ) : item.action_type === 'ListingAdded' ? (
                <div className={styles.actionType}>
                  <Link href={`/${item.owner_username}`} passHref>
                    <a>
                      <span className={styles.userName}>{getDisplayUserName(item.owner_username)}</span>
                    </a>
                  </Link>
                  <span>&nbsp;listed artwork for sale</span>
                </div>
              ) : item.action_type === 'ListingUpdated' ? (
                <div className={styles.actionType}>
                  <Link href={`/${item.owner_username}`} passHref>
                    <a>
                      <span className={styles.userName}>{getDisplayUserName(item.owner_username)}</span>
                    </a>
                  </Link>
                  <span>&nbsp;updated listing</span>
                </div>
              ) : item.action_type === 'ListingCancelled' ? (
                <div className={styles.actionType}>
                  <Link href={`/${item.owner_username}`} passHref>
                    <a>
                      <span className={styles.userName}>{getDisplayUserName(item.owner_username)}</span>
                    </a>
                  </Link>
                  <span>&nbsp;removed listing</span>
                </div>
              ) : item.action_type === 'OfferCancelled' ? (
                <div className={styles.actionType}>
                  <Link href={`/${item.reference_username}`} passHref>
                    <a>
                      <span className={styles.userName}>{getDisplayUserName(item.reference_username)}</span>
                    </a>
                  </Link>
                  <span>&nbsp;cancelled their offer</span>
                </div>
              ) : item.action_type === 'OfferMade' ? (
                <div className={styles.actionType}>
                  <Link href={`/${item.reference_username}`} passHref>
                    <a>
                      <span className={styles.userName}>{getDisplayUserName(item.reference_username)}</span>
                    </a>
                  </Link>
                  <span>&nbsp;made an offer</span>
                </div>
              ) : item.action_type === 'BidPlaced' ? (
                <div className={styles.actionType}>
                  <Link href={`/${item.reference_username}`} passHref>
                    <a>
                      <span className={styles.userName}>{getDisplayUserName(item.reference_username)}</span>
                    </a>
                  </Link>
                  <span>&nbsp;placed a bid</span>
                </div>
              ) : item.action_type === 'QuickBuy' ? (
                <div className={styles.actionType}>
                  <Link href={`/${item.reference_username}`} passHref>
                    <a>
                      <span className={styles.userName}>{getDisplayUserName(item.reference_username)}</span>
                    </a>
                  </Link>
                  <span>&nbsp;purchased artwork</span>
                </div>
              ) : (
                ''
              )}
              <div className={styles.dateValue}>{formattedDate}</div>
            </div>
            <div className="w-fit-content flex flex-col">
              {item.action_type === 'ListingCancelled' ||
              item.action_type === 'OfferCancelled' ||
              item.action_type === 'AuctionCancelled' ? (
                <></>
              ) : (
                <>
                  <div className="w-fit-content h-4 lg:h-[25px] flex flex-row justify-end items-center">
                    {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                      <SolanaLogoMobileIcon alt="" />
                    ) : (
                      <SolanaLogoIcon className="mt-[2px]" alt="" />
                    )}
                    <div className={styles.userName}>&nbsp;{item.amount}</div>
                  </div>
                  <div className={styles.usdValue}>
                    ${item.amount === 0 ? '---' : (item.amount * solToUsdRate).toFixed(2)}
                  </div>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default NFTActivityInfoSection

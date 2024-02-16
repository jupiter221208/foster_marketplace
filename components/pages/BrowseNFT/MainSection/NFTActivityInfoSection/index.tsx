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

const NFTActivityInfoSection = props => {
  const { nftType, nftDescription, nftCategories, nftRoyalties, activityList, loadedActivity } = props
  const viewport = useViewport()
  const router = useRouter()
  const { solToUsdRate } = useSolToUsdRate()

  const [tabList, setTabList] = useState<any[]>(TabList)
  const [activeTab, setActiveTab] = useState<any>(0)

  useEffect(() => {
    let array: any[] = []
    TabList.map(item => {
      let object: any = item
      if (item.id === activeTab) {
        object.selected = true
      } else {
        object.selected = false
      }
      array.push(object)
    })
    setTabList(array)
  }, [activeTab])

  const handleSelectedTab = item => {
    setActiveTab(item.id)
  }

  return (
    <div>
      <div className={styles.activityContainer}>
        <div className={styles.selectedTab}>
          <SelectedTab
            tabList={tabList}
            onChange={item => handleSelectedTab(item)}
            type={
              nftType.includes('audio') && (viewport === 'lg' || viewport === 'xl' || viewport === '2xl')
                ? 'audio'
                : 'image'
            }
          />
        </div>
        <div
          className={`${styles.mainContainer} ${
            nftType.includes('audio') &&
            (viewport === 'lg' || viewport === 'xl' || viewport === '2xl') &&
            styles.audioNftDescBG
          }`}
        >
          {activeTab === 0 && (
            <div className="w-full flex flex-wrap flex-column space-between px-[35px] gap-6">
              {nftDescription ? (
                <div className={styles.whiteDescription}>{nftDescription}</div>
              ) : (
                <div className={styles.whiteDescription}>No description was detected for this artwork. </div>
              )}

              <div className="w-full flex justify-between gap-2 lg:gap-3 xl:gap-4">
                <div className="flex flex-wrap flex-col gap-2">
                  <div className={styles.categories}>Categories</div>
                  {nftCategories && nftCategories.length > 0 ? (
                    <div className="flex flex-row">
                      {nftCategories.map((item, index) => (
                        <SmallCategoryChip data={item} key={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-row">
                      <SmallCategoryChip data={['N/A']} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 text-center">
                  <div className={styles.whiteRoyalties}>Royalties</div>
                  <div className={styles.greenRoyalties}>{nftRoyalties}%</div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 1 &&
            activityList.map((item, index) => {
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
                        <span
                          className={styles.userName}
                          onClick={() => {
                            router.push(`/${item.reference_username}`)
                          }}
                        >
                          {getDisplayUserName(item.reference_username)}
                        </span>
                        <span>&nbsp;has won the auction</span>
                      </div>
                    ) : item.action_type === 'AuctionStarted' ? (
                      <div className={styles.actionType}>
                        <span
                          className={styles.userName}
                          onClick={() => {
                            router.push(`/${item.owner_username}`)
                          }}
                        >
                          {getDisplayUserName(item.owner_username)}
                        </span>
                        <span>&nbsp;published an auction</span>
                      </div>
                    ) : item.action_type === 'AuctionCancelled' ? (
                      <div className={styles.actionType}>
                        <span
                          className={styles.userName}
                          onClick={() => {
                            router.push(`/${item.owner_username}`)
                          }}
                        >
                          {getDisplayUserName(item.owner_username)}
                        </span>
                        <span>&nbsp;cancelled auction</span>
                      </div>
                    ) : item.action_type === 'ListingAdded' ? (
                      <div className={styles.actionType}>
                        <span
                          className={styles.userName}
                          onClick={() => {
                            router.push(`/${item.owner_username}`)
                          }}
                        >
                          {getDisplayUserName(item.owner_username)}
                        </span>
                        <span>&nbsp;listed artwork for sale</span>
                      </div>
                    ) : item.action_type === 'ListingUpdated' ? (
                      <div className={styles.actionType}>
                        <span
                          className={styles.userName}
                          onClick={() => {
                            router.push(`/${item.owner_username}`)
                          }}
                        >
                          {getDisplayUserName(item.owner_username)}
                        </span>
                        <span>&nbsp;updated listing</span>
                      </div>
                    ) : item.action_type === 'ListingCancelled' ? (
                      <div className={styles.actionType}>
                        <span
                          className={styles.userName}
                          onClick={() => {
                            router.push(`/${item.owner_username}`)
                          }}
                        >
                          {getDisplayUserName(item.owner_username)}
                        </span>
                        <span>&nbsp;removed listing</span>
                      </div>
                    ) : item.action_type === 'OfferCancelled' ? (
                      <div className={styles.actionType}>
                        <span
                          className={styles.userName}
                          onClick={() => {
                            router.push(`/${item.reference_username}`)
                          }}
                        >
                          {getDisplayUserName(item.reference_username)}
                        </span>
                        <span>&nbsp;cancelled their offer</span>
                      </div>
                    ) : item.action_type === 'OfferMade' ? (
                      <div className={styles.actionType}>
                        <span
                          className={styles.userName}
                          onClick={() => {
                            router.push(`/${item.reference_username}`)
                          }}
                        >
                          {getDisplayUserName(item.reference_username)}
                        </span>
                        <span>&nbsp;made an offer</span>
                      </div>
                    ) : item.action_type === 'BidPlaced' ? (
                      <div className={styles.actionType}>
                        <span
                          className={styles.userName}
                          onClick={() => {
                            router.push(`/${item.reference_username}`)
                          }}
                        >
                          {getDisplayUserName(item.reference_username)}
                        </span>
                        <span>&nbsp;placed a bid</span>
                      </div>
                    ) : item.action_type === 'QuickBuy' ? (
                      <div className={styles.actionType}>
                        <span
                          className={styles.userName}
                          onClick={() => {
                            router.push(`/${item.reference_username}`)
                          }}
                        >
                          {getDisplayUserName(item.reference_username)}
                        </span>
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
      </div>
    </div>
  )
}

export default NFTActivityInfoSection

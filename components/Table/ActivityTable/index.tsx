import React from 'react'
import { useDispatch } from 'react-redux'

// next components

// custom functions

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'

import { getDateString, getDisplayUserName } from 'utils/strings'
import { isBuyerExisting, isAmountExisting } from 'utils/activity.util'

// styles
import styles from './index.module.scss'
import { countDecimals, getBuyerName, getLocalDate, getOwnerName } from 'utils/helpers'
import ActivityTableItem from './ActivityTableItem'
import Link from 'next/link'
import { ActivityAPIData } from 'types/nft'

type ActivityTableTypes = {
  data: ActivityAPIData[]
  type: any
}

const ActivityTable = ({ data, type }: ActivityTableTypes) => {
  const getUserName = item => {
    let user = ''
    switch (item.action_type) {
      case 'AuctionStarted':
      case 'AuctionCancelled':
      case 'ListingAdded':
      case 'ListingCancelled':
      case 'MasterEditionListingCreated':
      case 'MasterEditionListingUpdated':
      case 'MasterEditionPrintCreated':
      case 'MasterEditionListingCancelled':
      case 'ListingUpdated':
        user = getOwnerName(item)
        break
      case 'OfferMade':
      case 'OfferCancelled':
      case 'QuickBuy':
      case 'AuctionWon':
      case 'BidPlaced':
        user = getBuyerName(item)
        break
    }
    return user
  }

  const getActionType = item => {
    let type = ''
    switch (item.action_type) {
      case 'AuctionStarted':
        type = 'published an auction'
        break
      case 'AuctionCancelled':
        type = 'canceled an auction for'
        break
      case 'ListingAdded':
        type = 'listed'
        break
      case 'ListingCancelled':
        type = 'canceled listing for'
        break
      case 'OfferMade':
        type = 'made an offer'
        break
      case 'OfferCancelled':
        type = 'canceled an offer for'
        break
      case 'QuickBuy':
        type = 'purchased'
        break
      case 'AuctionWon':
        type = 'won an auction'
        break
      case 'BidPlaced':
        type = 'placed a bid'
        break
      case 'MasterEditionListingCreated':
        type = 'published master edition'
        break
      case 'MasterEditionListingUpdated':
        type = 'updated listing master edition'
        break
      case 'MasterEditionPrintCreated':
        type = 'purchased edition'
        break
      case 'MasterEditionListingCancelled':
        type = 'removed listing'
        break
      case 'ListingUpdated':
        type = 'updated listing'
        break
    }
    return type
  }

  const getPrintAssetName = item => {
    let edition = item.asset_name.slice(item.asset_name.indexOf('#'))
    edition = edition.slice(0, edition.indexOf(', (#'))
    return edition + ' of ' + item.asset_name.slice(0, item.asset_name.indexOf('#'))
  }

  return (
    <div className="w-full mt-[60px]">
      <div className={styles.headerSection}>
        <div>Arwork</div>
        <div>Action</div>
      </div>

      {data.map((item, index) => (
        <div key={index} className={styles.row}>
          <div className="w-full flex justify-between">
            <div className="h-[70px] flex items-center gap-[15px]">
              <Link href={`/nft/${item.mint_address}`} passHref>
                <a>
                  <div className="w-[43px] h-[43px]">
                    <ActivityTableItem url={item.asset_url} />
                  </div>
                </a>
              </Link>
              <div className="">
                <div className="flex">
                  <Link href={`/${getUserName(item)}`} passHref>
                    <a>
                      <div className={styles.userName}>{getDisplayUserName(getUserName(item))}</div>
                    </a>
                  </Link>
                  <div className={styles.text}>&nbsp;{getActionType(item)}&nbsp;</div>
                  <div className="block">
                    <Link href={`/nft/${item.mint_address}`} passHref>
                      <a>
                        <div className={styles.nftName}>
                          {item.action_type === 'MasterEditionPrintCreated' ? getPrintAssetName(item) : item.asset_name}
                        </div>
                      </a>
                    </Link>
                  </div>
                  {isAmountExisting(item.action_type) && (
                    <>
                      <div className={styles.text}>&nbsp;for&nbsp;</div>
                      <div className="flex justify-center items-center">
                        {/* <SolanaLogoIcon /> */}
                        {countDecimals(parseFloat(item.amount)) > 2 ? parseFloat(item.amount).toFixed(2) : item.amount}
                        &nbsp;SOL
                      </div>
                    </>
                  )}
                </div>
                <div className={styles.date}>{getLocalDate(item.created_at)}</div>
              </div>
            </div>
            <div className={styles.view}>
              <Link href={`/nft/${item.mint_address}`} passHref>
                <a>View</a>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ActivityTable

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
import { useDispatch } from 'react-redux'
import { NftData } from 'types/nft'

type ActivityTableTypes = {
  data: NftData[]
  type: any
}

const ActivityTable = ({ data, type }: ActivityTableTypes) => {
  const dispatch = useDispatch()

  const getUserName = item => {
    let user = ''
    switch (item.action_type) {
      case 'AuctionStarted':
      case 'AuctionCancelled':
      case 'ListingAdded':
      case 'ListingCancelled':
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
    }
    return type
  }

  return (
    <table id="ArtworksTable" className="w-full table-auto">
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>
              <div className="flex justify-between">
                <div className="h-[90px] flex items-center ml-[35px]">
                  <Link href={`/nft/${item.mint_address}`} passHref>
                    <a>
                      <div className="w-[50px] h-[50px]">
                        <ActivityTableItem url={item.asset_url} />
                      </div>
                    </a>
                  </Link>
                  <div className="ml-[15px]">
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
                            <div className={styles.nftName}>{item.asset_name}</div>
                          </a>
                        </Link>
                      </div>
                      {isAmountExisting(item.action_type) && (
                        <>
                          <div className={styles.text}>&nbsp;for&nbsp;</div>
                          <div className="flex justify-center items-center gap-[5px]">
                            <SolanaLogoIcon />
                            {countDecimals(parseFloat(item.amount)) > 2
                              ? parseFloat(item.amount).toFixed(2)
                              : item.amount}
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ActivityTable

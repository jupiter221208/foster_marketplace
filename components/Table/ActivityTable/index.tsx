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

const ActivityTable = props => {
  const { data, type } = props
  const dispatch = useDispatch()

  const getUserName = item => {
    let user = ''
    switch (item.action_type) {
      case 'AuctionStarted':
      case 'AuctionCancelled':
      case 'ListingAdded':
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
        type = 'cancelled an auction'
        break
      case 'ListingAdded':
        type = 'listed'
        break
      case 'OfferMade':
        type = 'made an offer'
        break
      case 'OfferCancelled':
        type = 'cancelled an offer'
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
                    <Link href={`/${getBuyerName(item)}`} passHref>
                      <a>
                        <div className={styles.userName}>{getUserName(item)}</div>
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
                    <div className={styles.text}>&nbsp;for&nbsp;</div>
                    <div className="flex justify-center items-center gap-[5px]">
                      <SolanaLogoIcon />
                      {isAmountExisting(item.action_type)
                        ? countDecimals(parseFloat(item.amount)) > 2
                          ? parseFloat(item.amount).toFixed(2)
                          : item.amount
                        : 'N/A'}
                    </div>
                  </div>
                  <div className={styles.date}>{getLocalDate(item.create_at)}</div>
                </div>
              </div>
            </td>
            <td>
              <div className="block">
                <Link href={`/nft/${item.mint_address}`} passHref>
                  <a>
                    <div className={styles.nftName}>{item.asset_name}</div>
                  </a>
                </Link>
              </div>
            </td>
            <td className="text-center">{item.action_type.replace(/([A-Z])/g, ' $1').trim()}</td>
            <td className="text-center">{getDateString(item.created_at)}</td>
            <td className="text-center">
              <div className="flex justify-center items-center gap-[5px]">
                {/* <Image src={SolanaLogoIcon} width={20} height={20} alt="" /> */}
                <SolanaLogoIcon />
                {isAmountExisting(item.action_type)
                  ? countDecimals(parseFloat(item.amount)) > 2
                    ? parseFloat(item.amount).toFixed(2)
                    : item.amount
                  : 'N/A'}
              </div>
            </td>
            <td
              className="text-center cursor-pointer hover:underline"
              onClick={() => {
                if (isBuyerExisting(item.action_type)) {
                  dispatch({ type: 'set', isLoading: true })
                }
              }}
            >
              {isBuyerExisting(item.action_type) ? (
                <Link href={`/${getBuyerName(item)}`} passHref>
                  {getDisplayUserName(getBuyerName(item))}
                </Link>
              ) : (
                'N/A'
              )}
            </td>
            <td
              className="text-center cursor-pointer hover:underline"
              onClick={() => dispatch({ type: 'set', isLoading: true })}
            >
              <Link href={`/${getOwnerName(item)}`} passHref>
                {getDisplayUserName(getOwnerName(item))}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ActivityTable

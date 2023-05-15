import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'
import { useRouter } from 'next/router'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'

import { getDateString } from 'utils/strings'
import { isBuyerExisting, isAmountExisting } from 'utils/activity.util'

// styles
import styles from './index.module.scss'
import { countDecimals, getBuyerName, getOwnerName } from 'utils/helpers'
import ActivityTableItem from './ActivityTableItem'
import { useDispatch } from 'react-redux'

const ActivityTable = props => {
  const { data, type } = props
  const dispatch = useDispatch()
  const router = useRouter()

  const gotoUserDetail = link => {
    dispatch({ type: 'set', isLoading: true })
    router.push(`/${link.replaceAll(' ', '%20')}`)
  }

  return (
    <table id="ArtworksTable" className="w-full table-auto">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Type</th>
          {/* <th>Transaction ID</th> */}
          <th>Time</th>
          <th>Amount</th>
          {/* <th>Mint Address</th> */}
          <th>Buyer</th>
          <th>Seller</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>
              <div className="h-[90px] flex justify-center items-center">
                <div className="w-[60px] h-[60px]" onClick={() => router.push(`/browse-nft?id=${item.mint_address}`)}>
                  <ActivityTableItem url={item.asset_url} />
                </div>
              </div>
            </td>
            <td>
              <div className="block">
                <div className={styles.nftName} onClick={() => router.push(`/browse-nft?id=${item.mint_address}`)}>
                  {item.asset_name}
                </div>
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
                  gotoUserDetail(getBuyerName(item))
                }
              }}
            >
              {isBuyerExisting(item.action_type) ? getBuyerName(item) : 'N/A'}
            </td>
            <td
              className="text-center cursor-pointer hover:underline"
              onClick={() => gotoUserDetail(getOwnerName(item))}
            >
              {getOwnerName(item)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ActivityTable

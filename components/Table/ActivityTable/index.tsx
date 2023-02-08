import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'
import { useRouter } from 'next/router'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

import { getDateString } from 'utils/strings'
import { isBuyerExisting, isAmountExisting } from 'utils/activity.util'

// styles
import styles from './index.module.scss'
import { countDecimals } from 'utils/helpers'

const ActivityTable = props => {
  const { data, type } = props
  const viewport = useViewport()
  const router = useRouter()

  const getOwnerName = item => {
    if (item.owner_username !== null && item.owner_username.length > 0) {
      return item.owner_username
    }

    if (item.owner_address !== null && item.owner_address.length > 11) {
      return item.owner_address.slice(0, 5) + '...' + item.owner_address.slice(-3)
    }
    return 'N/A'
  }

  const getReferenceName = item => {
    if (item.reference_username !== null && item.reference_username.length > 0) {
      return item.reference_username
    }

    if (item.reference_address !== null && item.reference_address.length > 11) {
      return item.reference_address.slice(0, 5) + '...' + item.reference_address.slice(-3)
    }
    return 'N/A'
  }

  const getMinterName = item => {
    if (item.minter_username !== null && item.minter_username.length > 0) {
      return item.minter_username
    }

    if (item.minter_address !== null && item.minter_address.length > 11) {
      return item.minter_address.slice(0, 5) + '...' + item.minter_address.slice(-3)
    }
    return 'N/A'
  }

  return (
    <table id="ActivityTable" className="w-full table-auto">
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
            <td className="h-[90px] flex justify-center items-center">
              <div className="w-[60px] h-[60px]" onClick={() => router.push(`/browse-nft?id=${item.mint_address}`)}>
                <img
                  src={item.asset_url}
                  alt=""
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
                  className="w-full h-full object-cover rounded-[8px] cursor-pointer"
                />
              </div>
            </td>
            <td>
              <div className="block">
                <div className={styles.nftName} onClick={() => router.push(`/browse-nft?id=${item.mint_address}`)}>
                  {item.asset_name}
                </div>
                {/* <div className="flex justify-center">{item.name02}</div> */}
              </div>
            </td>
            <td className="text-center">{item.action_type.replace(/([A-Z])/g, ' $1').trim()}</td>
            {/* <td className="text-center">
              {item.transactionID.length > 11
                ? item.transactionID.slice(0, 5) + '...' + item.transactionID.slice(-3)
                : item.transactionID}
            </td> */}
            <td className="text-center">{getDateString(item.created_at)}</td>
            <td className="text-center">
              <div className="flex justify-center gap-[5px]">
                <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                {isAmountExisting(item.action_type)
                  ? countDecimals(parseFloat(item.amount)) > 2
                    ? parseFloat(item.amount).toFixed(2)
                    : item.amount
                  : 'N/A'}
              </div>
            </td>
            {/* <td className="text-center">{getMinterName(item)}</td> */}
            <td className="text-center">{isBuyerExisting(item.action_type) ? getReferenceName(item) : 'N/A'}</td>
            <td className="text-center">{getOwnerName(item)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ActivityTable

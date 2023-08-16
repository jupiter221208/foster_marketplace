import React, { useState } from 'react'

// next components
import Link from 'next/link'
import 'react-placeholder/lib/reactPlaceholder.css'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'

// styles
import styles from './index.module.scss'
import { getFirstUpperString, getLocalDate, getOwnerName } from 'utils/helpers'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

const MerchActivityTable = props => {
  const { data } = props
  const dispatch = useDispatch()
  const router = useRouter()

  const gotoUserDetail = link => {
    dispatch({ type: 'set', isLoading: true })
    router.push(`/${link}`)
  }

  return (
    <table id={'ArtworksTable'} className="w-full table-auto">
      <thead>
        <tr className={styles.tableHeader}>
          <th>Order Item</th>
          <th>Amount</th>
          <th>Transaction ID</th>
          <th>Date</th>
          <th>Creator</th>
          <th>Order Details</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          return (
            <tr key={index}>
              <td className="text-center">Short Sleeve: Mens / Unisex - Standard</td>
              <td className="text-center">
                <div className={`flex justify-center items-center gap-[5px]`}>
                  <SolanaLogoIcon />
                  {item.amount}
                </div>
              </td>
              <td className="text-center cursor-pointer" onClick={() => gotoUserDetail(getOwnerName(item))}>
                {getOwnerName(item)}
              </td>
              <td className="text-center">{getLocalDate(item.created_at)}</td>
              <td className="text-center">{getFirstUpperString(item.asset_name)}</td>
              <Link href={`merch-logs/${3345}`}>
                <td className={styles.viewOffer}>View Offer</td>
              </Link>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default MerchActivityTable

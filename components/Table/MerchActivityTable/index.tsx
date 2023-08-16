import React, { useState } from 'react'

// next components
import Link from 'next/link'
import 'react-placeholder/lib/reactPlaceholder.css'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'

// styles
import styles from './index.module.scss'
import { getLocalDateWithoutTime, getSliceAddress } from 'utils/helpers'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'

const MerchActivityTable = props => {
  const { data } = props
  const dispatch = useDispatch()
  const router = useRouter()
  const { solToUsdRate } = useSolToUsdRate()

  return (
    <table id={'ArtworksTable'} className="w-full table-auto">
      <thead>
        <tr className={styles.tableHeader}>
          <th>Order Item</th>
          <th>Amount</th>
          <th>Transaction ID</th>
          <th>Date</th>
          <th>Buyer</th>
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
                  {(item.amount / solToUsdRate).toFixed(2)}
                </div>
              </td>
              <td className="text-center">{getSliceAddress(item.transaction_id)}</td>
              <td className="text-center">{'08/16/2023'}</td>
              <td className="text-center">{'Buyer'}</td>
              <td
                className={styles.viewOrder}
                onClick={() => {
                  dispatch({ type: 'set', isLoading: true })
                  router.push(`merch-logs/${item.id}`)
                }}
              >
                View Order
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default MerchActivityTable

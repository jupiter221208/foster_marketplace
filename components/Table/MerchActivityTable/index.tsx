import React from 'react'

// next components
import Link from 'next/link'
import 'react-placeholder/lib/reactPlaceholder.css'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'

// styles
import styles from './index.module.scss'
import { getSliceAddress } from 'utils/helpers'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'
import { getExplorerUrl } from 'utils/explorer'
import { useConnection } from '@solana/wallet-adapter-react'

const MerchActivityTable = props => {
  const { data, type } = props
  const dispatch = useDispatch()
  const router = useRouter()
  const { connection } = useConnection()
  const { solToUsdRate } = useSolToUsdRate()

  return (
    <table id={'MerchTable'} className="w-full table-auto">
      <thead>
        <tr>
          <th>
            <div className={styles.tableHeader}>
              <div className="w-[15%] text-start">Order Number</div>
              <div className="w-[20%]">Amount</div>
              <div className="w-[25%]">Transaction ID</div>
              <div className="w-[25%]">{type === 'purchases' ? 'Creator' : 'Seller'}</div>
              <div className="w-[15%]">Order Details</div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => {
          return (
            <div key={item.id}>
              <div className="w-full">
                <div className={styles.tableRow}>
                  <div className="w-[15%]">{item.id}</div>
                  <div className="w-[20%] flex justify-center items-center gap-[5px]">
                    <SolanaLogoIcon />
                    {(item.amount / solToUsdRate).toFixed(2)}
                  </div>
                  <div
                    className={`w-[25%] ${styles.transactionId} `}
                    onClick={() => window.open(getExplorerUrl(connection.rpcEndpoint, item.transaction_id, 'tx'))}
                  >
                    {getSliceAddress(item.transaction_id)}
                  </div>
                  <div className="w-[25%] text-center ">{getSliceAddress(item.creator)}</div>
                  <div
                    className={`${styles.viewOrder} w-[15%]`}
                    onClick={() => {
                      dispatch({ type: 'set', orderType: type })
                      router.push(`merch-logs/${item.id}`)
                    }}
                  >
                    View Order
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </tbody>
    </table>
  )
}

export default MerchActivityTable

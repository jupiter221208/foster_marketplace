import React from 'react'
import { useRouter } from 'next/router'

// next components

// styles
import styles from './index.module.scss'
import MerchNftItem from 'components/Card/MerchNftItem'

const MerchNftTable = props => {
  const { data, type, action } = props
  const router = useRouter()

  return (
    <table id={'MerchTable'} className="w-full table-auto">
      <thead>
        <tr>
          <th>
            <div className={styles.tableHeader}>
              <div className="w-[90%] text-start">Artwork</div>
              <div className="w-[10%]">Action</div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => {
          return (
            <div key={item.token_id}>
              <div className="w-full">
                <div className={styles.tableRow}>
                  <div className="w-[90%] flex items-center" onClick={() => router.push(`/nft/${item.token_id}`)}>
                    <div className="w-[45px] h-[45px] rounded-[8px] overflow-hidden">
                      <MerchNftItem url={item.asset_url} />
                    </div>
                    <div className={styles.itemName}>{item.nft_name}</div>
                  </div>
                  <div className="w-[10%] flex justify-center">
                    <div className={styles.button} onClick={() => action(item.token_id)}>
                      {type ? 'Disable' : 'Enable'}
                    </div>
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

export default MerchNftTable

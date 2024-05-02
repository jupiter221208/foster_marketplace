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
      <tbody>
        {data.map(item => {
          return (
            <tr key={item.token_id}>
              <td className="pt-[10px] pb-[10px]">
                <div className={styles.tableRow}>
                  <div className="w-full flex items-center" onClick={() => router.push(`/nft/${item.token_id}`)}>
                    <div className="w-[45px] h-[45px] rounded-[8px] overflow-hidden">
                      <MerchNftItem url={item.asset_url} />
                    </div>
                    <div className={styles.itemName}>{item.nft_name}</div>
                  </div>
                  <div className={styles.button} onClick={() => action(item.token_id)}>
                    {type === 'enabled' ? 'Disable' : 'Enable'}
                  </div>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default MerchNftTable

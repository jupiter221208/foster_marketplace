import React from 'react'

// next components
import 'react-placeholder/lib/reactPlaceholder.css'

// styles
import styles from './index.module.scss'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import GradientButton from 'components/Button/GradientButton'

const MerchNftTable = props => {
  const { data, type, action } = props
  const dispatch = useDispatch()
  const router = useRouter()

  return (
    <table id={'ArtworksTable'} className="w-full table-auto">
      <thead>
        <tr className={styles.tableHeader}>
          <th className="w-[80%] text-start">
            <div className="ml-3">Artwork</div>
          </th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          return (
            <tr key={index}>
              <td className="flex items-center">
                <img src={item.asset_url} className="w-[70px] h-[70px] rounded-[15px]" alt="" />
                <div className={styles.itemName}>{item.nft_name}</div>
              </td>
              <td>
                <GradientButton
                  width={138}
                  height={48}
                  label={type === 'enabled' ? 'Disable' : 'Enable'}
                  onClick={() => action(item.token_id)}
                />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default MerchNftTable

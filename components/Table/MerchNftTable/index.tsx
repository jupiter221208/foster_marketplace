import React, { useState } from 'react'

// next components

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import MerchNftItem from 'components/Card/MerchNftItem'

const MerchNftTable = props => {
  const { data, type, action } = props

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
                <div className="w-[70px] h-[70px] rounded-[15px] overflow-hidden">
                  <MerchNftItem width={70} height={70} url={item.asset_url} />
                </div>

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

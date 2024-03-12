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
          <th className="text-start">
            <div className="ml-3">Artwork</div>
          </th>
          <th className="w-[250px]">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => {
          return (
            <tr key={item.token_id}>
              <td className="">
                <div className="flex items-center">
                  <div className="w-[45px] h-[45px] rounded-[8px] overflow-hidden">
                    <MerchNftItem url={item.asset_url} />
                  </div>
                  <div className={styles.itemName}>{item.nft_name}</div>
                </div>
              </td>
              <td>
                <div className="flex justify-center">
                  <GradientButton
                    width={138}
                    height={48}
                    label={type === 'enabled' ? 'Disable' : 'Enable'}
                    onClick={() => action(item.token_id)}
                  />
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

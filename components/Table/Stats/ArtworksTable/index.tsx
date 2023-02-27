import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'
import { getBuyerName, getLocalDate, getOwnerName } from 'utils/helpers'

const ArtworksTable = props => {
  const { data } = props
  const viewport = useViewport()

  return (
    <table id="ArtworksTable" className="w-full table-auto">
      <thead>
        <tr className={styles.tableHeader}>
          <th className="w-[20%] text-start">
            <div className="ml-3">Artwork</div>
          </th>
          <th>Sale Price</th>
          <th>Method of Sale</th>
          <th>Date</th>
          <th>Creator</th>
          <th>Collector</th>
          <th>Market</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          return (
            <tr key={index}>
              <td>
                <div className="flex gap-2 mx-3 items-center">
                  <div className="min-w-[38px] w-[38x]">
                    <Image src={item.asset_url} alt="" width={38} height={38} className="rounded-[8px]" />
                  </div>
                  <div className="flex justify-center">{item.asset_name}</div>
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center gap-[5px]`}>
                  <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                  {item.amount}
                </div>
              </td>
              <td className="text-center">{item.action_type}</td>
              <td className="text-center">{getLocalDate(item.created_at)}</td>
              <td className="text-center">{getOwnerName(item)}</td>
              <td className="text-center">{getBuyerName(item)}</td>
              <td className="text-center">{item.market}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default ArtworksTable

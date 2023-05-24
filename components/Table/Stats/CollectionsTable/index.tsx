import React from 'react'

// next components
import Image from 'next/image'

// functions
import { getPercentValue } from 'utils/strings'
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'

// styles
import styles from './index.module.scss'

const CollectionsTable = props => {
  const { data } = props
  const viewport = useViewport()

  return (
    <table id="ArtworksTable" className="w-full table-auto">
      <thead>
        <tr>
          <th className="w-[20%] text-start">
            <div className="ml-3">Collection</div>
          </th>
          <th>Total Sales</th>
          <th>Floor Price</th>
          <th>Average Sale</th>
          <th>Highest Sale</th>
          <th>Creator</th>
          <th>Unique Holders</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          return (
            <tr key={index}>
              <td>
                <div className="flex gap-2 mx-3 items-center">
                  <div className="min-w-[38px] w-[38x]">
                    <Image src={item.rankImage} alt="" width={38} height={38} className="rounded-[8px]" />
                  </div>
                  <div className="flex justify-center">{item.collectionName01}</div>
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center items-center gap-[5px] ${styles.priceText}`}>
                  <SolanaLogoIcon alt="" />
                  {item.totalSale.toFixed(2)}
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center items-center gap-[5px] ${styles.priceText}`}>
                  <SolanaLogoIcon alt="" />
                  {item.floorPrice.toFixed(2)}
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center items-center gap-[5px] ${styles.priceText}`}>
                  <SolanaLogoIcon alt="" />
                  {item.averagePrice.toFixed(2)}
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center items-center gap-[5px] ${styles.priceText}`}>
                  <SolanaLogoIcon alt="" />
                  {item.highestSale.toFixed(2)}
                </div>
              </td>
              <td className="text-center">{item.collectors}</td>
              <td className="text-center">{item.nftsSold}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default CollectionsTable

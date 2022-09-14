import React from 'react'

// next components
import Image from 'next/image'

// functions
import { getPercentValue } from 'utils/strings'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const CollectionsTable = props => {
  const { data, viewport } = props

  return (
    <table id="ArtworksTable" className="w-full table-auto">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Collection</th>
          <th>Total Sale</th>
          <th>% Volume</th>
          <th>Floor Price</th>
          <th>Average Price</th>
          <th>Highest Sale</th>
          <th>Collectors</th>
          <th>NFTs Sold</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          return (
            <tr key={index}>
              <td className="h-[90px] flex justify-center items-center gap-[21px]">
                <div>{item.rank}</div>
                <Image
                  src={item.rankImage}
                  alt=""
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
                  className="rounded-[15px]"
                />
              </td>
              <td>
                <div className="block">
                  <div className="flex justify-center">{item.collectionName01}</div>
                  <div className="flex justify-center">{item.collectionName02}</div>
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center gap-[5px] ${styles.brand03Text}`}>
                  <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                  {item.totalSale.toFixed(2)}
                </div>
              </td>
              <td className={`text-center ${styles.greenText}`}>{getPercentValue(item.volume)}</td>
              <td className="text-center">
                <div className={`flex justify-center gap-[5px] ${styles.brand03Text}`}>
                  <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                  {item.floorPrice.toFixed(2)}
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center gap-[5px] ${styles.brand03Text}`}>
                  <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                  {item.averagePrice.toFixed(2)}
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center gap-[5px] ${styles.brand03Text}`}>
                  <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
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

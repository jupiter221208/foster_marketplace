import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const CollectorsTable = props => {
  const { data } = props
  const viewport = useViewport()

  return (
    <table id="ArtworksTable" className="w-full table-auto">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Collector</th>
          <th>Creators Supported</th>
          <th>Total Spent</th>
          <th>Average Purchase</th>
          <th>Highest Purchase</th>
          <th>Unique Collections</th>
          <th>Collected</th>
          <th>Connections</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          return (
            <tr key={index}>
              <td className="h-[90px] flex justify-center items-center gap-[21px]">
                <div className={styles.avatarArea}>
                  <Image src={item.rankImage} alt="" width={36} height={36} className="rounded-full" />
                </div>
              </td>
              <td>
                <div className="block">
                  <div className="flex justify-center">{item.collectorName01}</div>
                </div>
              </td>
              <td className="text-center">{item.creatorSupported}</td>
              <td className="text-center">
                <div className={`flex justify-center gap-[5px] ${styles.brand03Text}`}>
                  <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                  {item.totalSpent.toFixed(2)}
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center gap-[5px] ${styles.brand03Text}`}>
                  <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                  {item.averagePurchase.toFixed(2)}
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center gap-[5px] ${styles.brand03Text}`}>
                  <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                  {item.highestPurchase.toFixed(2)}
                </div>
              </td>
              <td className="text-center">{item.uniqueCollections}</td>
              <td className="text-center">{item.collected}</td>
              <td className="text-center">{item.connections}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default CollectorsTable

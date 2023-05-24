import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'

// styles
import styles from './index.module.scss'

const CollectorsTable = props => {
  const { data } = props
  const viewport = useViewport()
  return (
    <table id="ArtworksTable" className="w-full table-auto">
      <thead>
        <tr>
          <th className="w-[20%] text-start">
            <div className="ml-3">Collector</div>
          </th>
          <th>Items Collected</th>
          <th>Purchase Volume</th>
          <th>Highest Purchase</th>
          <th>Favorite Category</th>
          <th>Creators Supported</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          return (
            <tr key={index}>
              <td>
                <div className="flex gap-2 mx-3 items-center">
                  <div className={styles.avatarArea}>
                    <div className="w-[36px] h-[36px] rounded-[18px] overflow-hidden">
                      <Image src={item.asset_url} alt="" width={36} height={36} className="rounded-[8px]" />
                    </div>
                  </div>
                  <div className="flex justify-center cursor-pointer" onClick={() => {}}>
                    {item.collectorName01}
                  </div>
                </div>
              </td>
              <td className="text-center">{item.collected}</td>
              <td className="text-center">
                <div className={`flex justify-center items-center gap-[5px] ${styles.priceText}`}>
                  <SolanaLogoIcon />
                  {item.volume.toFixed(2)}
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center items-center gap-[5px] ${styles.priceText}`}>
                  <SolanaLogoIcon />
                  {item.highestPurchase.toFixed(2)}
                </div>
              </td>
              <td className="text-center">{item.categories}</td>
              <td className="text-center">{item.creatorSupported}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default CollectorsTable

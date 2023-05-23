import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'

// styles
import styles from './index.module.scss'

const CreatorsTable = props => {
  const { data } = props
  const viewport = useViewport()

  return (
    <table id="ArtworksTable" className="w-full table-auto">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Artist</th>
          <th>Unique Collectors</th>
          <th>Visitors</th>
          <th>Total Sales</th>
          <th>Connections</th>
          <th>Collections</th>
          <th>Created</th>
          <th>Sold</th>
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
                  <div className="flex justify-center">{item.artistName01}</div>
                </div>
              </td>
              <td className="text-center">{item.uniqueCollectors}</td>
              <td className="text-center">{item.visitors}</td>
              <td className="text-center">
                <div className={`flex justify-center items-center gap-[5px] ${styles.priceText}`}>
                  <SolanaLogoIcon />
                  {/* <Image src={SolanaLogoIcon} width={20} height={20} alt="" /> */}
                  {item.totalSales.toFixed(2)}
                </div>
              </td>
              <td className="text-center">{item.connections}</td>
              <td className="text-center">{item.collections}</td>
              <td className="text-center">{item.created}</td>
              <td className="text-center">{item.sold}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default CreatorsTable

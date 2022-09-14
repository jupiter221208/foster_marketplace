import React from 'react'

// next components
import Image from 'next/image'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const MarketplacesTable = props => {
  const { data, viewport } = props

  return (
    <table id="ArtworksTable" className="w-full table-auto">
      <thead>
        <tr>
          <th className="flex justify-start items-center">
            <div style={{ marginLeft: '30px' }}>Category</div>
          </th>
          <th>Total Volume</th>
          <th>Transactions</th>
          <th>Active Listings</th>
          <th>Single Mints</th>
          <th>Collections</th>
          <th>Creators</th>
          <th>Collectors</th>
          <th>% Volume</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          return (
            <tr key={index}>
              <td className="h-[90px] flex justify-start items-center gap-[21px]">
                <div className="w-[10px]"></div>
                <Image
                  src={item.category[0].icon}
                  alt=""
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
                  className="rounded-[15px]"
                />
                <div>{item.category[0].name}</div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center gap-[5px] ${styles.brand03Text}`}>
                  <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                  {item.totalValue}
                </div>
              </td>
              <td>
                <div className="block">
                  <div className="flex justify-center">{item.transactions}</div>
                </div>
              </td>
              <td className="text-center">{item.activeListings}</td>
              <td className="text-center">{item.singleMints}</td>
              <td className="text-center">{item.collections}</td>
              <td className="text-center">{item.creators}</td>
              <td className="text-center">{item.collectors}</td>
              <td className={`text-center ${styles.brand06Text}`}>{item.volume}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default MarketplacesTable

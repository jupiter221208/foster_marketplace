import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'
import ThreeDotWhiteIcon from 'assets/icons/three-dot-white.svg'

// functions
import { getPercentValue } from 'utils/strings'

// styles
import styles from './index.module.scss'

const MarketplacesTable = props => {
  const { data } = props
  const viewport = useViewport()

  const router = useRouter()

  const [hover, setHover] = useState(-1)

  const handleSetHover = index => {
    setHover(index)
  }

  const handleClick = item => {
    router.push(`/stats/view-chart?id=${item.id}`)
  }

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
          <th>Primary</th>
          <th>Secondary</th>
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
                  {item.totalVolume}
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
              <td className="text-center">
                <div className={`flex justify-center gap-[5px] ${styles.brand03Text}`}>
                  <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                  {item.primary}
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center gap-[5px] ${styles.brand03Text}`}>
                  <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                  {item.secondary}
                </div>
              </td>
              <td className={`text-center ${styles.greenText}`} onMouseEnter={() => handleSetHover(index)}>
                {hover === index ? (
                  <button className={styles.button} onClick={() => handleClick(item)}>
                    View Chart
                  </button>
                ) : (
                  <div className="w-full flex justify-center items-center">
                    <div className="w-[150px] h-[60px] flex justify-center items-center gap-8 cursor-pointer">
                      <div className={styles.greenText}>{getPercentValue(item.volume)}</div>
                      <Image src={ThreeDotWhiteIcon} alt="" />
                    </div>
                  </div>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default MarketplacesTable

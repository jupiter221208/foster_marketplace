import React from 'react'

// next components
import Image from 'next/image'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const ArtworksTable = props => {
  const { data, viewport } = props
  console.log('data', data)

  return (
    <table id="ArtworksTable" className="w-full table-auto">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Artwork</th>
          <th>Sale Price</th>
          <th>Category</th>
          <th>Views</th>
          <th>Shares</th>
          <th>Likes</th>
          <th>Saves</th>
          <th>Offers</th>
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
                  <div className="flex justify-center">{item.artworkName01}</div>
                  <div className="flex justify-center">{item.artworkName02}</div>
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center gap-[5px] ${styles.brand03Text}`}>
                  <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                  {item.salePrice.toFixed(2)}
                </div>
              </td>
              <td className={`text-center ${styles.brand06Text}`}>{item.category[0]?.name}</td>
              <td className="text-center">{item.views}</td>
              <td className="text-center">{item.shares}</td>
              <td className="text-center">{item.likes}</td>
              <td className="text-center">{item.saves}</td>
              <td className="text-center">{item.offers}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default ArtworksTable

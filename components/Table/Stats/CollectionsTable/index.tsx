import React from 'react'
import { useRouter } from 'next/router'

// next components
import Image from 'next/image'

// functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'

// styles
import styles from './index.module.scss'

const CollectionsTable = props => {
  const { data } = props
  const viewport = useViewport()
  const router = useRouter()

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
                    <Image
                      src={item.cover_image !== null && item.cover_image !== '' ? item.cover_image : DefaultAvatar}
                      alt=""
                      width={38}
                      height={38}
                      className="rounded-[8px]"
                    />
                  </div>
                  <div
                    className="flex justify-center"
                    onClick={() => router.push(`/browse-collection/${item.collection_address}`)}
                  >
                    {item.collection_name}
                  </div>
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center items-center gap-[5px] ${styles.priceText}`}>
                  <SolanaLogoIcon alt="" />
                  {item.total_sales.toFixed(2)}
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center items-center gap-[5px] ${styles.priceText}`}>
                  <SolanaLogoIcon alt="" />
                  {item.floor_price.toFixed(2)}
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center items-center gap-[5px] ${styles.priceText}`}>
                  <SolanaLogoIcon alt="" />
                  {item.average_sale.toFixed(2)}
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center items-center gap-[5px] ${styles.priceText}`}>
                  <SolanaLogoIcon alt="" />
                  {item.highest_sale.toFixed(2)}
                </div>
              </td>
              <td className="text-center">{item.creator_username}</td>
              <td className="text-center">{item.unique_holders}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default CollectionsTable

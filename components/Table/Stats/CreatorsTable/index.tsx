import React from 'react'

// next components
import Image from 'next/image'

// custom functions

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'

// styles
import styles from './index.module.scss'

const CreatorsTable = props => {
  const { data } = props

  return (
    <table id="ArtworksTable" className="w-full table-auto">
      <thead>
        <tr>
          <th className="w-[20%] text-start">
            <div className="ml-3">Creator</div>
          </th>
          <th>Unique Collectors</th>
          <th>Total Sales</th>
          <th>Highest Sale</th>
          <th>Collections Published</th>
          <th>Items Created</th>
          <th>Items Sold</th>
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
                      <Image
                        src={item.pfp_url !== null && item.pfp_url !== '' ? item.pfp_url : DefaultAvatar}
                        alt=""
                        width={36}
                        height={36}
                        className="rounded-[8px]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center cursor-pointer" onClick={() => {}}>
                    {item.creator_name}
                  </div>
                </div>
              </td>
              <td className="text-center">{item.unique_collectors}</td>
              <td className="text-center">
                <div className={`flex justify-center items-center gap-[5px] ${styles.priceText}`}>
                  <SolanaLogoIcon />
                  {item.total_sales}
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center items-center gap-[5px] ${styles.priceText}`}>
                  <SolanaLogoIcon />
                  {item.highest_sale}
                </div>
              </td>
              <td className="text-center">{item.collection_published}</td>
              <td className="text-center">{item.items_created}</td>
              <td className="text-center">{item.items_sold}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default CreatorsTable

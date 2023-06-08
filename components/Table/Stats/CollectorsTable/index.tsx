import React from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'

// styles
import styles from './index.module.scss'

const CollectorsTable = props => {
  const { data } = props
  const viewport = useViewport()
  const dispatch = useDispatch()
  const router = useRouter()

  return (
    <table id="ArtworksTable" className="w-full table-auto">
      <thead>
        <tr>
          <th className="w-[20%] text-start">
            <div className="ml-3">Collector</div>
          </th>
          <th>Purchase Volume</th>
          <th>Highest Purchase</th>
          <th>Favorite Category</th>
          <th>Items Collected</th>
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
                      <Image
                        src={item.pfp_url !== null && item.pfp_url !== '' ? item.pfp_url : DefaultAvatar}
                        alt=""
                        width={36}
                        height={36}
                        className="rounded-[8px]"
                      />
                    </div>
                  </div>
                  <div
                    className="flex justify-center cursor-pointer"
                    onClick={() => {
                      dispatch({ type: 'set', isLoading: true })
                      router.push(`/${item.collector_name}`)
                    }}
                  >
                    {item.collector_name}
                  </div>
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center items-center gap-[5px] ${styles.priceText}`}>
                  <SolanaLogoIcon />
                  {parseFloat(item.purchase_volume).toFixed(2)}
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center items-center gap-[5px] ${styles.priceText}`}>
                  <SolanaLogoIcon />
                  {item.highest_purchase}
                </div>
              </td>
              <td
                className="text-center cursor-pointer"
                onClick={() => {
                  dispatch({ type: 'set', isLoading: true })
                  router.push(`/category/${item.favorite_category}`)
                }}
              >
                {item.favorite_category}
              </td>
              <td className="text-center">{item.items_collected}</td>
              <td className="text-center">{item.creators_supported}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default CollectorsTable

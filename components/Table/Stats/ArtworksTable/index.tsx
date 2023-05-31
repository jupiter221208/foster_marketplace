import React, { useState } from 'react'

// next components
import Image from 'next/image'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'

// styles
import styles from './index.module.scss'
import { getBuyerName, getFirstUpperString, getLocalDate, getOwnerName } from 'utils/helpers'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

const ArtworksTable = props => {
  const { data } = props
  const dispatch = useDispatch()
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)

  const gotoUserDetail = link => {
    dispatch({ type: 'set', isLoading: true })
    router.push(`/${link.replaceAll(' ', '%20')}`)
  }

  return (
    <table id={'ArtworksTable'} className="w-full table-auto">
      <thead>
        <tr className={styles.tableHeader}>
          <th className="w-[20%] text-start">
            <div className="ml-3">Artwork</div>
          </th>
          <th>Sale Price</th>
          <th>Method of Sale</th>
          <th>Date</th>
          <th>Seller</th>
          <th>Buyer</th>
          <th>Market</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          return (
            <tr key={index}>
              <td>
                <div className="flex gap-2 mx-3 items-center">
                  <div className="w-full min-w-[38px] w-[38px] h-[38px] rounded-[8px] overflow-hidden">
                    {!loaded && (
                      <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                        <div></div>
                      </ReactPlaceholder>
                    )}
                    <Image
                      src={item.asset_url !== null && item.asset_url !== '' ? item.asset_url : DefaultAvatar}
                      alt=""
                      width={38}
                      height={38}
                      className="rounded-[8px]"
                      onLoadingComplete={() => setLoaded(true)}
                    />
                  </div>
                  <div
                    className="flex justify-center cursor-pointer"
                    onClick={() => {
                      dispatch({ type: 'set', isLoading: true })
                      router.push(`/browse-nft?id=${item.mint_address}`)
                    }}
                  >
                    {item.asset_name}
                  </div>
                </div>
              </td>
              <td className="text-center">
                <div className={`flex justify-center items-center gap-[5px]`}>
                  <SolanaLogoIcon />
                  {item.amount}
                </div>
              </td>
              <td className="text-center">{item.action_type.replace(/([A-Z])/g, ' $1').trim()}</td>
              <td className="text-center">{getLocalDate(item.created_at)}</td>
              <td className="text-center cursor-pointer" onClick={() => gotoUserDetail(getOwnerName(item))}>
                {getOwnerName(item)}
              </td>
              <td className="text-center cursor-pointer" onClick={() => gotoUserDetail(getBuyerName(item))}>
                {getBuyerName(item)}
              </td>
              <td className="text-center">{getFirstUpperString(item.market)}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default ArtworksTable

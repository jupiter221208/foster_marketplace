import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

import { getDateString } from 'utils/strings'

const ActivityTable = props => {
  const { data } = props
  const viewport = useViewport()

  return (
    <table id="ActivityTable" className="w-full table-auto">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Type</th>
          {/* <th>Transaction ID</th> */}
          <th>Time</th>
          <th>Amount</th>
          <th>Mint Address</th>
          <th>Buyer</th>
          <th>Seller</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td className="h-[90px] flex justify-center items-center">
              <img
                src={item.asset_url}
                alt=""
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
                className="rounded-[15px]"
              />
            </td>
            <td>
              <div className="block">
                <div className="flex justify-center">{item.asset_name}</div>
                {/* <div className="flex justify-center">{item.name02}</div> */}
              </div>
            </td>
            <td className="text-center">{item.action_type.replace(/([A-Z])/g, ' $1').trim()}</td>
            {/* <td className="text-center">
              {item.transactionID.length > 11
                ? item.transactionID.slice(0, 5) + '...' + item.transactionID.slice(-3)
                : item.transactionID}
            </td> */}
            <td className="text-center">{getDateString(item.created_at)}</td>
            <td className="text-center">
              <div className="flex justify-center gap-[5px]">
                <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                {item.amount}
              </div>
            </td>
            <td className="text-center">
              {item.mint_address.length > 11
                ? item.mint_address.slice(0, 5) + '...' + item.mint_address.slice(-3)
                : item.mint_address}
            </td>
            <td className="text-center">
              {item.reference_address.length > 11
                ? item.reference_address.slice(0, 5) + '...' + item.reference_address.slice(-3)
                : item.reference_address}
            </td>
            <td className="text-center">
              {item.minter_address.length > 11
                ? item.minter_address.slice(0, 5) + '...' + item.minter_address.slice(-3)
                : item.minter_address}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ActivityTable

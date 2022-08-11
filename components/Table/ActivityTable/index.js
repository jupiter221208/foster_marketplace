import React from 'react'

// next components
import Image from 'next/image'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const ActivityTable = props => {
  const { data, viewport } = props

  return (
    <table className="w-full table-auto activityTable" id="activityTable">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Type</th>
          <th>Transaction ID</th>
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
              <Image
                src={item.avatar}
                alt=""
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
                className="rounded-[15px]"
              />
            </td>
            <td>
              <div className="block">
                <div className="flex justify-center">{item.name01}</div>
                <div className="flex justify-center">{item.name02}</div>
              </div>
            </td>
            <td className="text-center">{item.type}</td>
            <td className="text-center">
              {item.transactionID.length > 11
                ? item.transactionID.slice(0, 5) + '...' + item.transactionID.slice(-3)
                : item.transactionID}
            </td>
            <td className="text-center">{item.time}</td>
            <td className="text-center">
              <div className="flex justify-center gap-[5px]">
                <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                {item.amount}
              </div>
            </td>
            <td className="text-center">
              {item.mintAddress.length > 11
                ? item.mintAddress.slice(0, 5) + '...' + item.mintAddress.slice(-3)
                : item.mintAddress}
            </td>
            <td className="text-center">
              {item.buyer.length > 11 ? item.buyer.slice(0, 5) + '...' + item.buyer.slice(-3) : item.buyer}
            </td>
            <td className="text-center">
              {item.seller.length > 11 ? item.seller.slice(0, 5) + '...' + item.seller.slice(-3) : item.seller}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ActivityTable

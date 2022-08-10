import React from 'react'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const ActivityTable = props => {
  const { data } = props
  return (
    <table className="w-full table-auto">
      <thead>
        <tr className={styles.header}>
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
          <tr key={index} className={styles.card}>
            <td>
              <Image src={item.avatar} alt="" width={70} height={70} className="rounded-[15px]" />
            </td>
            <td>
              <div className="block">
                <div>{item.name01}</div>
                <div>{item.name02}</div>
              </div>
            </td>
            <td>{item.type}</td>
            <td>{item.transactionID}</td>
            <td>{item.time}</td>
            <td>
              <div className="flex gap-[5px]">
                <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                {item.amount}
              </div>
            </td>
            <td>{item.mintAddress}</td>
            <td>{item.buyer}</td>
            <td>{item.seller}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ActivityTable

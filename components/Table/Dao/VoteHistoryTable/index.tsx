import React from 'react'

// styles
import styles from './index.module.scss'
import { getFirstUpperString } from 'utils/helpers'

const VoteHistoryTable = props => {
  const { data } = props

  const getLocalDate = date => {
    let voteDate = new Date(date)
    let year = voteDate.getFullYear()
    let month = voteDate.getMonth() + 1
    let day = voteDate.getDate()
    return year + '-' + month + '-' + day
  }

  return (
    <table id={'ArtworksTable'} className="w-full table-auto">
      <thead>
        <tr className={styles.tableHeader}>
          <th className="w-[30%] text-start">
            <div className="ml-3">House Memeber</div>
          </th>
          <th>Vote Casted</th>
          <th>Govermance Weight</th>
          <th>Date</th>
          <th>Recorded Vote</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          return (
            <tr key={index}>
              <td>
                <div className={`ml-4 ${styles.text}`}>{item.username}</div>
              </td>
              <td className="text-center">
                <div className={styles.text}>{getFirstUpperString(item.vote_status)}</div>
              </td>
              <td className="text-center">
                <div className={styles.text}>80</div>
              </td>
              <td className="text-center">
                <div className={styles.text}>{getLocalDate(item.created_at)}</div>
              </td>
              <td className="text-center">
                <div
                  className={styles.view}
                  onClick={() => window.open(`https://explorer.solana.com/tx/${item.signature}`)}
                >
                  View
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default VoteHistoryTable

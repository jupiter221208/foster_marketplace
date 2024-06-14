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
    <div className="mt-[30px]">
      <div className={styles.tableHeader}>
        <div className="w-full flex">
          <div className="w-[25%] text-start pl-[30px]">
            <div className={styles.headerTitle}>DAO Member</div>
          </div>
          <div className="w-[20%] text-center">
            <div className={styles.headerTitle}>Vote Casted</div>
          </div>
          <div className="w-[20%] text-center">
            <div className={styles.headerTitle}>Governance Weight</div>
          </div>
          <div className="w-[20%] text-center">
            <div className={styles.headerTitle}>Date</div>
          </div>
          <div className="w-[15%] text-center">
            <div className={styles.headerTitle}>Recorded Vote</div>
          </div>
        </div>
      </div>
      <table id={''} className="w-full table-auto">
        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={index}>
                <div className={styles.tableRow}>
                  <div className={`w-[25%] ${styles.text} pl-[30px]`}>{item.username}</div>
                  <div className={`w-[20%] ${styles.text} text-center`}>{getFirstUpperString(item.vote_status)}</div>
                  <div className={`w-[20%] ${styles.text} text-center`}>{item.weight} votes</div>
                  <div className={`w-[20%] ${styles.text} text-center`}>{getLocalDate(item.created_at)}</div>
                  <div
                    className={`w-[15%] ${styles.view}`}
                    onClick={() => window.open(`https://explorer.solana.com/tx/${item.signature}`)}
                  >
                    View
                  </div>
                </div>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default VoteHistoryTable

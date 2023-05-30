import React from 'react'

// styles
import styles from './index.module.scss'

const VoteHistoryTable = props => {
  const { data } = props

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
                <div className={`ml-4 ${styles.text}`}>UserName</div>
              </td>
              <td className="text-center">
                <div className={styles.text}>Approved</div>
              </td>
              <td className="text-center">
                <div className={styles.text}>80</div>
              </td>
              <td className="text-center">
                <div className={styles.text}>2022-05-12</div>
              </td>
              <td className="text-center">
                <div className={styles.text}>View</div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default VoteHistoryTable

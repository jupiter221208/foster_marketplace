import React from 'react'

import TimeIcon from 'assets/icons/dao-time-icon.svg?component'

// styles
import styles from './index.module.scss'

const LandingTable = props => {
  const { data } = props

  return (
    <table id={'ArtworksTable'} className="w-full table-auto">
      <thead>
        <tr className={styles.tableHeader}>
          <th className="w-[30%] text-start">
            <div className="ml-3">Proposal</div>
          </th>
          <th>Category</th>
          <th>Author</th>
          <th className="w-[13%]"></th>
          <th className="w-[10%]">Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          return (
            <tr key={index}>
              <td>
                <div className={`ml-4 ${styles.text}`}>{item.proposal}</div>
              </td>
              <td className="text-center">
                <div className={styles.text}>{item.category}</div>
              </td>
              <td className="text-center">
                <div className={styles.text}>{item.author}</div>
              </td>
              <td className="flex">
                <div className="flex gap-[15px] items-center">
                  <TimeIcon />
                  <div className={styles.text}>{item.time}</div>
                </div>
              </td>
              <td>
                <div className="flex justify-center">
                  {item.status === 'live' ? (
                    <div className={styles.liveBtn}>Live</div>
                  ) : (
                    <div className={styles.viewBtn}>View</div>
                  )}
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default LandingTable

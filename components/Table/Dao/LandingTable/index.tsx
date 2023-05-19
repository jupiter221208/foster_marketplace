import React from 'react'

import TimeIcon from 'assets/icons/dao-time-icon.svg?component'

// styles
import styles from './index.module.scss'
import DaoLiveButton from './DaoLiveButton'
import DaoPendingButton from './DaoPendingButton'

const LandingTable = props => {
  const { data, onDetail } = props

  const getDateValue = item => {
    var endDate = new Date(item.vote_start)
    endDate.setHours(endDate.getHours() + item.vote_duration)
    let difference = +new Date(endDate) - +new Date()
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    return 'Ends in ' + days + ' days'
  }

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
                <div className={`ml-4 ${styles.text}`}>{item.title}</div>
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
                  <div className={styles.text}>{getDateValue(item)}</div>
                </div>
              </td>
              <td>
                <div className="flex justify-center">
                  {item.status === 'pending' ? <DaoPendingButton /> : <DaoLiveButton onDetail={() => onDetail(item)} />}
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

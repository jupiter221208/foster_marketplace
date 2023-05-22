import React from 'react'

import TimeIcon from 'assets/icons/dao-time-icon.svg?component'

// styles
import styles from './index.module.scss'
import DaoLiveButton from './DaoLiveButton'
import DaoPendingButton from './DaoStatusButton'
import DaoStatusButton from './DaoStatusButton'

const LandingTable = props => {
  const { data, onDetail } = props

  const getEndInValue = item => {
    let voteStartTime = new Date(item.vote_start)
    let offset = voteStartTime.getTimezoneOffset() * 60 * 1000
    let voteStartLocalTime = voteStartTime.getTime() - offset
    let nowDate = new Date().getTime()
    let difference = voteStartLocalTime - nowDate

    if (difference > 0) {
      const hours = difference / (1000 * 60 * 60)
      let days = ''
      if (hours < 24) {
        days = Math.ceil(hours) + ' hrs'
      } else if (hours < 37) {
        days = '1 day'
      } else {
        days = '2 days'
      }
      return 'Starts in ' + days
    }

    difference = voteStartLocalTime + item.vote_duration * 3600 * 1000 - nowDate

    const hours = difference / (1000 * 60 * 60)
    let endDays = ''
    if (hours <= 0) {
      endDays = 'Ended'
    } else if (hours < 24) {
      endDays = 'Ends in ' + Math.ceil(hours) + ' hrs'
    } else if (hours < 37) {
      endDays = 'Ends in 1 day'
    } else {
      endDays = 'Ends in ' + Math.round(difference / (1000 * 60 * 60 * 24)) + ' days'
    }
    // const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    // var endDate = new Date(item.vote_start)
    // endDate.setHours(endDate.getHours() + item.vote_duration)
    // let difference = +new Date(endDate) - +new Date()
    // const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    return endDays
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
                  <div className={styles.text}>{getEndInValue(item)}</div>
                </div>
              </td>
              <td>
                <div className="flex justify-center">
                  {item.status === 'closed' ? (
                    <DaoStatusButton label="Closed" />
                  ) : item.status === 'pending' ? (
                    <DaoStatusButton label="Pending" />
                  ) : (
                    <DaoLiveButton onDetail={() => onDetail(item)} />
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

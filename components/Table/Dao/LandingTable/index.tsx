import React from 'react'

import TimeIcon from 'assets/icons/dao-time-icon.svg?component'

// styles
import styles from './index.module.scss'
import DaoLiveButton from './DaoLiveButton'
import DaoPendingButton from './DaoPendingButton'
import DaoClosedButton from './DaoClosedButton'

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
    return endDays
  }

  return (
    <div>
      <div className={styles.tableHeader}>
        <div className="w-[28%] text-start pl-[30px]">
          <div className={styles.headerTitle}>Proposal</div>
        </div>
        <div className="w-[15%] text-center">
          <div className={styles.headerTitle}>Submission Date</div>
        </div>
        <div className="w-[12%] text-center">
          <div className={styles.headerTitle}>Category</div>
        </div>
        <div className="w-[12%] text-center">
          <div className={styles.headerTitle}>Votes</div>
        </div>
        <div className="w-[20%] text-center">
          <div className={styles.headerTitle}>Author</div>
        </div>

        <div className="w-[20%] text-start pl-[6px]">
          <div className={styles.headerTitle}>Status</div>
        </div>
      </div>

      <table id={'landingTable'} className="w-full table-auto mt-[26px]">
        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={index}>
                <div className={styles.tableRow}>
                  <div className={`w-[28%] pl-[30px] ${styles.text}`}>{item.title}</div>
                  <div className={`w-[15%] text-center ${styles.text}`}>12/24/2022</div>
                  <div className={`w-[12%] text-center ${styles.text}`}>{item.category}</div>
                  <div className={`w-[12%] text-center ${styles.text}`}>10</div>
                  <div className={`w-[20%] text-center ${styles.text}`}>{item.author}</div>
                  <div className="w-[20%] flex">
                    <div className="w-[20%] flex justify-center">
                      {item.status === 'pending' ? (
                        <DaoPendingButton label="Pending" onDetail={() => onDetail(item)} />
                      ) : item.status === 'closed' ? (
                        <DaoClosedButton label="Closed" onDetail={() => onDetail(item)} />
                      ) : (
                        <DaoLiveButton label="Live" onDetail={() => onDetail(item)} />
                      )}
                    </div>
                    <div className="w-[80%] flex justify-center items-center pr-[20px]">
                      {item.status === 'closed' ? (
                        item.vote_result === 'Passed' ? (
                          <div className={styles.daoPassed}>Passed</div>
                        ) : (
                          <div className={styles.daoRejected}>Rejected</div>
                        )
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                </div>
                {/* <td>
                  <div className={`ml-4 ${styles.text}`}>{item.title}</div>
                </td>
                <td className="text-center">
                  <div className={styles.text}>{item.category}</div>
                </td>
                <td className="text-center">
                  <div className={styles.text}>{item.author}</div>
                </td>
                <td className="flex">
                  <div className="w-full flex items-center">
                    {item.status === 'closed' ? (
                      <div
                        className={`w-full flex justify-center ${
                          item.vote_result === 'Passed' ? styles.passed : styles.rejected
                        }`}
                      >
                        {item.vote_result}
                      </div>
                    ) : (
                      <div className="w-full flex gap-[15px] items-center">
                        <div className="w-5 h-5">
                          <TimeIcon />
                        </div>
                        <div className={styles.text}>{getEndInValue(item)}</div>
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex justify-center">
                    {item.status === 'pending' ? (
                      <DaoPendingButton label="Pending" onDetail={() => onDetail(item)} />
                    ) : item.status === 'closed' ? (
                      <DaoClosedButton label="Closed" onDetail={() => onDetail(item)} />
                    ) : (
                      <DaoLiveButton
                        label={item.status === 'closed' ? 'Closed' : item.status === 'pending' ? 'Pending' : 'Live'}
                        onDetail={() => onDetail(item)}
                      />
                    )}
                  </div>
                </td> */}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default LandingTable

import React from 'react'

import TimeIcon from 'assets/icons/dao-time-icon.svg?component'

// styles
import styles from './index.module.scss'
import DaoLiveButton from './DaoLiveButton'
import DaoPendingButton from './DaoPendingButton'
import DaoClosedButton from './DaoClosedButton'
import { getLocalDateWithoutTime } from 'utils/helpers'

const LandingTable = props => {
  const { data, onDetail } = props
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
                  <div className={`w-[28%] pl-[30px] flex ${styles.text}`}>
                    {item.id}&nbsp;&nbsp;
                    <div className="hover:underline" onClick={() => onDetail(item)}>
                      {item.title}
                    </div>
                  </div>
                  <div className={`w-[15%] text-center ${styles.text}`}>{getLocalDateWithoutTime(item.vote_start)}</div>
                  <div className={`w-[12%] text-center ${styles.text}`}>{item.category}</div>
                  <div className={`w-[12%] text-center ${styles.text}`}>{item.total_votes}</div>
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

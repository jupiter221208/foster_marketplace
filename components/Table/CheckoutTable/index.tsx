import React from 'react'

// styles
import styles from './index.module.scss'

const CheckoutTable = props => {
  const { data } = props
  return (
    <table id={'CheckoutTable'} className="w-full table-auto">
      <thead>
        <tr className={styles.tableHeader}>
          <th className="w-[30%] lg:w-[40%]">
            <div className={`${styles.value} text-start ml-[20px]`}>Item</div>
          </th>
          <th className="w-[20%]">
            <div className={styles.value}>Quantity</div>
          </th>
          <th className="w-[40%] ">
            <div className={`${styles.value} text-right mr-[30px]`}>Shipping Address</div>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          return (
            <tr key={index}>
              <td>
                <div className={`${styles.value} w-[80px] lg:w-[150px] ml-[20px]`}>
                  <p dangerouslySetInnerHTML={{ __html: item.name }} />
                </div>
              </td>
              <td className="text-center">
                <div className={styles.value}>{item.quantity}</div>
              </td>
              <td className="text-right">
                <div className={`${styles.value} w-[240px]`}>
                  <p dangerouslySetInnerHTML={{ __html: item.shipping }} />
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default CheckoutTable

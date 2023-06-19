import React from 'react'

// next components

// styles
import styles from './index.module.scss'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

const CheckoutTable = props => {
  const { data } = props
  console.log(data)
  return (
    <table id={'CheckoutTable'} className="w-full table-auto">
      <thead>
        <tr className={styles.tableHeader}>
          {/* <th className="w-[20%] text-start">
            <div className="ml-3">Artwork</div>
          </th> */}
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

import React from 'react'

// styles
import styles from './index.module.scss'

const ShoppingCartCheckoutTable = props => {
  const { data } = props
  return (
    <table id={'CheckoutTable'} className="w-full table-auto">
      <tbody className={styles.tableColor}>
        {data.map((item, index) => {
          return (
            <tr key={index} className="flex py-2">
              <td>
                <div className="w-full h-full">
                  <img src={item.url} className="w-full h-full" />
                </div>
              </td>
              <div className="w-full flex justify-between">
                <div className={`${styles.value} w-[80px] lg:w-full`}>
                  <p dangerouslySetInnerHTML={{ __html: item.name }} />
                </div>
                <div className={`${styles.value} w-full h-full flex items-center justify-end mr-4 text-right`}>
                  <p dangerouslySetInnerHTML={{ __html: item.shipping }} />
                </div>
              </div>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default ShoppingCartCheckoutTable

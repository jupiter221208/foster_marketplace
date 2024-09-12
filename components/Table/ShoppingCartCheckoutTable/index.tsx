import React from 'react'

// styles
import styles from './index.module.scss'

const ShoppingCartCheckoutTable = props => {
  const { data } = props
  return (
    <table id={'ArtworksTable'} className="w-full table-auto">
      <tbody className={styles.tableColor}>
        {data.map((item, index) => {
          return (
            <tr key={index} className="flex py-0 lg:py-2 mb-[10px]">
              <td>
                <div className="w-full h-full min-w-[80px] min-h-[80px] ml-[-10px]">
                  <img src={item.url} className="w-full h-full object-cover" alt="" />
                </div>
              </td>
              <div className="w-full flex justify-between ml-[20px]">
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

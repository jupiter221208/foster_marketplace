import React from 'react'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'

const ShoppingCartCheckoutTable = props => {
  const { data } = props
  return (
    <table id={'CheckoutTable'} className="w-full table-auto">
      <tbody className={styles.tableColor}>
        {data.map((item, index) => {
          return (
            <tr key={index}>
              <td>
                <div className="w-full h-full">
                  <ImageWithFoster src={item.url} className="w-full h-full" />
                </div>
              </td>
              <td>
                <div className={`${styles.value} w-[80px] lg:w-[150px]`}>
                  <p dangerouslySetInnerHTML={{ __html: item.name }} />
                </div>
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

export default ShoppingCartCheckoutTable

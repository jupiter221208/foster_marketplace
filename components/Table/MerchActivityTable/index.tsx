import React from 'react'

// next components
import 'react-placeholder/lib/reactPlaceholder.css'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'
import { getTimeDifference, getYMDString } from 'utils/helpers'

const MerchActivityTable = props => {
  const { data } = props

  const getTechnique = item => {
    if (item.fulfillment_type === 'foster') {
      if (item.options.print_technique === 'direct_to_garment') return 'Direct To Garment'
      else return 'Embroidery'
    } else {
      return 'General'
    }
  }

  const getPreviewUrl = item => {
    if (item.fulfillment_type === 'foster') {
      return item.options.addons[0].mockup_url
    } else {
      return item.options.product_images[0]
    }
  }

  const getStatus = item => {
    if (getTimeDifference(item.sale_start_at) > 0) return 'scheduled'
    else {
      if (item.sale_end_at === null) {
        return 'live'
      } else {
        if (getTimeDifference(item.sale_end_at) > 0) {
          return 'live'
        } else {
          return 'expired'
        }
      }
    }
  }

  return (
    <table id={'MerchTable'} className="w-full table-auto">
      <thead>
        <tr>
          <th>
            <div className={styles.tableHeader}>
              <div className="w-[20%] text-start">Merch Item</div>
              <div className="w-[20%] text-center">Created on</div>
              <div className="w-[20%] text-center">Print Technique</div>
              <div className="w-[10%] text-center">Price</div>
              <div className="w-[15%] text-center">Sales</div>
              <div className="w-[15%] text-start">Status</div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => {
          return (
            <tr key={item.id}>
              <td className="w-full pt-[10px] pb-[10px]">
                <div className={styles.tableRow}>
                  <div className="w-[20%] flex gap-[12px] items-center">
                    <div className="w-[40px]">
                      <ImageWithFoster
                        src={getPreviewUrl(item)}
                        width={40}
                        className="w-[40px] h-[40px] object-contain"
                      />
                    </div>
                    {item.name}
                  </div>
                  <div className="w-[20%] text-center">{getYMDString(new Date(item.created_at))}</div>
                  <div className="w-[20%] text-center">{getTechnique(item)}</div>
                  <div className="w-[10%] text-center">${item.selling_price / 100}</div>
                  <div className="w-[15%] text-center">10</div>
                  <div className="w-[15%]">
                    {getStatus(item) === 'scheduled' ? (
                      <div className={styles.scheduled}>
                        <div className="w-[60%]">scheduled</div>
                        <div className={styles.remove}>Remove</div>
                      </div>
                    ) : getStatus(item) === 'live' ? (
                      <div className={styles.live}>
                        <div className="w-[60%]">Live</div>
                        <div className={styles.remove}>Remove</div>
                      </div>
                    ) : getStatus(item) === 'expired' ? (
                      <div className={styles.expired}>
                        <div className="w-[60%]">Expired</div>
                        <div className={styles.remove}>Republic</div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default MerchActivityTable

import React from 'react'

// next components
import 'react-placeholder/lib/reactPlaceholder.css'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'
import { getTimeDifference, getYMDString } from 'utils/helpers'
import { useRouter } from 'next/router'
import Link from 'next/link'

const MerchStoreTable = props => {
  const { username, data, onUpdate, onDelist, onCancel } = props
  const router = useRouter()

  const getTechnique = item => {
    if (item.fulfillment_type === 'foster') {
      if (item.options.print_technique === 'direct_to_garment') return 'Direct To Garment'
      else return 'Embroidery'
    } else {
      return 'Not Applicable'
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
    if (item.master_edition_address === '') return 'unassigned'

    if (item.master_edition_address?.length > 0) {
      if (getTimeDifference(item.listed_master_edition.startTime) > 0) return 'scheduled'

      if (item.listed_master_edition?.endTime !== null && getTimeDifference(item.listed_master_edition?.endTime) < 0)
        return 'expired'
    }

    if (getTimeDifference(item.sale_start_at) > 0) return 'scheduled'
    else {
      if (item.sale_end_at === null || getTimeDifference(item.sale_end_at) > 0) {
        return 'live'
      } else {
        return 'expired'
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
              <div className="w-[13%] text-center">Sales</div>
              <div className="w-[17%] text-start">Status</div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => {
          return (
            <div key={item.id}>
              <div className="w-full">
                <div className={styles.tableRow}>
                  <div className="w-[20%] flex gap-[12px] items-center">
                    <div className="w-[40px]">
                      <ImageWithFoster
                        src={getPreviewUrl(item)}
                        width={40}
                        className="w-[40px] h-[40px] object-contain"
                      />
                    </div>
                    <div className={styles.name}>
                      {item.master_edition_address === null ? (
                        <Link href={`/${username}/merch/${item.id}`} passHref>
                          <a>{item.name}</a>
                        </Link>
                      ) : (
                        <Link href={`/nft/${item.master_edition_address}`} passHref>
                          <a>{item.name}</a>
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="w-[20%] text-center">{getYMDString(new Date(item.created_at))}</div>
                  <div className="w-[20%] text-center">{getTechnique(item)}</div>
                  <div className="w-[10%] text-center">${item.selling_price / 100}</div>
                  <div className="w-[13%] text-center">{item.current_supply}</div>
                  <div className="w-[17%]">
                    {getStatus(item) === 'scheduled' ? (
                      <div className={styles.scheduled}>
                        <div className="w-[60%]">Upcoming</div>
                        <div className={styles.remove} onClick={() => onCancel(item)}>
                          Cancel
                        </div>
                      </div>
                    ) : getStatus(item) === 'live' ? (
                      <div className={styles.live}>
                        <div className="w-[60%]">Live</div>
                        <div className={styles.remove} onClick={() => onDelist(item)}>
                          Delist
                        </div>
                      </div>
                    ) : getStatus(item) === 'expired' ? (
                      <div className={styles.expired}>
                        <div className="w-[60%]">Expired</div>
                        {item.master_edition_address === null && (
                          <div className={styles.remove} onClick={() => onUpdate(item)}>
                            Update
                          </div>
                        )}
                      </div>
                    ) : getStatus(item) === 'unassigned' ? (
                      <div className={styles.expired}>
                        <div className="w-[60%]">Unassigned</div>
                        <div className={styles.remove} onClick={() => onUpdate(item)}>
                          Update
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </tbody>
    </table>
  )
}

export default MerchStoreTable

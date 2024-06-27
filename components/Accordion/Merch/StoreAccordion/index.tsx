import React, { useRef, useState } from 'react'

// third party components

// images and icons

// styles
import styles from './index.module.scss'

// components
import { getTimeDifference } from 'utils/helpers'
import ImageWithFoster from 'components/ImageWithFoster'
import ThreeDotIcon from 'assets/icons/three-dot-icon.svg?component'
import StudioStoreModal from 'components/Menu/StudioStoreModal'

const StoreAccordion = props => {
  const { data } = props
  const [item, setItem] = useState(null)
  const [openModal, setOpenModal] = useState(false)

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

  const getPreviewUrl = item => {
    if (item.fulfillment_type === 'foster') {
      return item.options.addons[0].mockup_url
    } else {
      return item.options.product_images[0]
    }
  }

  return (
    <div className="w-full flex flex-wrap mt-[30px]">
      {data.map((item, index) => (
        <div key={index} className="w-full flex flex-wrap mt-[-2px]">
          <div className={styles.button}>
            <div className="w-full flex items-center gap-[15px]">
              <div className="w-[47px] h-[47px]">
                <ImageWithFoster src={getPreviewUrl(item)} width={47} className="w-full h-full object-contain" />
              </div>
              <div className="block">
                <div className={styles.subTitle}>{item.name}</div>
                <div className="mt-[5px]">
                  {getStatus(item) === 'scheduled' ? (
                    <div className={styles.scheduled}>Scheduled</div>
                  ) : getStatus(item) === 'live' ? (
                    <div className={styles.live}>Live</div>
                  ) : getStatus(item) === 'expired' ? (
                    <div className={styles.expired}>Expired</div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                setItem(item)
                setOpenModal(true)
              }}
            >
              <ThreeDotIcon />
            </div>
          </div>
        </div>
      ))}

      {openModal && item && <StudioStoreModal open={openModal} close={() => setOpenModal(false)} item={item} />}
    </div>
  )
}

export default StoreAccordion

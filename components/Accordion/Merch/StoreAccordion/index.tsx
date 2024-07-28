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
import { useRouter } from 'next/router'

const StoreAccordion = props => {
  const { username, data, onUpdate, onDelist, onCancel, onUnassign } = props
  const router = useRouter()
  const [item, setItem] = useState(null)
  const [openModal, setOpenModal] = useState(false)

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
                <div
                  className={styles.subTitle}
                  onClick={() => {
                    router.push(`/${username}/merch/${item.id}`)
                  }}
                >
                  {item.name}
                </div>
                <div className="mt-[4px]">
                  {getStatus(item) === 'scheduled' ? (
                    <div className={styles.scheduled}>Upcoming</div>
                  ) : getStatus(item) === 'live' ? (
                    <div className={styles.live}>Live</div>
                  ) : getStatus(item) === 'expired' ? (
                    <div className={styles.expired}>Expired</div>
                  ) : getStatus(item) === 'unassigned' ? (
                    <div className={styles.expired}>Unassigned</div>
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

      {openModal && item && (
        <StudioStoreModal
          open={openModal}
          close={() => setOpenModal(false)}
          item={item}
          onUpdate={onUpdate}
          onDelist={onDelist}
          onCancel={onCancel}
          onUnassign={onUnassign}
        />
      )}
    </div>
  )
}

export default StoreAccordion

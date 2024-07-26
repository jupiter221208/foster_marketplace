import { Fragment } from 'react'
import { useRouter } from 'next/router'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// resources

// styles
import styles from './index.module.scss'

// call apis
import { getTimeDifference, getYMDString } from 'utils/helpers'
import GradientButton from 'components/Button/GradientButton'
import ImageWithFoster from 'components/ImageWithFoster'

const StudioStoreModal = props => {
  const { open, close, item, onUpdate, onDelist, onCancel } = props

  const getTechnique = item => {
    if (item.fulfillment_type === 'foster') {
      if (item.options.print_technique === 'direct_to_garment') return 'Direct To Garment'
      else return 'Embroidery'
    } else {
      return 'Not Applicable'
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
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={styles.bgView} />
        </Transition.Child>

        <div className="fixed inset-0 lg:flex lg:justify-center lg:items-center">
          <div className={styles.modalView}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full h-full">
                <div className={styles.button}>
                  <div className="w-full flex items-center gap-[15px]">
                    <div className="w-[47px] h-[47px]">
                      <ImageWithFoster src={getPreviewUrl(item)} width={47} className="w-full h-full object-contain" />
                    </div>
                    <div className="block">
                      <div className={styles.subTitle}>{item.name}</div>
                      <div className="mt-[4px]">
                        {getStatus(item) === 'scheduled' ? (
                          <div className={styles.scheduled}>Scheduled</div>
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
                </div>
                <div className={styles.panel}>
                  <div className="w-full flex justify-between">
                    <div>
                      <div className={styles.label}>Print Technique</div>
                      <div className={styles.content}>{getTechnique(item)}</div>
                    </div>
                    <div className="text-end">
                      <div className={styles.label}>Created on</div>
                      <div className={styles.content}>{getYMDString(new Date(item.created_at))}</div>
                    </div>
                  </div>
                  <div className="w-full flex justify-between mt-[20px]">
                    <div>
                      <div className={styles.label}>Price</div>
                      <div className={styles.content}>${item.selling_price / 100}</div>
                    </div>
                    <div>
                      <div className={styles.label}>Sales</div>
                      <div className={`${styles.content} text-end`}>{item.current_supply}</div>
                    </div>
                  </div>
                  <div className="w-full mt-[15px]">
                    {getStatus(item) === 'scheduled' ? (
                      <GradientButton
                        fullWidth
                        label="Cancel"
                        fontSize={16}
                        width={100}
                        height={43}
                        onClick={() => {
                          onCancel(item)
                          close()
                        }}
                      />
                    ) : getStatus(item) === 'live' ? (
                      <GradientButton
                        fullWidth
                        label="Delist"
                        fontSize={16}
                        width={100}
                        height={43}
                        onClick={() => {
                          onDelist(item)
                          close()
                        }}
                      />
                    ) : getStatus(item) === 'expired' ? (
                      item.master_edition_address === null ? (
                        <GradientButton
                          fullWidth
                          label="Update"
                          fontSize={16}
                          width={100}
                          height={43}
                          onClick={() => {
                            onUpdate(item)
                            close()
                          }}
                        />
                      ) : (
                        <></>
                      )
                    ) : getStatus(item) === 'unassigned' ? (
                      <GradientButton
                        fullWidth
                        label="Update"
                        fontSize={16}
                        width={100}
                        height={43}
                        onClick={() => {
                          onUpdate(item)
                          close()
                        }}
                      />
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default StudioStoreModal

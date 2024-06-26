import React, { useRef, useState } from 'react'

// third party components
import { Disclosure } from '@headlessui/react'

// images and icons
import DownArrowIcon from 'assets/icons/down-arrow-icon.svg?component'

// styles
import styles from './index.module.scss'

// components
import { getTimeDifference, getYMDString } from 'utils/helpers'
import { useRouter } from 'next/router'
import { useConnection } from '@solana/wallet-adapter-react'
import ImageWithFoster from 'components/ImageWithFoster'
import GradientButton from 'components/Button/GradientButton'

const StoreAccordion = props => {
  const { data } = props
  const router = useRouter()
  const buttonRefs = useRef<any>([])
  const openedRef = useRef<any | null>(null)
  const { connection } = useConnection()

  const clickRecent = index => {
    const clickedButton = buttonRefs.current[index]
    if (clickedButton === openedRef.current) {
      openedRef.current = null
      return
    }
    if (Boolean(openedRef.current?.getAttribute('data-value'))) {
      openedRef.current?.click()
    }
    openedRef.current = clickedButton
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

  const getPreviewUrl = item => {
    if (item.fulfillment_type === 'foster') {
      return item.options.addons[0].mockup_url
    } else {
      return item.options.product_images[0]
    }
  }

  const getTechnique = item => {
    if (item.fulfillment_type === 'foster') {
      if (item.options.print_technique === 'direct_to_garment') return 'Direct To Garment'
      else return 'Embroidery'
    } else {
      return 'General'
    }
  }

  return (
    <div className="w-full flex flex-wrap gap-[10px]">
      {data.map((item, index) => (
        <div key={index} className="w-full flex flex-wrap">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={open ? styles.activeButton : styles.button}
                  data-value={open}
                  ref={ref => {
                    buttonRefs.current[index] = ref
                  }}
                  onClick={() => clickRecent(index)}
                >
                  <div className="flex items-center gap-[15px]">
                    <div className="w-[47px] h-[47px]">
                      <ImageWithFoster src={getPreviewUrl(item)} width={47} className="w-full h-full object-contain" />
                    </div>
                    <div className="block">
                      <div className={styles.subTitle}>{item.name}</div>
                      <div className="mt-[7px]">
                        {getStatus(item) === 'scheduled' ? (
                          <div className={styles.scheduled}>scheduled</div>
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
                  <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
                </Disclosure.Button>
                <Disclosure.Panel className={styles.panel}>
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
                    {getStatus(item) === 'scheduled' || getStatus(item) === 'live' ? (
                      <GradientButton label="Remove" fontSize={16} width={100} height={43} onClick={() => {}} />
                    ) : getStatus(item) === 'expired' ? (
                      <GradientButton label="Republic" fontSize={16} width={100} height={43} onClick={() => {}} />
                    ) : (
                      <div></div>
                    )}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      ))}
    </div>
  )
}

export default StoreAccordion

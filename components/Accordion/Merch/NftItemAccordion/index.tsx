import React, { useRef } from 'react'

// third party components
import { Disclosure } from '@headlessui/react'

// images and icons
import DownArrowIcon from 'assets/icons/down-arrow-icon.svg?component'

// styles
import styles from './index.module.scss'
import OutlineButton from 'components/Button/OutlineButton'
import MerchNftItem from 'components/Card/MerchNftItem'

const NftItemAccordion = props => {
  const { data, type, action, actionAll } = props
  const buttonRefs = useRef<any>([])
  const openedRef = useRef<any | null>(null)

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

  return (
    <div className="w-full flex flex-wrap gap-[10px]">
      <div className="w-full flex justify-center mb-[15px]">
        <OutlineButton
          width={300}
          borderColor={'var(--back-btn-border-mobile)'}
          label={type === 'enabled' ? 'Disable All' : 'Enable All'}
          onClick={() => {
            actionAll()
          }}
        />
      </div>
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
                  <div className="flex items-center gap-x-4">
                    <div className="w-[54px] h-[54px] rounded-[4px] overflow-hidden">
                      <MerchNftItem width={54} height={54} url={item.asset_url} />
                    </div>
                    <div className="ml-[11px]">
                      <div className={styles.title}>{item.nft_name}</div>
                      {open === false && (
                        <div className={styles.creator}>
                          {type === 'enabled' ? 'Creator Studio Enabled' : 'Creator Studio Disabled'}
                        </div>
                      )}
                    </div>
                  </div>
                  <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
                </Disclosure.Button>
                <Disclosure.Panel className={styles.panel}>
                  <div className={styles.firstRow}>
                    <div className="py-[10px]">
                      <div className={styles.subTitle}>{'Studio is currently ' + type + ' for this artwork.'}</div>
                      <div className={styles.subTitle}>
                        {'Would you like to ' + (type === 'enabled' ? 'disable' : 'enable') + ' this feature?'}
                      </div>
                    </div>
                  </div>
                  <div className={styles.secondRow}>
                    <OutlineButton
                      width={300}
                      borderColor={'var(--back-btn-border-mobile)'}
                      label={type === 'enabled' ? 'Disable' : 'Enable'}
                      onClick={() => {
                        const clickedButton = buttonRefs.current[index]
                        clickedButton.click()
                        action(item.token_id)
                      }}
                    />
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

export default NftItemAccordion

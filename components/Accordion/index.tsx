import React from 'react'

// third party components
import { Disclosure } from '@headlessui/react'
import DownIcon from 'assets/icons/pagination-down-icon.svg?component'

// styles
import styles from './index.module.scss'

const Accordion = props => {
  const { label, data, onClick } = props

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className={styles.container}>
            <div className="flex items-center">
              <div className={styles.label}>{label}</div>
            </div>
            {data.length !== 0 && <DownIcon className={`${open ? 'rotate-180 transform' : ''} ml-2 mt-1`} />}
          </Disclosure.Button>
          {data.length !== 0 && (
            <Disclosure.Panel className="absolute top-9 pt-4 pb-2 text-sm text-gray-500">
              {({ close }) =>
                data.map((item, index) => (
                  <div
                    key={index}
                    className={styles.menuItem}
                    onClick={() => {
                      close()
                      onClick(item)
                    }}
                  >
                    {item.label}
                  </div>
                ))
              }
            </Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
  )
}

export default Accordion

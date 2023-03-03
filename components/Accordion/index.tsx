import React from 'react'
import { useSelector } from 'react-redux'

// third party components
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

// styles
import styles from './index.module.scss'

const Accordion = props => {
  const { label, data, onClick } = props
  const lightMode = useSelector(state => (state as any).lightMode)

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className={styles.container}>
            <div className="flex items-center">
              <div className={`${styles.label} ${lightMode ? styles.lightColor : ''}`}>{label}</div>
            </div>
            {data.length !== 0 && (
              <ChevronDownIcon
                className={`${open ? 'rotate-180 transform' : ''} h-6 w-6`}
                style={{ color: lightMode ? '#202427' : '#5AC3BA' }}
              />
            )}
          </Disclosure.Button>
          {data.length !== 0 && (
            <Disclosure.Panel className="absolute top-9 pt-4 pb-2 text-sm text-gray-500">
              {({ close }) =>
                data.map((item, index) => (
                  <div
                    key={index}
                    className={lightMode ? styles.lightMenuItem : styles.menuItem}
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

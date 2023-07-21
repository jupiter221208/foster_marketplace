import React from 'react'

import { Listbox, Transition } from '@headlessui/react'

// styles
import styles from './index.module.scss'

const Select = props => {
  const { data, selected, onChange } = props

  return (
    <div className="w-full">
      <Listbox value={selected} onChange={item => onChange(item)}>
        <div className="w-full relative">
          <Listbox.Button className={styles.container}>
            <span className="block truncate">{selected.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true" width="20" height="20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                  fill="#78787B"
                ></path>
              </svg>
            </span>
          </Listbox.Button>
          <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className={styles.menuBlur}>
              <Listbox.Options className={styles.menuArea}>
                {data.map((item, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) => `${styles.menuItem} ${active ? styles.activeMenuItem : ''}`}
                    value={item}
                    disabled={item.disabled !== undefined ? item.disabled : false}
                  >
                    {({ selected }) => (
                      <span className={selected ? styles.activeMenuItem : item.disabled ? styles.disabledMenuItem : ''}>
                        {item.label}
                      </span>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default Select

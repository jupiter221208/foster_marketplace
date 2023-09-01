import React, { useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import ActivityDownIcon from 'assets/icons/activity-down-icon.svg?component'

// styles
import styles from './index.module.scss'

const CountrySelect = props => {
  const { data, selected, onChange, placeholder } = props

  return (
    <div className="w-full">
      <Listbox value={selected} onChange={item => onChange(item)}>
        <div className="w-full relative">
          <Listbox.Button className={styles.container}>
            {selected ? (
              <span className="block truncate">{selected.name}</span>
            ) : (
              <div className={styles.placeholder}>{placeholder}</div>
            )}

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ActivityDownIcon className={`${'rotate-[-180] transform mr-2'}`} />
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
                  >
                    {({ selected }) => <span className={selected ? styles.activeMenuItem : ''}>{item.name}</span>}
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

export default CountrySelect

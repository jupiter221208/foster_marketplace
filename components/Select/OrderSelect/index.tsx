import React from 'react'

import { Listbox, Transition } from '@headlessui/react'

import SortNormalIcon from 'assets/icons/sort-icon-normal.svg?component'
// styles
import styles from './index.module.scss'

const OrderSelect = props => {
  const { data, selected, onChange } = props

  return (
    <div className="w-full">
      <Listbox value={selected} onChange={item => onChange(item)}>
        <div className="w-[auto] relative">
          <Listbox.Button className={styles.container}>
            <span className={styles.filterText}>{selected.label}</span>
            <SortNormalIcon alt="" />
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

export default OrderSelect

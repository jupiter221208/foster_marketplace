import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

// styles
import styles from './index.module.scss'

const Select = props => {
  const { data, selected, onChange } = props
  const lightMode = useSelector(state => (state as any).lightMode)

  return (
    <div className="w-full">
      <Listbox value={selected} onChange={item => onChange(item)}>
        <div className="w-full relative">
          <Listbox.Button className={`${styles.container} ${lightMode ? styles.lightContainer : ''}`}>
            <span className="block truncate">{selected.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          {/* <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0"> */}
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

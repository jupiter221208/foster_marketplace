import React, { useEffect, useState } from 'react'

import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

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
              <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          {/* <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0"> */}
          <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className={styles.menuArea}>
              {data.map((item, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) => `${styles.menuItem} ${active ? styles.activeMenuItem : ''}`}
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                      {selected ? (
                        <span className={styles.iconStyle}>
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default Select

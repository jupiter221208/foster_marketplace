import React, { useEffect, useState } from 'react'
import { Listbox, Transition, Combobox } from '@headlessui/react'
import ActivityDownIcon from 'assets/icons/activity-down-icon.svg?component'

// styles
import styles from './index.module.scss'
const CountrySelect = props => {
  const { data, selected, onChange, placeholder, type } = props
  const [selectedCountry, setSelectedCountry] = useState('')
  const [query, setQuery] = useState('')

  const filteredCountry =
    query === ''
      ? data
      : data.filter(item => {
          return item.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <div className="w-full">
      <Combobox
        value={selected && selected.name ? selected.name : selected ? selected : null}
        onChange={item => {
          const filter = data.find(obj => item === obj.name)
          onChange(filter)
        }}
      >
        <div className="w-full relative">
          <Combobox.Input
            onChange={event => {
              setQuery(event.target.value)
            }}
            className={styles.container}
            placeholder={placeholder}
          />

          <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className={styles.menuBlur}>
              <Combobox.Options className={styles.menuArea}>
                {filteredCountry.map((item, index) => (
                  <>
                    <Combobox.Option
                      key={index}
                      value={item.name}
                      className={({ active }) => `${styles.menuItem} ${active ? styles.activeMenuItem : ''}`}
                    >
                      {({ selected }) => <span className={selected ? styles.activeMenuItem : ''}>{item.name}</span>}
                    </Combobox.Option>
                  </>
                ))}
              </Combobox.Options>
            </div>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}

export default CountrySelect

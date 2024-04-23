import React, { Fragment, useState } from 'react'
// next components

// third party components
import { Menu, Transition } from '@headlessui/react'

// images and icons
import FilterIcon from 'assets/icons/filter-icon.svg?component'

// styles
import styles from './index.module.scss'

// solana
import Radio from 'components/Radio'
import StudioApparelList from 'assets/json/hero/hero-apparel-list.json'
import { useDispatch } from 'react-redux'

const ApparelTypeMenu = props => {
  const { base, onChange, setFilterName } = props
  const dispatch = useDispatch()

  const [apparelTypes, setApparelTypes] = useState([
    { id: 0, label: 'All', name: 'All', selected: true },
    { id: 1, label: 'Tees', name: 'Short Sleeve', selected: false },
    { id: 2, label: 'Long Sleeves', name: 'Long Sleeve', selected: false },
    { id: 3, label: 'Hoodies', name: 'Hoodie', selected: false },
    { id: 4, label: 'Crewnecks', name: 'Sweatshirt', selected: false },
    { id: 5, label: `Women's Tees`, name: `Women's Short Sleeve`, selected: false },
  ])
  const [selectedType, setSelectedType] = useState(apparelTypes[0])

  const onChangeType = type => {
    setSelectedType(type)
    setFilterName(type['label'])
    let newItems = []
    apparelTypes.map(item => {
      if (type.name === item.name) {
        newItems.push({ label: item.label, name: item.name, selected: true })
      } else {
        newItems.push({ label: item.label, name: item.name, selected: false })
      }
    })
    setApparelTypes(newItems)

    StudioApparelList.map(item => {
      if (item.name === type.name) {
        onChange({
          selected: true,
          data: item,
        })
        dispatch({ type: 'set', apparelType: item.name })
      }
    })
  }

  return (
    apparelTypes.length > 1 && (
      <div className="relative mt-[4px]">
        <Menu>
          <Menu.Button>
            <div className={styles.btnArea}>
              {selectedType ? selectedType['label'] : 'Filter'}
              <FilterIcon alt="" />
            </div>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className={styles.menuArea}>
              <Menu.Item>
                {({ active }) => (
                  <div className={styles.menuItem}>
                    <Radio
                      data={apparelTypes}
                      direction=""
                      selected={selectedType}
                      onChange={item => onChangeType(item)}
                    />
                  </div>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    )
  )
}

export default ApparelTypeMenu

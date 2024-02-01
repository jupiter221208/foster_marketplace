import React, { Fragment, useState, useEffect } from 'react'
// next components

// third party components
import { Menu, Transition } from '@headlessui/react'

// images and icons
import FilterIcon from 'assets/icons/filter-icon.svg?component'

// styles
import styles from './index.module.scss'

// solana
import Radio from 'components/Radio'
import StudioHeroList from 'assets/json/hero/hero-list.json'
import StudioApparelList from 'assets/json/hero/hero-apparel-list.json'

const ApparelTypeMenu = props => {
  const { base, onChange, setFilterName } = props
  const [apparelTypes, setApparelTypes] = useState([])
  const [selectedType, setSelectedType] = useState(null)

  useEffect(() => {
    for (var i = 0; i < StudioHeroList.length; i++) {
      let hero = StudioHeroList[i]
      let bases = hero.bases.filter(item => item.base === base)

      if (bases.length > 0) {
        let types = []
        hero.bases.map((item, index) => {
          let type = { id: index, label: item.name, value: item.base, disabled: false }
          types.push(type)
          if (item.base === base) {
            setSelectedType(type)
            setFilterName(type['label'])
          }
        })
        setApparelTypes(types)
        break
      }
    }
  }, [base])

  const onChangeType = type => {
    setSelectedType(type)
    StudioApparelList.map(item => {
      if (item.name === type.value) {
        onChange({
          selected: true,
          data: item,
        })
      }
    })
  }

  return (
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
                  <Radio data={apparelTypes} selected={selectedType} onChange={item => onChangeType(item)} />
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default ApparelTypeMenu

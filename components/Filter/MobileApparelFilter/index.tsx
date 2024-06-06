import React, { useState, useEffect } from 'react'

// third party components
import { Disclosure } from '@headlessui/react'

// components
import Radio from 'components/Radio'

// images and icons

// json
import StudioApparelList from 'assets/json/hero/hero-apparel-list.json'

// styles
import styles from './index.module.scss'
import { useDispatch } from 'react-redux'

const MobileApparelFilter = props => {
  const { filterName, onChange, onClose, setFilterName } = props
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

  useEffect(() => {
    apparelTypes.map(item => {
      if (item.label === filterName) {
        setSelectedType(item)
        return
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterName])

  const onChangeType = type => {
    setSelectedType(type)
    setFilterName(type['label'])

    let newItems = []
    apparelTypes.map(item => {
      if (type.name === item.name) {
        newItems.push({ id: item.id, label: item.label, name: item.name, selected: true })
      } else {
        newItems.push({ id: item.id, label: item.label, name: item.name, selected: false })
      }
    })

    setApparelTypes(newItems)

    if (type.name === 'All') {
      onChange({
        selected: true,
        data: 'All',
      })
      onClose()
      return
    } else {
      StudioApparelList.map(item => {
        if (item.name === type.name) {
          onChange({
            selected: true,
            data: item,
          })
          dispatch({ type: 'set', apparelType: item.name })
          onClose()
          return
        }
      })
    }
  }

  return (
    <div className={styles.container}>
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <>
            <div className={styles.content} />

            <div className={styles.bottomArea}>
              <div className={`${styles.title} mt-[12px]`}>Filter</div>
              <Radio
                direction="rtl"
                data={apparelTypes}
                selected={selectedType}
                onChange={item => onChangeType(item)}
              />
              <div className="w-full flex justify-center mt-[30px]">
                <div className={styles.cancel} onClick={() => onClose()}>
                  Cancel
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </div>
  )
}

export default MobileApparelFilter

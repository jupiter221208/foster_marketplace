import React, { useState, useEffect } from 'react'

// third party components
import { Disclosure } from '@headlessui/react'

// components
import Radio from 'components/Radio'

// images and icons

// json
import StudioHeroList from 'assets/json/hero/hero-list.json'
import StudioApparelList from 'assets/json/hero/hero-apparel-list.json'

// styles
import styles from './index.module.scss'

const MobileApparelFilter = props => {
  const { base, onChange, onClose, setFilterName } = props
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

import React, { useState } from 'react'

// components
import StatsSearchBox from 'components/Input/StatsSearchBox'

// resources

// styles
import styles from './index.module.scss'
import DropdownFilterMenu from 'components/Menu/DropdownFilterMenu'

const CreatorSearchSection = props => {
  const { placeholder, searchWord, setSearchWord, onFilter } = props
  const [active, setActive] = useState<any>(0)
  const [filterList, setFilterList] = useState([
    { id: 0, label: 'Completed' },
    { id: 1, label: 'Pending' },
    { id: 2, label: 'All' },
  ])
  const [selectedItem, setSelectedItem] = useState({ id: 0, label: 'Completed' })

  const handleChangeActive = value => {
    setActive(value)
    onFilter(value)
  }
  return (
    <div className={styles.container}>
      <div className="w-full flex justify-between gap-[20px] items-center">
        <div className="w-[200px] lg:w-[500px] flex items-center gap-2 justify-between">
          <StatsSearchBox value={searchWord} placeholder={placeholder} onChange={value => setSearchWord(value)} />
        </div>
        <div>
          <DropdownFilterMenu
            label={selectedItem['label']}
            data={filterList}
            selectedItem={selectedItem}
            setSelectedItem={item => {
              setSelectedItem(item)
              handleChangeActive(item.id)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default CreatorSearchSection

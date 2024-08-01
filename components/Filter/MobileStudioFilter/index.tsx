import React, { useEffect, useState } from 'react'

// third party components
import { Disclosure } from '@headlessui/react'

// components
import Radio from 'components/Radio'
import Checkbox from 'components/Checkbox'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

// json
import AvailabilityList from 'assets/json/explore/availability.json'
import MarketList from 'assets/json/explore/market.json'
import MediumList from 'assets/json/explore/medium.json'
import CategoryList from 'assets/json/popular-category.json'
import DownArrowIcon from 'assets/icons/down-arrow-icon.svg?component'

// styles
import styles from './index.module.scss'

const MobileStudioFilter = props => {
  const { category, subCategory, color, price, onClose, onFilter } = props

  const [selectedCategory, setSelectedCategory] = useState<any>(category)
  const [selectedSubCate, setSelectedSubCate] = useState<any>(subCategory)
  const [selectedColor, setSelectedColor] = useState<any>(color)
  const [selectedPrice, setSelectedPrice] = useState<any>(price)

  return (
    <div className={styles.container}>
      <div className={styles.content}></div>
      <div className={styles.bottomArea}>
        <div className="w-[94px]">
          <OutlineButton
            label="Cancel"
            onClick={() => onClose()}
            color="var(--text-gray-200-color)"
            borderWidth={2}
            borderColor="rgba(var(--main-bg-color-rgb), 0.1)"
            fullWidth
          />
        </div>
        <div className="w-[94px]">
          <GradientButton
            label="Apply"
            backgroundColor01="var(--main-icon-color)"
            backgroundColor02="var(--main-icon-color)"
            color="var(--background-main-color)"
            onClick={() =>
              onFilter({
                category: selectedCategory,
                subCategory: selectedSubCate,
                color: selectedColor,
                price: selectedPrice,
              })
            }
            fullWidth
          />
        </div>
      </div>
    </div>
  )
}

export default MobileStudioFilter

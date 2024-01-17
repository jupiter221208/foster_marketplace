import React, { useEffect, useState } from 'react'

// components

// icons

// styles
import styles from './index.module.scss'
import CategoryChip from 'components/Chip/CategoryChip'

const AboutSection = props => {
  const { description, categories } = props

  useEffect(() => {}, [])

  return (
    <div className={styles.container}>
      {description?.length > 0 && (
        <div className="mt-[24px] lg:mt-[55px]">
          <div className={styles.description}>{description}</div>
        </div>
      )}
      <div className="mt-[24px] lg:mt-[32px]">
        <div className={styles.descTitle}>Categories</div>
        <div className="w-full flex flex-wrap mt-[13px] lg:mt-[17px] gap-[8px]">
          {categories.map((item, index) => (
            <div key={index}>{item.length > 0 && <CategoryChip data={{ value: item }} />}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AboutSection

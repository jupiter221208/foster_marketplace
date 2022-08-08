import React from 'react'

// styles
import styles from './index.module.scss'

const CheckboxGroup = props => {
  const { categoryList, onChange, direction = 'ltr' } = props
  return (
    <div className="w-full grid grid-cols-12 gap-4">
      {direction === 'ltr' &&
        categoryList.map((item, index) => (
          <div key={index} className="col-span-12 lg:col-span-6 xl:col-span-4 flex items-center gap-4">
            <input
              className={styles.checkbox}
              type="checkbox"
              id={item.id}
              checked={item.checked}
              onChange={() => onChange(index)}
            />
            <label className={styles.checkmark} onClick={() => onChange(index)}>
              {item.label}
            </label>
          </div>
        ))}
      {direction === 'rtl' &&
        categoryList.map((item, index) => (
          <div key={index} className="col-span-12 lg:col-span-6 xl:col-span-4 flex items-center justify-between">
            <label className={styles.checkmark} onClick={() => onChange(index)}>
              {item.label}
            </label>
            <input
              className={styles.checkbox}
              type="checkbox"
              id={item.id}
              checked={item.checked}
              onChange={() => onChange(index)}
            />
          </div>
        ))}
    </div>
  )
}

export default CheckboxGroup

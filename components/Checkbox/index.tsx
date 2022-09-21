import React from 'react'

// styles
import styles from './index.module.scss'

const Checkbox = props => {
  const { categoryList, onChange, direction = 'ltr' } = props
  return (
    <div className="w-full flex flex-wrap gap-4">
      {direction === 'ltr' &&
        categoryList.map((item, index) => (
          <div key={index} className="w-full flex items-center gap-4">
            <input
              className={styles.checkbox}
              type="checkbox"
              id={item.id}
              checked={item.checked}
              onChange={() => onChange(index)}
            />
            <label className={styles.checkmark} onClick={() => onChange(index)}>
              {item.name}
            </label>
          </div>
        ))}
      {direction === 'rtl' &&
        categoryList.map((item, index) => (
          <div key={index} className="w-full flex items-center justify-between">
            <label className={styles.checkmark} onClick={() => onChange(index)}>
              {item.name}
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

export default Checkbox

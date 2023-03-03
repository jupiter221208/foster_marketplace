import React from 'react'
import { useSelector } from 'react-redux'

// styles
import styles from './index.module.scss'

const Checkbox = props => {
  const { categoryList, onChange, direction = 'ltr' } = props
  const lightMode = useSelector(state => (state as any).lightMode)

  return (
    <div className="w-full flex flex-wrap gap-4">
      {direction === 'ltr' &&
        categoryList.map((item, index) => (
          <div key={index} className="w-full flex items-center gap-4">
            <input
              className={`${lightMode ? styles.lightCheckbox : styles.checkbox} ${item.disabled ? `opacity-60` : ``}`}
              type="checkbox"
              id={item.id}
              checked={item.checked}
              disabled={item.disabled}
              onChange={() => onChange(index)}
            />
            <label
              className={`${lightMode ? styles.lightSelected : styles.selected} ${item.disabled ? `opacity-60` : ``}`}
              onClick={() => {
                if (item.disabled === false) onChange(index)
              }}
            >
              {item.name}
            </label>
          </div>
        ))}
      {direction === 'rtl' &&
        categoryList.map((item, index) => (
          <div key={index} className="w-full flex items-center justify-between">
            <label
              className={`${lightMode ? styles.lightSelected : styles.selected} ${item.disabled ? `opacity-60` : ``}`}
              onClick={() => {
                if (item.disabled === false) onChange(index)
              }}
            >
              {item.name}
            </label>
            <input
              className={`${styles.checkbox} ${item.disabled ? `opacity-60` : ``}`}
              type="checkbox"
              disabled={item.disabled}
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

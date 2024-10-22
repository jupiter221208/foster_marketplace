import React from 'react'

import { Tooltip as ReactTooltip } from 'react-tooltip'

// styles
import styles from './index.module.scss'

const CheckboxGroup = props => {
  const { type, categoryList, onChange, direction = 'ltr' } = props
  return (
    <div
      className={`w-full grid ${
        type === 'shoe'
          ? 'lg:grid-cols-6 2xl:grid-cols-6 3xl:grid-cols-8'
          : 'lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4'
      } gap-[20px]`}
    >
      {direction === 'ltr' &&
        categoryList.map((item, index) => (
          <div id={`check-label-${index}`} key={index} className="flex items-center gap-[10px]">
            <input
              className={`${styles.checkbox} ${item.disabled ? `opacity-60` : ``}`}
              type="checkbox"
              disabled={item.disabled}
              id={item.id}
              checked={item.checked}
              onChange={() => onChange(index)}
            />
            <label
              className={`${styles.checkmark} ${item.disabled ? `opacity-60` : ``}`}
              onClick={() => {
                if (item.disabled === false) onChange(index)
              }}
            >
              {item.name}
            </label>
            {item.disabled && (
              <ReactTooltip
                className={styles.tooltip}
                anchorId={`check-label-${index}`}
                noArrow={true}
                place="bottom"
                content="This category is not yet enabled"
              />
            )}
          </div>
        ))}
      {direction === 'rtl' &&
        categoryList.map((item, index) => (
          <div key={index} className="col-span-12 lg:col-span-6 xl:col-span-4 flex items-center justify-between">
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

export default CheckboxGroup

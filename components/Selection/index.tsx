import React from 'react'

// styles
import styles from './index.module.scss'
import { useViewport } from 'utils'

const Selection = props => {
  const { label, data, selected, onSelect } = props
  const viewport = useViewport()
  return (
    <div className={styles.container}>
      <div className="w-full lg:flex hidden">
        <div className={styles.label}>{label}</div>
        <div className="flex gap-[30px]">
          {data.map((item, index) => (
            <div
              key={index}
              className={item.name === selected ? styles.selected : styles.normal}
              onClick={() => onSelect(item)}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full  lg:hidden ">
        <div className={styles.label}>{label}</div>
        <div className="flex flex-wrap gap-[15px] mt-[15px]">
          {data.map((item, index) => (
            <div
              key={index}
              className={item.name === selected ? styles.selected : styles.normal}
              onClick={() => onSelect(item)}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Selection

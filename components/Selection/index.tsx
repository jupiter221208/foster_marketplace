import React from 'react'

// styles
import styles from './index.module.scss'

const Selection = props => {
  const { label, data, selected, onSelect } = props
  return (
    <div className={styles.container}>
      <div className={styles.label}>{label}</div>
      {data.map((item, index) => (
        <div
          key={index}
          className={item.name === selected ? styles.selected : styles.normal}
          onClick={onSelect(item.name)}
        >
          {item}
        </div>
      ))}
    </div>
  )
}

export default Selection

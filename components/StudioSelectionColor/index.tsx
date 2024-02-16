import React from 'react'

// styles
import styles from './index.module.scss'

const StudioSelectionColor = props => {
  const { label, data, selected, onSelect, newStudio } = props

  return (
    <div className={styles.container}>
      <div className="flex gap-[10px] lg:gap-[15px] justify-center">
        {data.map((itemData, index) => (
          <div key={index}>
            {newStudio ? (
              <div
                key={index}
                className={`${itemData.type === selected ? styles.selectedMobile : styles.normalMobile}`}
                onClick={() => {
                  onSelect(itemData)
                }}
              >
                <div style={{ background: itemData.name, width: '100%', height: '100%' }} />
              </div>
            ) : (
              <div
                key={index}
                className={`${itemData.type === selected ? styles.selected : styles.normal}`}
                onClick={() => {
                  onSelect(itemData)
                }}
              >
                <div style={{ background: itemData.name, width: '100%', height: '100%' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default StudioSelectionColor

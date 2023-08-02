import React from 'react'
import { useSelector } from 'react-redux'

// styles
import styles from './index.module.scss'

const IconTabButton = props => {
  const { item, onChange } = props
  const lightDarkMode = useSelector(state => (state as any).lightMode)

  return (
    <div className="relative">
      <button className={`${styles.container} ${item.selected ? styles.activeTab : ''}`} onClick={() => onChange(item)}>
        <div className="w-full h-full min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]">
          <img
            src={
              lightDarkMode ? (item.selected ? item.icon04 : item.icon03) : item.selected ? item.icon01 : item.icon02
            }
            alt=""
          />
        </div>
        <div className="ml-3">{item.label}</div>
      </button>
    </div>
  )
}

export default IconTabButton

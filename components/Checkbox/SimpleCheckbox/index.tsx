import React from 'react'

// styles
import styles from './index.module.scss'

const SimpleCheckbox = props => {
  const { isChecked, isDisabled, onChange } = props

  return (
    <div className="w-full flex flex-wrap gap-4">
      <div className="w-full flex items-center gap-4">
        <input
          className={styles.checkbox}
          type="checkbox"
          checked={isChecked}
          disabled={isDisabled}
          onChange={() => onChange()}
        />
      </div>
    </div>
  )
}

export default SimpleCheckbox

import React, { useState } from 'react'

// styles
import styles from './index.module.scss'

const DaoLiveButton = props => {
  const { label, onDetail } = props
  const [hover, setHover] = useState(false)

  return (
    <div
      className={styles.viewBtn}
      onMouseEnter={() => onDetail && setHover(true)}
      onMouseLeave={() => onDetail && setHover(false)}
      onClick={onDetail}
    >
      {label}
    </div>
  )
}

export default DaoLiveButton

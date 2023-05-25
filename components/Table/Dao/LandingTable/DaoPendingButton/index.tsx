import React, { useState } from 'react'

// styles
import styles from './index.module.scss'

const DaoPendingButton = props => {
  const { label, onDetail } = props
  const [hover, setHover] = useState(false)

  return (
    <div
      className={hover ? styles.viewBtn : styles.liveBtn}
      onMouseEnter={() => onDetail && setHover(true)}
      onMouseLeave={() => onDetail && setHover(false)}
      onClick={onDetail}
    >
      {hover ? 'View' : label}
    </div>
  )
}

export default DaoPendingButton

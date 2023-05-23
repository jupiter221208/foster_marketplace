import React, { useState } from 'react'

// styles
import styles from './index.module.scss'

const DaoClosedButton = props => {
  const { label, onDetail } = props
  const [hover, setHover] = useState(false)

  return (
    <div
      className={hover ? styles.viewBtn : styles.liveBtn}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onDetail}
    >
      {hover ? 'View' : label}
    </div>
  )
}

export default DaoClosedButton

import React from 'react'

// styles
import styles from './index.module.scss'

const TechniqueClipboardChip = props => {
  const { identifier } = props
  return (
    <div id={identifier} className={styles.container}>
      <div className={styles.title}>Which technique should I choose?</div>
      <div className={styles.text}>
        DTG is ideal for complex designs/artwork (i.e., large print areas, multiple colors, and gradients within the
        artwork). Embroidery is better suited to simpler, smaller designs, such as logos, and for those who might want
        to achieve a 3D effect with their branding.
      </div>
    </div>
  )
}

export default TechniqueClipboardChip

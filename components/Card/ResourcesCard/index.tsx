import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const ResourcesCard = props => {
  const { data, onClick, selected } = props

  return (
    <div
      className={styles.container}
      style={{
        background: selected ? 'var(--resource-card-bg)' : 'var(--resource-card-default-bg)',
        borderWidth: selected ? '0px' : '1px',
      }}
      onClick={() => onClick(data.id)}
    >
      <div className={`min-w-[50px]`}>
        <Image src={data.icon01} alt="" width={data.width} height={data.height} />
      </div>
      <div className="block">
        <div className={`${styles.title} ${styles.unselected}`}>{data.title}</div>
        <div className={styles.description}>{data.description}</div>
      </div>
    </div>
  )
}

export default ResourcesCard

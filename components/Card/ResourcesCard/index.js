import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const ResourcesCard = props => {
  const { viewport, data, onClick } = props

  return (
    <div
      className={styles.container}
      style={{
        background: `linear-gradient(to bottom, ${data.bgColor01}, ${data.bgColor02})`,
      }}
      onClick={() => onClick(data.id)}
    >
      <div className="min-w-[35px]">
        <Image src={data.icon01} alt="" width={data.width} height={data.height} />
      </div>
      <div className="block">
        <div className={styles.title}>{data.title}</div>
        <div className={styles.description} style={{ width: data.id === 2 ? ' 200px' : '100%' }}>
          {data.description}
        </div>
      </div>
    </div>
  )
}

export default ResourcesCard

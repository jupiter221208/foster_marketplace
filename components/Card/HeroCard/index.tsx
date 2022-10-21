import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

const HeroCard = props => {
  const { data } = props
  const viewport = useViewport()

  return (
    <div className={styles.container}>
      <div className={styles.topMask} />
      <Image
        src={data.image}
        alt=""
        width={550}
        height={772}
        layout="responsive"
        objectFit="cover"
        className="rounded-[10px] lg:rounded-[30px]"
      />
      {viewport === 'xs' || viewport === 'md' || viewport === 'sm' ? (
        <div className={styles.contentArea}>
          <div className={styles.title}>{data.title}</div>
          {data.text.map((item, index) => (
            <div className={styles.text} key={index}>
              {item}
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
      <div className={styles.cardArea}>
        <div className="flex justify-between gap-[6px]">
          <div className="flex lg:hidden justify-start items-center lg:mt-[10px]">
            <div className={styles.avatar}>
              <Image
                src={data.avatar}
                alt=""
                width={viewport === 'lg' ? 40 : 60}
                height={viewport === 'lg' ? 40 : 60}
                layout="responsive"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          </div>
          <div className="w-full block">
            <div className={styles.nftName}>{data.nftName}</div>
            <div className={`w-full hidden lg:flex ${styles.collectionName}`}>{data.collectionName}</div>
            <div className={`flex lg:hidden ${styles.artistName}`}>{data.artistName}</div>
          </div>
          <div className="hidden lg:flex justify-start items-center lg:mt-[10px]">
            <div className={styles.avatar}>
              <Image
                src={data.avatar}
                alt=""
                width={viewport === 'lg' ? 40 : 60}
                height={viewport === 'lg' ? 40 : 60}
                layout="responsive"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroCard

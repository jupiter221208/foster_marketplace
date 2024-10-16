import React from 'react'

// styles
import styles from './index.module.scss'

const MerchProductCard = props => {
  const { data, onSelectedCard } = props

  return (
    <div className={styles.container}>
      <div className={styles.imageArea} onClick={() => onSelectedCard(data)}>
        <div className={styles.imageContent}>
          <img src={data.image} alt="" />
        </div>
      </div>
      <div className="w-full mt-[10px]">
        <div className={styles.name}>{data.name}</div>
      </div>
      <div className="w-full mt-[10px]">
        <div className={styles.description}>{data.description}</div>
      </div>
      <div className="w-full h-[20px] mt-[15px] lg:mt-[20px] flex justify-between">
        <div className="flex gap-[9px]">
          {data.color.map((item, index) => {
            return (
              <div
                key={index}
                className={
                  item === 'white'
                    ? styles.whiteColor
                    : item === 'black'
                    ? styles.blackColor
                    : item === 'blue'
                    ? styles.blueColor
                    : item === 'red'
                    ? styles.redColor
                    : item === 'gray'
                    ? styles.grayColor
                    : item === 'green'
                    ? styles.greenColor
                    : item === 'pink'
                    ? styles.pinkColor
                    : styles.purpleColor
                }
              />
            )
          })}
        </div>
        <div className={styles.size}>{data.size}</div>
      </div>
    </div>
  )
}

export default MerchProductCard

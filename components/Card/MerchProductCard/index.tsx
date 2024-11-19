import React from 'react'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'

const MerchProductCard = props => {
  const { data, onSelectedCard } = props

  return (
    <div className={styles.container}>
      <div className={styles.imageArea} onClick={() => onSelectedCard(data)}>
        <div className={styles.imageContent}>
          <ImageWithFoster src={data.image} className="w-full h-full object-cover" />
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
                    : item === 'gray_dark'
                    ? styles.grayDarkColor
                    : item === 'gray_middle'
                    ? styles.grayMiddleColor
                    : item === 'green'
                    ? styles.greenColor
                    : item === 'pink'
                    ? styles.pinkColor
                    : item === 'yellow'
                    ? styles.yellowColor
                    : item === 'red_pink'
                    ? styles.redWhiteColor
                    : item === 'dark_gray'
                    ? styles.darkGrayColor
                    : item === 'black-1D1D1D'
                    ? styles.black1D1D1DColor
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

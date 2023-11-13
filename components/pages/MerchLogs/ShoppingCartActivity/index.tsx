import React, { useEffect, useState } from 'react'

// components
import CreatorSearchSection from '../CreatorSearchSection'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// json

// functions

// styles
import styles from './index.module.scss'
import SimpleCheckbox from 'components/Checkbox/SimpleCheckbox'

const ShoppingCartActivity = props => {
  const { data } = props

  return (
    <div className={styles.container}>
      <div className={styles.title}>Studio Shopping Cart</div>
      <div className={styles.subTitle}>Deselected all items</div>
      <div className={styles.listContainer}>
        {data &&
          data.map(
            array =>
              array &&
              array.map((item, index) => (
                <div key={index}>
                  {item?.imgUrl && (
                    <>
                      <div className={styles.divider}></div>
                      <div className="w-full h-full flex flex-row justify-between ml-[40px]">
                        <div className="flex items-center">
                          <SimpleCheckbox />
                        </div>
                        <div className="w-[30%] h-[30%] flex ">
                          <img src={item.imgUrl} className="px-[50px] py-[50px]" alt="Item Image" />
                        </div>
                        <div></div>
                        <div className="w-full flex justify-between px-3 mt-[30px]">
                          <div className={`${styles.value} w-[200px] text-right`}>
                            <p dangerouslySetInnerHTML={{ __html: item.name }} />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
          )}
      </div>
      <div className={`${styles.divider} mb-[50px]`}></div>
    </div>
  )
}

export default ShoppingCartActivity

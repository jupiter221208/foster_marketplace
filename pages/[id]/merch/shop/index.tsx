import React, { useState, useEffect } from 'react'
import MerchShopCard from 'components/Card/MerchShopCard'

// styles
import styles from './index.module.scss'
import MerchPhysicalCard from 'components/Card/MerchPysicalCard'

//apis
import StoreAPI from 'apis/store'
import { error } from 'console'

const CreatorMerchShop = props => {
  const { username } = props
  const [merchList, setMerchList] = useState([])
  const [physicalList, setPhysicalList] = useState([])

  useEffect(() => {
    StoreAPI.getStoreItemByFoster(53).then(
      res => {
        setMerchList(res)
      },
      error => {}
    )

    StoreAPI.getStoreItemByUser(53).then(
      res => {
        setPhysicalList(res)
      },
      error => {}
    )
  }, [])

  return (
    <div className="w-full">
      <div className={styles.title}>Available merch for sale</div>
      <div className="grid grid-cols-10 sm:grid-cols-20 gap-[9px] sm:gap-[20px] sm:gap-[20px] xl:gap-[30px] mt-[30px]">
        {merchList.map((item, index) => (
          <div className="col-span-5 sm:col-span-10 lg:col-span-5 2xl:col-span-4" key={index}>
            <MerchShopCard username={username} data={item} />
          </div>
        ))}
      </div>

      {/* <div className={`${styles.title} mt-[20px] lg:mt-[50px]`}>Merch editions</div>
      <div className="grid grid-cols-10 sm:grid-cols-20 gap gap-[20px] sm:gap-[20px] xl:gap-[30px] mt-[30px]">
        {merchList.map((item, index) => (
          <div className="col-span-5 sm:col-span-10 lg:col-span-5 2xl:col-span-4" key={index}>
            <MerchShopCard username={username} data={item} />
          </div>
        ))}
      </div>
 */}
      <div className={`${styles.title} mt-[20px] lg:mt-[50px]`}>Physicals by {username}</div>
      <div className="grid grid-cols-1 sm:grid-cols-20 gap gap-[20px] sm:gap-[20px] xl:gap-[30px] mt-[30px]">
        {physicalList.map((item, index) => (
          <div className="col-span-1 sm:col-span-10 lg:col-span-5 2xl:col-span-4" key={index}>
            <MerchPhysicalCard username={username} data={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreatorMerchShop

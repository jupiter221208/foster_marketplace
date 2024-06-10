import React, { useState, useEffect } from 'react'
import MerchShopCard from 'components/Card/MerchShopCard'

// json
import merchImageFront from 'assets/images/merch-order-front.png'
import merchImageBack from 'assets/images/merch-order-back.png'
import merchImageLeft from 'assets/images/merch-order-left.png'

import physicalImageFront from 'assets/images/merch-physical-front.jpg'
import physicalImageBack from 'assets/images/merch-physical-back.jpg'
import physicalImageRight from 'assets/images/merch-physical-right.jpg'
import physicalImageLeft from 'assets/images/merch-physical-left.jpg'

// styles
import styles from './index.module.scss'

const CreatorMerchShop = props => {
  const { username } = props
  const [merchList, setMerchList] = useState([])
  const [physicalList, setPhysicalList] = useState([])
  useEffect(() => {
    setMerchList([
      {
        id: 123,
        assets: [merchImageFront, merchImageBack, merchImageLeft],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
      {
        id: 124,
        assets: [merchImageFront, merchImageBack, merchImageLeft],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
      {
        id: 125,
        assets: [merchImageFront, merchImageBack, merchImageLeft],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
      {
        id: 126,
        assets: [merchImageFront, merchImageBack, merchImageLeft],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
      {
        id: 127,
        assets: [merchImageFront, merchImageBack, merchImageLeft],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
    ])

    setPhysicalList([
      {
        id: 123,
        assets: [physicalImageFront, physicalImageBack, physicalImageRight, physicalImageLeft],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
      {
        id: 124,
        assets: [physicalImageFront, physicalImageBack, physicalImageRight, physicalImageLeft],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
      {
        id: 125,
        assets: [physicalImageFront, physicalImageBack, physicalImageRight, physicalImageLeft],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
      {
        id: 126,
        assets: [physicalImageFront, physicalImageBack, physicalImageRight, physicalImageLeft],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
      {
        id: 127,
        assets: [physicalImageFront, physicalImageBack, physicalImageRight, physicalImageLeft],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
    ])
  }, [])

  return (
    <div className="w-full">
      <div className={styles.title}>Available merch for sale</div>
      <div className="grid grid-cols-1 sm:grid-cols-20 gap gap-[20px] sm:gap-[20px] xl:gap-[30px] mt-[30px]">
        {merchList.map((item, index) => (
          <div className="col-span-1 sm:col-span-10 lg:col-span-5 2xl:col-span-4" key={index}>
            <MerchShopCard username={username} data={item} />
          </div>
        ))}
      </div>

      <div className={`${styles.title} mt-[50px]`}>Merch editions</div>
      <div className="grid grid-cols-1 sm:grid-cols-20 gap gap-[20px] sm:gap-[20px] xl:gap-[30px] mt-[30px]">
        {merchList.map((item, index) => (
          <div className="col-span-1 sm:col-span-10 lg:col-span-5 2xl:col-span-4" key={index}>
            <MerchShopCard username={username} data={item} />
          </div>
        ))}
      </div>

      <div className={`${styles.title} mt-[50px]`}>Physicals by {username}</div>
      <div className="grid grid-cols-1 sm:grid-cols-20 gap gap-[20px] sm:gap-[20px] xl:gap-[30px] mt-[30px]">
        {physicalList.map((item, index) => (
          <div className="col-span-1 sm:col-span-10 lg:col-span-5 2xl:col-span-4" key={index}>
            <MerchShopCard type="physical" username={username} data={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreatorMerchShop

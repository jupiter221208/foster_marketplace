import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Image from 'next/image'
import ArtistLayout from 'components/Layout/ArtistLayout'

import ShopBanner from 'assets/images/merch-shop-banner.png'

// json
import TabList from 'assets/json/creator-merch/tab-list.json'
// styles
import styles from './index.module.scss'
import MerchShopCard from 'components/Card/MerchShopCard'

const CreatorMerchShop = () => {
  const [merchList, setMerchList] = useState([])
  useEffect(() => {
    setMerchList([
      {
        assets: [
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
        ],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
      {
        assets: [
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
        ],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
      {
        assets: [
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
        ],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
      {
        assets: [
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
        ],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
      {
        assets: [
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
        ],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
    ])
  }, [])

  return (
    <div className="w-full">
      <div className="grid grid-cols-20 gap gap-[11px] lg:gap-[20px] xl:gap-[30px]">
        {merchList.map((item, index) => (
          <div className="col-span-10 lg:col-span-5 2xl:col-span-4" key={index}>
            <MerchShopCard data={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreatorMerchShop

import React, { useState, useEffect } from 'react'
import MerchShopCard from 'components/Card/MerchShopCard'

// json

// styles
import styles from './index.module.scss'

const CreatorMerchShop = props => {
  const { username } = props
  const [merchList, setMerchList] = useState([])
  useEffect(() => {
    setMerchList([
      {
        id: 123,
        assets: [
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=900/https%3A%2F%2Farweave.net%2FxpAX_Uj698MWASLs4jUJD9PcrZBeYogUaJ9BOzFxbPk',
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
        ],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
      {
        id: 124,
        assets: [
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=900/https%3A%2F%2Farweave.net%2FxpAX_Uj698MWASLs4jUJD9PcrZBeYogUaJ9BOzFxbPk',
        ],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
      {
        id: 125,
        assets: [
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=900/https%3A%2F%2Farweave.net%2FxpAX_Uj698MWASLs4jUJD9PcrZBeYogUaJ9BOzFxbPk',
        ],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
      {
        id: 126,
        assets: [
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=900/https%3A%2F%2Farweave.net%2FxpAX_Uj698MWASLs4jUJD9PcrZBeYogUaJ9BOzFxbPk',
        ],
        productName: 'Product_name',
        merchType: 'Unisex Hoodie',
        price: '15',
      },
      {
        id: 127,
        assets: [
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM',
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=900/https%3A%2F%2Farweave.net%2FxpAX_Uj698MWASLs4jUJD9PcrZBeYogUaJ9BOzFxbPk',
        ],
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
        {merchList.map((item, index) => (
          <div className="col-span-1 sm:col-span-10 lg:col-span-5 2xl:col-span-4" key={index}>
            <MerchShopCard type="physical" username={username} data={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreatorMerchShop

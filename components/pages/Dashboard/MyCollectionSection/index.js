import React, { useState } from 'react'

// components
import CollectionCard from 'components/Card/CollectionCard'
import Pagination from 'components/Button/Pagination'

// json
import CollectionList from 'assets/json/dashboard/collection-list.json'

// styles
import styles from './index.module.scss'

const MyCollectionSection = props => {
  const { viewport } = props

  const [collectionList, setCollectionList] = useState([])

  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12">
        {collectionList.map((item, index) => (
          <div className="col-span-12 md:col-span-6 lg:col-span-3 gap-[34px]" key={index}>
            <CollectionCard
              image={item.image}
              nftName={item.nftName}
              nftType={item.nftType}
              artistName={item.artistName}
              nfts={item.nfts}
              icon={item.icon}
              price={item.price}
              viewport={viewport}
            />
          </div>
        ))}
      </div>
      <div className="w-full flex justify-end">
        <Pagination data={CollectionList} getCurrentData={data => setCollectionList(data)} />
      </div>
    </section>
  )
}

export default MyCollectionSection

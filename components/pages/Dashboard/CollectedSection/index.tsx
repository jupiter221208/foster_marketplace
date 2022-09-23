import React, { useState } from 'react'

// components
import DashboardNFTCard from 'components/Card/DashboardNFTCard'
import Pagination from 'components/Button/Pagination'

// json
import NFTList from 'assets/json/artist-profile/nft-list.json'

// styles
import styles from './index.module.scss'

const CollectedSection = props => {
  const { onClickItem } = props

  const [nftList, setNFTList] = useState([])

  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12">
        {nftList.map((item: any, index) => (
          <div className="col-span-6 md:col-span-6 lg:col-span-3 gap-[34px]" key={index}>
            <DashboardNFTCard
              image={item.image}
              nftName={item.nftName}
              artistName={item.artistName}
              price={item.price}
              showCount={false}
              onClick={onClickItem}
            />
          </div>
        ))}
      </div>
      <div className="w-full flex justify-end">
        <Pagination data={NFTList} getCurrentData={data => setNFTList(data)} />
      </div>
    </section>
  )
}

export default CollectedSection

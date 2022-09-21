import React, { useState } from 'react'

// components
import Pagination from 'components/Button/Pagination'

// json
import NFTList from 'assets/json/live-auction.json'

// styles
import styles from './index.module.scss'
import DetailNFTCard from 'components/Card/DetailNFTCard'

const DetailCollectedSection = props => {
  const { viewport } = props

  const [nftList, setNFTList] = useState([])

  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12">
        {nftList.map((item: any, index) => (
          <div className="col-span-6 md:col-span-6 lg:col-span-3 gap-[34px]" key={index}>
            <DetailNFTCard viewport={viewport} image={item.image} nftName={item.nftName} artistName={item.artistName} />
          </div>
        ))}
      </div>
      <div className="w-full flex justify-end">
        <Pagination data={NFTList} getCurrentData={data => setNFTList(data)} viewport={viewport} />
      </div>
    </section>
  )
}

export default DetailCollectedSection

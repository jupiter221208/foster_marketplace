import React, { useState } from 'react'

// next components
import { useRouter } from 'next/router'

// components
import OutlineButton from 'components/Button/OutlineButton'
import NFTCard from 'components/Card/NFTCard'
import Pagination from 'components/Button/Pagination'

// json
import NFTList from 'assets/json/artist-profile/nft-list.json'

// styles
import styles from './index.module.scss'

const CollectedSection = props => {
  const { viewport } = props
  const router = useRouter()

  const [nftList, setNFTList] = useState([])

  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12">
        {nftList.map((item, index) => (
          <div className="col-span-12 md:col-span-6 lg:col-span-3 gap-[34px]" key={index}>
            <NFTCard
              viewport={viewport}
              image={item.image}
              nftName={item.nftName}
              artistName={item.artistName}
              price={item.price}
              showCount={false}
              onClick={() => router.push('/browse-nft')}
            />
          </div>
        ))}
      </div>
      <div className="w-full flex justify-end">
        <Pagination data={NFTList} getCurrentData={data => setNFTList(data)} viewport={viewport} />
      </div>
    </section>
  )
}

export default CollectedSection

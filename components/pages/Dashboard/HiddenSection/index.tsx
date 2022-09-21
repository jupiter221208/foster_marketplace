import React, { useState } from 'react'

// next components
import { useRouter } from 'next/router'

// components
import Button from 'components/Button'
import UpdateNFTCard from 'components/Card/UpdateNFTCard'
import UpdateCollectionCard from 'components/Card/UpdateCollectionCard'
import Pagination from 'components/Button/Pagination'

// json
import NFTList from 'assets/json/dashboard/nft-list.json'
import CollectionList from 'assets/json/dashboard/collection-list.json'

// styles
import styles from './index.module.scss'

const HiddenSection = props => {
  const { viewport } = props
  const router = useRouter()

  const [nftList, setNFTList] = useState([])
  const [collectionList, setCollectionList] = useState([])

  const [active, setActive] = useState(0)

  const handleChangeActive = value => {
    setActive(value)
  }

  return (
    <section className={styles.container}>
      <div className="flex">
        <Button
          label="Single NFTs"
          onClick={() => handleChangeActive(0)}
          color={active === 0 ? '#202427' : '#979EA2'}
          backgroundColor={active === 0 ? '#5ac3ba' : 'transparent'}
        />
        <Button
          label="Collections"
          onClick={() => handleChangeActive(1)}
          color={active === 1 ? '#202427' : '#979EA2'}
          backgroundColor={active === 1 ? '#5ac3ba' : 'transparent'}
        />
      </div>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12">
        {active === 0 &&
          nftList.map((item: any, index) => (
            <div className="col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <UpdateNFTCard
                viewport={viewport}
                image={item.image}
                nftName={item.nftName}
                artistName={item.artistName}
                price={item.price}
                showCount={false}
                onClick={() => {}}
              />
            </div>
          ))}

        {active === 1 &&
          collectionList.length !== 0 &&
          collectionList.map((item: any, index) => (
            <div className="col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <UpdateCollectionCard
                image={item.image}
                nftName={item.nftName}
                category={item.category}
                artistName={item.artistName}
                mintAddress={item.mintAddress}
                price={item.price}
                viewport={viewport}
              />
            </div>
          ))}
      </div>
      <div className="w-full flex justify-end">
        {active === 0 && <Pagination data={NFTList} getCurrentData={data => setNFTList(data)} viewport={viewport} />}
        {active === 1 && (
          <Pagination data={CollectionList} getCurrentData={data => setCollectionList(data)} viewport={viewport} />
        )}
      </div>
    </section>
  )
}

export default HiddenSection

import React, { useState } from 'react'

// next components
import { useRouter } from 'next/router'

// components
import Button from 'components/Button'
import EcosystemCard from 'components/Card/EcosystemCard'
import NFTCard from 'components/Card/NFTCard'
import CollectionCard from 'components/Card/CollectionCard'
import Pagination from 'components/Button/Pagination'

// json
import ArtistList from 'assets/json/dashboard/artist-list.json'
import NFTList from 'assets/json/dashboard/nft-list.json'
import CollectionList from 'assets/json/dashboard/collection-list.json'

// styles
import styles from './index.module.scss'

const FavoriteSection = () => {
  const router = useRouter()

  const [artistList, setArtistList] = useState([])
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
          label="Artists"
          onClick={() => handleChangeActive(0)}
          color={active === 0 ? '#202427' : '#979EA2'}
          backgroundColor={active === 0 ? '#5ac3ba' : 'transparent'}
        />
        <Button
          label="Single NFTs"
          onClick={() => handleChangeActive(1)}
          color={active === 1 ? '#202427' : '#979EA2'}
          backgroundColor={active === 1 ? '#5ac3ba' : 'transparent'}
        />
        <Button
          label="Collections"
          onClick={() => handleChangeActive(2)}
          color={active === 2 ? '#202427' : '#979EA2'}
          backgroundColor={active === 2 ? '#5ac3ba' : 'transparent'}
        />
      </div>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12">
        {active === 0 &&
          artistList.map((item: any, index) => (
            <div className="col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <EcosystemCard data={item} onClick={() => router.push('/artist-profile')} />
            </div>
          ))}
        {active === 1 &&
          nftList.map((item: any, index) => (
            <div className="col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <NFTCard
                image={item.image}
                nftName={item.nftName}
                artistName={item.artistName}
                price={item.price}
                showCount={false}
                onClick={() => router.push('/browse-nft')}
              />
            </div>
          ))}

        {active === 2 &&
          collectionList.map((item: any, index) => (
            <div className="col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <CollectionCard
                image={item.image}
                nftName={item.nftName}
                category={item.category}
                artistName={item.artistName}
                mintAddress={item.mintAddress}
                nfts={item.nfts}
                icon={item.icon}
                price={item.price}
              />
            </div>
          ))}
      </div>
      <div className="w-full flex justify-end">
        {active === 0 && <Pagination data={ArtistList} getCurrentData={data => setArtistList(data)} />}
        {active === 1 && <Pagination data={NFTList} getCurrentData={data => setNFTList(data)} />}
        {active === 2 && <Pagination data={CollectionList} getCurrentData={data => setCollectionList(data)} />}
      </div>
    </section>
  )
}

export default FavoriteSection

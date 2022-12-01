import React, { useEffect, useState } from 'react'

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

// styles
import styles from './index.module.scss'

// call apis
import nftsAPI from 'apis/nfts'
import collectionsAPI from 'apis/collections'
import FilterButton from 'components/Button/FilterButton'

const FavoriteSection = () => {
  const router = useRouter()

  const [artistList, setArtistList] = useState([])
  const [allArtistList, setAllArtistList] = useState([])
  const [nftList, setNftList] = useState([])
  const [allNftList, setAllNftList] = useState([])
  const [collectionList, setCollectionList] = useState([])
  const [allCollectionList, setAllCollectionList] = useState([])

  const [active, setActive] = useState(0)

  const handleChangeActive = value => {
    if (value === 1) return
    setActive(value)
  }

  useEffect(() => {
    collectionsAPI.getFavorites().then(
      response => {
        setAllNftList(response)
      },
      error => {
        console.log(error)
      }
    )
  }, [])

  return (
    <section className={styles.container}>
      <div className="flex">
        <FilterButton
          label="Single NFTs"
          onClick={() => handleChangeActive(0)}
          color={active === 0 ? '#5AC3BA' : '#979EA2'}
          background={
            active === 0 ? 'linear-gradient(to bottom, rgba(18, 18, 18, 100%), rgba(32, 36, 39, 100%))' : 'transparent'
          }
        />
        <FilterButton
          label="Collections"
          onClick={() => handleChangeActive(1)}
          color={active === 1 ? '#5AC3BA' : '#979EA2'}
          background={
            active === 1 ? 'linear-gradient(to bottom, rgba(18, 18, 18, 100%), rgba(32, 36, 39, 100%))' : 'transparent'
          }
        />
      </div>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12">
        {active === 0 &&
          nftList.map((item: any, index) => (
            <div className="col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <NFTCard
                image={item.asset_url}
                nftName={item.nft_name}
                artistName={item.artist_username}
                price={item.list_price}
                onClick={() => {
                  router.push(`/browse-nft?id=${item.token_id}`)
                }}
              />
            </div>
          ))}

        {active === 1 &&
          collectionList.map((item: any, index) => (
            <div className="col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <CollectionCard
                image={item.asset_url}
                nftName={item.nft_name}
                category={item.category}
                artistName={item.artist_username}
                mintAddress={item.token_id}
              />
            </div>
          ))}
      </div>
      <div className="w-full flex justify-end">
        {active === 0 && <Pagination data={allNftList} getCurrentData={data => setNftList(data)} />}
        {active === 1 && <Pagination data={allCollectionList} getCurrentData={data => setCollectionList(data)} />}
      </div>
    </section>
  )
}

export default FavoriteSection

import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'

// components
import NFTCard from 'components/Card/NFTCard'
import CollectionCard from 'components/Card/CollectionCard'
import Pagination from 'components/Button/Pagination'
import LoadingModal from 'components/Modal/LoadingModal'
import FilterButton from 'components/Button/FilterButton'
import NoDataSection from '../NoDataSection'

// styles
import styles from './index.module.scss'

// call apis
import userAPI from 'apis/user'
import nftAPI from 'apis/nfts'
import collectionAPI from 'apis/collections'

const FavoriteSection = () => {
  const router = useRouter()

  const dispatch = useDispatch()

  const [nftList, setNftList] = useState([])
  const [allNftList, setAllNftList] = useState([])
  const [collectionList, setCollectionList] = useState([])
  const [allCollectionList, setAllCollectionList] = useState([])

  const [active, setActive] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleChangeActive = value => {
    setActive(value)
  }

  useEffect(() => {
    setLoading(true)

    getFavoriteNftData()
    getFavoriteCollectionData()
  }, [])

  const getFavoriteNftData = () => {
    userAPI.getFavoriteNFT().then(
      response => {
        setAllNftList(response)
        setLoading(false)
        setTimeout(() => {
          setIsLoaded(true)
        }, 500)
      },
      error => {
        console.log(error)
        setLoading(false)
        setTimeout(() => {
          setIsLoaded(true)
        }, 500)
      }
    )
  }

  const getFavoriteCollectionData = () => {
    userAPI.getFavoriteCollection().then(
      response => {
        setAllCollectionList(response)
      },
      error => {
        console.log(error)
      }
    )
  }

  const unSaveNft = tokenId => {
    nftAPI.unsaveNft(tokenId).then(
      response => {
        getFavoriteNftData()
      },
      error => {}
    )
  }

  const unSaveCollection = collectionId => {
    console.log(collectionId)
    collectionAPI.unsaveCollection(collectionId).then(
      response => {
        getFavoriteCollectionData()
      },
      error => {}
    )
  }

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
          !loading &&
          nftList.map((item: any, index) => (
            <div className="col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <NFTCard
                image={item.asset_url}
                nftName={item.nft_name}
                assetType={item.asset_type}
                coverImage={item.cover_image_url}
                artistName={item.artist_username}
                price={item.list_price}
                onClick={() => {
                  router.push(`/browse-nft?id=${item.token_id}`)
                }}
                unSave={() => unSaveNft(item.token_id)}
              />
            </div>
          ))}

        {active === 1 &&
          !loading &&
          collectionList.map((item: any, index) => (
            <div className="col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <CollectionCard
                image={item.cover_image}
                nftName={item.collection_name}
                artistName={item.artist_username}
                mintAddress={item.collection_id}
                onClick={() => {
                  dispatch({ type: 'set', isLoading: true })
                  router.push(`/browse-collection/${item.collection_id}`)
                }}
                unSave={() => unSaveCollection(item.collection_id)}
              />
            </div>
          ))}
        <div className="col-span-12">
          <LoadingModal open={loading} />
        </div>
      </div>
      {isLoaded && nftList.length === 0 && (
        <div className="mt-[15px] lg:mt-[30px]">
          <NoDataSection
            title={active === 0 ? "You don't have any saved artwork" : "You don't have any saved collections"}
            description={
              active === 0
                ? "You can add artwork to your favorites by clicking the 'save' icon on the NFT detail page"
                : "You can save a collection by clicking 'save' from the collection page"
            }
          />
        </div>
      )}
      <div className="w-full flex justify-end">
        {active === 0 && <Pagination data={allNftList} getCurrentData={data => setNftList(data)} />}
        {active === 1 && <Pagination data={allCollectionList} getCurrentData={data => setCollectionList(data)} />}
      </div>
    </section>
  )
}

export default FavoriteSection

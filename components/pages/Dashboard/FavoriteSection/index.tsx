import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'

// components
import CollectionCard from 'components/Card/CollectionCard'
import LoadingModal from 'components/Modal/LoadingModal'
import NoDataSection from '../NoDataSection'

// styles
import styles from './index.module.scss'

// call apis
import userAPI from 'apis/user'
import nftAPI from 'apis/nfts'
import collectionAPI from 'apis/collections'
import LoadingComponent from 'pages/profile/LoadingComponent'
import LoadingElement from 'pages/profile/LoadingComponent/LoadingElement'
import { NftData } from 'types/nft'
import DropdownFilterMenu from 'components/Menu/DropdownFilterMenu'
import NewNftCard from 'components/Card/NewNftCard'

const FavoriteSection = () => {
  const router = useRouter()

  const dispatch = useDispatch()

  const [nftList, setNftList] = useState<NftData[]>([])
  const [allNftList, setAllNftList] = useState<NftData[]>([])
  const [collectionList, setCollectionList] = useState<NftData[]>([])

  const [active, setActive] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [filterList, setFilterList] = useState([
    { id: 0, label: 'Artwork' },
    { id: 1, label: 'Collections' },
  ])
  const [selectedItem, setSelectedItem] = useState({ id: 0, label: 'Artwork' })

  useEffect(() => {
    setLoading(true)

    getFavoriteNftData()
    getFavoriteCollectionData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getFavoriteNftData = () => {
    userAPI.getFavoriteNFT().then(
      response => {
        setAllNftList(response)
        setLoading(false)
        setTimeout(() => {
          setIsLoaded(true)
        }, 500)

        setTimeout(() => {
          dispatch({ type: 'set', isLoading: false })
        }, 2000)
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
        const list = response.filter(
          (obj, index) => response.findIndex(item => item.collection_id === obj.collection_id) === index
        )
        setCollectionList(list)
        setTimeout(() => {
          dispatch({ type: 'set', isLoading: false })
        }, 2000)
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
        setTimeout(() => {
          dispatch({ type: 'set', isLoading: false })
        }, 1000)
      },
      error => {
        setTimeout(() => {
          dispatch({ type: 'set', isLoading: false })
        }, 1000)
      }
    )
  }

  const unSaveCollection = collectionId => {
    collectionAPI.unsaveCollection(collectionId).then(
      response => {
        getFavoriteCollectionData()
        setTimeout(() => {
          dispatch({ type: 'set', isLoading: false })
        }, 1000)
      },
      error => {
        setTimeout(() => {
          dispatch({ type: 'set', isLoading: false })
        }, 1000)
      }
    )
  }

  const [rowCount, setRowCount] = useState(12)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)

  useEffect(() => {
    if (active === 0) {
      if (allNftList.length > rowCount) setIsVisibleFetching(true)
      setNftList(allNftList.slice(0, rowCount))
    } else {
      if (collectionList.length > rowCount) setIsVisibleFetching(true)
      setNftList(collectionList.slice(0, rowCount))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allNftList, collectionList, active])

  useEffect(() => {
    if (isFetching) {
      setIsFetching(false)
      if (active === 0) {
        if (nftList.length + rowCount > allNftList.length) {
          setNftList([...nftList, ...allNftList.slice(nftList.length, allNftList.length)])
          setIsVisibleFetching(false)
        } else {
          setNftList([...nftList, ...allNftList.slice(nftList.length, nftList.length + rowCount)])
          setIsVisibleFetching(true)
        }
      } else {
        if (nftList.length + rowCount > collectionList.length) {
          setNftList([...nftList, ...collectionList.slice(nftList.length, collectionList.length)])
          setIsVisibleFetching(false)
        } else {
          setNftList([...nftList, ...collectionList.slice(nftList.length, nftList.length + rowCount)])
          setIsVisibleFetching(true)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching])

  return (
    <section className={styles.container}>
      <div className="w-full flex z-10">
        <DropdownFilterMenu
          label={selectedItem['label']}
          data={filterList}
          selectedItem={selectedItem}
          setSelectedItem={item => {
            setSelectedItem(item)
            setActive(item.id)
          }}
        />
      </div>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] 2xl:gap-[60px] grid grid-cols-12">
        {active === 0 &&
          !loading &&
          nftList.map(
            (item: any, index) =>
              item.nft_name && (
                <div className="col-span-12 lg:col-span-4 2xl:col-span-3 gap-[34px]" key={index}>
                  <NewNftCard
                    token_id={item.token_id}
                    image={item.asset_url}
                    nftName={item.nft_name}
                    assetType={item.asset_type}
                    coverImage={item.cover_image_url}
                    artistName={item.artist_username}
                    collectionName={item.collection_name}
                    price={item.list_price}
                    onClick={() => {
                      router.push(`/nft/${item.token_id}`)
                    }}
                    unSave={() => unSaveNft(item.token_id)}
                  />
                </div>
              )
          )}

        {active === 1 &&
          !loading &&
          collectionList.map((item: any, index) => (
            <div className="col-span-12 lg:col-span-4 2xl:col-span-3 gap-[34px]" key={index}>
              <CollectionCard
                image={item.cover_image}
                nftName={item.collection_name}
                artistName={item.artist_username}
                mintAddress={item.collection_id}
                link={`/collection/${item.collection_id}`}
                unSave={() => unSaveCollection(item.collection_id)}
              />
            </div>
          ))}
        {loading && (
          <div className="col-span-12">
            <LoadingElement text="Loading favorites" />
          </div>
        )}
      </div>
      {isLoaded && nftList.length === 0 && (
        <div className="mt-[15px] lg:mt-[25px]">
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
      {!loading && isVisibleFetching && (
        <div className="w-full mt-[100px] mb-[40px]">
          <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} text="Loading favorites" />
        </div>
      )}
    </section>
  )
}

export default FavoriteSection

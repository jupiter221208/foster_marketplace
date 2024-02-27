import React, { useState, useEffect } from 'react'

// components
import Pagination from 'components/Button/Pagination'
import LoadingModal from 'components/Modal/LoadingModal'

// json

// styles
import styles from './index.module.scss'

// api
import userAPI from 'apis/user'
import CollectionCard from 'components/Card/CollectionCard'
import NoDataSection from '../NoDataSection'
import LoadingComponent from 'pages/explore/LoadingComponent'
import { NftData } from 'types/nft'

const CollectedSection = props => {
  const { onClickItem } = props

  const [nftList, setNFTList] = useState<NftData[]>([])
  const [allNftList, setAllNFTList] = useState<NftData[]>([])
  const [loading, setLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)
  const [rowCount, setRowCount] = useState(12)

  useEffect(() => {
    setLoading(true)
    userAPI.getCollected().then(
      response => {
        if (response !== null && response.length > 0) {
          setAllNFTList(response)
        }
        setLoading(false)
        setTimeout(() => {
          setIsLoaded(true)
        }, 500)
      },
      error => {
        setLoading(false)
        setIsLoaded(true)
        console.log(error)
      }
    )
  }, [])

  useEffect(() => {
    if (allNftList.length > rowCount) setIsVisibleFetching(true)
    setNFTList(allNftList.slice(0, rowCount))
  }, [allNftList])

  useEffect(() => {
    if (isFetching) {
      setIsFetching(false)
      if (nftList.length + rowCount > allNftList.length) {
        setNFTList([...nftList, ...allNftList.slice(nftList.length, allNftList.length)])
        setIsVisibleFetching(false)
      } else {
        setNFTList([...nftList, ...allNftList.slice(nftList.length, nftList.length + rowCount)])
        setIsVisibleFetching(true)
      }
    }
  }, [isFetching])

  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[0px] gap-4 lg:gap-[34px] grid grid-cols-12">
        {!loading &&
          nftList.map((item: any, index) => (
            <div className="col-span-6 md:col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <CollectionCard
                image={item.cover_image}
                nftName={item.collection_name}
                artistName={item.artist_username}
                collectionName={item.collection_name}
                mintAddress={item.artist_id}
                icon={item.artist_profile_picture}
                key={index}
                link={`/collection/${item.collection_id}`}
              />
            </div>
          ))}
        <div className="col-span-12">
          <LoadingModal open={loading} />
        </div>
      </div>
      {isLoaded && nftList.length === 0 && (
        <div className="mt-[35px] lg:mt-[65px]">
          <NoDataSection
            title="No collectibles detected"
            description="This tab displays the items you collected that are part of a collection"
          />
        </div>
      )}
      {!loading && isVisibleFetching && (
        <div className="w-full mt-[-100px] mb-[40px]">
          <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
        </div>
      )}
      {/* {allNftList.length > 0 && (
        <div className="w-full flex justify-end">
          <Pagination data={allNftList} getCurrentData={data => setNFTList(data)} />
        </div>
      )} */}
    </section>
  )
}

export default CollectedSection

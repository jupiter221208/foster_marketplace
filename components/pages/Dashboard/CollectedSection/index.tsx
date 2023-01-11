import React, { useState, useEffect } from 'react'

// components
import Pagination from 'components/Button/Pagination'
import LoadingModal from 'components/Modal/LoadingModal'

// json
import NFTList from 'assets/json/artist-profile/nft-list.json'

// styles
import styles from './index.module.scss'

// api
import userAPI from 'apis/user'
import CollectionCard from 'components/Card/CollectionCard'
import NoDataSection from '../NoDataSection'

const CollectedSection = props => {
  const { onClickItem } = props

  const [nftList, setNFTList] = useState([])
  const [allNftList, setAllNFTList] = useState([])
  const [loading, setLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

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

  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12">
        {!loading &&
          nftList.map((item: any, index) => (
            <div className="col-span-6 md:col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <CollectionCard
                image={item.cover_image}
                nftName={item.collection_name}
                artistName={item.artist_username}
                mintAddress={item.artist_id}
                icon={item.artist_profile_picture}
                key={index}
                onClick={() => onClickItem(item.collection_id)}
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
            description="This tab displays the collections you supported when collecting one or more collection items"
          />
        </div>
      )}
      {nftList.length > 0 && (
        <div className="w-full flex justify-end">
          <Pagination data={allNftList} getCurrentData={data => setNFTList(data)} />
        </div>
      )}
    </section>
  )
}

export default CollectedSection

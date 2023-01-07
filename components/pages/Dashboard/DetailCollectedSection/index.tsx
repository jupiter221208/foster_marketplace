import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

// components
import Pagination from 'components/Button/Pagination'

// styles
import styles from './index.module.scss'

// api
import userAPI from 'apis/user'
import NFTCard from 'components/Card/NFTCard'

const DetailCollectedSection = props => {
  const { collectionId } = props
  const dispatch = useDispatch()
  const router = useRouter()

  const [nftList, setNFTList] = useState([])
  const [allNftList, setAllNftList] = useState([])

  useEffect(() => {
    if (collectionId !== null) {
      userAPI.getCollectedNFT(collectionId).then(
        response => {
          if (response !== null && response.length > 0) setAllNftList(response)
        },
        error => {
          console.log(error)
        }
      )
    }
  }, [collectionId])
  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12">
        {nftList.map((item: any, index) => (
          <div className="col-span-6 md:col-span-6 lg:col-span-3 gap-[34px]" key={index}>
            <NFTCard
              image={item.asset_url}
              nftName={item.nft_name}
              artistName={item.artist_username}
              assetType={item.asset_type}
              coverImage={item.cover_image_url}
              price={item.list_price}
              onClick={() => {
                dispatch({ type: 'set', isLoading: true })
                router.push(`/browse-nft?id=${item.token_id}`)
              }}
              key={index}
            />
          </div>
        ))}
      </div>
      <div className="w-full flex justify-end">
        <Pagination data={allNftList} getCurrentData={data => setNFTList(data)} />
      </div>
    </section>
  )
}

export default DetailCollectedSection

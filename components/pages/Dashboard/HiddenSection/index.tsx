import React, { useEffect, useState } from 'react'
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

// api
import userAPI from 'apis/user'
import NFTCard from 'components/Card/DashboardNFTCard'
import LoadingModal from 'components/Modal/LoadingModal'

const HiddenSection = () => {
  const router = useRouter()
  const [nftList, setNftList] = useState([])
  const [allNftList, setAllNftList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    getHiddenNftData()
  }, [])

  const getHiddenNftData = () => {
    userAPI.getHiddenNFT().then(
      response => {
        setAllNftList(response)
        setLoading(false)
      },
      error => {
        console.log(error)
      }
    )
  }

  return (
    <section className={styles.container}>
      {!loading && allNftList.length === 0 && (
        <div className={styles.comingSoon}>This feature is not available but is coming soon.</div>
      )}
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12">
        {!loading &&
          nftList.map((item: any, index) => (
            <div className="col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <NFTCard
                image={item.asset_url}
                nftName={item.nft_name}
                assetType={item.asset_type}
                coverImage={item.cover_image_url}
                artistName={item.artist_username}
                onClick={() => {
                  router.push(`/browse-nft?id=${item.token_id}`)
                }}
              />
            </div>
          ))}
        <div className="col-span-12">
          <LoadingModal open={loading} />
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Pagination data={allNftList} getCurrentData={data => setNftList(data)} />
      </div>
    </section>
  )
}

export default HiddenSection

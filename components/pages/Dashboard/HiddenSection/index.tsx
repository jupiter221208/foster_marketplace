import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// components
import Pagination from 'components/Button/Pagination'

// json

// styles
import styles from './index.module.scss'

// api
import userAPI from 'apis/user'
import NFTCard from 'components/Card/DashboardNFTCard'
import LoadingModal from 'components/Modal/LoadingModal'
import DashboardNFTCard from 'components/Card/NFTCard'

const HiddenSection = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const unhideNftToken = useSelector(state => (state as any).unhideNftToken)

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

  useEffect(() => {
    if (unhideNftToken.length > 0) {
      let newNfts = allNftList.filter(item => item.token_id !== unhideNftToken)
      setAllNftList(newNfts)
      dispatch({ type: 'set', unhideNftToken: '' })
      dispatch({ type: 'set', isLoading: false })
    }
  }, [unhideNftToken])

  return (
    <section className={styles.container}>
      {!loading && allNftList.length === 0 && (
        <div className={styles.comingSoon}>This feature is not available but is coming soon.</div>
      )}
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12">
        {!loading &&
          nftList.map((item: any, index) => (
            <div className="col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <DashboardNFTCard
                token_id={item.token_id}
                image={item.asset_url}
                nftName={item.nft_name}
                assetType={item.asset_type}
                coverImage={item.cover_image_url}
                artistName={item.artist_username}
                showUnhideButton={true}
                onClick={() => {
                  router.push(`/nft/${item.token_id}`)
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

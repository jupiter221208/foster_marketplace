import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

// components

// json

// styles
import styles from './index.module.scss'

// api
import userAPI from 'apis/user'
import LoadingComponent from 'pages/profile/LoadingComponent'
import { DashboardAPIData } from 'types/nft'
import NewNftCard from 'components/Card/NewNftCard'
import LoadingElement from 'pages/profile/LoadingComponent/LoadingElement'

const HiddenSection = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const unhideNftToken = useSelector(state => (state as any).unhideNftToken)

  const [nftList, setNftList] = useState<DashboardAPIData[]>([])
  const [allNftList, setAllNftList] = useState<DashboardAPIData[]>([])
  const [loading, setLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)
  const [rowCount, setRowCount] = useState(12)

  useEffect(() => {
    setLoading(true)

    getHiddenNftData()
  }, [])

  const getHiddenNftData = () => {
    userAPI.getHiddenNFT().then(
      response => {
        setAllNftList(response.filter(item => item.nft_name !== ''))
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unhideNftToken])

  useEffect(() => {
    if (allNftList.length > rowCount) setIsVisibleFetching(true)
    setNftList(allNftList.slice(0, rowCount))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allNftList])

  useEffect(() => {
    if (isFetching) {
      setIsFetching(false)
      if (nftList.length + rowCount > allNftList.length) {
        setNftList([...nftList, ...allNftList.slice(nftList.length, allNftList.length)])
        setIsVisibleFetching(false)
      } else {
        setNftList([...nftList, ...allNftList.slice(nftList.length, nftList.length + rowCount)])
        setIsVisibleFetching(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching])

  return (
    <section className={styles.container}>
      {!loading && allNftList.length === 0 && <div className={styles.comingSoon}>No hidden artworks found</div>}
      <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-[10px] lg:gap-[20px] xl:gap-[30px] z-10 mt-[16px] lg:mt-[30px]">
        {!loading &&
          nftList.map((item: any, index) => (
            <div key={index}>
              <NewNftCard
                token_id={item.token_id}
                image={item.asset_url}
                nftName={item.nft_name}
                artistImage={item.artist_profile_picture}
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
        {loading && (
          <div className="col-span-12 mt-[80px]">
            <LoadingElement text="Loading your hidden artwork" />
          </div>
        )}
      </div>
      {!loading && isVisibleFetching && (
        <div className="w-full mt-[80px] mb-[40px]">
          <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} text="Loading your hidden artwork" />
        </div>
      )}
    </section>
  )
}

export default HiddenSection

import React, { useState, useEffect } from 'react'
import MerchShopCard from 'components/Card/MerchShopCard'
import { getTimeDifference } from 'utils/helpers'

// components
import LoadingComponent from 'pages/explore/LoadingComponent'

//apis
import StoreAPI from 'apis/store'

// styles
import styles from './index.module.scss'

const CreatorMerchShop = props => {
  const { username, userAvatar, userId, isCreator } = props
  const [merchList, setMerchList] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(true)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    if (userId === undefined || userId === null) return
    StoreAPI.getStoreByUserId(userId, 1, 'all').then(
      res => {
        setIsVisibleFetching(false)
        let list = []
        res.map(item => {
          if (
            item.deleted_at === null &&
            (item.sale_end_at === null || getTimeDifference(item.sale_end_at) > 0) &&
            (item.supply === null || item.supply - item.current_supply > 0)
          ) {
            if (item.master_edition_address === null) {
              list.push(item)
            } else {
              if (isCreator) {
                if (item.master_edition_address?.length === 0) list.push(item)
                else if (
                  item.master_edition_address?.length > 0 &&
                  (item.listed_master_edition.endTime === null ||
                    getTimeDifference(item.listed_master_edition.endTime) > 0)
                ) {
                  list.push(item)
                }
              } else {
                if (
                  item.master_edition_address?.length > 0 &&
                  (item.listed_master_edition.endTime === null ||
                    getTimeDifference(item.listed_master_edition.endTime) > 0)
                ) {
                  list.push(item)
                }
              }
            }
          }
        })
        setMerchList(list)
        setLoaded(true)
      },
      error => {
        setLoaded(true)
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isCreator])

  return (
    <div className="w-full">
      {merchList.length > 0 ? (
        <div className="grid grid-cols-10 sm:grid-cols-20 gap-[9px] sm:gap-[20px] sm:gap-[20px] xl:gap-[30px] mt-[30px]">
          {merchList.map((item, index) => (
            <div className="col-span-5 sm:col-span-10 lg:col-span-5 2xl:col-span-4" key={item.id}>
              <MerchShopCard userAvatar={userAvatar} username={username} data={item} />
            </div>
          ))}
        </div>
      ) : loaded && !isVisibleFetching ? (
        <div className="w-full flex justify-center pt-[100px]">
          <div className={styles.noItem}>No merch items currently available.</div>
        </div>
      ) : (
        <></>
      )}
      {isVisibleFetching && (
        <div className="w-full h-[150px]">
          <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
        </div>
      )}
    </div>
  )
}

export default CreatorMerchShop

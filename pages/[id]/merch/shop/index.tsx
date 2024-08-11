import React, { useState, useEffect } from 'react'
import MerchShopCard from 'components/Card/MerchShopCard'

// styles
import styles from './index.module.scss'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

//apis
import StoreAPI from 'apis/store'
import { getTimeDifference } from 'utils/helpers'

const CreatorMerchShop = props => {
  const { username, userId, isCreator } = props
  const [merchList, setMerchList] = useState([])
  const [editionList, setEditionList] = useState([])
  const [physicalList, setPhysicalList] = useState([])
  const [screenWidth, setScreenWidth] = useState(375)

  useEffect(() => {
    const resizeFunction = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  useEffect(() => {
    if (userId === undefined || userId === null) return
    StoreAPI.getStoreByUserId(userId).then(
      res => {
        let list = []
        res.map(item => {
          if (
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
      },
      error => {}
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isCreator])

  return (
    <div className="w-full">
      <div className="grid grid-cols-10 sm:grid-cols-20 gap-[9px] sm:gap-[20px] sm:gap-[20px] xl:gap-[30px] mt-[30px]">
        {merchList.map((item, index) => (
          <div className="col-span-5 sm:col-span-10 lg:col-span-5 2xl:col-span-4" key={index}>
            <MerchShopCard username={username} data={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreatorMerchShop

import React, { useEffect, useState } from 'react'
import { useAuthentication } from 'hooks/useAuthentication'

// next components

// image

// components
import DropdownFilterMenu from 'components/Menu/DropdownFilterMenu'
import MerchEditionClaimCard from 'components/Card/MerchEditionClaimCard'

// styles
import styles from './index.module.scss'

// solana

// call apis
import StoreAPI from 'apis/store'
import LoadingElement from 'pages/profile/LoadingComponent/LoadingElement'

const MerchEditionSection = () => {
  const { profileInfo } = useAuthentication()

  const [active, setActive] = useState(0)
  const [filterList, setFilterList] = useState([
    { id: 0, label: 'Unclaimed' },
    { id: 1, label: 'Claimed' },
  ])
  const [merchList, setMerchList] = useState<any>([])
  const [selectedItem, setSelectedItem] = useState({ id: 0, label: 'Unclaimed' })
  const [filteredList, setFilteredList] = useState<any>([])
  const [isFetching, setIsFetching] = useState(false)
  const [claimedList, setClaimedList] = useState([])
  const [unclaimedList, setUnclaimedList] = useState([])

  useEffect(() => {
    if (profileInfo) {
      getMerchList()
    }
  }, [profileInfo])

  useEffect(() => {
    if (active === 0) {
      setMerchList(unclaimedList)
      setFilteredList(unclaimedList)
    } else {
      setMerchList(claimedList)
      setFilteredList(claimedList)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const getMerchList = () => {
    setIsFetching(false)
    StoreAPI.getStoreMerchEditions().then(
      response => {
        if (response) {
          let claimed = response.filter(item => item.order_id !== null)
          let unclaimed = response.filter(item => item.order_id === null)
          setClaimedList(claimed)
          setUnclaimedList(unclaimed)
          setMerchList(unclaimed)
          setFilteredList(unclaimed)
          setIsFetching(true)
        }
      },
      error => {
        setIsFetching(true)
      }
    )
  }

  const searchNFT = key => {
    if (key === '') {
      setFilteredList(merchList)
    } else {
      let filtered = []
      setFilteredList([])
      merchList.forEach(element => {
        if (element.name.toLowerCase().includes(key.toLowerCase())) filtered.push(element)
      })
      setFilteredList(filtered)
    }
  }

  return (
    <section className={styles.container}>
      <div className="w-full flex justify-between z-10 items-center">
        <div className={`${styles.description} lg:block hidden`}>
          {'Displayed are merch items included with an edition you purchased.'}
        </div>
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

      {isFetching && merchList.length === 0 && <div className={styles.comingSoon}>No results found.</div>}

      <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-[10px] lg:gap-[20px] xl:gap-[30px] z-10 mt-[16px] lg:mt-[30px]">
        {filteredList.map(item => (
          <div key={item.id}>
            <MerchEditionClaimCard data={item} />
          </div>
        ))}
      </div>

      {!isFetching && (
        <div className="w-full flex justify-center mt-[80px]">
          <LoadingElement text="Loading merch editions" />
        </div>
      )}
    </section>
  )
}

export default MerchEditionSection

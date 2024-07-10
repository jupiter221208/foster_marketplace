import React, { useEffect, useState } from 'react'
import { useAuthentication } from 'hooks/useAuthentication'

// next components

// image

// components
import DropdownFilterMenu from 'components/Menu/DropdownFilterMenu'
import DashboardSearchBox from 'components/Input/DashboardSearchBox'
import MerchEditionClaimCard from 'components/Card/MerchEditionClaimCard'
import Lottie from 'lottie-react'
import PreLoaderIcon from 'assets/lottery/preloader.json'

// styles
import styles from './index.module.scss'

// solana

// call apis
import StoreAPI from 'apis/store'

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

  useEffect(() => {
    if (profileInfo) {
      getMerchList()
    }
  }, [profileInfo])

  const getMerchList = () => {
    setIsFetching(false)
    StoreAPI.getStoreUnclaimed().then(
      response => {
        if (response) {
          setMerchList(response)
          setFilteredList(response)
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
      {isFetching && merchList.length > 0 && (
        <div className="w-full flex justify-between z-10">
          <DashboardSearchBox placeholder="Search" onChange={key => searchNFT(key)} />

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
      )}
      {isFetching && merchList.length === 0 && (
        <div className={styles.comingSoon}>You don&apos;t have any merch editions.</div>
      )}

      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] 2xl:gap-[60px] grid grid-cols-12 z-10">
        {filteredList.map(item => (
          <div className="col-span-12 lg:col-span-4 2xl:col-span-3 gap-[34px]" key={item.address}>
            <MerchEditionClaimCard data={item} />
          </div>
        ))}
      </div>

      {!isFetching && (
        <div className="w-full flex justify-center">
          <div className="w-[500px] h-[40px]">
            <Lottie width={500} height={40} animationData={PreLoaderIcon} loop={true} />
          </div>
        </div>
      )}
    </section>
  )
}

export default MerchEditionSection

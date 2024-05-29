import React, { useEffect, useState } from 'react'

// next components

// image
import merchImageFront from 'assets/images/merch-order-front.png'
import merchImageBack from 'assets/images/merch-order-back.png'
import merchImageLeft from 'assets/images/merch-order-left.png'

// components
import ListedNFTCard from 'components/Card/ListedNFTCard'

// styles
import styles from './index.module.scss'

// solana

// call apis

import DropdownFilterMenu from 'components/Menu/DropdownFilterMenu'
import DashboardSearchBox from 'components/Input/DashboardSearchBox'
import MerchEditionClaimCard from 'components/Card/MerchEditionClaimCard'

type SelectedDataType = {
  category: string
  name: string
  animation_url: string
  image: string
  address: string
  tradeStateAddress: string
}

const MerchEditionSection = props => {
  const { filter } = props
  const [active, setActive] = useState(0)
  const [filterList, setFilterList] = useState([
    { id: 0, label: 'Unclaimed' },
    { id: 1, label: 'Claimed' },
  ])
  const [merchList, setMerchList] = useState<any>([])
  const [selectedItem, setSelectedItem] = useState({ id: 0, label: 'Unclaimed' })
  const [filteredList, setFilteredList] = useState<any>([])

  useEffect(() => {
    let list = [
      {
        id: 0,
        product_name: 'Product Name1',
        edition_name: 'edition Name #1',
        urls: [merchImageFront, merchImageBack, merchImageLeft],
        avatar_url:
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
      },
      {
        id: 1,
        product_name: 'Product Name2',
        edition_name: 'edition Name #2',
        urls: [merchImageFront, merchImageBack, merchImageLeft],
        avatar_url:
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
      },
      {
        id: 2,
        product_name: 'Product Name3',
        edition_name: 'edition Name #3',
        urls: [merchImageFront, merchImageBack, merchImageLeft],
        avatar_url:
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
      },
      {
        id: 3,
        product_name: 'Product Name4',
        edition_name: 'edition Name #4',
        urls: [merchImageFront, merchImageBack, merchImageLeft],
        avatar_url:
          'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=360/https%3A%2F%2Farweave.net%2FWahgeZMr4XjfqsWupp2p4FMXIz1hfj6QYqBFHP3NGvU',
      },
    ]
    setMerchList(list)
    setFilteredList(list)
  }, [])

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

      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] 2xl:gap-[60px] grid grid-cols-12 z-10">
        {filteredList.map(item => (
          <div className="col-span-12 lg:col-span-4 2xl:col-span-3 gap-[34px]" key={item.address}>
            <MerchEditionClaimCard data={item} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default MerchEditionSection

import React, { useEffect, useState } from 'react'

// third party components
import { useWallet } from '@solana/wallet-adapter-react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import ActivityTable from 'components/Table/ActivityTable'
import ActivityAccordion from 'components/Accordion/ActivityAccordion'

// custom functions
import { useViewport } from 'utils'

// api
import ActivityAPI from 'apis/activity'
import NoDataSection from '../NoDataSection'
import LoadingComponent from 'pages/explore/LoadingComponent'
import LoadingModal from 'components/Modal/LoadingModal'
import { ActivityAPIData } from 'types/nft'
import DashboardSearchBox from 'components/Input/DashboardSearchBox'
import DropdownFilterMenu from 'components/Menu/DropdownFilterMenu'

const ActivitySection = () => {
  const viewport = useViewport()
  const [loading, setLoading] = useState(false)
  const [rowCount, setRowCount] = useState(10)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)
  const [activityList, setActivityList] = useState<ActivityAPIData[]>([])
  const [allList, setAllList] = useState<ActivityAPIData[]>([])
  const [filteredList, setFilteredList] = useState<ActivityAPIData[]>([])
  const [searchKey, setSearchKey] = useState('')
  const [filterKey, setFilterKey] = useState('')
  const [filterList, setFilterList] = useState([
    { id: 0, label: 'All Filter', search: '' },
    { id: 1, label: 'Auction Started', search: 'AuctionStarted' },
    { id: 2, label: 'Auction Cancelled', search: 'AuctionCancelled' },
    { id: 3, label: 'Listing Added', search: 'ListingAdded' },
    { id: 4, label: 'Listing Cancelled', search: 'ListingCancelled' },
    { id: 5, label: 'Offer Made', search: 'OfferMade' },
    { id: 6, label: 'Offer Cancelled', search: 'OfferCancelled' },
    { id: 7, label: 'Purchased', search: 'Purchased' },
    { id: 8, label: 'Auction Won', search: 'AuctionWon' },
    { id: 9, label: 'Bid Placed', search: 'BidPlaced' },
  ])
  const [selectedItem, setSelectedItem] = useState({ id: 0, label: 'All Filter', search: '' })

  const { publicKey } = useWallet()

  useEffect(() => {
    ActivityAPI.getUserActivity(publicKey?.toBase58()).then(response => {
      if (response.length === 0) {
        setLoading(true)
        return
      }
      let tempItem: ActivityAPIData[] = []
      response.reverse().map((item, index) => {
        tempItem.push(item)
      })
      setAllList(tempItem)
      setActivityList(tempItem)
      setFilteredList(tempItem.slice(0, rowCount))
      if (tempItem.length > rowCount) setIsVisibleFetching(true)
      setLoading(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey])

  useEffect(() => {
    if (isFetching) {
      setIsFetching(false)
      if (filteredList.length + rowCount > activityList.length) {
        setFilteredList([...filteredList, ...activityList.slice(filteredList.length, activityList.length)])
        setIsVisibleFetching(false)
      } else {
        setFilteredList([...filteredList, ...activityList.slice(filteredList.length, filteredList.length + rowCount)])
        setIsVisibleFetching(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching])

  const searchNFT = key => {
    setSearchKey(key)
    if (key === '') {
      if (filterKey === '') {
        setActivityList(allList)
        setFilteredList(allList.slice(0, rowCount))
      } else {
        let filtered = []

        allList.forEach(element => {
          if (element.action_type.toLowerCase().includes(filterKey.toLowerCase())) filtered.push(element)
        })
        setActivityList(filtered)
        setFilteredList(filtered.slice(0, rowCount))
      }
    } else {
      let filtered = []
      setFilteredList([])

      allList.forEach(element => {
        if (filterKey === '') {
          if (element.asset_name.toLowerCase().includes(key.toLowerCase())) filtered.push(element)
        } else if (
          element.asset_name.toLowerCase().includes(key.toLowerCase()) &&
          element.action_type.toLowerCase().includes(filterKey.toLowerCase())
        )
          filtered.push(element)
      })
      setActivityList(filtered)
      setFilteredList(filtered.slice(0, rowCount))
    }
  }

  useEffect(() => {
    setFilteredList([])

    if (filterKey === '') {
      if (searchKey === '') {
        setActivityList(allList)
        setFilteredList(allList.slice(0, rowCount))
      } else {
        let filtered = []
        setFilteredList([])

        allList.forEach(element => {
          if (filterKey === '')
            if (element.asset_name.toLowerCase().includes(searchKey.toLowerCase())) filtered.push(element)
        })
        setActivityList(filtered)
        setFilteredList(filtered.slice(0, rowCount))
      }
      return
    }

    let filtered = []
    allList.forEach(element => {
      if (searchKey === '') {
        if (element.action_type.toLowerCase().includes(filterKey.toLowerCase())) filtered.push(element)
      } else if (
        element.action_type.toLowerCase().includes(filterKey.toLowerCase()) &&
        element.asset_name.toLowerCase().includes(searchKey.toLowerCase())
      )
        filtered.push(element)
    })
    setActivityList(filtered)
    setFilteredList(filtered.slice(0, rowCount))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey])

  return (
    <section className="w-full mt-[16px] lg:mt-[0px] min-h-[600px]">
      <div className="lg:mt-[30px] w-full flex justify-between">
        <div>
          <DropdownFilterMenu
            label={selectedItem['label']}
            data={filterList}
            selectedItem={selectedItem}
            setSelectedItem={item => {
              setSelectedItem(item)
              setFilterKey(item.search)
            }}
          />
        </div>
        <div className="w-[185px] lg:w-[auto]">
          <DashboardSearchBox placeholder="Search" onChange={key => searchNFT(key)} />
        </div>
      </div>

      <div className="w-full z-10 mt-[10px] lg:mt-[-30px]">
        {loading === false ? (
          <div className="col-span-12">
            <LoadingModal open={!loading} />
          </div>
        ) : filteredList.length > 0 ? (
          <div>
            {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
              <ActivityTable data={filteredList} type={'dashboard'} />
            ) : (
              <ActivityAccordion data={filteredList} />
            )}
            {isVisibleFetching && (
              <div className="w-full mt-[-50px] mb-[40px]">
                <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
              </div>
            )}
          </div>
        ) : (
          <div className="mt-[40px] lg:mt-[130px]">
            <NoDataSection
              title="No activity history available"
              description="This tab displays a log of all your activity on Foster Marketplace"
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default ActivitySection

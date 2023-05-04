import React, { useEffect, useState } from 'react'

// third party components
import { Disclosure } from '@headlessui/react'

// components
import Radio from 'components/Radio'
import Checkbox from 'components/Checkbox'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

// json
import ArtistVerificationList from 'assets/json/explore/artist-verification.json'
import AvailabilityList from 'assets/json/explore/availability.json'
import DimensionList from 'assets/json/explore/dimension.json'
import MarketList from 'assets/json/explore/market.json'
import MediumList from 'assets/json/explore/medium.json'
import CategoryList from 'assets/json/popular-category.json'
import DownArrowIcon from 'assets/icons/down-arrow-icon.svg?component'

// styles
import styles from './index.module.scss'

const MobileNFTFilter = props => {
  const { category, availability, medium, market, onClose, onFilter } = props

  const [selectedVerifyType, setSelectedVerifyType] = useState<any>(ArtistVerificationList[2])
  const [selectedAvailability, setSelectedAvailability] = useState<any>(availability)
  const [selectedMarket, setSelectedMarket] = useState<any>(market)
  const [selectedMedium, setSelectedMedium] = useState<any>(medium)
  const [categoryList, setCategoryList] = useState<any[]>([])

  useEffect(() => {
    if (category.length > 0) {
      setCategoryList(category)
      return
    }
    let array: any[] = []
    CategoryList.map(item => {
      let object: any = item
      object.checked = false
      array.push(object)
    })
    setCategoryList(array)
  }, [])

  const handleSelectCategory = index => {
    let array = [...categoryList]
    array[index].checked = !array[index].checked
    setCategoryList(array)
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className="w-full flex justify-between items-center mb-8">
          <div className={styles.title}>Filters</div>
          <div onClick={() => onClose()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="17.323" height="17.321" viewBox="0 0 17.323 17.321">
              <path
                id="times-7"
                d="M16.689,14.655l6.2-6.187A1.448,1.448,0,1,0,20.843,6.42l-6.187,6.2L8.469,6.42A1.448,1.448,0,0,0,6.421,8.468l6.2,6.187-6.2,6.187A1.448,1.448,0,1,0,8.469,22.89l6.187-6.2,6.187,6.2a1.448,1.448,0,1,0,2.048-2.048Z"
                transform="translate(-5.994 -5.996)"
                fill="var(--filter-close-color)"
              />
            </svg>
          </div>
        </div>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between">
                <div className={styles.subTitle}>ARTIST VERIFICATION</div>
                <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
              </Disclosure.Button>
              <Disclosure.Panel>
                <Radio
                  data={ArtistVerificationList}
                  selected={selectedVerifyType}
                  onChange={item => setSelectedVerifyType(item)}
                  direction="rtl"
                />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center">
                <div className={`${styles.subTitle} mt-[12px]`}>AVAILABILITY</div>
                <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
              </Disclosure.Button>
              <Disclosure.Panel>
                <Radio
                  data={AvailabilityList}
                  selected={selectedAvailability}
                  onChange={item => setSelectedAvailability(item)}
                  direction="rtl"
                />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center">
                <div className={`${styles.subTitle} mt-[12px]`}>DIMENSIONS</div>
                <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
              </Disclosure.Button>
              <Disclosure.Panel>
                <Radio
                  data={DimensionList}
                  selected={selectedDimension}
                  onChange={item => setSelectedDimension(item)}
                  direction="rtl"
                />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure> */}

        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center">
                <div className={`${styles.subTitle} mt-[12px]`}>MARKET</div>
                <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
              </Disclosure.Button>
              <Disclosure.Panel>
                <Radio
                  data={MarketList}
                  selected={selectedMarket}
                  onChange={item => setSelectedMarket(item)}
                  direction="rtl"
                />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center">
                <div className={`${styles.subTitle} mt-[12px]`}>MEDIUM</div>
                <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
              </Disclosure.Button>
              <Disclosure.Panel>
                <Radio
                  data={MediumList}
                  selected={selectedMedium}
                  onChange={item => setSelectedMedium(item)}
                  direction="rtl"
                />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        {/* <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center">
                <div className={`${styles.subTitle} mt-[12px]`}>PRICE</div>
                <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
              </Disclosure.Button>
              <Disclosure.Panel>
                <PriceRange />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure> */}
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center">
                <div className={`${styles.subTitle} mt-[12px]`}>CATEGORIES</div>
                <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
              </Disclosure.Button>
              <Disclosure.Panel>
                {categoryList.length !== 0 && (
                  <Checkbox
                    categoryList={categoryList}
                    onChange={index => handleSelectCategory(index)}
                    direction="rtl"
                  />
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
      <div className={styles.bottomArea}>
        <div className="w-[94px]">
          <OutlineButton
            label="Cancel"
            onClick={() => onClose()}
            color="#EFF0F6"
            borderWidth={2}
            borderColor="#5AC3BA"
            fullWidth
          />
        </div>
        <div className="w-[94px]">
          <GradientButton
            label="Done"
            onClick={() =>
              onFilter({
                category: categoryList,
                availability: selectedAvailability,
                medium: selectedMedium,
                market: selectedMarket,
              })
            }
            color="#202427"
            fullWidth
          />
        </div>
      </div>
    </div>
  )
}

export default MobileNFTFilter

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
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between">
                <div className={`${styles.subTitle} mb-[12px]`}>Artist Verification</div>
                <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
              </Disclosure.Button>
              <Disclosure.Panel>
                <Radio
                  data={ArtistVerificationList}
                  selected={selectedVerifyType}
                  onChange={item => setSelectedVerifyType(item)}
                />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center">
                <div className={`${styles.subTitle} mt-[12px] mb-[12px]`}>Availability</div>
                <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
              </Disclosure.Button>
              <Disclosure.Panel>
                <Radio
                  data={AvailabilityList}
                  selected={selectedAvailability}
                  onChange={item => setSelectedAvailability(item)}
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

        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center">
                <div className={`${styles.subTitle} mt-[12px] mb-[12px]`}>Market</div>
                <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
              </Disclosure.Button>
              <Disclosure.Panel>
                <Radio data={MarketList} selected={selectedMarket} onChange={item => setSelectedMarket(item)} />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center">
                <div className={`${styles.subTitle} mt-[12px] mb-[12px]`}>Medium</div>
                <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
              </Disclosure.Button>
              <Disclosure.Panel>
                <Radio data={MediumList} selected={selectedMedium} onChange={item => setSelectedMedium(item)} />
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
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center">
                <div className={`${styles.subTitle} mt-[12px] mb-[24px]`}>Categories</div>
                <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
              </Disclosure.Button>
              <Disclosure.Panel>
                {categoryList.length !== 0 && (
                  <Checkbox categoryList={categoryList} onChange={index => handleSelectCategory(index)} />
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
            color="var(--text-gray-200-color)"
            borderWidth={2}
            borderColor="var(--stats-btn-border-color)"
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
            fullWidth
          />
        </div>
      </div>
    </div>
  )
}

export default MobileNFTFilter

import React, { useEffect, useState } from 'react'

// third party components
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'

// components
import IconButton from 'components/Button/IconButton'
import Radio from 'components/Radio'
import Checkbox from 'components/Checkbox'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

// json
import ArtistVerificationList from 'assets/json/explore/artist-verification.json'
import CategoryList from 'assets/json/popular-category.json'

// styles
import styles from './index.module.scss'

const MobileCollectionFilter = props => {
  const { category, onClose, onFilter } = props

  const [selectedVerifyType, setSelectedVerifyType] = useState<any>(ArtistVerificationList[2])
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
                <ChevronUpIcon className={`${styles.chevronUpIcon} ${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
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
                <div className={`${styles.subTitle} mt-[12px]`}>CATEGORIES</div>
                <ChevronUpIcon className={`${styles.chevronUpIcon} ${open ? 'rotate-180 transform' : ''} h-5 w-5`} />
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
          <GradientButton label="Done" onClick={() => onFilter({ category: categoryList })} color="#202427" fullWidth />
        </div>
      </div>
    </div>
  )
}

export default MobileCollectionFilter

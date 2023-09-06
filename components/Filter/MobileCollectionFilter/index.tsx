import React, { useEffect, useState } from 'react'

// third party components
import { Disclosure } from '@headlessui/react'

// components
import IconButton from 'components/Button/IconButton'
import Radio from 'components/Radio'
import Checkbox from 'components/Checkbox'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

// json
import ArtistVerificationList from 'assets/json/explore/artist-verification.json'
import CategoryList from 'assets/json/popular-category.json'
import DownArrowIcon from 'assets/icons/down-arrow-icon.svg?component'

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
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between">
                <div className={styles.subTitle}>Artist Verification</div>
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
                <div className={`${styles.subTitle} mt-[12px]`}>Categories</div>
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

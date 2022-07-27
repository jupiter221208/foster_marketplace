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

// images and icons
import CloseWhiteIcon from 'assets/icons/close-white.svg'

// json
import ArtistVerificationList from 'assets/json/explore/artist-verification.json'
import CategoryList from 'assets/json/category-list.json'

// styles
import styles from './index.module.scss'

const MobileCollectionFilter = props => {
  const { onClose } = props
  const [selectedVerifyType, setSelectedVerifyType] = useState(ArtistVerificationList[0])
  const [categoryList, setCategoryList] = useState([])

  useEffect(() => {
    let array = []
    CategoryList.map(item => {
      let object = item
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
          <div className="-mr-3">
            <IconButton icon={CloseWhiteIcon} onClick={() => onClose()} />
          </div>
        </div>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between">
                <div className={styles.subTitle}>ARTIST VERIFICATION</div>
                <ChevronUpIcon
                  className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`}
                  style={{ color: '#DEEFD0' }}
                />
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
                <ChevronUpIcon
                  className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`}
                  style={{ color: '#DEEFD0' }}
                />
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
        <OutlineButton label="Cancel" onClick={() => onClose()} color="#EFF0F6" borderWidth={2} borderColor="#5AC3BA" />
        <GradientButton label="Done" onClick={() => onClose()} color="#202427" />
      </div>
    </div>
  )
}

export default MobileCollectionFilter

// next components
import { useEffect, useState } from 'react'

// components
import PrimaryLayout from 'components/Layout/PrimaryLayout'

// resources
import CategoryList from 'assets/json/studio-category.json'
import SubCateList from 'assets/json/creator-merch/product-type.json'
import ColorList from 'assets/json/studio-color.json'
import SortList from 'assets/json/studio-sort.json'
import FilterIcon from 'assets/icons/filter-icon.svg?component'
import SortIcon from 'assets/icons/sort-icon-normal.svg?component'
import styles from './index.module.scss'
import StudioCategoryMenu from 'components/Menu/StudioCategoryMenu'
import StudioSubCategoryMenu from 'components/Menu/StudioSubCategoryMenu'

import StoreAPI from 'apis/store'
import MerchShopCard from 'components/Card/MerchShopCard'

const StudioSignature = () => {
  const [categoryList, setCategoryList] = useState([])
  const [subCateList, setSubCateList] = useState([])
  const [colorList, setColorList] = useState([])
  const [sortList, setSortList] = useState([])
  const [merchList, setMerchList] = useState([])
  const [username, setUserName] = useState('Nicholas-FPC')

  useEffect(() => {
    StoreAPI.getStoreItemByFoster(53).then(
      res => {
        setMerchList(res)
      },
      error => {}
    )
  }, [])

  useEffect(() => {
    let array: any[] = []
    CategoryList.map(item => {
      let object: any = item
      object.checked = false
      array.push(object)
    })
    setCategoryList(array)

    let array1: any[] = []
    SubCateList.map(item => {
      let object: any = item
      object.checked = false
      object.name = object.label
      array1.push(object)
    })
    setSubCateList(array1)

    let array2: any[] = []
    ColorList.map(item => {
      let object: any = item
      object.checked = false
      array2.push(object)
    })
    setColorList(array2)

    let array3: any[] = []
    SortList.map(item => {
      let object: any = item
      object.checked = false
      array3.push(object)
    })
    setSortList(array3)
  }, [])

  useEffect(() => {
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
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setCategoryList(array)
  }

  const handleSelectSubCategory = index => {
    let array = [...subCateList]
    array[index].checked = !array[index].checked
    setSubCateList(array)
  }

  const handleSelectColor = index => {
    let array = [...colorList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setColorList(array)
  }

  const handleSelectSort = index => {
    let array = [...sortList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setSortList(array)
  }

  return (
    <div className="w-full g-container">
      <div className="mt-[60px] mb-[45px]">
        <div className={styles.signature}>Signature Creator Merch</div>
        <div className={styles.result}>12,240 results</div>
      </div>

      <div className="w-full flex justify-between">
        <div className="flex gap-[15px]">
          <StudioCategoryMenu
            menuLabel="Category"
            categoryList={categoryList}
            handleSelectCategory={handleSelectCategory}
            icon={<FilterIcon />}
          />
          <StudioSubCategoryMenu
            categoryList={subCateList}
            handleSelectSubCategory={handleSelectSubCategory}
            icon={<FilterIcon />}
          />
          <StudioCategoryMenu
            menuLabel="Color"
            categoryList={colorList}
            handleSelectCategory={handleSelectColor}
            icon={<FilterIcon />}
          />
        </div>

        <StudioCategoryMenu
          menuLabel="Sort"
          categoryList={colorList}
          handleSelectCategory={handleSelectSort}
          icon={<SortIcon />}
        />
      </div>

      <div className="w-full mt-[45px]">
        <div className="grid grid-cols-10 sm:grid-cols-20 gap-[9px] sm:gap-[20px] sm:gap-[20px] xl:gap-[30px] mt-[30px]">
          {merchList.map((item, index) => (
            <div className="col-span-5 sm:col-span-10 lg:col-span-5 2xl:col-span-4" key={index}>
              <MerchShopCard username={username} data={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StudioSignature

StudioSignature.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

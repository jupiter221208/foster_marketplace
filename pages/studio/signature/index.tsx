// next components
import { useEffect, useState } from 'react'

// components
import PrimaryLayout from 'components/Layout/PrimaryLayout'

// resources
import CategoryList from 'assets/json/studio-category.json'
import SubCateList from 'assets/json/creator-merch/product-type.json'
import ApparelList from 'assets/json/creator-merch/apparel-type.json'
import PrintList from 'assets/json/creator-merch/print-type.json'
import ColorList from 'assets/json/studio-color.json'
import SortList from 'assets/json/studio-sort.json'
import FilterIcon from 'assets/icons/filter-icon.svg?component'
import SortIcon from 'assets/icons/sort-icon-normal.svg?component'
import FilterGrayIcon from 'assets/icons/filter-gray.svg?component'
import SortGrayIcon from 'assets/icons/sort-gray.svg?component'

import styles from './index.module.scss'
import StudioCategoryMenu from 'components/Menu/StudioCategoryMenu'
import StudioSubCategoryMenu from 'components/Menu/StudioSubCategoryMenu'

import StoreAPI from 'apis/store'
import MerchShopCard from 'components/Card/MerchShopCard'
import StudioPriceRangeMenu from 'components/Menu/StudioPriceRangeMenu'
import BlackButton from 'components/Button/BlackButton'
import MobileStudioFilter from 'components/Filter/MobileStudioFilter'
import MobileStudioSort from 'components/Menu/MobileStudioSort'
import LoadingComponent from 'pages/explore/LoadingComponent'
import MerchPhysicalCard from 'components/Card/MerchPysicalCard'

const StudioSignature = () => {
  const [categoryList, setCategoryList] = useState([])
  const [subCateList, setSubCateList] = useState([])
  const [apparelList, setApparelList] = useState([])
  const [printList, setPrintList] = useState([])
  const [colorList, setColorList] = useState([])
  const [priceValue, setPriceValue] = useState([0, 2000])
  const [sortList, setSortList] = useState([])
  const [merchList, setMerchList] = useState([])
  const [username, setUserName] = useState('Nicholas-FPC')
  const [openMobileFilter, setOpenMobileFilter] = useState(false)
  const [openMobileSort, setOpenMobileSort] = useState(false)
  const [pages, setPages] = useState(1)
  const [rowCount, setRowCount] = useState(10)
  const [isVisibleFetching, setIsVisibleFetching] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    // StoreAPI.getStoreItemByFoster(53).then(
    //   res => {
    //     setMerchList(res)
    //   },
    //   error => {}
    // )
    StoreAPI.getStoreTypes().then(
      res => {
        console.log(res, '================res===========')
      },
      error => {}
    )
    getStoreItem(pages)
  }, [])

  const getStoreItem = page => {
    let sort = 'price-ascending'
    sortList.map(item => {
      if (item.selected === true) {
        sort = item.value
      }
    })
    let category = ''
    categoryList.map(item => {
      if (item.selected === true) {
        category = item.value
      }
    })
    let minPrice = priceValue[0]
    let maxPrice = priceValue[1]

    let params = {
      sort: sort,
      typeIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      minPrice: minPrice,
      maxPrice: maxPrice,
    }
    if (category !== '') {
      params['category'] = category
    }

    StoreAPI.getStoreFeeds(page, rowCount, params).then(
      response => {
        setIsFetching(false)
        setMerchList([...merchList, ...response])

        if (response.length < rowCount) {
          setIsVisibleFetching(false)
        } else {
          setIsVisibleFetching(true)
          getStoreItem(page + 1)
        }
      },
      error => {
        setIsFetching(false)
      }
    )
  }

  useEffect(() => {
    let array: any[] = []
    CategoryList.map(item => {
      let object: any = item
      object.checked = false
      array.push(object)
    })
    let cateAll = {
      id: 3,
      name: 'All',
      value: '',
      checked: true,
    }
    array.push(cateAll)
    setSelectedCategory(cateAll)
    setCategoryList(array)

    let array1: any[] = []
    SubCateList.map(item => {
      let object: any = item
      object.checked = false
      object.name = object.label
      array1.push(object)
    })
    array1.push({
      id: 12,
      name: 'All',
      checked: true,
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
      if (object.id === 2) object.checked = true
      else object.checked = false
      array3.push(object)
    })
    setSortList(array3)

    let array4: any[] = []
    ApparelList.map(item => {
      let object: any = item
      object.checked = false
      array4.push(object)
    })
    array4.push({
      id: 6,
      name: 'All',
      checked: true,
    })
    setApparelList(array4)

    let array5: any[] = []
    PrintList.map(item => {
      let object: any = item
      object.checked = false
      array5.push(object)
    })
    array5.push({
      id: 2,
      name: 'All',
      checked: true,
    })
    setPrintList(array4)
  }, [])

  const handleSelectCategory = index => {
    let array = [...categoryList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setCategoryList(array)
    setSelectedCategory(array[index])
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

  const handleSelectApparel = index => {
    let array = [...apparelList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setApparelList(array)
  }

  const handleSelectPrint = index => {
    let array = [...printList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setPrintList(array)
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
      <div className="mt-[30px] lg:mt-[60px] mb-[15px] lg:mb-[45px]">
        <div className={styles.signature}>Signature Creator Merch</div>
        <div className={styles.result}>12,240 results</div>
      </div>

      <div className="lg:flex hidden w-full justify-between">
        <div className="flex gap-[15px]">
          <StudioCategoryMenu
            menuLabel="Category"
            categoryList={categoryList}
            handleSelectCategory={handleSelectCategory}
            icon={<FilterIcon />}
          />
          {(selectedCategory?.id === 2 || selectedCategory?.id === 3) && (
            <StudioSubCategoryMenu
              categoryList={subCateList}
              handleSelectSubCategory={handleSelectSubCategory}
              icon={<FilterIcon />}
            />
          )}
          <StudioPriceRangeMenu icon={<FilterIcon />} setPriceValue={setPriceValue} />

          {(selectedCategory?.id === 0 || selectedCategory?.id === 1 || selectedCategory?.id === 3) && (
            <StudioCategoryMenu
              menuLabel="Color"
              categoryList={colorList}
              handleSelectCategory={handleSelectColor}
              icon={<FilterIcon />}
            />
          )}
          {(selectedCategory?.id === 0 || selectedCategory?.id === 1 || selectedCategory?.id === 3) && (
            <StudioCategoryMenu
              menuLabel="Apparel Type"
              categoryList={apparelList}
              handleSelectCategory={handleSelectApparel}
              icon={<FilterIcon />}
            />
          )}
          {(selectedCategory?.id === 0 || selectedCategory?.id === 1 || selectedCategory?.id === 3) && (
            <StudioCategoryMenu
              menuLabel="Print Technique"
              categoryList={printList}
              handleSelectCategory={handleSelectPrint}
              icon={<FilterIcon />}
            />
          )}
        </div>

        <StudioCategoryMenu
          menuLabel="Sort"
          categoryList={sortList}
          handleSelectCategory={handleSelectSort}
          icon={<SortIcon />}
        />
      </div>

      <div className="w-full flex lg:hidden gap-[11px] justify-between">
        <BlackButton
          label="Filter"
          onClick={() => setOpenMobileFilter(!openMobileFilter)}
          fullWidth
          height="40px"
          color={'var(--text-gray-200-color)'}
          icon1={<FilterGrayIcon alt="" />}
          backgroundColor01="var(--background-main-color)"
          backgroundColor02="var(--background-main-color)"
          gradientDirection="bottom"
          fontFamily="Muli-Regular"
          fontSize={14}
          borderRadius={8}
          borderWidth={1}
          borderColor={'rgba(var(--text-gray-200-color-rgb), 0.1)'}
          direction="rtl"
        />

        <BlackButton
          label="Sort"
          onClick={() => setOpenMobileSort(!openMobileSort)}
          fullWidth
          height="40px"
          color={'var(--text-gray-200-color)'}
          icon1={<SortGrayIcon alt="" />}
          backgroundColor01="var(--background-main-color)"
          backgroundColor02="var(--background-main-color)"
          gradientDirection="bottom"
          fontFamily="Muli-Regular"
          fontSize={14}
          borderRadius={8}
          borderWidth={1}
          borderColor={'rgba(var(--text-gray-200-color-rgb), 0.1)'}
          direction="rtl"
        />
      </div>

      <div className="w-full mt-[15px] lg:mt-[45px] mb-[45px]">
        <div className="grid grid-cols-10 sm:grid-cols-20 gap-[9px] sm:gap-[20px] sm:gap-[20px] xl:gap-[30px] mt-[30px]">
          {merchList.map((item, index) => (
            <div className="col-span-5 sm:col-span-10 lg:col-span-5 2xl:col-span-4" key={index}>
              {item.fulfillment_type === 'foster' ? (
                <MerchShopCard username={username} data={item} />
              ) : (
                <MerchPhysicalCard username={username} data={item} />
              )}
            </div>
          ))}
        </div>
      </div>
      {isVisibleFetching && (
        <div className="w-full mt-[0px] lg:mt-[-100px] mb-[40px]">
          <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
        </div>
      )}
      <div className="flex lg:hidden w-full">
        {openMobileFilter && (
          <MobileStudioFilter
            category={categoryList}
            subCategory={subCateList}
            color={colorList}
            onFilter={params => {
              setCategoryList(params.category)
              setSubCateList(params.subCategory)
              setColorList(params.color)
              setPriceValue(params.price)
              setOpenMobileFilter(false)
            }}
            onClose={() => setOpenMobileFilter(false)}
          />
        )}

        {openMobileSort && (
          <MobileStudioSort
            open={openMobileSort}
            sort={sortList}
            onSort={params => {
              setSortList(params)
              setOpenMobileSort(false)
            }}
            onClose={() => setOpenMobileSort(false)}
          />
        )}
      </div>
    </div>
  )
}

export default StudioSignature

StudioSignature.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

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
import { getTimeDifference } from 'utils/helpers'

const StudioSignature = () => {
  const [categoryList, setCategoryList] = useState([])
  const [subCateList, setSubCateList] = useState([])
  const [apparelList, setApparelList] = useState([])
  const [printList, setPrintList] = useState([])
  const [colorList, setColorList] = useState([])
  const [priceValue, setPriceValue] = useState([0, 2000])
  const [sortList, setSortList] = useState([])
  const [merchList, setMerchList] = useState([])
  const [openMobileFilter, setOpenMobileFilter] = useState(false)
  const [openMobileSort, setOpenMobileSort] = useState(false)
  const [pages, setPages] = useState(0)
  const [rowCount, setRowCount] = useState(10)
  const [isVisibleFetching, setIsVisibleFetching] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [total, setTotal] = useState(0)
  const [isGettingFeed, setIsGettingFeed] = useState(false)
  useEffect(() => {
    if (isFetching === true && !isGettingFeed) {
      let nextPage = pages + 1
      getStoreItem(nextPage, categoryList, subCateList, printList, apparelList, priceValue, sortList)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching])

  const getStoreItem = (
    page,
    categoryList,
    subCateList,
    printList,
    apparelList,
    priceValue,
    sortList,
    reset = false
  ) => {
    let sort = 'latest'
    sortList.map(item => {
      if (item.checked === true) {
        sort = item.value
      }
    })

    let category = null

    categoryList.map(item => {
      if (item.checked === true) {
        category = item
      }
    })

    let typeIds = []
    if (category !== null && category !== undefined) {
      if (category.id === 0 || category.id === 1 || category.id === 3) {
        let print
        printList.map(item => {
          if (item.checked === true) {
            print = item
          }
        })
        apparelList.map(item => {
          if (item.checked === true) {
            // All
            if (item.id !== 6) {
              // All
              if (print.id === 0) {
                typeIds.push(item.id * 2 + 1)
                typeIds.push(item.id * 2 + 2)
              } else {
                typeIds.push(item.id * 2 + print.id)
              }
            } else {
              if (print.id === 1) typeIds.push(1, 3, 5, 7, 9)
              else if (print.id === 2) typeIds.push(2, 4, 6, 8, 10)
            }
          }
        })
      }
      if (category.id === 2 || category.id === 3) {
        subCateList.map(item => {
          if (item.checked === true) {
            if (item.id !== 22)
              // All
              typeIds.push(item.id)
          }
        })
      }
    }

    let minPrice = priceValue[0]
    let maxPrice = priceValue[1]

    let params = {
      sort: sort,
      minPrice: minPrice * 100,
      maxPrice: maxPrice * 100,
    }
    if (category !== null && category.value !== '') {
      params['category'] = category.value
    }
    if (typeIds.length > 0) {
      params['typeIds'] = typeIds
    }
    setIsGettingFeed(true)
    StoreAPI.getStoreFeeds(page, rowCount, params).then(
      response => {
        setIsGettingFeed(false)
        setIsFetching(false)
        let filtered = getFilterData(response.products)
        setTotal(response.total)
        if (reset) setMerchList(filtered)
        else setMerchList([...merchList, ...filtered])
        if (response.products.length < rowCount) {
          setIsVisibleFetching(false)
        } else {
          setTimeout(() => {
            if (filtered.length != response.products.length) {
              setIsFetching(true)
            }
          }, 2000)
          setPages(page)
          setIsVisibleFetching(true)
        }
      },
      error => {
        setIsGettingFeed(false)
        setIsFetching(false)
      }
    )
  }

  const getFilterData = response => {
    let list = response.filter(
      item =>
        item.master_edition_address !== '' &&
        (item.sale_end_at === null || getTimeDifference(item.sale_end_at) > 0) &&
        (item.supply === null || item.supply - item.current_supply > 0)
    )
    return list
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
      id: 22,
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
      id: 0,
      name: 'All',
      checked: true,
    })
    setPrintList(array5)
  }, [])

  const handleSelectCategory = index => {
    let array = [...categoryList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setCategoryList(array)
    setSelectedCategory(array[index])
    getStoreItem(1, array, subCateList, printList, apparelList, priceValue, sortList, true)
  }

  const handleSelectSubCategory = index => {
    if (index === subCateList.length - 1) {
      let array = []
      subCateList.map(item => {
        item.checked = false
        array.push(item)
      })
      array[subCateList.length - 1].checked = true
      setSubCateList(array)
      getStoreItem(1, categoryList, array, printList, apparelList, priceValue, sortList, true)
    } else {
      let array = [...subCateList]
      array[index].checked = !array[index].checked
      array[subCateList.length - 1].checked = false
      setSubCateList(array)
      getStoreItem(1, categoryList, array, printList, apparelList, priceValue, sortList, true)
    }
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
    getStoreItem(1, categoryList, subCateList, printList, array, priceValue, sortList, true)
  }

  const handleSelectPrint = index => {
    let array = [...printList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setPrintList(array)
    getStoreItem(1, categoryList, subCateList, array, apparelList, priceValue, sortList, true)
  }

  const handleSelectSort = index => {
    let array = [...sortList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setSortList(array)
    getStoreItem(1, categoryList, subCateList, printList, apparelList, priceValue, array, true)
  }

  return (
    <div className="w-full g-container">
      <div className="mt-[30px] lg:mt-[60px] mb-[15px] lg:mb-[45px]">
        <div className={styles.signature}>Signature Creator Merch</div>
        <div className={styles.result}>{total} results</div>
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
          <StudioPriceRangeMenu
            icon={<FilterIcon />}
            priceValue={priceValue}
            setPriceValue={value => {
              setPriceValue(value)
              getStoreItem(1, categoryList, subCateList, printList, apparelList, value, sortList, true)
            }}
          />

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

      <div className="w-full mt-[15px] lg:mt-[45px] mb-[45px] lg:mb-[100px]">
        <div className="grid grid-cols-10 sm:grid-cols-20 gap-[9px] sm:gap-[20px] sm:gap-[20px] xl:gap-[30px] mt-[30px]">
          {merchList.map((item, index) => (
            <div className="col-span-5 sm:col-span-10 lg:col-span-5 2xl:col-span-4" key={index}>
              <MerchShopCard username={item.username} data={item} />
            </div>
          ))}
        </div>
      </div>
      {isVisibleFetching && (
        <div className="w-full mt-[0px] lg:mt-[-100px] mb-[140px]">
          <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
        </div>
      )}
      <div className="flex lg:hidden w-full">
        {openMobileFilter && (
          <MobileStudioFilter
            selectedCategory={selectedCategory}
            category={categoryList}
            subCategory={subCateList}
            color={colorList}
            price={priceValue}
            apparel={apparelList}
            print={printList}
            onFilter={params => {
              let { category, subCategory, color, apparel, print, price } = params
              setSelectedCategory(category.filter(item => item.checked === true)[0])
              setCategoryList(category)
              setSubCateList(subCategory)
              setColorList(color)
              setApparelList(apparel)
              setPriceValue(price)
              setPrintList(print)
              setOpenMobileFilter(false)
              getStoreItem(1, category, subCategory, print, apparel, price, sortList, true)
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
              getStoreItem(1, categoryList, subCateList, printList, apparelList, priceValue, params, true)
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

import React from 'react'

// third party components
import { limit } from 'utils/strings'

// components
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import CheckboxGroup from 'components/Checkbox/CheckboxGroup'
import CategoryListModal from 'components/Modal/CategoryListModal'

// custom functions
import { useViewport } from 'utils'

// json
import CategoryList from 'assets/json/popular-category.json'

// styles
import styles from './index.module.scss'

const Step02SingleNFTSection = props => {
  const {
    nftName,
    setNftName,
    description,
    setDescription,
    categoryList,
    showCategoryList,
    setShowCategoryList,
    handleSelectCategory,
    handleCancelCategory,
  } = props

  const viewport = useViewport()

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className="w-full">
      <div className={`${styles.subTitle} mt-10`}>
        NFT Name <span>*</span>
      </div>
      <div className="max-w-[370px] w-full mt-5">
        <Input
          value={limit(nftName, 32)}
          placeholder="Give your art name"
          label01="Max Characters 32"
          label02={32 - nftName.length === 32 ? '' : `${32 - nftName.length} Characters left`}
          onChange={value => setNftName(limit(value, 32))}
        />
      </div>
      <div className={`${styles.subTitle} mt-[30px]`}>
        Description <span>*</span>
      </div>
      <div className="w-full mt-5">
        <Textarea
          value={limit(description, 1000)}
          color={'var(--text-gray-200-color)'}
          label01="Max Characters 1000"
          label02={1000 - description.length === 1000 ? '' : `${1000 - description.length} Characters left`}
          onChange={value => setDescription(limit(value, 1000))}
        />
      </div>
      <div className={`${styles.subTitle} mt-[30px]`}>
        Categories (max. 3) <span>*</span>
      </div>
      <div className="w-full mt-5">
        <CheckboxGroup categoryList={categoryList} onChange={index => handleSelectCategory(index)} />
      </div>
    </div>
  ) : (
    <div className="w-full">
      <div className={`${styles.mobileSubTitle} mt-5`}>
        NFT Name <span>*</span>
      </div>
      <div className="max-w-[370px] w-full mt-4">
        <Input
          value={limit(nftName, 32)}
          placeholder="Give your art name"
          color={'var(--text-gray-200-color)'}
          backgroundColor={'var(--shipping-board-bg)'}
          label01="Max Characters 32"
          label02={32 - nftName.length === 32 ? '' : `${32 - nftName.length} Characters left`}
          onChange={value => setNftName(limit(value, 32))}
        />
      </div>
      <div className={`${styles.mobileSubTitle} mt-5`}>
        Description <span>*</span>
      </div>
      <div className="w-full mt-5">
        <Textarea
          value={limit(description, 1000)}
          placeholder="Add a short description..."
          color={'var(--text-gray-200-color)'}
          backgroundColor={'var(--shipping-board-bg)'}
          label01="Max Characters 1000"
          label02={1000 - description.length === 1000 ? '' : `${1000 - description.length} Characters left`}
          onChange={value => setDescription(value)}
        />
      </div>
      <div className={`${styles.mobileSubTitle} mt-5`}>
        Categories <span>*</span>
      </div>
      <div className="w-full mt-4">
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-1">
            <div className={styles.chooseCategory} onClick={() => setShowCategoryList(true)}>
              Choose Category
            </div>
          </div>
        </div>
        {showCategoryList && (
          <CategoryListModal
            data={CategoryList}
            categoryList={categoryList}
            onChange={index => handleSelectCategory(index)}
            onClick={() => setShowCategoryList(!showCategoryList)}
            onClickCancel={() => handleCancelCategory()}
          />
        )}
      </div>
    </div>
  )
}

export default Step02SingleNFTSection

import React from 'react'

// third party components
import { limit } from 'utils/strings'

// components
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import GradientButton from 'components/Button/GradientButton'
import CheckboxGroup from 'components/Checkbox/CheckboxGroup'
import CategoryListModal from 'components/Modal/CategoryListModal'

// json
import CategoryList from 'assets/json/popular-category.json'

// styles
import styles from './index.module.scss'

const Step02SingleNFTSection = props => {
  const {
    viewport,
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

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className="w-full">
      <div className={`${styles.subTitle} mt-20`}>NFT Name *</div>
      <div className="max-w-[370px] w-full mt-5">
        <Input
          value={limit(nftName, 20)}
          placeholder="Give your art name"
          label01="Max Characters 20"
          label02={20 - nftName.length === 20 ? '' : `${20 - nftName.length} Characters left`}
          onChange={value => setNftName(limit(value, 20))}
        />
      </div>
      <div className={`${styles.subTitle} mt-20`}>Description *</div>
      <div className="w-full mt-5">
        <Textarea
          value={limit(description, 150)}
          placeholder="Add a short description..."
          label01="Max Characters 150"
          label02={150 - description.length === 150 ? '' : `${150 - description.length} Characters left`}
          onChange={value => setDescription(limit(value, 150))}
        />
      </div>
      <div className={`${styles.subTitle} mt-20`}>Categories (max. 3) *</div>
      <div className="w-full mt-5">
        <CheckboxGroup categoryList={categoryList} onChange={index => handleSelectCategory(index)} />
      </div>
    </div>
  ) : (
    <div className="w-full">
      <div className={`${styles.subTitle} mt-5`}>NFT Name *</div>
      <div className="max-w-[370px] w-full mt-4">
        <Input
          value={limit(nftName, 20)}
          placeholder="Give your art name"
          label01="Max Characters 20"
          label02={20 - nftName.length === 20 ? '' : `${20 - nftName.length} Characters left`}
          onChange={value => setNftName(limit(value, 20))}
        />
      </div>
      <div className={`${styles.subTitle} mt-5`}>Description *</div>
      <div className="w-full mt-5">
        <Textarea
          value={limit(description, 150)}
          placeholder="Add a short description..."
          label01="Max Characters 150"
          label02={150 - description.length === 150 ? '' : `${150 - description.length} Characters left`}
          onChange={value => setDescription(value)}
        />
      </div>
      <div className={`${styles.subTitle} mt-5`}>Categories *</div>
      <div className="w-full mt-4">
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-1">
            <GradientButton fullWidth label="Choose Category" onClick={() => setShowCategoryList(true)} height="45px" />
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

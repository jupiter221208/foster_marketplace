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
import CategoryList from 'assets/json/popular-category.json'

// styles
import styles from './index.module.scss'

const ViewChartSortModal = props => {
  const { open, close, data, selected, onChange } = props

  return open ? (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className="w-full flex justify-between items-center mb-8">
          <div className={styles.title}>View Chart By</div>
          <div className="-mr-3">
            <IconButton icon={CloseWhiteIcon} onClick={() => close()} />
          </div>
        </div>
        <Radio data={data} selected={selected} onChange={item => onChange(item)} direction="rtl" />
      </div>
      <div className={styles.bottomArea}>
        <div className="w-[94px]">
          <OutlineButton
            label="Cancel"
            onClick={() => close()}
            color="#EFF0F6"
            borderWidth={2}
            borderColor="#5AC3BA"
            fullWidth
          />
        </div>
        <div className="w-[94px]">
          <GradientButton label="Done" onClick={() => close()} color="#202427" fullWidth />
        </div>
      </div>
    </div>
  ) : null
}

export default ViewChartSortModal

import React, { Fragment } from 'react'
import { useViewport } from 'utils'

// third party component
import { Tab as HTab } from '@headlessui/react'

// styles
import styles from './index.module.scss'
import TabItem from './TabItem'

const HouseStatsTab = props => {
  const { tabList, onChange } = props
  const viewport = useViewport()

  return (
    <HTab.Group>
      <HTab.List
        className={`${
          viewport === 'xs' || viewport === 'sm' ? styles.mobileScrollbar : ''
        } flex gap-[20px] lg:gap-[60px] h-[60px] lg:h-[120px]`}
      >
        {tabList.map((item, index) => (
          <HTab as={Fragment} key={index}>
            <TabItem item={item} onChange={onChange} />
          </HTab>
        ))}
      </HTab.List>
    </HTab.Group>
  )
}

export default HouseStatsTab

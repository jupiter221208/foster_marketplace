import React, { Fragment } from 'react'

// third party component
import { Tab as HTab } from '@headlessui/react'

// styles
import styles from './index.module.scss'
import TabItem from './TabItem'

const Tab01 = props => {
  const { tabList, onChange, margin = '' } = props

  return (
    <HTab.Group>
      <HTab.List className="flex gap-[30px] lg:gap-[60px]" style={{ margin: margin && '0px 0px 0px 35px' }}>
        {tabList.map((item, index) => (
          <HTab as={Fragment} key={index}>
            <TabItem item={item} onChange={onChange} />
          </HTab>
        ))}
      </HTab.List>
    </HTab.Group>
  )
}

export default Tab01

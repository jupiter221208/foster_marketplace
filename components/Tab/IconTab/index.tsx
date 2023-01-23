import React, { Fragment } from 'react'

// next components
import Image from 'next/image'

// third party component
import { Tab as HTab } from '@headlessui/react'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'
import IconTabButton from './IconTabButton'

const IconTab = props => {
  const { tabList, onChange } = props
  const viewport = useViewport()

  return (
    <HTab.Group>
      <HTab.List className={viewport === 'xs' || viewport === 'sm' ? styles.mobileScrollbar : styles.scrollbar}>
        {tabList.map((item, index) => (
          <HTab as={Fragment} key={index}>
            <IconTabButton item={item} onChange={item => onChange(item)} />
          </HTab>
        ))}
      </HTab.List>
    </HTab.Group>
  )
}

export default IconTab

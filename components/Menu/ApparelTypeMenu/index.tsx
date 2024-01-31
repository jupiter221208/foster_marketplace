import React, { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
// next components
import Image from 'next/image'

// third party components
import { Menu, Transition } from '@headlessui/react'

// images and icons
import FilterIcon from 'assets/icons/filter-icon.svg?component'

// styles
import styles from './index.module.scss'

// solana
import { useConnection } from '@solana/wallet-adapter-react'
import Radio from 'components/Radio'

const ApparelTypeMenu = props => {
  const { type, setType } = props
  const router = useRouter()
  const { id } = router.query
  const { connection } = useConnection()
  const [apparelTypes, setApparelTypes] = useState([])
  const [selectedType, setSelectedType] = useState({})

  useEffect(() => {
    setApparelTypes([
      { id: '0', label: 'T-Shirts', value: 'T-Shirts', disabled: false },
      { id: '1', label: 'Long Sleeves', value: 'Long Sleeves', disabled: false },
      { id: '2', label: 'Hoodies', value: 'Hoodies', disabled: false },
      { id: '3', label: 'Crewneck', value: 'Crewneck', disabled: false },
    ])
    setSelectedType({ id: '0', label: 'T-Shirts', value: 'T-Shirts', disabled: false })
  }, [])
  return (
    <div className="relative mt-[4px]">
      <Menu>
        <Menu.Button>
          <div className={styles.btnArea}>
            {selectedType['label']}
            <FilterIcon alt="" />
          </div>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className={styles.menuArea}>
            <Menu.Item>
              {({ active }) => (
                <div className={styles.menuItem}>
                  <Radio data={apparelTypes} selected={selectedType} onChange={item => {}} />
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default ApparelTypeMenu

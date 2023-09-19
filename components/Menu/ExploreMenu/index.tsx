import React, { Fragment, MutableRefObject, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

// third party components
import { Menu as HMenu, Transition } from '@headlessui/react'

import Link from 'next/link'

// styles
import styles from './index.module.scss'

const ExploreMenu = props => {
  const dispatch = useDispatch()
  const menuRef = useRef<HTMLElement | null>(null)
  const itemRef = useRef<HTMLElement | null>(null)
  const [itemsToShow, setItemsToShow] = React.useState(6)

  const [isMenuOpen, setIsMenuOpen] = React.useState(false) // Initially menu is hidden

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen) // Toggle the current boolean value
  }

  const handleClickOutside = event => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      itemRef.current &&
      !itemRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  const toggleItems = () => {
    if (itemsToShow === 6) {
      setItemsToShow(50)
    } else {
      setItemsToShow(6)
    }
  }

  const displayItems = props.categoryList.slice(0, itemsToShow)

  return (
    <div className="flex items-center">
      <HMenu>
        <HMenu.Button onClick={toggleMenu} ref={itemRef as MutableRefObject<HTMLButtonElement>}>
          <div className={styles.container}>
            <div className="mr-[9px]">{props.label}</div>
            <div className="w-3 h-3 flex justify-center items-center mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="10.542" height="6.247" viewBox="0 0 10.542 6.247">
                <path
                  id="angle-down-9"
                  d="M17,9.17a1,1,0,0,0-1.41,0L12,12.71,8.46,9.17a1,1,0,1,0-1.41,1.42l4.24,4.24a1,1,0,0,0,1.42,0L17,10.59a1,1,0,0,0,0-1.42Z"
                  transform="translate(-6.754 -8.879)"
                  fill="var(--chevron-up-icon-color)"
                />
              </svg>
            </div>
          </div>
        </HMenu.Button>
        {isMenuOpen && (
          <div ref={menuRef as MutableRefObject<HTMLDivElement>} className={styles.menuArea}>
            <div className="flex flex-row justify-between w-full p-8 h-full">
              <div className="flex flex-col w-1/4 flex-grow p-4 gap-4">
                <div className="text-[18px] font-bold">Active Listings</div>
                <div className="flex flex-col gap-4 text-[16px] font-normal">
                  {props.activeList?.map((item, index) => (
                    <p key={index}>{item.label}</p>
                  ))}
                </div>
              </div>
              <div className="flex flex-col w-1/4 flex-grow p-4 gap-4">
                <div className="text-[18px] font-bold">Filter & Sorting</div>
                <div className="flex flex-col gap-4 text-[16px]">
                  {props.filterList?.map((item, index) => (
                    <p key={index}>{item.label}</p>
                  ))}
                </div>
              </div>
              <div className="flex flex-col w-1/4 flex-grow p-4 gap-4 text-[16px] font-normal">
                <div className="text-[18px] font-bold">Top Performers</div>
                <div className="flex flex-col gap-4">
                  {props.performerList?.map((item, index) => (
                    <p key={index}>{item.label}</p>
                  ))}
                </div>
              </div>
              <div className="flex flex-col w-1/4 flex-grow p-4 h-full gap-4">
                <div className="flex-grow text-[18px] font-bold">Categories</div>
                <div className="flex flex-col flex-grow-0 h-full overflow-auto gap-4 text-[16px] font-normal">
                  {displayItems?.map((item, index) => (
                    <Link href={`/category/${item.query.toLowerCase()}`}>
                      <p key={index} onClick={() => dispatch({ type: 'set', isLoading: true })}>
                        {item.label}
                      </p>
                    </Link>
                  ))}
                </div>
                <button className="flex justify-start text-[16px]" onClick={toggleItems}>
                  <div className={styles.menuItem}>{itemsToShow === 6 ? '+ Show More' : '- Show Less'} </div>
                </button>
              </div>
            </div>
          </div>
        )}
        {/* </Transition> */}
      </HMenu>
    </div>
  )
}

export default ExploreMenu

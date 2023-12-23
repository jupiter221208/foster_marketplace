import React, { Fragment, MutableRefObject, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

// third party components
import { Menu as HMenu, Transition } from '@headlessui/react'

import Link from 'next/link'

// styles
import styles from './index.module.scss'
import { useRouter } from 'next/router'

const ExploreMenu = props => {
  const { activeList, filterList, performerList, categoryList } = props
  const dispatch = useDispatch()
  const router = useRouter()
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

  const displayItems = categoryList.slice(0, itemsToShow)

  return (
    <div className="flex items-center">
      <HMenu>
        <HMenu.Button onClick={toggleMenu} ref={itemRef as MutableRefObject<HTMLButtonElement>}>
          <div className={styles.container}>
            <div className="mr-[9px]">{props.label}</div>
          </div>
        </HMenu.Button>
        {isMenuOpen && (
          <div ref={menuRef as MutableRefObject<HTMLDivElement>} className={styles.menuArea}>
            <div className="flex flex-row justify-between w-full px-6 py-4 h-full">
              <div className="flex flex-col w-1/4 flex-grow p-4 gap-4">
                <div className={styles.title}>Active Listings</div>
                <div className="flex flex-col gap-4 font-normal">
                  {activeList?.map((item, index) => (
                    <Link key={index} href={`/explore`} passHref>
                      <p
                        className={styles.text}
                        onClick={() => {
                          setIsMenuOpen(false)
                          dispatch({ type: 'set', isLoading: true })
                          dispatch({ type: 'set', exploreTab: 0 })
                          if (item.query === 'live_auctions') {
                            dispatch({ type: 'set', availabilityFilter: 1 })
                          } else {
                            dispatch({ type: 'set', availabilityFilter: 0 })
                          }
                          router.push('/explore')
                        }}
                      >
                        {item.label}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex flex-col w-1/4 flex-grow p-4 gap-4">
                <div className={styles.title}>Filter & Sorting</div>
                <div className="flex flex-col gap-4 font-normal">
                  {filterList?.map((item, index) => (
                    <Link key={index} href={`/explore`} passHref>
                      <p
                        className={styles.text}
                        onClick={() => {
                          setIsMenuOpen(false)
                          dispatch({ type: 'set', isLoading: true })
                          dispatch({ type: 'set', exploreTab: index })
                          router.push('/explore')
                        }}
                      >
                        {item.label}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex flex-col w-1/4 flex-grow p-4 gap-4">
                <div className={styles.title}>Top Performers</div>
                <div className="flex flex-col gap-4 font-normal">
                  {performerList?.map((item, index) => (
                    <Link key={index} href={`/stats`} passHref>
                      <p
                        className={styles.text}
                        onClick={() => {
                          setIsMenuOpen(false)
                          dispatch({ type: 'set', isLoading: true })
                          dispatch({ type: 'set', activeTab: index })
                          router.push('/stats')
                        }}
                      >
                        {item.label}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex flex-col w-1/4 flex-grow p-4 h-full gap-4">
                <div className={styles.title}>Categories</div>
                <div className="flex flex-col flex-grow-0 h-full overflow-auto gap-4 font-normal">
                  {displayItems?.map((item, index) => (
                    <Link key={index} href={`/category/${item.query.toLowerCase()}`} passHref>
                      <p
                        className={styles.text}
                        onClick={() => {
                          setIsMenuOpen(false)
                          dispatch({ type: 'set', isLoading: true })
                          router.push(`/category/${item.query.toLowerCase()}`)
                        }}
                      >
                        {item.label}
                      </p>
                    </Link>
                  ))}
                </div>
                <button className="flex justify-start" onClick={toggleItems}>
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

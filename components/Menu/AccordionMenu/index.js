import React from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'
import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/solid'

// styles
import styles from './index.module.scss'

const AccordionMenu = props => {
  const { icon, label, type = '', data, path = '' } = props
  const router = useRouter()
  const dispatch = useDispatch()

  const handleClick = item => {
    dispatch({ type: 'set', exploreTab: item.id })
    dispatch({ type: 'set', openMobileMenu: false })
    router.push(item.path)
  }

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className={styles.container}>
            <div className="flex items-center">
              {type === 'avatar' ? (
                <Image src={icon} width={40} height={40} className="rounded-full" objectFit="cover" alt="" />
              ) : (
                <Image src={icon} alt="" />
              )}
              <div className={styles.label}>{label}</div>
            </div>
            {data.length !== 0 && (
              <ChevronRightIcon
                className={`${open ? 'rotate-90 transform' : ''} h-6 w-6`}
                style={{ color: '#5AC3BA' }}
              />
            )}
          </Disclosure.Button>
          {data.length !== 0 && (
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              {data.map((item, index) => (
                <div key={index} className={styles.menuItem} onClick={() => handleClick(item)}>
                  {item.id === 0 ? (
                    <div className="w-10 h-10 flex justify-center items-center">
                      <div className={styles.imageArea}>
                        <Image src={item.icon} alt="" width={24} height={24} className="rounded-full" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-10 h-10">
                      <Image src={item.icon} alt="" width={40} height={40} />
                    </div>
                  )}
                  {item.label}
                </div>
              ))}
            </Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
  )
}

export default AccordionMenu

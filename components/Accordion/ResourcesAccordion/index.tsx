import React, { useEffect, useRef } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Disclosure } from '@headlessui/react'

// images and icons
import ArrowDownIcon from 'assets/icons/arrow-down-black.svg'
import MinusBlackIcon from 'assets/icons/minus-black.svg'

// styles
import styles from './index.module.scss'

const ResourcesAccordion = props => {
  const { data, onClick } = props

  const buttonRefs = useRef<any>([])
  const openedRef = useRef<any | null>(null)
  const clickRecent = index => {
    const clickedButton = buttonRefs.current[index]
    if (clickedButton === openedRef.current) {
      openedRef.current = null
      return
    }
    if (Boolean(openedRef.current?.getAttribute('data-value'))) {
      openedRef.current?.click()
    }
    openedRef.current = clickedButton
  }

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (document.getElementById('resource_lift') !== null && document.getElementById('resource_lift') !== undefined) {
        document.getElementById('resource_lift')!.onclick = function () {
          onClick('resource_lift')
          clearInterval(myInterval)
        }
      }
      if (document.getElementById('resource_turkey') !== null) {
        document.getElementById('resource_turkey')!.onclick = function () {
          onClick('resource_turkey')
          clearInterval(myInterval)
        }
      }
    }, 500)

    return () => clearInterval(myInterval)
  }, [data])

  return (
    <div className="w-full flex flex-wrap">
      {data.map((item, index) => (
        <div key={index} className="w-full">
          <Disclosure>
            {({ open }) => (
              <>
                <div className={styles.accordion} onClick={() => {}}>
                  <Disclosure.Button
                    className={styles.button}
                    data-value={open}
                    ref={ref => {
                      buttonRefs.current[index] = ref
                    }}
                    onClick={() => {
                      clickRecent(index)
                    }}
                  >
                    <div className={`${styles.title} ${open ? styles.selected : ''}`}>{item.title}</div>

                    <div className={styles.openButton}>
                      <Image src={open ? MinusBlackIcon : ArrowDownIcon} alt="" />
                    </div>
                  </Disclosure.Button>
                  <Disclosure.Panel className={styles.panel}>
                    <div className={styles.firstRow}>
                      {item.description.map((desc, index) => (
                        <div
                          className={styles.text}
                          dangerouslySetInnerHTML={{
                            __html: desc,
                          }}
                          key={index}
                        />
                      ))}
                    </div>
                  </Disclosure.Panel>
                </div>
              </>
            )}
          </Disclosure>
        </div>
      ))}
    </div>
  )
}

export default ResourcesAccordion

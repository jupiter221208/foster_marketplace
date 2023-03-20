import React, { useEffect, useRef } from 'react'

// third party components
import { Disclosure } from '@headlessui/react'

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
                      {/* <Image
                        src={
                          open
                            ? lightMode
                              ? MinusLightIcon
                              : MinusBlackIcon
                            : lightMode
                            ? ArrowDownLightIcon
                            : ArrowDownIcon
                        }
                        alt=""
                      /> */}
                      {open ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="2" viewBox="0 0 18 2">
                          <line
                            id="Line_405"
                            data-name="Line 405"
                            x2="18"
                            transform="translate(0 1)"
                            fill="none"
                            stroke="var(--resource-accordion-dropdown-color)"
                            stroke-width="2"
                            opacity="1"
                          />
                        </svg>
                      ) : (
                        <svg
                          id="Desktop_Collapsed"
                          data-name="Desktop Collapsed"
                          xmlns="http://www.w3.org/2000/svg"
                          width="37"
                          height="37"
                          viewBox="0 0 37 37"
                        >
                          <g
                            id="Component_2300_6"
                            data-name="Component 2300 – 6"
                            transform="translate(9.5 23.754) rotate(-90)"
                          >
                            <g id="Component_2299_9" data-name="Component 2299 – 9">
                              <path
                                id="noun-left-4606382"
                                d="M22.17,27.4a1.5,1.5,0,0,0,0-2.129l-6.445-6.43,6.445-6.43a1.505,1.505,0,0,0-2.129-2.129l-7.493,7.493h0a1.5,1.5,0,0,0,0,2.127L20.041,27.4h0a1.5,1.5,0,0,0,2.129,0Z"
                                transform="translate(-12.104 -9.844)"
                                fill="var(--resource-accordion-close-color)"
                              />
                            </g>
                          </g>
                        </svg>
                      )}
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

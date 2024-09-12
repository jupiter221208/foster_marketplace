import React, { useEffect, useState, useRef, MutableRefObject } from 'react'
import { Range, getTrackBackground } from 'react-range'

// next components

// third party components

// images and icons

// styles
import styles from './index.module.scss'

// solana

const StudioPriceRangeMenu = props => {
  const { icon, priceValue, setPriceValue } = props
  const [showDropdown, setShowDropdown] = useState(false)
  const [values, setValues] = useState(priceValue)

  useEffect(() => {
    setValues(priceValue)
  }, [priceValue])

  const STEP = 1
  const MIN = 0
  const MAX = 2000

  const menuRef = useRef<HTMLElement | null>(null)
  const itemRef = useRef<HTMLElement | null>(null)
  const handleClickOutside = event => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      itemRef.current &&
      !itemRef.current.contains(event.target)
    ) {
      setShowDropdown(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  return (
    <div className={`relative ${styles.removeBlueHighlight}`}>
      <div
        ref={itemRef as MutableRefObject<HTMLDivElement>}
        className={styles.btnArea}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="mb-[3px]">Price</div>
        <div>{icon}</div>
      </div>
      {showDropdown && (
        <div ref={menuRef as MutableRefObject<HTMLDivElement>} className={styles.menuArea}>
          <div className={styles.menuItem}>
            <div className="w-full">
              <div className={styles.priceRange}>
                Price Range:
                <div className={styles.priceValue}>
                  ${values[0]} - ${values[1]}
                </div>
              </div>
              <div className="w-full mt-[2px]">
                <Range
                  values={values}
                  step={STEP}
                  min={MIN}
                  max={MAX}
                  onChange={values => {
                    setValues(values)
                    setPriceValue(values)
                  }}
                  renderTrack={({ props, children }) => (
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                    <div
                      onMouseDown={props.onMouseDown}
                      onTouchStart={props.onTouchStart}
                      style={{
                        ...props.style,
                        height: '36px',
                        display: 'flex',
                        width: '100%',
                      }}
                    >
                      <div
                        ref={props.ref}
                        style={{
                          height: '5px',
                          width: '100%',
                          borderRadius: '4px',
                          background: getTrackBackground({
                            values,
                            colors: [
                              'rgba(var(--main-bg-color-rgb), 0.5)',
                              'var(--main-icon-color)',
                              'rgba(var(--main-bg-color-rgb), 0.5)',
                            ],
                            min: MIN,
                            max: MAX,
                          }),
                          alignSelf: 'center',
                        }}
                      >
                        {children}
                      </div>
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: '15px',
                        width: '10px',
                        borderRadius: '10px',
                        backgroundColor: '#1A1D20',
                        border: '2px solid var(--main-icon-color)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    />
                  )}
                />
              </div>
              <div className="w-full flex justify-between">
                <div className={styles.price}>$0</div>
                <div className={styles.price}>$2000</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudioPriceRangeMenu

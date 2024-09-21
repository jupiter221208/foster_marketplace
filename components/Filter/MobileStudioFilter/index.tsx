import React, { useEffect, useState } from 'react'

// third party components
import { Range, getTrackBackground } from 'react-range'

// components
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

// styles
import styles from './index.module.scss'

const MobileStudioFilter = props => {
  const { category, subCategory, color, price, apparel, print, onClose, onFilter } = props

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryList, setCategoryList] = useState<any>(category)
  const [subCateList, setSubCateList] = useState<any>(subCategory)
  const [selectedColor, setSelectedColor] = useState<any>(color)
  const [apparelList, setApparelList] = useState<any>(apparel)
  const [printList, setPrintList] = useState<any>(print)
  const [values, setValues] = useState(price)
  const STEP = 1
  const MIN = 0
  const MAX = 2000

  useEffect(() => {
    categoryList.map(item => {
      if (item.checked) setSelectedCategory(item)
    })
  }, [categoryList])

  const handleSelectCategory = index => {
    let array = [...categoryList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setCategoryList(array)
  }

  const handleSelectSubCategory = index => {
    if (index === subCateList.length - 1) {
      let array = []
      subCateList.map(item => {
        item.checked = false
        array.push(item)
      })
      array[subCateList.length - 1].checked = true
      setSubCateList(array)
    } else {
      let array = [...subCateList]
      array[index].checked = !array[index].checked
      array[subCateList.length - 1].checked = false
      setSubCateList(array)
    }
  }

  const handleSelectColor = index => {
    let array = [...selectedColor]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setSelectedColor(array)
  }

  const handleSelectApparel = index => {
    let array = [...apparelList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setApparelList(array)
  }

  const handleSelectPrint = index => {
    let array = [...printList]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setPrintList(array)
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.title}>Category</div>
        {categoryList.map((item, index) => (
          <div id={`check-label-${index}`} key={index} className="flex justify-between my-[8px]">
            <label
              className={`${styles.checkmark}`}
              onClick={() => {
                handleSelectCategory(index)
              }}
            >
              {item.name}
            </label>
            <input
              className={`${styles.checkbox}`}
              type="checkbox"
              id={item.id}
              checked={item.checked}
              onChange={() => {
                handleSelectCategory(index)
              }}
            />
          </div>
        ))}

        {(selectedCategory?.id === 2 || selectedCategory?.id === 3) && <div className={styles.title}>Sub-category</div>}
        {(selectedCategory?.id === 2 || selectedCategory?.id === 3) &&
          subCateList.map((item, index) => (
            <div id={`check-label-${index}`} key={index} className="flex justify-between my-[8px]">
              <label
                className={`${styles.checkmark}`}
                onClick={() => {
                  handleSelectSubCategory(index)
                }}
              >
                {item.name}
              </label>
              <input
                className={`${styles.checkbox}`}
                type="checkbox"
                id={item.id}
                checked={item.checked}
                onChange={() => {
                  handleSelectSubCategory(index)
                }}
              />
            </div>
          ))}

        {(selectedCategory?.id === 0 || selectedCategory?.id === 1 || selectedCategory?.id === 3) && (
          <div>
            <div className={styles.title}>Color</div>
            {selectedColor.map((item, index) => (
              <div id={`check-label-${index}`} key={index} className="flex justify-between my-[8px]">
                <label
                  className={`${styles.checkmark}`}
                  onClick={() => {
                    handleSelectColor(index)
                  }}
                >
                  {item.name}
                </label>
                <input
                  className={`${styles.checkbox}`}
                  type="checkbox"
                  id={item.id}
                  checked={item.checked}
                  onChange={() => {
                    handleSelectColor(index)
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {(selectedCategory?.id === 0 || selectedCategory?.id === 1 || selectedCategory?.id === 3) && (
          <div>
            <div className={styles.title}>Apparel Type</div>
            {apparelList.map((item, index) => (
              <div id={`check-label-${index}`} key={index} className="flex justify-between my-[8px]">
                <label
                  className={`${styles.checkmark}`}
                  onClick={() => {
                    handleSelectApparel(index)
                  }}
                >
                  {item.name}
                </label>
                <input
                  className={`${styles.checkbox}`}
                  type="checkbox"
                  id={item.id}
                  checked={item.checked}
                  onChange={() => {
                    handleSelectApparel(index)
                  }}
                />
              </div>
            ))}
          </div>
        )}
        {(selectedCategory?.id === 0 || selectedCategory?.id === 1 || selectedCategory?.id === 3) && (
          <div>
            <div className={styles.title}>Print Technique</div>
            {print.map((item, index) => (
              <div id={`check-label-${index}`} key={index} className="flex justify-between my-[8px]">
                <label
                  className={`${styles.checkmark}`}
                  onClick={() => {
                    handleSelectPrint(index)
                  }}
                >
                  {item.name}
                </label>
                <input
                  className={`${styles.checkbox}`}
                  type="checkbox"
                  id={item.id}
                  checked={item.checked}
                  onChange={() => {
                    handleSelectPrint(index)
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <div className="w-full mt-[30px] mb-[30px]">
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
      <div className={styles.bottomArea}>
        <div className="w-[94px]">
          <OutlineButton
            label="Cancel"
            onClick={() => onClose()}
            color="var(--text-gray-200-color)"
            borderWidth={1}
            fontSize={16}
            borderColor="rgba(#ffffff, 0.5)"
            fullWidth
            height={40}
          />
        </div>
        <div className="w-[94px]">
          <GradientButton
            label="Apply"
            height={40}
            fontSize={16}
            backgroundColor01="var(--main-icon-color)"
            backgroundColor02="var(--main-icon-color)"
            color="var(--background-main-color)"
            onClick={() =>
              onFilter({
                category: categoryList,
                subCategory: subCateList,
                color: selectedColor,
                price: values,
                apparel: apparelList,
                print: printList,
              })
            }
            fullWidth
          />
        </div>
      </div>
    </div>
  )
}

export default MobileStudioFilter

import React, { useState } from 'react'

// third party components
import { Range, getTrackBackground } from 'react-range'

// components
import Input from 'components/Input'

// styles
import styles from './index.module.scss'

const PriceRange = props => {
  const STEP = 1
  const MIN = 0
  const MAX = 1000
  const [values, setValues] = useState([0, 1000])

  const handleSetValues = (value, type) => {
    let array = [...values]
    switch (type) {
      case 'min':
        if (value <= MAX && value >= MIN) {
          array[0] = value
          setValues(array)
        }
        break
      case 'max':
        if (value <= MAX && value >= MIN) {
          array[1] = value
          setValues(array)
        }
        break
    }
  }
  return (
    <div className={styles.container}>
      <div className="w-full flex justify-between items-center my-4">
        <Input
          value={values[0] === 0 ? '' : values[0]}
          placeholder="$0"
          onChange={value => handleSetValues(value, 'min')}
          color="#EFF0F6"
          backgroundColor="transparent"
          borderColor="#FFFFFF"
          borderWidth={1}
          height="40px"
          type="number"
        />
        <div className="mx-3">-</div>
        <Input
          value={values[1] === 1000 ? '' : values[1]}
          placeholder="$1000+"
          onChange={value => handleSetValues(value, 'max')}
          color="#EFF0F6"
          backgroundColor="transparent"
          borderColor="#FFFFFF"
          borderWidth={1}
          height="40px"
          type="number"
        />
      </div>
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
                  colors: ['#666666', '#ffffff', '#666666'],
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
              height: '16px',
              width: '16px',
              borderRadius: '8px',
              backgroundColor: '#FFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        )}
      />
    </div>
  )
}

export default PriceRange

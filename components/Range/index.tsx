import React, { useEffect, useState } from 'react'

// third party components
import { Range as ReactRange, getTrackBackground } from 'react-range'

// styles
import styles from './index.module.scss'

interface RangeProps {
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
}

const Range: React.FC<RangeProps> = props => {
  const { min, max, step, value, onChange } = props

  const [values, setValues] = useState<number[]>([])

  useEffect(() => {
    let array: number[] = []
    array.push(value)
    setValues(array)
  }, [value])

  return (
    <div className={styles.container}>
      <ReactRange
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={(values: number[]) => {
          onChange(values[0])
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
                  colors: ['#ffffff', '#666666', '#666666'],
                  min: min,
                  max: max,
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
              // boxShadow: '0px 2px 6px #AAA',
            }}
          />
        )}
      />
    </div>
  )
}

export default Range

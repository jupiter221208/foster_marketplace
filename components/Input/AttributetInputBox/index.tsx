import React, { useState } from 'react'

// next components

// resource
import CrossPlusIcon from 'assets/icons/cross-plus.svg?component'
import TrashIcon from 'assets/icons/trash-icon.svg?component'

// styles
import styles from './index.module.scss'

const AttributeInputBox = props => {
  const { label, attributeList, setAttributeList } = props

  const setAttributeType = (index, value) => {
    let list = [...attributeList]
    list[index].type = value
    setAttributeList(list)
  }

  const setAttributeName = (index, value) => {
    let list = [...attributeList]
    list[index].name = value
    setAttributeList(list)
  }

  const addAnotherAttribute = () => {
    if (attributeList.length === 5) return
    let newList = [...attributeList]
    newList.push({ type: '', name: '' })
    setAttributeList(newList)
  }

  const removeAttribute = index => {
    let list = [...attributeList]
    list.splice(index, 1)
    setAttributeList(list)
  }

  return (
    <div className="w-full">
      <div className={styles.roaylties}>{label}</div>
      <div className="w-full max-h-[350px] w-full mt-[15px]">
        {attributeList.map(({ type, name }, index) => {
          return (
            <div key={index} className="flex gap-[15px] mb-[18px] items-center">
              <div className="w-[50%] relative">
                <input
                  className={styles.inputArea}
                  value={type}
                  placeholder={'Enter the Type'}
                  onChange={event => {
                    setAttributeType(index, event.target.value)
                  }}
                />
              </div>

              <div className="w-[50%] relative">
                <input
                  className={styles.attPros}
                  value={name}
                  placeholder={'Enter the Name'}
                  onChange={event => {
                    setAttributeName(index, event.target.value)
                  }}
                />
              </div>

              {attributeList.length > 1 && (
                <div className="w-[24px]">{index > 0 && <TrashIcon onClick={() => removeAttribute(index)} />}</div>
              )}
            </div>
          )
        })}
      </div>
      <div className={styles.button} onClick={() => addAnotherAttribute()}>
        <CrossPlusIcon />
        Add another attribute
      </div>
    </div>
  )
}

export default AttributeInputBox

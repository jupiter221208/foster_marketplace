import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// third party components
import Dropzone from 'react-dropzone'

// image
import PlusIcon from 'assets/icons/plus-circle-icon.svg?component'

// json

// styles
import styles from './index.module.scss'
import { useViewport } from 'utils'
import ImageCard from './ImageCard'
import Input from 'components/Input'
import { limit } from 'utils/strings'
import Textarea from 'components/Input/Textarea'

const MyProductSection = () => {
  const [mainImage, setMainImage] = useState<any>(null)
  const [imageFirst, setImageFirst] = useState<any>(null)
  const [imageSecond, setImageSecond] = useState<any>(null)
  const [imageThird, setImageThird] = useState<any>(null)
  const [imageForth, setImageForth] = useState<any>(null)

  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')

  const onSelectImage = index => {
    setSelectedIndex(index)
    if (index === 0) setMainImage(imageFirst)
    else if (index === 1) setMainImage(imageSecond)
    else if (index === 2) setMainImage(imageThird)
    else if (index === 3) setMainImage(imageForth)
  }
  return (
    <div className="w-full">
      <div className="w-full lg:flex hidden gap-[72px] justify-between">
        <div className="w-[45%]">
          <div className="flex gap-[5px] mb-[15px]">
            <div className={styles.fullfill}>Product Image (max 4)</div> <div className={styles.asterisk}>*</div>
          </div>
          <div className={styles.imageArea}>
            <div className={styles.imageContent}>
              {imageFirst && mainImage && <img src={mainImage} alt="" className="w-full h-full object-contain" />}
            </div>
          </div>
          <div className="flex gap-[30px] mt-[32px]">
            <ImageCard
              index={0}
              image={imageFirst}
              setImage={image => {
                setImageFirst(image)
                setMainImage(image)
              }}
              isDelete={imageSecond === null}
              isSelected={selectedIndex === 0}
              onSelect={index => onSelectImage(index)}
            />
            <ImageCard
              index={1}
              image={imageSecond}
              setImage={image => {
                setImageSecond(image)
                setMainImage(image)
              }}
              isDelete={imageThird === null}
              isSelected={selectedIndex === 1}
              onSelect={index => onSelectImage(index)}
            />
            <ImageCard
              index={2}
              image={imageThird}
              setImage={image => {
                setImageThird(image)
                setMainImage(image)
              }}
              isDelete={imageForth === null}
              isSelected={selectedIndex === 2}
              onSelect={index => onSelectImage(index)}
            />
            <ImageCard
              index={3}
              image={imageForth}
              setImage={image => {
                setImageForth(image)
                setMainImage(image)
              }}
              isDelete={true}
              isSelected={selectedIndex === 3}
              onSelect={index => onSelectImage(index)}
            />
          </div>
        </div>
        <div className="w-[50%]">
          <div className="flex gap-[5px] mb-[15px]">
            <div className={styles.fullfill}>Product Name</div> <div className={styles.asterisk}>*</div>
          </div>
          <div className="w-full mt-[15px]">
            <Input
              value={limit(productName, 40)}
              placeholder="Give your product name"
              label01="Max Characters 42"
              label02={40 - productName.length === 40 ? '' : `${40 - productName.length} Characters left`}
              onChange={value => setProductName(limit(value, 40))}
            />
          </div>
          <div className="flex gap-[5px] mt-[32px]">
            <div className={styles.fullfill}>Product Description</div> <div className={styles.asterisk}>*</div>
          </div>
          <div className="w-full mt-5">
            <Textarea
              value={limit(description, 1000)}
              color={'var(--text-gray-200-color)'}
              label01="Max Characters 1000"
              label02={1000 - description.length === 1000 ? '' : `${1000 - description.length} Characters left`}
              onChange={value => setDescription(limit(value, 1000))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProductSection

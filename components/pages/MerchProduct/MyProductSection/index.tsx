import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// third party components
import Dropzone from 'react-dropzone'

// image
import PlusIcon from 'assets/icons/plus-circle-icon.svg?component'

// json
import ProductType from 'assets/json/creator-merch/product-type.json'
import ShippingList from 'assets/json/creator-merch/shipping-list.json'

// styles
import styles from './index.module.scss'
import { useViewport } from 'utils'
import ImageCard from './ImageCard'
import Input from 'components/Input'
import { limit } from 'utils/strings'
import Textarea from 'components/Input/Textarea'
import ProductionListMenu from 'components/ProductionListMenu'

const MyProductSection = () => {
  const [productType, setProductType] = useState({ id: -1, label: '' })
  const [shipping, setShipping] = useState({ id: -1, label: '' })
  const [mainImage, setMainImage] = useState<any>(null)
  const [imageList, setImageList] = useState<any>([])
  // const [imageFirst, setImageFirst] = useState<any>(null)
  // const [imageSecond, setImageSecond] = useState<any>(null)
  // const [imageThird, setImageThird] = useState<any>(null)
  // const [imageForth, setImageForth] = useState<any>(null)

  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')

  const onSelectImage = index => {
    setSelectedIndex(index)
    setMainImage(imageList[index])
  }

  const onDeleteByIndex = index => {
    let newList = [...imageList]
    newList.splice(index, 1)
    setImageList(newList)
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
              {imageList.length > 0 && mainImage && (
                <img src={mainImage} alt="" className="w-full h-full object-contain" />
              )}
              {imageList.length === 0 && (
                <div className="w-full h-full flex justify-center items-center">
                  <Dropzone
                    onDropAccepted={acceptedFiles => {
                      if (acceptedFiles.length !== 0) {
                        let newList = []
                        acceptedFiles.map(file => {
                          newList.push(URL.createObjectURL(file))
                        })
                        setImageList(newList)
                        setSelectedIndex(0)
                        setMainImage(newList[0])
                      } else setImageList([])
                    }}
                    onDropRejected={rejectedFiles => {
                      setImageList([])
                    }}
                    accept={{
                      'image/jpeg': [],
                      'image/png': [],
                    }}
                    maxFiles={1}
                    maxSize={10485760}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <section className={styles.dropzone}>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <p className={styles.subTitle}>Upload Image(s)</p>
                          <p className={styles.text}>Supported File Formats .png and .jpeg</p>
                          <p className={styles.grayText}>Max File Size 10mb</p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-[30px] mt-[32px] mb-[32px]">
            {imageList.length > 0 && (
              <ImageCard
                index={0}
                image={imageList[0]}
                setImage={image => {
                  // setImageList(imageList.push(image))
                  // setMainImage(image)
                }}
                isSelected={selectedIndex === 0}
                onSelect={index => onSelectImage(index)}
                onDelete={index => onDeleteByIndex(index)}
              />
            )}
            {imageList.length > 0 && (
              <ImageCard
                index={1}
                image={imageList.length === 1 ? null : imageList[1]}
                setImage={image => {
                  let newList = [...imageList]
                  newList.push(image)
                  setImageList(newList)
                  setMainImage(image)
                }}
                isSelected={selectedIndex === 1}
                onSelect={index => onSelectImage(index)}
                onDelete={index => onDeleteByIndex(index)}
              />
            )}
            {imageList.length > 1 && (
              <ImageCard
                index={2}
                image={imageList.length === 2 ? null : imageList[2]}
                setImage={image => {
                  let newList = [...imageList]
                  newList.push(image)
                  setImageList(newList)
                  setMainImage(image)
                }}
                isSelected={selectedIndex === 2}
                onSelect={index => onSelectImage(index)}
                onDelete={index => onDeleteByIndex(index)}
              />
            )}
            {imageList.length > 2 && (
              <ImageCard
                index={3}
                image={imageList.length === 3 ? null : imageList[3]}
                setImage={image => {
                  let newList = [...imageList]
                  newList.push(image)
                  setImageList(newList)
                  setMainImage(image)
                }}
                isSelected={selectedIndex === 3}
                onSelect={index => onSelectImage(index)}
                onDelete={index => onDeleteByIndex(index)}
              />
            )}
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
          <div className="flex gap-[5px] mt-[30px]">
            <div className={styles.fullfill}>Product Description</div> <div className={styles.asterisk}>*</div>
          </div>
          <div className="w-full mt-[15px]">
            <Textarea
              height={192}
              placeholder="Insert a description for your product"
              value={limit(description, 1000)}
              color={'var(--text-gray-200-color)'}
              label01="Max Characters 1000"
              label02={1000 - description.length === 1000 ? '' : `${1000 - description.length} Characters left`}
              onChange={value => setDescription(limit(value, 1000))}
            />
          </div>
          <div className="mt-[30px]">
            <div className="w-full flex gap-[5px] mb-[15px]">
              <div className={styles.fullfill}>
                Product Type <span>*</span>
              </div>
            </div>
            <ProductionListMenu
              width={600}
              label={productType.id === -1 ? 'Select a category that best describes this product' : productType.label}
              data={ProductType}
              selectedItem={productType}
              setSelectedItem={item => {
                setProductType(item)
              }}
            />
          </div>
          <div className="mt-[30px] mb-[200px]">
            <div className="w-full flex gap-[5px] mb-[15px]">
              <div className={styles.fullfill}>
                Shipping & Handling <span>*</span>
              </div>
            </div>
            <ProductionListMenu
              width={600}
              label={shipping.id === -1 ? 'Select a category that best describes this product' : shipping.label}
              data={ShippingList}
              selectedItem={shipping}
              setSelectedItem={item => {
                setShipping(item)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProductSection

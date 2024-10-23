import React, { useState, useEffect } from 'react'
import { useViewport } from 'utils'
import { validDigits } from 'utils/helpers'

// third party components
import Dropzone from 'react-dropzone'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import Lottie from 'lottie-react'

// image

// json
import ProductType from 'assets/json/creator-merch/product-type.json'
import ShippingList from 'assets/json/creator-merch/shipping-list.json'
import animationData from 'assets/lottery/upload-file.json'
import SizeList from 'assets/json/popular-size.json'
import ShoeSizeList from 'assets/json/shoe-size.json'

import ImageCard from './ImageCard'
import Input from 'components/Input'
import { limit } from 'utils/strings'
import Textarea from 'components/Input/Textarea'
import ProductionListMenu from 'components/Menu/ProductionListMenu'
import Alert from 'components/Alert'
import SizeSelectionMenu from 'components/Menu/SizeSelectionMenu'
import Switch from 'components/Switch'
import CountrySelect from 'components/Select/CountrySelect'
import { Country } from 'country-state-city'

// styles
import styles from './index.module.scss'

const MyProductSection = props => {
  const { productDetail, setProductDetail } = props
  const viewport = useViewport()

  const [productType, setProductType] = useState({ id: -1, label: '' })
  const [shipping, setShipping] = useState({ id: -1, label: '' })
  const [mainImage, setMainImage] = useState<any>(null)
  const [imageList, setImageList] = useState<any>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState([])
  const [sizeList, setSizeList] = useState([])
  const [shippingFee, setShippingFee] = useState('')
  const [interShippingFee, setInterShippingFee] = useState('')
  const [shippingSwitch, setShippingSwitch] = useState(false)
  const [country, setCountry] = useState(null)

  const onSelectImage = index => {
    if (index >= imageList.length) return
    setSelectedIndex(index)
    setMainImage(imageList[index])
  }

  const onDeleteByIndex = index => {
    let newList = [...imageList]
    newList.splice(index, 1)
    setImageList(newList)
    setProductAssetUrl(newList)
    if (newList.length > 0) {
      setSelectedIndex(0)
      setMainImage(newList[0])
    }
  }

  useEffect(() => {
    setProductDetail({ ...productDetail, shipping: ShippingList[0], sizes: [] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!productDetail) return

    let { snapshotAssetUrl, description, name, type, shipping } = productDetail

    let urls = []
    if (snapshotAssetUrl) {
      if (snapshotAssetUrl.front !== '') {
        urls.push(snapshotAssetUrl.front)
      }
      if (snapshotAssetUrl.back !== '') {
        urls.push(snapshotAssetUrl.back)
      }
      if (snapshotAssetUrl.right !== '') {
        urls.push(snapshotAssetUrl.right)
      }
      if (snapshotAssetUrl.left !== '') {
        urls.push(snapshotAssetUrl.left)
      }
      setImageList(urls)
      if (selectedIndex === -1) {
        setMainImage(urls[0])
        setSelectedIndex(0)
      }
    }
    if (name) setProductName(name)
    if (description) setDescription(description)
    if (type) setProductType(type)
    if (shipping) setShipping(shipping)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDetail])

  const setProductAssetUrl = newList => {
    let newAsset = {}

    newAsset = {
      front: newList.length > 0 ? newList[0] : '',
      back: newList.length > 1 ? newList[1] : '',
      right: newList.length > 2 ? newList[2] : '',
      left: newList.length > 3 ? newList[3] : '',
    }

    setProductDetail({ ...productDetail, snapshotAssetUrl: newAsset })
  }

  const handleSelectSize = index => {
    let array = [...sizeList]
    let checkedCount = 0
    array.map(item => {
      if (item.checked === true) {
        checkedCount++
      }
    })
    array[index].checked = !array[index].checked
    setSizeList(array)

    let sizes = []
    array.filter(item => item.checked === true).map(item => sizes.push(item.size))
    setProductDetail({ ...productDetail, sizes: sizes })
  }

  const handleSelectAll = selected => {
    let array = [...sizeList]

    array.map(item => {
      if (selected) item.checked = true
      else item.checked = false
    })
    setSizeList(array)

    let sizes = []
    array.filter(item => item.checked === true).map(item => sizes.push(item.size))
    setProductDetail({ ...productDetail, sizes: sizes })
  }

  return (
    <div className="w-full">
      <div className="w-full flex lg:flex-row flex-col gap-[20px] sm:gap-[72px] justify-between">
        <div className="lg:w-[45%] w-full">
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
                        setProductAssetUrl(newList)
                        setSelectedIndex(0)
                        setMainImage(newList[0])
                      } else {
                        setImageList([])
                        setProductAssetUrl([])
                      }
                    }}
                    onDropRejected={rejectedFiles => {
                      setAlertData([
                        {
                          id: 0,
                          title: 'Upload Failed!',
                          description: `File size is too large, size is limited to 10Mb.`,
                          type: 'failure',
                        },
                      ])
                      setShowAlert(true)

                      setImageList([])
                      setProductAssetUrl([])
                    }}
                    accept={{
                      'image/jpeg': [],
                      'image/png': [],
                    }}
                    maxFiles={4}
                    maxSize={10485760}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <section className={styles.dropzone}>
                        <div {...getRootProps()} className="mt-[-20px]">
                          <input {...getInputProps()} />
                          <div className="w-full flex justify-center">
                            <div className="w-[90px] h-[90px]">
                              <Lottie animationData={animationData} loop={true} />
                            </div>
                          </div>
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
          <div className="flex gap-[9px] sm:gap-[15px] lg:gap-[30px] mt-[32px] lg:mb-[32px] mb-[0px]">
            {imageList.length > 0 && (
              <ImageCard
                index={0}
                image={imageList[0]}
                setImage={image => {}}
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
                  if (!image) return
                  let newList = [...imageList]
                  newList.push(image)
                  setImageList(newList)
                  setProductAssetUrl(newList)
                  setSelectedIndex(1)
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
                  if (!image) return
                  let newList = [...imageList]
                  newList.push(image)
                  setImageList(newList)
                  setProductAssetUrl(newList)
                  setSelectedIndex(2)
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
                  setProductAssetUrl(newList)
                  setSelectedIndex(3)
                  setMainImage(image)
                }}
                isSelected={selectedIndex === 3}
                onSelect={index => onSelectImage(index)}
                onDelete={index => onDeleteByIndex(index)}
              />
            )}
          </div>
        </div>
        <div className="lg:w-[50%] w-full">
          <div className="flex gap-[5px] mb-[15px]">
            <div className={styles.fullfill}>Product Name</div> <div className={styles.asterisk}>*</div>
          </div>
          <div className="w-full mt-[15px]">
            <Input
              value={limit(productName, 40)}
              placeholder="Give your product name"
              label01="Max Characters 42"
              label02={40 - productName.length === 40 ? '' : `${40 - productName.length} Characters left`}
              onChange={value => {
                setProductName(limit(value, 40))
                setProductDetail({ ...productDetail, name: limit(value, 40) })
              }}
            />
          </div>
          <div className="flex gap-[5px] mt-[20px] sm:mt-[30px]">
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
              onChange={value => {
                setDescription(limit(value, 1000))
                setProductDetail({ ...productDetail, description: limit(value, 1000) })
              }}
            />
          </div>
          <div className="sm:mt-[30px] mt-[20px]">
            <div className="w-full flex gap-[5px] mb-[15px]">
              <div className={styles.fullfill}>
                Product Type <span>*</span>
              </div>
            </div>
            <ProductionListMenu
              // width={600}
              label={
                productType.id === -1
                  ? viewport === 'xs'
                    ? 'Select a category for this product'
                    : 'Select a category that best describes this product'
                  : productType.label
              }
              data={ProductType}
              selectedItem={productType}
              setSelectedItem={item => {
                setProductType(item)
                setProductDetail({ ...productDetail, type: item })

                if (item.id === 12) {
                  let array: any[] = []
                  ShoeSizeList.map(item => {
                    let object: any = item
                    object.checked = false
                    object.disabled = false
                    array.push(object)
                  })
                  setSizeList(array)
                } else if (item.id === 13) {
                  let array: any[] = []
                  SizeList.map(item => {
                    let object: any = item
                    object.checked = false
                    object.disabled = false
                    array.push(object)
                  })
                  setSizeList(array)
                }
              }}
            />
          </div>

          {(productType.id === 12 || productType.id === 13) && (
            <div className="mt-[20px] mb-[15px]">
              <div className="mb-[15px]">
                <div className={styles.fullfill}>
                  Available Sizes <span>*</span>
                </div>
              </div>
              <SizeSelectionMenu
                type={productType.id === 12 ? 'shoe' : 'normal'}
                categoryList={sizeList}
                handleSelectCategory={handleSelectSize}
                handleSelectAll={handleSelectAll}
              />
            </div>
          )}

          <div className="sm:mt-[30px] mt-[20px]">
            <div className="w-full flex justify-between items-center mb-[15px]">
              <div className={styles.fullfill}>Shipping&nbsp;&&nbsp;Handling</div>
              <Switch
                title=""
                description=""
                enabled={shippingSwitch}
                onChange={() => {
                  setShippingSwitch(!shippingSwitch)
                  if (shippingSwitch) {
                    setShipping(ShippingList[0])
                    setProductDetail({ ...productDetail, shipping: ShippingList[0] })
                  } else {
                    setShipping(ShippingList[1])
                    setProductDetail({ ...productDetail, shipping: ShippingList[1] })
                  }
                }}
              />
            </div>
            <div className={styles.shippingDesc}>
              Indicate if the buyer is responsible for additional shipping fees. If yes, enter flat rates for domestic
              and international shipping.
            </div>
            {/* <ProductionListMenu
              label={
                shipping.id === -1
                  ? viewport === 'xs'
                    ? 'Select whether shipping fees are included'
                    : 'Select whether shipping fees are included or not'
                  : shipping.label
              }
              data={ShippingList}
              selectedItem={shipping}
              setSelectedItem={item => {
                setShipping(item)
                setProductDetail({ ...productDetail, shipping: item })
              }}
            /> */}
          </div>

          {shipping.id === 1 && (
            <div className="mt-[30px]">
              <div className={styles.fullfill}>
                Shipping from <span>*</span>
              </div>
              <div className="mt-[15px]">
                <CountrySelect
                  data={Country.getAllCountries()}
                  selected={country}
                  onChange={item => {
                    setCountry(item)
                    setProductDetail({ ...productDetail, country: item })
                  }}
                  maxHeight="none"
                  placeholder="Select the country of origin for shipping"
                  style={styles.countrySelect}
                />
              </div>
            </div>
          )}

          {shipping.id === 1 && (
            <div className="mt-[30px]">
              <div className={styles.fullfill}>
                Domestic Shipping Fee <span>*</span>
              </div>
              <div className={`${styles.sellingArea} mt-[15px]`}>
                <div className={styles.dollar}>$</div>
                <input
                  className={styles.input}
                  value={shippingFee}
                  placeholder={'Set your selling price'}
                  onChange={event => {
                    setShippingFee(validDigits(event.target.value))
                    setProductDetail({ ...productDetail, shippingFee: validDigits(event.target.value) })
                  }}
                />
              </div>
            </div>
          )}
          {shipping.id === 1 && (
            <div className="mt-[30px]">
              <div className={styles.fullfill}>
                International Shipping Fee <span>*</span>
              </div>
              <div className={`${styles.sellingArea} mt-[15px]`}>
                <div className={styles.dollar}>$</div>
                <input
                  className={styles.input}
                  value={interShippingFee}
                  placeholder={'Set your selling price'}
                  onChange={event => {
                    setInterShippingFee(validDigits(event.target.value))
                    setProductDetail({ ...productDetail, interShippingFee: validDigits(event.target.value) })
                  }}
                />
              </div>
            </div>
          )}

          <div className="w-full h-[250px] lg:h-[200px]" />
        </div>
      </div>
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
    </div>
  )
}

export default MyProductSection

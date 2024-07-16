import React, { useState, useEffect, useMemo } from 'react'

// component
import ImageWithFoster from 'components/ImageWithFoster'
import Input from 'components/Input'
import { limit } from 'utils/strings'
import ProductionListMenu from 'components/Menu/ProductionListMenu'

// third party components
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

// json
import SaleList from 'assets/json/creator-merch/sale-list.json'
import MaxSupplyList from 'assets/json/creator-merch/max-supply-list.json'
import ReleaseDurationList from 'assets/json/creator-merch/release-duration-list.json'

// resources
import ArrowDownIcon from 'assets/icons/arrow-down-small.svg?component'

// styles
import styles from './index.module.scss'
import { useViewport } from 'utils'
import { getFirstUpperString, validDigits, validInteger } from 'utils/helpers'

const AdditionalDetails = props => {
  const { productDetail, step, setEnableNext, additionDetail, setAdditionDetail } = props
  const viewport = useViewport()

  const [assetUrls, setAssetUrls] = useState([])
  const [apparelUrl, setApparelUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saleMethod, setSaleMethod] = useState({ id: -1, label: '', type: '' })
  const [sellingPrice, setSellingPrice] = useState('')
  const [profit, setProfit] = useState(0)
  const [maxSupplyItem, setMaxSupplyItem] = useState(MaxSupplyList[0])
  const [limitedSupply, setLimitedSupply] = useState('')
  const [releaseDurationItem, setReleaseDurationItem] = useState(ReleaseDurationList[0])

  const [startType, setStartType] = useState('soon')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [days, setDays] = useState('')
  const [hours, setHours] = useState('24')
  const [day, setDay] = useState('')
  const [priceBase, setPriceBase] = useState(0)
  const [priceFB, setPriceFB] = useState(0)
  const [priceRight, setPriceRight] = useState(0)
  const [priceLeft, setPriceLeft] = useState(0)

  const CustomTimeInput = ({ date, value, onChange }) => {
    return (
      <input
        type="time"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ border: 'solid 1px rgba(#EFF0F6, 0.1)', cursor: 'pointer' }}
        className="!w-full h-full rounded-[9px] px-[10px] bg-transparent text-white flex-row-reverse"
      />
    )
  }

  useEffect(() => {
    let plusDays = Number(days)
    let plusHours = Number(hours)

    if (days === '') plusDays = 0
    if (hours === '') plusHours = 0

    const endTime = new Date(startDate)
    endTime.setTime(startDate.getTime() + plusDays * 24 * 60 * 60 * 1000 + plusHours * 60 * 60 * 1000)

    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayOfWeek = day[endTime.getDay()]
    setDay(dayOfWeek)
    setEndDate(endTime)
  }, [startDate, days, hours])

  useEffect(() => {
    if (title.length === 0) {
      setEnableNext(false)
      return
    }

    if (productDetail.product?.id === 0) {
      if (saleMethod.id === -1) {
        setEnableNext(false)
        return
      }

      if (saleMethod.id === 1 && profit <= 0) {
        setEnableNext(false)
        return
      }

      if (maxSupplyItem.id === 1 && (limitedSupply === '' || parseInt(limitedSupply) === 0)) {
        setEnableNext(false)
        return
      }
    } else {
      if (sellingPrice === '' || parseFloat(sellingPrice) <= 0) {
        setEnableNext(false)
        return
      }
    }

    if (releaseDurationItem.id === 1 && days === '' && hours === '') {
      setEnableNext(false)
      return
    }

    setEnableNext(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, saleMethod, profit, sellingPrice, maxSupplyItem, limitedSupply, releaseDurationItem, days, hours])

  useEffect(() => {
    setAdditionDetail({ ...additionDetail, name: title })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title])

  useEffect(() => {
    setAdditionDetail({ ...additionDetail, description })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description])

  useEffect(() => {
    setAdditionDetail({ ...additionDetail, selling_price: parseFloat(sellingPrice) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellingPrice])

  useEffect(() => {
    if (saleMethod.id === 0) {
      setAdditionDetail({
        ...additionDetail,
        sale_method: saleMethod.type,
        selling_price: priceBase + priceFB + priceRight + priceLeft,
      })
    } else {
      setAdditionDetail({ ...additionDetail, sale_method: saleMethod.type })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saleMethod])

  useEffect(() => {
    setAdditionDetail({ ...additionDetail, supply: parseInt(limitedSupply) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limitedSupply])

  useEffect(() => {
    setAdditionDetail({ ...additionDetail, sale_start_at: startDate })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate])

  useEffect(() => {
    if (releaseDurationItem.id === 1) setAdditionDetail({ ...additionDetail, sale_end_at: endDate })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate])

  useEffect(() => {
    if (releaseDurationItem.id === 0) setAdditionDetail({ ...additionDetail, sale_end_at: null })
    else setAdditionDetail({ ...additionDetail, sale_end_at: endDate })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [releaseDurationItem])

  useEffect(() => {
    let urls = []
    let { snapshotAssetUrl, selectedCard, technique, color, name, description } = productDetail
    if (productDetail.product?.id === 0) {
      setPriceBase(selectedCard.price[technique])
      setDescription(
        selectedCard.name +
          ' | ' +
          (technique === 'dtg' ? 'Direct-to-Garment' : 'Embroidery') +
          ' | ' +
          getFirstUpperString(color)
      )

      if (snapshotAssetUrl.front !== '') {
        urls.push(snapshotAssetUrl.front)
      }
      if (snapshotAssetUrl.back !== '') {
        urls.push(snapshotAssetUrl.back)
      }
      if (technique === 'dtg') {
        if (snapshotAssetUrl.front !== '' && snapshotAssetUrl.back !== '') setPriceFB(8.5)
      } else {
        if (snapshotAssetUrl.back !== '') setPriceFB(8.5)
      }

      if (snapshotAssetUrl.right !== '') {
        urls.push(snapshotAssetUrl.right)
        setPriceRight(7)
      }
      if (snapshotAssetUrl.left !== '') {
        urls.push(snapshotAssetUrl.left)
        setPriceLeft(7)
      }
      let assetUrl = []
      urls.map((url, index) => {
        if (index === 0) assetUrl.push({ id: index, url, selected: true })
        else assetUrl.push({ id: index, url, selected: false })
      })
      setAssetUrls(assetUrl)
      setApparelUrl(assetUrl[0].url)
    } else {
      setTitle(name)
      setDescription(description)
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
      let assetUrl = []
      urls.map((url, index) => {
        if (index === 0) assetUrl.push({ id: index, url, selected: true })
        else assetUrl.push({ id: index, url, selected: false })
      })
      setAssetUrls(assetUrl)
      setApparelUrl(assetUrl[0].url)
    }
  }, [productDetail])

  useEffect(() => {
    if (sellingPrice === '') return
    setProfit(parseFloat(sellingPrice) - (priceBase + priceFB + priceRight + priceLeft))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellingPrice])

  const selectAssetItem = item => {
    let urls = []
    assetUrls.map(asset => {
      if (asset.id === item.id) {
        urls.push({ id: asset.id, url: asset.url, selected: true })
      } else {
        urls.push({ id: asset.id, url: asset.url, selected: false })
      }
    })
    setAssetUrls(urls)
    setApparelUrl(item.url)
  }

  return (
    <div className="w-full lg:flex flex-col lg:flex-row gap-[50px] mt-[45px]">
      <div className="w-full lg:w-[46%]">
        <div className={styles.assetView}>
          <div className="w-[340px] h-[340px] sm:w-[450px] sm:h-[450px] ">
            <img src={apparelUrl} width={700} className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="w-full flex gap-[9px] sm:gap-[15px] lg:gap-[30px] mt-[30px] mb-[30px]">
          {assetUrls.map((item, index) => (
            <div
              key={index}
              className={item.selected ? styles.selectedItem : styles.deselectedItem}
              onClick={() => selectAssetItem(item)}
            >
              <div className="w-full h-full">
                <ImageWithFoster src={item.url} width={110} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {step === 3 &&
        (productDetail.product?.id === 0 ? (
          <div className="w-full lg:w-[49%]">
            <div className="w-full">
              <div className={styles.title}>Product Name</div>
              <div className={`mt-[8px] sm:mt-[15px] ${styles.reviewTitle}`}>{title}</div>
              <div className={`mt-[20px] sm:mt-[30px] ${styles.title}`}>Product & Design Details</div>
              <div className={`${styles.desc} mt-[10px]`}>{description}</div>
              <div className="w-full mt-[15px]">
                <div className={styles.firstRow}>
                  <div className={styles.sideText}>Base (includes front or back print)</div>
                  <div className={styles.price}>${priceBase}</div>
                </div>
                <div className={styles.secondRow}>
                  <div className={styles.sideText}>Additional front or back print</div>
                  <div className={styles.price}>{priceFB > 0 ? '$' + priceFB : 'N/A'}</div>
                </div>
                <div className={styles.firstRow}>
                  <div className={styles.sideText}>Right sleeve/wrist</div>
                  <div className={styles.price}>{priceRight > 0 ? '$' + priceRight : 'N/A'}</div>
                </div>
                <div className={styles.secondRow}>
                  <div className={styles.sideText}>Left sleeve/wrist</div>
                  <div className={styles.price}>{priceLeft > 0 ? '$' + priceLeft : 'N/A'}</div>
                </div>
              </div>
            </div>
            <div className="w-full mt-[20px] sm:mt-[30px]">
              <div className={styles.title}>Commision Details</div>
              <div className="w-full mt-[15px]">
                <div className={styles.firstRow}>
                  <div className={styles.sideText}>Method of Sale</div>
                  <div className={styles.price}>{saleMethod.id === 0 ? 'Edition Purchases' : 'Standalone'}</div>
                </div>
                <div className={styles.secondRow}>
                  <div className={styles.sideText}>Production Price</div>
                  <div className={styles.price}>${(priceBase + priceFB + priceRight + priceLeft).toFixed(2)}</div>
                </div>
                <div className={styles.firstRow}>
                  <div className={styles.sideText}>Selling Price</div>
                  <div className={styles.price}>
                    {saleMethod.id === 0 ? 'Production Price + Price of Edition' : '$' + sellingPrice}
                  </div>
                </div>
                <div className={styles.secondRow}>
                  <div className={styles.sideText}>Profit Per Unit</div>
                  <div className={styles.priceUnit}>
                    {saleMethod.id === 0 ? 'Price of Edition' : '$' + profit.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mt-[20px] sm:mt-[30px] mb-[100px]">
              <div className={styles.title}>Release Details</div>
              {saleMethod.id === 0 ? (
                <div className={`${styles.releaseDetail} mt-[15px]`}>
                  Once published, this merch item will appear on your store under &quot;Merch Editions.&quot; You can
                  activate it when listing an edition as a bonus for each purchase. The production cost will be added to
                  the listing price.
                </div>
              ) : (
                <div className="w-full mt-[15px]">
                  <div className={styles.firstRow}>
                    <div className={styles.sideText}>Supply</div>
                    <div className={styles.price}>{maxSupplyItem.id === 0 ? 'No Max' : 'Limited Supply'}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.sideText}>Max Supply</div>
                    <div className={styles.price}>{maxSupplyItem.id === 0 ? '∞' : limitedSupply}</div>
                  </div>
                  {maxSupplyItem.id === 1 && (
                    <div>
                      <div className={styles.firstRow}>
                        <div className={styles.sideText}>Release Date</div>
                        <div className={styles.price}>
                          {startType === 'soon'
                            ? 'Immediately'
                            : startDate.toLocaleDateString() + ' ' + startDate.toLocaleTimeString()}
                        </div>
                      </div>
                      <div className={styles.secondRow}>
                        <div className={styles.sideText}>Release Duration</div>
                        <div className={styles.price}>{releaseDurationItem.id === 0 ? '∞' : 'Limited'}</div>
                      </div>
                      <div className={styles.firstRow}>
                        <div className={styles.sideText}>Limited Duration</div>
                        <div className={styles.price}>
                          {releaseDurationItem.id === 0
                            ? '∞'
                            : days.length === 0
                            ? hours + ' hours'
                            : days + ' days' + ', ' + hours + ' hours'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /**************************** Product 2 *************************************/
          <div className="w-full lg:w-[49%]">
            <div className="w-full">
              <div className={styles.title}>Product Name</div>
              <div className={`mt-[15px] ${styles.reviewTitle}`}>{title}</div>
              <div className={`mt-[20px] ${styles.title}`}>Product Description</div>
              <div className={`${styles.desc} mt-[10px]`}>{description}</div>
              <div className={`mt-[20px] ${styles.title}`}>Product Type</div>
              <div className={`${styles.desc} mt-[10px]`}>{productDetail.type.label}</div>
              <div className={`mt-[20px] ${styles.title}`}>Shipping & Handling</div>
              <div className={`${styles.desc} mt-[10px]`}>{productDetail.shipping.label}</div>
            </div>
            <div className="w-full mt-[20px]">
              <div className={styles.title}>Commision Details</div>
              <div className="w-full mt-[15px]">
                <div className={styles.firstRow}>
                  <div className={styles.sideText}>Selling Price</div>
                  <div className={styles.price}>${sellingPrice}</div>
                </div>
                <div className={styles.secondRow}>
                  <div className={styles.sideText}>Platform Fee (5%)</div>
                  <div className={styles.price}>${(parseFloat(sellingPrice) * 0.05).toFixed(2)}</div>
                </div>
                <div className={styles.firstRow}>
                  <div className={styles.sideText}>Total</div>
                  <div className={styles.price}>
                    ${(parseFloat(sellingPrice) + parseFloat(sellingPrice) * 0.05).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mt-[20px] mb-[100px]">
              <div className={styles.title}>Release Details</div>
              <div className="w-full mt-[15px]">
                <div>
                  <div className={styles.firstRow}>
                    <div className={styles.sideText}>Supply</div>
                    <div className={styles.price}>{maxSupplyItem.id === 0 ? 'No Max' : 'Limited Supply'}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.sideText}>Max Supply</div>
                    <div className={styles.price}>{maxSupplyItem.id === 0 ? '∞' : limitedSupply}</div>
                  </div>

                  <div className={styles.firstRow}>
                    <div className={styles.sideText}>Release Date</div>
                    <div className={styles.price}>
                      {startType === 'soon'
                        ? 'Immediately'
                        : startDate.toLocaleDateString() + ' ' + startDate.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.sideText}>Release Duration</div>
                    <div className={styles.price}>{releaseDurationItem.id === 0 ? '∞' : 'Limited'}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.sideText}>Limited Duration</div>
                    <div className={styles.price}>
                      {releaseDurationItem.id === 0
                        ? '∞'
                        : days.length === 0
                        ? hours + ' hours'
                        : days + ' days' + ', ' + hours + ' hours'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

      {step === 2 &&
        (productDetail.product?.id === 0 ? (
          <div className="w-full lg:w-[49%] pb-[150px] lg:pb-[200px]">
            <div className={styles.title}>
              Product Name <span>*</span>
            </div>
            <div className="mt-[15px]">
              <Input
                value={limit(title, 32)}
                placeholder="Insert a name for your product"
                label01="Max Characters 40"
                label02={40 - title.length === 40 ? '' : `${40 - title.length} Characters left`}
                onChange={value => setTitle(limit(value, 40))}
              />
            </div>
            <div className="w-full sm:mt-[30px] mt-[20px]">
              <div className={styles.title}>Product & Design Details</div>
              <div className={`${styles.desc} mt-[10px]`}>{description}</div>
              <div className="w-full mt-[15px]">
                <div className={styles.firstRow}>
                  <div className={styles.sideText}>Base (includes front or back print)</div>
                  <div className={styles.price}>${priceBase}</div>
                </div>
                <div className={styles.secondRow}>
                  <div className={styles.sideText}>Additional front or back print</div>
                  <div className={styles.price}>{priceFB > 0 ? '$' + priceFB : 'N/A'}</div>
                </div>
                <div className={styles.firstRow}>
                  <div className={styles.sideText}>Right sleeve/wrist</div>
                  <div className={styles.price}>{priceRight > 0 ? '$' + priceRight : 'N/A'}</div>
                </div>
                <div className={styles.secondRow}>
                  <div className={styles.sideText}>Left sleeve/wrist</div>
                  <div className={styles.price}>{priceLeft > 0 ? '$' + priceLeft : 'N/A'}</div>
                </div>
              </div>
              <div className="w-full mt-[15px] flex justify-between px-[0px] lg:px-[16px]">
                <div className={styles.production}>Production Price</div>
                <div className={styles.priceUnit}>${(priceBase + priceFB + priceRight + priceLeft).toFixed(2)}</div>
              </div>
            </div>
            <div className="w-full sm:mt-[30px] mt-[20px]">
              <div className={styles.title}>Method of Sale</div>
              <div className="mt-[15px]">
                <ProductionListMenu
                  label={saleMethod.id === -1 ? 'How would you like this item to be purchased' : saleMethod.label}
                  data={SaleList}
                  selectedItem={saleMethod}
                  setSelectedItem={item => {
                    setSaleMethod(item)
                  }}
                />
              </div>
            </div>
            {saleMethod.id === 0 && (
              <div className={styles.includePurchase}>
                Once published, this merch item will appear on your store under &quot;Merch Editions.&quot; You can
                activate it when listing an edition as a bonus for each purchase. The production cost will be added to
                the listing price.
              </div>
            )}
            {saleMethod.id === 1 && (
              <div className="w-full sm:mt-[30px] mt-[20px]">
                <div className={styles.title}>
                  Selling Price <span>*</span>
                </div>
                <div className={`${styles.sellingArea} mt-[15px]`}>
                  <div className={styles.dollar}>$</div>
                  <input
                    className={styles.input}
                    value={sellingPrice}
                    placeholder={'Set your selling price'}
                    onChange={event => {
                      setSellingPrice(validDigits(event.target.value))
                    }}
                  />
                </div>
                <div className="w-full flex justify-between mt-[15px]">
                  <div className={styles.production}>Your Profit</div>
                  <div
                    className={`${styles.prodPrice} ${
                      profit >= 0 || sellingPrice === '' ? styles.positive : styles.negotive
                    }`}
                  >
                    {sellingPrice === ''
                      ? '$ ---'
                      : profit > 0
                      ? '$' + profit.toFixed(2)
                      : '-$' + Math.abs(profit).toFixed(2)}
                  </div>
                </div>
                {sellingPrice !== '' && profit < 0 && (
                  <div className={styles.negotiveAlert}>
                    The selling price you entered is below the cost of production. Please enter a value higher than the
                    production price.
                  </div>
                )}

                <div className="sm:mt-[30px] mt-[20px]">
                  <div className={styles.title}>Max Supply (optional)</div>
                  <div className="mt-[15px]">
                    <ProductionListMenu
                      label={maxSupplyItem.id === -1 ? 'Limited Supply' : maxSupplyItem.label}
                      data={MaxSupplyList}
                      selectedItem={maxSupplyItem}
                      setSelectedItem={item => {
                        setMaxSupplyItem(item)
                      }}
                    />
                  </div>
                  {maxSupplyItem.id === 1 && (
                    <div className="w-full sm:mt-[30px] mt-[20px]">
                      <div className={styles.title}>
                        Limited Supply <span>*</span>
                      </div>
                      <div className="mt-[15px]">
                        <Input
                          value={limitedSupply}
                          placeholder="Set the total supply for this apparel item"
                          onChange={value => {
                            setLimitedSupply(validInteger(value))
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="w-full sm:mt-[30px] mt-[20px]">
                    <div className={styles.title}>
                      Release Date <span>*</span>
                    </div>
                  </div>
                  <div className="w-full flex justify-between sm:justify-normal sm:gap-[112px]">
                    <div
                      className={`flex items-center ${
                        viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-2' : 'gap-4'
                      }`}
                    >
                      <input
                        className={styles.radio}
                        type="radio"
                        id="reserve"
                        checked={startType === 'soon'}
                        onChange={() => {
                          setStartDate(new Date())
                          setStartType('soon')
                        }}
                      />
                      <div
                        className={styles.radioText}
                        onClick={() => {
                          setStartDate(new Date())
                          setStartType('soon')
                        }}
                      >
                        Immediately
                      </div>
                    </div>
                    <div
                      className={`flex items-center z-10001 ${
                        viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-2' : 'gap-4'
                      }`}
                    >
                      <input
                        className={styles.radio}
                        type="radio"
                        id="reserve"
                        checked={startType === 'later'}
                        onChange={() => {
                          setStartType('later')
                        }}
                      />
                      <div>
                        <div className="w-full startAuctionDatePicker">
                          <div className="relative">
                            <DatePicker
                              selected={startDate}
                              onChange={date => {
                                setStartDate(date)
                              }}
                              dateFormat={
                                viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                                  ? 'MM/dd/yyyy'
                                  : 'MM/dd/yyyy h:mm aa'
                              }
                              formatWeekDay={nameOfDay => nameOfDay.substr(0, 3)}
                              minDate={moment().toDate()}
                              showTimeInput
                              timeInputLabel=""
                              className={styles.datePicker}
                              disabled={startType === 'soon'}
                              customTimeInput={<CustomTimeInput date={null} value={null} onChange={null} />}
                            />
                            <div className="absolute top-[20px] right-4">
                              <ArrowDownIcon alt="" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sm:mt-[30px] mt-[20px]">
                    <div className={styles.title}>Release Duration (optional)</div>
                    <div className="mt-[15px]">
                      <ProductionListMenu
                        label={releaseDurationItem.id === -1 ? 'Limited Supply' : releaseDurationItem.label}
                        data={ReleaseDurationList}
                        selectedItem={releaseDurationItem}
                        setSelectedItem={item => {
                          setReleaseDurationItem(item)
                        }}
                      />
                    </div>
                  </div>
                  {releaseDurationItem.id === 1 && (
                    <div className="w-full sm:mt-[30px] mt-[20px]">
                      <div className={styles.title}>
                        Limited Duration <span>*</span>
                      </div>
                      <div className="mt-[15px] w-full flex gap-5">
                        <div className="w-[170px] flex justify-start items-end gap-[10px]">
                          <Input
                            value={days}
                            placeholder="0"
                            backgroundColor={'rgba(var(--main-bg-color-rgb), 0.05)'}
                            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                            width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '75px' : '122px'}
                            fullWidth
                            borderColor="transparent"
                            borderRadius="9px"
                            min={0}
                            onChange={value => {
                              let days = validDigits(value)
                              if (days < 0) {
                                setDays('')
                              } else {
                                setDays(days)
                              }
                            }}
                          />
                          <div className={styles.dateFont}>Days</div>
                        </div>
                        <div className="w-[170px] flex justify-start items-end gap-[10px]">
                          <Input
                            value={hours}
                            placeholder="0"
                            backgroundColor={'rgba(var(--main-bg-color-rgb), 0.05)'}
                            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                            width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '75px' : '122px'}
                            fullWidth
                            borderColor="transparent"
                            borderRadius="9px"
                            min={0}
                            onChange={value => {
                              let hours = validDigits(value)
                              if (hours < 0) {
                                setHours('')
                              } else {
                                setHours(hours)
                              }
                            }}
                          />
                          <div className={styles.dateFont}>Hours</div>
                        </div>
                      </div>
                      <div className="mt-2 w-full text-start">
                        <div className={styles.label}>
                          The release is due to end&nbsp;
                          <span className={styles.dateLabel}>
                            {day}
                            {', '}
                            {endDate.toLocaleDateString()}&nbsp;
                          </span>
                          (in your local time)
                          {viewport !== 'xs' && viewport !== 'sm' && viewport !== 'md' && '(in your local time)'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full lg:w-[49%] mb-[200px]">
            <div className={styles.title}>
              Selling Price <span>*</span>
            </div>
            <div className={`${styles.sellingArea} mt-[15px]`}>
              <div className={styles.dollar}>$</div>
              <input
                className={styles.input}
                value={sellingPrice}
                placeholder={'Set your selling price'}
                onChange={event => {
                  setSellingPrice(validDigits(event.target.value))
                }}
              />
            </div>

            <div className="sm:mt-[30px] mt-[20px]">
              <div className={styles.title}>Max Supply (optional)</div>
              <div className="mt-[15px]">
                <ProductionListMenu
                  label={maxSupplyItem.id === -1 ? 'Limited Supply' : maxSupplyItem.label}
                  data={MaxSupplyList}
                  selectedItem={maxSupplyItem}
                  setSelectedItem={item => {
                    setMaxSupplyItem(item)
                  }}
                />
              </div>
              {maxSupplyItem.id === 1 && (
                <div className="w-full mt-[30px]">
                  <div className={styles.title}>
                    Limited Supply <span>*</span>
                  </div>
                  <div className="mt-[15px]">
                    <Input
                      value={limitedSupply}
                      placeholder="Set the total supply for this apparel item"
                      onChange={value => {
                        setLimitedSupply(validInteger(value))
                      }}
                    />
                  </div>
                </div>
              )}
              <div className="w-full mt-[30px]">
                <div className={styles.title}>
                  Release Date <span>*</span>
                </div>
              </div>
              <div className="w-full flex justify-between sm:justify-normal sm:gap-[112px]">
                <div
                  className={`flex items-center ${
                    viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-2' : 'gap-4'
                  }`}
                >
                  <input
                    className={styles.radio}
                    type="radio"
                    id="reserve"
                    checked={startType === 'soon'}
                    onChange={() => {
                      setStartDate(new Date())
                      setStartType('soon')
                    }}
                  />
                  <div
                    className={styles.radioText}
                    onClick={() => {
                      setStartDate(new Date())
                      setStartType('soon')
                    }}
                  >
                    Immediately
                  </div>
                </div>
                <div
                  className={`flex items-center z-10001 ${
                    viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'gap-2' : 'gap-4'
                  }`}
                >
                  <input
                    className={styles.radio}
                    type="radio"
                    id="reserve"
                    checked={startType === 'later'}
                    onChange={() => {
                      setStartType('later')
                    }}
                  />
                  <div>
                    <div className="w-full startAuctionDatePicker">
                      <div className="relative">
                        <DatePicker
                          selected={startDate}
                          onChange={date => {
                            setStartDate(date)
                          }}
                          dateFormat={
                            viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                              ? 'MM/dd/yyyy'
                              : 'MM/dd/yyyy h:mm aa'
                          }
                          formatWeekDay={nameOfDay => nameOfDay.substr(0, 3)}
                          minDate={moment().toDate()}
                          showTimeInput
                          timeInputLabel=""
                          className={styles.datePicker}
                          disabled={startType === 'soon'}
                          customTimeInput={<CustomTimeInput date={null} value={null} onChange={null} />}
                        />
                        <div className="absolute top-[20px] right-4">
                          <ArrowDownIcon alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-[30px]">
                <div className={styles.title}>Release Duration (optional)</div>
                <div className="mt-[15px]">
                  <ProductionListMenu
                    label={releaseDurationItem.id === -1 ? 'Limited Supply' : releaseDurationItem.label}
                    data={ReleaseDurationList}
                    selectedItem={releaseDurationItem}
                    setSelectedItem={item => {
                      setReleaseDurationItem(item)
                    }}
                  />
                </div>
              </div>
              {releaseDurationItem.id === 1 && (
                <div className="w-full mt-[30px]">
                  <div className={styles.title}>
                    Limited Duration <span>*</span>
                  </div>
                  <div className="mt-[15px] w-full flex gap-5">
                    <div className="w-[170px] flex justify-start items-end gap-[10px]">
                      <Input
                        value={days}
                        placeholder="0"
                        backgroundColor={'rgba(var(--main-bg-color-rgb), 0.05)'}
                        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                        width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '75px' : '122px'}
                        fullWidth
                        borderColor="transparent"
                        borderRadius="9px"
                        min={0}
                        onChange={value => {
                          let days = validDigits(value)
                          if (days < 0) {
                            setDays('')
                          } else {
                            setDays(days)
                          }
                        }}
                      />
                      <div className={styles.dateFont}>Days</div>
                    </div>
                    <div className="w-[170px] flex justify-start items-end gap-[10px]">
                      <Input
                        value={hours}
                        placeholder="0"
                        backgroundColor={'rgba(var(--main-bg-color-rgb), 0.05)'}
                        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '35px' : '40px'}
                        width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '75px' : '122px'}
                        fullWidth
                        borderColor="transparent"
                        borderRadius="9px"
                        min={0}
                        onChange={value => {
                          let hours = validDigits(value)
                          if (hours < 0) {
                            setHours('')
                          } else {
                            setHours(hours)
                          }
                        }}
                      />
                      <div className={styles.dateFont}>Hours</div>
                    </div>
                  </div>
                  <div className="mt-2 w-full text-start">
                    <div className={styles.label}>
                      The release is due to end&nbsp;
                      <span className={styles.dateLabel}>
                        {day}
                        {', '}
                        {endDate.toLocaleDateString()}&nbsp;
                      </span>
                      {viewport !== 'xs' && viewport !== 'sm' && viewport !== 'md' && '(in your local time)'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  )
}

export default AdditionalDetails

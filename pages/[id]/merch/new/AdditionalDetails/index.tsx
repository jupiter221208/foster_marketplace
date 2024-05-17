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
import { validDigits } from 'utils/helpers'

const AdditionalDetails = props => {
  const { productDetail } = props
  const viewport = useViewport()

  const [assetUrls, setAssetUrls] = useState([])
  const [apparelUrl, setApparelUrl] = useState('')
  const [title, setTitle] = useState('')
  const [saleMethod, setSaleMethod] = useState({ id: -1, label: '' })
  const [sellingPrice, setSellingPrice] = useState('')
  const [maxSupplyItem, setMaxSupplyItem] = useState(MaxSupplyList[0])
  const [limitedSupply, setLimitedSupply] = useState('')
  const [releaseDurationItem, setReleaseDurationItem] = useState(ReleaseDurationList[0])

  const [startType, setStartType] = useState('soon')
  const [startDate, setStartDate] = useState(new Date())
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
        style={{ border: 'solid 1px rgba(#EFF0F6, 0.1)' }}
        className="!w-full h-full rounded-[9px] px-[10px] bg-transparent text-white flex-row-reverse"
      />
    )
  }

  const endDate = useMemo(() => {
    let plusDays = Number(days)
    let plusHours = Number(hours)

    if (days === '') plusDays = 0
    if (hours === '') plusHours = 0

    const endDate = new Date(startDate)
    endDate.setTime(startDate.getTime() + plusDays * 24 * 60 * 60 * 1000 + plusHours * 60 * 60 * 1000)

    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayOfWeek = day[endDate.getDay()]
    setDay(dayOfWeek)
    return endDate
  }, [startDate, days, hours])

  useEffect(() => {
    let urls = []
    let { snapshotAssetUrl, selectedCard, technique } = productDetail

    setPriceBase(selectedCard.price[technique])

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
  }, [productDetail])

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
    <div className="w-full flex gap-[50px] mt-[45px]">
      <div className="w-[46%]">
        <div className={styles.assetView}>
          <div className="w-[450px] h-[450px]">
            <ImageWithFoster src={apparelUrl} width={700} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="w-full flex gap-[30px] mt-[30px] mb-[30px]">
          {assetUrls.map((item, index) => (
            <div
              key={index}
              className={item.selected ? styles.selectedItem : styles.deselectedItem}
              onClick={() => selectAssetItem(item)}
            >
              <div className="w-[110px] h-[110px]">
                <ImageWithFoster src={item.url} width={110} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-[49%]">
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
        <div className="w-full mt-[30px]">
          <div className={styles.title}>Additional Details</div>
          <div className={`${styles.desc} mt-[10px]`}>Unisex Premium Hoodie | Cotton Heritage M2580 | White</div>
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
          <div className="w-full mt-[15px] flex justify-between px-[16px]">
            <div className={styles.production}>Production Price</div>
            <div className={styles.prodPrice}>${priceBase + priceFB + priceRight + priceLeft}</div>
          </div>
        </div>
        <div className="w-full mt-[30px]">
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
        {saleMethod.id === 1 && (
          <div className="w-full mt-[30px] mb-[200px]">
            <div className={styles.title}>
              Selling Price <span>*</span>
            </div>
            <div className={`${styles.sellingArea} mt-[15px]`}>
              <div className={styles.dollar}>$</div>
              <input
                className={styles.input}
                value={sellingPrice}
                placeholder={'Set your selling price'}
                onChange={event => setSellingPrice(event.target.value)}
              />
            </div>
            <div className="w-full flex justify-between mt-[15px]">
              <div className={styles.production}>Your Profit</div>
              <div className={styles.prodPrice}>$35.95</div>
            </div>
            <div className="mt-[30px]">
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
                      onChange={value => setLimitedSupply(value)}
                    />
                  </div>
                  <div className="w-full mt-[30px]">
                    <div className={styles.title}>
                      Release Date <span>*</span>
                    </div>
                  </div>
                  <div className="w-full flex gap-[112px]">
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
                        onChange={() => setStartType('later')}
                      />
                      <div>
                        <div className="w-full startAuctionDatePicker">
                          <div className="relative">
                            <DatePicker
                              selected={startDate}
                              onChange={date => setStartDate(date)}
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
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdditionalDetails

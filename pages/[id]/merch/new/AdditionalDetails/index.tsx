import React, { useState, useEffect } from 'react'

// component
import ImageWithFoster from 'components/ImageWithFoster'
import Input from 'components/Input'
import { limit } from 'utils/strings'
import ProductionListMenu from 'components/Menu/ProductionListMenu'

// json
import SaleList from 'assets/json/creator-merch/sale-list.json'

// styles
import styles from './index.module.scss'

const AdditionalDetails = props => {
  const { productDetail } = props
  const [assetUrls, setAssetUrls] = useState([])
  const [apparelUrl, setApparelUrl] = useState('')
  const [title, setTitle] = useState('')
  const [saleMethod, setSaleMethod] = useState({ id: -1, label: '' })

  useEffect(() => {
    let urls = []
    let sanpshots = productDetail.snapshotAssetUrl
    if (sanpshots.front !== '') urls.push(sanpshots.front)
    if (sanpshots.back !== '') urls.push(sanpshots.back)
    if (sanpshots.right !== '') urls.push(sanpshots.right)
    if (sanpshots.left !== '') urls.push(sanpshots.left)
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
      <div className="w-[760px]">
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
      <div className="w-full">
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
              <div className={styles.price}>$39.99</div>
            </div>
            <div className={styles.secondRow}>
              <div className={styles.sideText}>Additional front or back print</div>
              <div className={styles.price}>$8.50</div>
            </div>
            <div className={styles.firstRow}>
              <div className={styles.sideText}>Right sleeve/wrist</div>
              <div className={styles.price}>$7.00</div>
            </div>
            <div className={styles.secondRow}>
              <div className={styles.sideText}>Left sleeve/wrist</div>
              <div className={styles.price}>$7.00</div>
            </div>
          </div>
          <div className="w-full mt-[15px] flex justify-between px-[16px]">
            <div className={styles.production}>Production Price</div>
            <div className={styles.prodPrice}>$62.49</div>
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
      </div>
    </div>
  )
}

export default AdditionalDetails

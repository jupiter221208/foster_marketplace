import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useViewport } from 'utils'
import { useRouter } from 'next/router'

//components
import ArtistLayout from 'components/Layout/ArtistLayout'

// json
import ProductList from 'assets/json/creator-merch/product-list.json'

// styles
import styles from './index.module.scss'

import ProductionListMenu from 'components/Menu/ProductionListMenu'
import FosterProductSection from 'components/pages/MerchProduct/FosterProductSection'
import MyProductSection from 'components/pages/MerchProduct/MyProductSection'

const ProductDetails = props => {
  const { productDetail, setProductDetail } = props
  const router = useRouter()
  const viewport = useViewport()
  const [product, setProduct] = useState({ id: -1, label: '' })
  const [fosterCard, setFosterCard] = useState(null)
  const dispatch = useDispatch()
  const backClicked = useSelector(state => (state as any).backBtnClicked)

  useEffect(() => {
    if (product.id === -1) {
      dispatch({ type: 'set', backBtnClicked: false })
      let path = window.location.href
      router.push(path.substring(0, path.lastIndexOf('/')))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backClicked])

  useEffect(() => {
    if (productDetail) {
      setProduct(productDetail.product)
    }
  }, [productDetail])

  return (
    <div className="w-full">
      {!productDetail?.selectedCard && fosterCard === null && (
        <div className="g-container w-full mt-[110px] lg:mt-[150px]">
          <div className={styles.setupText}>
            Easily setup your own merch store. You can either choose to have Foster manage the production and
            fulfillment of your merch, or you can choose to handle it.
          </div>
        </div>
      )}

      {!productDetail?.selectedCard && fosterCard === null && (
        <div className="g-container lg:mt-[27px] mt-[8px] sm:mt-[20px] lg:mt-[10px]">
          <div className="w-full lg:flex hidden gap-[5px] mb-[15px]">
            <div className={styles.fullfill}>Production & Fulfillment</div>
          </div>

          <ProductionListMenu
            label={
              product.id === -1
                ? viewport === 'xs' || viewport === 'md' || viewport === 'sm'
                  ? 'Select production and fulfillment'
                  : 'Select who will handle production and fulfillment'
                : product.label
            }
            width={viewport === 'xs' || viewport === 'md' || viewport === 'sm' ? 343 : 600}
            data={ProductList}
            selectedItem={product}
            setSelectedItem={item => {
              setProduct(item)
              if (item.id !== product.id) setProductDetail(null)
            }}
          />
        </div>
      )}

      {product.id === 0 && (
        <div className="">
          {!productDetail?.selectedCard && fosterCard === null && (
            <div className="g-container mt-[30px] w-full flex gap-[5px] mb-[10px]">
              <div className={styles.fullfill}>Select Apparel Item</div>
            </div>
          )}
          {!productDetail?.selectedCard && fosterCard === null && (
            <div className="g-container">
              <div className={styles.chooseBase}>Choose a base to begin designing</div>
            </div>
          )}
          <div className="lg:mt-[30px] mt-[15px]">
            <FosterProductSection
              productDetail={productDetail}
              setProductDetail={detail => setProductDetail({ ...detail, product })}
              setFosterCard={item => setFosterCard(item)}
            />
          </div>
        </div>
      )}

      {product.id === 1 && (
        <div className="g-container mt-[30px] lg:mt-[30px]">
          <MyProductSection
            productDetail={productDetail}
            setProductDetail={detail => setProductDetail({ ...detail, product })}
          />
        </div>
      )}
    </div>
  )
}

export default ProductDetails

ProductDetails.getLayout = function getLayout(page) {
  return <ArtistLayout>{page}</ArtistLayout>
}

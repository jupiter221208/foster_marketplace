import React, { useState, useEffect } from 'react'

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
  const { productDetail, setProductDetail, scrollToBottom } = props
  const [product, setProduct] = useState({ id: -1, label: '' })

  useEffect(() => {
    if (productDetail) {
      setProduct(productDetail.product)
    }
  }, [productDetail])

  return (
    <div className="w-full">
      <div className="w-full mt-[40px]">
        <div className={styles.setupText}>
          Easily setup your own merch store. You can either choose to have Foster manage the production and fulfillment
          of your merch, or you can choose to handle it.
        </div>
      </div>
      <div className="mt-[27px]">
        <div className="w-full flex gap-[5px] mb-[15px]">
          <div className={styles.fullfill}>Production & Fulfillment</div>
        </div>
        <ProductionListMenu
          label={product.id === -1 ? 'Select who will handle production and fulfillment' : product.label}
          data={ProductList}
          selectedItem={product}
          setSelectedItem={item => {
            setProduct(item)
          }}
        />
      </div>
      {product.id === 0 && (
        <div className="mt-[32px]">
          <div className="w-full flex gap-[5px] mb-[10px]">
            <div className={styles.fullfill}>Select Apparel Item</div>
          </div>
          <div className={styles.chooseBase}>Choose a base to begin designing</div>
          <div className="mt-[30px]">
            <FosterProductSection
              productDetail={productDetail}
              setProductDetail={detail => setProductDetail({ ...detail, product })}
            />
          </div>
        </div>
      )}
      {product.id === 1 && (
        <div className="mt-[27px]">
          <MyProductSection />
        </div>
      )}
    </div>
  )
}

export default ProductDetails

ProductDetails.getLayout = function getLayout(page) {
  return <ArtistLayout>{page}</ArtistLayout>
}
